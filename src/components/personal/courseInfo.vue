<template>
  <div class="u-course-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdxCourse == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <!-- 课程 -->
      <div class="u-course-my" v-if="selIdxCourse == 0">
        <div class="uc-item" v-for="(val, key) in myCourseList" :key="key">
          <img :src="val.pc_img" alt="" class="uci-img">
          <div class="uci-detail">
            <h2 class="ucid-name">{{val.name}}</h2>
            <p class="ucid-des">{{val.description}}</p>
            <p class="ucid-learn" v-if="val.video">学习至{{val.video.course_id}}-{{val.video.section_id}}（{{val.video.video_id}}）{{val.video.video_name}}</p>
          </div>
          <button class="btn-com uci-learn" @click="courseLearnVideo(val)">去学习</button>
        </div>
      </div>
      <!-- 播放记录 -->
      <div v-if="selIdxCourse == 1">
        <div class="u-course-record" v-if="watchRecordsList && watchRecordsList.length">
          <div class="ucr-item" v-for="(item, index) in watchRecordsList" :key="index">
            <p class="time"><i class="dot"></i>{{item.time}}</p>
            <div class="uc-item" v-for="(val, key) in item.list" :key="key">
              <img :src="val.pc_img" alt="" class="uci-img">
              <div class="uci-detail">
                <h2 class="ucid-name">{{val.name}}</h2>
                <p class="ucid-des">{{val.description}}</p>
                <p class="ucid-learn" v-if="val.video">学习至{{val.video.course_id}}-{{val.video.section_id}}（{{val.video.video_id}}）{{val.video.video_name}}</p>
                <p class="ucid-learn" v-else>学习至未学习</p>
              </div>
              <button class="btn-com uci-learn" @click="recordLearnVideo(val)">继续学习</button>
            </div>
          </div>
        </div>
        <div v-else>暂无播放记录</div>
      </div>
      <!-- 收藏课程 -->
      <div v-if="selIdxCourse == 2">
        <Row>
          <Col span="24">
            <Menu accordion width="100%" style="background:none;">
              <Submenu :name="index+1" class="myCollpackageMenu" v-for="(val, index) in myCollpackageList" :key="index" style="padding:0px;">
                <template slot="title" style="padding:0px;">
                  <div class="uc-item-coll" @click="getMyCollcourse(val)">
                    <img :src="val.pc_img" alt="" class="uci-img">
                    <div class="uci-detail">
                      <h2 class="ucid-name">{{val.name}}</h2>
                      <p class="ucid-des">{{val.description}}</p>
                      <!-- <p class="ucid-learn" v-if="val.video">学习至{{val.video.course_id}}-{{val.video.section_id}}（{{val.video.video_id}}）{{val.video.video_name}}</p>
                      <p class="ucid-learn" v-else>学习至未学习</p> -->
                    </div>
                  </div>
                </template>
                <div class="error-menu-er" :name="(index+1)+ '-' + (key+1)" v-for="(v, key) in myCollcourseList" :key="key" style="padding: 14px 40px;">
                  <div class="menu-jie-title" style="font-size: 16px;">
                    <div>{{v.name}}</div>
                    <button @click="getKnow(val, v, key)" style="color: #0267FF;">查看</button>
                  </div>
                </div>
              </Submenu>
            </Menu>
          </Col>
        </Row>
        <coll-menu-item :myCollvideoList="myCollvideoList" @collectionLearnVideo="collectionLearnVideo" v-if="visible"></coll-menu-item>
      </div>
    </div>
  </div>
</template>

