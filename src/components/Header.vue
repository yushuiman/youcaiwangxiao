<template>
  <div>
    <header>
      <div class="head-wrap">
        <div class="head-w">
          <div class="head-list fl">
            <img src="../assets/images/global/yc-logo.png" alt="logo" class="yc-logo fl">
            <ul class="item-list fl">
              <li :class="isChange === 'shouye' ? 'on_change' : ''" @click="onChange('shouye')"><router-link to="/">首页</router-link></li>
              <li :class="isChange === 'kecheng' ? 'on_change' : ''" @click="onChange('kecheng')"><router-link to="/class">课程</router-link></li>
              <li :class="isChange === 'tiku' ? 'on_change' : ''" @click="onChange('tiku')"><router-link to="/question">题库</router-link></li>
              <li :class="isChange ==='liveing' ? 'on_change' : ''" @click="onChange('liveing')"><router-link to="/zhibo">直播</router-link></li>
              <li :class="isChange === 'dayi' ? 'on_change' : ''" @click="onChange('dayi')"><router-link to="/answer">答疑</router-link></li>
              <li :class="isChange === 'zixun' ? 'on_change' : ''" @click="onChange('zixun')"><router-link to="/zixun">咨询</router-link></li>
              <li :class="isChange ==='app' ? 'on_change' : ''" @click="onChange('app')"><router-link to="/app">App</router-link></li>
            </ul>
          </div>
          <div class="login-wrap fr">
            <div class="login-l fl">
              <router-link to="/login">登录</router-link> |
              <router-link to="/login">注册</router-link>
            </div>
            <a class="learen-btn fl">学习中心</a>
            <div class="login-r fr">
              <img src="../assets/images/global/email-icon.png" alt="email" class="email-icon">
              <img src="../assets/images/global/head-logo-moren.png" alt="头像" class="head-logo">
            </div>
          </div>
        </div>
      </div>
      <div class="fixed-head"></div>
    </header>
  </div>
</template>
<script>
import { getToken } from '@/libs/utils'
import { mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      token: getToken()
    }
  },

  mounted () {
    // console.log(this.$store.state.user)
    if (this.token) {
    } else {
      console.log(2323322)
    }
  },
  computed: {
    isChange () {
      return this.$store.state.nav.is_change
    }
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    ...mapMutations([
      'setChange'
    ]),
    onChange (navName) {
      this.setChange(navName)
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../assets/scss/app";
  .head-wrap{
    width: 100%;
    position: fixed;
    background: $colfff;
    z-index: 10;
    .head-w {
      @include whl(1300, 70, 70);
      overflow: hidden;
      margin: 0 auto;
    }
  }
  .fixed-head{
    height: 70px;
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
      box-sizing: border-box;
      a{
        color: $col333;
        display: block;
        // border-top: 4px solid transparent;
      }
      &.on_change{
        a {
          color: $blueColor;
          // border-top: 4px solid $blueColor;
        }
      }
      .tab-item{
        &.router-link-exact-active {
          color: $blueColor;
          // border-top: 4px solid $blueColor;
        }
        // a{
        //   color: $blueColor;
        //   border-top: 4px solid $blueColor;
        // }
      }
    }
  }

  .login-wrap{
    @include display_flex(flex);
    @extend %alignitem_center;
    text-align: center;
  }
  .login-l{
    color: $blueColor;
    a{
      color: $blueColor;
      display: inline-block;
      margin: 0 3px;
    }
  }
  .learen-btn{
    @include whl(100, 28, 28);
    border-radius: 14px;
    color: $colfff;
    background: $blueColor;
    margin-left: 16px;
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
</style>
