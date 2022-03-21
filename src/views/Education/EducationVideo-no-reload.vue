<template>
  <div class="video-wrap">
    <div class="video-header">
      <div>
        <router-link :to="{ path: '/personal', query: { type: 'education' }}">
          <Icon type="ios-arrow-back" style="color:#999999;font-size: 22px;vertical-align: middle;margin-top:-3px;margin-right: 12px;"/>
        </router-link>
        <span>{{videoCredentials.Title}}</span>
      </div>
      <HeadName :showName="false"></HeadName>
    </div>
    <div class="video-main" :class="{'curren': fixedVideo}" id="box">
      <div class="video-info-l">
        <ul class="vinfo-ul">
          <li class="vinfo-item" :class="{'curren': vinfoIdex == 0}" @click="showModel('章节', 0)">
            <i class="vio-icon vio-icon-01"></i>
            <p class="txt">章节</p>
          </li>
          <li class="vinfo-item" :class="{'curren': vinfoIdex == 2}" @click="showModel('讲义', 2)">
            <i class="vio-icon vio-icon-03"></i>
            <p class="txt">讲义</p>
          </li>
        </ul>
      </div>
      <div class="video-info-c" style="padding-top: 34px;" id="left" :style="{ height: screenHeight - 60 + 'px' }">
        <p style="position:absolute;top:0;color: #F99111;height: 34px;line-height: 34px;">如何获得本课程学分：每个视频结束后点击“签到”成功后，即可获取对应视频的积分。</p>
        <div class="course-video-box" v-if="!fixedVideo">
          <ali-player
            ref="aliPlayers"
            v-if="videoCredentials.playAuth"
            :videoCredentials="videoCredentials"
            :fixedVideo="fixedVideo"
            :diffLogic="1"
            :canSign="canSign"
            :visible="visible"
            :jianTime="jianTime"
            :isLianxu="isLianxu"
            :showReplay="showReplay"
            :cpe_integral="cpe_integral"
            :user_id="user_id"
            @ready="ready"
            @ended="ended"
            @signSub="signSub"
            @setLianxuPlay="setLianxuPlay"
            @replayVideo="replayVideo"
            @switchVideo="switchVideo">
          </ali-player>
        </div>
        <div class="pdf-iframe" style="height: 100%;overflow-y: auto;" v-if="fixedVideo">
          <iframe id="main-frame" :src="videoCredentials.handouts" width="100%" height="100%"></iframe>
        </div>
      </div>
      <!-- :class="{'course-drag-hide': flagClosed}" -->
      <div id="resize" class="course-drag" v-if="!flagClosed">
        <div class="drag"></div>
      </div>
      <div class="video-info-r" :style="{ width: wImportant + 'px' }" id="right">
        <div class="video-panel-close" v-if="flagClosed" @click="showModel('closed')">
          <Icon type="ios-arrow-round-back" style="font-size: 44px; color:#ffffff;"/>
        </div>
        <!-- :class="{'active': !flagCourseSec}" -->
        <div class="video-section-list" v-if="flagCourseSec">
          <div class="vc-title">
            <p>章节目录</p>
            <Icon type="md-close" style="color:#999999;font-size: 22px;" @click="closeModel('sec')"/>
          </div>
          <course-list
            :courseSections="courseSections"
            :openMenu="openMenu"
            @switchVideo="switchVideo">
          </course-list>
        </div>
        <div class="course-video-box" :class="{'fix-video': fixedVideo}" v-if="fixedVideo">
          <ali-player
            ref="aliPlayers"
            v-if="videoCredentials.playAuth"
            :videoCredentials="videoCredentials"
            :fixedVideo="fixedVideo"
            :diffLogic="1"
            :canSign="canSign"
            :visible="visible"
            :jianTime="jianTime"
            :isLianxu="isLianxu"
            :showReplay="showReplay"
            :cpe_integral="cpe_integral"
            :user_id="user_id"
            @ready="ready"
            @ended="ended"
            @signSub="signSub"
            @setLianxuPlay="setLianxuPlay"
            @replayVideo="replayVideo"
            @switchVideo="switchVideo">
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
      </div>
    </div>
  </div>
