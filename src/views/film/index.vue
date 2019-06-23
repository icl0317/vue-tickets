<template>
  <div id="film">
    <!-- <div class="film-bg"></div> -->
    <div class="film-content">
      <div class="header">
        <dl class="cinema-info">
          <dt>{{collegeInfo.college_name}} {{collegeInfo.cinema_name}}</dt>
          <dd>{{collegeInfo.address}}</dd>
        </dl>
        <span class="go-info iconfont" @click="goCityList">&#xe61f;</span>
      </div>
      <div class="swipe-wrap">
        <div class="swipe-slide" ref="swipeSlide">
          <ul class="imgs clearfix" ref="imgs" style="-webkit-transform:translate3d(150px,0,0)">
            <li
              v-for="(item , index) in filmData"
              :key="index"
              :class="{active : index == filmiNow}"
            >
              <img :src="item.film_photo">
            </li>
          </ul>
          <b class="center-mark"></b>
        </div>
      </div>

      <div class="film-intro">
        <h3>{{filmData[filmiNow].film_name}}</h3>
        <p>{{filmData[filmiNow].film_long}}分钟 | {{filmData[filmiNow].film_type}} | {{filmData[filmiNow].actors}}</p>
      </div>

      <div class="film-info">
        <div class="film-tag-bar">
          <span :class="{active:playiNow == 0}" @click="playShow(0)">放映信息</span>
          <span :class="{active:playiNow == 1}" @click="playShow(1)">影片介绍</span>
        </div>

        <div class="play-detail" v-show="playiNow == 0">
          <ul>
            <li v-for="(item , index) in filmData[filmiNow].children" :key="index">
              <dl class="play-date">
                <dt>{{_stampToTime(item.start_datetime , "D")}}</dt>
                <dd>{{_stampToTime(item.start_datetime , "M")}}月</dd>
              </dl>
              <div class="item-detail">
                <div class="time-block">
                  <div class="start-time">{{_stampToTime(item.start_datetime , "hm")}}</div>
                  <div class="end-time">{{_stampToTime(item.end_datetime , "hm")}}散场</div>
                </div>
                <div class="screen-block" style="width:80px;">
                  <div class="screen-name">{{item.screen_name}}</div>
                  <div class="language">{{item.language}} {{item.screen_type}}</div>
                </div>
                <div class="price-block" style="width:65px;">
                  <div class="price">
                    特惠<br>{{item.sell_price}}元
                  </div>
                </div>
                <div class="buy-block" @click="toSelectSeat">
                  <div class="go-buy">购票</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="film-detail" v-show="playiNow == 1">{{filmData[filmiNow].brief}}</div>
      </div>
    </div>
    <fixedFoot></fixedFoot>
    <loading :isShow="loading"></loading>
  </div>
</template>

