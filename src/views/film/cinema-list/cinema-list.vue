<template>
  <div id="cinema-list">
    <topBar :backShow="false" title="选择影院">
      <span class="go-info iconfont" :class="{active: cityShow}" @click="cityListSet">
        {{queryCon.city}}
        <i class="sj"></i>
      </span>
    </topBar>
    <ul class="cinema">
      <li
        :class="[index % 2 == 0 ? 'even' : 'odd' ]"
        v-for="(item,index) in cinemaData"
        :key="index"
        @click="toIndexFilm(item._id)"
      >
        <p class="cinema-name">{{item.cinema_name}}</p>
        <p class="address">{{item.address}}</p>
        <div class="price-up" v-if="item.min_price">
          <span>{{item.min_price}}元</span>起
        </div>
        <div class="dis" v-if="item.dis">{{item.dis | unitFormat}}</div>
      </li>
    </ul>
    <div class="city-list-box" v-show="cityShow">
      <dl class="city-list" v-for="(item,index) in formatCity" :key="index">
        <dt>{{item.province}}</dt>
        <dd>
          <div class="citys" v-for="(v,idx) in item.children" :key="idx">
            <a href="javascript:;" @click="selectCity(v.city)">{{v.city}}</a>
          </div>
        </dd>
      </dl>
    </div>
    <loading :isShow="loading"></loading>
  </div>
</template>

<script>
import topBar from "@/components/topBar/topbar";
import loading from "@/components/loading/loading";
import { getCinemaList, getCityList } from "@/api/api";
import { Toast } from "mint-ui";
import { findInArr, rmSame } from "@/utils/util";
export default {
  name: "",
  components: {
    topBar,
    loading
  },
  data() {
    return {
      loading: "",
      cinemaData: [],
      cityList: [],
      cityShow: false,
      queryCon:{} //获取影院条件
    };
  },
  methods: {
    //获取影院列表
    getCinemaDate() {
      this.loading = true;
      getCinemaList(this.queryCon).then(res => {
        let { code, data, msg } = res;
        if (code == 0) {
          if (data.userLng) {
            data.data.forEach(v => {
              v.dis = this.getDistance(
                data.userLat,
                data.userLng,
                v.lat,
                v.lng
              );
            });
          }
          this.cinemaData = data.data;
        } else {
          Toast(msg);
        }
        this.loading = false;
      });
    },
    //获取城市列表
    getCityData() {
      this.loading = true;
      getCityList().then(res => {
        let { code, msg, data } = res;
        if (code == 0) {
          this.cityList = rmSame(data, "city");
        } else {
          Toast(msg);
        }
        this.loading = false;
      });
    },
    selectCity(city) {
      this.cityShow = false;
      this.queryCon.city = city;
      this.getCinemaDate();
    },
    //进入首页排期
    toIndexFilm(cinema_id) {
    
      this.$router.push({
        name: "film-list",
        query: { cinema_id, city: this.queryCon.city }
      });
    },
    //控制城市列表
    cityListSet() {
      this.cityShow = !this.cityShow;
      if(this.cityShow)this.getCityData();
    },
    //计算2点间距离
    getDistance(lat1, lng1, lat2, lng2) {
      var f = this.getRad((lat1 * 1 + lat2 * 1) / 2);
      var g = this.getRad((lat1 * 1 - lat2 * 1) / 2);
      var l = this.getRad((lng1 * 1 - lng2 * 1) / 2);
      var sg = Math.sin(g);
      var sl = Math.sin(l);
      var sf = Math.sin(f);
      var s, c, w, r, d, h1, h2;
      var a = 6378137.0; //The Radius of eath in meter.
      var fl = 1 / 298.257;
      sg = sg * sg;
      sl = sl * sl;
      sf = sf * sf;
      s = sg * (1 - sl) + (1 - sf) * sl;
      c = (1 - sg) * (1 - sl) + sf * sl;
      w = Math.atan(Math.sqrt(s / c));
      r = Math.sqrt(s * c) / w;
      d = 2 * w * a;
      h1 = (3 * r - 1) / 2 / c;
      h2 = (3 * r + 1) / 2 / s;
      s = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
      s = s / 1000;
      s = s.toFixed(2); //指定小数点后的位数。
      return s;
    },
    getRad(d) {
      var PI = Math.PI;
      return (d * PI) / 180.0;
    }
  },
  computed: {
    //城市列表数据格式转换
    formatCity: function() {
      let arr = [];
      this.cityList.forEach(v => {
        let json = {};
        json.province = v.province.split(",")[0];
        json.children = [
          {
            _id: v._id,
            city: v.city.split(",")[0]
          }
        ];
        if (findInArr(arr, json, "province") == -1) {
          arr.push(json);
        } else {
          arr[findInArr(arr, json, "province")].children = arr[
            findInArr(arr, json, "province")
          ].children.concat(json.children);
        }
      });
      return arr;
    }
  },
  filters:{
    unitFormat:function(val){
      return val < 1000 ? `${val}m` : `${(val/1000).toFixed(1)}km`;
    }
  },
  mounted() {
    let { lat, lng, city } = this.queryCon = this.$route.query;
    if (city) {
      this.getCinemaDate();
    }else{
      this.cityShow = true;
    }
    this.getCityData();
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin";
#cinema-list {
  background: #fff;
  .cinema li {
    background: #fbfbfb;
    padding: 12px 50px 12px 12px;
    color: #999;
    position: relative;
  }
  .cinema .odd {
    background: #fff;
  }
  .cinema-name {
    margin-bottom: 3px;
    font-weight: 700;
    font-size: 14px;
    color: @deepColor;
  }
  .go-info {
    position: absolute;
    left: 10px;
    top: 0;
    font-size: @smallSize;
  }
  .address {
    font-size: @smallSize;
  }
  .price-up {
    position: absolute;
    right: 15px;
    top: 13px;
    span {
      color: @errorColor;
    }
  }
  .dis {
    position: absolute;
    right: 15px;
    top: 33px;
  }
  .city-list-box {
    position: absolute;
    left: 0;
    top: 48px;
    right: 0;
    bottom: 0;
    background: @fff;
    .search-city {
      height: 44px;
    }
    .location,
    .hot-city,
    .city-list {
      font-size: @normalSize;
      dt {
        height: 34px;
        line-height: 36px;
        background: #fafafa;
        padding: 0 10px;
        font-weight: 700;
      }
      dd {
        padding: 10px;
      }
      .city-name {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        padding: 1px 12px 2px;
        background: #f3f3f3;
        margin: 0 5px 0 0;
      }
      .citys {
        a {
          display: block;
          padding: 8px 0;
        }
      }
    }
    .city-list {
      dd {
        padding: 4px 10px;
      }
    }
  }
  .sj {
    -webkit-backface-visibility: hidden;
    position: absolute;
    right: -12px;
    top: 22px;
    width: 0;
    height: 0;
    border-width: 4px;
    border-style: solid dashed dashed;
    border-color: #fff transparent transparent;
    font-size: 0;
    line-height: 0;
  }
  .go-info.active {
    .sj {
      -webkit-transform: rotate(-180deg);
      transform: rotate(-180deg);
      top: 18px;
    }
  }
}
</style>