<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <home-swiper :banners="banners"></home-swiper>
    <recommend-view :recommends="recommends" />
    <feature-view></feature-view>
    <tab-control class="tab-control"
                 :titles="['流行','新款','精选']"
                 @tabClick="tabClick"></tab-control>
    <goods-list :goods="showGoods"></goods-list>

    <ul>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
      <li>列表1</li>
    </ul>
  </div>
</template>

<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";

  import {getHomeMultidata,getHomeGoods} from "network/home";


  export default {
    name: "Home",
    components:{
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList
    },
    data(){
      return{
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]},
        },
        currentType:'pop'
      }
    },
    created() {
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
       *是将监听相关的方法
       */
       tabClick(index){
        // switch (index) {
        //   case 0:
        //     this.currentType = 'pop'
        //     break
        //   case 1:
        //     this.currentType = 'new'
        //     break;
        //   case 2:
        //     this.currentType = 'sell'
        //     break
        // }
        let tabCtype = ['pop','new','sell']
        this.currentType = tabCtype[index]
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
          // console.log(res);
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page+=1
        })
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    }
  }
</script>

<style scoped>
  #home{
    padding-top: 44px;
  }
  .home-nav{
    background-color: var(--color-tint);
    color:#fff;

    position: fixed;
    left:0;
    right: 0;
    top:0;
    z-index: 9;
  }

  .tab-control{
    position: sticky;
    top:44px;
    z-index: 9;
  }
</style>
