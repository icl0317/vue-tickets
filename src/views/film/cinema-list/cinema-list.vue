<template>
  <div id="cinema-list">
    <topBar :backShow="false" title="选择影院">
      <span class="go-info iconfont" @click="goCityList">学校列表</span>
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
      college_id:""
    };
  },
  methods: {
    //获取影院列表
    getCinemaDate() {
      let { college_id } = this.$route.query;
      if (!college_id) return;
      this.college_id = college_id;
      localStorage.college_id = college_id;
      getCinemaList({ college_id }).then(res => {
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
        query:{cinema_id,college_id:this.college_id}
      });
      localStorage.cinema_id = cinema_id;
    },
    //去城市列表
    goCityList() {
      this.$router.push({
        name: "college-list",
        params:this.$route.query
      });
    }
  },
  mounted() {
    this.getCinemaDate();
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin";
#cinema-list {
  background: #fff;
  .cinema li {
    background: #f3f3f3;
    padding: 10px 15px;
  }
  .cinema .odd {
    background: #fff;
  }
  .go-info{ position: absolute; right: 10px; top: 0; font-size: @smallSize;}
}
</style>