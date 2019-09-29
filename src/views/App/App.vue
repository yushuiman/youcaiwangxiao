<template>
  <div class="app-down-wrap">
    <!-- :style="{height: h + 'px'}" -->
    <div class="page page-1" id="page-1">
      <div class="app-down-cont w-wrap">
        <div class="adc-left">
          <p class="p1">— 新 版 —</p>
          <p class="p2">优财网校APP</p>
          <ul class="str-list">
            <li class="str-item"><i></i>2020新纲网课</li>
            <li class="str-item"><i></i>精品题库</li>
            <li class="str-item"><i></i>定制学习计划</li>
            <li class="str-item"><i></i>在线答疑</li>
          </ul>
          <div class="down-info">
            <div class="dw-left">
              <a href="https://apps.apple.com/cn/app/id1322877623"><i class="android"></i><span>App Store</span></a>
              <a href="https://android.myapp.com/myapp/detail.htm?apkName=com.ucfo.youcai&ADTAG=mobile" target="_blank"><i class="ios"></i><span>Android</span></a>
            </div>
            <div class="dw-right">
              <img src="../../assets/images/global/ewm-icon.png" alt="">
              <p>微信扫描二维码直接下载</p>
            </div>
          </div>
        </div>
        <img class="adc-right" src="../../assets/images/app/page-iphone-1.png" alt="">
      </div>
    </div>
    <div class="page page-2" id="page-2">
      <div class="course-cont">
        <h2>课程板块</h2>
        <div class="str-txt">
          <span>2020新纲</span>
          <span>老师在线答疑</span>
          <span>讲义切换</span>
          <span>金牌师资</span>
        </div>
        <div class="phone-img">
          <img src="../../assets/images/app/course-img01.png" alt="">
          <img src="../../assets/images/app/course-img02.png" alt="">
          <img src="../../assets/images/app/course-img03.png" alt="">
        </div>
      </div>
    </div>
    <div class="page page-3" id="page-3">
      <div class="course-cont">
        <h2>题库板块</h2>
        <div class="str-txt">
          <span>知识点练习</span>
          <span>优质题源</span>
          <span>高频错题</span>
          <span>答疑解惑</span>
          <span>权威编审</span>
        </div>
        <div class="phone-img">
          <img src="../../assets/images/app/question-img01.png" alt="">
          <img src="../../assets/images/app/question-img02.png" alt="">
          <img src="../../assets/images/app/question-img03.png" alt="">
        </div>
      </div>
    </div>
    <div class="page page-4" id="page-4">
      <div class="course-cont">
        <h2>学习计划板块</h2>
        <div class="str-txt">
          <span>专属计划</span>
          <span>跟进学习进度</span>
          <span>题库结合</span>
        </div>
        <div class="phone-img">
          <img src="../../assets/images/app/plan-img01.png" alt="">
          <img src="../../assets/images/app/plan-img02.png" alt="">
          <img src="../../assets/images/app/plan-img03.png" alt="">
        </div>
      </div>
    </div>
    <div class="page page-5" id="page-5">
      <div class="down-cont-foot">
        <div class="adc-left">
          <p class="p1">— 新 版 —</p>
          <p class="p2">优财网校APP</p>
          <ul class="str-list">
            <li class="str-item"><i></i>2020新纲网课</li>
            <li class="str-item"><i></i>精品题库</li>
            <li class="str-item"><i></i>定制学习计划</li>
            <li class="str-item"><i></i>在线答疑</li>
          </ul>
        </div>
        <div class="down-info">
          <div class="dw-left">
            <a @click="downIos('ios')"><i class="android"></i><span>App Store</span></a>
            <a @click="downIos('android')"><i class="ios"></i><span>Android</span></a>
          </div>
          <div class="dw-right">
            <img src="../../assets/images/global/ewm-icon.png" alt="">
            <p>微信扫描二维码直接下载</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      h: 400
    }
  },
  mounted () {
    this.h = document.documentElement.clientHeight
  },
  methods: {
    downIos (type) {
      if (type === 'ios') {
        window.open('https://apps.apple.com/cn/app/id1322877623', '_blank')
      }
      if (type === 'android') {
        window.open('https://android.myapp.com/myapp/detail.htm?apkName=com.ucfo.youcai&ADTAG=mobile', '_blank')
      }
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .app-down-wrap{
    /* position: relative;
    height: 100%;
    overflow: hidden; */
  }
  .page{
    background: #ffffff;
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
    // position: relative;
    /* position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0; */
  }
  .page-1{
    /* height: 100%; */
    height: 702px;
    background: url('../../assets/images/app/page-banner-1.png') no-repeat top center;
    background-size: cover;
  }
  .app-down-cont{
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .adc-left{
    padding-left: 108px;
    padding-top: 15px;
    text-align: center;
    .p1{
      line-height:42px;
      font-size:30px;
    }
    .p2{
      line-height: 70px;
      font-size: 50px;
      color: #435D84;
      margin-top: 4px;
    }
  }
  .str-list{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 20px;
    text-align: left;
    padding-left: 13%;
    li{
      width: 132px;
      line-height: 25px;
      font-size: 18px;
      color: $col666;
      margin-top: 6px;
      margin-right: 38px;
      &:nth-child(even){
        margin-right: 0;
      }
      i{
        width: 6px;
        height: 6px;
        display: inline-block;
        vertical-align: middle;
        margin-top: -3px;
        margin-right: 10px;
        background: $blueColor;
        border-radius: 6px;
      }
    }
  }
  .down-info{
    display: flex;
    align-items: center;
    margin-top: 76px;
  }
  .dw-left{
    a{
      padding: 0 18px;
      height:40px;
      line-height: 40px;
      background: $blueColor;
      border-radius:32px;
      font-size: 18px;
      color: #ffffff;
      display: block;
      margin-bottom: 22px;
      &:last-child{
        margin-bottom: 0;
      }
      i{
        @include bg-img(18, 22, '../../assets/images/app/ios.png');
        vertical-align: middle;
        margin-right: 9px;
        margin-top: -3px;
        &.ios{
          @include bg-img(20, 24, '../../assets/images/app/android.png');
        }
      }
      span{
        width: 88px;
        display: inline-block;
      }
    }
  }
  .dw-right{
    text-align: center;
    margin-left: 63px;
    img{
      width: 166px;
      height: 166px;
    }
    p{
      color: $col999;
      line-height: 20px;
      margin-top: 2px;
    }
  }
  .adc-right{
    width: 694px;
    margin-top: 40px;
  }
  /* page 2 3 4 */
  .page-2,.page-3,.page-4{
    text-align: center;
    padding-top: 50px;
    padding-bottom: 28px;
    h2{
      font-size: 50px;
      color: #435D84;
    }
    .str-txt{
      span{
        color: $col666;
        font-size: 16px;
        line-height: 24px;
        margin-top: 24px;
        margin-right: 30px;
        display: inline-block;
      }
    }
    .phone-img{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 34px;
      img{
        display: inline-block;
        width: 236px;
        height: 392px;
        &:nth-child(2){
          width: 236px;
          height: 462px;
        }
      }
    }
  }
  /* page5 */
  .page-5{
    padding-top: 77px;
    padding-bottom: 67px;
  }
  .down-cont-foot{
    width: 874px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .adc-left,.down-info,.str-list{
      padding: 0;
    }
    .adc-left{
      width: 340px;
    }
    .str-list{
      padding-left: 10%;
    }
    .down-info{
      margin: 0;
    }
  }
</style>
