<template>
  <div id="order-detail">
    <topBar title="订单详情"></topBar>
    <!-- 未支付订单 显示 -->
    <div class="bd-box">
      <dl class="pay-tips">
        <dt><span>0.03</span>元</dt>
        <dd>请在<em>10分10</em>秒内完成支付</dd>
        <dd>
          <button class="cancel-pay-btn" type="button">取消订单</button>
        </dd>
      </dl>
    </div>

    <div class="bd-box">
      <div class="config-film-info clearfix">
        <img src="../../../assets/2.jpg" width="94" height="134" class="film-photo">

        <div class="film-info">
          <h3 class="film-name">西游记女儿国<langType style="margin-left:5px;font-size:12px;">IMAX</langType></h3>
          <p class="film-time">06月15日 14:00~15:56 粤语</p>
          <p class="film-address">测试影院4 1号杜比厅</p>
          <ul class="seat-info clearfix">
            <li>11排13座</li>
            <li>11排14座</li>
            <li>11排13座</li>
            <li>11排14座</li>
          </ul>
        </div>  
      </div>
    </div>

    <div class="bd-box">
      <div class="order-info-cloumn">
        订单信息
      </div>
      <ul class="order-info">
        <li><span>订单号：</span>20190205446358</li>
        <li><span>付款日期：</span>2019-10-10 08:12:31</li>
        <li><span>总价：</span>0.03元</li>
        <li><span>应付：</span>0.03元</li>
      </ul>
    </div>
    <!-- 已支付订单 显示 -->
    <div class="bd-box">
      <div class="order-info-cloumn">
        观影须知
      </div>
      <ul class="notice">
        <li>&middot; 影票售出后，不支持退换</li>
        <li>&middot; 请提前打开影票二维码凭码入场，避免观影人数过多滞留场外</li>
        <li>&middot; 由于设备故障等不可抗因素，会进行退票退款</li>
      </ul>
    </div>
    <div class="pbox"><div class="paybtn">确认付款</div></div>
  </div>  
</template>
<script>
import topBar from "@/components/topBar/topbar";
import langType from "@/components/langType/lang-type";
export default {
  name: "",
  components: {
    langType,
    topBar
  },
  data() {
    return {

    };
  },
  methods: {

  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin";
#order-detail{
  margin-bottom: 50px;
  .bd-box{ border-top: 8px solid #f5f5f5; padding: 15px;}
  .pay-tips{ 
    text-align: center;
    dt{ color: @errorColor; font-size: @bigSize; margin-bottom: 4px;}
    span{
      font-size: 26px;
    }
    em{
      color: @errorColor;margin: 0 2px; font-style: normal;
    }
    dd{ margin-bottom:10px;}
  }
  .cancel-pay-btn{ background: #fff; width: 100px; height: 34px; border: none; border: 1px solid @ddd; font-size: @normalSize;
   color: #666; .borderRadius(4px);}
  .config-film-info{
    .film-info{
      margin-right:105px; 
    }
    .film-name{
      color: @deepColor;
      font-size: @bigSize;
      margin-bottom: 6px;
    }
    .film-time{ color: @errorColor; margin-bottom: 6px;}
    .film-address{ color: #666; margin-bottom: 8px;}
    .seat-info li{ float: left; width: 70px; height: 24px; line-height: 24px; text-align: center; background: #f4f4f4; margin:0 5px 5px 0;}
    .film-photo{ float: right;}
  }
  .order-info-cloumn{ border-left: 2px solid @deepColor; padding-left: 5px; font-size: @normalSize; margin-bottom: 15px;}
  .order-info li{ margin-bottom: 10px; font-size: @normalSize; 
    span{ color: @lightColor; display: inline-block; width: 72px;}
  }
  .pbox{
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff;
  }
  .paybtn{
    height:42px;
    line-height:42px;
    font-size:18px;
    background: @errorColor;
    color: @fff;
    text-align: center;
    .borderRadius(4px);
    margin: 0 15px 15px;
    
  }
  .notice li{ margin-bottom: 8px; color: #666;}
}
</style>