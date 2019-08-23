<template>
  <div class="video-wrap">
    <div class="video-header">
      <router-link v-if="playCourseInfo.status == 1" :to="{ path: '/class-detail', query:{package_id: this.$route.query.package_id}}">></router-link>
      <router-link v-if="playCourseInfo.status == 2" :to="{ path: '/learning-center-detail', query:{package_id: this.$route.query.package_id}}">></router-link>
      <span>{{videoCredentials.Title}}</span>
      <div class="login-r fr">
        <img src="../../assets/images/global/email-icon.png" alt="email" class="email-icon" @click="goNewsPage">
        <i v-if="is_news == 1" class="new-dot"></i>
        <img :src="avatorImgPath" alt="头像" class="head-logo" @mouseenter="enter">
        <!-- 个人中心入口 -->
        <div v-show="flagEntrance" class="my-center-info">
          <ul class="mc-list">
            <li class="mc-item" :class="['mc-item0' + (index+1)]" v-for="(v, index) in personalArr" :key="index" @click="goPersonalPage(v, index)">
              <i class="center-icon"></i>{{v.type}}
            </li>
          </ul>
          <div class="mc-watch" v-if="watchRecordsList.video">
            <p class="mcw-title"><span><i class="center-icon"></i>{{watchRecordsList.name}}</span></p>
            <!-- {{watchRecordsList.video.course_id}}-{{watchRecordsList.video.section_id}} -->
            <p class="mcw-section"><span class="mcws-name">{{watchRecordsList.video.video_name}}</span><span class="goon" @click="goonWatch">继续</span></p>
          </div>
          <div class="log-out" @click="ouLogin">安全退出</div>
        </div>
      </div>
    </div>
    <div class="video-main" id="box">
      <div class="vid-kcqh" v-if="flagCourse">
        <h1 class="vc-title">套餐内课程</h1>
        <div class="vc-list" v-for="(item, index) in packageList" :key="index" @click="getSecvCatalog(item)">
          <img :src="item.pc_img" alt="">
          <div class="c-info">
            <h2>{{item.name}}</h2>
            <p>讲师: {{item.teacher_name}}</p>
          </div>
        </div>
      </div>
      <div class="video-info-l">
        <ul class="vinfo-ul">
          <li class="vinfo-item" @click="showModel('课程<br />切换')" v-if="playCourseInfo.status == 1">
            <i class="vio-icon vio-icon-01"></i>
            <p class="txt">课程<br />切换</p>
          </li>
          <!-- 正课且购买 -->
          <li class="vinfo-item" v-if="playCourseInfo.is_zhengke == 1 && playCourseInfo.userstatus == 1" @click="showModel('答疑')">
            <i class="vio-icon vio-icon-02"></i>
            <p class="txt">答疑</p>
          </li>
          <li class="vinfo-item" @click="showModel('讲义')">
            <i class="vio-icon vio-icon-03"></i>
            <p class="txt">讲义</p>
          </li>
        </ul>
      </div>
      <div class="video-info-c" id="left">
        <ali-player ref="aliPlayers" @ready="ready" v-if="videoCredentials.playAuth" :vid="VideoId" :playauth="videoCredentials.playAuth"></ali-player>
        <div class="try-watch-dialog" v-if="tryWatchFlag">
          <div @click="goBuy">试看结束去购买</div>
          <div @click="replay">重新开始</div>
        </div>
        <div class="star-collection" @click="courseCollection(videoCredentials.collect)">
          <Icon type="md-star-outline" style="color: #ffffff;" v-if="videoCredentials.collect == 2"/>
          <Icon type="md-star" style="color: #F99111;" v-if="videoCredentials.collect == 1"/>
        </div>
      </div>
      <div id="resize" class="course-drag">
        <div class="drag"></div>
      </div>
      <div class="video-info-r" :style="{ width: wImportant + 'px' }" id="right">
        <course-list v-if="flagKc && playCourseInfo.status == 1" :courseSections="courseSections" :openMenu="openMenu" :is_zhengke="playCourseInfo.is_zhengke" @closeModel="closeModel" @getVideoPlayback="getVideoPlayback"></course-list>
        <!-- <div v-if="playCourseInfo.status == 1">
        </div> -->
        <answer v-if="flagAnswer" :playCourseInfo="playCourseInfo" :user_id="user_id" @closeModel="closeModel"></answer>
        <div class="jiangyi" v-if="flagJy">
          <div class="close-box" @click="closeModel">
            <i class="close-icon"></i>
          </div>
          <h1 class="vc-title">讲义</h1>
          <iframe id="main-frame" :src="videoCredentials.handouts" width="100%" height="88%"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import aliPlayer from '@/components/video/aliPlayer'
