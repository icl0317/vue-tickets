<template>
  <div id="my">
    <div class="user-info">
      <dl class="user">
        <dt>
          <img src="../../images/default_photo.png" width="46" height="46" />
        </dt>
        <dd>{{username}}</dd>
      </dl>
      <div class="my-list">
        <ul>
          <li @click="goTickets">
            <div>
              <span class="my-icon iconfont">&#xe694;</span>电影票
            </div>
            <div>
              <mt-badge size="small" color="#ff9900" v-show="data.unpay != 0">{{data.unpay}}</mt-badge>
              <span class="go-in iconfont">&#xe61f;</span>
            </div>
          </li>
          <li></li>
        </ul>
      </div>
    </div>
    
    <fixedFoot></fixedFoot>
  </div>
</template>

<script>
import fixedFoot from "@/components/fixedFooter/foot";
import io from "socket.io-client";
import { myInfo } from "@/api/api";
import { mapGetters } from 'vuex'
export default {
  name: "",
  components: {
    fixedFoot
  },
  data() {
    return {
      data: {
        unpay:0
      }
    };
  },
  methods: {
    goTickets() {
      this.$router.push({
        name: "tickets"
      });
    },
    getUnPayOrder() {
      // var socket = io.connect('http://127.0.0.1:8084');
      // socket.on('unpay',  (data) => {
      //   console.log(data);
      //   socket.emit('token', {token:this.token});
      // });
      myInfo().then(res => {
        let { code, msg, data } = res;
        if (code == 0) {
          this.data = data;
        }
      });
    }
  },
  mounted() {
    this.getUnPayOrder();
  },
  computed:{
    ...mapGetters([
      'username'
    ])
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
#my {
  background: #f5f5f5;
  height: 100%;
  .user-info {
    background: @errorColor;
    height: 80px;
    .borderRadius(0 0 10px 10px);
  }
  .user {
    padding: 10px 15px;
    overflow: hidden;
    dt {
      float: left;
      margin-right: 10px;
    }
    dd {
      font-size: 24px;
      color: @fff;
      margin-top: 5px;
    }
  }
  .my-list {
    padding: 0 10px 0;
    ul {
      background: @fff;
      .borderRadius(5px);
    }
    li {
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid @ddd;
      font-size: @normalSize;
    }
    li:last-child {
      border: none;
    }
    .go-in {
      float: right;
      color: @lightColor;
      margin-right: 10px;
    }
  }
  .my-icon {
    margin: 0 5px 0 10px;
    font-size: 18px;
    vertical-align: middle;
  }
}
</style>