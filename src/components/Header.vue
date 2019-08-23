<template>
  <div ref="headerRef" id="headerRef">
    <header v-if="$route.meta.showHeader">
      <div class="head-wrap">
        <div class="head-w">
          <div class="head-list">
            <img src="../assets/images/global/yc-logo.png" alt="logo" class="yc-logo fl" @click="goIndex">
            <ul class="item-list fl">
              <li :class="isChange === 'shouye' ? 'on_change' : ''" @click="onChange('shouye')"><router-link to="/">首页</router-link></li>
              <li :class="isChange === 'kecheng' ? 'on_change' : ''" @click="onChange('kecheng')"><router-link to="/class">课程</router-link></li>
              <li :class="isChange === 'tiku' ? 'on_change' : ''" @click="onChange('tiku')"><router-link to="/question">题库</router-link></li>
              <li :class="isChange ==='liveing' ? 'on_change' : ''" @click="onChange('liveing')"><router-link to="/zhibo">直播</router-link></li>
              <!-- <li :class="isChange === 'dayi' ? 'on_change' : ''" @click="onChange('dayi')"><router-link to="/answer">答疑</router-link></li> -->
              <li :class="isChange === 'zixun' ? 'on_change' : ''" @click="onChange('zixun')"><router-link to="/zixun">资讯</router-link></li>
              <li :class="isChange === 'app' ? 'on_change' : ''" @click="onChange('app')"><router-link to="/app">App</router-link></li>
              <!-- <li :class="isChange ==='app' ? 'on_change' : ''" @click="onChange('app')"><a>App</a></li> -->
            </ul>
          </div>
          <div class="login-wrap">
            <a class="learen-btn" @click="goLearning">学习中心</a>
            <div class="login-l fl" v-if="!this.token">
              <router-link :to="{path: 'login', query: {type:'login', is_forget: 'log-reg'}}">登录</router-link>
              <a>|</a>
              <router-link :to="{path: 'login', query: {type:'reg', is_forget: 'log-reg'}}">注册</router-link>
            </div>
            <div class="login-r fr" v-if="this.token">
              <img src="../assets/images/global/email-icon.png" alt="email" class="email-icon" @click="goNews">
              <i v-if="isNews == 1" class="new-dot"></i>
              <img :src="avatorImgPath" alt="头像" class="head-logo">
              <span @mouseenter="enter">{{userName}}</span>
              <!-- 个人中心入口 -->
              <div v-show="flagEntrance" class="my-center-info">
                <ul class="mc-list">
                  <li class="mc-item" :class="['mc-item0' + (index+1)]" v-for="(v, index) in personalArr" :key="index" @click="goPersonalPage(v, index)">
                    <i class="center-icon"></i>{{v.type}}
                  </li>
                </ul>
                <div class="mc-watch" v-if="watchRecordsList.video">
                  <p class="mcw-title"><span><i class="center-icon"></i>{{watchRecordsList.name}}</span></p>
                  <p class="mcw-section"><span class="mcws-name">{{watchRecordsList.video.video_name}}</span><span class="goon" @click="goonWatch">继续</span></p>
                </div>
                <div class="log-out" @click="ouLogin">安全退出</div>
              </div>
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
import { indexMessage } from '@/api/message'
import { watchRecords } from '@/api/personal'
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      flagEntrance: false,
      personalArr: [
        {
          type: '我的课程',
          sign: 'course'
        },
        {
          type: '订单中心',
          sign: 'order'
        },
        {
          type: '我的答疑',
          sign: 'answer'
        },
        {
          type: '个人设置',
          sign: 'set'
        }
      ],
      isNews: 0,
      watchRecordsList: {} // 观看记录
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
      this.getWatchRecords() // 观看记录
    }
    document.addEventListener('mouseover', (e) => {
      if (this.flagEntrance) {
        if (!this.$el.contains(e.target)) {
          this.flagEntrance = false
        }
      }
    })
  },
  methods: {
    ...mapActions([
      'handleLogOut',
      'getUserInfo'
    ]),
    ...mapMutations([
      'setChange',
      'setIsNews'
    ]),
    enter () {
      this.getWatchRecords() // 观看记录
      this.flagEntrance = true
    },
    onChange (navName) {
      this.setChange(navName)
      // if (navName === 'app') {
      //   window.location.href = 'http://www.youcaiwx.com/html/MAPP/Index/index.html'
      // }
    },
    ouLogin () {
      this.$router.push('/')
      this.handleLogOut()
    },
    // 点击logo回到首页
    goIndex () {
      this.$router.push('/')
      this.setChange('shouye')
    },
    // 个人中心
    goPersonalPage ({ sign }) {
      window.sessionStorage.setItem('type', sign)
      if (this.$route.name === 'personal') {
        window.location.reload()
      }
      this.flagEntrance = false
      this.$router.push('/personal')
      // console.log(this.$route.name === 'personal' || this.$route.path === '/personal')
      // console.log(this.$route.path === '/personal')
      // this.$router.push({ path: 'personal', query: { type: sign } })
      this.setChange('')
      // this.centerType(sign)
    },
    // 消息
    goNews () {
      this.$router.push('/news')
      this.setChange('')
    },
    // 登录
    goLogin (type) {
      this.$router.push('/login')
      this.setChange('')
    },
    // 学习中心
    goLearning () {
      if (this.token) {
        this.$router.push('/learning-center-detail')
      } else {
        this.$router.push('/learning-center')
      }
      this.setChange('')
    },
    // 是否有新信息
    getIndexMessage () {
      indexMessage({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.isNews = res.data
          this.setIsNews(res.data)
        }
      })
    },
    // 播放记录
    getWatchRecords () {
      watchRecords({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.watchRecordsList = res.data[0].list[0]
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 继续观看
    goonWatch () {
      let obj = {
        package_id: this.watchRecordsList.package_id,
        course_id: this.watchRecordsList.video.course_id,
        section_id: this.watchRecordsList.video.section_id,
        video_id: this.watchRecordsList.video.video_id
        // userstatus: 1 // 是否购买 未购买是没有记录的 所以是1
      }
      window.sessionStorage.setItem('userstatus', 1) // 是否购买
      window.sessionStorage.setItem('playtime', this.watchRecordsList.video.watch_time) // 获取当前播放时间
      this.$router.push({ path: '/class-video', query: obj })
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
  .login-r{
    height: 30px;
    line-height: 30px;
    .out-login{
      color: #0267FF;
    }
    img{
      vertical-align: middle;
      cursor: pointer;
      &.email-icon{
        @include wh(18, 14);
      }
      &.head-logo{
        @include wh(30, 30);
        border-radius: 50%;
        margin-left: 31px;
        margin-right: 10px;
      }
    }
    span{
      cursor: pointer;
    }
  }
  // 个人中心
  .my-center-info{
    position: absolute;
    right: 0;
    top: 70px;
    width: 254px;
    // height: 214px;
    background:#ffffff;
    border-radius: 6px;
  }
  .mc-list{
    display: flex;
    flex-wrap: wrap;
    padding: 16px 15px;
    .mc-item{
      width: 102px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background:#F3F6FF;
      margin: 4px 5px;
      cursor: pointer;
    }
  }
  .center-icon{
    vertical-align: middle;
    margin-top: -3px;
    margin-right: 4px;
    .mc-item01 &{
      @include bg-img(14, 12, '../assets/images/global/center-icon01.png');
    }
    .mc-item02 &{
      @include bg-img(14, 12, '../assets/images/global/center-icon02.png');
    }
    .mc-item03 &{
      @include bg-img(15, 14, '../assets/images/global/center-icon03.png');
    }
    .mc-item04 &{
      @include bg-img(15, 15, '../assets/images/global/center-icon04.png');
    }
    .mcw-title &{
      @include bg-img(14, 14, '../assets/images/global/center-icon05.png');
    }
  }
  .mc-watch{
    padding: 0 20px;
    color: $col666;
    p{
      display: flex;
      justify-content: space-between;
      line-height: 20px;
      &.mcw-section{
        margin-top: 3px;
        padding-left: 34px;
        .mcws-name{
          flex: 1;
          height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .goon{
        color: $blueColor;
        cursor: pointer;
      }
    }
  }
  .log-out{
    border-top: 1px solid #E6E6E6;
    margin-top: 20px;
    line-height: 40px;
    padding: 0 20px;
    cursor: pointer;
  }
  .new-dot{
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: red;
    display: inline-block;
    position: relative;
    top: -8px;
  }
</style>
