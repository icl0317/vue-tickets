<template>
  <div id="news-detail">
      <topBar></topBar>
      <h3 class="title">{{articleDetail.title}}</h3>
      <div class="date">{{articleDetail.release_date | YMD}}</div>
      <div class="article" v-html="articleDetail.content"></div>
      <div class="mutual">
        <span>阅读：{{articleDetail.views}}</span>
        <span @click="goodLike(articleDetail._id)"><i class="good iconfont" :class="{liked:isClikcLike}">&#xe64c;</i> {{articleDetail.like}}</span>
      </div>
      <loading :isShow="loading"></loading>
  </div>
</template>
<script>
import topBar from "@/components/topBar/topbar";
import { getFindDetail, like } from "@/api/api";
import { parseDateTime } from '@/utils/index';
import loading from "@/components/loading/loading";
import Cookies from 'js-cookie';
export default {
  components:{
      topBar,
      loading
  },
  data() {
    return {
      loading:true,
      newsId:null,
      articleDetail:{
        title:'',
        release_date:'',
        content:'',
        views:'',
        like:'',
        _id:null
      },
      isClikcLike:false  //true点过 false没点过
    };
  },
  methods:{
    getDetail(){
      this.loading = true;
      getFindDetail({_id:this.newsId}).then(res=>{
        let {data, msg, code} = res;
        if(code == 0){
          this.articleDetail.title = data.title;
          this.articleDetail.release_date = data.release_date;
          this.articleDetail.content = data.content;
          this.articleDetail.views = data.views;
          this.articleDetail.like = data.like;
          this.articleDetail._id = data._id;
        }else{

        }
        this.loading = false;
        let getLike = Cookies.get('likes');
        if(getLike){
         this.isClikcLike = getLike.split(',').includes(data._id);
        }
      })
    },
    //点赞
    goodLike(_id){
      let getLike = Cookies.get('likes') || '';
      let status  = this.isClikcLike ? -1 : 1;
      like({_id,status}).then(res=>{
        let {data,code,msg} = res;
        if(code == 0){
          if(status == 1){
            Cookies.set('likes', `${getLike}${_id},`, { expires: 1, path: '' });
            this.articleDetail.like += 1; 
            this.isClikcLike = true;
          }else if(status == -1){
            let re =new RegExp(`${_id},`);
            getLike = getLike.replace(re,'');
            Cookies.set('likes', `${getLike},`, { expires: 1, path: '' });
            this.articleDetail.like -= 1;
            this.isClikcLike = false;
          }

        }
      })
    }
  },
  created(){
    this.newsId = this.$route.query._id;
  },
  mounted(){
    this.getDetail();
  },
  filters:{
    YMD:function(val){
      return parseDateTime(val,'{Y}-{M}-{D}')
    }
  }
};
</script>

<style lang="less">
@import "../../../style/mixin";
#news-detail{
  .title{ font-size: @bigSize; font-weight: 600;}
  .article{ padding: 14px; line-height: 22px; font-size: @normalSize;
    img{ max-width: 100%;}
  }
  .title{ padding: 14px 14px 5px;}
  .date{ padding: 0 14px;}
  .mutual{ display: flex; justify-content: space-between; padding: 0 14px 14px ; }
  .good{ color: #777; font-style: normal;}
  .liked{ color: #f00;}
}
</style>