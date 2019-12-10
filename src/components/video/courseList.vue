<template>
  <keep-alive>
    <div class="rightCourseList" id="rightCourseList">
      <div class="close-box" @click="closeModel()">
        <i class="close-icon"></i>
      </div>
      <h1 class="vc-title">章节目录</h1>
        <el-row class="tac" id="tac">
          <el-col :span="24">
            <el-menu
              :default-active="openMenu"
              class="el-menu-vertical-demo"
              background-color="#1D1F21"
              text-color="#E6E6E6"
              active-text-color="#F99111">
              <el-submenu :index="''+(key+1)" v-for="(val, key) in courseSections" :key="key" :ref="'a'+ key" :id="'a'+ key">
                <template slot="title">
                  <span class="sec-name">{{val.section_name}}</span>
                  <span class="down-load" @click.stop="jiangyiDown(val.handouts)">讲义</span>
                </template>
                <el-menu-item :index="(key+1) + '-' + (index+1)" v-for="(v, index) in val.videos" :key="index"
                @click="playVideo(val, v, key, index)" :id="'showBox'+ (key) + (index)">
                  <i class="el-video-icon" :class="{'play-icon': openMenu == (key+1) + '-' + (index+1)}"></i>
                  <span class="sl">{{v.video_name}}</span>
                  <i class="el-dot-icon" :class="{'el-dot-now': openMenu == (key+1) + '-' + (index+1)}"></i>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
    </div>
  </keep-alive>
</template>
<script>
// import { secvCatalog } from '@/api/class'
import { mapState } from 'vuex'

export default {
  // inject: ['reload'],
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
      courseCatalogInfo: [], // 课程大纲（目录）
      secvCatalogArr: [],
      packageList: [],
      curIndex: '',
      videoListFlag: true,
      playIdx: 0,
      ofH: window.sessionStorage.getItem('ofH')
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    })
  },
  mounted () {
  },
  methods: {
    closeModel () {
      this.videoListFlag = false
      this.$emit('closeModel', 'kc')
    },
    // 跳转到播放页面
    playVideo (val, v, key, index) {
      v.flag = true
      this.playIdx = v
      this.$forceUpdate()
      this.$router.replace({ path: 'course-video',
        query: {
          ...this.$route.query,
          section_id: val.section_id,
          video_id: v.video_id
        }
      })
      window.location.reload()
      let anchor = this.$el.querySelector('#showBox' + key + '' + index)
      window.sessionStorage.setItem('ofH', anchor.offsetTop)
    },
    jiangyiDown (url) {
      if (!url) {
        this.$Message.error('请单独下载章节讲义')
        return
      }
      window.location.href = url
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .rightCourseList{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    overflow-y: auto;
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
  .sl,.sec-name{
    width: 80%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .down-load{
    border: 1px solid rgba(249,145,17,1);
    color: rgba(249,145,17,1);
    border-radius: 3px;
    padding: 0 3px;
  }
</style>
