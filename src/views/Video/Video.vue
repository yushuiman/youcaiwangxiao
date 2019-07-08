<template>
  <div class="video-wrap">
    <div class="video-header">
      <router-link :to="{ path: '/class-detail', query:{course_id: this.$route.query.package_id}}">></router-link>
      <span>{{videoCredentials.Title}}</span>
      <div class="login-r fr">
        <img src="../../assets/images/global/email-icon.png" alt="email" class="email-icon">
        <img src="../../assets/images/global/head-logo-moren.png" alt="头像" class="head-logo">
      </div>
    </div>
    <div class="video-main clearfix">
      <div class="video-info-l fl">
        <ul class="vinfo-ul">
          <li class="vinfo-item" :class="['vinfo-item-0'+(index+1), {'curren': selMenu==index}]"
            v-for="(item, index) in vinfo" :key="index" @click="showModel(item, index)">
            <i class="vio-icon"></i>
            <p class="txt" v-html="item"></p>
          </li>
        </ul>
      </div>
      <div class="video-info-c fl" :class="{'rightSty': showBox == '','rightStyKc': showBox == '课程<br />切换'}">
        <ali-player v-if="videoCredentials.playAuth" :vid="VideoId" :playauth="videoCredentials.playAuth"></ali-player>
      </div>
      <div class="video-info-zjml fr" v-if="showBox == '课程<br />切换'">
        <course-list :package_id="this.$route.query.package_id" :is_zheng="playCourseInfo.is_zheng" @closeModel="closeModel" @getVideoPlayback="getVideoPlayback()"></course-list>
      </div>
      <div class="video-info-r video-info-day-r fr" v-if="showBox == '答疑'">
        <answer :playCourseInfo="playCourseInfo" @closeModel="closeModel"></answer>
      </div>
      <div class="video-info-r fr" v-if="showBox == '讲义'">
        <div class="close-box" @click="closeModel()">
          <i class="close-icon"></i>
        </div>
        <h1 class="vc-title">讲义</h1>
        <iframe id="main-frame" :src="videoCredentials.handouts" width="100%" height="88%"></iframe>
      </div>
      <!-- 课程 答疑 讲义 -->
      <div class="three-main">
        <!-- <course-list v-if="showBox == '课程<br />切换'"></course-list> -->
        <!-- <div class="video-course-wrap vid-dy" v-if="showBox == '答疑'">
          <answer :playCourseInfo="playCourseInfo" @closeModel="closeModel"></answer>
        </div> -->
        <!-- <div class="video-course-wrap vid-jy" v-if="showBox == '讲义'">
          <div class="close-box" @click="closeModel()">
            <i class="close-icon"></i>
          </div>
          <h1 class="vc-title">讲义</h1>
          <iframe id="main-frame" :src="videoCredentials.handouts" width="100%" height="750px"></iframe>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import aliPlayer from '@/components/video/aliPlayer'
