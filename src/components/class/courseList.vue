<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        :unique-opened="true"
        default-active="2"
        class="el-menu-vertical-demo">
        <el-submenu :index="'' + index+1" v-for="(item, index) in courseCatalogInfo" :key="index">
          <template slot="title" >
            <div @click="getSecvCatalog(item, index)">
              <i class="elt-icon elt-icon-01"></i>
              {{item.name}}
            </div>
          </template>
          <el-submenu :index="'1-'+ key+1" v-for="(val, key) in courseSections" :key="key">
            <template slot="title">
              <i class="elt-icon elt-icon-02"></i>
              <span>{{val.section_name}}</span>
            </template>
            <el-menu-item :index="'1-1'+ index+1" v-for="(v, index) in val.videos" :key="index"
            @click="playVideo(item, val, v, key, index)">
              <i class="elt-icon elt-icon-stop"></i>
              <span>{{v.video_name}}</span>
              <em v-if="userstatus == 2" class="free-pay">免费试听</em>
            </el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
import { courseCatalog, secvCatalog } from '@/api/class'
import { mapState } from 'vuex'
export default {
  props: {
    package_id: {
      type: Number
    },
    userstatus: {
      type: Number
    }
  },
  data () {
    return {
      courseCatalogInfo: [], // 课程大纲（目录）
      courseSections: [], // 课程大纲（章节 video）
      secvCatalogArr: []
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token
    })
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
        if (res.code === 200) {
          this.courseCatalogInfo = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 课程大纲(章节 video)
    getSecvCatalog (item, index) {
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
    // 跳转到播放页面
    playVideo (item, val, v, key, index) {
      if (!this.token) {
        this.$router.push('login')
        return
      }
      window.sessionStorage.setItem('userstatus', this.userstatus) // 是否购买
      this.$router.push({ path: '/course-video',
        query: {
          package_id: this.package_id,
          course_id: item.course_id,
          section_id: val.section_id,
          video_id: v.video_id
          // userstatus: this.userstatus // 1购买 2未购买
        }
      })
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .el-col-24:last-child{
    .el-menu{
      border: 0;
    }
  }
  .el-menu{
    border-bottom: 1px solid #EFEFEF;
  }
  .el-menu .el-submenu {
    border-bottom: 1px solid #EFEFEF;
    &:last-child{
      border: 0;
    }
  }
  .el-menu{
    .el-submenu{
      border-bottom: 1px solid $borderColor;
      // .el-menu-item{
      //   padding-left: 20px!important;
      // }
    }
  }
  .el-menu-title, .el-submenu__title{
    line-height: 50px;
    padding-left: 20px;
    border-bottom: 1px solid $borderColor;
    &.fsbold{
      font-size: 16px;
      font-weight: bold;
    }
  }
  .elt-icon{
    display: inline-block;
    vertical-align: middle;
    margin-top: -3px;
    margin-right: 11px;
    @extend %bg-img;
    background-size: contain;
    &.elt-icon-01{
      @include wh(17, 16);
      margin-left: 2.5px;
      background-image: url('../../assets/images/course/neau-1.png');
    }
    &.elt-icon-02{
      @include wh(22, 22);
      background-image: url('../../assets/images/course/neau-2.png');
    }
    &.elt-icon-play, &.elt-icon-stop{
      @include wh(8, 12);
      margin-left: 7px;
      background-image: url('../../assets/images/course/play-icon.png');
    }
    &.elt-icon-stop{
      @include wh(10, 12);
      margin-left: 6px;
      background-image: url('../../assets/images/course/stop-icon.png');
    }
  }
  .free-pay{
    float: right;
    color: $col666;
  }
</style>