import courseList from '@/components/video/courseList'
import answer from '@/components/video/answer'
import { watchRecords } from '@/api/personal'
import { videoPlayback, videoCredentials, courseCatalog, secvCatalog, collection, initWS } from '@/api/class'
import { mapMutations, mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      flagEntrance: false,
      watchRecordsList: {}, // 观看记录头像滑过
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
      backCount: 0,
      selMenu: 3,
      showBox: '课程<br />切换',
      vinfo: ['课程<br />切换', '答疑', '讲义'],
      flagKc: true,
      flagAnswer: false,
      flagCourse: false,
      flagJy: false,
      wImportant: 382,
      VideoId: '', // 视频VideoId
      videoCredentials: {
        handouts: '', // 讲义
        playAuth: '', // 获取视频凭证
        collect: '', // 收藏
        watch_time: '', // 观看时间
        Title: '', // name
        playtime: 0 // 播放时间记录，下次自动跳转到当前时间
      },
      playCourseInfo: {
        video_id: this.$route.query.video_id,
        section_id: this.$route.query.section_id,
        course_id: this.$route.query.course_id,
        package_id: this.$route.query.package_id,
        is_zhengke: 0,
        userstatus: window.sessionStorage.getItem('userstatus') || 2, // 1购买2未购买
        type: this.$route.query.type,
        status: this.$route.query.status || 1
      },
      packageList: [],
      secvCatalogArr: [],
      courseSections: [],
      openMenu: '1-1', // 默认播放菜单menu-index
      playVideoInfo: window.sessionStorage.getItem('playVideoInfo'), // 视频播放信息
      playtime: window.sessionStorage.getItem('playtime') || 0, // 视频上次播放时间
      socketTimer: null,
      tryWatchTimer: null,
      tryWatchFlag: false,
      tryQatchNum: 180 // 试看3分钟
    }
  },
  components: {
    aliPlayer,
    courseList,
    answer
  },
  computed: {
    ...mapState({
      avatorImgPath: state => state.user.avatorImgPath,
      user_id: state => state.user.user_id,
      is_news: state => state.nav.is_news
    })
  },
  mounted () {
    if (parseInt(this.playCourseInfo.status) === 2) {
      this.wImportant = 0
      this.flagKc = false
    }
    document.addEventListener('mouseover', (e) => {
      if (this.flagEntrance) {
        if (!this.$el.contains(e.target)) {
          this.flagEntrance = false
        }
      }
    })
    // this.initSecvCatalog() // 初始化加载数据-详情页面选择的目录course_id
    // this.getVideoPlayback(this.$route.query.video_id)
    this.getCourseCatalog() // 课程大纲（目录）
    this.dragControllerDiv()
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    ...mapMutations([
      'setChange'
    ]),
    dragControllerDiv () {
      var resize = document.getElementById('resize')
      var left = document.getElementById('left')
      var right = document.getElementById('right')
      var box = document.getElementById('box')
      resize.onmousedown = function (e) {
        var startX = e.clientX
        resize.left = resize.offsetLeft
        document.onmousemove = function (e) {
          var endX = e.clientX
          var moveLen = resize.left + (endX - startX)
          var maxT = box.clientWidth - resize.offsetWidth
          if (moveLen < 600) moveLen = 600
          if (moveLen > maxT - 382) moveLen = maxT - 382

          resize.style.left = moveLen
          left.style.width = moveLen + 'px'
          right.style.width = (box.clientWidth - moveLen - 10) + 'px'
        }
        document.onmouseup = function (evt) {
          document.onmousemove = null
          document.onmouseup = null
          resize.releaseCapture && resize.releaseCapture()
        }
        resize.setCapture && resize.setCapture()
        return false
      }
      window.onload = function () {
      }
    },
    // 播放器
    ready (instance) {
      // 跳转到上次播放时间
      instance.seek(this.playtime)
      // 30秒监听一次socket
      this.socketTimer = setInterval(() => {
        this.playtime = parseInt(instance.getCurrentTime())
        var message = {
          from: 1,
          user_id: this.user_id,
          package_id: this.$route.query.package_id,
          course_id: this.$route.query.course_id,
          section_id: this.$route.query.section_id,
          video_id: this.$route.query.video_id,
          watch_time: this.playtime,
          video_type: 1, // 视频类型 1视频2直播
          status: this.$route.query.status || 1 // 播放类型 1课程视频播放2学习中心
        }
        // 已购买并且视频播放时间大于0 socket
        if (parseInt(this.playCourseInfo.userstatus) === 1 && this.playtime > 0) {
          if (parseInt(this.$route.query.status) === 2) {
            message.days = this.$route.query.days
            message.plan_id = this.$route.query.plan_id
          }
          // console.log(JSON.stringify(message))
          initWS(JSON.stringify(message))
        }
        window.sessionStorage.setItem('playtime', this.playtime) // 防止刷新页面，也要记录当前播放时间
      }, 10000)
      // 未购买试看3分钟
      if (parseInt(this.playCourseInfo.userstatus) === 2) {
        this.tryWatchTimer = setInterval(() => {
          let playtime = parseInt(instance.getCurrentTime())
          if (playtime >= this.tryQatchNum) {
            this.tryWatchFlag = true
            instance.pause()
            instance.seek(this.tryQatchNum)
          } else {
            window.sessionStorage.setItem('playtime', playtime) // 防止刷新页面，也要记录当前播放时间
            instance.play()
          }
        }, 1000)
      }
    },
    enter () {
      this.getWatchRecords() // 观看记录
      this.flagEntrance = true
    },
    // 去购买
    goBuy () {
      this.$router.push({ path: '/class-detail',
        query: {
          package_id: this.playCourseInfo.package_id
        }
      })
    },
    // 重新试听
    replay () {
      this.tryWatchFlag = false
      this.$refs.aliPlayers.replay()
    },
    // tab 显示关闭课程，答疑，讲义
    showModel (val, index) {
      // this.selMenu = index
      if (val === '课程<br />切换') {
        this.flagCourse = !this.flagCourse
        this.flagAnswer = false
        this.flagJy = false
        this.wImportant = 0
        if (this.flagKc) {
          this.wImportant = 382
        }
      }
      if (val === '答疑') {
        this.flagAnswer = !this.flagAnswer
        this.flagJy = false
        if (this.flagAnswer) {
          this.wImportant = 495
        } else {
          if (this.flagKc) {
            this.wImportant = 382
          } else {
            this.wImportant = 0
          }
        }
      }
      if (val === '讲义') {
        this.flagJy = !this.flagJy
        this.flagAnswer = false
        if (this.flagJy) {
          this.wImportant = 495
        } else {
          if (this.flagKc) {
            this.wImportant = 382
          } else {
            this.wImportant = 0
          }
        }
      }
    },
    closeModel (msg) {
      if (msg === 'kc') {
        this.flagKc = false
      }
      this.flagAnswer = false
      this.flagJy = false
      this.wImportant = 0
      if (this.flagKc) {
        this.wImportant = 382
      }
    },
    // 课程大纲（目录）
    getCourseCatalog () {
      courseCatalog({
        package_id: this.$route.query.package_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.packageList = res.data
          let id = parseInt(this.$route.query.course_id || this.packageList[0].course_id)
          this.packageList.forEach(v => {
            if (id === v.course_id) {
              this.playCourseInfo.is_zhengke = v.is_zhengke
            }
          })
          this.initSecvCatalog(id)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 课程大纲(章节 video)
    getSecvCatalog (item, idx) {
      this.flagKc = true
      this.flagAnswer = false
      this.flagJy = false
      this.wImportant = 382
      this.playCourseInfo.is_zhengke = item.is_zhengke
      this.$router.replace({ path: 'class-video',
        query: {
          ...this.$route.query,
          course_id: item.course_id
        }
      })
      secvCatalog({
        course_id: item.course_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.courseSections = res.data
          this.secvCatalogArr.push({
            type: item.name,
            courseSections: res.data
          })
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 初始化展示章节
    initSecvCatalog (id) {
      secvCatalog({
        course_id: id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.courseSections = res.data
          this.courseSections.forEach((v, key) => {
            let sectionId = parseInt(this.$route.query.section_id)
            let videoId = parseInt(this.$route.query.video_id)
            v.videos.forEach((val, index) => {
              if (sectionId === v.section_id && videoId === val.video_id) {
                let openMenu = (key + 1) + '-' + (index + 1)
                this.openMenu = openMenu
              }
            })
          })
          this.playCourseInfo.course_id = this.$route.query.course_id || this.courseSections[0].course_id
          this.playCourseInfo.section_id = this.$route.query.section_id || this.courseSections[0].section_id
          this.playCourseInfo.video_id = this.$route.query.video_id || this.courseSections[0].videos[0].video_id
          this.getVideoPlayback(this.playCourseInfo.video_id)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 获取视频凭证
    getVideoPlayback (id) {
      videoPlayback({
        video_id: id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.VideoId = res.data.VideoId
          // 获取视频凭证
          videoCredentials({
            VideoId: res.data.VideoId,
            user_id: this.user_id,
            package_id: this.playCourseInfo.package_id,
            course_id: this.playCourseInfo.course_id,
            section_id: this.playCourseInfo.section_id,
            video_id: this.playCourseInfo.video_id
          }).then(data => {
            let res = data.data
            this.videoCredentials = res.data
          })
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    courseCollection (collectId) { // 1收藏2取消收藏
      // if (parseInt(this.$route.query.status) === 2) {
      //   this.$Message.error('试听课程，请购买后收藏')
      //   return
      // }
      this.videoCredentials.collect = 2
      if (collectId === 2) {
        this.videoCredentials.collect = 1
      }
      collection({
        package_id: this.playCourseInfo.package_id,
        course_id: this.playCourseInfo.course_id,
        section_id: this.playCourseInfo.section_id,
        video_id: this.playCourseInfo.video_id,
        user_id: this.user_id,
        static: this.videoCredentials.collect
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          if (this.videoCredentials.collect === 1) {
            this.$Message.success('收藏成功')
          } else {
            this.$Message.success('取消成功')
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
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
    // 消息中心
    goNewsPage () {
      this.$router.push('/news')
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
      this.$router.push({ path: '/class-video', query: obj })
      window.sessionStorage.setItem('userstatus', 1) // 是否购买
      window.sessionStorage.setItem('playtime', this.watchRecordsList.video.watch_time) // 获取当前播放时间
    },
    ouLogin () {
      this.$router.push('/')
      this.handleLogOut()
    }
  },
  beforeDestroy () {
    window.sessionStorage.removeItem('playtime')
    clearInterval(this.socketTimer)
    clearInterval(this.tryWatchTimer)
    // clearInterval(this.intervalId)
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .video-header{
    @include lh(70, 70);
    padding: 0 31px;
    background: $colfff;
    box-shadow: 0 4px 8px 0 rgba(28,31,33,.1);
    position: relative;
    z-index: 101;
    span{
      font-size: 16px;
      font-weight:500;
    }
    a{
      margin: 0 8px;
      color: $col999;
      display: inline-block;
      font-family: Consolas,Menlo,Courier,monospace;
      transform: rotate(180deg);
    }
  }
  .login-r{
    position: relative;
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
      }
    }
  }

  .vc-title{
    padding-top: 18px;
    padding-bottom: 30px;
    padding-left: 30px;
    font-size: 20px;
    color: $col333;
  }

  // // 目录 答疑 讲义
  // .video-course-wrap{
  //   position: absolute;
  //   top: 20px;
  //   background: #26292C;
  //   z-index: 12;
  //   padding: 0 20px;
  //   box-sizing: border-box;
  //   &.vid-jy, &.vid-dy{
  //     width: 495px;
  //     // height: 869px;
  //     height: 100%;
  //     top: 0;
  //     right: 0;
  //     background: #ffffff;
  //     box-shadow: 0px 15px 10px -15px rgba(0,0,0,0.2) inset;
  //   }
  //   &.vid-dy{
  //     padding: 0;
  //     background: #F8FAFC;
  //   }
  // }

  .video-main{
    position: absolute;
    bottom: 0;
    left: 0;
    top: 70px;
    width: 100%;
    background: #1D1F21;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
  }
  .video-info-l{
    background: #1c1f21;
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }
  .video-info-c{
    position: relative;
    flex: 1;
    background: #000000;
    border-radius: 10px;
    margin: 20px 0;
    overflow: hidden;
  }
  .video-info-r{
    position: relative;
    background: #1c1f21;
    // width: 384px;
    padding: 0;
    right: 0;
    z-index: 1;
    &.video-info-r-w{
      width: 495px;
    }
  }
  // 左边菜单
  .vinfo-ul{
    width: 100%;
  }
  .vinfo-item{
    padding: 30px 0;
    text-align: center;
    cursor: pointer;
    &:hover, &.curren{
      background: #26292C;
      .vio-icon-01{
        @include bg_img(22, 18, '../../assets/images/video/class-active-icon.png');
      }
      .vio-icon-02{
        @include bg_img(26, 24, '../../assets/images/video/answer-active-icon.png');
      }
      .vio-icon-03{
        @include bg_img(26, 25, '../../assets/images/video/jiangyi-active-icon.png');
      }
    }
    .txt{
      color: $col999;
      line-height: 18px;
      margin-top: 5px;
    }
  }
  .vio-icon{
    &.vio-icon-01{
      @include bg_img(22, 18, '../../assets/images/video/class-icon.png');
    }
    &.vio-icon-02{
      @include bg_img(26, 24, '../../assets/images/video/answer-icon.png');
    }
    &.vio-icon-03{
      @include bg_img(26, 25, '../../assets/images/video/jiangyi-icon.png');
    }
  }
  // 课程包
  .vid-kcqh{
    position: absolute;
    width: 386px;
    top: 0;
    left: 60px;
    bottom: 19px;
    z-index: 101;
    background: #26292C;
    overflow-y: scroll;
    .vc-title{
      color: #E6E6E6;
      padding-left: 30px;
      padding-top: 30px;
    }
  }
  .vc-list{
    padding-bottom: 30px;
    padding-left: 30px;
    display: flex;
    align-items: center;
    img{
      @include wh(87, 48);
      margin-right: 20px;
      border-radius: 4px;
    }
    .c-info{
      h2{
        font-size: 16px;
        color: #E6E6E6;
      }
      p{
        font-size: 12px;
        color: $col999;
        margin-top: 8px;
      }
    }
  }
  // 讲义
  .jiangyi{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    overflow: auto;
    background: $colfff;
  }
  .close-box{
    text-align: right;
    padding-top: 25px;
    padding-right: 20px;
    .close-icon{
      @include bg_img(15, 15, '../../assets/images/video/close-icon.png');
    }
  }
  // 收藏
  .star-collection{
    position: absolute;
    z-index: 10;
    right: 131px;
    bottom: 7px;
    font-size: 30px;
  }
  .try-watch-dialog{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #000;
    color: #ffffff;
    text-align: center;
    z-index: 333333;
    div{
      font-size: 16px;
      line-height: 30px;
    }
  }
  .drag {
    position: absolute;
    top: 50%;
    margin-top: -20px;
    left: 3px;
    width: 4px;
    height: 40px;
    border: 1px solid #626972;
    border-width: 0 1px 0 1px;
  }
  .course-drag {
    position: relative;
    width: 10px;
    height: 100%;
    cursor: col-resize;
    z-index: 2;
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
    position: absolute;
    top: 25px;
    left: 48px;
  }
</style>
