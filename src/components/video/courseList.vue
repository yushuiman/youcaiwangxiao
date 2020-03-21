<template>
  <el-row class="ta munu-active" id="tac">
    <el-col :span="24">
      <el-menu
        :default-active="openMenu"
        class="el-menu-vertical-demo"
        background-color="#26292C"
        text-color="#999999"
        active-text-color="#F99111">
        <el-submenu :index="''+(key+1)" v-for="(val, key) in courseSections" :key="key" :ref="'a'+ key" :id="'a'+ key">
          <template slot="title">
            <span class="sec-name">{{val.section_name}}</span>
          </template>
          <el-menu-item :index="(key+1) + '-' + (index+1)" v-for="(v, index) in val.videos" :key="index"
          @click="playVideo(val, v, key, index)" :id="'showBox'+ (key) + (index)" style="height: 36px;line-height: 36px;color:#999999;">
            <i class="el-video-icon" :class="{'play-icon': openMenu == (key+1) + '-' + (index+1)}"></i>
            <span class="sl">{{v.video_name}}</span>
            <i class="el-dot-icon" :class="{'el-dot-now': openMenu == (key+1) + '-' + (index+1)}"></i>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
import { mapState } from 'vuex'

export default {
  inject: ['reload'],
  props: {
    showBox: {
      type: String,
      default: ''
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
    }
  },
  mounted () {
  },
  methods: {
    playVideo (val, v, key, index) {
      this.$router.replace({ path: 'course-video',
        query: {
          ...this.$route.query,
          section_id: val.section_id,
          video_id: v.video_id
        }
      })
      // 倍速记忆
      window.sessionStorage.setItem('speed', document.querySelector('.prism-setting-speed .current-setting').innerHTML)
      // 列表位置记忆
      let anchor = this.$el.querySelector('#showBox' + key + '' + index)
      window.sessionStorage.setItem('ofH', anchor.offsetTop)
      this.reload()
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
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
    margin-top: 13px;
    border: 2px solid rgba(102,102,102,1);
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
  .sec-name{
    font-size: 16px;
    color: #E6E6E6;
  }
  .sl,.sec-name{
    width: 80%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
