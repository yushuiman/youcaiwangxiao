<template>
  <div class="login-r fr">
    <img src="../../assets/images/global/email-icon.png" alt="email" class="email-icon" @click="goNews">
    <i v-if="is_news == 1" class="new-dot"></i>
    <Dropdown trigger="hover" :transfer="true" @on-visible-change="dropDownVisible">
      <img :src="avatorImgPath" alt="头像" class="head-logo" @click="goPersonalPage('course')">
      <span v-if="showName" @click="goPersonalPage('course')">{{userName}}</span>
      <DropdownMenu slot="list" class='drop-list'>
        <!-- 个人中心入口 -->
        <div class="my-center-info">
          <ul class="mc-list">
            <li class="mc-item" :class="['mc-item0' + (index+1)]" v-for="(v, index) in personalArr" :key="index" @click="goPersonalPage(v.sign)">
              <i class="center-icon"></i>{{v.type}}
            </li>
          </ul>
          <div class="mc-watch" v-if="watchRecordsList.video">
            <p class="mcw-title"><span><i class="center-icon"></i>{{watchRecordsList.name}}</span></p>
            <p class="mcw-section"><span class="mcws-name">{{watchRecordsList.video.video_name}}</span><span class="goon" @click="goonWatch">继续</span></p>
          </div>
          <div class="log-out" @click="ouLogin">安全退出</div>
        </div>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'home',
  props: {
    showName: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
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
      ]
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id,
      avatorImgPath: state => state.user.avatorImgPath,
      userName: state => state.user.userName,
      watchRecordsList: state => state.user.watchRecordsList,
      is_news: state => state.news.is_news
    })
  },
  mounted () {
    if (this.token) { // 刷新页面vuex状态重新储存
      this.getUserInfo()
    }
  },
  created () {
  },
  methods: {
    ...mapActions([
      'handleLogOut',
      'getUserInfo',
      'getWatchRecords'
    ]),
    dropDownVisible (change) {
      if (change) {
        this.getWatchRecords({ userId: this.user_id }) // 观看记录
      }
    },
    ouLogin () {
      this.handleLogOut()
      this.$router.push('/')
    },
    // 个人中心
    goPersonalPage (sign) {
      if (this.$route.name === 'personal') {
        this.$router.push({ path: '/personal', query: { type: sign } })
        window.location.reload()
        return
      }
      this.$router.push({ path: '/personal', query: { type: sign } })
    },
    // 消息
    goNews () {
      this.$router.push('/news')
    },
    // 继续观看
    goonWatch () {
      if (this.watchRecordsList.is_purchase === 2) {
        this.$Message.error('请购买课程')
        return
      }
      let obj = {
        package_id: this.watchRecordsList.package_id,
        course_id: this.watchRecordsList.video.course_id,
        section_id: this.watchRecordsList.video.section_id,
        video_id: this.watchRecordsList.video.video_id
      }
      window.sessionStorage.setItem('userstatus', this.watchRecordsList.is_purchase) // 是否购买
      window.sessionStorage.setItem('playtime', this.watchRecordsList.video.watch_time) // 获取当前播放时间
      this.$router.push({ path: '/course-video', query: obj })
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
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
    width: 254px;
    background:#ffffff;
    border-radius: 6px;
    margin-top: 19px;
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
      @include bg-img(14, 12, '../../assets/images/global/center-icon01.png');
    }
    .mc-item02 &{
      @include bg-img(14, 12, '../../assets/images/global/center-icon02.png');
    }
    .mc-item03 &{
      @include bg-img(15, 14, '../../assets/images/global/center-icon03.png');
    }
    .mc-item04 &{
      @include bg-img(15, 15, '../../assets/images/global/center-icon04.png');
    }
    .mcw-title &{
      @include bg-img(14, 14, '../../assets/images/global/center-icon05.png');
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
