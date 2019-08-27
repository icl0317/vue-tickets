<template>
    <div id="swiper">
        <div class="swipe-wrap">
            <div class="swipe-slide" ref="swipeSlide">
              <ul class="imgs clearfix" ref="imgs" style="-webkit-transform:translate3d(7.5rem,0,0)">
                <li
                  v-for="(item , index) in data"
                  :key="index"
                  :class="{active : index == imgIndex}"
                >
                  <img :src="item.film_photo" />
                </li>
              </ul>
              <b class="center-mark"></b>
            </div>
          </div>
    </div>
</template>

<script>
    export default {
        name: 'swiper',
        props:{
            data:{
                type:Array,
                default:[]
            }
        },
        data() {
            return {
                imgIndex:0   
            }
        },
        methods:{
            getEl(ref){
                return this.$refs[ref];
            }
        },
        mounted(){
            let curX = 7.5;
            let upX = 0;
            let oImg = this.getEl('imgs');
            let oBox = this.getEl('swipeSlide');
            oImg.addEventListener('touchstart', (ev)=>{
                let downX = ev.changedTouches[0].pageX / 20;
                let disX = downX - curX;
                oImg.style.WebkitTransition = "none";
                
                const fnMove = (ev)=>{
                    curX = (ev.changedTouches[0].pageX / 20 - disX).toFixed(2);
                    oImg.style.WebkitTransform = "translate3d(" + curX + "rem, 0, 0)";
                }
                const fnEnd = (ev)=>{
                    let upX = ev.changedTouches[0].pageX / 20;
                    let iNow = Math.round((curX - 7.5)/3.75);
                    if(iNow > 0) iNow = 0;
                    if(iNow < -(this.data.length - 1))iNow = -(this.data.length - 1);
                    curX = 7.5 + 3.75 * iNow;
                    oImg.style.WebkitTransform = "translate3d(" + curX + "rem, 0, 0)";
                    this.imgIndex = Math.abs(iNow);
                    oBox.removeEventListener("touchmove", fnMove, false);
                    oBox.removeEventListener("touchend", fnEnd, false);
                    oImg.style.WebkitTransition = ".3s all ease";
                    this.$emit('swiper-change',this.imgIndex);
                }
                oBox.addEventListener('touchmove', fnMove, false);
                oBox.addEventListener('touchend', fnEnd, false);
            }, false);
        }
    }
</script>

<style lang="less" scoped>
@import "../../style/mixin";
#swiper{
   .swipe-wrap {
      height: 128px;
      background: rgba(0, 0, 0, 0.8);
      padding: 15px 0 0 0;
      margin-bottom: 10px;
      .swipe-slide {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
      }
      .imgs {
        width: 1000px;
        display: flex;
        align-items: flex-end;
      }
      .imgs li {
        float: left;
        width: 75px;
        text-align: center;
      }
      .imgs img {
        width: 62px;
        height: 92px;
      }
      .imgs .active img {
        width: 72px;
        height: 102px;
      }
      .center-mark {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #fff;
        .hz();
        bottom: 0;
      }
      .film-pic {
        float: left;
        margin-right: 10px;
      }
      .film-name {
        font-size: @bigSize;
        font-weight: 500;
        color: @fff;
        margin-bottom: 6px;
        .textCut();
      }
      .film-type span {
        display: inline-block;
        padding: 1px 5px;
        background: #e5dadc;
        .borderRadius(3px);
        margin-right: 4px;
      }
      .director,
      .duration {
        color: @fff;
        .textCut();
        margin-top: 6px;
      }
      .performer {
        max-height: 32px;
        color: @fff;
        margin-top: 6px;
        .RowsCut(2);
      }
      .mint-swipe-indicator.is-active {
        background: @warnColor;
        opacity: 0.8;
      }
    }
}    
</style>