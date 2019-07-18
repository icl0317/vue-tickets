<template>
  <div id="order-detail">
    <topBar title="订单详情"></topBar>
    <div class="start-cd" v-if="data.status == 1 && cdStart != 0">
      距离开场还有
      <span>{{cdStart}}</span>
    </div>
    <!-- 未支付订单 显示 -->
    <div class="bd-box" v-if="data.status == 0">
      <dl class="pay-tips">
        <dt>
          <span>{{data.total_price + data.serve_price}}</span>元
        </dt>
        <dd>
         请在<em>{{timeFormat(cdTime,'m$s$')}}</em>内完成支付
        </dd>
        <dd>
          <button class="cancel-pay-btn" type="button" @click="cancelOrder">取消订单</button>
        </dd>
      </dl>
    </div>

    <div class="bd-box">
      <div class="config-film-info clearfix">
        <img :src="data.film_photo" width="94" height="134" class="film-photo" />

        <div class="film-info">
          <h3 class="film-name">
            {{data.film_name}}
            <langType style="margin-left:5px;font-size:12px;">{{data.film_version}}</langType>
          </h3>
          <p
            class="film-time"
          >{{timeFormat(data.start_datetime, 'M$D$')}} {{timeFormat(data.start_datetime, 'hm')}}~{{timeFormat(data.end_datetime, 'hm')}} {{data.language}}</p>
          <p class="film-address">{{data.cinema_name}} {{data.screen_name}}</p>
          <ul class="seat-info clearfix">
            <li v-for="(item,index) in data.seat" :key="index">{{item}}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bd-box" v-if="data.status == 1 ">
      <div class="order-info-cloumn">取电影票</div>
      <ul class="qr-info">
        <li>
          <img :src="data.QR" width="120" height="120" :class="{lose:isEnd}">
          <span class="over iconfont" v-if="isEnd">&#xe6a1;</span>
        </li>
        <li class="much">{{data.seat_id && data.seat_id.length}}张电影票</li>
        <li class="get-code">取票码：123456 564321</li>
      </ul>
    </div>

    <div class="bd-box">
      <div class="order-info-cloumn">订单信息</div>
      <ul class="order-info">
        <li v-if="data.status == 1">
          <span>订单号：</span>
          {{data.order_num}}
        </li>
        <li v-if="data.status == 1">
          <span>付款日期：</span>
          {{data.pay_datetime}}
        </li>
        <li>
          <span>总价：</span>
          {{data.total_price}}元
        </li>
        <li>
          <span>应付：</span>
          {{data.pay_price}}元
          <em
            class="serve_price"
          >（含服务费：{{data.serve_price}}元 * {{data.seat_id && data.seat_id.length}}）</em>
        </li>
      </ul>
    </div>
    <!-- 已支付订单 显示 -->
    <div class="bd-box">
      <div class="order-info-cloumn">观影须知</div>
      <ul class="notice">
        <li>&middot; 影票售出后，不支持退换</li>
        <li>&middot; 请提前打开影票二维码凭码入场，避免观影人数过多滞留场外</li>
        <li>&middot; 由于设备故障等不可抗因素，会进行退票退款</li>
      </ul>
    </div>
    <div class="pbox" v-if="data.status == 0">
      <div class="paybtn" @click="payOrder">确认付款</div>
    </div>
    <loading :isShow="loading"></loading>
  </div>
