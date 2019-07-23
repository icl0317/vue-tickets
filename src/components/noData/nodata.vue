<template>
  <div v-if="isShow" :title="title"  class="has-pos-cinema">
    <dl class="no-cinema">
      <dt>
        <span class="fail iconfont">&#xe642;</span>
      </dt>
      <dd>{{title}}</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: "no-data",
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "暂无数据"
    }
  },
  data() {
    return {};
  },
  methods: {
  
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
.no-cinema {
    text-align: center;
    padding-top: 40px;
    .fail {
      color: #ccc;
      font-size: 60px;
    }
  }
</style>