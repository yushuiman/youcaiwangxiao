<template>
  <div>
    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          :unique-opened="true"
          default-active="1"
          class="el-menu-vertical-demo">
          <el-submenu :index="item.index" v-for="(item, index) in courseCatalogInfo" :key="item.course_id" style="margin-bottom: 10px;border:0;">
            <template slot="title" >
              <div @click="getSecvCatalog(item, index)">
                <i class="elt-icon elt-icon-01"></i>
                {{item.name}}
              </div>
            </template>
            <el-submenu :index="item.index+'-'+val.index" v-for="val in secvCatalogList[item.course_id]" :key="val.section_id">
              <template slot="title">
                <i class="elt-icon elt-icon-02"></i>
                <span>{{val.section_name}}</span>
              </template>
              <el-menu-item :index="item.index + '-' + val.index + '-' + v.index" v-for="(v) in val.videos" :key="v.video_id"
              @click="playVideo(item, val, v, key, index)">
                <i class="elt-icon elt-icon-stop"></i>
                <span>{{v.video_name}}</span>
                <!-- <em v-if="userstatus == 2" class="free-pay">免费试听</em> -->
              </el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { courseCatalog, secvCatalog } from '@/api/class'
import { mapState } from 'vuex'
export default {
  props: ['package_id', 'userstatus'],
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
        package_id: this.package_id,
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.courseCatalogInfo = res.data
          this.$router.replace({ path: 'course-detail',
            query: {
              ...this.$route.query,
              course_id: this.courseCatalogInfo[0].course_id,
              is_zk: this.courseCatalogInfo[0].is_zhengke
            }
          })
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
        if (item.course_id == i) {
          return
        }
      }
      secvCatalog({
        course_id: item.course_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          res.data.forEach((v, index) => {
            v.index = index + 1
            if (v.videos && v.videos.length) {
              v.videos.forEach((val, index) => {
                val.index = index + 1
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
            call_back: 'course-detail'
          }
        })
        return
      }
      // if (this.userstatus == 2) {
      //   this.$Message.error('请购买课程')
      //   return
      // }
      window.sessionStorage.setItem('userstatus', this.userstatus) // 是否购买
      this.$router.push({ path: '/course-video',
        query: {
          package_id: this.package_id,
          course_id: item.course_id,
          section_id: val.section_id,
          video_id: v.video_id,
          is_zk: item.is_zhengke
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
