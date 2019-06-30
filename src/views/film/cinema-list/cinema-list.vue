<template>
  <div id="cinema-list">
    <topBar :backShow="false" title="选择影院">
      <span class="go-info iconfont" @click="goCityList">城市列表</span>
    </topBar>
    <ul class="cinema">
      <li :class="[index % 2 == 0 ? 'even' : 'odd' ]" v-for="(item,index) in cinemaData" :key="index" @click="toIndexFilm(item._id)">
        {{item.cinema_name}}
      </li>
    </ul>
    <loading :isShow="loading"></loading>
  </div>
</template>

<script>
import topBar from "@/components/topBar/topbar";
import loading from "@/components/loading/loading";
import { getCinemaList } from "@/api/api";
import { Toast } from 'mint-ui';
export default {
  name: "",
  components: {
    topBar,
    loading
  },
  data() {
    return {
      loading:"",
      cinemaData: [],
      city:""
    };
  },
  methods: {
    //获取影院列表
    getCinemaDate() {
      getCinemaList({ city:this.city }).then(res => {
        let { code, data, msg } = res;
        if (code == 0) {
          this.cinemaData = data;
        }else{
          Toast(msg);
        }
        this.loading=false;
      });
    },
    //进入首页排期
    toIndexFilm(cinema_id){
      this.$router.push({
        name:"film-list",
        query:{cinema_id}
      });
    },
    //去城市列表
    goCityList() {
      this.$router.push({
        name: "city-list"
      });
    }
  },
  mounted() {
    this.city = this.$route.query.city;
    if (this.city){
      this.getCinemaDate();
    };
    
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin";
#cinema-list {
  background: #fff;
  .cinema li {
    background: #f3f3f3;
    padding: 13px 15px;
    font-size: 14px;
  }
  .cinema .odd {
    background: #fff;
  }
  .go-info{ position: absolute; right: 10px; top: 0; font-size: @smallSize;}
}
</style>