<template>
  <div class="video-wrap">
    <div class="video-header">
      <div>
        <router-link :to="{ path: '/course-detail', query: { package_id: this.$route.query.package_id }}">></router-link>
        <span>{{videoCredentials.Title}}</span>
        <span class="star-collection" @click="courseCollection" v-if="videoCredentials.collect == 2">
          <Icon type="md-star-outline" style="color: #999999; font-size: 22px; margin-top: -4px;" v-if="videoCredentials.collect == 2"/>收藏
        </span>
        <span class="star-collection act" @click="courseCollection" v-if="videoCredentials.collect == 1">
          <Icon type="md-star" style="color: #F99111; font-size: 22px; margin-top: -4px;" v-if="videoCredentials.collect == 1"/>收藏
        </span>
      </div>
      <HeadName :showName="false"></HeadName>
    </div>
    <div class="video-main" id="box">
      <div class="vid-kcqh" v-if="flagCourse">
        <h1 class="vc-title">套餐内课程</h1>
        <div class="vc-list" :class="{'cur': item.course_id == playCourseInfo.course_id}" v-for="(item, index) in packageList" :key="index" @click="getSecvCatalog(item)">
          <img :src="item.pc_img" alt="">
          <div class="c-info">
            <h2>{{item.name}}</h2>
            <p>讲师: {{item.teacher_name}}</p>
          </div>
        </div>
      </div>
      <div class="video-info-l">
        <ul class="vinfo-ul">
          <li class="vinfo-item" @click="showModel('课程<br />切换')">
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
        <ali-player
          ref="aliPlayers"
          v-if="videoCredentials.playAuth"
          :vid="VideoId"
          :playauth="videoCredentials.playAuth"
          :user_id="user_id"
          @ready="ready"
          @ended="ended">
        </ali-player>
        <div class="try-watch-dialog" v-if="tryWatchFlag">
          <div class="course-tip">
            <div @click="goBuy">试看结束，请购买</div>
            <div @click="replay">重新试听</div>
          </div>
        </div>
      </div>
      <!-- v-if="this.flagKc || this.flagAnswer || this.flagJy" -->
      <div id="resize" class="course-drag" :class="{'course-drag-hide': !this.flagKc && !this.flagAnswer && !this.flagJy}">
        <div class="drag"></div>
      </div>
      <div class="video-info-r" :style="{ width: wImportant + 'px' }" id="right">
        <course-list
          v-if="flagKc"
          :courseSections="courseSections"
          :openMenu="openMenu"
          :is_zhengke="playCourseInfo.is_zhengke"
          @closeModel="closeModel">
        </course-list>
        <answer v-if="flagAnswer" :playCourseInfo="playCourseInfo" :user_id="user_id" @closeModel="closeModel" @stopVideo="stopVideo"></answer>
        <div class="jiangyi" v-if="flagJy">
          <div class="close-box" @click="closeModel">
            <i class="close-icon"></i>
          </div>
          <h1 class="vc-title">讲义</h1>
          <iframe id="main-frame" :src="videoCredentials.handouts" width="100%" height="88%" style="position:absolute;top: 90px;bottom:0;width:100%;height: 88%;"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import aliPlayer from '@/components/video/aliPlayer'
import courseList from '@/components/video/courseList'
import answer from '@/components/video/answer'
import HeadName from '@/components/common/HeadName'
import { videoPlayback, videoCredentials, courseCatalog, secvCatalog, collection, firstSocket } from '@/api/class'
import config from '@/config'
import { mapState } from 'vuex'

