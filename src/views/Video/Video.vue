<template>
  <div class="video-wrap">
    <div class="video-header">
      <div>
        <router-link :to="{ path: '/course-detail', query: { package_id: this.$route.query.package_id }}">></router-link>
        <span>{{videoCredentials.Title}}</span>
        <!-- <span class="star-collection" @click="courseCollection" v-if="videoCredentials.collect == 2">
          <Icon type="md-star-outline" style="color: #999999; font-size: 22px; margin-top: -4px;" v-if="videoCredentials.collect == 2"/>收藏
        </span>
        <span class="star-collection act" @click="courseCollection" v-if="videoCredentials.collect == 1">
          <Icon type="md-star" style="color: #F99111; font-size: 22px; margin-top: -4px;" v-if="videoCredentials.collect == 1"/>收藏
        </span> -->
      </div>
      <HeadName :showName="false"></HeadName>
    </div>
    <div class="video-main" id="box">
      <div class="video-section-list" :class="{'active': flagCourse}">
        <course-list
          :courseSections="courseSections"
          :openMenu="openMenu"
          :is_zhengke="playCourseInfo.is_zhengke"
          @switchVideo="switchVideo">
        </course-list>
      </div>
      <div class="video-info-l">
        <ul class="vinfo-ul">
          <li class="vinfo-item" :class="{'curren': vinfoIdex == 0}" @click="showModel('章节', 0)">
            <i class="vio-icon vio-icon-01"></i>
            <p class="txt">章节</p>
          </li>
          <!-- 正课且购买 -->
          <li class="vinfo-item" :class="{'curren': vinfoIdex == 1}" v-if="playCourseInfo.is_zhengke == 1 && playCourseInfo.userstatus == 1" @click="showModel('答疑', 1)">
            <i class="vio-icon vio-icon-02"></i>
            <p class="txt">答疑</p>
          </li>
          <li class="vinfo-item" :class="{'curren': vinfoIdex == 2}" @click="showModel('讲义', 2)">
            <i class="vio-icon vio-icon-03"></i>
            <p class="txt">讲义</p>
          </li>
        </ul>
      </div>
      <div class="video-info-c" id="left" :style="{ height: screenHeight - 137 + 'px' }">
        <div class="course-video-box" v-if="!fixedVideo">
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
        <div class="course-video-box" :class="{'fix-video': fixedVideo}" v-if="fixedVideo">
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
        <answer v-if="flagAnswer" :playCourseInfo="playCourseInfo" :videoCredentials="videoCredentials" :answerTime="answerTime" :user_id="user_id" @closeModel="closeModel" @stopVideo="stopVideo" @addKeydown="addKeydown" @updataAnswerall="updataAnswerall"></answer>
      </div>
    </div>
    <div class="answer-jy-wrap w-wrap clearfix">
      <div class="aj-list-info-l fl">
        <ul class="tab-list-all-jx">
          <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': chooseIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
        </ul>
        <div class="aj-main">
          <ask-course v-if="chooseIdx == 0 && videoCredentials.playAuth" ref="updateAnswerRef" :user_id="user_id" :playCourseInfo="playCourseInfo" :videoCredentials="videoCredentials"></ask-course>
          <div class="aj-jy" v-if="chooseIdx == 1">
            <ul class="jy-ul">
              <li class="jy-item" v-for="(val, index) in courseSections" :key="index">
                <p>{{val.section_name}}</p>
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
import courseList from '@/components/video/courseList'
import askCourse from '@/components/video/askCourse'
import answer from '@/components/video/answer'
import HeadName from '@/components/common/HeadName'
import likeList from '@/components/class/likeList.vue'
// courseCatalog
import { videoPlayback, videoCredentials, secvCatalog, collection, firstSocket, courseVideo } from '@/api/class'
// import config from '@/config'
import Cookies from 'js-cookie'
import { mapState } from 'vuex'