</template>
<script>
import aliPlayer from '@/components/video/aliPlayer'
import courseList from '@/components/educationVideo/courseList'
import HeadName from '@/components/common/HeadName'
import { videoCredentials, secvCatalog, record, signQuery, sign, eduSocket } from '@/api/education'
import Cookies from 'js-cookie'
import { mapState } from 'vuex'

export default {
  inject: ['reload'],
  data () {
    return {
      screenTimer: null, // 监听浏览器高度
      screenHeight: document.documentElement.clientHeight || document.body.clientHeight,
      vinfoIdex: 0,
      flagCourseSec: true,
      flagJy: false,
      fixedVideo: false,
      flagClosed: false,
      wImportant: 445,
      videoCredentials: {
        VideoId: this.$route.query.VideoId,
        handouts: '', // 讲义
        playAuth: '', // 获取视频凭证
        collect: '', // 收藏
        watch_time: '',
        Title: '', // name
        format: 'mp4'
      },
      playCourseInfo: {
        VideoId: this.$route.query.VideoId,
        video_id: this.$route.query.video_id,
        section_id: this.$route.query.section_id,
        course_id: this.$route.query.course_id,
        package_id: this.$route.query.package_id
      },
      playCourseInfoNextPrev: {},
      // packageList: [],
      courseSections: [],
      openMenu: '1-1', // 默认播放菜单menu-index
      visible: false, // 签到，modal
      canSign: false, // 未签到：视频最后10分钟签到
      timer: null,
      timer2: null,
      jianTime: 30,
      socketTimer: null,
      isPlay: false, // 视频初始化getStatus获取不准确
      isLianxu: 2, // 是否连续播放
      showReplay: false, // 连续播放按钮
      cpe_integral: 0 // 签到积分
    }
  },
  components: {
    aliPlayer,
    courseList,
    HeadName
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
    // this.getCourseCatalog() // 课程大纲（目录）
    if (this.isLoadHttpRequest) {
      this.initSecvCatalog()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.initSecvCatalog()
      })
    }
    this.dragControllerDiv()
    this.$nextTick(() => {
      var _this = this
      document.onkeydown = function (e) {
        e.preventDefault()
        let key = window.event.keyCode
        // alert(key)
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
          if (moveLen > maxT - 445) moveLen = maxT - 445
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
      if (type === 1) {
        this.getVideoPlayback(2)
        return
      }
      if (type === 2) {
        this.canSign = false
        this.showReplay = false
        this.visile = false
        this.getVideoPlayback(2)
      }
      if (type == 3) {
        if (this.flagCourseSec) {
          this.wImportant = 445
        } else {
          this.wImportant = 95
          this.flagClosed = true
        }
        this.computedPrevVid()
      }
      if (type == 4) {
        if (this.flagCourseSec) {
          this.wImportant = 445
        } else {
          this.wImportant = 95
          this.flagClosed = true
        }
        this.computedNextVid()
      }
    },
    ended () {
      this.socketIo() // 视频结束，再调一次socket，因为30秒监听一次，不准确。
      if (this.canSign) {
        this.visible = true
        // this.gxShow = true
      }
      if (!this.canSign) {
        this.showReplay = true
      }
      // this.computedNextVid() // 计算下一个要播放的视频
    },
    // 设置是否连续播放
    setLianxuPlay (val) {
      this.isLianxu = val
      Cookies.set('isLianxu', val)
    },
    // 重新观看
    replayVideo () {
      this.showReplay = false
      this.visible = false
      this.$refs.aliPlayers.replay()
      this.socketIo()
    },
    ready (instance) {
      // 30秒socket
      clearInterval(this.socketTimer)
      this.socketTimer = null
      // 签到 重新观看
      this.canSign = false
      this.visible = false
      this.showReplay = false
      // 倍速设置
      let speednum = Cookies.get('speednum') || 1
      instance.setSpeed(speednum)
      // 音量设置
      let voicenum = Cookies.get('voicenum') || 100
      instance.setVolume(voicenum / 100)
      // 跳转到上次播放时间
      // instance.seek(this.videoCredentials.watch_time)
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
      // 入库观看视频
      if (this.user_id != '' && this.playCourseInfo.package_id != '' && this.playCourseInfo.course_id != '' && this.playCourseInfo.section_id != '' && this.playCourseInfo.video_id != '') {
        this.subrecord() // 观看记录入库
        this.isSignQuery() // 查询当前是否签到
      }
      // 30秒监听一次socket
      this.socketTimer = setInterval(() => {
        // 已购买并且视频播放时间大于0 socket
        if (instance.getStatus() == 'playing' && this.user_id != '' && this.playCourseInfo.package_id != '' && this.playCourseInfo.course_id != '' && this.playCourseInfo.section_id != '' && this.playCourseInfo.video_id != '') {
          this.socketIo()
        }
      }, 30000)
    },
    // 入库观看视频
    subrecord () {
      record({
        user_id: this.user_id,
        package_id: this.$route.query.package_id,
        course_id: this.playCourseInfo.course_id,
        section_id: this.playCourseInfo.section_id,
        video_id: this.playCourseInfo.video_id
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
        watch_time: this.videoCredentials.watch_time
      }
      eduSocket(message).then(data => {
      })
    },
    // 下一个视频
    computedNextVid () {
      this.playCourseInfoNextPrev = Object.assign({}, this.playCourseInfo)
      var profiles = this.courseSections
      var currentProfile = {
        section_id: this.playCourseInfo.section_id,
        course_id: this.playCourseInfo.course_id
      }
      var currentProfileIndex = (profiles || []).findIndex((profile) => profile.section_id == currentProfile.section_id)
      var profiles2 = this.courseSections[currentProfileIndex].video
      var currentProfile2 = {
        video_id: this.playCourseInfo.video_id
      }
      var currentProfileIndex2 = (profiles2 || []).findIndex((profile2) => profile2.video_id == currentProfile2.video_id)
      if (currentProfileIndex == profiles.length - 1) {
        if (currentProfileIndex2 == profiles2.length - 1) {
          this.$Message.error('已经是最后一节')
          return
        } else {
          ++currentProfileIndex2
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].video[currentProfileIndex2].video_id
        }
      } else {
        if (currentProfileIndex2 == profiles2.length - 1) {
          ++currentProfileIndex
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].video[0].video_id
        } else {
          ++currentProfileIndex2
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].video[currentProfileIndex2].video_id
        }
      }
      this.$router.replace({
        path: '/education-video',
        query: {
          ...this.$route.query,
          section_id: this.playCourseInfoNextPrev.section_id,
          video_id: this.playCourseInfoNextPrev.video_id,
          VideoId: this.playCourseInfoNextPrev.VideoId
        }
      })
      this.getVideoPlayback(2)
    },
    // 上一个视频
    computedPrevVid () {
      this.playCourseInfoNextPrev = Object.assign({}, this.playCourseInfo)
      var profiles = this.courseSections
      var currentProfile = {
        section_id: this.playCourseInfo.section_id,
        course_id: this.playCourseInfo.course_id
      }
      var currentProfileIndex = (profiles || []).findIndex((profile) => profile.section_id == currentProfile.section_id)
      var profiles2 = this.courseSections[currentProfileIndex].video
      var currentProfile2 = {
        video_id: this.playCourseInfo.video_id,
        VideoId: this.playCourseInfo.VideoId
      }
      var currentProfileIndex2 = (profiles2 || []).findIndex((profile2) => profile2.video_id == currentProfile2.video_id)
      if (currentProfileIndex == 0) {
        if (currentProfileIndex2 == 0) {
          this.$Message.error('已经是第一节')
          return
        } else {
          --currentProfileIndex2
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].video[currentProfileIndex2].video_id
        }
      } else {
        if (currentProfileIndex2 == 0) {
          --currentProfileIndex
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].video[this.courseSections[currentProfileIndex].video.length - 1].video_id
        } else {
          --currentProfileIndex2
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].video[currentProfileIndex2].video_id
        }
      }
      this.$router.replace({ path: '/education-video',
        query: {
          ...this.$route.query,
          section_id: this.playCourseInfoNextPrev.section_id,
          video_id: this.playCourseInfoNextPrev.video_id,
          VideoId: this.playCourseInfoNextPrev.VideoId
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
    showModel (val, index) {
      this.vinfoIdex = index
      if (val === '章节') {
        this.flagCourseSec = !this.flagCourseSec
        this.flagAnswer = false
        this.flagJy = false
        this.wImportant = 445
        this.flagClosed = !this.flagClosed
        if (!this.flagCourseSec) {
          this.wImportant = 95
          this.flagClosed = true
        }
        if (this.fixedVideo) {
          this.fixedVideo = !this.fixedVideo
          this.flagCourseSec = true
          this.flagClosed = false
          this.wImportant = 445
        }
      }
      if (val === '讲义') {
        this.flagJy = !this.flagJy
        this.wImportant = 445
        this.flagAnswer = false
        this.flagClosed = false
        if (!this.flagJy) {
          if (this.flagCourseSec) {
            this.wImportant = 445
          } else {
            this.wImportant = 95
            this.flagClosed = true
          }
        }
        if (this.fixedVideo) {
          this.fixedVideo = !this.fixedVideo
          this.flagJy = true
          this.wImportant = 445
          this.flagClosed = true
        }
      }
      if (val === 'closed') {
        this.flagCourseSec = true
        this.flagClosed = false
        this.wImportant = 445
      }
    },
    closeModel (msg) {
      if (msg === 'sec') {
        this.flagCourseSec = false
        this.flagClosed = true
        this.wImportant = 95
        return
      }
      if (msg === 'jy') {
        this.flagJy = false
        if (this.flagCourseSec) {
          this.wImportant = 445
          this.flagClosed = false
        } else {
          this.wImportant = 95
          this.flagClosed = true
        }
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
        this.wImportant = 445
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
    //       this.initSecvCatalog(this.playCourseInfo.course_id)
    //     } else {
    //       this.$Message.error(res.msg)
    //     }
    //   })
    // },
    // 课程大纲(章节 video)
    // getSecvCatalog (item, idx) {
    //   this.$router.replace({ path: 'education-video',
    //     query: {
    //       type_id: this.$route.query.type_id,
    //       package_id: this.$route.query.package_id,
    //       course_id: item.course_id
    //     }
    //   })
    //   this.reload()
    // },
    // 初始化展示章节
    initSecvCatalog () {
      this.showLoading(true)
      secvCatalog({
        course_id: this.playCourseInfo.course_id,
        user_id: this.user_id
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
      this.playCourseInfo.section_id = this.$route.query.section_id || this.courseSections[0].section_id
      this.playCourseInfo.video_id = this.$route.query.video_id || this.courseSections[0].video[0].video_id
      // 计算当前视频被选中，添加active
      this.courseSections.forEach((v, key) => {
        let sectionId = this.playCourseInfo.section_id
        let vidId = this.playCourseInfo.video_id
        v.video.forEach((val, index) => {
          if (sectionId == v.section_id && vidId == val.video_id) {
            let openMenu = (key + 1) + '-' + (index + 1)
            this.openMenu = openMenu
            this.playCourseInfo.VideoId = val.VideoId
          }
        })
      })
      // 获取视频凭证
      videoCredentials({
        VideoId: this.playCourseInfo.VideoId,
        user_id: this.user_id,
        package_id: this.playCourseInfo.package_id,
        course_id: this.playCourseInfo.course_id,
        section_id: this.playCourseInfo.section_id,
        video_id: this.playCourseInfo.video_id
      }).then(data => {
        let res = data.data
        let { Title, collect, handouts, playAuth, watch_time, status } = res.data
        if (status === 1) {
          this.videoCredentials.format = 'm3u8'
        } else {
          this.videoCredentials.format = 'mp4'
        }
        this.videoCredentials.VideoId = this.playCourseInfo.VideoId
        this.videoCredentials.Title = Title
        this.videoCredentials.collect = collect
        this.videoCredentials.handouts = handouts
        this.videoCredentials.playAuth = playAuth
        this.videoCredentials.watch_time = watch_time
      }).then(() => {
        if (type == 2) {
          this.$refs.aliPlayers.ended(this.playCourseInfo.VideoId, this.videoCredentials.playAuth)
        }
      })
    },
    // 上线可以删除，控制台提示时间
    formatSeconds (value) {
      let result = parseInt(value)
      let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
      let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
      result = `${h}:${m}:${s}`
      return result
    },
    downTime () {
      // 总时长的70% 80% 90% 弹窗3次
      clearInterval(this.timer)
      let durationTime, endTime1, endTime2, endTime3
      durationTime = parseInt(this.$refs.aliPlayers.getDuration())
      endTime1 = parseInt(durationTime * 0.7) + Math.round(Math.random() * 10)
      endTime2 = parseInt(durationTime * 0.8) + Math.round(Math.random() * 10)
      endTime3 = parseInt(durationTime * 0.9) + Math.round(Math.random() * 10)
      // console.log(durationTime + '/60' + '总时长' + this.formatSeconds(durationTime))
      // console.log(endTime1 + '/60' + '第一次弹:' + this.formatSeconds(endTime1))
      // console.log(endTime2 + '/60' + '第二次弹:' + this.formatSeconds(endTime2))
      // console.log(endTime3 + '/60' + '第三次弹:' + this.formatSeconds(endTime3))
      this.timer = setInterval(() => {
        let curVideoTime = parseInt(this.$refs.aliPlayers.getCurrentTime())
        if (curVideoTime === durationTime) {
          clearInterval(this.timer)
          return
        }
        if (curVideoTime === endTime1) {
          this.downTime2()
        }
        if (curVideoTime === endTime2) {
          this.downTime2()
        }
        if (curVideoTime === endTime3) {
          this.downTime2()
        }
      }, 1000)
    },
    downTime2 () {
      this.canSign = true
      this.visible = true
      this.showReplay = true
      this.jianTime = 30
      this.timer2 = setInterval(() => {
        this.jianTime--
        if (this.jianTime < 1) {
          clearInterval(this.timer2)
          this.canSign = false
          this.visible = false
        }
      }, 1000)
    },
    // 签到查询
    isSignQuery () {
      signQuery({
        user_id: this.user_id,
        course_id: this.playCourseInfo.course_id,
        video_id: this.playCourseInfo.video_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          if (res.data.status === 1) { // 已签到
            this.visible = false
            this.canSign = false
          }
          if (res.data.status === 2) { // 未签到
            this.canSign = true // 因为没有三次签到，倒计时功能了，所以不用downTime（），直接true
            // this.downTime()
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 签到
    signSub () {
      // this.showReplay = true
      // this.canSign = false
      sign({
        user_id: this.user_id,
        course_id: this.playCourseInfo.course_id,
        video_id: this.playCourseInfo.video_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.cpe_integral = res.data.cpe_integral
          if (res.data.status === 1) {
            this.$Message.success('签到成功～')
            this.initSecvCatalog()
            // clearInterval(this.timer)
            // clearInterval(this.timer2)
            this.canSign = false // 签到弹窗
            // this.visible = true // 签到弹窗 为true控制恭喜
            this.showReplay = true // 视频播放结束签到成功，重新观看显示
          }
          if (res.data.status === 2) {
            this.$Message.error('已签到～')
            this.canSign = false // 签到弹窗
            this.visible = false // 签到弹窗
            this.showReplay = true // 视频播放结束签到成功，重新观看显示
          }
        } else if (res.code === 402) {
          this.$Message.error('已签到～')
          this.initSecvCatalog()
          // clearInterval(this.timer)
          // clearInterval(this.timer2)
          this.canSign = false // 签到弹窗
          this.visible = false // 签到弹窗
          this.showReplay = true // 视频播放结束签到成功，重新观看显示
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  },
  beforeDestroy () {
    // clearInterval(this.timer)
    // clearInterval(this.timer2)
    clearInterval(this.socketTimer)
    // this.timer = null
    // this.timer2 = null
    this.socketTimer = null
    if (this.$refs.aliPlayers) {
      this.$refs.aliPlayers.dispose()
    }
  },
  beforeRouteLeave (to, from, next) {
    document.onkeydown = undefined
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
