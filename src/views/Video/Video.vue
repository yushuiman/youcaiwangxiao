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
      <div class="video-section-list" :class="{'active': flagCourse}">
        <course-list
          :courseSections="courseSections"
          :openMenu="openMenu"
          :is_zhengke="playCourseInfo.is_zhengke"
          @closeModel="closeModel">
        </course-list>
      </div>
      <div class="video-info-l">
        <ul class="vinfo-ul">
          <li class="vinfo-item" @click="showModel('章节')">
            <i class="vio-icon vio-icon-01"></i>
            <p class="txt">章节</p>
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
      <div class="video-info-c" id="left" :style="{ height: screenHeight - 137 + 'px' }">
        <div class="course-video-box">
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
      </div>
      <div id="resize" class="course-drag" :class="{'course-drag-hide': !this.flagAnswer && !this.flagJy}">
        <div class="drag"></div>
      </div>
      <div class="video-info-r" :style="{ width: wImportant + 'px' }" id="right">
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
    <div class="cl-three-wrap w-wrap clearfix">
      <div class="clt-list-info-l fl">
        <div class="clt-tab">
          <span @click="tabChoose('answer')" :class="{'on': isChoose == 'answer'}">答疑</span>
          <span @click="tabChoose('download')" :class="{'on': isChoose == 'download'}">讲义下载</span>
        </div>
        <div class="clt-main">
          <div class="clt-jianjie" v-show="isChoose == 'kcjj'">
            ssdfsdfsdfsdf
          </div>
          <div class="clt-kcdg" v-show="isChoose == 'kjdg'">
            ssdfsdfsdfsdf水电费水电费
          </div>
        </div>
      </div>
      <div class="clt-else-info-r fr">
        <!-- 猜你喜欢 -->
        <like-list></like-list>
      </div>
    </div>
  </div>
</template>
<script>
import aliPlayer from '@/components/video/aliPlayer'
import courseList from '@/components/video/courseList1'
import answer from '@/components/video/answer'
import HeadName from '@/components/common/HeadName'
import likeList from '@/components/class/likeList.vue'
import { videoPlayback, videoCredentials, courseCatalog, secvCatalog, collection, firstSocket, courseVideo } from '@/api/class'
// import config from '@/config'
import { mapState } from 'vuex'

export default {
  inject: ['reload'],
  data () {
    return {
      screenHeight: document.documentElement.clientHeight || document.body.clientHeight,
      isChoose: 'answer',
      selMenu: 3,
      vinfo: ['章节', '答疑', '讲义'],
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
      isPlay: false,
      screenTimer: null
    }
  },
  components: {
    aliPlayer,
    courseList,
    answer,
    HeadName,
    likeList
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
        _this.watchKeydοwn(key)
      }
    })
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.documentElement.screenHeight || document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }
  },
  watch: {
    screenHeight (val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.screenTimer) {
        // 一旦监听到的screenHeight值改变，就将其重新赋给data里的screenHeight
        this.screenHeight = val
        this.screenTimer = true
        let that = this
        setTimeout(function () {
          // 打印screenHeight变化的值
          that.screenTimer = false
        }, 300)
      }
    }
  },
  methods: {
    watchKeydοwn (keyNum) {
      let player = this.$refs.aliPlayers
      let playStatus = player.getStatus()
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
      this.socketIo() // 视频结束，再调一次socket，因为30秒监听一次，不准确。
      this.computedNextVid() // 计算下一个要播放的视频
      this.reload()
      // window.location.reload()
      // this.$refs.aliPlayers.ended()
      // await this.initSecvCatalog(this.playCourseInfoNext.course_id)
    },
    // 播放器
    ready (instance) {
      // 倍速设置
      let speed = window.sessionStorage.getItem('speed')
      if (speed && speed != '正常') {
        instance.setSpeed(parseInt(speed))
        document.querySelector('.prism-setting-speed .current-setting').innerHTML = speed
        console.log('倍速：' + document.querySelector('.prism-setting-speed .current-setting').innerHTML)
      }
      // 先静音 打扰我听歌
      instance.setVolume(0)
      let ofH = window.sessionStorage.getItem('ofH')
      document.getElementById('rightCourseList').scrollTop = ofH
      // 跳转到上次播放时间
      instance.seek(this.playtime - 5)
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
            this.socketIo()
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
        video_type: 1 // 视频类型 1视频2直播
      }
      courseVideo(message).then(data => {
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
      // 倍速记忆
      window.sessionStorage.setItem('speed', document.querySelector('.prism-setting-speed .current-setting').innerHTML)
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
      if (val === '章节') {
        this.flagCourse = !this.flagCourse
        this.flagAnswer = false
        this.flagJy = false
        this.wImportant = 0
      }
      if (val === '答疑') {
        this.flagAnswer = !this.flagAnswer
        this.flagJy = false
        if (this.flagAnswer) {
          this.wImportant = 495
        } else {
          this.wImportant = 0
        }
      }
      if (val === '讲义') {
        this.flagJy = !this.flagJy
        this.flagAnswer = false
        if (this.flagJy) {
          this.wImportant = 495
        } else {
          this.wImportant = 0
        }
      }
    },
    closeModel (msg) {
      this.flagAnswer = false
      this.flagJy = false
      this.wImportant = 0
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
    },
    // tab切换 (答疑 讲义下载)
    tabChoose (type) {
      this.isChoose = type
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
    document.onkeydown = undefined
    window.sessionStorage.removeItem('ofH')
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
    width: 100%;
    background: #1D1F21;
    overflow: hidden;
    display: flex;
    position: relative;
  }
  .video-info-l{
    background: #1c1f21;
    width: 60px;
    display: flex;
    align-items: center;
    z-index: 100;
  }
  .video-info-c{
    position: relative;
    flex: 1;
    padding: 20px 0;
    .course-video-box{
      height: 100%;
      background: #000000;
      border-radius: 10px;
      overflow: hidden;
    }
  }
  .video-info-r{
    position: relative;
    background: #1c1f21;
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
    display: flex;
    justify-content: center;
    flex-direction: column;
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
        @include bg_img(24, 25, '../../assets/images/video/jiangyi-active-icon.png');
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
      @include bg_img(24, 25, '../../assets/images/video/jiangyi-icon.png');
      background-size: 100% 100%;
    }
  }
  // 课程包
  .video-section-list{
    position: absolute;
    width: 386px;
    padding: 20px 0;
    top: 0;
    left: -386px;
    opacity: 0;
    bottom: 19px;
    z-index: 99;
    background: #26292C;
    overflow-y: scroll;
    transition: .3s all linear;
    &.active{
      opacity: 1;
      left: 60px;
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
  // 新增
  .clt-main{
    width: 902px;
    img{
      width: 100%;
    }
  }
  .clt-tab{
    @include lh(67, 67);
    background: #f00;
    span{
      font-size: 16px;
      padding: 0 21px;
      display: inline-block;
      cursor: pointer;
      &.on{
        color: $blueColor;
      }
    }
  }
  .clt-kcdg{
    width: 902px;
  }
  .clt-else-info-r{
    padding-top: 49px;
  }
</style>
