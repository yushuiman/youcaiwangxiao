<template>
  <div>
    <header v-show="$route.meta.showHeader">
      <div class="head-wrap">
        <div class="head-w">
          <div class="head-list">
            <img src="../assets/images/global/yc-logo.png" alt="logo" class="yc-logo fl">
            <ul class="item-list fl">
              <li :class="isChange === 'shouye' ? 'on_change' : ''" @click="onChange('shouye')"><router-link to="/">首页</router-link></li>
              <li :class="isChange === 'kecheng' ? 'on_change' : ''" @click="onChange('kecheng')"><router-link to="/class">课程</router-link></li>
              <li :class="isChange === 'tiku' ? 'on_change' : ''" @click="onChange('tiku')"><router-link to="/question">题库</router-link></li>
              <li :class="isChange ==='liveing' ? 'on_change' : ''" @click="onChange('liveing')"><router-link to="/zhibo">直播</router-link></li>
              <!-- <li :class="isChange === 'dayi' ? 'on_change' : ''" @click="onChange('dayi')"><router-link to="/answer">答疑</router-link></li> -->
              <li :class="isChange === 'zixun' ? 'on_change' : ''" @click="onChange('zixun')"><router-link to="/zixun">咨讯</router-link></li>
              <li :class="isChange ==='app' ? 'on_change' : ''" @click="onChange('app')"><router-link to="/app">App</router-link></li>
            </ul>
          </div>
          <div class="login-wrap">
            <div class="login-l fl" v-if="!this.token">
              <router-link :to="{path: 'login', query: {type:'login', is_forget: 'log-reg'}}">登录</router-link>
              <a>|</a>
              <router-link :to="{path: 'login', query: {type:'reg', is_forget: 'log-reg'}}">注册</router-link>
            </div>
            <div class="login-r fr" v-if="this.token">
              <a @click="ouLogin" class="out-login">退出登录</a>
              <a class="learen-btn" @click="goLearning">学习中心</a>
              <img src="../assets/images/global/email-icon.png" alt="email" class="email-icon">
              <img :src="avatorImgPath" alt="头像" class="head-logo" @click="goPersonalPage">
              <span>{{userName}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="fixed-head"></div>
    </header>
  </div>
</template>
<script>
// import { getToken } from '@/libs/utils'
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id,
      avatorImgPath: state => state.user.avatorImgPath,
      userName: state => state.user.userName,
      'is_change': state => state.nav.is_change,
      isLogin: state => state.nav.isLogin
    }),
    isChange () {
      return this.is_change
    }
  },
  mounted () {
    if (this.token) {
      if (!this.user_id) {
        this.getUserInfo()
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut',
      'getUserInfo'
    ]),
    ...mapMutations([
      'setChange',
      'setLogin'
    ]),
    onChange (navName) {
      this.setChange(navName)
    },
    ouLogin () {
      this.$router.push('/')
      this.handleLogOut()
    },
    // 个人中心
    goPersonalPage (index) {
      window.sessionStorage.setItem('type', 'course')
      this.$router.push('/personal')
      this.setChange('')
    },
    // 登录
    goLogin (type) {
      this.$router.push('login')
      this.setChange('')
    },
    // 学习中心
    goLearning (type) {
      this.$router.push('learning-center')
      this.setChange('')
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
    z-index: 1000;
    height: 70px;
    .head-w {
      width: 1300px;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      line-height: 70px;
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
      &:hover{
        box-shadow:0px 0px 9px 1px rgba(193,193,193,0.54);
        border-top: 1px solid $blueColor;
        border-top-left-radius: 1px;
        border-top-right-radius: 1px;
        box-sizing: border-box;
      }
    }
  }

  .login-wrap{
    @include display_flex(flex);
    @extend %alignitem_center;
  }
  .login-l{
    color: $blueColor;
    font-size: 0;
    a{
      color: $blueColor;
      // display: inline-block;
      // margin: 0 3px;
      float: left;
      font-size: 14px;
    }
  }
  .login-r{
    height: 30px;
    line-height: 30px;
    .out-login{
      color: #0267FF;
    }
    .learen-btn{
      @include whl(100, 28, 28);
      border-radius: 14px;
      color: $colfff;
      background: $blueColor;
      margin-left: 16px;
      display: inline-block;
      text-align: center;
    }
    img{
      vertical-align: middle;
      cursor: pointer;
      &.email-icon{
        @include wh(18, 14);
        margin: 0 31px;
      }
      &.head-logo{
        @include wh(30, 30);
        border-radius: 50%;
        margin-right: 10px;
      }
    }
    span{
      cursor: pointer;
    }
  }
</style>
