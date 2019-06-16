<template>
  <div id="my">
    <div class="my-list">
      <ul>
        <li><span class="go-in iconfont">&#xe61f;</span>我的影票</li>
        <li></li>
      </ul>
    </div>
    <fixedFoot></fixedFoot>
  </div>
</template>
<script>
import fixedFoot from "@/components/fixedFooter/foot";
export default {
  name: "",
  components: {
    fixedFoot
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
#my {
  background:#f5f5f5;
  height: 100%;
  .my-list{ padding: 10px 0;
    ul{
      background: #fff;
      padding: 0 0 0 15px;
    }
    li{
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid @ddd;
      font-size: @normalSize;
    }
    li:last-child{ border: none;}
    .go-in{ float: right; color: @lightColor; margin-right: 10px;}
  }
}
</style>