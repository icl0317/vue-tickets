<template>
<transition name="fade">
  <div
    v-show="isShow"
    style="position:fixed; z-index:99999; left:0; top:0; right:0; bottom:0; background:#fafafa;"
    id="al"
  >
    <dl class="b1">
      <dt class="k1"></dt>
      <dd>
        <p class="i1"></p>
        <p class="i2"></p>
        <p class="i2"></p>
      </dd>
    </dl>
    <dl class="b1">
      <dt class="k1"></dt>
      <dd>
        <p class="i1"></p>
        <p class="i2"></p>
        <p class="i2"></p>
      </dd>
    </dl>
    <dl class="b1">
      <dd style="margin:0;">
        <p class="i1"></p>
        <p class="i2"></p>
        <p class="i2"></p>
      </dd>
    </dl>
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <p style="position:fixed; width:100%; text-align:center; top:54%; transform:translateY(-50%)">努力加载中..</p>
  </div>
  </transition>
</template>

<script>
export default {
  name: "top-bar",
  props: {
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
#al{
  .loading{
    text-align: center;
  }
  .loading span {
    display: inline-block;
    width: 4px;
    height: 100%;
    border-radius: 4px;
    background: lightgreen;
    -webkit-animation: load 1s ease infinite;
  }
  @-webkit-keyframes load {
    0%,
    100% {
      height: 15px;
      background: lightgreen;
    }
    50% {
      height: 30px;
      margin: -8px 0;
      background: lightblue;
    }
  }
  .loading span:nth-child(2) {
    -webkit-animation-delay: 0.2s;
  }
  .loading span:nth-child(3) {
    -webkit-animation-delay: 0.4s;
  }
  .loading span:nth-child(4) {
    -webkit-animation-delay: 0.6s;
  }
  .loading span:nth-child(5) {
    -webkit-animation-delay: 0.8s;
  }
  .b1{
    padding: 10px;
  }
  .k1{ width: 70px; height: 70px; background: #f3f3f3; float: left;}
  .b1 dd{ margin-left: 80px;}
  .i1,.i2{ height: 18px; background: #f3f3f3; margin-bottom: 8px;}
  .i1{ width: 50%;}
  
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>