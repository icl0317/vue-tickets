<template>
  <div id="seat-map">
    <div class="seat-head">
      <topBar></topBar>
      <div class="seat-top">
        <div class="film-name">
          {{filmInfo.film_name}}
          <langType class="ml">{{filmInfo.film_version}}</langType>
        </div>
        <div
          class="film-info"
        >{{formatDate.M}}月{{formatDate.D}}号&nbsp;&nbsp;{{formatDate.h}}:{{formatDate.m}}&nbsp;&nbsp;{{filmInfo.language}}</div>
      </div>
    </div>

    <div class="seat-box">
      <span class="screen-name">中教华影大礼堂</span>
      <div class="sm" ref="sm">
        <div
          ref="moveWarp"
          class="move-wrap"
          :style="{width: seatMapInfo.sWidth / 20 + 'rem', height: seatMapInfo.sHeight / 20 * seatMapInfo.scale + 'rem', transform:'translate3d(' + seatMapInfo.x / 40 + 'rem, '+ seatMapInfo.y / 40 +'rem, 0rem)'}"
          
        >
          <div
            :style="{width: seatMapInfo.sWidth / 20 + 'rem', height: seatMapInfo.sHeight / 20 + 'rem', transform:'scale('+ seatMapInfo.scale +')'}"
            style="transform-origin:50% 0"
          >
            <span
              v-for="(item,index) in list"
              :key="index"
              :style="'transform:translate3d('+item.graph_col * 34 / 20 +'rem,'+item.graph_row * 30 / 20 +'rem, 0rem)'"
              :class="{keyong:item.seat_status === SEAT_STATUS[0], bukeyong:item.seat_status === SEAT_STATUS[1] || item.seat_status === SEAT_STATUS[2] || item.seat_status === SEAT_STATUS[3], yixuan:item.seat_status === SEAT_STATUS[4]}"
              :id="item._id"
              @click="selectSeat(item)"
            ></span>
          </div>
          <p class="c-line"></p>
        </div>
        <div class="mk" ref="mk" :style="{transform:'translate3d(0rem, '+ seatMapInfo.y / 40 +'rem, 0rem)'}">
          <!--js-->
        </div>
      </div>
    </div>

    <div class="seat-foot">
      <ul class="selected-box clearfix">
        <li v-for="(v,idx) in selectedArr" :key="idx" @click="rmSelectSeat(v)">
          <span>
            {{v.seat_row}}排{{v.seat_col}}座
            <i class="close-c iconfont">&#xe6d4;</i>
          </span>
        </li>
      </ul>
      <button
        class="go-buy"
        :class="{disablebuy:!selectedArr.length && isRepeatSubmit}"
        @click="toGoBuy"
      >立即购买</button>
    </div>
    <loading :isShow="loading"></loading>
  </div>