<script>
import collMenuItem from '../../components/personal/course/collMenuItem'
import { myCourse, watchRecords, myCollpackage, myCollcourse, myCollvideo } from '@/api/personal'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      visible: false,
      txtArr: ['课程', '播放记录', '收藏课程'],
      selIdxCourse: window.sessionStorage.getItem('selIdxCourse') || 0,
      btnSts: {
        1: '成绩统计',
        2: '继续做题',
        3: '查看解析'
      },
      limit: 10,
      page: 1,
      myCourseList: [], // 我的课程
      watchRecordsList: [], // 播放记录
      myCollpackageList: [], // 收藏课程包
      myCollcourseList: [], // 收藏课程
      myCollvideoList: [], // 收藏课程章节
      sessionPlayInfo: {
        package_id: '',
        course_id: '',
        is_zhengke: '',
        userstatus: 1, // 购买1 未购买2
        video_id: ''
      }
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    })
  },
  components: {
    // courseItem,
    collMenuItem
  },
  mounted () {
    this.initRes()
  },
  methods: {
    tabClk (v, index) {
      if (!this.user_id) {

      }
      window.sessionStorage.setItem('selIdxCourse', index)
      this.selIdxCourse = index
      this.initRes()
    },
    initRes () {
      if (parseInt(this.selIdxCourse) === 0) {
        this.getMyCourse()
      }
      if (parseInt(this.selIdxCourse) === 1) {
        this.getWatchRecords()
      }
      if (parseInt(this.selIdxCourse) === 2) {
        this.getMyCollpackage()
      }
    },
    // 我的课程
    getMyCourse () {
      myCourse({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        this.myCourseList = res.data
      })
    },
    // 播放记录
    getWatchRecords () {
      watchRecords({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        this.watchRecordsList = res.data
      })
    },
    // 收藏课程包
    getMyCollpackage () {
      myCollpackage({
        user_id: this.user_id,
        limit: this.limit,
        page: this.page
      }).then(data => {
        const res = data.data
        this.myCollpackageList = res.data
      })
    },
    // 获取收藏课程目录
    getMyCollcourse (val) {
      myCollcourse({
        user_id: this.user_id,
        package_id: val.package_id
      }).then(data => {
        const res = data.data
        this.myCollcourseList = res.data
      })
    },
    // 获取收藏课程目录modal
    getKnow (val, v) {
      this.getMyCollvideo(val)
      this.sessionPlayInfo.is_zhengke = v.is_zhengke
      this.sessionPlayInfo.package_id = val.package_id + ''
      this.sessionPlayInfo.course_id = val.course_id
      this.sessionPlayInfo.section_id = val.section_id
      this.sessionPlayInfo.video_id = val.video_id
      this.sessionPlayInfo.userstatus = val.is_purchase
      this.visible = true
    },
    // 获取收藏课程章节
    getMyCollvideo (val) {
      myCollvideo({
        user_id: this.user_id,
        package_id: val.package_id,
        course_id: val.course_id
      }).then(data => {
        const res = data.data
        this.myCollvideoList = res.data.section
      })
    },
    // 课程去学习
    courseLearnVideo (val) {
      // 如果有看过的记录，继续学习
      if (val.video) {
        let obj = {
          package_id: val.package_id,
          course_id: val.video.course_id,
          section_id: val.video.section_id,
          video_id: val.video.video_id,
          is_zhengke: val.video.is_zhengke, // 是否正课
          userstatus: val.video.userstatus // 是否购买
        }
        this.$router.push({ path: '/class-video', query: obj })
        // let openMenu = (val.video.section_id) + '-' + (val.video.video_id)
        // window.sessionStorage.setItem('openMenu', openMenu)
        window.sessionStorage.setItem('playVideoInfo', JSON.stringify(val))
        return
      }
      // 否则去课程列表页面
      this.$router.push({ path: '/class-detail',
        query: {
          package_id: val.package_id + ''
        }
      })
    },
    // 播放记录去学习
    recordLearnVideo (val) {
      let obj = {
        package_id: val.package_id + '',
        course_id: val.video.course_id,
        section_id: val.video.section_id,
        video_id: val.video.video_id,
        is_zhengke: val.video.is_zhengke, // 是否正课
        userstatus: val.video.userstatus // 是否购买
      }
      this.$router.push({ path: '/class-video', query: obj })
      // let openMenu = (val.video.section_id) + '-' + (val.video.video_id)
      // window.sessionStorage.setItem('openMenu', openMenu)
      window.sessionStorage.setItem('playVideoInfo', JSON.stringify(val))
    },
    // 收藏记录去学习
    collectionLearnVideo (item, val) {
      let playVideoObj = Object.assign({}, this.sessionPlayInfo, val)
      this.$router.push({ path: '/class-video', query: this.sessionPlayInfo })
      // let openMenu = (item.section_id) + '-' + (val.video_id)
      // window.sessionStorage.setItem('openMenu', openMenu)
      window.sessionStorage.setItem('playVideoInfo', JSON.stringify(playVideoObj))
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .uc-item{
    margin-bottom: 20px;
    padding-right: 20px;
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
  }
  .ivu-menu-opened{
    .uc-item-coll{
      img{
        border-radius: 8px 0 0 0;
      }
    }
  }
  .uc-item,.uc-item-coll{
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 8px;
    .uci-img{
      width: 198px;
      height: 109px;
      border-radius: 8px 0 0 8px;
    }
    .uci-detail{
      flex: 1;
      padding: 0 20px;
      h2{
        font-size: 18px;
        line-height: 26px;
        color: $col333;
      }
      .ucid-des{
        color: $col999;
        line-height: 20px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
        width: 95%;
      }
      .ucid-learn{
        color: $blueColor;
        margin-top: 13px;
      }
    }
    .btn-com{
      background: #1874FD;
      color: $colfff;
      font-size: 16px;
    }
  }
  // 观看记录
  .ucr-item{
    &:after{
      position: absolute;
      content: "";
      left: 0;
      top: 18px;
      height: 100%;
      width: 1px;
      background: $blueColor;
    }
    .uc-item{
      margin-left: 20px;
    }
    .time{
      font-size: 16px;
      padding: 10px 0;
      .dot{
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background: $blueColor;
        display: inline-block;
        margin-left: -4px;
        margin-right: 20px;
      }
    }
  }
  // iview
  .myCollpackageMenu{
    margin-bottom: 20px;
    border-radius: 8px;
    background: #ffffff;
  }
</style>
