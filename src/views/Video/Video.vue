<template>
  <div class="video-wrap">
    <div class="video-header">
      <div>
        <router-link :to="{ path: '/personal', query: { type: 'course'}}">
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
          <!-- 正课且购买 -->
          <li class="vinfo-item" :class="{'curren': vinfoIdex == 1}" v-if="playCourseInfo.is_zk == 1 && playCourseInfo.userstatus == 1" @click="showModel('答疑', 1)">
            <i class="vio-icon vio-icon-02"></i>
            <p class="txt">答疑</p>
          </li>
          <li class="vinfo-item" :class="{'curren': vinfoIdex == 2}" @click="showModel('讲义', 2)">
            <i class="vio-icon vio-icon-03"></i>
            <p class="txt">讲义</p>
          </li>
        </ul>
      </div>
      <div class="video-info-c" id="left" :class="{'fix-video': fixedVideo}" :style="{ height: screenHeight - 137 + 'px' }">
        <div class="course-video-box">
          <ali-player
            ref="aliPlayers"
            v-if="videoCredentials.playAuth"
            :videoCredentials="videoCredentials"
            :fixedVideo="fixedVideo"
            :isLianxu="isLianxu"
            :showReplay="showReplay"
            :activityVisible="activityVisible"
            :activityTimerNum="activityTimerNum"
            :problemVisible="problemVisible"
            :tryWatchFlag="tryWatchFlag"
            :user_id="user_id"
            @ready="ready"
            @ended="ended"
            @switchVideo="switchVideo"
            @setLianxuPlay="setLianxuPlay"
            @replayVideo="replayVideo"
            @computedNextVid="computedNextVid"
            @courseCollection="courseCollection">
          </ali-player>
        </div>
      </div>
      <!-- <div class="video-info-c" id="left">
        <ali-player ref="aliPlayers" @ready="ready" v-if="videoCredentials.playAuth" :vid="VideoId" :playauth="videoCredentials.playAuth"></ali-player>
        <div class="try-watch-dialog" v-if="tryWatchFlag">
          <div @click="goBuy">试看结束去购买</div>
          <div @click="replay">重新开始</div>
        </div>
        <div class="star-collection" @click="courseCollection(videoCredentials.collect)">
          <Icon type="md-star-outline" style="color: #ffffff;" v-if="videoCredentials.collect == 2"/>
          <Icon type="md-star" style="color: #F99111;" v-if="videoCredentials.collect == 1"/>
        </div>
      </div> -->
      <div class="video-info-c" id="left" :style="{ height: screenHeight - 137 + 'px' }" v-if="fixedVideo">
        <div class="pdf-iframe" style="height: 100%;overflow-y: auto;">
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
            :is_zk="playCourseInfo.is_zk"
            @switchVideo="switchVideo">
          </course-list>
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
            <button class="btn-com" @click="switchScreen('video')">视频全屏</button>
          </div>
          <iframe id="main-frame" :src="videoCredentials.handouts" width="100%" height="100%" ></iframe>
        </div>
        <div class="answer-box" v-if="flagAnswer">
          <div class="vc-title">
            <p>提问题</p>
            <Icon type="md-close" style="color:#999999;font-size: 22px;" @click="closeModel('answer')"/>
          </div>
          <answer :playCourseInfo="playCourseInfo" :videoCredentials="videoCredentials" :answerTime="answerTime" :user_id="user_id" :screenHeight="screenHeight" @stopVideo="stopVideo" @addKeydown="addKeydown" @updataAnswerall="updataAnswerall"></answer>
        </div>
      </div>
    </div>
    <div class="answer-jy-wrap">
      <ul class="tab-list-all-jx">
        <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': chooseIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
      </ul>
      <div class="aj-list-info-flex">
        <div class="aj-list-info-l">
          <div class="aj-main">
            <ask-course v-if="chooseIdx == 0 && videoCredentials.playAuth" ref="updateAnswerRef" :user_id="user_id" :playCourseInfo="playCourseInfo" :videoCredentials="videoCredentials"></ask-course>
            <ul class="jy-ul" v-if="chooseIdx == 1">
              <li class="jy-item" v-for="(val, index) in courseSections" :key="index">
                <p>{{val.section_name}}</p>
                <span @click="jiangyiDown(val.handouts)"><i></i>下载</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="aj-else-info-r">
          <!-- 猜你喜欢 -->
          <like-list></like-list>
        </div>
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
      vinfoIdex: 0,
      txtArr: ['答疑', '讲义下载'],
      flagAnswer: false,
      flagCourseSec: true,
      flagJy: false,
      fixedVideo: false,
      flagClosed: false,
      wImportant: 445,
      videoCredentials: {
        VideoId: '', // 视频VideoId
        handouts: '', // 讲义
        playAuth: '', // 获取视频凭证
        collect: '', // 收藏
        watch_time: 0, // 观看时间,视频上次播放时间
        Title: '', // name
        format: 'mp4'
      },
      playCourseInfo: {
        video_id: this.$route.query.video_id,
        section_id: this.$route.query.section_id,
        course_id: this.$route.query.course_id,
        package_id: this.$route.query.package_id,
        is_zk: this.$route.query.is_zk || 2,
        userstatus: window.sessionStorage.getItem('userstatus') || 2 // 1购买2未购买
      },
      playCourseInfoNextPrev: {},
      // packageList: [],
      courseSections: [],
      openMenu: '1-1', // 默认播放菜单menu-index
      socketTimer: null,
      tryWatchTimer: null,
      tryWatchFlag: false,
      tryQatchNum: 180, // 试看3分钟
      isPlay: false, // 视频初始化getStatus获取不准确
      answerTime: 0, // 答疑提问时间
      isLianxu: parseInt(Cookies.get('isLianxu')) || 1, // 是否连续播放
      showReplay: false, // 连续播放按钮
      activityTimer: null, // 连续播放:10秒后播放下一个
      activityTimerNum: 5,
      activityVisible: false,
      problemVisible: false // 跨章节，提示弹窗，取消广告倒计时，傻逼操作
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
        let totalPlaynum = player.getDuration()
        playnum = parseInt(playnum + 5)
        if (playnum > 15) {
          if (playnum > totalPlaynum) {
            player.seek(totalPlaynum)
            return
          }
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
        // this.getVideoPlayback(2)
        this.reload()
        return
      }
      clearInterval(this.socketTimer)
      clearInterval(this.activityTimer)
      this.socketTimer = null
      this.activityTimer = null
      this.chooseIdx = 0
      if (type === 2) {
        this.reload()
        // this.getVideoPlayback(2)
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
        this.computedNextVid(1)
      }
    },
    ended () {
      this.socketIo() // 视频结束，再调一次socket，因为30秒监听一次，不准确。
      this.isLianxu = parseInt(Cookies.get('isLianxu')) || 1 // 1连续2重播
      this.showReplay = true
      if (this.isLianxu == 2) {
        return
      }
      // this.activityVisible = true
      this.computedNextVid(2) // 计算下一个要播放的视频
      // this.activityDown() // 10秒后进入下一个视频
      // this.videoCredentials.watch_time = parseInt(this.$refs.aliPlayers.getCurrentTime())
    },
    // 设置是否连续播放
    setLianxuPlay (val) {
      this.isLianxu = val
      Cookies.set('isLianxu', val)
    },
    // 重新观看
    replayVideo () {
      this.showReplay = false
      this.activityVisible = false
      this.problemVisible = false
      this.tryWatchFlag = false
      clearInterval(this.activityTimer)
      // clearInterval(this.tryWatchTimer)
      // this.$refs.aliPlayers.replay()
      this.$refs.aliPlayers.seek(0)
      this.$refs.aliPlayers.play()
      this.socketIo()
    },
    // 播放器
    ready (instance) {
      // 30秒socket
      clearInterval(this.socketTimer)
      clearInterval(this.activityTimer)
      this.socketTimer = null
      this.activityTimer = null
      // 重新播放 广告
      this.showReplay = false
      this.activityVisible = false
      // 倍速设置
      let speednum = Cookies.get('speednum') || 1
      instance.setSpeed(speednum)
      // 音量设置
      let voicenum = Cookies.get('voicenum') || 100
      instance.setVolume(parseInt(voicenum / 100))
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
      // 未购买试看3分钟 没有试看需求了
      if (this.playCourseInfo.userstatus == 2) {
        this.tryWatchTimer = setInterval(() => {
          let playtime = parseInt(instance.getCurrentTime())
          if (playtime >= this.tryQatchNum) {
            this.tryWatchFlag = true
            instance.pause()
            instance.seek(this.tryQatchNum)
          } else {
            this.videoCredentials.watch_time = playtime
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
        watch_time: this.videoCredentials.watch_time,
        video_type: 1, // 视频类型 1视频2直播
        status: 1 // 播放类型 1课程视频播放2学习计划
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
    activityDown () {
      // 视频id获取
      this.$router.replace({ path: '/course-video',
        query: {
          ...this.$route.query,
          section_id: this.playCourseInfoNextPrev.section_id,
          video_id: this.playCourseInfoNextPrev.video_id
        }
      })
      // 倒计时逻辑
      this.activityVisible = true
      clearInterval(this.activityTimer)
      this.activityTimer = null
      this.activityTimerNum = 5
      this.activityTimer = setInterval(() => {
        let a = parseInt(this.$refs.aliPlayers.getDuration())
        let b = parseInt(this.$refs.aliPlayers.getCurrentTime())
        this.activityTimerNum--
        if (b < a) {
          clearInterval(this.activityTimer)
          this.activityTimer = null
          this.showReplay = false
          this.activityVisible = false
          this.$refs.aliPlayers.play()
          return
        }
        if (this.activityTimerNum < 1) {
          clearInterval(this.activityTimer)
          this.activityTimer = null
          this.showReplay = false
          this.activityVisible = false
          // 刷新，因为有视频重叠声音
          this.reload()
          // this.computedNextVid() // 计算下一个要播放的视频
        }
      }, 1000)
    },
    // 下一个视频
    computedNextVid (type) {
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
        } else {
          ++currentProfileIndex2
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].videos[currentProfileIndex2].video_id
          if (type === 2) { // 连续播放结束,计算
            // this.activityVisible = true
            console.log('没夸张1')
            this.activityDown()
          }
        }
      } else {
        if (currentProfileIndex2 == profiles2.length - 1) {
          ++currentProfileIndex
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].videos[0].video_id
          if (type === 2) { // 连续播放结束,计算
            this.problemVisible = true
            console.log('夸张1')
            // this.activityDown()
          }
        } else {
          ++currentProfileIndex2
          this.playCourseInfoNextPrev.section_id = this.courseSections[currentProfileIndex].section_id
          this.playCourseInfoNextPrev.video_id = this.courseSections[currentProfileIndex].videos[currentProfileIndex2].video_id
          if (type === 2) { // 连续播放结束,计算
            // this.activityVisible = true
            console.log('没夸张2')
            this.activityDown()
          }
        }
      }
      if (type === 1) {
        this.$router.replace({ path: '/course-video',
        query: {
            ...this.$route.query,
            section_id: this.playCourseInfoNextPrev.section_id,
            video_id: this.playCourseInfoNextPrev.video_id
          }
        })
        this.reload()
      }
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
      this.reload()
      // this.getVideoPlayback(2)
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
    // // 去购买
    // goBuy () {
    //   this.$router.push({ path: '/course-detail',
    //     query: {
    //       package_id: this.playCourseInfo.package_id
    //     }
    //   })
    // },
    // // 重新试听
    // replay () {
    //   this.tryWatchFlag = false
    //   this.$refs.aliPlayers.replay()
    // },
    // tab 显示关闭课程，答疑，讲义
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
      if (val === '答疑') {
        this.answerTime = parseInt(this.$refs.aliPlayers.getCurrentTime())
        this.flagAnswer = !this.flagAnswer
        this.wImportant = 445
        this.flagJy = false
        this.flagClosed = false
        if (!this.flagAnswer) {
          if (this.flagCourseSec) {
            this.wImportant = 445
          } else {
            this.wImportant = 95
            this.flagClosed = true
          }
        }
        if (this.fixedVideo) {
          this.fixedVideo = !this.fixedVideo
          if (this.flagCourseSec) {
            this.wImportant = 445
          } else {
            this.wImportant = 95
            this.flagClosed = true
          }
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
      if (msg === 'answer') {
        this.flagAnswer = false
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
        this.wImportant = 326
        this.flagClosed = true
      }
      if (type === 'video') {
        this.fixedVideo = false
        this.flagJy = true
        this.wImportant = 445
        this.flagClosed = false
      }
      // if (type === 'video') {
      //   this.fixedVideo = false
      //   this.flagJy = false
      //   this.flagClosed = false
      //   if (this.flagCourseSec) {
      //     this.wImportant = 445
      //   } else {
      //     this.wImportant = 95
      //     this.flagClosed = true
      //   }
      // }
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
    // 初始化展示章节
    initSecvCatalog () {
      this.showLoading(true)
      secvCatalog({
        user_id: this.user_id,
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
        let { Title, collect, handouts, playAuth, watch_time, status } = res.data
        if(status === 1){
          this.videoCredentials.format = 'm3u8'
        } else {
          this.videoCredentials.format = 'mp4'
        }
        this.videoCredentials.VideoId = VideoId
        this.videoCredentials.Title = Title
        this.videoCredentials.collect = collect
        this.videoCredentials.handouts = handouts
        this.videoCredentials.playAuth = playAuth
        this.videoCredentials.watch_time = watch_time
      }).then(() => {
        // if (type == 2) {
        //   this.$refs.aliPlayers.ended(this.videoCredentials.VideoId, this.videoCredentials.playAuth)
        //   this.$refs.updateAnswerRef.initRes()
        // }
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
    clearInterval(this.tryWatchTimer)
    this.socketTimer = null
    this.tryWatchTimer = null
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
