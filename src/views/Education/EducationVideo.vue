<template>
  <div class="video-wrap">
    <div class="video-header">
      <div>
        <router-link :to="{ path: '/education-course-detail', query: { package_id: this.$route.query.package_id, type_id: this.$route.query.type_id }}">></router-link>
        <span>{{videoCredentials.Title}}</span>
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
            <p>讲师: {{item.teacher_name}}<span>CPE积分: {{item.cpe_integral}}分</span></p>
          </div>
        </div>
      </div>
      <div class="video-info-l">
        <ul class="vinfo-ul">
          <li class="vinfo-item" @click="showModel('课程<br />切换')">
            <i class="vio-icon vio-icon-01"></i>
            <p class="txt">课程<br />切换</p>
          </li>
          <li class="vinfo-item" @click="showModel('讲义')">
            <i class="vio-icon vio-icon-03"></i>
            <p class="txt">讲义</p>
          </li>
        </ul>
      </div>
      <p style="position:absolute;top:0;color: #F99111; padding-left: 60px;height: 34px;line-height: 34px;">如何获得本课程学分：每个视频学习过程中均会随机弹出签到提示，全部视频都成功签到后才能获得本课程CPE积分。</p>
      <div class="video-info-c" id="left">
        <ali-player
          ref="aliPlayers"
          @ready="ready"
          v-if="videoCredentials.playAuth"
          :vid="playCourseInfo.VideoId"
          :playauth="videoCredentials.playAuth"
          :user_id="user_id"
          :canSign="canSign"
          :visible="visible"
          :jianTime="jianTime"
          @signSub="signSub"
        >
          <!-- @startSeek="startSeek"
          @completeSeek="completeSeek" -->
        </ali-player>
      </div>
      <div id="resize" class="course-drag" :class="{'course-drag-hide': !this.flagKc && !this.flagJy}">
        <div class="drag"></div>
      </div>
      <div class="video-info-r" :style="{ width: wImportant + 'px' }" id="right">
        <course-list v-if="flagKc" :courseSections="courseSections" :openMenu="openMenu" @closeModel="closeModel" @getVideoPlayback="getVideoPlayback"></course-list>
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
import aliPlayer from '@/components/educationVideo/aliPlayer'
import courseList from '@/components/educationVideo/courseList'
import HeadName from '@/components/common/HeadName'
import { videoCredentials, courseCatalog, secvCatalog, record, signQuery, sign } from '@/api/education'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      selMenu: 3,
      vinfo: ['课程<br />切换', '讲义'],
      flagKc: true,
      flagCourse: false,
      flagJy: false,
      wImportant: 382,
      videoCredentials: {
        handouts: '', // 讲义
        playAuth: '', // 获取视频凭证
        collect: '', // 收藏
        Title: '' // name
      },
      playCourseInfo: {
        video_id: this.$route.query.video_id,
        VideoId: this.$route.query.VideoId,
        section_id: this.$route.query.section_id,
        course_id: this.$route.query.course_id,
        package_id: this.$route.query.package_id,
        userstatus: parseInt(window.sessionStorage.getItem('userstatus')) || 2 // 1购买2未购买
      },
      packageList: [],
      courseSections: [],
      openMenu: '1-1', // 默认播放菜单menu-index
      visible: false, // 签到，modal
      canSign: false, // 视频最后10分钟签到
      timer: null,
      timer2: null,
      jianTime: 30,
      player: {}
    }
  },
  components: {
    aliPlayer,
    courseList,
    HeadName
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  updated () {
    this.player = this.$refs.aliPlayers
  },
  mounted () {
    this.getCourseCatalog() // 课程大纲（目录）
    this.dragControllerDiv()
    var _this = this
    document.onkeydown = function (e) {
      let key = window.event.keyCode
      // alert(key)
      _this.watchKeydοwn(key)
    }
  },
  methods: {
    watchKeydοwn (keyNum) {
      let player = this.player
      let playStatus = player.getStatus()
      console.log(keyNum + playStatus)
      if (keyNum === 32) { // 空格暂停播放
        if (playStatus === 'ready') {
          player.play()
        }
        if (playStatus === 'playing') {
          player.pause()
        }
        if (playStatus === 'pause') {
          player.play()
        }
      }
      if (keyNum === 37) { // 快退
        let videotimes = player.getDuration()
        let playnum = player.getCurrentTime()
        playnum = parseInt(playnum - 10)
        if (playnum <= (videotimes - 30)) {
          player.seek(playnum)
        }
      }
      if (keyNum === 39) { // 快进
        let playnum = player.getCurrentTime()
        playnum = parseInt(playnum + 10)
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
    // 播放器
    ready (instance) {
      // instance.play()
      let ofH = window.sessionStorage.getItem('ofH')
      document.getElementById('rightCourseList').scrollTop = ofH
      // 入库观看视频
      if (this.user_id !== '' && this.playCourseInfo.package_id !== '' && this.playCourseInfo.course_id !== '' && this.playCourseInfo.section_id !== '' && this.playCourseInfo.video_id !== '') {
        this.subrecord() // 观看记录入库
        this.isSignQuery() // 查询当前是否签到
        this.computedCur() // 计算下一个播放视频
      }
    },
    startSeek () {
      this.$refs.aliPlayers.startSeek()
    },
    completeSeek () {
      this.$refs.aliPlayers.completeSeek()
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
    // tab 显示关闭课程，答疑，讲义
    showModel (val, index) {
      if (val === '课程<br />切换') {
        this.flagCourse = !this.flagCourse
        this.flagJy = false
        this.wImportant = 0
        if (this.flagKc) {
          this.wImportant = 382
        }
      }
      if (val === '讲义') {
        this.flagJy = !this.flagJy
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
          this.playCourseInfo.course_id = this.$route.query.course_id || this.packageList[0].course_id
          this.initSecvCatalog(this.playCourseInfo.course_id)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 课程大纲(章节 video)
    getSecvCatalog (item, idx) {
      this.$router.replace({ path: 'education-video',
        query: {
          type_id: this.$route.query.type_id,
          package_id: this.$route.query.package_id,
          course_id: item.course_id
        }
      })
      window.sessionStorage.removeItem('ofH')
      window.location.reload()
    },
    // 初始化展示章节
    initSecvCatalog (id) {
      secvCatalog({
        course_id: id,
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.courseSections = res.data
          this.courseSections.forEach((v, key) => {
            let sectionId = parseInt(this.$route.query.section_id)
            let vidId = parseInt(this.$route.query.video_id)
            v.video.forEach((val, index) => {
              if (sectionId === v.section_id && vidId === val.video_id) {
                let openMenu = (key + 1) + '-' + (index + 1)
                this.openMenu = openMenu
              }
            })
          })
          this.playCourseInfo.course_id = this.$route.query.course_id || this.courseSections[0].course_id
          this.playCourseInfo.section_id = this.$route.query.section_id || this.courseSections[0].section_id
          this.playCourseInfo.video_id = this.$route.query.video_id || this.courseSections[0].video[0].video_id
          this.playCourseInfo.VideoId = this.$route.query.VideoId || this.courseSections[0].video[0].VideoId
          this.getVideoPlayback()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 获取视频凭证
    getVideoPlayback () {
      // 获取视频凭证
      videoCredentials({
        VideoId: this.playCourseInfo.VideoId,
        video_id: this.playCourseInfo.video_id
      }).then(data => {
        let res = data.data
        this.videoCredentials = res.data
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
      console.log(durationTime + '/60' + '总时长' + this.formatSeconds(durationTime))
      console.log(endTime1 + '/60' + '第一次弹:' + this.formatSeconds(endTime1))
      console.log(endTime2 + '/60' + '第二次弹:' + this.formatSeconds(endTime2))
      console.log(endTime3 + '/60' + '第三次弹:' + this.formatSeconds(endTime3))
      this.timer = setInterval(() => {
        let curVideoTime = parseInt(this.$refs.aliPlayers.getCurrentTime())
        if (curVideoTime === durationTime) {
          // this.$refs.aliPlayers.ended()
          // this.isSignQuery()
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
          if (res.data.status === 1) {
            this.visible = false
            this.canSign = false
          }
          if (res.data.status === 2) {
            this.downTime()
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    computedCur () {
      var profiles = this.courseSections
      var currentProfile = {
        section_id: this.playCourseInfo.section_id,
        course_id: this.playCourseInfo.course_id
      }
      var currentProfileIndex = (profiles || []).findIndex((profile) => profile.section_id + '' === currentProfile.section_id + '')
      console.log(currentProfileIndex)
      let secArray = this.courseSections
      for (let i = 0; i < secArray.length; i++) {
        if (currentProfileIndex < secArray.length) {
          ++currentProfileIndex
        }
        // const secId = secArray[i].section_id
        // const couId = secArray[i].course_id
        const videosArr = secArray[i].video
        for (let j = 0; j < videosArr.length; j++) {
          // const vidId = videosArr[j].video_id
          // console.log(vidId)
        }
        // console.log(secId)
        // console.log(couId)
        // console.log(array.length)
        // console.log(elementVid.length)
      }
      console.log(currentProfileIndex)
      // this.courseSections.forEach((v, index) => {
      //   let secLen = this.courseSections.length
      //   let vidLen = v.video.length
      //   console.log(secLen)
      //   console.log(vidLen)
      //   console.log(v)
      // })
    },
    // 签到
    signSub () {
      // clearInterval(this.timer)
      // clearInterval(this.timer2)
      // this.canSign = false
      // this.visible = false
      sign({
        user_id: this.user_id,
        course_id: this.playCourseInfo.course_id,
        video_id: this.playCourseInfo.video_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          if (res.data.status === 1) {
            this.$Message.success('签到成功～')
            this.getCourseCatalog()
            clearInterval(this.timer)
            clearInterval(this.timer2)
            this.canSign = false
            this.visible = false
          }
          if (res.data.status === 2) {
            this.$Message.error('已签到～')
          }
        } else if (res.code === 402) {
          this.$Message.error('已签到～')
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.timer2)
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
    z-index: 10000;
  }
  .video-info-c{
    position: relative;
    flex: 1;
    background: #000000;
    border-radius: 10px;
    margin: 34px 0 20px;
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
        span{
          font-size: 12px;
          color: #368DE7;
          margin-left: 15px;
        }
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