export default {
  inject: ['reload'],
  data () {
    return {
      selMenu: 3,
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
        Title: '' // name
      },
      playCourseInfo: {
        video_id: this.$route.query.video_id,
        section_id: this.$route.query.section_id,
        course_id: this.$route.query.course_id,
        package_id: this.$route.query.package_id,
        is_zhengke: 0,
        userstatus: parseInt(window.sessionStorage.getItem('userstatus')) || 2 // 1购买2未购买
      },
      playCourseInfoNext: {},
      packageList: [],
      secvCatalogArr: [],
      courseSections: [],
      openMenu: '1-1', // 默认播放菜单menu-index
      playVideoInfo: window.sessionStorage.getItem('playVideoInfo'), // 视频播放信息
      playtime: 0, // 视频上次播放时间
      socketTimer: null,
      tryWatchTimer: null,
      tryWatchFlag: false,
      tryQatchNum: 180, // 试看3分钟
      isPlay: false
    }
  },
  components: {
    aliPlayer,
    courseList,
    answer,
    HeadName
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    this.getCourseCatalog() // 课程大纲（目录）
    this.dragControllerDiv()
    this.$nextTick(() => {
      var _this = this
      document.onkeydown = function (e) {
        let key = window.event.keyCode
        // alert(key)
        _this.watchKeydοwn(key)
      }
    })
    // if (this.flagCourse || this.flagAnswer || this.flagJy) {
    // }
    // this.initSecvCatalog() // 初始化加载数据-详情页面选择的目录course_id
    // this.getVideoPlayback(this.$route.query.video_id)
  },
  methods: {
    watchKeydοwn (keyNum) {
      let player = this.$refs.aliPlayers
      let playStatus = player.getStatus()
      console.log(keyNum + '' + playStatus + '' + this.isPlay)
      if (keyNum === 32) { // 空格暂停播放
        if (player.getCurrentTime() > 0) {
          this.isPlay = true
        }
        if (playStatus === 'playing' || this.isPlay) {
          player.pause()
        }
        if (playStatus === 'pause') {
          player.play()
        }
      }
      if (keyNum === 37) { // 快退
        let videotimes = player.getDuration()
        let playnum = player.getCurrentTime()
        playnum = parseInt(playnum - 5)
        if (playnum <= (videotimes - 30)) {
          player.seek(playnum)
        }
      }
      if (keyNum === 39) { // 快进
        let playnum = player.getCurrentTime()
        playnum = parseInt(playnum + 5)
        if (playnum > 15) {
          player.seek(playnum)
        } else {
          player.seek(0)
        }
      }
      if (keyNum === 38) { // 减音量
        // 音量大小 //获得当前音量
        let volume = parseInt(player.getVolume() * 100)
        if (volume < 100) {
          volume = (volume + 1) / 100
          player.setVolume(volume)
        }
      }
      if (keyNum === 40) { // 加音量
        let volume = parseInt(player.getVolume() * 100)
        if (volume > 0) {
          volume = (volume - 1) / 100
          player.setVolume(volume)
        }
      }
    },
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
    },
    // switchVideo () {
    //   this.reload()
    // },
    ended () {
      // this.socketIo() // 视频结束，再调一次socket，因为30秒监听一次，不准确。
      this.computedNextVid() // 计算下一个要播放的视频
      this.reload()
      // window.location.reload()
      // this.$refs.aliPlayers.ended()
      // await this.initSecvCatalog(this.playCourseInfoNext.course_id)
    },
    // 播放器
    ready (instance) {
      let ofH = window.sessionStorage.getItem('ofH')
      document.getElementById('rightCourseList').scrollTop = ofH
      // 跳转到上次播放时间
      instance.seek(this.playtime - 5)
      // if (parseInt(this.playtime) === parseInt(instance.getDuration())) {
      //   instance.seek(this.playtime - 5)
      // } else {
      //   instance.seek(this.playtime)
      // }
      // 初始化监听一次socket io
      if (this.playCourseInfo.userstatus === 1) {
        if (this.user_id !== '' && this.playCourseInfo.package_id !== '' && this.playCourseInfo.course_id !== '' && this.playCourseInfo.section_id !== '' && this.playCourseInfo.video_id !== '') {
          // this.socketIo()
          this.subFirstSocket()
        }
      }
      // 30秒监听一次socket
      this.socketTimer = setInterval(() => {
        // 已购买并且视频播放时间大于0 socket
        if (this.playCourseInfo.userstatus === 1) {
          if (instance.getStatus() === 'playing' && this.user_id !== '' && this.playCourseInfo.package_id !== '' && this.playCourseInfo.course_id !== '' && this.playCourseInfo.section_id !== '' && this.playCourseInfo.video_id !== '') {
            // this.socketIo()
          }
        }
      }, 30000)
      // 未购买试看3分钟
      if (this.playCourseInfo.userstatus === 2) {
        this.tryWatchTimer = setInterval(() => {
          let playtime = parseInt(instance.getCurrentTime())
          if (playtime >= this.tryQatchNum) {
            this.tryWatchFlag = true
            instance.pause()
            instance.seek(this.tryQatchNum)
          } else {
            this.playtime = playtime
          }
        }, 1000)
      }
    },
    // 首次socket
    subFirstSocket () {
      firstSocket({
        user_id: this.user_id,
        package_id: this.$route.query.package_id,
        course_id: this.playCourseInfo.course_id,
        section_id: this.playCourseInfo.section_id,
        video_id: this.playCourseInfo.video_id,
        watch_time: this.playtime,
        video_type: 1, // 视频类型 1视频2直播
        status: 1 // 播放类型 1课程视频播放2学习中心
      }).then((data) => {
      })
    },
    // 每30秒一次
    socketIo () {
      this.playtime = parseInt(this.$refs.aliPlayers.getCurrentTime())
      var message = {
        user_id: this.user_id,
        package_id: this.$route.query.package_id,
        course_id: this.playCourseInfo.course_id,
        section_id: this.playCourseInfo.section_id,
        video_id: this.playCourseInfo.video_id,
        watch_time: this.playtime,
        video_type: 1, // 视频类型 1视频2直播
        type: 1 // 播放类型 1课程视频播放2学习中心
      }
      console.log(message)
      var _this = this
      var socket
      if (process.env.NODE_ENV === 'production') {
        socket = io(config.baseUrl.pro)
      } else {
        socket = io('https://dest.youcaiwx.cn')
      }
      socket.on('connect', function () {
        socket.emit('success', { username: _this.user_id })
        console.log('course-video连接成功')
      })
      // 公开聊天
      // socket.on('sendMsg', function (msg) {
      //   let json = JSON.parse(msg)
      //   console.log(json)
      // })
      socket.emit('sendMsg', {
        'username': _this.user_id,
        'msg': message
      })
    },
    computedNextVid () {
      this.playCourseInfoNext = Object.assign({}, this.playCourseInfo)
      var profiles = this.courseSections
      var currentProfile = {
        section_id: this.playCourseInfo.section_id,
        course_id: this.playCourseInfo.course_id
      }
      var currentProfileIndex = (profiles || []).findIndex((profile) => profile.section_id + '' === currentProfile.section_id + '')
      var profiles2 = this.courseSections[currentProfileIndex].videos
      var currentProfile2 = {
        video_id: this.playCourseInfo.video_id
      }
      var currentProfileIndex2 = (profiles2 || []).findIndex((profile2) => profile2.video_id + '' === currentProfile2.video_id + '')
      if (currentProfileIndex === profiles.length - 1) {
        if (currentProfileIndex2 === profiles2.length - 1) {
          this.playCourseInfoNext.section_id = this.courseSections[0].section_id
          this.playCourseInfoNext.video_id = this.courseSections[0].videos[0].video_id
        } else {
          ++currentProfileIndex2
          this.playCourseInfoNext.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNext.video_id = this.courseSections[currentProfileIndex].videos[currentProfileIndex2].video_id
        }
      } else {
        if (currentProfileIndex2 === profiles2.length - 1) {
          ++currentProfileIndex
          this.playCourseInfoNext.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNext.video_id = this.courseSections[currentProfileIndex].videos[0].video_id
        } else {
          ++currentProfileIndex2
          this.playCourseInfoNext.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNext.video_id = this.courseSections[currentProfileIndex].videos[currentProfileIndex2].video_id
        }
      }
      this.$router.replace({ path: '/course-video',
        query: {
          ...this.$route.query,
          section_id: this.playCourseInfoNext.section_id,
          video_id: this.playCourseInfoNext.video_id
        }
      })
    },
    // 提问的时候停止播放
    stopVideo () {
      this.$refs.aliPlayers.pause()
      window.sessionStorage.setItem('pauseWatchTime', parseInt(this.$refs.aliPlayers.getCurrentTime()))
    },
    // 去购买
    goBuy () {
      this.$router.push({ path: '/course-detail',
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
      this.showLoading(true)
      courseCatalog({
        package_id: this.$route.query.package_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.packageList = res.data
          this.playCourseInfo.course_id = parseInt(this.$route.query.course_id || this.packageList[0].course_id)
          this.packageList.forEach(v => {
            if (this.playCourseInfo.course_id === v.course_id) {
              this.playCourseInfo.is_zhengke = v.is_zhengke
            }
          })
          this.initSecvCatalog(this.playCourseInfo.course_id)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 课程大纲(章节 video)
    getSecvCatalog (item, idx) {
      this.$router.replace({ path: 'course-video',
        query: {
          package_id: this.$route.query.package_id,
          course_id: item.course_id
        }
      })
      window.sessionStorage.removeItem('ofH')
      // window.location.reload()
      this.reload()
    },
    // 初始化展示章节
    initSecvCatalog (id) {
      this.showLoading(true)
      secvCatalog({
        course_id: id
      }).then(data => {
        this.showLoading(false)
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
            this.playtime = this.videoCredentials.watch_time
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
      // this.videoCredentials.collect = 2
      if (this.videoCredentials.collect === 2) {
        this.videoCredentials.collect = 1
      } else {
        this.videoCredentials.collect = 2
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
    }
  },
  beforeDestroy () {
    clearInterval(this.socketTimer)
    clearInterval(this.tryWatchTimer)
    if (this.$refs.aliPlayers) {
      this.$refs.aliPlayers.dispose()
    }
  },
  beforeRouteLeave (to, from, next) {
    window.sessionStorage.removeItem('ofH')
    console.log('remove aliplayer')
    next()
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
      font-size: 16px;
      font-weight:500;
      &.star-collection{
        cursor: pointer;
        font-size: 14px;
        margin-left: 24px;
        color: $col999;
      }
      &.act{
        color: #F99111!important;
      }
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
    z-index: 100;
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
      padding-bottom: 13px;
    }
  }
  .vc-list{
    padding: 15px 30px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &.cur, &:hover{
      background: #1c1f21;
    }
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
  .try-watch-dialog{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .8);
    color: #ffffff;
    text-align: center;
    z-index: 102;
    display: table;
    .course-tip{
      display: table-cell;
      vertical-align: middle;
      text-align: center;
      div{
        font-size: 18px;
        line-height: 40px;
        cursor: pointer;
      }
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
    &.course-drag-hide{
      visibility: hidden;
    }
  }
</style>
