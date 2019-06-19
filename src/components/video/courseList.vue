<template>
  <div class="">
    <div class="video-course-wrap vid-kcqh">
      <h1 class="vc-title">套餐内课程</h1>
      <div class="vc-list" v-for="(item, index) in packageList" :key="index" @click="getSecvCatalog(item)">
        <img :src="item.pc_img" alt="">
        <div class="c-info">
          <h2>{{item.name}}</h2>
          <p>讲师: {{item.teacher_name}}</p>
        </div>
      </div>
    </div>
    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#1D1F21"
          text-color="#E6E6E6"
          active-text-color="#F99111">
          <el-submenu :index="''+(key+1)" v-for="(val, key) in courseSections" :key="key">
            <template slot="title">
              <span>{{val.section_name}}</span>
            </template>
            <el-menu-item :index="(key+1) + '-' + (index+1)" v-for="(v, index) in val.videos" :key="index"
            @click="playVideo(val, v)">
              <i class="el-video-icon"></i>
              <span>{{v.video_name}}</span>
              <i class="el-dot-icon"></i>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { courseCatalog, secvCatalog } from '@/api/class'
export default {
  props: {
    package_id: {
      type: String
    }
  },
  data () {
    return {
      courseCatalogInfo: [], // 课程大纲（目录）
      courseSections: [], // 课程大纲（章节 video）
      secvCatalogArr: [],
      packageList: [
        {
          pc_img: '23232323',
          name: '史蒂夫可视电话反馈收到回复',
          teacher_name: '1wefwefefs'
        },
        {
          pc_img: '23232323',
          name: '说的话说的三闾大夫',
          teacher_name: '2wefwefefs'
        },
        {
          pc_img: '23232323',
          name: '23ewe3',
          teacher_name: '3wefwefefs'
        }
      ],
      curIndex: ''
    }
  },
  mounted () {
    this.getCourseCatalog() // 课程大纲（目录）
  },
  methods: {
    // 课程大纲（目录）
    getCourseCatalog () {
      courseCatalog({
        package_id: this.package_id
      }).then(data => {
        const res = data.data
        this.packageList = res.data
      })
    },
    // 课程大纲(章节 video)
    getSecvCatalog (item, idx) {
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
    // 跳转到播放页面
    playVideo (val, v) {
      console.log(23232323)
      // window.location.href = '#/' + this.baseInfo.activesRoute
      // this.$emit('getVideoPlayback1', v.video_id)
      // this.$router.push({ path: '/classVideo',
      //   query: {
      //     package_id: this.package_id,
      //     course_id: this.$route.query.course_id,
      //     section_id: val.section_id,
      //     video_id: v.video_id
      //     // is_zheng: item.is_zhengke
      //   }
      // })
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
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
      height: 849px;
      overflow-y: scroll;
    }
  }
  .vc-title{
    padding-top: 18px;
    padding-bottom: 30px;
    font-size: 20px;
    color: $col333;
    .vid-kcqh &{
      color: #E6E6E6;
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
    .close-icon{
      @include bg_img(27, 28, '../../assets/images/video/close-icon.png');
    }
    .video-info-zjml &{
      padding-right: 20px;
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
</style>
