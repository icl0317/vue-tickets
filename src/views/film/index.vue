<template>
  <div id="film">
      <div class="film-content">
        <div class="header" @click="goCityList">
          <dl class="cinema-info">
            <dt>{{cinemaInfo.cinema_name}}</dt>
            <dd>{{cinemaInfo.address}}</dd>
          </dl>
          <span class="go-info iconfont">&#xe61f;</span>
        </div>
        <div v-if="filmData">
          <div class="swipe-wrap">
            <div class="swipe-slide" ref="swipeSlide">
              <ul class="imgs clearfix" ref="imgs" style="-webkit-transform:translate3d(150px,0,0)">
                <li
                  v-for="(item , index) in filmData"
                  :key="index"
                  :class="{active : index == filmiNow}"
                >
                  <img :src="item.film_photo" />
                </li>
              </ul>
              <b class="center-mark"></b>
            </div>
          </div>

          <div class="film-intro" v-if="filmData[filmiNow]">
            <h3>{{filmData[filmiNow].film_name}}</h3>
            <p>{{filmData[filmiNow].film_long}}分钟 | {{filmData[filmiNow].film_type}} | {{filmData[filmiNow].actors}}</p>
          </div>

          <div class="film-info">
            <div class="film-tag-bar">
              <span :class="{active:playiNow == 0}" @click="playShow(0)">放映信息</span>
              <span :class="{active:playiNow == 1}" @click="playShow(1)">影片介绍</span>
            </div>

            <div class="play-detail" v-show="playiNow == 0">
              <ul v-if="filmData[filmiNow]">
                <li v-for="(item , index) in filmData[filmiNow].children" :key="index">
                  <dl class="play-date" v-if="item._start_datetime">
                    <dt>{{item._start_datetime.D}}</dt>
                    <dd>{{item._start_datetime.M}}月</dd>
                  </dl>
                  <div class="item-detail">
                    <div class="time-block" v-if="item._end_datetime">
                      <div class="start-time">{{item._start_datetime.h}}:{{item._start_datetime.m}}</div>
                      <div class="end-time">{{item._end_datetime.h}}:{{item._end_datetime.m}}散场</div>
                    </div>
                    <div class="screen-block" style="width:80px;">
                      <div class="screen-name">{{item.screen_name}}</div>
                      <div class="language">{{item.language}} {{item.screen_type}}</div>
                    </div>
                    <div class="price-block" style="width:65px;">
                      <div class="price">
                        特惠
                        <br />
                        {{item.sell_price}}元
                      </div>
                    </div>
                    <div class="buy-block" @click="toSelectSeat(item.screen_id,item.session_id)">
                      <div class="go-buy">购票</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="film-detail" v-show="playiNow == 1" v-if="filmData[filmiNow]">{{filmData[filmiNow].brief}}</div>
          </div>
        </div>
        {{bb}}
        <noData :isShow="!filmData" title="还没有排期，换其他影院看看吧~"></noData>
      </div>
    
    <fixedFoot></fixedFoot>
    <loading :isShow="loading"></loading>
  </div>
</template>

<script>
import fixedFoot from "@/components/fixedFooter/foot";
import loading from "@/components/loading/loading";
import noData from "@/components/noData/nodata";
import { timeFormat, findInArr } from "@/utils/util";
import { getIndexFilmList, getLocationCollege, getCinemaList } from "@/api/api";
import "@/utils/geolocation.min";

