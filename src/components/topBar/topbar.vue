<template>
  <div id="top-bar" v-if="isShow">
    <span class="go-back iconfont" @click="goBack" v-if="backShow">&#xe6bc;</span>
    <h2 class="title">{{title}}</h2>
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
      default: "学校列表"
    },
    backShow:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  methods:{
    goBack(){
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
#top-bar {
  height: 48px;
  line-height: 48px;
  background: #313540;
  padding: 0 10px;
  color: @fff;
  position: relative;
  .title{ text-align: center; font-size: @bigSize; padding: 0 40px;}
  .go-back{ font-size: 20px; position: absolute; left: 10px;}
}
</style>