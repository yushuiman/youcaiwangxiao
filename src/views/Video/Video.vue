<template>
    <div class="video-wrap">
      <div class="video-header">
        <router-link :to="{ name: '/', params: {} }">返回</router-link>
        <span>内容财务报表分析 1-1（3）现金流量表（1）</span>
        <div class="login-r fr">
          <img src="../../assets/images/global/email-icon.png" alt="email" class="email-icon">
          <img src="../../assets/images/global/head-logo-moren.png" alt="头像" class="head-logo">
        </div>
      </div>
      <div class="video-main clearfix">
        <div class="video-info-l fl">
          答疑
        </div>
        <div class="video-info-c fl">
视屏
        </div>
        <div class="video-info-r fr">
          目录
        </div>
      </div>
    </div>
</template>

<script>
export default {
  mounted () {
  }

}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .video-header{
    @include lh(70, 70);
    padding: 0 31px;
    background: $colfff;
    span{
      font-size: 16px;
      margin-left: 17px;
      font-weight:500;
    }
  }
  .login-r{
    img{
      vertical-align: middle;
      &.email-icon{
        @include wh(18, 14);
        margin: 0 31px;
      }
      &.head-logo{
        @include wh(30, 30);
      }
    }
  }
  .video-main{
    background:rgba(29,31,33,1);
  }
  .video-info-l{
    width: 60px;
  }
  .video-info-c{
    width:998px;
    height:849px;
    background:rgba(0,0,0,1);
    border-radius:10px;
  }
//   <div class="video-info-l fl">
//     答疑
//   </div>
//   <div class="video-info-c fl">
// 视屏
//   </div>
//   <div class="video-info-r fr">
//     目录
//   </div>
</style>