</template>
<script>
import topBar from "@/components/topBar/topbar";
import langType from "@/components/langType/lang-type";
import { findInArr, rmSameObj, parseDateTime } from "@/utils/index";
import { Toast, Indicator } from "mint-ui";
import { getSeat, placeOrder } from "@/api/api";
import loading from "@/components/loading/loading";
import "@/vendor/hammer.min";
export default {
  name: "seat",
  components: {
    topBar,
    langType,
    loading
  },
  data() {
    return {
      loading: true,
      list: null, //座位数据
      selectedArr: [], //已选座位
      SEAT_STATUS: [0, 1, 2, 3, 4], //（0 可售、1 已售、2 锁定、3 不可售、4 已选）
      screen_id: null,
      session_id: null,
      filmInfo: {
        //场次数据
        film_name: "",
        film_version: "",
        start_datetime: "",
        language: ""
      },
      formatDate: {},
      isRepeatSubmit: true, //禁止重复提交
      seatMapInfo: {
        //座位图参数
        maxRow: 0,
        maxCol: 0,
        sWidth: 0,
        sHeight: 0,
        deviceWidth: 0,
        x:0,
        y:0,
        scale:1
      }
    };
  },
  methods: {
    getSeatData() {
      this.loading = true;
      getSeat({ screen_id: this.screen_id, _id: this.session_id }).then(res => {
        let { code, msg, data } = res;
        if (code == 0) {
          this.hammer = new Hammer(this.$refs.moveWarp);
          this.drawSeat(data.seat);
          this.list = data.seat;
          this.filmInfo = data.film_info;
          this.formatDate = parseDateTime(data.film_info.start_datetime);
          this.dragMove();
          this.seatScale();
        } else {
          Toast(msg);
        }
        this.loading = false;
      });
    },
    //画座位图
    drawSeat(seatlist) {
      this.seatMapInfo.deviceWidth = document.body.clientWidth;
      this.seatMapInfo.maxRow = 0;
      this.seatMapInfo.maxCol = 0;
      let oDiv = null;
      let oMKH = document.createElement("div");
      oMKH.className = "mkh";
      seatlist.forEach(v => {
        if (Number(v.graph_row) > Number(this.seatMapInfo.maxRow)) {
          this.seatMapInfo.maxRow = ~~v.graph_row;
        }
        if (Number(v.graph_col) > Number(this.seatMapInfo.maxCol)) {
          this.seatMapInfo.maxCol = ~~v.graph_col;
        }
        if (!oMKH.children[v.graph_row]) {
          oDiv = document.createElement("div");
          oDiv.className = "mrow";
          oDiv.innerHTML = '&nbsp;';
          oMKH.appendChild(oDiv);
          if(!oMKH.children[v.graph_row]){
            oDiv = document.createElement("div");
            oDiv.className = "mrow";
            oMKH.appendChild(oDiv);
          }
          oMKH.children[v.graph_row].innerHTML = v.seat_row;
        }
      });

      this.seatMapInfo.sWidth = (this.seatMapInfo.maxCol + 1) * 34 - 4;
      this.seatMapInfo.sHeight = (this.seatMapInfo.maxRow + 1) * 30;
      this.seatMapInfo.x = this.seatMapInfo.deviceWidth - this.seatMapInfo.sWidth;
      this.seatMapInfo.scale = ((this.seatMapInfo.deviceWidth - 60) / this.seatMapInfo.sWidth).toFixed(1) // 默认整屏比例
      if (this.seatMapInfo.scale > 1.6) this.seatMapInfo.scale = 1.6;
      if (this.seatMapInfo.scale < 0.6) this.seatMapInfo.scale = 0.6;
      oMKH.style.height = this.seatMapInfo.sHeight * this.seatMapInfo.scale / 20 + "rem";
      this.$refs.mk.appendChild(oMKH);
    },
    //点选座位
    selectSeat(info) {
      let r = findInArr(this.selectedArr, info, "_id");
      if (r === -1) {
        if (this.selectedArr.length >= 4) return;
        this.selectedArr.push(info);
      } else {
        this.selectedArr.splice(r, 1);
      }
      this.list.forEach(v => {
        if (
          (v.seat_status === this.SEAT_STATUS[0] ||
            v.seat_status === this.SEAT_STATUS[4]) && v._id === info._id
        ) {
          v.seat_status = v.seat_status === this.SEAT_STATUS[0] ? this.SEAT_STATUS[4] : this.SEAT_STATUS[0];
        }
      });
    },
    //拖动
    dragMove() {
      let _this = this;
      let disX = 0,
        disY = 0;
      let oSeatWarp = _this.$refs.moveWarp;
      this.hammer.off("panstart");
      this.hammer.off("panmove");
      this.hammer.off("panend");
      this.hammer.on("panstart", function(ev) {
        // 获取当前偏移量
        let getInitPos = oSeatWarp.style.transform
          .match(
            /[-+]?[0-9]+(\.[0-9]+)?rem, [-+]?[0-9]+(\.[0-9]+)?rem, [0-9]rem/
          )[0]
          .split(",");
        disX = parseInt(getInitPos[0]) * 40;
        disY = parseInt(getInitPos[1]) * 40;
      });

      this.hammer.on("panmove", function(ev) {
        _this.seatMapInfo.x = ev.deltaX + disX;
        _this.seatMapInfo.y = ev.deltaY + disY;
      });

      this.hammer.on("panend", function(ev) {

        let scaleCha = (_this.seatMapInfo.sWidth * (1 - _this.seatMapInfo.scale));

        if (_this.seatMapInfo.sWidth * _this.seatMapInfo.scale > _this.seatMapInfo.deviceWidth) {
          // 宽度超出一屏
        } else {
          // 宽度一屏内
        }
        let viewHeight = document.querySelector(".sm").offsetHeight - 40;

        if (_this.SeatHeight * _this.seatMapInfo.scale > viewHeight) {
          // 高度超出一屏
       
        } else {
          // 高度一屏内
      
        }
      });
    },
    //缩放
    seatScale(){
      let _this = this
      this.hammer.get('pinch').set({
        enable: true
      })
      let s = 0
      let oXs = null
      this.hammer.on('pinchstart', function (e) {
        s = _this.seatMapInfo.scale;
        oXs = document.querySelector('.mkh');
      })

      this.hammer.on('pinchmove', function (e) {
        _this.seatMapInfo.scale = s * 1 + 1 * (e.scale - 1)
        if (_this.seatMapInfo.scale > 1.8) _this.seatMapInfo.scale = 1.8
        if (_this.seatMapInfo.scale < 0.4) _this.seatMapInfo.scale = 0.4
        oXs.style.height = _this.seatMapInfo.sHeight * _this.seatMapInfo.scale / 20 + 'rem'
      })

      this.hammer.on('pinchend', function (e) {
        _this.seatMapInfo.scale = s * 1 + 1 * (e.scale - 1)
        if (_this.seatMapInfo.scale > 1.4) _this.seatMapInfo.scale = 1.4
        if (_this.seatMapInfo.scale < 0.6) _this.seatMapInfo.scale = 0.6
        oXs.style.height = _this.seatMapInfo.sHeight * _this.seatMapInfo.scale / 20 + 'rem'
      })
    },
    //点选座号删除座位
    rmSelectSeat(info) {
      this.selectSeat(info);
    },
    //去下单
    toGoBuy() {
      if (this.selectedArr.length && this.isRepeatSubmit) {
        this.isRepeatSubmit = false; //节流
        let seat_id = this.selectedArr.map(v => v._id);
        Indicator.open({
          text: "提交订单..."
        });
        placeOrder({ session_id: this.session_id, seat_id }).then(res => {
          let { code, data, msg } = res;
          if (code == 0) {
            this.$router.push({
              name: "order-detail",
              query: {
                order_id: data.order_id
              }
            });
          } else {
            Toast(msg);
          }
          Indicator.close();
          this.isRepeatSubmit = true;
        });
      }
    }
  },
  created() {
    let { screen_id, session_id } = this.$route.query;
    this.screen_id = screen_id;
    this.session_id = session_id;
    this.getSeatData();
  },
  mounted() {
  }
}
</script>

