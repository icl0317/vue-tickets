<template>
  <div id="tickets">
    <topBar title="我的影票"></topBar>
    <ul class="list">
      <li>
        <div class="piao-status">
          <i class="top"></i>
          <i class="bot"></i>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import topBar from "@/components/topBar/topbar";
export default {
  name: "",
  components: {
    topBar
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin";
#tickets {
  background: #f5f5f5;
  min-height: 100%;
  .list{
    li{ height: 60px; background: @fff; margin-top: 8px; overflow: hidden; position: relative;}
    .piao-status{ width: 55px; border-right: 1px dashed @ddd; height: 60px; position: relative;
      i{ position: absolute; width: 10px; height: 10px; .borderRadius(10px); right: -5px;  background: #f5f5f5;}
      .top{ top: -6px;}
      .bot{ bottom: -6px;}
    }
  }
}
</style>