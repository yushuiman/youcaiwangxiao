<template>
  <div>
    <header v-if="$route.meta.showHeader">
      <div class="head-wrap">
        <div class="head-w">
          <div class="head-list">
            <img src="../assets/images/global/yc-logo.png" alt="logo" class="yc-logo fl" @click="goIndex">
            <ul class="item-list fl">
              <li :class="{'on_change': metaTitle === v.name}" v-for="(v, index) in navArr" :key="index">
                <router-link :to="v.path">{{v.name}}</router-link>
              </li>
            </ul>
          </div>
          <div class="login-wrap">
            <a class="learen-btn" @click="goLearning">学习中心</a>
            <div class="login-l fl" v-if="!this.token">
              <a @click="goLogin('login')">登录</a>
              <!-- <router-link :to="{path: 'login', query: {type:'login'}}">登录</router-link> -->
              <a>|</a>
              <a @click="goLogin('reg')">注册</a>
              <!-- <router-link :to="{path: 'login', query: {type:'reg'}}">注册</router-link> -->
            </div>
            <HeadName v-if="this.token"></HeadName>
          </div>
        </div>
      </div>
      <div class="fixed-head"></div>
    </header>
  </div>
</template>
<script>
import HeadName from '../components/common/HeadName'
import config from '@/config'
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      navArr: [
        {
          path: '/',
          name: '首页'
        },
        {
          path: 'course',
          name: '课程'
        },
        {
          path: 'question',
          name: '题库'
        },
        {
          path: 'zhibo',
          name: '直播'
        },
        {
          path: 'zixun',
          name: '资讯'
        },
        {
          path: 'app',
          name: 'App'
        },
        {
          path: 'books',
          name: '优财图书馆'
        }
        // {
        //   path: 'followup-ducation',
        //   name: '后续教育'
        // }
      ]
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    }),
    metaTitle () {
      return this.$route.meta.title
    }
  },
  components: {
    HeadName
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.init()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.init()
      })
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut',
      'getIndexMessage'
    ]),
    init () {
      this.getIndexMessage() // 系统消息
      var _this = this
      var socket
      if (process.env.NODE_ENV === 'production') {
        socket = io(config.baseUrl.pro)
      } else {
        socket = io('https://dest.youcaiwx.cn')
      }
      socket.on('connect', function () {
        socket.emit('success', { username: _this.user_id })
        console.log('connect连接成功')
      })
      // 公开聊天
      socket.on('sendMsg', function (msg) {
        let data = JSON.parse(msg)
        if (data.type === 'system') {
          if (data.msg) {
            let obj = JSON.parse(data.msg)
            _this.$Notice.info({
              title: '您有一条新消息',
              desc: obj.value
            })
            if (obj.type === 'freezeMessage') {
              _this.handleLogOut()
              return
            }
            _this.getIndexMessage()
          }
        }
      })
    },
    goIndex () {
      this.$router.push('/')
    },
    // 登录
    goLogin (type) {
      this.$router.replace({ path: '/login',
        query: {
          ...this.$route.query,
          type: type
        }
      })
    },
    // 学习中心
    goLearning () {
      if (this.token) {
        this.$router.push('/learning-center-detail')
      } else {
        this.$router.push('/learning-center')
      }
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
      margin: 0 auto;
      position: relative;
    }
  }
  .fixed-head{
    height: 70px;
  }
  .yc-logo{
    @include wh(130, 34);
    margin: 18px 0;
    cursor: pointer;
  }
  .item-list{
    padding-left: 39px;
    li{
      line-height: 70px;
      font-size: 14px;
      float: left;
      box-sizing: border-box;
      a{
        padding: 0 21px;
        color: $col333;
        display: inline-block;
      }
      &.on_change{
        a {
          color: $blueColor;
        }
      }
      .tab-item{
        &.router-link-exact-active {
          color: $blueColor;
        }
      }
      &:hover{
        height: 69px;
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
    a{
      color: $blueColor;
      float: left;
      font-size: 14px;
    }
  }
  .learen-btn{
    @include whl(100, 28, 28);
    border-radius: 14px;
    color: $colfff;
    background: $blueColor;
    margin-right: 30px;
    display: inline-block;
    text-align: center;
  }

</style>
