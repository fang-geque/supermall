<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends" />
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  import {getHomeMultidata,getHomeGoods} from "network/home";
  import {debounce} from "common/utils";
  import {itemListenerMixin} from "common/mixin";

  export default {
    name: "Home",
    components:{
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    mixins:[itemListenerMixin],
    data(){
      return{
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]},
        },
        currentType:'pop',
        isShowBackTop:false,
        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0,
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    destroyed(){
      console.log('home destroyed')
    },
    activated(){
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated(){
      //1.保存Y值
      this.saveY=this.$refs.scroll.getScrollY()

      //2.取消全局事件的监听
      this.$bus.$off('itemImgLoad',this.itemImgListeren)
    },

    created() {
      //1.请求多个数据
      this.getHomeMultidata()

      //2.请求商品数据
      // let type = ['pop','new','sell']
      // type.forEach(function (value) {
      //   this.getHomeGoods(value)
      // })
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    methods:{
      /**
       *事件监听相关的方法
       */

      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break;
          case 2:
            this.currentType = 'sell'
            break
        }
        if(this.$refs.tabControl1 !==undefined) {
          this.$refs.tabControl1.currentIndex = index
          this.$refs.tabControl2.currentIndex = index
        }
      },
      backClick(){
         this.$refs.scroll.scrollTo(0,0,500)
      },
      contentScroll(position){
         //1.判断backTop是否显示
         -position.y>800?this.isShowBackTop=true:this.isShowBackTop=false

        //2.决定tabControl是否吸顶
        this.isTabFixed = (-position.y)>this.tabOffsetTop
      },
      loadMore(){
        // console.log('上拉加载');
        this.getHomeGoods(this.currentType)
        // this.$refs.scroll.scroll.refresh()
      },
      swiperImageLoad(){
         this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },

      /**
       * 网络请求相关方法
       */
      //1.请求多个数据
      getHomeMultidata(){
        getHomeMultidata().then(res=>{
          // console.log(res);
          // this.result=res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        });
      },
      //2.请求商品数据
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res=>{
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page+=1

          //完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home{
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color:#fff;
    position: relative;
    z-index: 9;

    /*再使用原生滚动时*/
    /*position: fixed;*/
    /*left:0;*/
    /*right: 0;*/
    /*top:0;*/
    /*z-index: 9;*/
  }

  /*.tab-control{*/
  /*  position: sticky;*/
  /*  top:44px;*/
  /*  z-index: 9;*/
  /*}*/

  .content{
    position: absolute;
    top:44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control{
    position: relative;
    z-index: 9;
  }

  /*.content{*/
  /*  height: calc(100% - 49px);*/
  /*  overflow: hidden;*/
  /*}*/
</style>
