<template>
  <div class="video-wrap">
    <div class="video-header">
      <router-link :to="{ path: '/class-detail', query:{package_id: this.$route.query.package_id}}">></router-link>
      <span>{{videoCredentials.Title}}</span>
      <div class="login-r fr">
        <img src="../../assets/images/global/email-icon.png" alt="email" class="email-icon">
        <img src="../../assets/images/global/head-logo-moren.png" alt="头像" class="head-logo">
      </div>
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
      <div class="video-info-l" id="left">
        <ul class="vinfo-ul">
          <li class="vinfo-item" @click="showModel('课程<br />切换')">
            <i class="vio-icon vio-icon-01"></i>
            <p class="txt">课程<br />切换</p>
          </li>
          <li class="vinfo-item" v-if="playCourseInfo.is_zhengke == 1" @click="showModel('答疑')">
            <i class="vio-icon vio-icon-02"></i>
            <p class="txt">答疑</p>
          </li>
          <li class="vinfo-item" @click="showModel('讲义')">
            <i class="vio-icon vio-icon-03"></i>
            <p class="txt">讲义</p>
          </li>
        </ul>
         <!-- <ul class="vinfo-ul" v-else>
          <li class="vinfo-item" :class="[{'curren': selMenu==index}]"
            v-for="(item, index) in vinfo" :key="index" @click="showModel(item, index)">
            <i class="vio-icon" :class="['vio-icon-0'+(index+1)]"></i>
            <p class="txt" v-html="item"></p>
          </li>
        </ul> -->
      </div>
      <div class="video-info-c">
        <ali-player v-if="videoCredentials.playAuth" :vid="VideoId" :playauth="videoCredentials.playAuth"></ali-player>
        <div class="star-collection" @click="courseCollection">
          <Icon type="md-star-outline" style="color: #ffffff;"/>
          <Icon type="md-star" style="color: #F99111;"/>
        </div>
      </div>
      <div id="line"></div>
      <div class="video-info-r" :style="{ width: wImportant + 'px' }" id="right">
        <course-list v-if="flagKc" :courseSections="courseSections" :is_zhengke="playCourseInfo.is_zhengke" @closeModel="closeModel" @getVideoPlayback="getVideoPlayback()"></course-list>
        <answer v-if="flagAnswer" :playCourseInfo="playCourseInfo" @closeModel="closeModel"></answer>
        <div class="jiangyi" v-if="flagJy">
          <div class="close-box" @click="closeModel()">
            <i class="close-icon"></i>
          </div>
          <h1 class="vc-title">讲义</h1>
          <iframe id="main-frame" :src="videoCredentials.handouts" width="100%" height="88%"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import aliPlayer from '@/components/video/aliPlayer'
import courseList from '@/components/video/courseList'
import answer from '@/components/video/answer'
import { videoPlayback, videoCredentials, courseCatalog, secvCatalog, initWS } from '@/api/class'
import { mapState } from 'vuex'
// import WebSocket from '@/libs/web-socket'
// const initWS = (data) => {
//   return new WebSocket(ws => {
//     ws.send(data)
//   })
// }
export default {
  data () {
    return {
      backCount: 0,
      selMenu: 3,
      showBox: '课程<br />切换',
      vinfo: ['课程<br />切换', '答疑', '讲义'],
      flagKc: true,
      flagAnswer: false,
      flagCourse: false,
      flagJy: false,
      wImportant: '328',
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
        is_zhengke: this.$route.query.is_zhengke,
        userstatus: this.$route.query.userstatus
      },
      packageList: [],
      secvCatalogArr: [],
      courseSections: [],
      playStatus: true // 停止播放
    }
  },
  components: {
    aliPlayer,
    courseList,
    answer
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    initWS()
    // this.ws = initWS()
    this.getVideoPlayback(this.$route.query.video_id)
    this.initSecvCatalog() // 初始化加载数据-详情页面选择的目录course_id
    this.getCourseCatalog() // 课程大纲（目录）
  },
  methods: {
    // tab 显示关闭课程，答疑，讲义
    showModel (val, index) {
      // this.selMenu = index
      if (val === '课程<br />切换') {
        this.flagCourse = !this.flagCourse
        this.flagAnswer = false
        this.flagJy = false
        if (this.flagKc) {
          this.wImportant = 328
        }
      }
      if (val === '答疑') {
        this.flagAnswer = !this.flagAnswer
        this.flagJy = false
        if (this.flagAnswer) {
          this.wImportant = 495
        } else {
          if (this.flagKc) {
            this.wImportant = '328'
          } else {
            this.wImportant = '0'
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
            this.wImportant = '328'
          } else {
            this.wImportant = '0'
          }
        }
      }
    },
    closeModel (msg) {
      if (msg === 'kc') {
        this.flagKc = false
        this.wImportant = '0'
      }
      this.flagAnswer = false
      this.flagJy = false
      this.wImportant = '0'
      if (this.flagKc) {
        this.wImportant = '382'
      }
    },
    // 课程大纲（目录）
    getCourseCatalog () {
      courseCatalog({
        package_id: this.$route.query.package_id
      }).then(data => {
        const res = data.data
        this.packageList = res.data
      })
    },
    // 课程大纲(章节 video)
    getSecvCatalog (item, idx) {
      this.flagKc = true
      this.flagAnswer = false
      this.flagJy = false
      this.wImportant = '382'
      this.$router.replace({ path: 'class-video',
        query: {
          ...this.$route.query,
          course_id: item.course_id
        }
      })
      for (var i = 0; i < this.secvCatalogArr.length; i++) {
        if (item.name === this.secvCatalogArr[i].type) {
          this.courseSections = this.secvCatalogArr[i].courseSections
          return
        }
      }
      secvCatalog({
        course_id: item.course_id
      }).then(data => {
        const res = data.data
        this.courseSections = res.data
        this.secvCatalogArr.push({
          type: item.name,
          courseSections: res.data
        })
      })
    },
    // 初始化展示章节
    initSecvCatalog () {
      secvCatalog({
        course_id: this.$route.query.course_id
      }).then(data => {
        const res = data.data
        this.courseSections = res.data
      })
    },
    // 获取视频凭证
    getVideoPlayback (id) {
      videoPlayback({
        video_id: id
      }).then(data => {
        const res = data.data
        this.VideoId = res.data.VideoId
        // 获取视频凭证
        let dataForm = Object.assign({ VideoId: res.data.VideoId, user_id: this.user_id, video_time: 5, quiz_image: 'dfsdfsdfsd' }, this.playCourseInfo)
        videoCredentials(dataForm).then(data => {
          let res = data.data
          this.videoCredentials = res.data
        })
      })
    },
    // 收藏
    courseCollection () {

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
    box-shadow: 0 4px 8px 0 rgba(28,31,33,.1);
    position: relative;
    z-index: 101;
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
    overflow-y: scroll;
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
    right: 170px;
    bottom: 7px;
    font-size: 30px;
  }
</style>
