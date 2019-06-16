<template>
  <div id="college-list">
    <topBar></topBar>
    <div class="search-city">
      <mt-search v-model="sValue" cancel-text="取消" placeholder="输入城市名"></mt-search>
    </div>
    <dl class="location" v-show="locationCollege">
      <dt>定位城市大学</dt>
      <dd>
        <span class="city-name" v-if="!locationCollegeId">{{locationCollege}}</span>
        <span class="city-name" v-if="locationCollegeId" @click="toLocationCinema(locationCollegeId)">{{locationCollege}}</span>
      </dd>
    </dl>
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
    <dl class="city-list" v-for="(item,index) in colleges" :key="index">
      <dt>{{item.province}}</dt>
      <dd>
        <div class="citys" v-for="(v,idx) in item.children" :key="idx">
          <router-link :to="'/cinema-list?college_id='+v._id">{{v.college_name}}</router-link>
        </div>
      </dd>
    </dl>
    <loading :isShow="loading"></loading>
  </div>
</template>

<script>
import topBar from "@/components/topBar/topbar";
import loading from "@/components/loading/loading";
import { getCollegeList } from "@/api/api";
import { findInArr } from "@/utils/util";
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
      colleges: [], //學校列表
      locationCollege: "",
      locationCollegeId: ""
    };
  },
  methods: {
    getCollegeData() {
      getCollegeList().then(res => {
        let { code, msg, data } = res;
        if(code == 0){
          let arr = [];
          data.forEach(v => {
            let json = {};
            json.province = v.province;
            json.children = [
              {
                _id: v._id,
                college_name: v.college_name,
                city: v.city,
                address: v.address
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
          this.colleges = arr;
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
  mounted() {
    let { college_name, college_id, err } = this.$route.params;
    this.locationCollege = college_name || err;
    this.locationCollegeId = college_id;
    console.log();
    this.getCollegeData();
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin";
#college-list {
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
      padding: 8px 0;
    }
  }
  .city-list {
    dd {
      padding: 4px 10px;
    }
  }
}
</style>