<template>
  <div class="rightCourseList">
    <div class="close-box" @click="closeModel()">
      <i class="close-icon"></i>
    </div>
    <h1 class="vc-title">章节目录</h1>
    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          :default-active="openMenu"
          class="el-menu-vertical-demo"
          background-color="#1D1F21"
          text-color="#E6E6E6"
          active-text-color="#F99111">
          <el-submenu :index="''+(key+1)" v-for="(val, key) in courseSections" :key="key">
            <template slot="title">
              <span>{{val.section_name}}</span>
            </template>
            <el-menu-item :index="(key+1) + '-' + (index+1)" v-for="(v, index) in val.videos" :key="index"
            @click="playVideo(val, v, key, index)">
              <i class="el-video-icon" :class="{'play-icon': openMenu == (key+1) + '-' + (index+1)}"></i>
              <span class="sl">{{v.video_name}}</span>
              <i class="el-dot-icon" :class="{'el-dot-now': openMenu == (key+1) + '-' + (index+1)}"></i>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import { secvCatalog } from '@/api/class'
import { mapState } from 'vuex'

export default {
  props: {
    showBox: {
      type: String,
      default: ''
    },
    flagCourse: {
      type: Boolean,
      default: false
    },
    courseSections: {
      type: Array
    },
    openMenu: {
      type: String
    }
  },
  data () {
    return {
      // value2: false,
      courseCatalogInfo: [], // 课程大纲（目录）
      // courseSections: [], // 课程大纲（章节 video）
      secvCatalogArr: [],
      packageList: [],
      curIndex: '',
      videoListFlag: true,
      playIdx: 0
      // openMenu: window.sessionStorage.getItem('openMenu')
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    // setInterval(() => {
    //   this.watch_time = this.watch_time + 2
    //   var message = {
    //     from: 1,
    //     user_id: this.user_id,
    //     package_id: this.$route.query.package_id,
    //     course_id: this.$route.query.course_id,
    //     section_id: this.$route.query.section_id,
    //     video_id: this.$route.query.video_id,
    //     watch_time: this.watch_time,
    //     video_type: 1, // 视频类型 1视频2直播
    //     status: 1 // 播放类型 1课程视频播放
    //   }
    //   initWS(JSON.stringify(message))
    //   // var message = {
    //   //   from: 1,
    //   //   user_id: 20,
    //   //   package_id: 1,
    //   //   course_id: 1,
    //   //   section_id: 1,
    //   //   video_id: 6,
    //   //   watch_time: 17,
    //   //   video_type: 1, // 视频类型 1视频2直播
    //   //   status: 1 // 播放类型 1课程视频播放
    //   // }
    //   // let ws
    //   // ws = new WebSocket('ws://ycapi.youcaiwx.com:2346')
    //   // ws.onopen = function () {
    //   //   console.log('连接成功')
    //   //   ws.send(JSON.stringify(message))
    //   //   console.log(JSON.stringify(message))
    //   //   console.log('给服务端发送一个字符串：My')
    //   // }
    //   // ws.onmessage = function (e) {
    //   //   console.log('收到服务端的消息：' + e.data)
    //   // }
    // }, 30000)
    // this.getCourseCatalog() // 课程大纲（目录）
    // this.initSecvCatalog() // 初始化加载数据-详情页面选择的目录course_id
  },
  methods: {
    closeModel () {
      this.videoListFlag = false
      this.$emit('closeModel', 'kc')
    },
    // // 课程大纲（目录）
    // getCourseCatalog () {
    //   courseCatalog({
    //     package_id: this.package_id
    //   }).then(data => {
    //     const res = data.data
    //     this.packageList = res.data
    //   })
    // },
    // 课程大纲(章节 video)
    // getSecvCatalog (item, idx) {
    //   this.videoListFlag = true
    //   this.$emit('closeModel')
    //   this.$router.replace({ path: 'class-video',
    //     query: {
    //       ...this.$route.query,
    //       course_id: item.course_id
    //     }
    //   })
    //   for (var i = 0; i < this.secvCatalogArr.length; i++) {
    //     if (item.name === this.secvCatalogArr[i].type) {
    //       this.courseSections = this.secvCatalogArr[i].courseSections
    //       return
    //     }
    //   }
    //   secvCatalog({
    //     course_id: item.course_id
    //   }).then(data => {
    //     const res = data.data
    //     this.courseSections = res.data
    //     this.secvCatalogArr.push({
    //       type: item.name,
    //       courseSections: res.data
    //     })
    //   })
    // },
    // // 初始化展示章节
    // initSecvCatalog () {
    //   secvCatalog({
    //     course_id: this.$route.query.course_id
    //   }).then(data => {
    //     const res = data.data
    //     this.courseSections = res.data
    //   })
    // },
    // 跳转到播放页面
    playVideo (val, v, key, index) {
      v.flag = true
      this.playIdx = v
      this.$forceUpdate()
      // this.$emit('getVideoPlayback', v.video_id)
      // let openMenu = (key + 1) + '-' + (index + 1)
      // window.sessionStorage.setItem('openMenu', .openMenu)
      this.$router.replace({ path: 'class-video',
        query: {
          ...this.$route.query,
          section_id: val.section_id,
          video_id: v.video_id
        }
      })
      window.location.reload()
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  // .vid-kcqh{
  //   position: absolute;
  //   width: 100%;
  //   top: 0;
  //   left: 60px;
  //   bottom: 19px;
  //   z-index: 101;
  //   background: #26292C;
  //   overflow-y: scroll;
  // }
  // .vc-title{
  //   color: #E6E6E6;
  //   font-size: 20px;
  //   padding-left: 30px;
  //   padding-top: 30px;
  // }
  // .rightCourseList{
  //   .video-info-r{
  //     position: absolute;
  //     top: 0;
  //     right: 0;
  //     bottom: 0;
  //     width: 100%;
  //   }
  // }
  .rightCourseList{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    // width: 382px;
    overflow-y: scroll;
  }
  .vc-title{
    padding-top: 18px;
    padding-bottom: 30px;
    padding-left: 20px;
    font-size: 20px;
    color: #E6E6E6;
  }
  .vc-list{
    padding-bottom: 30px;
    padding-left: 20px;
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
  .sl{
    width: 80%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
