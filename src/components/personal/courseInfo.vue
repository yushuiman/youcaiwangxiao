<template>
  <div class="u-course-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdxCourse == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <!-- <course-item :myCourseList="myCourseList" v-if="selIdxCourse == 0"></course-item> -->
    <!-- <course-item :myCourseList="watchRecordsList" v-if="watchRecordsList && watchRecordsList.length"></course-item> -->
    <div class="all-main">
      <!-- 课程 -->
      <div class="u-course-my" v-if="selIdxCourse == 0">
        <div class="uc-item" v-for="(val, key) in myCourseList" :key="key">
          <img :src="val.pc_img" alt="" class="uci-img">
          <div class="uci-detail">
            <h2 class="ucid-name">{{val.name}}</h2>
            <p class="ucid-des">{{val.description}}</p>
            <p class="ucid-learn" v-if="val.video">学习至{{val.video.video_name}}</p>
          </div>
          <button class="btn-com uci-learn">去学习</button>
        </div>
      </div>
      <!-- 播放记录 -->
      <div v-if="selIdxCourse == 1">
        <div class="u-course-record" v-if="watchRecordsList && watchRecordsList.length">
          <div class="uc-item-addtime" v-for="(item, index) in watchRecordsList" :key="index">
            <p class="time">{{item.time}}</p>
            <div class="uc-item" v-for="(val, key) in item.list" :key="key">
              <img :src="val.pc_img" alt="" class="uci-img">
              <div class="uci-detail">
                <h2 class="ucid-name">{{val.name}}</h2>
                <p class="ucid-des">{{val.description}}</p>
                <p class="ucid-learn" v-if="val.video">学习至{{val.video.course_id}}-{{val.video.section_id}}（{{val.video.video_id}}）{{val.video.video_name}}</p>
                <p class="ucid-learn" v-else>学习至未学习</p>
              </div>
              <button class="btn-com uci-learn">去学习</button>
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
                <MenuItem :name="(index+1)+ '-' + (key+1)" v-for="(v, key) in myCollcourseList" :key="key" style="padding-left: 40px;padding-right: 40px;">
                  <div class="menu-jie-title" style="font-size: 16px;">
                    {{v.name}}
                    <button @click="getKnow(val, v, key)" style="color: #0267FF;">查看</button>
                  </div>
                </MenuItem>
              </Submenu>
            </Menu>
          </Col>
        </Row>
      </div>
      <coll-menu-item :myCollvideoList="myCollvideoList" v-if="visible"></coll-menu-item>
    </div>
  </div>
</template>

<script>
// import courseItem from '../../components/personal/course/courseItem'
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
      myCollvideoList: [] // 收藏课程章节
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
    getKnow (val) {
      this.getMyCollvideo(val)
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
    &:hover{
      background: #F3F6FF;
    }
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
  .uc-item-addtime{
    .time{
      font-size: 16px;
      padding: 10px 3px;
    }
  }
  // iview
  .myCollpackageMenu{
    margin-bottom: 20px;
    border-radius: 8px;
    background: #ffffff;
  }
</style>
