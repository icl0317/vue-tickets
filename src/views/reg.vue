<template>
  <div id="reg">
    <div class="login-icon">
      <i class="logo iconfont">&#xe600;</i>
    </div>
    <ul class="login-form">
        <li><input type="text" name="" class="text" v-model="regInfo.username" placeholder="手机号/会员名"></li>
        <li><input type="password" name="" class="text" v-model="regInfo.password" placeholder="请输入密码"></li>
        <li><input type="password" name="" class="text" v-model="regInfo.configPassword" placeholder="请确认密码"></li>
        <li style="padding-top:20px;"><button type="button" class="loginbtn" @click="reg">注 册</button></li>
        <li class="to-right"><router-link to="/login">快速登录</router-link></li>
    </ul>
  </div>
</template>
<script>
import { userReg } from '@/api/api';
import { Toast } from 'mint-ui';
import Cookies from 'js-cookie';
export default {
  data() {
    return {
      regInfo:{
        username:'',
        password:'',
        configPassword:''
      }
    }
  },
  methods:{
   reg(){
     userReg(this.regInfo).then(res=>{
       let {data,code,msg} = res;
       if(code == 0){
         Toast(msg);
         setTimeout(() => {
            this.$router.push({
              name:'login'
            })
         }, 2000);
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
#reg {
  .login-icon {
    text-align: center;
    padding: 30px 0;
  }
  .logo {
    font-size: 70px;
    font-weight: 500;
    color: #e6a23c;
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
  .loginbtn{ border: none; width: 100%; height: 40px; background: #e6a23c; .borderRadius(4px); font-size: @bigSize; color: @fff;}
}
</style>