<style lang="less">
@import "../../style/mixin";
#seat-map {
  background: #f5f5f5;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .full();
  .seat-head {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
  }
  .seat-top {
    height: 60px;
    background: @fff;
    border-bottom: 1px solid @ddd;
    padding: 0 15px;
  }
  .film-name {
    font-size: @bigSize;
    padding: 8px 0 2px;
  }
  .film-info {
    color: @lightColor;
    font-size: @normalSize;
  }
  .ml {
    margin-left: 5px;
  }
  .seat-foot {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff;
    border-top: 1px solid @ddd;
    padding: 10px 15px 20px;
  }
  .go-buy {
    background: @warnColor;
    color: @fff;
    width: 100%;
    height: 38px;
    border: none;
    font-size: @bigSize;
    .borderRadius(4px);
  }
  .seat-box {
    position: absolute;
    top: 104px;
    right: 0;
    bottom: 59px;
    left: 0;
    overflow: hidden;
  }
  .screen-name {
    background: @ddd;
    height: 20px;
    line-height: 22px;
    padding: 0 10px;
    top: -3px;
    border-radius: 0 0 8px 8px;
    z-index: 99;
    .hz();
  }
  .s {
    width: 15px;
    height: 15px;
    background: #ccc;
    position: absolute;
  }
  .sm {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .move-wrap {
    position: absolute;
    top: 40px;
    span {
      background-size: 100% !important;
      width: 30px;
      height: 26px;
      position: absolute;
      font-size: 12px;
      z-index: 9;
    }
    .keyong {
      background: url(../../images/use.png) no-repeat;
    }
    .bukeyong {
      background: url(../../images/locked.png) no-repeat;
    }
    .yixuan {
      background: url(../../images/selected.png) no-repeat;
    }
  }
  .selected-box {
    li {
      width: 25%;
      float: left;
      margin-bottom: 10px;
    }
    span {
      height: 26px;
      line-height: 26px;
      width: 90%;
      border: 1px solid @ddd;
      display: block;
      text-align: center;
      margin: auto;
      .borderRadius(28px);
      position: relative;
    }
  }
  .close-c {
    color: #ff6969;
    font-size: 14px;
    position: absolute;
    right: -5px;
    top: -11px;
  }
  .disablebuy {
    opacity: 0.6;
  }
  .mk {
    position: absolute;
    left: 2px;
    top: 40px;
    text-align: center;
  }
  .mkh {
    background: rgba(0, 0, 0, 0.4);
    min-width: 16px;
    border-radius: 16px;
    color: #fff;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    -webkit-box-orient: vertical;
  }
  .mrow {
    align-items: center;
    justify-content: center;
    -webkit-box-flex: 1;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    flex: 1 1 auto;
    display: flex;
  }
  .c-line {
    width: 2px;
    height: 100%;
    border-right: 2px dotted #ddd;
    position: absolute;
    left: 50%;
    margin-left: -1px;
    top: 0;
    z-index: -1;
}
}
</style>