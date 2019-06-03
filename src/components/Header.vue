<template>
  <div>
    <header class="head-wrap">
      <div class="head-w">
        <div class="head-list fl">
          <img src="@/assets/images/global/yc-logo.png" alt="logo" class="yc-logo fl">
          <ul class="item-list fl">
            <li class="curren"><router-link to="/">首页</router-link></li>
            <li><router-link to="/class">课程</router-link></li>
            <li><router-link to="/question">题库</router-link></li>
            <li><router-link to="/zhibo">直播</router-link></li>
            <li><router-link to="/answer">答疑</router-link></li>
            <li><router-link to="/zixun">咨询</router-link></li>
            <li><router-link to="/app">App</router-link></li>
          </ul>
        </div>
        <div class="login-wrap fr">
          <div class="login-l fl">
            <router-link to="/login">登录</router-link>|
            <router-link to="/login">注册</router-link>
            <a class="learen-btn">学习中心</a>
          </div>
          <div class="login-r fr">
            <img src="@/assets/images/global/email-icon.png" alt="email" class="email-icon">
            <img src="@/assets/images/global/head-logo-moren.png" alt="头像" class="head-logo">
          </div>
        </div>
      </div>
    </header>

  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../assets/scss/app";
  .head-wrap{
    width: 100%;
    .head-w {
      @include whl(1300, 70, 70);
      margin: 0 auto;
    }
  }
  .yc-logo{
    @include wh(130, 34);
    margin: 18px 0;
  }
  .item-list{
    padding-left: 39px;
    li{
      font-size: 14px;
      padding: 0 21px;
      float: left;
      a{
        color: $col333;
        display: block;
      }
      &.curren{
        a{
          color: $blueColor;
          border-top: 4px solid $blueColor;
        }
      }
    }
  }

  .login-l{
    a{
      color: $blueColor;
      display: inline-block;
      margin: 0 3px;
      &.learen-btn{
        @include whl(100, 28, 28);
        border-radius: 14px;
        color: $colfff;
        background: $blueColor;
        margin-left: 19px;
        margin-right: 33px;
        text-align: center;
      }
    }
  }
  .login-r{
    padding: 20px 0;
    img{
      float: left;
      &.email-icon{
        @include wh(18, 14);
        margin: 8px 31px 8px 0;
      }
      &.head-logo{
        @include wh(30, 30);
      }
    }
  }
</style>
