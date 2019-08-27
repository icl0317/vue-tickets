<template>
  <div id="fixed-footer" v-if="isShow">
    <ul class="foot-flex">
      <li>
        <router-link to="/index">
          <span class="iconfont">&#xe6ee;</span>
          <div class="bar-name">电影</div>
        </router-link>
      </li>
      <li>
        <router-link to="/news">
          <span class="iconfont">&#xe6aa;</span>
          <div class="bar-name">发现</div>
        </router-link>
      </li>
      <li>
        <router-link to="/my">
          <span class="iconfont">&#xe65d;</span>
          <div class="bar-name">我的</div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "foot",
  props: {
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
#fixed-footer {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  z-index: 999;
  height: 50px;
  border-top: 1px solid #f0f0f0;
  .foot-flex {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    span {
      font-size: 18px;
      color: @lightColor;
    }
    li {
      flex: 1;
      text-align: center;
      color: @lightColor;

      a {
        display: block;
        color: @lightColor;
      }
    }
    .router-link-active {
      color: @errorColor;
      span {
        color: @errorColor;
      }
    }
  }
}
</style>