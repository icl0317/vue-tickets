<template>
  <div id="page404">
    <div class="container">
      <div class="cube">
        <div class="front">404<br/>页面飞走了</div>
        <div class="back">404<br/>页面飞走了</div>
        <div class="right">404<br/>页面飞走了</div>
        <div class="left">404<br/>页面飞走了</div>
        <div class="top">404<br/>页面飞走了</div>
        <div class="bottom">404<br/>页面飞走了</div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      
    }
  },
  methods:{

  }
}
</script>
<style lang="less">
@import "../style/mixin";
#page404 {
  .container{
    width: 100px;
    height: 100px;
    margin: 0 auto;
    position: fixed;
    z-index: 999;
    -webkit-perspective: 1000px;
    perspective: 1000px;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .cube {
    width: 100%;
    height: 100%;
    position: absolute;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-transform: rotateX(-15deg) rotateY(-20deg) translateZ(-100px);
    transform: rotateX(-15deg) rotateY(-20deg) translateZ(-100px);
    -webkit-transform-origin: center center -100px;
    transform-origin: center center -100px;
    -webkit-animation: around 5s cubic-bezier(0.94, -0.6, 0.45, 1.31) infinite;
    animation: around 5s cubic-bezier(0.94, -0.6, 0.45, 1.31) infinite;
}
.cube div {
    width: 120px;
    height: 120px;
    display: block;
    margin: 0;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
    font-size: 20px;
}
.cube .front {
    -webkit-transform: rotateY(0deg) translateZ(60px);
    transform: rotateY(0deg) translateZ(60px);
    background-color: rgba(0, 191, 255, 0.7);
    border: 2px solid rgba(0, 191, 255, 0.7);
}
.cube .back {
    -webkit-transform: rotateX(180deg) translateZ(60px);
    transform: rotateX(180deg) translateZ(60px);
    background-color: rgba(124, 252, 0, 0.7);
    border: 2px solid rgba(124, 252, 0, 0.7);
}
.cube .right {
    -webkit-transform: rotateY(90deg) translateZ(60px);
    transform: rotateY(90deg) translateZ(60px);
    background-color: rgba(255, 69, 0, 0.7);
    border: 2px solid rgba(255, 69, 0, 0.7);
}
.cube .left {
    -webkit-transform: rotateY(-90deg) translateZ(60px);
    transform: rotateY(-90deg) translateZ(60px);
    background-color: rgba(255, 215, 0, 0.7);
    border: 2px solid rgba(255, 215, 0, 0.7);
}
.cube .top {
    -webkit-transform: rotateX(90deg) translateZ(60px);
    transform: rotateX(90deg) translateZ(60px);
    background-color: rgba(255, 0, 157, 0.7);
    border: 2px solid rgba(255, 0, 157, 0.7);
}
.cube .bottom {
    -webkit-transform: rotateX(-90deg) translateZ(60px);
    transform: rotateX(-90deg) translateZ(60px);
    background-color: rgba(184, 111, 220, 0.7);
    border: 2px solid rgba(184, 111, 220, 0.7);
}
a{ color: #fff;}
}
 @-webkit-keyframes around {
  100% {
    -webkit-transform: rotateX(-15deg) rotateY(-380deg) translateZ(-100px);
            transform: rotateX(-15deg) rotateY(-380deg) translateZ(-100px);
  }
}

@keyframes around {
  100% {
    -webkit-transform: rotateX(-15deg) rotateY(-380deg) translateZ(-100px);
            transform: rotateX(-15deg) rotateY(-380deg) translateZ(-100px);
  }
} 
</style>
