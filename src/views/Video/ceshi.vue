<template>
  <div class="video-wrap">
    <div class="video-main" id="box">
      <div class="video-info-c" id="left">
        <ali-player
          ref="aliPlayers"
          v-if="videoCredentials.playAuth"
          :vid="VideoId"
          :playauth="videoCredentials.playAuth"
          :user_id="user_id"
        >
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
      <div class="video-info-r" id="right">
        <!-- <course-list
          v-if="flagKc"
          :courseSections="courseSections"
          :openMenu="openMenu"
          :is_zhengke="playCourseInfo.is_zhengke"
          @closeModel="closeModel">
        </course-list> -->
        <!-- <answer v-if="flagAnswer" :playCourseInfo="playCourseInfo" :user_id="user_id" @closeModel="closeModel" @stopVideo="stopVideo"></answer> -->
        <!-- <div class="jiangyi" v-if="flagJy">
          <div class="close-box" @click="closeModel">
            <i class="close-icon"></i>
          </div>
          <h1 class="vc-title">讲义</h1>
          <iframe id="main-frame" :src="videoCredentials.handouts" width="100%" height="88%" style="position:absolute;top: 90px;bottom:0;width:100%;height: 88%;"></iframe>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import aliPlayer from '@/components/video/aliPlayer'
// import courseList from '@/components/video/courseList'
// import answer from '@/components/video/answer'
// import HeadName from '@/components/common/HeadName'
import { videoPlayback, videoCredentials, courseCatalog, secvCatalog, collection, firstSocket } from '@/api/class'
// import config from '@/config'
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
    aliPlayer
    // courseList,
    // answer,
    // HeadName
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    window.sessionStorage.setItem('userstatus', 1)
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