import courseList from '@/components/video/courseList'
import answer from '@/components/video/answer'
import { videoPlayback, videoCredentials } from '@/api/class'
export default {
  data () {
    return {
      backCount: 0,
      selMenu: 3,
      showBox: '课程<br />切换',
      vinfo: ['课程<br />切换', '答疑', '讲义'],
      VideoId: '', // 视频VideoId
      videoCredentials: {
        handouts: '', // 讲义
        playauth: '', // 获取视频凭证
        collect: '',
        watch_time: '',
        Title: ''
      },
      playCourseInfo: {
        video_id: this.$route.query.video_id,
        section_id: this.$route.query.section_id,
        course_id: this.$route.query.course_id,
        package_id: this.$route.query.package_id,
        is_zheng: this.$route.query.is_zheng
      },
      playStatus: true // 停止播放
    }
  },
  components: {
    aliPlayer,
    courseList,
    answer
  },
  computed: {

  },

  mounted () {
    this.getVideoPlayback(this.$route.query.video_id)
  },
  methods: {
    // tab 显示关闭课程，答疑，讲义
    showModel (val, index) {
      this.selMenu = index
      this.showBox = val
    },
    closeModel () {
      this.showBox = ''
    },
    // 获取视频凭证
    getVideoPlayback (id) {
      videoPlayback({
        video_id: id
      }).then(data => {
        const res = data.data
        this.VideoId = res.data.VideoId
        // 获取视频凭证
        let dataForm = Object.assign({ VideoId: res.data.VideoId, user_id: 41, video_time: 5, quiz_image: 'dfsdfsdfsd' }, this.playCourseInfo)
        videoCredentials(dataForm).then(data => {
          let res = data.data
          this.videoCredentials = res.data
        })
      })
    }

  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .video-header{
    @include lh(70, 70);
    padding: 0 31px;
    background: $colfff;
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
    img{
      vertical-align: middle;
      &.email-icon{
        @include wh(18, 14);
        margin: 0 31px;
      }
      &.head-logo{
        @include wh(30, 30);
      }
    }
  }
  .video-main{
    position: absolute;
    bottom: 0;
    left: 0;
    top: 70px;
    width: 100%;
    // height: 100%;
    background: #1D1F21;
    // background: #f00;
    // display: flex;
    // justify-content: space-between;
    .video-info-l{
      width: 60px;
    }
    .video-info-c{
      position: absolute;
      left: 61px;
      top: 20px;
      bottom: 20px;
      // width: 100%;
      right: 495px;
      // height: 849px;
      // height: 100%;
      background:rgba(0,0,0,1);
      border-radius: 10px;
      box-sizing: border-box;
      &.rightSty{
        right: 0;
      }
      &.rightStyKc{
        right: 382px;
      }
    }
    .video-info-r{
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      // padding: 0 20px;
      width: 495px;
      background: #F8FAFC;
      // height: 869px;
      // height: 100%;
      // box-sizing: border-box;
      box-shadow: 0px 15px 10px -15px rgba(0,0,0,0.2) inset;
    }
  }
  .vinfo-ul{
    padding-top: 156px;
  }
  .vinfo-item{
    padding: 30px 0;
    text-align: center;
    &:hover, &.curren{
      background: #26292C;
    }
    // &.curren{
    //   background: #ffffff;
    // }
    .txt{
      color: $col999;
      line-height: 18px;
      margin-top: 5px;
    }
  }
  .vio-icon{
    .vinfo-item-01 &{
      @include bg_img(22, 18, '../../assets/images/video/class-icon.png');
    }
    .vinfo-item-02 &{
      @include bg_img(26, 24, '../../assets/images/video/answer-icon.png');
    }
    .vinfo-item-03 &{
      @include bg_img(26, 25, '../../assets/images/video/jiangyi-icon.png');
    }
  }

  .vc-title{
    padding-top: 18px;
    padding-bottom: 30px;
    font-size: 20px;
    color: $col333;
    .video-info-r &{
      padding-left: 20px;
    }
    .video-info-zjml &{
      color: #E6E6E6;
    }
  }
  .el-video-icon{
    @include wh(14, 14);
    display: inline-block;
    margin-right: 10px;
    margin-top: -3px;
    vertical-align: middle;
    @extend %bg-img;
    background-image: url('../../assets/images/video/stop-icon.png');
    &.play-icon{
      background-image: url('../../assets/images/video/play-icon.png');
    }
  }
  .el-menu-item{
    padding-left: 35px!important;
    padding-right: 22px!important;
  }
  .el-dot-icon{
    @include wh(10, 10);
    display: inline-block;
    border-radius: 100%;
    margin-top: 20px;
    border:2px solid rgba(102,102,102,1);
    box-sizing: border-box;
    float: right;
    &.el-dot-see{
      border: 0;
      background: rgba(249,145,17,1);
    }
    &.el-dot-now{
      border: 0;
      border:2px solid rgba(249,145,17,1);
    }
  }
  // 目录 答疑 讲义
  .video-course-wrap{
    position: absolute;
    top: 20px;
    background: #26292C;
    z-index: 12;
    padding: 0 20px;
    box-sizing: border-box;
    &.vid-kcqh{
      left: 60px;
      width: 386px;
      // height: 849px;
      height: 100%;
    }
    &.vid-jy, &.vid-dy{
      width: 495px;
      // height: 869px;
      height: 100%;
      top: 0;
      right: 0;
      background: #ffffff;
      box-shadow: 0px 15px 10px -15px rgba(0,0,0,0.2) inset;
    }
    &.vid-dy{
      padding: 0;
      background: #F8FAFC;
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
  .close-box{
    text-align: right;
    padding-top: 25px;
    padding-right: 20px;
    .close-icon{
      @include bg_img(15, 15, '../../assets/images/video/close-icon.png');
    }
  }
</style>
