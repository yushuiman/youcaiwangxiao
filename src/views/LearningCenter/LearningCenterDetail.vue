<template>
  <div class="learn-center-wrap">
    <!-- 已登录 addlearn == 1有学习计划-->
    <div class="w-wrap" v-if="addlearn == 1">
      <div class="learn-detail-wrap">
        <!-- 学习详情 top -->
        <div class="learn-detail-top">
          <div class="learn-course-info">
            <div class="select-box">
              <select class="com-sel" v-model="course_id" @change="getCourseIdSel($event)">
                <option class="com-opt" :value="v.course_id" v-for="(v, index) in learnList" :key="index">{{v.plan_name}}</option>
              </select>
              <span class="arow"><Icon type="md-arrow-dropdown" style="font-size: 30px;margin-top: -4px;color: #666666;"/></span>
            </div>
            <div class="ewm-box">
              <i class="ewm-icon"></i>
            </div>
            <span class="learn-status">学习中</span>
            <span class="surplus-day"><i></i>离{{currenLearnInfo.plan_name}}考试还有{{currenLearnInfo.number}}天</span>
          </div>
          <div class="outplan" @click="outLearnPlan"><i></i>退出计划</div>
        </div>
        <div class="learn-detail-bottom">
          <div class="learn-day">
            <i-circle
              :size="100"
              :trail-width="8"
              :stroke-width="8"
              :percent="currenLearnInfo.percent"
              stroke-color="#FC7873">
              <div class="circle-box">{{currenLearnInfo.schedule}}天<span>出勤</span></div>
            </i-circle>
          </div>
          <div class="cur-learning">
            <ul class="learning-ul">
              <li class="learnday">
                <span>进行</span>
                <p><em>{{currenLearnInfo.join_days}}</em>/{{currenLearnInfo.plan_days}}天</p>
              </li>
              <li class="learnvalid">
                <span>学习有效期</span>
                <p>{{currenLearnInfo.plan_days}}天</p>
              </li>
              <li class="learnvideo">
                <span>当前学习任务</span>
                <p>{{currenLearnInfo.plan_name}}</p>
              </li>
              <li class="learnvideo">
                <button class="btn-com goon-learn" @click="goLearnVideo">继续学习</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 学习日期 ，答疑 ，公告，动态... bottom-->
      <div class="month-answer-wrap">
        <div class="plan-learn-tab">
          <span :class="{ 'curren': tabIdx == 0 }" @click="planChangeTab(0)">学习路径</span>
          <span :class="{ 'curren': tabIdx == 1 }" @click="planChangeTab(1)">我的答疑</span>
        </div>
        <div class="tab-main clearfix">
          <div class="month-answer-left fl">
            <div class="month-box" v-if="tabIdx == 0">
              <Menu width="100%">
                <Submenu :name="index+1" v-for="(v, index) in monthList" :key="index">
                  <template slot="title">
                    <div class="month-title" @click="getEveryday(v)">
                      <Icon type="ios-list" class="memu-list-icon"/>
                      <span>{{parseInt(v)}}月计划</span>
                    </div>
                  </template>
                  <ul class="days-list">
                    <!-- days-item-blue days-item-orange days-item-gray-->
                    <!-- 今天课程已结束哦～ 继续学习吧～ 还没有开课哦～ 今天是周末哦～ -->
                    <li class="days-item days-item-gray" :class="{'days-item-orange': v.sameday == 1}" v-for="(v, index) in everydayList" :key="index">
                      <i class="status-icon"></i>
                      <p>{{v.date}}</p>
                      <div class="tips-item" v-if="v.sameday == 1">
                        继续学习吧～
                      </div>
                      <div class="tips-item" v-if="v.sameday == 12">
                        还没有开课哦～
                      </div>
                    </li>
                  </ul>
              </Submenu>
            </Menu>
            </div>
            <div class="answer-box" v-if="tabIdx == 1">
              答疑
            </div>
          </div>
          <div class="about-learncenter-right fr">
            <!-- 公告 学员 学员动态 -->
            <learn-notice :news="news"></learn-notice>
            <learn-student></learn-student>
            <student-dynamic></student-dynamic>
          </div>
        </div>
      </div>
    </div>
    <!-- 已登录 addlearn == 2无学习计划-->
    <div class="lc-login-h" v-if="addlearn == 2">
      <!-- 左上角图片 -->
      <img class="lc-left-top-img" src="../../assets/images/learncenter/left-top-img.png" alt="">
      <div class="lc-login-wrap">
        <div class="lc-login-left">
          <div class="yc-detail">
            <h1 class="yc-welcome">您还没有制定<span>优财CMA课程学习计划</span></h1>
            <div class="yc-logo">
              <img src="../../assets/images/learncenter/logo.png" alt="">
              <em></em>
              <span>一个与时俱进的CMA学习平台</span>
            </div>
            <p class="yc-instr">提供专业与时俱进的CMA智能学习平台，培养新一代财务管理者。具有独家案例式教学模式的特色。</p>
          </div>
          <div class="loginSign-wrap">
            <div class="info-bottom">
              <button class="btn-com" @click="planLearn()">立即制定</button>
            </div>
          </div>
        </div>
        <img class="lc-login-right" src="../../assets/images/learncenter/zkz-img.png" alt="">
      </div>
    </div>
    <!-- 制定学习计划 自定义modal样式 :styles=styles -->
    <Modal v-model="visible"
      :width="795"
      footer-hide
      :title=titTxt[addLearnIdx]
      class="plan-modal">
      <div class="height-com" v-if="addLearnIdx == 0">
        <div class="com-bg">
          请选择需要学习的课程
        </div>
        <ul class="know-list">
          <li v-for="(val, key) in courseListLearn" :key="key" @click="nextPage(1, val)">
            <span v-if="addlearn === 1">{{val.course_name}}<i v-if="val.state == 1">已参加</i></span>
            <span v-if="addlearn === 2">{{val.plan_name}}</span>
            <Icon type="ios-arrow-forward" style="color: #999999;"/>
          </li>
        </ul>
        <div class="dot"><span class="curren"></span><span></span><span></span></div>
      </div>
      <div class="height-com" v-if="addLearnIdx == 1">
        <div class="com-bg">
          <span>请选择考试时间</span>
          <a @click="nextPage(0)">返回上一步</a>
        </div>
        <ul class="know-list">
          <li v-for="(val, key) in timeListLearn" :key="key" @click="nextPage(2, val)">
            <span>{{val.test_time}}</span>
            <Icon type="ios-arrow-forward" style="color: #999999;"/>
          </li>
        </ul>
        <div class="dot"><span></span><span class="curren"></span><span></span></div>
      </div>
      <div class="height-com" style="height: 575px;" v-if="addLearnIdx == 2">
        <div class="star-learning-wrap">
          <div class="star-learning-left">
            <h1 class="plan-finish">自定义学习计划完成</h1>
            <p class="plan-next">接下来，希望通过本次计划顺利通过考试。成为会管理、懂业务、能决策的管理会计！</p>
            <div class="loginSign-wrap">
              <div class="info-bottom">
                <button class="btn-com" @click="getAddStudy()">开始学习之旅</button>
              </div>
            </div>
          </div>
          <img class="star-learning-right" src="../../assets/images/learncenter/zkz-img2.png" alt="">
        </div>
        <div class="dot"><span></span><span></span><span class="curren"></span></div>
      </div>
    </Modal>
    <!-- 您有缺勤的课程 -->
    <Modal v-model="visible2"
      :width="291"
      :closable=false
      :styles=styles
      footer-hide
      class="learn-modal-wrap">
      <div class="no-finish-wrap">
        <i class="nf-icon"></i>
        <p class="nf-txt">您有缺勤的课程</p>
        <div class="btn-box-learn">
          <button @click="closeModal(1)">不看了</button>
          <button @click="seeNofinishList">去看看</button>
        </div>
      </div>
    </Modal>
    <!-- 缺勤课程列表 -->
    <Modal v-model="visible3"
      :width="795"
      footer-hide
      class="learn-modal-wrap">
      <div class="no-finish-list-wrap">
        <div class="select-box">
          <select class="com-sel" v-model="package_id" @change="getPackageIdSel($event)">
            <option class="com-opt" :value="v.package_id" v-for="(v, index) in noFinishPlanList" :key="index">{{v.plan_name}}</option>
          </select>
          <span class="arow"><Icon type="md-arrow-dropdown" style="font-size: 30px;margin-top: -4px;color: #666666;"/></span>
        </div>
        <div class="com-bg">
          您以下课程未学习，请自行补全学习进度
        </div>
        <ul class="know-list">
          <li v-for="(v, key) in currenNoFinishPlan.video" :key="key" class="nofinish">
            <span>{{v.video_name}}</span>
            <button class="btn-com">去学习</button>
          </li>
        </ul>
      </div>
    </Modal>
    <!-- 退出学习计划 -->
    <Modal v-model="visible4"
      :width="291"
      :closable=false
      :styles=styles
      footer-hide
      class="learn-modal-wrap">
      <div class="outplan-wrap">
        <i class="op-icon"></i>
        <p class="op-txt">退出学习计划</p>
        <p class="op-txt-red">退出计划后，学习记录将无法找回</p>
        <div class="btn-box-learn">
          <button @click="closeModal(2)">再想想</button>
          <button @click="sureOutplan">退出</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { learnIndex, courseList, testTime, addStudy, everyday, outPlan, hangAir } from '@/api/learncenter'