export default {
  inject: ['reload'],
  data () {
    return {
      screenTimer: null, // 监听浏览器高度
      screenHeight: document.documentElement.clientHeight || document.body.clientHeight,
      chooseIdx: 0,
      vinfoIdex: 4,
      txtArr: ['答疑', '讲义下载'],
      flagAnswer: false,
      flagCourse: false,
      flagJy: true,
      fixedVideo: false,
      flagClosed: false,
      wImportant: 495,
      // speednum: 1, // 倍速默认1正常
      // speedTxt: Cookies.get('speedTxt') || '正常',
      // qualityTxt: Cookies.get('qualityTxt') || '高清',
      // voiceNum: 100, // 音量
      // speedList: [
      //   {
      //     text: '0.5X',
      //     speednum: 0.5
      //   },
      //   {
      //     text: '正常',
      //     speednum: 1
      //   },
      //   {
      //     text: '1.25X',
      //     speednum: 1.25
      //   },
      //   {
      //     text: '1.5X',
      //     speednum: 1.5
      //   },
      //   {
      //     text: '2X',
      //     speednum: 2
      //   }
      // ],
      // qualityList: [
      //   {
      //     text: '流畅',
      //     type: 'FD'
      //   },
      //   {
      //     text: '标清',
      //     type: 'LD'
      //   },
      //   {
      //     text: '高清',
      //     type: 'SD'
      //   }
      // ],
      VideoId: '', // 视频VideoId
      videoCredentials: {
        handouts: '', // 讲义
        playAuth: '', // 获取视频凭证
        collect: '', // 收藏
        watch_time: 0, // 观看时间,视频上次播放时间
        Title: '' // name
      },
      playCourseInfo: {
        video_id: this.$route.query.video_id,
        section_id: this.$route.query.section_id,
        course_id: this.$route.query.course_id,
        package_id: this.$route.query.package_id,
        is_zhengke: this.$route.query.is_zhengke || 2,
        userstatus: window.sessionStorage.getItem('userstatus') || 2 // 1购买2未购买
      },
      playCourseInfoNextPrev: {},
      // packageList: [],
      courseSections: [],
      openMenu: '1-1', // 默认播放菜单menu-index
      socketTimer: null,
      // tryWatchTimer: null,
      // tryWatchFlag: false,
      // tryQatchNum: 180, // 试看3分钟
      isPlay: false, // 视频初始化getStatus获取不准确
      answerTime: 0 // 答疑提问时间
    }
  },
  components: {
    aliPlayer,
    courseList,
    answer,
    HeadName,
    likeList,
    askCourse
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    // this.getCourseCatalog() // 课程大纲（目录）
    this.initSecvCatalog()
    this.dragControllerDiv()
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
          volume = (volume + 1)
          Cookies.set('voicenum', volume)
          player.keySetVoice()
        }
      }
      if (keyNum === 40) { // 加音量
        let volume = parseInt(player.getVolume() * 100)
        if (volume > 0) {
          volume = (volume - 1)
          Cookies.set('voicenum', volume)
          player.keySetVoice()
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
    switchVideo (type) {
      this.flagCourse = false
      if (type === 1) {
        this.getVideoPlayback(2)
      }
      if (type === 2) {
        if (!this.fixedVideo) {
          this.flagAnswer = false
          this.flagJy = true
          this.flagClosed = false
          this.wImportant = 495
        }
        this.getVideoPlayback(2)
      }
      if (type == 3) {
        if (!this.fixedVideo) {
          this.flagAnswer = false
          this.flagJy = true
          this.flagClosed = false
          this.wImportant = 495
        }
        this.computedPrevVid()
      }
      if (type == 4) {
        if (!this.fixedVideo) {
          this.flagAnswer = false
          this.flagJy = true
          this.flagClosed = false
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
      instance.setSpeed(speednum)
      // 音量设置
      let voicenum = Cookies.get('voicenum') || 100
      instance.setVolume(voicenum / 100)
      // 跳转到上次播放时间
      if (this.videoCredentials.watch_time == parseInt(instance.getDuration())) {
        instance.seek(0)
      } else {
        instance.seek(this.videoCredentials.watch_time)
      }
      // 列表位置记忆
      let anchor = document.querySelector('#showBox' + this.playCourseInfo.section_id + '' + this.playCourseInfo.video_id)
      let anchortop = document.querySelector('#showBox' + this.playCourseInfo.section_id + '' + this.playCourseInfo.video_id).offsetTop 
      let achparent = anchor.parentNode.offsetTop
      document.querySelector('.video-section-list').scrollTop = anchortop + achparent
      // 初始化监听一次socket io
      if (this.playCourseInfo.userstatus == 1) {
        if (this.user_id != '' && this.playCourseInfo.package_id != '' && this.playCourseInfo.course_id != '' && this.playCourseInfo.section_id != '' && this.playCourseInfo.video_id != '') {
          // this.socketIo()
          this.subFirstSocket()
        }
      }
      // 30秒监听一次socket
      this.socketTimer = setInterval(() => {
        // 已购买并且视频播放时间大于0 socket
        if (this.playCourseInfo.userstatus == 1) {
          if (instance.getStatus() == 'playing' && this.user_id != '' && this.playCourseInfo.package_id != '' && this.playCourseInfo.course_id != '' && this.playCourseInfo.section_id != '' && this.playCourseInfo.video_id != '') {
            this.socketIo()
          }
        }
      }, 30000)
      // 未购买试看3分钟
      // if (this.playCourseInfo.userstatus == 2) {
      //   this.tryWatchTimer = setInterval(() => {
      //     let playtime = parseInt(instance.getCurrentTime())
      //     if (playtime >= this.tryQatchNum) {
      //       this.tryWatchFlag = true
      //       instance.pause()
      //       instance.seek(this.tryQatchNum)
      //     } else {
      //       this.videoCredentials.watch_time = playtime
      //     }
      //   }, 1000)
      // }
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
        status: 1 // 播放类型 1课程视频播放2学习中心
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
        video_type: 1 // 视频类型 1视频2直播
      }
      courseVideo(message).then(data => {
      })
    },
    // 下一个视频
    computedNextVid () {
      // clearInterval(this.socketTimer)
      // this.socketTimer = null
      this.playCourseInfoNextPrev = Object.assign({}, this.playCourseInfo)
      var profiles = this.courseSections
      var currentProfile = {
        section_id: this.playCourseInfo.section_id,
        course_id: this.playCourseInfo.course_id
      }
      var currentProfileIndex = (profiles || []).findIndex((profile) => profile.section_id == currentProfile.section_id)
      var profiles2 = this.courseSections[currentProfileIndex].videos
      var currentProfile2 = {
        video_id: this.playCourseInfo.video_id
      }
      var currentProfileIndex2 = (profiles2 || []).findIndex((profile2) => profile2.video_id == currentProfile2.video_id)
      if (currentProfileIndex == profiles.length - 1) {
        if (currentProfileIndex2 == profiles2.length - 1) {
          this.$Message.error('已经是最后一节')
          return
          // this.playCourseInfoNextPrev.section_id = this.courseSections[0].section_id
          // this.playCourseInfoNextPrev.video_id = this.courseSections[0].videos[0].video_id
        } else {
          ++currentProfileIndex2
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].videos[currentProfileIndex2].video_id
        }
      } else {
        if (currentProfileIndex2 == profiles2.length - 1) {
          ++currentProfileIndex
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].videos[0].video_id
        } else {
          ++currentProfileIndex2
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].videos[currentProfileIndex2].video_id
        }
      }
      this.$router.replace({ path: '/course-video',
        query: {
          ...this.$route.query,
          section_id: this.playCourseInfoNextPrev.section_id,
          video_id: this.playCourseInfoNextPrev.video_id
        }
      })
      this.getVideoPlayback(2)
    },
    // 上一个视频
    computedPrevVid () {
      // clearInterval(this.socketTimer)
      // this.socketTimer = null
      this.playCourseInfoNextPrev = Object.assign({}, this.playCourseInfo)
      var profiles = this.courseSections
      var currentProfile = {
        section_id: this.playCourseInfo.section_id,
        course_id: this.playCourseInfo.course_id
      }
      var currentProfileIndex = (profiles || []).findIndex((profile) => profile.section_id == currentProfile.section_id)
      var profiles2 = this.courseSections[currentProfileIndex].videos
      var currentProfile2 = {
        video_id: this.playCourseInfo.video_id
      }
      var currentProfileIndex2 = (profiles2 || []).findIndex((profile2) => profile2.video_id == currentProfile2.video_id)
      if (currentProfileIndex == 0) {
        if (currentProfileIndex2 == 0) {
          // this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          // this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].videos[currentProfileIndex2].video_id
          // console.log(this.playCourseInfoNextPrev)
          this.$Message.error('已经是第一节')
          return
        } else {
          --currentProfileIndex2
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].videos[currentProfileIndex2].video_id
          // this.playCourseInfoNextPrev.section_id = this.courseSections[0].section_id
          // this.playCourseInfoNextPrev.video_id = this.courseSections[0].videos[0].video_id
        }
      } else {
        if (currentProfileIndex2 == 0) {
          --currentProfileIndex
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].videos[this.courseSections[currentProfileIndex].videos.length - 1].video_id
        } else {
          --currentProfileIndex2
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].videos[currentProfileIndex2].video_id
        }
      }
      this.$router.replace({ path: '/course-video',
        query: {
          ...this.$route.query,
          section_id: this.playCourseInfoNextPrev.section_id,
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
    // 去购买
    // goBuy () {
    //   this.$router.push({ path: '/course-detail',
    //     query: {
    //       package_id: this.playCourseInfo.package_id
    //     }
    //   })
    // },
    // 重新试听
    // replay () {
    //   this.tryWatchFlag = false
    //   this.$refs.aliPlayers.replay()
    // },
    // tab 显示关闭课程，答疑，讲义
    showModel (val, index) {
      this.vinfoIdex = index
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
        this.flagClosed = false
        this.wImportant = 495
      }
      if (val === '讲义') {
        if (this.fixedVideo) {
          return
        }
        this.flagJy = !this.flagJy
        if (this.flagJy) {
          this.flagAnswer = false
          this.flagClosed = false
          this.wImportant = 495
          return
        }
        this.flagAnswer = false
        this.wImportant = 95
        this.flagClosed = true
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
    // setQuality ({ text, type }) {
    //   this.qualityTxt = text
    //   Cookies.set('qualityTxt', text)
    //   Cookies.set('selectedStreamLevel', type)
    //   this.reload()
    // },
    // setSpeed ({ text, speednum }) {
    //   this.speedTxt = text
    //   Cookies.set('speedTxt', text)
    //   Cookies.set('speednum', speednum)
    //   this.$refs.aliPlayers.setSpeed(speednum)
    // },
    jiangyiDown (url) {
      if (!url) {
        this.$Message.error('串讲不支持下载')
        return
      }
      window.location.href = url
    },
    // 课程大纲（目录）
    // getCourseCatalog () {
    //   this.showLoading(true)
    //   courseCatalog({
    //     package_id: this.$route.query.package_id
    //   }).then(data => {
    //     this.showLoading(false)
    //     const res = data.data
    //     if (res.code === 200) {
    //       this.packageList = res.data
    //       this.playCourseInfo.course_id = this.$route.query.course_id || this.packageList[0].course_id
    //       this.packageList.forEach(v => {
    //         if (this.playCourseInfo.course_id == v.course_id) {
    //           this.playCourseInfo.is_zhengke = v.is_zhengke
    //         }
    //       })
    //       this.initSecvCatalog(this.playCourseInfo.course_id)
    //     } else {
    //       this.$Message.error(res.msg)
    //     }
    //   })
    // },
    // 初始化展示章节
    initSecvCatalog () {
      this.showLoading(true)
      secvCatalog({
        course_id: this.playCourseInfo.course_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.courseSections = res.data
          this.getVideoPlayback()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 获取视频VideoId，然后获取playAuth，type 2自动播放下一个视频
    getVideoPlayback (type) {
      // 重新赋值this.playCourseInfo，因为连续播放没必要调用initSecvCatalog。
      this.playCourseInfo.section_id = this.$route.query.section_id || this.courseSections[0].section_id
      this.playCourseInfo.video_id = this.$route.query.video_id || this.courseSections[0].videos[0].video_id
      // 计算当前视频被选中，添加active
      this.courseSections.forEach((v, key) => {
        let sectionId = this.playCourseInfo.section_id
        let videoId = this.playCourseInfo.video_id
        v.videos.forEach((val, index) => {
          if (sectionId == v.section_id && videoId == val.video_id) {
            let openMenu = (key + 1) + '-' + (index + 1)
            this.openMenu = openMenu
          }
        })
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
    // 获取视频凭证
    getVideoCredentials (VideoId, type) {
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
            this.$Message.success('收藏成功~')
          } else {
            this.$Message.success('取消成功~')
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // tab切换 (答疑 讲义下载)
    tabClk (type, index) {
      this.chooseIdx = index
    },
    // 答疑提问成功
    updataAnswerall () {
      this.$refs.updateAnswerRef.initRes()
    }
  },
  beforeDestroy () {
    clearInterval(this.socketTimer)
    this.socketTimer = null
    // clearInterval(this.tryWatchTimer)
    if (this.$refs.aliPlayers) {
      this.$refs.aliPlayers.dispose()
    }
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.socketTimer)
    this.socketTimer = null
    document.onkeydown = undefined
    clearTimeout(this.screenTimer)
    Cookies.remove('speedTxt')
    Cookies.remove('speednum')
    Cookies.remove('voicenum')
    Cookies.remove('voicenum1')
    next()
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/video.css";
  @import "../../assets/scss/slider.css";
</style>
