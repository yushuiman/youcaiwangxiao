<template>
  <div class="video-wrap">
    <div class="video-header">
      <div>
        <router-link :to="{ path: '/learning-center-detail', query: { package_id: playCourseInfo.package_id }}">></router-link>
        <span>{{videoCredentials.Title}}</span>
      </div>
      <HeadName :showName="false"></HeadName>
    </div>
    <div class="video-main" id="box">
      <div class="video-section-list" :class="{'active': flagCourse}">
        <ul class="video-list">
          <li class="video-item" :class="{'curren': playCourseInfo.video_id == v.video_id}" v-for="(v, index) in learnVideoList" :key="index" @click="switchVideo(2, v)"
          style="height: 36px;line-height: 36px;">
            <i class="el-video-icon"></i>
            <span class="sl">{{v.video_name}}</span>
            <i class="el-dot-icon"></i>
          </li>
        </ul>
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
        <div class="course-video-box" :class="{'fix-video': fixedVideo}">
          <ali-player
            ref="aliPlayers"
            v-if="videoCredentials.playAuth"
            :vid="VideoId"
            :playauth="videoCredentials.playAuth"
            :videoCredentials="videoCredentials"
            :fixedVideo="fixedVideo"
            :user_id="user_id"
            @ready="ready"
            @ended="ended"
            @switchVideo="switchVideo"
            @courseCollection="courseCollection">
          </ali-player>
        </div>
        <div class="pdf-iframe" style="height: 100%;overflow-y: auto;" v-if="fixedVideo">
          <iframe id="main-frame" :src="videoCredentials.handouts" width="100%" height="100%"></iframe>
        </div>
      </div>
      <div id="resize" class="course-drag" :class="{'course-drag-hide': flagClosed}">
        <div class="drag"></div>
      </div>
      <div class="video-info-r" :style="{ width: wImportant + 'px' }" id="right">
        <div class="video-panel-close" v-if="flagClosed" @click="closeModel('closed')">
          <Icon type="ios-arrow-round-back" style="font-size: 44px; color:#ffffff;"/>
        </div>
        <div class="jiangyi" v-if="flagJy" :class="{'littleScreen': fixedVideo}">
          <div class="vc-title" v-if="!fixedVideo">
            <p>
              <span class="active">讲义</span>
              <span @click="switchScreen('jy')" >讲义全屏</span>
            </p>
            <Icon type="md-close" style="color:#999999;font-size: 22px;" @click="closeModel('jy')"/>
          </div>
          <div class="video-screen" v-if="fixedVideo">
            <button class="btn-com" @click="switchScreen('video')" >视频全屏</button>
          </div>
          <iframe id="main-frame" :src="videoCredentials.handouts" width="100%" height="100%" ></iframe>
        </div>
        <answer v-if="flagAnswer" :playCourseInfo="playCourseInfo" :videoCredentials="videoCredentials" :answerTime="answerTime" :user_id="user_id" @closeModel="closeModel" @stopVideo="stopVideo" @addKeydown="addKeydown"></answer>
      </div>
    </div>
    <div class="answer-jy-wrap w-wrap clearfix">
      <div class="aj-list-info-l fl">
        <ul class="tab-list-all-jx">
          <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': chooseIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
        </ul>
        <div class="aj-main">
          <div class="aj-answer" v-if="chooseIdx == 0 && videoCredentials.playAuth">
            <ask-course ref="updateAnswerRef" :user_id="user_id" :playCourseInfo="playCourseInfo" :videoCredentials="videoCredentials"></ask-course>
          </div>
          <div class="aj-jy" v-if="chooseIdx == 1">
            <ul class="jy-ul">
              <li class="jy-item" v-for="(val, index) in learnVideoList" :key="index">
                <p>{{val.video_name}}</p>
                <span @click="jiangyiDown(val.handouts)"><i></i>下载</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="aj-else-info-r fr">
        <!-- 猜你喜欢 -->
        <like-list></like-list>
      </div>
    </div>
  </div>
</template>
<script>
import aliPlayer from '@/components/video/aliPlayer'
import askCourse from '@/components/video/askCourse'
import answer from '@/components/video/answer'
import HeadName from '@/components/common/HeadName'
import likeList from '@/components/class/likeList.vue'
import { videoCredentials, videoPlayback, collection, firstSocket } from '@/api/class'
import { getVideo, studyVideo } from '@/api/learncenter'
// import config from '@/config'
import Cookies from 'js-cookie'
import { mapState } from 'vuex'