<script>
import fixedFoot from "@/components/fixedFooter/foot";
import loading from "@/components/loading/loading";
import { stampToTime, findInArr } from "@/utils/util";
import { getIndexFilmList, getLocationCollege, getCinemaList } from "@/api/api";
import "@/utils/geolocation.min";
export default {
  name: "film-list",
  components: {
    fixedFoot,
    loading
  },
  data() {
    return {
      loading:"",
      filmiNow: 0,
      playiNow: 0,
      filmData: [
        {
          film_name: "",
          film_photo: "",
          film_long: "",
          film_type: "",
          actors: "",
          brief: "",
          film_id: "",
          children: [
            {
              start_datetime: "",
              end_datetime: "",
              screen_name: "",
              language: "",
              film_version: "",
              sell_price: 5,
              play_id: ""
            }
          ]
        }
      ],
      collegeInfo:{
        college_name:"",
        address:"",
        cinema_name:"",
        college_id:""
      }
    };
  },
  methods: {
    handleChange(index) {},
    //去城市列表
    goCityList() {
      this.$router.push({
        name: "college-list",
        params:this.collegeInfo
      });
    },
    //去座位图
    toSelectSeat() {
      this.$router.push({
        name: "seat"
      });
    },
    //放映信息 影片介绍
    playShow(param) {
      this.playiNow = param;
    },
    //获取排期数据
    getFilmData(cinema_id, college_id) {
      getIndexFilmList({ cinema_id, college_id}).then(res => {
        let { code, data, msg } = res;
        if (code == 0) {
          this.filmData = this.formatFilmData(data.session);
          this.collegeInfo = {
            college_name:data.college_name,
            address:data.address,
            cinema_name:data.cinema_name,
            college_id:college_id
          }
        }
        
        this.loading=false;

        //轮播图
        let oImg = this.$refs.imgs;
        let oScroll = this.$refs.swipeSlide;
        let tx = 150;
        let iNow = 0;
        let filmLen = this.filmData.length;

        oImg.addEventListener(
          "touchstart",
          ev => {
            let downX = ev.targetTouches[0].pageX;
            let disX = downX - tx;
            oImg.style.WebkitTransition = "none";

            let fnMove = ev => {
              tx = ev.targetTouches[0].pageX - disX;
              oImg.style.WebkitTransform = "translate3d(" + tx + "px,0,0)";
            };

            oScroll.addEventListener("touchmove", fnMove, false);

            let fnEnd = ev => {
              oScroll.removeEventListener("touchmove", fnMove, false);
              oScroll.removeEventListener("touchend", fnEnd, false);
              let upX = ev.changedTouches[0].pageX;

              if (Math.abs(downX - upX) > 40 && Math.abs(downX - upX) < 80) {
                //切换
                if (downX > upX) {
                  //往左， ++
                  iNow++;
                  if (iNow >= filmLen - 1) iNow = filmLen - 1;
                } else {
                  iNow--;
                  if (iNow <= 0) iNow = 0;
                }
              } else if (Math.abs(downX - upX) >= 80) {
                if (downX > upX) {
                  //往左， ++
                  iNow += 2;
                  if (iNow >= filmLen - 1) iNow = filmLen - 1;
                } else {
                  iNow -= 2;
                  if (iNow <= 0) iNow = 0;
                }
              }

              tx = 150 - iNow * 75;
              oImg.style.WebkitTransition = ".4s all ease";
              oImg.style.WebkitTransform = "translate3d(" + tx + "px,0,0)";
              this.filmiNow = iNow;
            };

            oScroll.addEventListener("touchend", fnEnd, false);
          },
          false
        );
      });
    },
    //后台数据格式转换
    formatFilmData(list) {
      let arr = [];
      list.forEach(v => {
        let json = {
          film_name: v.film_name,
          film_photo: v.film_photo,
          film_long: v.film_long,
          film_type: v.film_type,
          actors: v.actors,
          brief: v.brief,
          film_id: v.film_id
        };
        json.children = [
          {
            start_datetime: v.start_datetime,
            end_datetime: v.end_datetime,
            screen_name: v.screen_name,
            language: v.language,
            film_version: v.film_version,
            sell_price: v.sell_price,
            play_id: v._id
          }
        ];

        if (findInArr(arr, json, "film_id") == -1) {
          arr.push(json);
        } else {
          arr[findInArr(arr, json, "film_id")].children = arr[
            findInArr(arr, json, "film_id")
          ].children.concat(json.children);
        }
      });
      return arr;
    },
    //时间戳转时间
    _stampToTime(stamp, format) {
      return stampToTime(stamp, format);
    }
  },
  mounted() {
    let {cinema_id ,college_id } = this.$route.query;
    //有cinema_id 获取数据
    if (cinema_id) {
      this.getFilmData(cinema_id, college_id);
      return;
    }
    //否则获取定位学校
    let _this = this;
    let geolocation = new qq.maps.Geolocation(
      "EZMBZ-A4MEX-MWA4L-T4MZK-66OO5-3OBTD",
      "film"
    );
    geolocation.getLocation(
      function(res) {
        let { lat, lng } = res;
    
        getLocationCollege({ latitude: lat, longitude: lng }).then(res => {
          let { code, data, msg } = res;
        
          if (code == 0) {
            //用户位置没变，载入缓存地址
            if(localStorage.college_id == data[0]._id){
              _this.getFilmData(localStorage.cinema_id, data[0]._id);
              return;
            }
            //否则用户位置变了 从新定位新地址
            _this.$router.push({
              name: "cinema-list",
              query: {
                college_id: data[0]._id,
                college_name:data[0].college_name
              }
            });
          } else {
            if(localStorage.college_id){
              _this.getFilmData(localStorage.cinema_id, localStorage.college_id);
              return;
            }
            //定位失败或没有定位学校
            _this.$router.push({
              name: "college-list",
              params:{
                err:msg
              }
            });
          }
        });
      },
      function(err) {
        //用户拒绝定位
        _this.$router.push({
          name: "college-list",
          params:{
            err:"定位失败"
          }
        });
      }
    );

  }
};
</script>
<style lang="less">
@import "../../style/mixin";
#film {
  padding-bottom: 40px;
  // .film-bg {
  //   background: url(../../assets/2.jpg) no-repeat;
  //   background-size: cover;
  //   height: 100%;
  //   background-attachment: fixed;
  //   background-size: cover;
  //   filter: blur(60px);
  //   -webkit-filter: blur(60rpx);
  //   -webkit-transform: translate3d(0, 0, 0);
  //   -moz-transform: translate3d(0, 0, 0);
  //   -ms-transform: translate3d(0, 0, 0);
  //   transform: translate3d(0, 0, 0);
  //   .fullPos();
  // }
  min-height: 100%;
  .film-content {
    background: @fff;
    z-index: 9;
    height: 100%;
    .header {
      height: 48px;
      background: @fff;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .go-info {
      font-size: 20px;
      color: @deepColor;
    }
    .cinema-info {
      dt {
        font-size: @bigSize;
      }
      dd {
        color: @lightColor;
      }
    }
    .swipe-wrap {
      height: 128px;
      background: rgba(0, 0, 0, 0.8);
      padding: 15px 0 0 0;
      margin-bottom: 10px;
      .swipe-slide {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
      }
      .imgs {
        width: 1000px;
        display: flex;
        align-items: flex-end;
      }
      .imgs li {
        float: left;
        width: 75px;
        text-align: center;
      }
      .imgs img {
        width: 62px;
        height: 92px;
      }
      .imgs .active img {
        width: 72px;
        height: 102px;
      }
      .center-mark {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #fff;
        .hz();
        bottom: 0;
      }
      .film-pic {
        float: left;
        margin-right: 10px;
      }
      .film-name {
        font-size: @bigSize;
        font-weight: 500;
        color: @fff;
        margin-bottom: 6px;
        .textCut();
      }
      .film-type span {
        display: inline-block;
        padding: 1px 5px;
        background: #e5dadc;
        .borderRadius(3px);
        margin-right: 4px;
      }
      .director,
      .duration {
        color: @fff;
        .textCut();
        margin-top: 6px;
      }
      .performer {
        max-height: 32px;
        color: @fff;
        margin-top: 6px;
        .RowsCut(2);
      }
      .mint-swipe-indicator.is-active {
        background: @warnColor;
        opacity: 0.8;
      }
    }
    .film-info {
      padding: 0 10px;
    }

    .film-tag-bar {
      text-align: center;
      border: 1px solid @fff;
      overflow: hidden;
      margin-bottom: 10px;
      .borderRadius(4px);
      span {
        width: 50%;
        float: left;
        font-size: @bigSize;
        color: @deepColor;
        height: 36px;
        line-height: 36px;
        border: 1px solid #dbe5ea;
      }
      .active {
        background: #dbe5ea;
        color: @deepColor;
      }
    }
    .play-detail {
      li {
        height: 64px;
        overflow: hidden;
        margin-bottom: 10px;
        .borderRadius(4px);
      }
      .play-date {
        width: 54px;
        height: 64px;
        float: left;
        background: #dbe5ea;
        text-align: center;
        margin-right: 5px;
        dt {
          font-size: 28px;
          font-weight: 600;
        }
        dd {
          color: @lightColor;
          font-size: @normalSize;
        }
      }
      .item-detail {
        font-size: 11px;
        height: 64px;
        border: 1px dashed #ddd;
      }
      .time-block,
      .screen-block,
      .price-block,
      .buy-block {
        float: left;
        height: 100%;
        width: 75px;
        height: 100%;
      }
      .start-time {
        font-size: 20px;
        font-weight: 300;
        margin-top: 6px;
      }
      .end-time {
        margin-top: 2px;
      }
      .screen-type {
        height: 20px;
        margin-top: 10px;
        span {
          padding: 0 4px;
          height: 18px;
          display: flex;
          align-items: center;
          border: 1px solid @fff;
          .borderRadius(2px);
          float: left;
          .textCut();
          max-width: 60px;
        }
      }
      .language {
        margin-top: 4px;
      }
      .screen-name {
        height: 20px;
        margin-top: 12px;
        .textCut();
      }
      .flow {
        margin-top: 4px;
      }
      .price {
        padding-top: 14px;
        text-align: center;
        color: @errorColor;
        font-weight: 400;
        font-size: @normalSize;
      }
      .buy-block {
        float: left;
        text-align: center;
      }
      .go-buy {
        display: inline-block;
        width: 46px;
        height: 24px;
        line-height: 24px;
        border: 1px solid @errorColor;
        color: @fff;
        background: @errorColor;
        margin: 20px 0 0 0;
        .borderRadius(20px);
      }
    }
    .film-intro {
      text-align: center;
      height: 50px;
      h3 {
        margin-bottom: 5px;
        font-weight: 700;
      }
      p {
        color: @lightColor;
        .textCut();
      }
    }
    .film-detail {
      line-height: 20px;
      color: #666;
    }
  }
  .loading {
    .hzvc();
  }
}
</style>
