<template>
  <div class="video-wrap">
    <div class="video-header">
      <div>
        <router-link :to="{ path: '/course-detail', query: { package_id: this.$route.query.package_id }}">></router-link>
        <span>{{videoCredentials.Title}}</span>
      </div>
      <HeadName :showName="false"></HeadName>
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
      <div class="video-info-c" id="left">
        <ali-player ref="aliPlayers" @ready="ready" v-if="videoCredentials.playAuth" :vid="playCourseInfo.VideoId" :playauth="videoCredentials.playAuth" :user_id="user_id"></ali-player>
      </div>
      <div id="resize" class="course-drag" :class="{'course-drag-hide': !this.flagKc && !this.flagAnswer && !this.flagJy}">
        <div class="drag"></div>
      </div>
      <div class="video-info-r" :style="{ width: wImportant + 'px' }" id="right">
        <course-list v-if="flagKc" :courseSections="courseSections" :openMenu="openMenu" :is_zhengke="playCourseInfo.is_zhengke" @closeModel="closeModel" @getVideoPlayback="getVideoPlayback"></course-list>
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
import aliPlayer from '@/components/educationVideo/aliPlayer'
import courseList from '@/components/educationVideo/courseList'
import HeadName from '@/components/common/HeadName'
import { videoCredentials, courseCatalog, secvCatalog, record } from '@/api/education'
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      selMenu: 3,
      showBox: '课程<br />切换',
      vinfo: ['课程<br />切换', '讲义'],
      flagKc: true,
      flagAnswer: false,
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
        is_zhengke: 0,
        userstatus: parseInt(window.sessionStorage.getItem('userstatus')) || 2 // 1购买2未购买
      },
      packageList: [],
      secvCatalogArr: [],
      courseSections: [],
      openMenu: '1-1' // 默认播放菜单menu-index
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
  mounted () {
    this.getCourseCatalog() // 课程大纲（目录）
    this.dragControllerDiv()
  },
  methods: {
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
      let ofH = window.sessionStorage.getItem('ofH')
      document.getElementById('rightCourseList').scrollTop = ofH
      // 入库观看视频
      if (this.user_id !== '' && this.playCourseInfo.package_id !== '' && this.playCourseInfo.course_id !== '' && this.playCourseInfo.section_id !== '' && this.playCourseInfo.video_id !== '') {
        this.subrecord()
      }
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
        console.log(data)
      })
    },
    // 提问的时候停止播放
    stopVideo () {
      this.$refs.aliPlayers.pause()
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
      this.$router.replace({ path: 'course-video',
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
    }
  },
  beforeDestroy () {
    this.$refs.aliPlayers.dispose()
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
