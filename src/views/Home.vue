<template>
  <div class="index-wrap">
    <div class="banner-wrap">
      <img src="@/assets/images/index/banner.png" alt="" width="100%" height="auto">
    </div>
    <ul class="class-wrap w-wrap">
      <li class="class-item class-item01">
        <img class="ci-img" src="@/assets/images/index/undraw_video_call_kxyp.png" alt="">
        <div class="class-instru">
          <h1>CMA高清网课全科</h1>
          <p>科学的理念 + 优秀的师资 + 专业课程，免费体验</p>
          <div class="btn-box-index">
            <button type="button" name="button" class="more-btn" @click="jumpWhere(1)">更多</button>
          </div>
        </div>
      </li>
      <li class="class-item class-item02">
        <span class="anima-icon"></span>
        <div class="class-instru">
          <h1>体验课程</h1>
          <p>专业课程，免费体验</p>
          <div class="btn-box-index">
            <button type="button" name="button" class="ty-btn" @click="jumpWhere(2)">体验</button>
          </div>
        </div>
        <img class="ci-img" src="@/assets/images/index/undraw_podcast_q6p7.png" alt="">
      </li>
      <li class="class-item class-item03">
        <img class="ci-img" src="@/assets/images/index/undraw_prototyping_process_rswj.png" alt="">
        <div class="class-instru">
          <h1>翻转课堂</h1>
          <p>超50+CMA精选案例 专注论述题训练</p>
          <!-- <div class="btn-box-index">
            <button type="button" name="button" class="more-btn" @click="jumpWhere(3)">更多</button>
          </div> -->
        </div>
      </li>
      <!-- <li class="class-item class-item04">
        <span class="anima-icon"></span>
        <div class="class-instru">
          <h1>精选直播</h1>
          <p>最近直播：零基础运营让搜索流量稳步暴涨</p>
          <div class="btn-box-index">
            <button type="button" name="button" class="hg-btn" @click="jumpWhere(4)">往期回顾</button>
            <button type="button" name="button" class="zb-tbn" @click="jumpWhere(5)">正在直播</button>
          </div>
        </div>
        <img class="ci-img" src="@/assets/images/index/undraw_setup_wizard_r6mr.png" alt="">
      </li> -->
    </ul>
    <img class="cma-title-bg" src="@/assets/images/index/cma-title-bg.png" alt="" width="100%" height="auto">
    <div class="cma-consultation">
      <div class="w-wrap clearfix">
        <div class="cma-txt-bg fl">常见问题</div>
        <ul class="txt-item fl">
          <li v-for="(item, index) in newInformationList" :key="index" @click="getNewsDetails(item.news_id)">{{item.title}}</li>
        </ul>
      </div>
    </div>
    <div class="partners-wrap">
      <div class="w-wrap">
        <div class="part-tit">
          <img src="@/assets/images/index/tit_icon.png" alt="">
          <span class="part-icon">合作伙伴</span>
        </div>
        <img class="hzhb-img" src="@/assets/images/index/hzhb2.png" alt="" width="100%" height="auto">
      </div>
    </div>
  </div>
</template>

<script>
import { newInformation } from '@/api/index'
export default {
  data () {
    return {
      newInformationList: []
    }
  },
  mounted () {
    this.getNewInformation()
  },
  methods: {
    jumpWhere (type) {
      if (type === 1) {
        this.$router.push('/course')
        // window.open('http://www.ucfo.com.cn/xczt/', '_blank')
      }
      if (type === 2) {
        // window.open('https://youcaiwx.cn/Znten/STK/index.html', '_blank')
        window.open('https://youcaiwx.cn/activityAll/auditionCourse/index.html', '_blank')
      }
      if (type === 3) {
        window.open('https://youcaiwx.cn/Znten/FZK/fzkt.html', '_blank')
      }
      if (type === 4) {

      }
      if (type === 5) {

      }
    },
    getNewInformation () {
      newInformation().then((data) => {
        const res = data.data
        this.newInformationList = res.data
      })
    },
    // 详情
    getNewsDetails (id) {
      this.$router.push({ path: '/zixun-detail',
        query: {
          news_id: id
        }
      })
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../assets/scss/app";
  // 课程list
  .class-wrap{
    padding-bottom: 29px;
  }
  .class-item{
    position: relative;
    height: 250px;
    padding-left: 306px;
    padding-right: 207px;
    @include c3(box-sizing, border-box);
    @include display_flex(flex);
    @extend %alignitem_center;
    @extend %justify-content;
    &:nth-of-type(even){
      background: $colfff;
      border-radius: 20px;
    }
    &.class-item01{
      height: 234px;
    }
    .ci-img{
      width: 220px;
      height: auto;
    }
    .class-instru{
      h1{
        color: $col333;
        font-size: 26px;
        line-height: 35px;
      }
      p{
        width: 310px;
        line-height: 20px;
        color: $col999;
        margin-top: 5px;
      }
    }
  }
  .anima-icon{
    position: absolute;
    height: auto;
    .class-item02 &{
      @include wh(202, 177);
      right: -26px;
      top: -38px;
      @extend %bg-img;
      background-image: url('../assets/images/index/undraw_icon01.png');
    }
    .class-item04 &{
      @include wh(285, 287);
      left: -202px;
      top: -36px;
      @extend %bg-img;
      background-image: url('../assets/images/index/undraw_icon02.png');
    }
  }
  .btn-box-index{
    padding-top: 20px;
    button{
      float: left;
      margin-right: 15px;
      @include wh(95, 29);
      line-height: normal;
      background: $blueColor;
      font-size: $fs16;
      color: $colfff;
      text-align: center;
      border-radius: 18px;
      &:hover{
        box-shadow: 0px 2px 14px 0px rgba(165,209,255,1);
      }
      &.zb-tbn{
        background: #D5E6FF;
        color: $blueColor;
      }
    }
  }
  // cma咨询
  .cma-title-bg{
    width: 100%;
    display: block;
  }
  .cma-consultation{
    padding-bottom: 85px;
    background: $colfff;
    .cma-txt-bg{
      @include whl(272, 210, 192);
      margin-left: 62px;
      margin-right: 47px;
      padding-left: 60px;
      font-size: 26px;
      @extend %bg-img;
      background-image: url('../assets/images/index/cma_icon.png');
    }
    .txt-item{
      li{
        line-height: 42px;
        color: $col666;
        font-size: $fs16;
        cursor: pointer;
        &:hover{
          color: $col999;
        }
      }
    }
  }
  //合作伙伴
  .partners-wrap{
    text-align: center;
    background: $colfff;
    .hzhb-img{
      width: 100%;
      padding-top: 29px;
      padding-bottom: 52px;
      display: block;
    }
  }
  .part-tit{
    font-size: 26px;
    color: $col333;
    line-height: 47px;
    img{
      @include wh(75, 47);
      display: inline-block;
      vertical-align: middle;
    }
    span{
      margin-left: -38px;
    }
  }
</style>
