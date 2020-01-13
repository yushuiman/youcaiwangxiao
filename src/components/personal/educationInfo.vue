<template>
  <div class="u-course-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <!-- 课程 -->
      <div class="u-course-my" v-if="selIdx == 0">
        <div class="u-course-buy" v-if="myCourseList.length">
          <div class="uc-item" v-for="(val, key) in myCourseList" :key="key">
            <img :src="val.pc_img" alt="" class="uci-img">
            <div class="uci-detail">
              <h2 class="ucid-name">{{val.name}}<span>CPE积分：{{val.cpe_integral}}分</span></h2>
              <p class="ucid-des">{{val.description}}</p>
              <p class="ucid-learn" v-if="val.video">学习至{{val.video.video_name}}</p>
              <p class="ucid-learn" v-else>学习至未学习</p>
            </div>
            <button class="btn-com" @click="courseLearnVideo(val, 1)">去学习</button>
          </div>
        </div>
        <div class="no-data no-data-course" v-if="noDataFlag">
          暂无课程
        </div>
      </div>
      <!-- 播放记录 -->
      <div class="u-course-my" v-if="selIdx == 1">
        <div class="u-course-record" v-if="watchRecordsList && watchRecordsList.length">
          <div class="ucr-item" v-for="(item, index) in watchRecordsList" :key="index">
            <p class="time"><i class="dot"></i>{{item.time}}</p>
            <div class="uc-item" v-for="(val, key) in item.list" :key="key">
              <img :src="val.pc_img" alt="" class="uci-img">
              <div class="uci-detail">
                <h2 class="ucid-name">{{val.name}}</h2>
                <p class="ucid-des">{{val.description}}</p>
                <p class="ucid-learn" v-if="val.video">学习至{{val.video.video_name}}</p>
                <p class="ucid-learn" v-else>学习至未学习</p>
                <p class="cpe-status" :class="{'cpe-finish': val.complete == 1}">{{val.complete == 1 ? '已完成' : '未完成'}}</p>
              </div>
              <button class="btn-com uci-learn" @click="courseLearnVideo(val, 2)">开始学习</button>
            </div>
          </div>
        </div>
        <div class="no-data no-data-course" v-if="noDataFlag">
          暂无课程
        </div>
      </div>
      <div class="u-course-my" v-if="selIdx == 2">
        <education-report :adClass="adClass"></education-report>
      </div>
    </div>
  </div>
</template>

<script>
import { myCPEcourse, watchRecords } from '@/api/education'
import EducationReport from '../../views/Education/EducationReport'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      visible: false,
      txtArr: ['课程', '播放记录', 'CPE学分报告'],
      selIdx: this.$route.query.selIdx || 0,
      limit: 10,
      page: 1,
      myCourseList: [], // 我的课程
      watchRecordsList: [], // 播放记录
      myCollpackageList: [], // 收藏课程包
      myCollcourseList: [], // 收藏课程
      myCollvideoList: [], // 收藏课程章节
      noDataFlag: false,
      sessionPlayInfo: {
        package_id: 0,
        course_id: 0,
        video_id: 0
      },
      is_purchase: 0, // 是否购买
      adClass: 'user'
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.initRes()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.initRes()
      })
    }
  },
  components: {
    EducationReport
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    tabClk (v, index) {
      this.selIdx = index
      this.$router.replace({ path: '/personal',
        query: {
          ...this.$route.query,
          selIdx: index
        }
      })
      this.initRes()
    },
    initRes () {
      this.noDataFlag = false
      if (parseInt(this.selIdx) === 0) {
        this.getMyCourse()
      }
      if (parseInt(this.selIdx) === 1) {
        this.getWatchRecords()
      }
      if (parseInt(this.selIdx) === 2) {
        // this.getWatchRecords()
      }
    },
    // 我的课程
    getMyCourse () {
      myCPEcourse({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.myCourseList = res.data
          if (this.myCourseList.length === 0) {
            this.noDataFlag = true
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 播放记录
    getWatchRecords () {
      watchRecords({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.watchRecordsList = res.data
          if (this.watchRecordsList.length === 0) {
            this.noDataFlag = true
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 课程去学习 播放记录去学习
    async courseLearnVideo (val, type) {
      await this.getUserInfo()
      if (val.is_purchase === 2) {
        this.$Message.error('请购买课程')
        return
      }
      // 如果有看过的记录，继续学习
      if (val.video) {
        let obj = {
          type_id: val.type_id,
          package_id: val.package_id,
          course_id: val.video.course_id,
          section_id: val.video.section_id,
          video_id: val.video.video_id
        }
        this.$router.push({ path: '/education-video', query: obj })
        if (type === 1) {
          window.sessionStorage.setItem('userstatus', 1) // 我的课程一定是已购买
        } else {
          window.sessionStorage.setItem('userstatus', val.is_purchase) // 播放记录是否购买
        }
        return
      }
      // 否则去课程列表页面
      this.$router.push({ path: '/education-video',
        query: {
          package_id: val.package_id,
          type_id: val.type_id
        }
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
    .btn-com{
      background: #1874FD;
      color: $colfff;
      font-size: 16px;
    }
    .uci-learn{
      width: 97px;
    }
  }
  .uci-detail{
    flex: 1;
    padding: 0 20px;
    .ucid-name{
      font-size: 18px;
      line-height: 26px;
      color: $col333;
      span{
        font-size: 16px;
        margin-left: 16px;
        color: $blueColor;
      }
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
      line-height: 20px;
      color: $blueColor;
      margin-top: 10px;
    }
    .cpe-status{
      height: 20px;
      line-height: 20px;
      margin-top: 8px;
      padding-left: 20px;
      color: #E84342;
      background-image: url('../../assets/images/user/cpe-no.png');
      background-position: left center;
      background-repeat: no-repeat;
      background-size: 15px 15px;
      &.cpe-finish{
        color: $blueColor;
        background-image: url('../../assets/images/user/cpe-finish.png');
      }
    }
    .u-course-record &{
      .ucid-learn{
        color: $col666;
        margin-top: 5px;
      }
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
</style>
