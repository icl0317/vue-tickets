<template>
  <div id="app" v-cloak >
    <transition :name="slideMode">
      <!-- <keep-alive></keep-alive>  @touchmove.prevent-->
        <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      slideMode: "slide-in"
    };
  },
  watch: {
    $route: function(to, from) {
      //平级跳转不加动画
      if(from.meta.deepPath == to.meta.deepPath){
        this.slideMode='';
        return;
      }
  
      if (from.meta.deepPath > to.meta.deepPath) {
        //说明返回上一步
        this.slideMode = "slide-out";
      }else{
        this.slideMode = "slide-in";
      }
    }
  }
};
</script>
<style lang="less">
@import "./style/common";
@import "./style/font-icons/iconfont.css";
[v-cloak]{ display:none}
.slide-in-enter-active,
.slide-in-leave-active,
.slide-out-enter-active,
.slide-out-leave-active {
  transition: all 0.4s ease;
  will-change: transform;
  position: absolute;
  width:100%;
  left:0;
  height: 100%;
}

.slide-in-enter {
  transform: translateX(101%);
}
.slide-in-leave-active {
  transform: translateX(-101%);
}

.slide-out-enter {
  transform: translateX(-101%);
}
.slide-out-leave-active {
  transform: translateX(101%);
}
.iconcaozuochenggong{ font-size: 30px!important;}
</style>
