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
        >{{formatDate.month}}月{{formatDate.day}}号&nbsp;&nbsp;{{formatDate.h}}:{{formatDate.m}}&nbsp;&nbsp;{{filmInfo.language}}</div>
      </div>
    </div>

    <div class="seat-box">
      <span class="screen-name">中教华影大礼堂</span>
      <div class="sm" ref="sm">
        <div ref="moveWarp" class="move-wrap">
          <canvas ref="seat" width="175" height="155"></canvas>
        </div>
      </div>
    </div>

    <div class="seat-foot">
      <ul class="selected-box clearfix">
        <li v-for="(v,idx) in selectedArr" :key="idx" @click="rmSelectSeat(v._id)">
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
import { mDrag, rmSameObj } from "@/utils/util";
import { Toast, Indicator } from "mint-ui";
import { getSeat, placeOrder } from "@/api/api";
import loading from "@/components/loading/loading";
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
      list: null,
      selectedArr: [], //已选座位
      SEAT_STATUS: [0, 1, 2, 3, 4], //（0 可售、1 已售、2 锁定、3 不可售、4 已选）
      screen_id: null,
      session_id: null,
      filmInfo: {
        film_name: "",
        film_version: "",
        start_datetime: "",
        language: ""
      },
      formatDate: {},
      isRepeatSubmit: true
    };
  },
  methods: {
    getSeatData() {
      this.loading = true;
      getSeat({ screen_id: this.screen_id, _id: this.session_id }).then(res => {
        let { code, msg, data } = res;
        if (code == 0) {
          let reDate = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})\s(?<h>\d{2}):(?<m>\d{2})/;
          let matchObj = reDate.exec(data.film_info.start_datetime);
          this.drawSeat(data.seat);
          this.list = data.seat;
          this.filmInfo = data.film_info;
          this.formatDate = matchObj.groups;
        } else {
          Toast(msg);
        }
        this.loading = false;
      });
    },
    drawSeat(seatlist) {
      let _this = this;
      let oCanvas = this.$refs.seat;
      let ctx = oCanvas.getContext("2d");
      let img0 = new Image();
      let img1 = new Image();
      let img2 = new Image();
      let img3 = new Image();
      let img4 = new Image();
      let oMoveWarp = this.$refs.moveWarp;
      let oSm = this.$refs.sm;

      let initAttr = {
        w: 30,
        h: 26,
        r: 5,
        b: 5
      };

      let _w = initAttr.w;
      let _h = initAttr.h;
      let wr = _w + initAttr.r;
      let hb = _h + initAttr.b;

      oCanvas.width = 1440;
      oCanvas.height = 900;

      img0.onload = () => {
        let maxColArr = [];
        let maxRowArr = [];

        //渲染座位
        seatlist.forEach(v => {
          if (v.seat_status == 0) {
            ctx.drawImage(img0, wr * v.graph_col, hb * v.graph_row, _w, _h);
          }
          if (v.seat_status == 1 || v.seat_status == 2 || v.seat_status == 3) {
            ctx.drawImage(img1, wr * v.graph_col, hb * v.graph_row, _w, _h);
          }
          if (v.seat_status == 4) {
            ctx.drawImage(img4, wr * v.graph_col, hb * v.graph_row, _w, _h);
          }
          maxColArr.push(v.graph_col);
          maxRowArr.push(v.graph_row);
        });

        //计算座位图宽高
        let bodyWidth = document.body.offsetWidth;
        let mapWidth = (Math.max(...maxColArr) + 1) * wr;
        let mapHeight = (Math.max(...maxRowArr) + 1) * hb;
        oMoveWarp.style.width = mapWidth + "px";
        oMoveWarp.style.height = mapHeight + "px";
        oMoveWarp.style.left =
          -(mapWidth - bodyWidth) / 2 - initAttr.r / 2 + "px";

        //点选座位
        _this.selectSeat = function(ev) {
          let x = Math.abs(ev.clientX) - getPos(oMoveWarp).l;
          let y = Math.abs(ev.clientY) - getPos(oMoveWarp).t;
          let gc = null,
            gr = null,
            sumW = null,
            sumH = null;

          seatlist.forEach(v => {
            if (
              v.seat_status == _this.SEAT_STATUS[1] ||
              v.seat_status == _this.SEAT_STATUS[2] ||
              v.seat_status == _this.SEAT_STATUS[3]
            )
              return;

            gc = v.graph_col;
            gr = v.graph_row;
            sumW = wr * gc;
            sumH = hb * gr;

            //座位图点选座位
            if (
              typeof ev == "object" &&
              x > sumW &&
              x < sumW + _w &&
              y > sumH &&
              y < sumH + _h
            ) {
              //已选和取选
              if (v.seat_status == 0) {
                if (_this.selectedArr.length >= 4) {
                  Toast("最多可选4个座位");
                  return;
                }
                _this.selectedArr.push(v);

                ctx.drawImage(img4, sumW, sumH, _w, _h);

                v.seat_status = _this.SEAT_STATUS[4];
              } else if (v.seat_status == 4) {
                ctx.drawImage(img0, sumW, sumH, _w, _h);
                v.seat_status = _this.SEAT_STATUS[0];
                rmSameObj(_this.selectedArr, "_id", v);
              }
            }

            //点选座号删除
            if (typeof (ev + "") == "string" && v._id == ev) {
              ctx.drawImage(img0, sumW, sumH, _w, _h);
              v.seat_status = _this.SEAT_STATUS[0];
            }
          });
        };

        function getPos(obj) {
          var top = 0;
          var left = 0;

          while (obj) {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
          }

          return { l: left, t: top };
        }

        oCanvas.addEventListener("click", _this.selectSeat);

        //拖拽
        mDrag(oSm, oMoveWarp);
      };

      img0.src = "/static/seat0.png";
      img1.src = "/static/seat1.png";
      img2.src = "/static/seat1.png";
      img3.src = "/static/seat1.png";
      img4.src = "/static/seat4.png";
    },
    //点选座号删除座位
    rmSelectSeat(id) {
      let _del = rmSameObj(this.selectedArr, "_id", id);
      this.list.forEach(v => {
        if (v._id == _del[0]._id) {
          this.selectSeat(id);
        }
      });
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
                order_id:data.order_id
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
  created(){
    let { screen_id, session_id } = this.$route.query;
    this.screen_id = screen_id;
    this.session_id = session_id;
    this.getSeatData();
  },
  mounted() {
    
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
#seat-map {
  background: #f5f5f5;
  overflow: hidden;
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
    padding: 10px 15px;
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
    top: 108px;
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
}
</style>