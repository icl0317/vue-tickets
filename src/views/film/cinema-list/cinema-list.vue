<template>
  <div id="cinema-list">
    <topBar :backShow="false" title="选择影院">
      <span class="go-info iconfont" @click="goCityList">城市列表</span>
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
        <div class="price-up">
          <span>32元</span>起
        </div>
        <div class="dis" v-if="item.dis">{{item.dis}}km</div>
      </li>
    </ul>
    <loading :isShow="loading"></loading>
  </div>
</template>

<script>
import topBar from "@/components/topBar/topbar";
import loading from "@/components/loading/loading";
import { getCinemaList } from "@/api/api";
import { Toast } from "mint-ui";
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
      city: ""
    };
  },
  methods: {
    //获取影院列表
    getCinemaDate() {
      getCinemaList({ city: this.city }).then(res => {
        let { code, data, msg } = res;
        if (code == 0) {
          if(data.userLng){
            data.data.forEach(v=>{
              v.dis = this.getDistance(data.userLat,data.userLng,v.lat,v.lng);
            })
          }
          this.cinemaData = data.data;
        } else {
          Toast(msg);
        }
        this.loading = false;
      });
    },
    //进入首页排期
    toIndexFilm(cinema_id) {
      this.$router.push({
        name: "film-list",
        query: { cinema_id }
      });
    },
    //去城市列表
    goCityList() {
      this.$router.push({
        name: "city-list"
      });
    },
    //计算2点间距离
    getDistance(lat1, lng1, lat2, lng2) {
      var f = this.getRad((lat1*1 + lat2*1) / 2);
      var g = this.getRad((lat1*1 - lat2*1) / 2);
      var l = this.getRad((lng1*1 - lng2*1) / 2);
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
  mounted() {
    this.city = this.$route.query.city;
    if (this.city) {
      this.getCinemaDate();
    }
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
    right: 10px;
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
}
</style>