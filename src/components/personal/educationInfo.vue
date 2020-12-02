<template>
  <div class="u-course-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <!-- 课程 -->
      <div class="u-course-my" v-if="selIdx == 0">
        <div class="u-course-buy" v-if="myCourseList.length">
          <div class="uc-pakeage-course-list" v-for="(item, index) in myCourseList" :key="index">
            <div class="uc-item" style="cursor: pointer;" :class="{'uc-item-package': item.flag}" @click="openShow(item, index)">
              <img :src="item.pc_img" alt="" class="uci-img">
              <div class="uci-detail">
                <h2 class="ucid-name">{{item.name}}<span>CPE学分：{{item.cpe_integral}}分</span></h2>
                <p class="ucid-des">{{item.description}}</p>
              </div>
              <div class="open-txt">
                {{item.flag ? '收起':'查看课程'}}
                <Icon type="md-arrow-dropdown" style="font-size: 20px;margin-top: -3px;" v-if="!item.flag"/>
                <Icon type="md-arrow-dropup" style="font-size: 20px;margin-top: -3px;" v-if="item.flag"/>
              </div>
            </div>
            <ul v-if="item.flag && item.cpe_course.length">
              <li class="uc-item uc-item-course" v-for="(val, key) in item.cpe_course" :key="key">
                <img :src="val.pc_img" alt="" class="uci-img">
                <div class="uci-detail">
                  <h2 class="ucid-name">{{val.course_name}}<span>CPE学分：{{val.cpe_integral}}分</span></h2>
                  <p class="ucid-des">{{val.description}}</p>
                  <p class="ucid-learn" v-if="val.video">学习至{{val.video.video_name}}</p>
                  <p class="ucid-learn" v-else>学习至未学习</p>
                </div>
                <button class="btn-com" @click="courseLearnVideo(item, val, 1)">去学习</button>
              </li>
            </ul>
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
            <!-- <p class="time"><i class="dot"></i>{{item.create_time || '空'}}</p> -->
            <div class="uc-item">
              <img :src="item.app_img" alt="" class="uci-img">
              <div class="uci-detail">
                <h2 class="ucid-name">{{item.name}}</h2>
                <p class="ucid-learn" v-if="item.video_name">学习至{{item.video_name}}</p>
                <p class="ucid-learn" v-else>学习至未学习</p>
                <p class="cpe-status" :class="{'cpe-finish': item.complete == 1}">{{item.complete == 1 ? '已完成' : '未完成'}}</p>
              </div>
              <button class="btn-com uci-learn" @click="courseLearnVideo(item, item, 2)">开始学习</button>
            </div>
          </div>
          <div style="padding: 20px; text-align: center;">
            <Page
            :total="total"
            @on-change="onChange"
            :current="page"
            :page-size="limit"
            size="small"
            />
          </div>
        </div>
        <div class="no-data no-data-course" v-if="noDataFlag">
          暂无课程
        </div>
      </div>
      <div class="u-course-my" v-if="selIdx == 2">
        <education-report :adClass="adClass"></education-report>
      </div>
      <!-- CPE学分详情 -->
      <div class="u-course-my" v-if="selIdx == 3">
        <div class="u-course-buy" v-if="eduDetailsList.length">
          <div class="uc-pakeage-course-list" v-for="(item, index) in eduDetailsList" :key="index">
            <div class="uc-item" style="cursor: pointer;" :class="{'uc-item-package': item.flag}" @click="openShow(item, index)">
              <img :src="item.pc_img" alt="" class="uci-img">
              <div class="uci-detail">
                <!-- <h2 class="ucid-name">{{item.name}}<span>CPE学分：{{item.cpe_integral}}分</span></h2> -->
                <h2 class="ucid-name">{{item.name}}</h2>
                <p class="ucid-des">{{item.description}}</p>
              </div>
              <!-- 面授type: 2 -->
              <div v-if="item.type == 2" class="open-txt">
                查看课程<Icon type="md-arrow-dropdown" style="font-size: 20px;margin-top: -3px;"/>
              </div>
              <!-- 线上type: 1 -->
              <div class="open-txt" v-if="item.type == 1">
                {{item.flag ? '收起':'查看课程'}}
                <Icon type="md-arrow-dropdown" style="font-size: 20px;margin-top: -3px;" v-if="!item.flag"/>
                <Icon type="md-arrow-dropup" style="font-size: 20px;margin-top: -3px;" v-if="item.flag"/>
              </div>
            </div>
            <ul v-if="item.flag && item.course.length">
              <li class="uc-item uc-item-course" v-for="(val, key) in item.course" :key="key">
                <img :src="val.pc_img" alt="" class="uci-img">
                <div class="uci-detail">
                  <!-- <h2 class="ucid-name">{{val.name}}<span>CPE学分：{{val.cpe_integral}}分</span></h2> -->
                  <h2 class="ucid-name">{{val.name}}</h2>
                  <p class="ucid-des">{{val.description}}</p>
                  <!-- <p class="ucid-learn" v-if="val.video">学习至{{val.video.video_name}}</p>
                  <p class="ucid-learn" v-else>学习至未学习</p> -->
                </div>
                <button class="btn-com" @click="viewCpeList(item, val)">查看</button>
              </li>
            </ul>
          </div>
        </div>
        <div class="no-data no-data-course" v-if="noDataFlag">
          暂无课程
        </div>
        <div class="coll-section-wrap" v-if="visible">
          <!-- 知识点 -->
          <Modal v-model="visible"
            :width="795"
            footer-hide
            title="CPE学分章节"
            class="practiceModal">
            <div class="height-com">
              <ul class="cpe-details-list">
                <li class="cpe-tit">
                  <span>课程名称</span>
                  <span>学分</span>
                  <span>完成时间</span>
                </li>
              </ul>
              <Menu accordion width="100%" v-if="type == 1">
                <Submenu :name="index+1" v-for="(item, index) in myCpevideoList" :key="index">
                  <template slot="title">
                    <div class="menu-section-title">
                      {{item.name}}
                    </div>
                  </template>
                  <ul class="cpe-details-list">
                    <li class="cpe-item" v-for="(val, key) in item.video" :key="key">
                      <span>{{val.video_name}}</span>
                      <span>{{val.cpe_integral}}</span>
                      <span>{{val.create_time}}</span>
                    </li>
                  </ul>
                </Submenu>
              </Menu>
              <ul class="cpe-details-list" v-if="type == 2">
                <li class="cpe-item">
                  <span>{{myCpevideoObj.name}}</span>
                  <span>{{myCpevideoObj.cpe_integral}}</span>
                  <span>{{myCpevideoObj.create_time}}</span>
                </li>
              </ul>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { myCPEcourse, watchRecords, eduDetails } from '@/api/education'
