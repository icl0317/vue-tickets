<template>
  <div id="news">
    <div class="news-block">
      <div class="date">2018-06-12</div>
      <div class="new-pic" @click="inDetail">
        <img src="../../assets/3.jpg" width="100%">
      </div>
      <h3 class="news-title" @click="inDetail">驯龙高手3：爱的终章是自由</h3>
      <div
        class="news-intro"
      >作为一名《驯龙高手》系列的老粉丝，看到了这个系列的终章，感触非常深。 《驯龙》的前两部作品，还是带有相当的完美主义色彩： ——不被认可的少年，结果证明是持有真理和能量的拯救者； ——龙和人之间多年来不可调和的冲突变成了和谐相处之道； ——失散多年家庭的团聚和爱情的萌芽； ——小嗝嗝和无牙仔之间亲密无间的友情。 但是到了这第三部，似乎一切都回到了残酷的现实： ——因为收留的龙越来越多，博克岛变得越来越不适宜居住； ——因为博克岛收养龙的名声，越来越多的人把博克岛当成是异类和眼中钉，以及抓龙的目标地； ——随着无牙仔的长大，它有了伴侣的需要，这时正好出现了Light Fury（白光煞，还是一只小母龙）。</div>
      <div class="cont">
        <div class>阅读：150 点赞：50</div>
      </div>
    </div>

    <div class="news-block">
      <div class="date">2018-06-12</div>
      <div class="new-pic" @click="inDetail">
        <img src="../../assets/3.jpg" width="100%">
      </div>
      <h3 class="news-title" @click="inDetail">驯龙高手3：爱的终章是自由</h3>
      <div
        class="news-intro"
      >作为一名《驯龙高手》系列的老粉丝，看到了这个系列的终章，感触非常深。 《驯龙》的前两部作品，还是带有相当的完美主义色彩： ——不被认可的少年，结果证明是持有真理和能量的拯救者； ——龙和人之间多年来不可调和的冲突变成了和谐相处之道； ——失散多年家庭的团聚和爱情的萌芽； ——小嗝嗝和无牙仔之间亲密无间的友情。 但是到了这第三部，似乎一切都回到了残酷的现实： ——因为收留的龙越来越多，博克岛变得越来越不适宜居住； ——因为博克岛收养龙的名声，越来越多的人把博克岛当成是异类和眼中钉，以及抓龙的目标地； ——随着无牙仔的长大，它有了伴侣的需要，这时正好出现了Light Fury（白光煞，还是一只小母龙）。</div>
      <div class="cont">
        <div class>阅读：150 点赞：50</div>
      </div>
    </div>
    <fixedFoot></fixedFoot>
  </div>
</template>
<script>
import fixedFoot from "@/components/fixedFooter/foot";
export default {
  name: "",
  components: {
    fixedFoot
  },
  data() {
    return {};
  },
  methods: {
    inDetail() {
      this.$router.push({
        name: "detail",
        params:{
          id:1
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
#news {
  background: #f3f3f3;
  min-height: 100%;
  padding-top: 10px;
  margin-bottom: 46px;
  .news-block {
    padding: 10px 15px;
    background: #fff;
    margin-bottom: 10px;
    .date {
      text-align: right;
      margin-bottom: 10px;
    }
  }
  .new-pic {
    margin-bottom: 10px;
  }
  .new-pic img {
    .borderRadius(4px);
  }
  .news-title {
    font-size: @bigSize;
    margin-bottom: 10px;
  }
  .news-intro {
    line-height: 1.6;
    .RowsCut(6);
    text-align: justify;
    margin-bottom: 10px;
  }
  .cont {
    color: @lightColor;
  }
}
</style>