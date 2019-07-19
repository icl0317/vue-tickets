<template>
  <div id="city-list">
    <topBar></topBar>
    <div class="search-city">
      <mt-search v-model="sValue" cancel-text="取消" placeholder="输入城市名"></mt-search>
    </div>
    <!-- <dl class="location" v-show="locationCollege">
      <dt>定位城市大学</dt>
      <dd>
        <span class="city-name" v-if="!locationCollegeId">{{locationCollege}}</span>
        <span class="city-name" v-if="locationCollegeId" @click="toLocationCinema(locationCollegeId)">{{locationCollege}}</span>
      </dd>
    </dl> -->
    <!-- <dl class="hot-city">
      <dt>热门城市</dt>
      <dd>
        <span class="city-name">北京</span>
        <span class="city-name">上海</span>
        <span class="city-name">天津</span>
        <span class="city-name">重庆</span>
        <span class="city-name">深圳</span>
      </dd>
    </dl>-->
    <dl class="city-list" v-for="(item,index) in formatCity" :key="index">
      <dt>{{item.province}}</dt>
      <dd>
        <div class="citys" v-for="(v,idx) in item.children" :key="idx">
          <router-link :to="'/cinema-list?city='+v.city">{{v.city}}</router-link>
        </div>
      </dd>
    </dl>
    <loading :isShow="loading"></loading>
  </div>
</template>

<script>
import topBar from "@/components/topBar/topbar";
import loading from "@/components/loading/loading";
import { getCityList } from "@/api/api";
import { findInArr, rmSame } from "@/utils/util";
import { Toast } from 'mint-ui';
export default {
  name: "",
  components: {
    topBar,
    loading
  },
  data() {
    return {
      sValue: "",
      loading:"",
      citys: [], //城市列表
      locationCollege: "",
      locationCollegeId: ""
    };
  },
  methods: {
    getCityData() {
      this.loading=true;
      getCityList().then(res => {
        let { code, msg, data } = res;
        if(code == 0){
          this.citys = rmSame(data,'city');
        }else{
          Toast(msg);
        }
        this.loading=false;
      });
    },
    //从定位学校去影院列表
    toLocationCinema(locationCollegeId) {
      this.$router.push({
        name:"cinema-list",
        query:{
          college_id:locationCollegeId
        }
      });
    }
  },
  computed:{
    //城市列表数据格式转换
    formatCity:function(){
      let arr = [];
      this.citys.forEach(v => {
        let json = {};
        json.province = v.province.split(',')[0];
        json.children = [
          {
            _id: v._id,
            city: v.city.split(',')[0]
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
  mounted() {
    let { college_name, college_id, err } = this.$route.params;
    this.getCityData();
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin";
#city-list {
  background: #fff;
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
      background: #f3f3f3;
      padding: 0 10px;
      
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
      
      a{ display: block; padding: 8px 0;}
    }
  }
  .city-list {
    dd {
      padding: 4px 10px;
    }
  }
}
</style>