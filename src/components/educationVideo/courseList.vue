<template>
  <div class="sec-list">
    <h1 class="vsc-title">章节目录</h1>
      <el-row class="tac munu-active" id="tac">
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
              </template>
              <el-menu-item :index="(key+1) + '-' + (index+1)" v-for="(v, index) in val.video" :key="index"
              @click="playVideo(val, v, key, index)" :id="'showBox'+ (key) + (index)" style="height: 29px;line-height: 29px;color:#999999;margin: 5px 0;">
                <div :class="{'already-see': v.record == 1}">
                  <span class="see-tips">已完成</span>
                  <i class="el-video-icon" :class="{'play-icon': openMenu == (key+1) + '-' + (index+1)}"></i>
                  <span class="sl">{{v.video_name}}</span>
                  <i class="el-dot-icon" :class="{'el-dot-now': openMenu == (key+1) + '-' + (index+1), 'el-dot-see': v.record == 1}"></i>
                </div>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
  </div>
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
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    })
  },
  mounted () {
  },
  methods: {
    // 跳转到播放页面
    playVideo (val, v, key, index) {
      this.$router.replace({ path: 'education-video',
        query: {
          ...this.$route.query,
          section_id: val.section_id,
          video_id: v.video_id
          // VideoId: v.VideoId
        }
      })
      this.$emit('switchVideo', 2)
      // 倍速记忆
      // window.sessionStorage.setItem('speed', document.querySelector('.prism-setting-speed .current-setting').innerHTML)
      // 列表位置记忆
      let anchor = this.$el.querySelector('#showBox' + key + '' + index)
      window.sessionStorage.setItem('ofH', anchor.offsetTop)
      // this.reload()
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
  .see-tips{
    display: none;
  }
  .already-see{
    position: relative;
    &:hover{
      .see-tips{
        display: block!important;
        text-align: center;
        width: 58px;
        height: 20px;
        line-height: 20px;
        background:rgba(153,153,153,1);
        border-radius: 2px;
        font-size: 12px;
        color: #000000;
        position: absolute;
        right: 20px;
        top: -6px;
      }
    }
  }
  .el-dot-icon{
    @include wh(10, 10);
    display: inline-block;
    border-radius: 100%;
    margin-top: 13px;
    border: 2px solid rgba(102,102,102,1);
    box-sizing: border-box;
    float: right;
    &.el-dot-now{
      border: 2px solid #F99111;
    }
    &.el-dot-see{
      border: 2px solid #0AAB55;
      background:#0AAB55;
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
  .down-load{
    border: 1px solid #F99111;
    color: #F99111;
    border-radius: 3px;
    padding: 0 3px;
  }
</style>