import EducationReport from '../../views/Education/EducationReport'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      visible: false,
      // txtArr: ['课程', '播放记录', 'CPE学分报告', 'CPE学分详情'],
      txtArr: ['课程', '播放记录', 'CPE学分报告'],
      selIdx: this.$route.query.selIdx || 0,
      limit: 10,
      page: 1,
      total: 1,
      myCourseList: [], // 我的课程
      watchRecordsList: [], // 播放记录
      eduDetailsList: [], // CPE学分详情列表
      myCpevideoList: [], // cpe积分详情
      myCpevideoObj: {}, // cpe积分详情
      type: 1, //线上，面授
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
      this.page = 1
      if (this.selIdx == 0) {
        this.getMyCourse()
      }
      if (this.selIdx == 1) {
        this.getWatchRecords()
      }
      if (this.selIdx == 3) {
        this.getCpeDetail()
      }
    },
    // 展开收起
    openShow (item, index) {
      console.log(item);
      this.type = item.type
      if (item.type == 2) {
        this.myCpevideoObj = item
        this.visible = true
        return
      }
      if (this.selIdx == 0) {
        this.myCourseList[index].flag = !item.flag
      }
      if (this.selIdx == 3) {
        this.eduDetailsList[index].flag = !item.flag
      }
      this.$forceUpdate()
    },
    // 我的课程
    getMyCourse () {
      this.showLoading(true)
      myCPEcourse({
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.myCourseList = res.data
          if (this.myCourseList && this.myCourseList.length) {
            this.myCourseList.forEach(v => {
              v.flag = false
            })
          }
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
      this.showLoading(true)
      watchRecords({
        user_id: this.user_id,
        page: this.page,
        limit: this.limit
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.watchRecordsList = res.data.data
          this.total = res.data.total
          if (this.watchRecordsList.length === 0) {
            this.noDataFlag = true
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 分页
    onChange (val) {
      this.page = val
      this.getWatchRecords()
      window.scrollTo(0, 0)
    },
    // 课程去学习 播放记录去学习
    async courseLearnVideo (item, val, type) {
      await this.getUserInfo()
      if (type === 1) {
        window.sessionStorage.setItem('userstatus', 1) // 我的课程一定是已购买
        // 如果有看过的记录，继续学习
        if (val.video) {
          let obj = {
            type_id: item.type_id,
            package_id: item.package_id,
            course_id: val.video.course_id,
            section_id: val.video.section_id,
            video_id: val.video.video_id
          }
          this.$router.push({ path: '/education-video', query: obj })
          return
        }
        // 否则去课程列表页面
        this.$router.push({ path: '/education-video',
          query: {
            package_id: item.package_id,
            type_id: item.type_id,
            course_id: val.course_id
          }
        })
      } else {
        if (item.is_purchase && item.is_purchase == 2) {
          this.$Message.error('请购买课程')
          return
        }
        window.sessionStorage.setItem('userstatus', item.is_purchase) // 播放记录是否购买
        let obj = {
          type_id: item.type_id,
          package_id: item.package_id,
          course_id: item.course_id,
          section_id: item.section_id,
          video_id: item.video_id
        }
        this.$router.push({ path: '/education-video', query: obj })
      }
      // 如果有看过的记录，继续学习
      // if (val.video) {
      //   let obj = {
      //     type_id: item.type_id,
      //     package_id: item.package_id,
      //     course_id: val.video.course_id || item.course_id,
      //     section_id: val.video.section_id || item.section_id,
      //     video_id: val.video.video_id || item.video_id
      //   }
      //   this.$router.push({ path: '/education-video', query: obj })
      //   return
      // }
      // 否则去课程列表页面
      // this.$router.push({ path: '/education-video',
      //   query: {
      //     package_id: item.package_id,
      //     type_id: item.type_id,
      //     course_id: val.course_id
      //   }
      // })      
    },
    // CPE学分详情
    getCpeDetail () {
      this.noDataFlag = false
      this.showLoading(true)
      eduDetails({
        user_id: this.user_id,
        course_id: this.course_id,
        limit: this.limit,
        page: this.page
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.eduDetailsList = res.data
          if (this.eduDetailsList && this.eduDetailsList.length) {
            this.eduDetailsList.forEach(v => {
              v.flag = false
            })
          }
          if (this.eduDetailsList.length === 0) {
            this.noDataFlag = true
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    viewCpeList (item) {
      this.myCpevideoList = item.course
      this.visible = true
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .uc-pakeage-course-list{
    margin-bottom: 10px;
    box-shadow:0px 2px 20px 0px rgba(140,196,255,0.3);
  }
  .uc-item{
    margin-bottom: 10px;
    padding-right: 21px;
    // box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    .u-course-my &{
      margin-bottom: 0;
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
    &.uc-item-package{
      border-radius: 8px 8px 0 0;
      .uci-img{
        border-radius: 8px 0 0 0px;
      }
    }
    &.uc-item-course{
      padding: 10px 21px 9px 51px;
      border-radius: 0;
      margin-bottom: 0;
      .uci-img{
        width: 147px;
        height: 80.7px;
        border-radius: 0
      }
      .uci-detail{
        .ucid-name{
          font-size: 14px;
          line-height: 20px;
        }
        .ucid-des,.ucid-learn{
          font-size: 12px;
          line-height: 17px;
        }
      }
    }
    .uci-img{
      width: 198px;
      height: 109px;
      border-radius: 8px 0 0 8px;
    }
    .uci-detail{
      flex: 1;
      padding: 0 20px;
      .ucid-name{
        font-size: 16px;
        line-height: 22px;
        color: $col333;
        span{
          font-size: 14px;
          margin-left: 16px;
          color: $blueColor;
        }
      }
      .ucid-des{
        color: $col999;
        line-height: 20px;
        margin-top: 3px;
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
    .btn-com{
      width: 64px;
      height: 28px;
      background: #1874FD;
      color: $colfff;
      font-size: 14px;
    }
    .uci-learn{
      width: 97px;
    }
  }
  .uc-item-course{
    &:nth-child(odd){
      background: #F3F6FF;
    }
  }
  .open-txt{
    cursor: pointer;
    color: #0267FF;
  }
  // 观看记录
  .ucr-item{
    .uc-item{
      margin: 10px 0;
    }
    .time{
      font-size: 16px;
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
  // cpe积分详情
  .myCollpackageMenu{
    margin-bottom: 10px;
  }
  .cpe-details-list{
    li{
      &.cpe-tit{
        background: #f3f6ff;
        color: #666;
        font-size: 18px;
        padding: 12px 30px;
        margin-bottom: 10px;
      }
      &.cpe-item{
        padding: 14px 30px 14px 60px;
        color: #666666;
        font-size: 16px;
        &:nth-child(2n){
          background: #f3f6ff;
        }
      }
      span{
        display: inline-block;
        &:nth-child(1){
          width: 50%;
        }
        &:nth-child(2){
          width: 20%;
        }
        &:nth-child(3){
          width: 30%;
          text-align: right;
        }
      }
    }
  }
</style>