export default {
  inject: ['reload'],
  data () {
    return {
      screenHeight: document.documentElement.clientHeight || document.body.clientHeight,
      chooseIdx: 0,
      vinfo: ['章节', '答疑', '讲义'],
      txtArr: ['答疑', '讲义下载'],
      flagAnswer: false,
      flagCourse: false,
      flagJy: true,
      fixedVideo: false,
      flagClosed: false,
      wImportant: 495,
      VideoId: '', // 视频VideoId
      videoCredentials: {
        handouts: '', // 讲义
        playAuth: '', // 获取视频凭证
        collect: '', // 收藏
        watch_time: '', // 观看时间
        Title: '' // name
      },
      playCourseInfo: {
        package_id: this.$route.query.package_id,
        course_id: this.$route.query.course_id,
        section_id: this.$route.query.section_id,
        video_id: this.$route.query.video_id,
        is_zhengke: this.$route.query.is_zhengke,
        userstatus: window.sessionStorage.getItem('userstatus') || 2, // 1购买2未购买
        days: this.$route.query.days,
        plan_id: this.$route.query.plan_id
      },
      playCourseInfoNextPrev: {},
      socketTimer: null,
      learnVideoList: [],
      isPlay: false,
      answerTime: 0, // 答疑提问时间
      screenTimer: null
    }
  },
  components: {
    aliPlayer,
    answer,
    HeadName,
    likeList,
    askCourse
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.goLearnVideo() // 视频列表 获取讲义视频播放
      this.dragControllerDiv()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.goLearnVideo() // 视频列表 获取讲义视频播放
        this.dragControllerDiv()
      })
    }
    this.$nextTick(() => {
      var _this = this
      document.onkeydown = function (e) {
        e.preventDefault()
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
    // this.initSecvCatalog() // 初始化加载数据-详情页面选择的目录course_id
    // this.getVideoPlayback(this.$route.query.video_id)
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
      // var left = document.getElementById('left')
      var right = document.getElementById('right')
      var box = document.getElementById('box')
      resize.onmousedown = function (e) {
        var startX = e.clientX
        resize.left = resize.offsetLeft
        document.onmousemove = function (e) {
          var endX = e.clientX
          var moveLen = resize.left + (endX - startX)
          var maxT = box.clientWidth - resize.offsetWidth
          if (moveLen < 680) moveLen = 680
          if (moveLen > maxT - 495) moveLen = maxT - 495
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
    // 1切换视频清晰度，2目录切换视频，3切换上一个视频，4切换下一个视频
    switchVideo (type, v) {
      // console.log(232322332)
      // clearInterval(this.socketTimer)
      // this.socketTimer = null
      this.flagCourse = false
      this.chooseIdx = 0
      if (type === 1) {
        this.getVideoPlayback(2)
      }
      if (type === 2) {
        this.$router.replace({ path: '/learn-center-video',
          query: {
            ...this.$route.query,
            package_id: v.package_id,
            course_id: v.course_id,
            section_id: v.section_id,
            video_id: v.video_id
          }
        })
        if (!this.fixedVideo) {
          this.flagAnswer = false
          this.flagJy = true
          this.flagClosed = true
          this.wImportant = 495
        }
        this.getVideoPlayback(2)
      }
      if (type == 3) {
        if (!this.fixedVideo) {
          this.flagAnswer = false
          this.flagJy = true
          this.flagClosed = true
          this.wImportant = 495
        }
        this.computedPrevVid()
      }
      if (type == 4) {
        if (!this.fixedVideo) {
          this.flagAnswer = false
          this.flagJy = true
          this.flagClosed = true
          this.wImportant = 495
        }
        this.computedNextVid()
      }
    },
    ended () {
      this.socketIo() // 视频结束，再调一次socket，因为30秒监听一次，不准确。
      this.computedNextVid() // 计算下一个要播放的视频
      this.videoCredentials.watch_time = parseInt(this.$refs.aliPlayers.getCurrentTime())
    },
    // 播放器
    ready (instance) {
      clearInterval(this.socketTimer)
      this.socketTimer = null
      // 倍速设置
      let speednum = Cookies.get('speednum') || 1
      let voicenum = Cookies.get('voicenum') || 100
      instance.setSpeed(speednum)
      // 先静音 打扰我听歌
      instance.setVolume(voicenum / 100)
      let ofH = window.sessionStorage.getItem('ofH') || 0
      document.querySelector('.video-section-list').scrollTop = ofH
      // 跳转到上次播放时间
      if (this.videoCredentials.watch_time == parseInt(instance.getDuration())) {
        instance.seek(0)
      } else {
        instance.seek(this.videoCredentials.watch_time)
      }
      // 初始化监听一次socket io
      if (this.playCourseInfo.userstatus == 1) {
        if (this.user_id != '' && this.playCourseInfo.package_id != '' && this.playCourseInfo.course_id != '' && this.playCourseInfo.section_id != '' && this.playCourseInfo.video_id != '') {
          // this.socketIo()
          this.subFirstSocket()
        }
      }
      // 30秒监听一次socket
      this.socketTimer = setInterval(() => {
        // 视频播放时间大于0 socket
        if (this.playCourseInfo.userstatus == 1) {
          if (instance.getStatus() == 'playing' && this.user_id != '' && this.playCourseInfo.package_id != '' && this.playCourseInfo.course_id != '' && this.playCourseInfo.section_id != '' && this.playCourseInfo.video_id != '') {
            this.socketIo()
          }
        }
      }, 30000)
    },
    // 首次socket
    subFirstSocket () {
      firstSocket({
        user_id: this.user_id,
        package_id: this.$route.query.package_id,
        course_id: this.playCourseInfo.course_id,
        section_id: this.playCourseInfo.section_id,
        video_id: this.playCourseInfo.video_id,
        watch_time: this.videoCredentials.watch_time,
        video_type: 1, // 视频类型 1视频2直播
        status: 2, // 播放类型 1课程视频播放2学习中心
        days: this.playCourseInfo.days,
        plan_id: this.playCourseInfo.plan_id
      }).then((data) => {
      })
    },
    // 每30秒一次
    socketIo () {
      this.videoCredentials.watch_time = parseInt(this.$refs.aliPlayers.getCurrentTime())
      var message = {
        user_id: this.user_id,
        package_id: this.$route.query.package_id,
        course_id: this.playCourseInfo.course_id,
        section_id: this.playCourseInfo.section_id,
        video_id: this.playCourseInfo.video_id,
        watch_time: this.videoCredentials.watch_time,
        // video_type: 1, // 视频类型 1视频2直播
        days: this.playCourseInfo.days,
        plan_id: this.playCourseInfo.plan_id
      }
      // console.log(message)
      studyVideo(message).then(data => {
      })
    },
    // 下一个视频
    computedNextVid () {
      this.playCourseInfoNextPrev = Object.assign({}, this.playCourseInfo)
      var profiles = this.learnVideoList
      var currentProfile = {
        video_id: this.playCourseInfo.video_id
      }
      var currentProfileIndex = (profiles || []).findIndex((profile) => profile.video_id == currentProfile.video_id)
      if (currentProfileIndex == profiles.length - 1) {
        // this.playCourseInfoNextPrev.video_id = this.learnVideoList[0].video_id
        this.$Message.error('已经是最后一节')
        return
      } else {
        ++currentProfileIndex
        this.playCourseInfoNextPrev.video_id = this.learnVideoList[currentProfileIndex].video_id
      }
      this.$router.replace({ path: '/learn-center-video',
        query: {
          ...this.$route.query,
          video_id: this.playCourseInfoNextPrev.video_id
        }
      })
      this.getVideoPlayback(2)
    },
    // 上一个视频
    computedPrevVid () {
      this.playCourseInfoNextPrev = Object.assign({}, this.playCourseInfo)
      var profiles = this.learnVideoList
      var currentProfile = {
        video_id: this.playCourseInfo.video_id
      }
      var currentProfileIndex = (profiles || []).findIndex((profile) => profile.video_id == currentProfile.video_id)
      if (currentProfileIndex == 0) {
        // this.playCourseInfoNextPrev.video_id = this.learnVideoList[0].video_id
        this.$Message.error('已经是第一节')
        return
      } else {
        --currentProfileIndex
        this.playCourseInfoNextPrev.video_id = this.learnVideoList[currentProfileIndex].video_id
      }
      this.$router.replace({ path: '/learn-center-video',
        query: {
          ...this.$route.query,
          video_id: this.playCourseInfoNextPrev.video_id
        }
      })
      this.getVideoPlayback(2)
    },
    // 提问的时候停止播放
    stopVideo () {
      this.$refs.aliPlayers.pause()
      // window.sessionStorage.setItem('pauseWatchTime', parseInt(this.$refs.aliPlayers.getCurrentTime()))
    },
    // 提问鼠标离开
    addKeydown () {
      var _this = this
      document.onkeydown = function (e) {
        e.preventDefault()
        let key = window.event.keyCode
        _this.watchKeydοwn(key)
      }
    },
    // tab 显示关闭课程，答疑，讲义
    showModel (val, index) {
      if (val === '章节') {
        this.flagCourse = !this.flagCourse
      }
      if (val === '答疑') {
        this.answerTime = parseInt(this.$refs.aliPlayers.getCurrentTime())
        if (this.fixedVideo) {
          this.fixedVideo = !this.fixedVideo
          this.flagAnswer = true
          this.flagJy = false
          this.flagClosed = false
          this.wImportant = 495
          return
        }
        this.flagAnswer = !this.flagAnswer
        this.flagJy = !this.flagAnswer
        this.wImportant = 495
      }
      if (val === '讲义') {
        if (this.fixedVideo) {
          return
        }
        this.flagJy = true
        this.flagAnswer = false
        this.wImportant = 495
      }
    },
    closeModel (msg) {
      this.flagCourse = false
      if (msg === 'jy') {
        if (this.fixedVideo) {
          return
        }
        this.flagJy = false
        this.flagClosed = true
        this.wImportant = 95
      }
      if (msg === 'answer' || msg === 'closed') {
        this.flagJy = true
        this.flagClosed = false
        this.flagAnswer = false
        this.wImportant = 495
      }
    },
    // 切换模式
    switchScreen (type) {
      if (type === 'jy') {
        this.fixedVideo = true
        this.flagJy = true
        this.wImportant = 326
        this.flagClosed = true
      }
      if (type === 'video') {
        this.fixedVideo = false
        this.flagJy = true
        this.wImportant = 495
        this.flagClosed = false
      }
    },
    jiangyiDown (url) {
      if (!url) {
        this.$Message.error('串讲不支持下载')
        return
      }
      window.location.href = url
    },
    // 视频列表
    goLearnVideo () {
      let types = 2
      if (this.playCourseInfo.userstatus == 2) { // 0元体验 userstatus==2未购买
        types = 1
      }
      this.showLoading(true)
      getVideo({
        user_id: this.user_id,
        course_id: this.playCourseInfo.course_id,
        plan_id: this.playCourseInfo.plan_id,
        types: types,
        days: this.playCourseInfo.days,
        sameday: 1 // 是今天1不是2
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.learnVideoList = res.data.video
          this.getVideoPlayback()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 获取视频VideoId，然后获取playAuth，type 2自动播放下一个视频
    getVideoPlayback (type) {
      this.playCourseInfo.video_id = this.$route.query.video_id
      this.learnVideoList.forEach(v => {
        if (this.playCourseInfo.video_id == v.video_id) {
          this.videoCredentials.watch_time = v.watch_time
        }
      })
      videoPlayback({
        video_id: this.playCourseInfo.video_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.getVideoCredentials(res.data.VideoId, type)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    getVideoCredentials (VideoId, type) {
      // 获取视频凭证
      videoCredentials({
        VideoId: VideoId,
        user_id: this.user_id,
        package_id: this.playCourseInfo.package_id,
        course_id: this.playCourseInfo.course_id,
        section_id: this.playCourseInfo.section_id,
        video_id: this.playCourseInfo.video_id
      }).then(data => {
        let res = data.data
        this.VideoId = VideoId
        this.videoCredentials = res.data
      }).then(() => {
        if (type == 2) {
          this.$refs.aliPlayers.ended(this.VideoId, this.videoCredentials.playAuth)
          this.$refs.updateAnswerRef.initRes()
        }
      })
    },
    courseCollection (collectId) { // 1收藏2取消收藏
      if (this.videoCredentials.collect == 2) {
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
          if (this.videoCredentials.collect == 1) {
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
    tabClk (type, index) {
      this.chooseIdx = index
    }
  },
  beforeDestroy () {
    clearInterval(this.socketTimer)
    this.socketTimer = null
    if (this.$refs.aliPlayers) {
      this.$refs.aliPlayers.dispose()
    }
  },
  beforeRouteLeave (to, from, next) {
    console.log('remove aliplayer')
    clearInterval(this.socketTimer)
    this.socketTimer = null
    document.onkeydown = undefined
    window.sessionStorage.removeItem('ofH')
    Cookies.remove('speedTxt')
    Cookies.remove('speednum')
    Cookies.remove('voicenum')
    Cookies.remove('voicenum1')
    next()
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  @import "../../assets/scss/video.css";
  @import "../../assets/scss/slider.css";
  // 目录
  .video-item{
    padding: 0 20px;
    line-height: 29px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $col999;
    &:hover{
      background: #000000;
      cursor: pointer;
    }
    &.curren{
      color: #F99111;
    }
  }
  .el-video-icon{
    @include wh(14, 14);
    margin-right: 10px;
    @extend %bg-img;
    background-image: url('../../assets/images/video/stop-icon.png');
    .video-item.curren &{
      background-image: url('../../assets/images/video/play-icon.png');
    }
  }
  .el-dot-icon{
    @include wh(10, 10);
    border-radius: 100%;
    border: 2px solid rgba(102,102,102,1);
    box-sizing: border-box;
    float: right;
    &.el-dot-see{
      border: 0;
      background: rgba(249,145,17,1);
    }
    .video-item.curren &{
      border: 0;
      border:2px solid rgba(249,145,17,1);
    }
  }
  .sl{
    width: 80%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
