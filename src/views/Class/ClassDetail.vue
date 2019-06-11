<template>
  <div class="class-detail-wrap w-wrap">
    <div class="nav-title">
      首页>课程>课程详情
    </div>
    <div class="class-detail-info clearfix">
      <div class="cdi-wrap-l fl">
        <div class="cdi-video">
          <img class="cdi-img" src="@/assets/images/index/banner.png" alt="">
          <div class="cdi-opa">
            <p class="cdi-tit">标题</p>
            <span class="cdi-play-btn"><i></i>免费试听</span>
            <div class="cdi-jieshao">
              <img src="@/assets/images/index/banner.png" alt="">
              介绍sdsdnfsdns释放速度速度是亮点
            </div>
          </div>
        </div>
        <div class="cdi-special">
          特色服务：
          <span><i class="icon-server"></i>1对1服务</span>
          <span><i class="icon-answer"></i>在线答疑</span>
          <span><i class="icon-fanzhuan"></i>翻转课堂</span>
        </div>
      </div>
      <div class="cdi-wrap-r fr">
        <h2 class="cdi-tit">CMA中文高清网课全科（新钢）</h2>
        <p class="cdi-instr">优质的速度发生的看风使舵尽快发货sdfkskjdhf水电费水电费sfdf 是否收到</p>
        <p class="cdi-teacher">讲师：</p>
        <div class="cdi-type">
          <span>VIP视频</span>
          <span>VIP题库</span>
          <span>有效期：730天</span>
        </div>
        <p class="cdi-buy-people">12333人购买<span>9993次播放</span></p>
        <p class="cdi-price">¥1888000</p>
        <div class="cdi-buy-consult">
          <button type="button" name="button" class="buy-btn">立即购买</button>
          <button type="button" name="button" class="consult-btn">在线咨询</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  components: {
  },
  computed: {

  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/scss/app";
  .class-detail-wrap{
    padding-bottom: 19px;
  }
  .nav-title{
    @include lh(44, 44);
  }
  .cdi-wrap-l{
    width: 650px;
    position: relative;
    .cdi-video{
      .cdi-img{
        width: 100%;
        height: 364px;
      }
    }
  }
  .cdi-opa{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    color: $colfff;
    background:rgba(0,0,0,.5);
    .cdi-tit{
      font-size: 20px;
      padding: 22px 20px;
    }
    .cdi-play-btn{
      @include whl(130, 34, 34);
      border: 1px solid $colfff;
      border-radius: 17px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -75px;
      margin-top: -17;
      text-align: center;
      i{
        @include wh(13, 12);
        background: #ffffff;
        display: inline-block;
      }
    }
    .cdi-jieshao{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      @include lh(48, 48);
      background: rgba(0, 0, 0, .67);
      padding: 0 20px;
      img{
        @include wh(40, 40);
        vertical-align: middle;
        border-radius: 100%;
        margin-right: 30px;
      }
    }
  }
  // <span><i class="icon-server"></i>1对1服务</span>
  // <span><i class="icon-answer"></i>在线答疑</span>
  // <span><i class="icon-fanzhuan"></i>翻转课堂</span>
  .cdi-special{
    @include lh(47, 47);
    span{
      color: $col666;
      i{

      }
    }
  }
  .cdi-wrap-r{
    width: 549px;
    padding: 30px 20px;
    box-sizing: border-box;
  }
</style>