</template>
<script>
import topBar from "@/components/topBar/topbar";
import langType from "@/components/langType/lang-type";
import { timeFormat, dateTime2Stamp } from "@/utils/util";
import { orderDetail, cancelOrder, payOrder } from "@/api/api";
import { Toast, MessageBox, Indicator } from "mint-ui";
import loading from "@/components/loading/loading";
export default {
  components: {
    langType,
    topBar,
    loading
  },
  data() {
    return {
      loading: true,
      data: {},
      order_id: null,
      cdTime: 0, //支付倒计时
      timer: null, //定时器
      cdStart: 0, //开场倒计时
      isEnd:null  //是否完场
    };
  },
  methods: {
    getOrderInfo() {
      this.loading = true;
      orderDetail({ order_id: this.order_id }).then(res => {
        let { msg, code, data } = res;
        if (code == 0) {
          data.server_datetime / 1000 > dateTime2Stamp(data.end_datetime) ? this.isEnd = true : this.isEnd = false; //是否完场
          this.data = data;
          if (data.status === 0) this.payCd();
          if (data.status === 1) this.startCd();
        } else {
          Toast(msg);
        }
        this.loading = false;
      });
    },
    //时间格式转换
    timeFormat(val, format) {
      return timeFormat(val, format);
    },
    //开场倒计时
    startCd() {
      let serverTime = parseInt(this.data.server_datetime / 1000); //服务器时间
      let startTime = dateTime2Stamp(this.data.start_datetime);
      let cds = startTime - serverTime;
      
      if(cds < 0) return;

      let cd = (cds) => {
        let day =
          parseInt(cds / 86400) == 0 ? "" : `${parseInt(cds / 86400)}天`;
        
        cds = cds % 86400;
        let hours =
          parseInt(cds / 3600) == 0 ? "" : `${parseInt(cds / 3600)}小时`;
        cds = cds % 3600;
        let minutes = parseInt(cds / 60) == 0 ? "" : `${parseInt(cds / 60)}分`;

        this.cdStart = `${day}${hours}${minutes}`;
      };
      cd(cds);

      let timer = setInterval(() => {
        cds--;
        cd(cds);

        if(cds<=0){
          clearInterval(timer);
        }
      }, 1000);
    },
    //支付倒计时 sec/秒
    payCd(sec = 600) {
      let placeOrderTime =
        dateTime2Stamp(this.data.order_datetime) + sec; //下单时间
      let serverTime = parseInt(this.data.server_datetime / 1000); //服务器时间
      let cds = placeOrderTime - serverTime;

      if (cds <= 0) {
        cds = 0;
      } else {
        this.timer = setInterval(() => {
          cds--;
          this.cdTime = cds;
          if (cds <= 0) {
            clearInterval(this.timer);
            MessageBox.alert("订单已过期").then(action => {
              this.$router.replace({
                name: "film-list"
              });
            });
          }
        }, 1000);
      }

      this.cdTime = cds;
    },
    //取消订单
    cancelOrder() {
      MessageBox.confirm("确定取消订单?").then(action => {
        cancelOrder({ order_id: this.order_id }).then(res => {
          let { msg, code, data } = res;
          if (code == 0) {
            Toast(msg);
            this.$router.replace({
              name: "film-list"
            });
          } else {
            Toast(msg);
          }
        });
      });
    },
    //支付
    payOrder() {
      Indicator.open();
      payOrder({ order_id: this.order_id }).then(res => {
        let { msg, code, data } = res;
        if (code === 0) {
          setTimeout(() => {
            Indicator.close();
            clearInterval(this.timer);
            Toast({
              message: msg,
              iconClass: "iconfont iconcaozuochenggong"
            });
            this.getOrderInfo();
          }, 2000);
        }
      });
    }
  },
  created() {
    this.order_id = this.$route.query.order_id;
  },
  mounted() {
    this.getOrderInfo();
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin";
#order-detail {
  margin-bottom: 50px;
  .bd-box {
    border-top: 8px solid #f5f5f5;
    padding: 15px;
  }
  .pay-tips {
    text-align: center;
    dt {
      color: @errorColor;
      font-size: @bigSize;
      margin-bottom: 4px;
    }
    span {
      font-size: 26px;
    }
    em {
      color: @errorColor;
      margin: 0 2px;
      font-style: normal;
    }
    dd {
      margin-bottom: 10px;
    }
  }
  .cancel-pay-btn {
    background: #fff;
    width: 100px;
    height: 34px;
    border: none;
    border: 1px solid @ddd;
    font-size: @normalSize;
    color: #666;
    .borderRadius(4px);
  }
  .config-film-info {
    .film-info {
      margin-right: 105px;
    }
    .film-name {
      color: @deepColor;
      font-size: @bigSize;
      margin-bottom: 6px;
    }
    .film-time {
      color: @errorColor;
      margin-bottom: 6px;
    }
    .film-address {
      color: #666;
      margin-bottom: 8px;
    }
    .seat-info li {
      float: left;
      width: 70px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: #f4f4f4;
      margin: 0 5px 5px 0;
    }
    .film-photo {
      float: right;
    }
  }
  .order-info-cloumn {
    border-left: 2px solid @deepColor;
    padding-left: 5px;
    font-size: @normalSize;
    margin-bottom: 15px;
  }
  .order-info li {
    margin-bottom: 10px;
    font-size: @normalSize;
    span {
      color: @lightColor;
      display: inline-block;
      width: 72px;
    }
  }
  .pbox {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff;
  }
  .paybtn {
    height: 42px;
    line-height: 42px;
    font-size: 18px;
    background: @errorColor;
    color: @fff;
    text-align: center;
    .borderRadius(4px);
    margin: 0 15px 15px;
  }
  .notice li {
    margin-bottom: 8px;
    color: #666;
  }
  .serve_price {
    font-size: @smallSize;
    font-style: normal;
    color: @lightColor;
  }
  .start-cd {
    padding: 10px 0;
    text-align: center;
    span {
      color: @errorColor;
      margin-left: 2px;
    }
  }
  .qr-info{ 
    text-align: center;
    li{ position: relative;}
    .over{ font-size: 70px; position: absolute; color: @ddd; top: -40px; right: 55px;}
  }
  .much,.get-code{ color: @lightColor; margin-top: 5px;}
  .lose{ opacity: 0.5;}
}
</style>