<template>
  <div class="index-wrap">
    <!-- banner -->
    <div class="banner-wrap">
      <img src="@/assets/images/index/banner.png" alt="">
    </div>
    <!-- 课程列表 -->
    <ul class="class-wrap w-wrap">
      <li class="class-item class-item01">
        <img class="ci-img" src="@/assets/images/index/undraw_video_call_kxyp.png" alt="">
        <div class="class-instru">
          <h1>体验课程</h1>
          <p>专业高效的课程，免费体验</p>
          <div class="btn-box">
            <button type="button" name="button" class="more-btn">更多</button>
          </div>
        </div>
      </li>
      <li class="class-item class-item02">
        <span class="anima-icon"></span>
        <div class="class-instru">
          <h1>体验课程</h1>
          <p>超50+CMA精选案例；提高论述题掌握程</p>
          <div class="btn-box">
            <button type="button" name="button" class="ty-btn">体验</button>
          </div>
        </div>
        <img class="ci-img" src="@/assets/images/index/undraw_podcast_q6p7.png" alt="">
      </li>
      <li class="class-item class-item03">
        <img class="ci-img" src="@/assets/images/index/undraw_prototyping_process_rswj.png" alt="">
        <div class="class-instru">
          <h1>体验课程</h1>
          <p>专业高效的课程，免费体验</p>
          <div class="btn-box">
            <button type="button" name="button" class="more-btn">更多</button>
          </div>
        </div>
      </li>
      <li class="class-item class-item04">
        <span class="anima-icon"></span>
        <div class="class-instru">
          <h1>体验课程</h1>
          <p>专业高效的课程，免费体验</p>
          <div class="btn-box">
            <button type="button" name="button" class="hg-btn">往期回顾</button>
            <button type="button" name="button" class="zb-tbn">正在直播</button>
          </div>
        </div>
        <img class="ci-img" src="@/assets/images/index/undraw_setup_wizard_r6mr.png" alt="">
      </li>
    </ul>
    <!-- cma咨询 -->
    <div class="cma-consultation">
      <div class="w-wrap clearfix">
        <div class="cma-txt-bg fl">CMA咨询</div>
        <ul class="txt-item fl">
          <li>了解CMA最新资讯、备考信息、课程信息</li>
          <li>7月CMA考试费用高吗？考下CMA要多少钱？</li>
          <li>再续管理会计百年辉煌！美国管理会计师协会新任管理会计总裁发表演讲。</li>
          <li>火爆异常！70000财务人围观2019中国管理会计实践大会。</li>
          <li>重要通知：IMA公布6折报考CMA限时优惠活动。</li>
        </ul>
      </div>
    </div>
    <!-- 合作伙伴 -->
    <div class="partners-wrap">
      <div class="w-wrap">
        <div class="part-tit">
          <img src="@/assets/images/index/tit_icon.png" alt="">
          <span class="part-icon">合作伙伴</span>
        </div>
        <img class="hzhb-img" src="@/assets/images/index/hzhb.png" alt="" >
        <!-- <ul class="part-list clearfix">
          <li class="part-item">
            <img src="@/assets/images/index/banner.png" alt="" >
          </li>
          <li class="part-item">
            <img src="@/assets/images/index/banner.png" alt="" >
          </li>
          <li class="part-item">
            <img src="@/assets/images/index/banner.png" alt="" >
          </li>
          <li class="part-item">
            <img src="@/assets/images/index/banner.png" alt="" >
          </li>
          <li class="part-item">
            <img src="@/assets/images/index/banner.png" alt="" >
          </li>
          <li class="part-item">
            <img src="@/assets/images/index/banner.png" alt="" >
          </li>
          <li class="part-item">
            <img src="@/assets/images/index/banner.png" alt="" >
          </li>
          <li class="part-item">
            <img src="@/assets/images/index/banner.png" alt="" >
          </li>
          <li class="part-item">
            <img src="@/assets/images/index/banner.png" alt="" >
          </li>
          <li class="part-item">
            <img src="@/assets/images/index/banner.png" alt="" >
          </li>
        </ul> -->
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { couAnswerList } from '@/api/Answer.js'
export default {
  name: 'home',
  mounted () {
    couAnswerList().then(res => {
      let rep = res.data
      if (rep.code === 200) {
        console.log(rep.data)
      }
    })
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../assets/scss/app";
  .banner-wrap{
    img{
      width: 100%;
    }
  }
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
        line-height: 20px;
        color: $col999;
        margin-top: 5px;
      }
    }
  }
  .anima-icon{
    position: absolute;
    width: 202px;
    height: 100%;
    .class-item02 &{
      right: -26px;
      top: -62px;
      background: url('../assets/images/index/undraw_icon01.png') no-repeat center;
      background-size: contain;
    }
    .class-item04 &{
      width: 285px;
      left: -192px;
      top: -36px;
      background: url('../assets/images/index/undraw_icon02.png') no-repeat center;
      background-size: contain;
    }
  }
  .btn-box{
    padding-top: 20px;
    button{
      float: left;
      margin-right: 15px;
      @include whl(95, 29, 29);
      background: $blueColor;
      font-size: $fs16;
      color: $colfff;
      text-align: center;
      border-radius: 18px;
      box-shadow: 0px 2px 14px 0px rgba(165,209,255,1);
      &.zb-tbn{
        background: #D5E6FF;
        color: $blueColor;
      }
    }
  }
  // .ci-img{
  //   @include wh(220, 133);
  //   .class-item02 &{
  //     @include wh(220, 150);
  //   }
  //   .class-item03 &{
  //     @include wh(220, 170);
  //   }
  //   .class-item04 &{
  //     @include wh(220, 165);
  //   }
  // }
  // cma咨询
  .cma-consultation{
    background: #ffffff;
    padding-bottom: 85px;
    .cma-txt-bg{
      @include whl(190, 210, 210);
      margin-left: 62px;
      margin-right: 47px;
      padding-left: 82px;
      font-size: 26px;
      background: url('../assets/images/index/cma_icon.png') no-repeat center;
      background-size: contain;
    }
    .txt-item{
      li{
        line-height: 42px;
        color: $col666;
        font-size: $fs16;
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
  // .part-list{
  //   padding: 36px 5px;
  //   li{
  //     border: 1px solid $col999;
  //     text-align: center;
  //     @include whl(226, 98, 98);
  //     float: left;
  //     margin: 5px;
  //     img{
  //       vertical-align: middle;
  //       margin-top: -3px;
  //       width: 90%;
  //       height: 90%;
  //     }
  //   }
  // }
</style>
