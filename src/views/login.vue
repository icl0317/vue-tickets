<template>
  <div id="login">
    <div class="login-icon">
      <i class="logo iconfont">&#xe600;</i>
    </div>
    <ul class="login-form">
        <li><input type="text" name="" class="text" v-model="loginInfo.username" placeholder="手机号/会员名"></li>
        <li><input type="text" name="" class="text" v-model="loginInfo.password" placeholder="请输入密码"></li>
        <li style="padding-top:20px;"><button type="button" class="loginbtn" @click="login">登 录</button></li>
        <li class="to-right"><router-link to="/reg">还没账号？去注册</router-link></li>  
    </ul>
  </div>
</template>
<script>
import { userLogin } from '@/api/api';
import { Toast } from 'mint-ui';
import Cookies from 'js-cookie';
export default {
  data() {
    return {
      loginInfo:{
        username:'',
        password:''
      }
    }
  },
  methods:{
   login(){
     userLogin(this.loginInfo).then(res=>{
       let {data,code,msg} = res;
       if(code == 0){
         Cookies.set('piao_token',data.token,{ expires: 1 })
         Cookies.set('piao_username',data.username,{ expires: 1 })
         this.$store.state.piaoToken = data.token;
         this.$store.state.piao_username = data.username;
         this.$router.push({
           name:'film-list'
         })
       }else{
         Toast(msg);
       }
     })
   }
  },
  mounted(){
    
  }
}
</script>
<style lang="less">
@import "../style/mixin";
#login {
  .login-icon {
    text-align: center;
    padding: 30px 0;
  }
  .logo {
    font-size: 70px;
    font-weight: 500;
    color: #66b1ff;
  }
  .login-form{
      width: 80%;
      margin: auto;
      li{ text-align: center; margin-bottom: 20px;}
      .to-right { text-align: right;}
  }
  .login-form .text{
      height: 40px;
      line-height: 40px;
      padding: 5px;
      width: 100%;
      border: none;
      border: 0;
      border-bottom: 1px solid @ddd;
      font-size: @bigSize;
  }
  .loginbtn{ border: none; width: 100%; height: 40px; background: #66b1ff; .borderRadius(4px); font-size: @bigSize; color: @fff;}
  
}
</style>
