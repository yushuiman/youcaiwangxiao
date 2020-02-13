<template>
  <div>
    <el-row class="tac">
      <el-col :span="24">
        <el-menu class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">导航一</span>
            </template>
            <el-submenu index="1-1">
              <span slot="title">选项1</span>
              <el-menu-item index="1-1-1">选项1-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <!-- <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item> -->
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { courseCatalog, secvCatalog } from '@/api/education'
import { mapState } from 'vuex'
export default {
  props: {
    type_id: {
      type: Number
    },
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
      secvCatalogList: []
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
      this.showLoading(true)
      courseCatalog({
        package_id: this.package_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.courseCatalogInfo = res.data
          this.courseCatalogInfo.forEach((v, index) => {
            v.index = index + 1 + ''
          })
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 课程大纲(章节 video)
    getSecvCatalog (item, index) {
      let obj = this.secvCatalogList
      for (let i in obj) {
        if (item.course_id === parseInt(i)) {
          return
        }
      }
      secvCatalog({
        course_id: item.course_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          res.data.forEach((v, index) => {
            v.index = index + 1 + ''
            if (v.video && v.video.length) {
              v.video.forEach((val, index) => {
                val.index = index + 1 + ''
              })
            }
          })
          this.$set(this.secvCatalogList, [item.course_id], res.data)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 跳转到播放页面
    playVideo (item, val, v, key, index) {
      if (!this.token) {
        this.$router.push({ path: '/login',
          query: {
            ...this.$route.query,
            call_back: 'education-course-detail'
          }
        })
        return
      }
      if (this.userstatus === 2) {
        this.$Message.error('请购买课程')
        return
      }
      this.$router.push({ path: '/education-video',
        query: {
          type_id: this.type_id,
          package_id: this.package_id,
          course_id: item.course_id,
          section_id: val.section_id,
          video_id: v.video_id
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
      border-radius: 4px;
    }
  }
  .el-menu .el-submenu {
    &:last-child{
      border: 0;
    }
  }
  .el-menu{
    .el-submenu{
      border-bottom: 1px solid $borderColor;
    }
  }
  .title-cpe{
    display: flex;
    justify-content: space-between;
    span:nth-child(2){
      color: $blueColor;
      font-size: 16px;
      padding-right: 20px;
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
