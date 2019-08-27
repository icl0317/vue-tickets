<template>
  <div id="top-bar" v-if="isShow">
    <span class="go-back iconfont" @click="goBack" v-if="backShow">&#xe6bc;</span>
    <h2 class="title" v-if="title">{{title}}</h2>
    <h2 class="title" v-else>{{setTitle}}</h2>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "top-bar",
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: null
    },
    backShow:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      setTitle:''
    }
  },
  methods:{
    goBack(){
      this.$router.go(-1);
    }
  },
  created(){
    this.setTitle = this.$route.meta.title
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
#top-bar {
  height: 44px;
  line-height: 44px;
  background: #313540;
  padding: 0 10px;
  color: @fff;
  position: relative;
  .title{ text-align: center; font-size: @bigSize; padding: 0 40px;}
  .go-back{ font-size: 20px; position: absolute; left: 10px;}
}
</style>