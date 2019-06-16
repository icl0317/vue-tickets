<template>
  <div id="seat-map">
    <div class="seat-head">
      <topBar></topBar>
      <div class="seat-top">
        <div class="film-name">
          巨额来电
          <langType class="ml">IMAX</langType>
        </div>
        <div class="film-info">5月30日&nbsp;&nbsp;19:00&nbsp;&nbsp;国语</div>
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
        <li v-for="(v,idx) in selectedArr" :key="idx" @click="rmSelectSeat(v.id)">
          <span>
            {{v.seat_row}}排{{v.seat_col}}座
            <i class="close-c iconfont">&#xe6d4;</i>
          </span>
        </li>
      </ul>
      <button class="go-buy" :class="{disablebuy:!selectedArr.length}" @click="toGoBuy">立即购买</button>
    </div>
  </div>
</template>
<script>
import topBar from "@/components/topBar/topbar";
import langType from "@/components/langType/lang-type";
import { mDrag, rmSameObj } from "@/utils/util";
import { Toast } from "mint-ui";
import aaa from "../../../static/aaa.js";

export default {
  name: "seat",
  components: {
    topBar,
    langType
  },
  data() {
    return {
      list: aaa,
      selectedArr: [], //已选座位
      SEAT_STATUS: [0, 1, 2, 3, 4] //（0 可售、1 已售、2 锁定、3 不可售、4 已选）
    };
  },
  methods: {
    drawSeat() {
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
        _this.list.forEach(v => {
          if (v.seat_status == 0) {
            ctx.drawImage(
              img0,
              wr * (v.graph_col - 1),
              hb * (v.graph_row - 1),
              _w,
              _h
            );
          }
          if (v.seat_status == 1 || v.seat_status == 2 || v.seat_status == 3) {
            ctx.drawImage(
              img1,
              wr * (v.graph_col - 1),
              hb * (v.graph_row - 1),
              _w,
              _h
            );
          }
          if (v.seat_status == 4) {
            ctx.drawImage(
              img4,
              wr * (v.graph_col - 1),
              hb * (v.graph_row - 1),
              _w,
              _h
            );
          }
          maxColArr.push(v.graph_col);
          maxRowArr.push(v.graph_row);
        });

        //计算座位图宽高
        oMoveWarp.style.width = Math.max(...maxColArr) * wr + "px";
        oMoveWarp.style.height = Math.max(...maxRowArr) * hb + "px";

        //点选座位
        _this.selectSeat = function(ev) {

          let x = Math.abs(ev.clientX)-getPos(oMoveWarp).l;
          let y = Math.abs(ev.clientY)-getPos(oMoveWarp).t;
          let gc = null,
            gr = null,
            sumW = null,
            sumH = null;
 
          _this.list.forEach(v => {
            if (
              v.seat_status == _this.SEAT_STATUS[1] ||
              v.seat_status == _this.SEAT_STATUS[2] ||
              v.seat_status == _this.SEAT_STATUS[3]
            )
              return;

            gc = v.graph_col - 1;
            gr = v.graph_row - 1;
            sumW = wr * gc;
            sumH = hb * gr;
            
            //座位图点选座位
            if (typeof ev == "object" && x > sumW && x < sumW + _w && y > sumH && y < sumH + _h) {
          
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
                rmSameObj(_this.selectedArr, "id", v);
              }
            }

            //点选座号删除
            if(typeof (ev+"") == "string" && v.id == ev){
                ctx.drawImage(img0, sumW, sumH, _w, _h);
                v.seat_status = _this.SEAT_STATUS[0];
            }
          });

        };

         function getPos(obj){
            var top=0;
            var left=0;
            
            while(obj){
              top+=obj.offsetTop;
              left+=obj.offsetLeft;
              obj = obj.offsetParent;
            }
            
            return {l:left,t:top};
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
      let _del = rmSameObj(this.selectedArr, "id", id);
      this.list.forEach(v => {
        if (v.id == _del[0].id) {
          this.selectSeat(id);
        }
      });
    },
    //去下单
    toGoBuy(){
      if(this.selectedArr.length){
        this.$router.push({
          name:"order-detail",
          params:{
            id:1
          }
        });  
      }
    }
  },
  mounted() {
    this.drawSeat();
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
    top: 20px;
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
  .disablebuy{ opacity: 0.6;}
}
</style>