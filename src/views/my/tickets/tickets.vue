<template>
  <div id="tickets">
    <topBar></topBar>
    <ul class="list">
      <li :class="[server_time > dateTime2Stamp(item.end_datetime) ? 'over' : 'unplay']" v-for="(item,index) in list" :key="index">
        <div class="piao-status">
          <i class="top"></i>
          <span class="play-icon iconfont">&#xe6ee;</span>
          <i class="bot"></i>
        </div>
        <div class="film-info" @click="goDetail(item._id)">
          <h3 class="film-name">{{item.film_name}} {{item.seat && item.seat.length}}张</h3>
          <div class="start-time">{{item.start_datetime}}</div>
          <div class="address">{{item.cinema_name}}</div>
          <span class="go-play" v-if="item.status == 0">去支付</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import topBar from "@/components/topBar/topbar";
import { getOrderList } from "@/api/api";
import { Toast } from "mint-ui";
import { timeFormat, dateTime2Stamp } from "@/utils/index";
export default {
  name: "",
  components: {
    topBar
  },
  data() {
    return {
      list: [],
      server_time:null
    };
  },
  methods: {
    getList() {
      getOrderList().then(res => {
        let { code, msg, data } = res;
        if (code == 0) {
          this.server_time = data.server_datetime;
          this.list = data.list;;
        } else {
          Toast(msg);
        }
      });
    },
    //去详情
    goDetail(id){
      this.$router.push({
        name:'order-detail',
        query:{
          order_id:id
        }
      })
    },
    dateTime2Stamp(d){
      return dateTime2Stamp(d);
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin";
#tickets {
  background: #f5f5f5;
  min-height: 100%;
  .list {
    li {
      height: 70px;
      background: @fff;
      margin-top: 8px;
      overflow: hidden;
      position: relative;
    }
    .piao-status {
      width: 55px;
      border-right: 1px dashed @ddd;
      height: 70px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      float: left;
      i {
        position: absolute;
        width: 10px;
        height: 10px;
        .borderRadius(10px);
        right: -5px;
        background: #f5f5f5;
      }
      .top {
        top: -6px;
      }
      .bot {
        bottom: -6px;
      }
    }
    .play-icon {
      font-size: 24px;
    }
    .film-info {
      margin-left: 65px;
    }
    .film-name {
      font-size: @normalSize;
      margin-top: 6px;
    }
    .start-time,
    .address {
      margin-top: 3px;
    }
    .over {
      .play-icon,
      .film-name,
      .start-time,
      .address {
        color: #ccc;
      }
    }
    .unplay {
      .play-icon {
        color: @warnColor;
      }
    }
    .go-play {
      width: 58px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      color: @fff;
      position: absolute;
      right: 15px;
      top: 22px;
      background: @warnColor;
      .borderRadius(30px);
    }
  }
}
</style>