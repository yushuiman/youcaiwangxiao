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
      <!-- <div class="vid-kcqh" v-if="flagCourse">
        <h1 class="vc-title">套餐内课程</h1>
        <div class="vc-list" v-for="(item, index) in packageList" :key="index" @click="getSecvCatalog(item)">
          <img :src="item.pc_img" alt="">
          <div class="c-info">
            <h2>{{item.name}}</h2>
            <p>讲师: {{item.teacher_name}}</p>
          </div>
        </div>
      </div> -->
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
        <ali-player ref="aliPlayers" @ready="ready" v-if="videoCredentials.playAuth" :vid="playCourseInfo.VideoId" :playauth="videoCredentials.playAuth"></ali-player>
        <div class="star-collection" @click="courseCollection(videoCredentials.collect)">
          <Icon type="md-star-outline" style="color: #ffffff;" v-if="videoCredentials.collect == 2"/>
          <Icon type="md-star" style="color: #F99111;" v-if="videoCredentials.collect == 1"/>
        </div>
      </div>
      <div id="resize" class="course-drag" :class="{'course-drag-hide': !flagKc && !flagAnswer && !flagJy}">
        <div class="drag"></div>
      </div>
      <div class="video-info-r" :style="{ width: wImportant + 'px' }" id="right">
        <div class="rightCourseList" v-if="flagKc">
          <div class="close-box" @click="closeModel">
            <i class="close-icon"></i>
          </div>
          <h1 class="vc-title" style="color: #E6E6E6;">章节目录</h1>
          <ul class="video-list">
            <li class="video-item" :class="{'curren': playCourseInfo.video_id == v.video_id}" v-for="(v, index) in learnVideoList" :key="index" @click="playVideo(v)">
              <i class="el-video-icon"></i>
              <span class="sl">{{v.video_name}}</span>
              <i class="el-dot-icon"></i>
            </li>
          </ul>
        </div>
        <answer v-if="flagAnswer" :playCourseInfo="playCourseInfo" :user_id="user_id" @closeModel="closeModel"></answer>
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
// import courseList from '@/components/video/courseList'
import answer from '@/components/video/answer'
import HeadName from '@/components/common/HeadName'
import { videoCredentials, collection, initWS } from '@/api/class'
import { getVideo } from '@/api/learncenter'

import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
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
      selMenu: 3,
      showBox: '课程<br />切换',
      vinfo: ['课程<br />切换', '答疑', '讲义'],
      flagKc: true,
      flagAnswer: false,
      flagCourse: false,
      flagJy: false,
      wImportant: 382,
      videoCredentials: {
        handouts: '', // 讲义
        playAuth: '', // 获取视频凭证
        collect: '', // 收藏
        watch_time: '', // 观看时间
        Title: '' // name
      },
      playCourseInfo: {
        VideoId: '',
        package_id: this.$route.query.package_id,
        course_id: this.$route.query.course_id,
        section_id: this.$route.query.section_id,
        video_id: this.$route.query.video_id,
        is_zhengke: this.$route.query.is_zhengke,
        userstatus: parseInt(window.sessionStorage.getItem('userstatus')) || 2, // 1购买2未购买
        days: this.$route.query.days,
        plan_id: this.$route.query.plan_id
      },
      playtime: 0, // 视频上次播放时间
      socketTimer: null,
      learnVideoList: []
    }
  },
  components: {
    aliPlayer,
    // courseList,
    answer,
    HeadName
  },
  computed: {
    ...mapState({
      avatorImgPath: state => state.user.avatorImgPath,
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
    // this.initSecvCatalog() // 初始化加载数据-详情页面选择的目录course_id
    // this.getVideoPlayback(this.$route.query.video_id)
  },
  methods: {
    ...mapActions([
      'handleLogOut'
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
          package_id: this.playCourseInfo.package_id,
          course_id: this.playCourseInfo.course_id,
          section_id: this.playCourseInfo.section_id,
          video_id: this.playCourseInfo.video_id,
          watch_time: this.playtime,
          video_type: 1, // 视频类型 1视频2直播
          status: 2, // 播放类型 1课程视频播放2学习中心
          days: this.playCourseInfo.days,
          plan_id: this.playCourseInfo.plan_id
        }
        // 视频播放时间大于0 socket
        if (this.playtime > 0) {
          // console.log(JSON.stringify(message))
          initWS(JSON.stringify(message))
        }
      }, 30000)
    },
    // tab 显示关闭课程，答疑，讲义
    showModel (val, index) {
      // this.selMenu = index
      if (val === '课程<br />切换') {
        // this.flagCourse = !this.flagCourse
        this.flagKc = !this.flagKc
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
      this.flagKc = false
      this.flagAnswer = false
      this.flagJy = false
      this.wImportant = 0
      if (this.flagKc) {
        this.wImportant = 382
      }
    },
    // 视频列表
    goLearnVideo () {
      let types = 2
      if (this.playCourseInfo.userstatus === 2) { // 0元体验 userstatus==2未购买
        types = 1
      }
      getVideo({
        user_id: this.user_id,
        course_id: this.playCourseInfo.course_id,
        plan_id: this.playCourseInfo.plan_id,
        types: types,
        days: this.playCourseInfo.days,
        sameday: 1 // 是今天1不是2
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.learnVideoList = res.data.video
          this.learnVideoList.forEach(v => {
            if (parseInt(this.playCourseInfo.video_id) === v.video_id) {
              this.playCourseInfo.VideoId = v.VideoId
              this.playtime = v.watch_time
            }
          })
          this.getVideoPlayback()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 获取视频凭证
    getVideoPlayback () {
      videoCredentials({
        VideoId: this.playCourseInfo.VideoId,
        user_id: this.user_id,
        package_id: this.playCourseInfo.package_id,
        course_id: this.playCourseInfo.course_id,
        section_id: this.playCourseInfo.section_id,
        video_id: this.playCourseInfo.video_id
      }).then(data => {
        let res = data.data
        this.videoCredentials = res.data
      })
    },
    playVideo (v) {
      this.$router.replace({ path: 'learn-center-video',
        query: {
          ...this.$route.query,
          package_id: v.package_id,
          course_id: v.course_id,
          section_id: v.section_id,
          video_id: v.video_id
        }
      })
      this.goLearnVideo()
      window.location.reload()
      this.playtime = v.watch_time
    },
    courseCollection (collectId) { // 1收藏2取消收藏
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
    }
  },
  beforeDestroy () {
    clearInterval(this.socketTimer)
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
  // 收藏
  .star-collection{
    position: absolute;
    z-index: 10;
    right: 131px;
    bottom: 7px;
    font-size: 30px;
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
  // 菜单
  .video-item{
    padding: 0 35px;
    line-height: 50px;
    color: $col999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover{
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
