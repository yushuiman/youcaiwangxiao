<template>
  <div class="r_slider">
    <ul class="slider-list">
      <li class="try-item">
        <i class="r-icon"></i>
        <p class="r-txt">试听<br />课程</p>
        <div class="com-show r-try">
          <div class="com-btn">免费领取</div>
        </div>
      </li>
      <li class="service-item">
        <i class="r-icon"></i>
        <p class="r-txt">客服</p>
        <div class="com-show r-service">
          <p>周一至周五</p>
          <p>9:00-21:00</p>
          <div class="com-btn">咨询</div>
        </div>
      </li>
      <li class="hotline-item">
        <i class="r-icon"></i>
        <p class="r-txt">热线</p>
        <div class="com-show r-hotline">400-666-5138</div>
      </li>
      <li class="weixin-item">
        <i class="r-icon"></i>
        <p class="t-weixin r-txt">微信</p>
        <div class="com-show r-weixin">
          <img class="ewm" src="../assets/images/fixed/weixin.png" alt="">
          <p>关注优财网校</p>
          <p>获得MAC最新咨询</p>
        </div>
      </li>
      <li class="qq-item">
        <i class="r-icon"></i>
        <p class="r-txt">QQ</p>
        <div class="com-show r-qq">
          <div class="com-btn">班主任群</div>
          <div class="com-btn">CMA群</div>
        </div>
      </li>
      <li class="go-top-item" @click="backTop">
        <i class="r-icon"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RightSlider',
  data () {
    return {
      scrollTop: 0,
      btnFlag: false// 默认隐藏返回头部的图片
    }
  },
  mounted () {
    window.addEventListener('scroll', this.scrollToTop)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  methods: {
    backTop () {
      let timer = setInterval(() => {
        let ispeed = Math.floor(-this.scrollTop / 5)
        document.documentElement.scrollTop = document.body.scrollTop = this.scrollTop + ispeed
        if (this.scrollTop === 0) {
          clearInterval(timer)
        }
      }, 16)
    },
    scrollToTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.scrollTop = scrollTop
      if (this.scrollTop > 100) {
        this.btnFlag = true
      } else {
        this.btnFlag = false
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../assets/scss/app";
  .r_slider{
    width: 50px;
    position: fixed;
    top: 180px;
    right: 0;
    z-index: 10;
    background: rgba(0,0,0,.5);
  }
  .slider-list {
    li{
      position: relative;
      text-align: center;
      padding: 12.5px 0;
      color: $colfff;
      &:hover{
        background: $blueColor;
      }
      .r-txt {
        margin-top: 2px;
        line-height: 18px;
      }
    }
  }
  .r-icon{
    .try-item &{
      @include bg_img(30, 30, '../assets/images/fixed/try.png');
    }
    .service-item &{
      @include bg_img(20, 20, '../assets/images/fixed/service.png');
    }
    .hotline-item &{
      @include bg_img(20, 20, '../assets/images/fixed/line.png');
    }
    .weixin-item &{
      @include bg_img(23, 23, '../assets/images/fixed/iweixin.png');
    }
    .qq-item &{
      @include bg_img(23, 23, '../assets/images/fixed/QQ.png');
    }
    .go-top-item &{
      @include bg_img(30, 30, '../assets/images/fixed/top.png');
    }
  }
  .com-show {
    width: 139px;
    padding: 16px 0;
    text-align: center;
    position: absolute;
    top: 0;
    right: 50px;
    color: #666666;
    background: #ffffff;
    display: none;
    &.r-try{
      top: 21.5px;
    }
    &.r-service{
      top: -15px;
    }
    &.r-hotline{
      top: 9.5px;
    }
    &.r-weixin{
      top: -42.5px;
    }
    &.r-qq{
      top: -12px;
    }
    p{
      line-height: 20px;
    }
    .ewm {
      width: 75px;
      height: 75px;
      margin-bottom: 6px;
    }
  }
  .com-btn {
    width: 79px;
    height: 19px;
    line-height: 19px;
    background: #0267FF;
    border-radius: 10px;
    font-size: 12px;
    color: #ffffff;
    display: inline-block;
    margin-top: 6px;
    .r-try &{
      margin-top: 0;
    }
    .r-qq &{
      margin: 6px 0;
    }
  }
  .try-item,.service-item,.hotline-item,.weixin-item,.qq-item{
    &:hover{
      .com-show{
        display: block;
      }
    }
  }
</style>