export default {
  name: "film-list",
  components: {
    fixedFoot,
    loading,
    noData
  },
  data() {
    return {
      allLoaded:false,
      loading: "",
      filmiNow: 0,
      playiNow: 0,
      filmData: null,
      cinemaInfo: {
        cinema_name: "",
        address: "",
        cinema_id: null, //影院id
        city:null
      },
      cc:0,
      bb:''
    };
  },
  methods: {
    //去城市列表
    goCityList() {
      this.$router.push({
        name: "cinema-list",
        query:{city:this.cinemaInfo.city }
      });
    },
    //去座位图
    toSelectSeat(screen_id, session_id) {
      
      this.$router.push({
        name: "seat",
        query: {
          screen_id,
          session_id
        }
      });
    },
    //放映信息 影片介绍
    playShow(param) {
      this.playiNow = param;
    },
    //获取排期数据
    getFilmData() {
      this.loading = true;
      getIndexFilmList({ cinema_id: this.cinemaInfo.cinema_id }).then(res => {
        let { code, data, msg } = res;
        if (code == 0) {
          this.filmData = this.formatFilmData(data.session);
          this.cinemaInfo.cinema_name = data.info.cinema_name;
          this.cinemaInfo.address = data.info.address;
        } else if (code == 1) {
          this.cinemaInfo.cinema_name = "请选择城其他影院";
          this.cinemaInfo.address = "暂无影片";
        } else if (code == 2) {
          this.$router.push({
            name: "city-list"
          });
          return;
        }

        this.loading = false;

        setTimeout(()=>{
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
        },1000)
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
            session_id: v._id,
            screen_id: v.screen_id,
            _start_datetime:timeFormat(v.start_datetime),
            _end_datetime:timeFormat(v.end_datetime)
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
    //定位
    getPos() {
      let _this = this;
      let geolocation = new qq.maps.Geolocation(
        "EZMBZ-A4MEX-MWA4L-T4MZK-66OO5-3OBTD",
        "film"
      );
      geolocation.getLocation(
        function(res) {
          let { lat, lng } = res;
          getLocationCollege({ lat, lng }).then(res => {
            let { code, data, msg } = res;
            if (code == 0) {
              _this.$store.state.currentCinemaId = sessionStorage.cinema_id = _this.cinemaInfo.cinema_id = data._id;
              _this.getFilmData();
            } else {
              //定位失败或没有定位学校
              _this.hasPosCinema = "没有获取到附近影院";
              _this.cinemaInfo.cinema_name = "请选择城市";
              _this.cinemaInfo.address = "定位失败";
              // _this.$router.push({
              //   name: "city-list",
              //   query: {
              //     err: "定位失败"
              //   }
              // });
            }
            _this.loading = false;
          });
        },
        function(err) {
          //用户拒绝定位
          // _this.$router.push({
          //   name: "city-list",
          //   query: {
          //     err: "定位失败"
          //   }
          // });
        }
      );

      //实时监听位置变化
      geolocation.watchPosition(function(res){
        
      })
    }
  },
  created() {
    if(this.$route.query.cinema_id){
      sessionStorage.cinema_id = this.cinemaInfo.cinema_id = this.$route.query.cinema_id;
    }else{
      this.cinemaInfo.cinema_id = sessionStorage.cinema_id;
    }
    this.cinemaInfo.city = this.$route.query.city;
  },
  mounted() {
    let getCinemaId = this.$route.query.cinema_id;
    if(getCinemaId){
      this.$store.state.currentCinemaId = sessionStorage.cinema_id = this.cinemaInfo.cinema_id = getCinemaId;
    }else{
      this.cinemaInfo.cinema_id = this.$store.state.currentCinemaId;
    }
    if (!this.cinemaInfo.cinema_id) {
      this.getPos();
    } else {
      this.getFilmData();
    }
    this.getPos();
  }
};
</script>
<style lang="less">
@import "../../style/mixin";

#film {
  padding-bottom: 40px;
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
      width: 100%;
      dt {
        font-size: @bigSize;
      }
      dd {
        color: @lightColor;
        width: 95%;
        .textCut();
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
      .time-block {
        padding-left: 4px;
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
        padding: 0 10px;
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
  .has-pos-cinema {
    position: absolute;
    left: 0;
    right: 0;
    top: 48px;
    bottom: 46px;
    background: #f4f4f4;
  }
  
}
</style>