import learnNotice from '../../components/learning/learnNotice'
import learnStudent from '../../components/learning/learnStudent'
import studentDynamic from '../../components/learning/studentDynamic'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      visible: false,
      addLearnIdx: 0, // 添加学习计划div 1选择课程 2考试时间时间 3计划完成
      styles: {
        top: '50%',
        marginTop: '-100px'
      },
      titTxt: {
        0: '添加学习计划',
        1: '添加学习计划',
        2: ''
      },
      course_id: 0, // select默认选择
      package_id: 0, // select默认选择
      addlearn: 0, // 是否有学习计划
      // state: 0, // 是否有未完成的计划,modal visible2显示
      user: {}, // 用户信息，打卡天数
      learnList: [], // 学习计划详情
      currenLearnInfo: [], // 当前学习计划详情
      news: [], // 学习公告
      courseListLearn: [], // 课程列表
      timeListLearn: [], // 考试时间列表
      planChooseInfo: {}, // 制定计划详情（课程，时间，是否为0元体验）
      tabIdx: 0, // 月份 答疑tab
      monthList: ['1月', '2月'], // 计划月份
      everydayList: [], // 每月对应的天数
      visible2: false, // 缺勤
      visible3: false, // 缺勤详情list
      visible4: false, // 退出学习计划
      noFinishPlanList: [
        {
          'package_id': '课程包id',
          'plan_id': '计划id',
          'plan_name': '计划名字',
          'video': [
            {// 视频
              'id': '视频id',
              'video_name': '视频名字'
            }]
        },
        {
          'package_id': '课程包id',
          'plan_id': '计划id',
          'plan_name': '计划名字',
          'video': [
            {// 视频
              'id': '视频id',
              'video_name': '视频名字'
            }]
        }
      ], // 未完成计划列表
      currenNoFinishPlan: {} // 当前未完成计划
      // is_exper: 0, // 计划是否是0元体验
      // planCourseId: 0, // 计划课程id
      // planTesttime: '' // 计划考试时间
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    })
  },
  components: {
    learnNotice,
    learnStudent,
    studentDynamic
  },
  mounted () {
    this.getLearnIndex()
  },
  methods: {
    // 制定学习计划
    planLearn () {
      this.visible = true
      this.addLearnIdx = 0
      if (this.addlearn === 2) { // 没有学习计划 选择课程列表
        return
      }
      this.getCourseList() // 有学习计划 选择课程列表
    },
    nextPage (index, val) {
      this.addLearnIdx = index
      // this.planChooseInfo = val //暂时用不到 多余
      if (index === 1) {
        if (val.state === 1) { // 已参加计划
          return
        }
        this.planChooseInfo.course_id = val.course_id // 选择课程id
        this.planChooseInfo.is_exper = val.is_exper // 是否0元体验
        this.getTestTime() // 选择考试时间
      }
      if (index === 2) {
        this.planChooseInfo.test_time = val.test_time // 选择考试time
      }
    },
    // 学习计划首页详情
    getLearnIndex () {
      learnIndex({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          let { addlearn, state, user, plan, learnList, news } = res.data
          this.addlearn = addlearn
          this.user = user
          this.learnList = learnList
          this.news = news
          if (state === 1) { // state==1有未读2已读
            this.visible2 = true
          }
          if (addlearn === 2) {
            this.courseListLearn = plan // 没有学习计划 课程列表
          }
          if (learnList && learnList.length) {
            this.course_id = this.learnList[0].course_id // 初始化学习计划详情course_id
            this.currenLearnInfo = this.learnList[0] // 初始化学习计划详情
            this.currenLearnInfo.percent = (this.currenLearnInfo.schedule / this.currenLearnInfo.plan_days) * 100 // 初始化学习计划圆环进度
            this.monthList = learnList[0].month // 获取当前课程对应的计划日期
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 学习计划课程列表list
    getCourseList () {
      courseList({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.courseListLearn = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 学习计划考试时间list
    getTestTime () {
      testTime({
        user_id: this.user_id,
        course_id: this.planChooseInfo.course_id,
        types: this.planChooseInfo.is_exper // 1:0元体验 2:购买课程
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.timeListLearn = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 添加学习计划
    getAddStudy () {
      addStudy({
        user_id: this.user_id,
        course_id: this.planChooseInfo.course_id,
        test_time: this.planChooseInfo.test_time,
        types: this.planChooseInfo.is_exper // 1为0元体验 2为购买课程
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.visible = false
          this.getLearnIndex() // 添加学习计划后更新首页信息
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 未完成计划列表
    getHangAir () {
      hangAir({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.noFinishPlanList = res.data
          this.package_id = this.noFinishPlanList[0].package_id
          this.currenNoFinishPlan = this.noFinishPlanList[0]
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 切换课程学习计划
    getCourseIdSel (e, val) {
      this.learnList.map((v, index) => {
        if (v.course_id === this.course_id) {
          this.currenLearnInfo = v
        }
      })
      // this.getStudyContent(val)
    },
    // 切换未完成课程学习计划
    getPackageIdSel (e, val) {
      this.noFinishPlanList.map((v, index) => {
        if (v.package_id === this.package_id) {
          this.currenNoFinishPlan = v
          // this.course_id = this.package_id
          // this.getLearnIndex()
        }
      })
    },
    planChangeTab (index) {
      this.tabIdx = index
    },
    // 月份获取日
    getEveryday (v) {
      everyday({
        user_id: this.user_id,
        plan_id: this.currenLearnInfo.plan_id,
        month: v,
        is_exper: this.currenLearnInfo.is_exper // 1为0元体验 2为购买课程
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          // this.everydayList = res.data.date
          this.everydayList = [
            // {
            //   'sameday': '是否是今天1是2不是',
            //   'is_rest': '是否是休息日1不是2是',
            //   'date': '当前月日期',
            //   'days': '第几天'
            // }
            {
              'sameday': '1',
              'is_rest': '1',
              'date': '8月15日',
              'days': '1'
            },
            {
              'sameday': '2',
              'is_rest': '1',
              'date': '8月16日',
              'days': '2'
            },
            {
              'sameday': '2',
              'is_rest': '2',
              'date': '8月17日',
              'days': '3'
            }
          ]
          this.everydayList.forEach(v => {
            // let currDate
            // if (v.sameday == 1) {
            //   currDate = v.date
            // }
            // let dataAddyue = v.date.split('.').join('月')
            // v.date = dataAddyue
          })
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 继续学习
    goLearnVideo () {
      console.log('继续学习')
    },
    // 退出学习计划modal
    outLearnPlan () {
      this.visible4 = true
    },
    // 确定退出学习计划
    sureOutplan () {
      outPlan({
        user_id: this.user_id,
        plan_id: this.currenLearnInfo.plan_id,
        types: this.currenLearnInfo.is_exper
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.getLearnIndex()
          this.visible4 = false
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 去看看未完成列表
    seeNofinishList () {
      this.visible2 = false
      this.visible3 = true
      this.getHangAir()
    },
    closeModal (type) {
      if (type === 1) {
        this.visible2 = false
      }
      if (type === 2) {
        this.visible4 = false
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  $btnGredientOrange: #FBAC78,#FC7873;
  $btnGredientGray: #C7C7C7, #C6C6C6;
  $btnGredientBlue: #39BBFD, #55C2FA;
  .learn-center-wrap{
    padding-top: 20px;
    background: url('../../assets/images/learncenter/left-top-img.png') no-repeat left top;
    background-size: 478px 292px;
  }
  // 无学习计划样式
  .lc-login-h{
    position: absolute;
    width: 100%;
    left: 0;
    top: 70px;
    bottom: 0;
    right: 0;
    background: #ffffff;
  }
  .lc-left-top-img{
    position: absolute;
    left: 0;
    top: 0;
    height: 292px;
  }
  .lc-right-bottom-img{
    position: absolute;
    right: 0;
    bottom: 0;
    height: 171px;
  }
  .lc-login-wrap{
    width: 1281px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .lc-login-left{
    width: 620px;
  }
  .yc-detail{
    .yc-welcome{
      font-size: 50px;
      line-height: 70px;
      color: #002E80;
      span{
        font-size: 30px;
        line-height: 42px;
        display: block;
      }
    }
    .yc-logo{
      line-height: 28px;
      img{
        width: 94px;
        height: 20px;
        vertical-align: middle;
        margin-top: -4px;
      }
      em{
        height: 20px;
        width: 1px;
        display: inline-block;
        vertical-align: middle;
        margin: 0 10px;
        margin-top: -4px;
        background: #979797;
      }
      span{
        font-size: 20px;
      }
    }
    .yc-instr{
      line-height: 20px;
      color: $col999;
      margin-top: 7px;
    }
  }
  .loginSign-wrap{
    padding-top: 60px;
    .yc-tiyan{
      font-size: 18px;
      line-height: 30px;
    }
  }
  .info-bottom{
    font-size: 16px;
    margin-top: 20px;
    .btn-com{
      width: 122px;
      height: 36px;
      background:rgba(0,102,255,1);
      border-radius: 18px;
      color: $colfff;
    }
  }
  // modal制定学习计划
  .plan-modal{
    position: relative;
  }
  .dot{
    padding: 30px 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    font-size: 0;
    text-align: center;
    span{
      width: 10px;
      height: 10px;
      border-radius: 10px;
      background:rgba(51,51,51,.3);
      display: inline-block;
      margin: 0 10px;
      &.curren{
        background: $col333;
      }
    }
  }
  .star-learning-wrap{
    display: flex;
    justify-content: space-between;
    padding: 113px 30px 0 30px;
  }
  .star-learning-left{
    padding-top: 49px;
    .plan-finish{
      font-size: 30px;
      line-height: 42px;
    }
    .plan-next{
      width: 338px;
      font-size: 16px;
      line-height: 26px;
      margin-top: 7px;
    }
  }
  // 学习计划top info（天数，sel，学习状态）
  // sel 天数 学习中 退出计划
  .learn-detail-wrap{
    padding: 24px 30px 0 30px;
    background: #ffffff;
    border-radius: 8px;
  }
  .learn-detail-top, .learn-course-info, .learning-ul{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .select-box {
    display: inline-block;
    padding: 0 48px 0 10px;
    height: 46px;
    line-height: 46px;
    background:rgba(255,255,255,1);
    border-radius: 6px;
    font-size: 28px;
    border: 1px solid rgba(102,102,102,1);
    position: relative;
    .com-sel {
      cursor: pointer;
      border: 0;
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      background: none;
    }
    .arow{
      position: absolute;
      top: 1px;
      bottom: 1px;
      right: 0;
      width: 38px;
      text-align: center;
      background: #F5F5F5;
      border-radius: 0px 6px 6px 0;
    }
  }
  .learn-status{
    width: 100px;
    height: 32px;
    line-height: 32px;
    font-size: 18px;
    color: $colfff;
    @include bg-linear-gradient($btnGredientOrange, left);
    border-radius: 20px;
    text-align: center;
    display: inline-block;
  }
  .ewm-box{
    margin: 0 22px;
    .ewm-icon{
      width: 40px;
      height: 40px;
      display: inline-block;
      background: #000;
    }
  }
  .surplus-day{
    padding-left: 6px;
    padding-right: 10px;
    margin-left: 24px;
    height: 30px;
    line-height: 30px;
    background:rgba(232,67,66,.1);
    border-radius: 15px;
    font-size: 18px;
    color: #E84342;
    i{
      display: inline-block;
      margin-right: 3px;
      vertical-align: middle;
      @include bg-img(20, 20, '../../assets/images/learncenter/time-icon.png');
    }
  }
  .outplan{
    padding-left: 40px;
    font-size: 18px;
    color: $col999;
    background: url('../../assets/images/learncenter/outplan-small.png') no-repeat left center;
    background-size: 30px 40px;
    cursor: pointer;
  }
  // bottom 进度圆环 有效期 当前学习课程
  .learn-detail-bottom{
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 40px 0;
  }
  .circle-box{
    font-size: 20px;
    line-height: 28px;
    span{
      display: block;
      font-size: 14px;
      line-height: 20px;
      color: $col666;
    }
  }
  .learning-ul{
    li{
      position: relative;
      padding: 0 50px;
      text-align: center;
      p{
        font-size: 20px;
        line-height: 28px;
        margin-top: 11px;
        em{
          color: $blueColor;
        }
      }
      span{
        color: $col666;
        line-height: 20px;
      }
      &:first-child{
        padding-left: 0;
      }
      &:after{
        position: absolute;
        content: "";
        top: 18px;
        bottom: 0;
        right: 0;
        width: 1px;
        background: #E6E6E6;
      }
      &.learnvideo{
        &:after{
          width: 0;
        }
      }
      .btn-com{
        width: 100px;
        height: 28px;
        background: $blueColor;
        font-size: 16px;
        color: #ffffff;
      }
    }
  }
  // 月份 答疑
  .plan-learn-tab{
    font-size: 18px;
    height: 65px;
    line-height: 65px;
    span{
      margin-left: 30px;
      margin-right: 20px;
      cursor: pointer;
      &.curren{
        color: $blueColor;
      }
    }
  }
  .tab-main{
    // display: flex;
    // justify-content: space-between;
  }
  .month-answer-left{
    width: 901px;
    background: #ffffff;
    border-radius: 8px;
  }
  .month-title{
    padding: 10px 0px;
    font-size: 18px;
    box-sizing: border-box;
  }
  .memu-list-icon{
    font-size: 28px;
    font-weight: bold;
    color: $blueColor;
    vertical-align: middle;
    margin-top: -3px;
    margin-right: 35px;
  }
  .days-list{
    display: flex;
    flex-flow: wrap;
    padding: 5px 54px;
    border-bottom: 1px solid #E6E6E6;
  }
  .days-item{
    padding: 15px 26px;
    text-align: center;
    position: relative;
    cursor: pointer;
    p{
      font-size: 16px;
      color: $col666;
      line-height: 22px;
      margin-top: 7px;
    }
    &:hover .tips-item{
      display: block;
    }
    &.days-item-blue:hover .status-icon{
      box-shadow: 0 5px 12px 2px rgba(78,174,253,.5);
    }
    &.days-item-orange:hover .status-icon{
      box-shadow: 0 5px 12px 2px rgba(251,172,120,.5);
    }
    &.days-item-gray:hover .status-icon{
      box-shadow: 0 5px 12px 2px rgba(199,199,199,.5);
    }
  }

  .tips-item{
    position: absolute;
    left: 25px;
    top: 86px;
    z-index: 2;
    height: 30px;
    line-height: 30px;
    border-radius: 6px;
    color: #ffffff;
    display: none;
    &:before{
      position: absolute;
      content: "";
      top: -8px;
      left: 20px;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
    }
    .days-item-gray &{
      width: 127px;
      @include bg-linear-gradient($btnGredientGray, left);
      &:before{
        border-bottom: 8px solid #C7C7C7;
      }
    }
    .days-item-blue &{
      width: 160px;
      @include bg-linear-gradient($btnGredientBlue, left);
      &:before{
        border-bottom: 8px solid #39BBFD;
      }
    }
    .days-item-orange &{
      width: 110px;
      @include bg-linear-gradient($btnGredientOrange, left);
      &:before{
        border-bottom: 8px solid #FBAC78;
      }
    }
  }
  .status-icon{
    display: inline-block;
    border-radius: 50%;
    .days-item-gray &{
      @include bg-img(61, 61, '../../assets/images/learncenter/days-gray-icon.png');
    }
    .days-item-blue &{
      @include bg-img(61, 61, '../../assets/images/learncenter/days-blue-icon.png');
    }
    .days-item-orange &{
      @include bg-img(61, 61, '../../assets/images/learncenter/days-orange-icon.png');
    }
  }
  // 公告学员动态
  .about-learncenter-right{
    width: 278px;
  }
  // modal
  .no-finish-wrap, .outplan-wrap{
    text-align: center;
    padding-top: 20px;
    .nf-icon{
      @include bg-img(60, 60, '../../assets/images/learncenter/queqin-icon.png');
    }
    .op-icon{
      @include bg-img(60, 60, '../../assets/images/learncenter/outplan-middle.png');
    }
    .nf-txt, .op-txt{
      margin-top: 13px;
      margin-bottom: 5px;
      font-size: 16px;
      line-height: 22px;
    }
    .op-txt-red{
      color: #E84342;
      line-height: 20px;
    }
    // .nf-icon{
    //   @include bg-img(60, 60, '../../assets/images/learncenter/queqin-icon.png');
    // }
  }
  .btn-box-learn{
    margin-top: 20px;
    border-top: 1px solid #E6E6E6;
    button{
      width: 50%;
      height: 40px;
      font-size: 16px;
      &:last-child{
        border-left: 1px solid #E6E6E6;
        color: $blueColor;
      }
    }
  }
  .no-finish-list-wrap{
    .com-bg{
      background:rgba(232, 67, 66, .08);
      color: #E84342;
    }
  }
  .nofinish{
    .btn-com{
      color: #E84342;
      border: 1px solid #E84342;
      border-radius: 13px;
      height: 25px;
      width: 80px;
    }
  }
  // <div class="outplan-wrap">
  //       <i class="op-icon"></i>
  //       <p class="op-txt">您有缺勤的课程</p>
  //       <p class="op-txt-red">退出计划后，学习记录将无法找回</p>
  //       <div class="btn-box-learn">
  //         <button>再想想</button>
  //         <button>退出</button>
  //       </div>
  //     </div>
</style>
