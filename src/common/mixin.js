import {debounce} from "./utils";

export const itemListenerMixin ={
  data(){
    return{
      itemImgListeren:null
    }
  },
  mounted(){
    let newRefresh = debounce(this.$refs.scroll.refresh,100)
    this.itemImgListeren = ()=>{
      newRefresh()
    }
    this.$bus.$on('itemImgLoad',this.itemImgListeren)
  }
}
