<template>
  <div id="login">
    <div class="login-icon">
      <i class="logo iconfont">&#xe600;</i>
    </div>
    <ul class="login-form">
        <li><input type="text" name="" class="text" placeholder="手机号/会员名"></li>
        <li><input type="password" name="" class="text" placeholder="请输入密码"></li>
        <li style="padding-top:20px;"><button type="button" class="loginbtn">登 录</button></li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
     
    }
  },
  methods:{
   
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
