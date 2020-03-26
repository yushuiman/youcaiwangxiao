<template>
  <div class="learn-center-wrap">
    <!-- 已登录 addlearn == 1有学习计划-->
    <div class="w-wrap" v-if="addlearn == 1">
      <div class="learn-detail-wrap">
        <!-- 学习详情 top -->
        <div class="learn-detail-top">
          <div class="learn-course-info">
            <div class="selmoni-course">
              <Dropdown trigger="click" placement="top-start" :transfer="true" @on-visible-change="dropDownVisible">
                <div class="sel-course-name">
                  <em>{{selCourseName}}</em>
                  <span class="arow" v-if="!selCourseFlag"><Icon type="md-arrow-dropdown" style="font-size: 28px;margin-top: -3px;color: #666666;"/></span>
                  <span class="arow" v-if="selCourseFlag"><Icon type="md-arrow-dropup" style="font-size: 28px;margin-top: -3px;color: #666666;"/></span>
                </div>
                <DropdownMenu slot="list" class='drop-list sel-course-list'>
                  <li class="sel-course-item" v-for="(v, index) in learnList" :key="index" @click="selCourse(v)">{{v.plan_name}}</li>
                  <li class="add-course" @click="planLearn">+添加学习计划</li>
                </DropdownMenu>
              </Dropdown>
            </div>
            <!-- <div class="ewm-box">
              <i class="ewm-icon"></i>
            </div> -->
            <span class="learn-status" :class="{'gray': sameday == 2}">{{ sameday == 1 ? '学习中' : '已结束' }}</span>
            <span class="surplus-day"><i></i>离考试还有{{currenLearnInfo.number}}<em>天</em></span>
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
              <div class="circle-box">
                {{currenLearnInfo.schedule}}天
                <span>出勤</span>
                <div class="head-bor">
                  <img :src="user.head" alt="" class="canvas-head">
                </div>
              </div>
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
                <p v-if="currenLearnInfo.newVideo && currenLearnInfo.newVideo.video_name">{{currenLearnInfo.newVideo.video_name}}</p>
                <p v-else>无</p>
              </li>
              <li class="learnbtn">
                <button class="btn-com" :class="{'gray': sameday == 2}" @click="goLearnVideo">开始学习</button>
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
              <Menu accordion width="100%">
                <Submenu :name="index+1" v-for="(v, index) in currenLearnInfo.month" :key="index">
                  <template slot="title">
                    <div class="month-title" @click="getEveryday(v)">
                      <Icon type="ios-list" class="menu-list-icon"/>
                      <span>{{v}}月计划</span>
                    </div>
                  </template>
                  <ul class="days-list">
                    <!-- 今天课程已结束哦～ 继续学习吧～ 还没有开课哦～ 今天是周末哦～ -->
                    <li class="days-item" :class="{'days-item-rest': v.is_rest == 2, 'days-item-blue': v.beforeDate == 1, 'days-item-orange': v.currDate == 1 && v.is_rest != 2, 'days-item-gray': v.afterDate == 1 && v.is_rest != 2}"
                      v-for="(v, index) in everydayList" :key="index" @click="getLearnVideo(v)">
                      <i class="status-icon"></i>
                      <p>{{v.date}}</p>
                      <div class="tips-item" v-if="v.is_rest == 2">今天休息啦～</div>
                      <div class="tips-item" v-if="v.beforeDate == 1">今天课程已结束哦～</div>
                      <div class="tips-item" v-if="v.afterDate == 1 && v.is_rest != 2">还没有开课哦～</div>
                      <div class="tips-item" v-if="v.currDate == 1 && v.is_rest != 2">继续学习吧～</div>
                    </li>
                  </ul>
                </Submenu>
              </Menu>
            </div>
            <div class="answer-box" v-if="tabIdx == 1">
              <answer-info :user_id="user_id" :answerType="answerType"></answer-info>
            </div>
          </div>
          <div class="about-learncenter-right fr">
            <!-- 公告 学员 学员动态 -->
            <learn-notice></learn-notice>
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
              <button class="btn-com" @click="planLearn">立即制定</button>
            </div>
          </div>
        </div>
        <img class="lc-login-right" src="../../assets/images/learncenter/zkz-img.png" alt="">
      </div>
    </div>
    <img v-if="addlearn == 2" class="lc-right-bottom-img" src="../../assets/images/learncenter/right-bottom-img.png" alt="">
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
            <span v-if="addlearn === 1">{{val.course_name}}<i class="is-join" v-if="val.state == 1">已参加</i></span>
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
                <button class="btn-com" @click="starStudy">开始学习之旅</button>
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
        <div class="sel-box">
          <select class="com-sel" v-model="package_id" @change="getPackageIdSel($event)">
            <option class="com-opt" :value="v.package_id" v-for="(v, index) in noFinishPlanList" :key="index">{{v.plan_name}}</option>
          </select>
          <span class="arow"><Icon type="md-arrow-dropdown" style="font-size: 28px;margin-top: -4px;color: #666666;"/></span>
        </div>
        <div class="com-bg">
          <span>您以下课程未学习，请自行补全学习进度</span>
          <button class="btn-com" @click="goClassDetailLearn">去学习</button>
        </div>
        <ul class="know-list">
          <li v-for="(v, key) in currenNoFinishPlan.video" :key="key" class="nofinish">
            <span>{{v.video_name}}</span>
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
    <!-- 学习视频 -->
    <Drawer v-model="isDrawer"
      :width="487"
      :closable="true"
      class="learn-drawer"
      >
      <div class="learn-course-video">
        <div class="drawer-tit">{{drawerTit}}</div>
        <ul class="learn-course-ul" v-if="learnVideoList.length">
          <li class="learn-course-item" :class="{'gray': (item.beforeDate == 1 || item.afterDate == 1)}" v-for="(item, index) in learnVideoList" :key="index">
            <div class="lci-top" @click="goVideoPage(item)">
              <img :src="item.CoverURL" alt="" class="lci-img">
              <div class="lci-n-t">
                <h1>{{item.video_name}}</h1>
                <p>{{item.video_time}}</p>
              </div>
              <!-- 课程已结束并且完成 -->
              <div v-if="item.beforeDate == 1">
                <i class="lock-icon"></i>
                <i class="finish-icon" v-if="item.is_watch == 1"></i>
              </div>
              <!-- 未开始 -->
              <div v-if="item.afterDate == 1">
                <i class="lock-icon"></i>
              </div>
              <!-- 课程正在进行 -->
              <div v-if="item.currDate == 1">
                <i class="finish-icon isfinish" v-if="item.is_watch == 1"></i>
              </div>
            </div>
            <div class="lci-bottom">
              <button class="jy-btn" @click="goJyPage(item)">讲义</button>
              <button class="potic-btn"  @click="goDopicPage(item)">习题</button>
            </div>
          </li>
        </ul>
        <div class="reset-day" v-else>
          <img src="../../assets/images/learncenter/days-rest-icon.png" alt="">
          <p>今天休息啦～</p>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { learnIndex, courseList, testTime, addStudy, everyday, outPlan, hangAir, getVideo, studyStatus } from '@/api/learncenter'
import learnNotice from '../../components/learning/learnNotice'
import learnStudent from '../../components/learning/learnStudent'
import studentDynamic from '../../components/learning/studentDynamic'
import answerInfo from '../../components/personal/answerInfo'
import { mapState, mapActions } from 'vuex'
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
      sameday: 0, // 是不是今天 判断学习中，学习结束状态
      course_id: 0, // select默认选择
      package_id: 0, // select默认选择
      selCourseName: '', // select默认选择name
      selCourseFlag: false, // select 显示隐藏
      addlearn: 0, // 是否有学习计划 1有2没有
      user: {}, // 用户信息，打卡天数
      learnList: [], // 学习计划详情
      currenLearnInfo: [], // 当前学习计划详情
      courseListLearn: [], // 制定课程列表
      timeListLearn: [], // 制定考试时间列表
      planChooseInfo: {}, // 制定计划详情（课程，时间，是否为0元体验）
      tabIdx: 0, // 月份 答疑tab
      answerType: 'learn', // 答疑组件tab样式
      everydayList: [], // 计划月份对应的天数
      visible2: false, // 缺勤
      visible3: false, // 缺勤详情list
      visible4: false, // 退出学习计划
      noFinishPlanList: [], // 未完成计划列表
      currenNoFinishPlan: {}, // 当前未完成计划列表
      currMonth: 0, // 当前月
      currDay: 0, // 当前天
      systemTime: '', // 系统时间，用来取当天时间
      learnVideoList: [], // 学习视频
      isDrawer: false, // 学习视频抽屉
      drawerTit: '', // 学习视频抽屉title
      youhuaInfo: []
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  components: {
    learnNotice,
    learnStudent,
    studentDynamic,
    answerInfo
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.getLearnIndex()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getLearnIndex()
      })
    }
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    // 制定学习计划
    planLearn () {
      this.visible = true
      this.selCourseFlag = false
      this.addLearnIdx = 0
      if (this.addlearn === 2) { // 没有学习计划 选择课程列表
        return
      }
      this.getCourseList() // 有学习计划 选择课程列表
    },
    nextPage (index, val) {
      if (val && val.state === 1) { // 已参加计划
        this.$Message.error('已参加')
        return
      }
      // this.planChooseInfo = val //暂时用不到 多余
      if (index === 1) {
        this.planChooseInfo.course_id = val.course_id // 选择课程id
        this.planChooseInfo.is_exper = val.is_exper // 是否0元体验
        this.getTestTime() // 选择考试时间
      }
      if (index === 2) {
        this.planChooseInfo.test_time = val.test_time // 选择考试time
        this.getAddStudy()
        return
      }
      this.addLearnIdx = index
    },
    // 学习计划首页详情
    getLearnIndex () {
      this.showLoading(true)
      learnIndex({
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          let { addlearn, time, state, user, plan, learnList } = res.data
          this.addlearn = addlearn
          this.systemTime = time
          this.user = user
          this.learnList = learnList
          if (state === 1) { // state==1有未读2已读
            this.visible2 = true
          }
          if (addlearn === 2) {
            this.courseListLearn = plan // 没有学习计划 课程列表
          }
          if (learnList && learnList.length) {
            this.selCourseName = this.learnList[0].plan_name // 初始化学习计划详情name
            this.course_id = this.learnList[0].course_id // 初始化学习计划详情course_id
            this.currenLearnInfo = this.learnList[0] // 初始化学习计划详情
            this.currenLearnInfo.percent = (this.currenLearnInfo.schedule / this.currenLearnInfo.plan_days) * 100 // 初始化学习计划圆环进度
            this.getStudyStatus() // 当前学习计划状态
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 当前课程学习状态
    getStudyStatus () {
      this.showLoading(true)
      studyStatus({
        user_id: this.user_id,
        plan_id: this.currenLearnInfo.plan_id,
        is_exper: this.currenLearnInfo.is_exper // 1为0元体验 2为购买课程
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.sameday = res.data.sameday
        } else {
          this.visible = false
          this.$Message.error(res.msg)
        }
      })
    },
    // 学习计划课程列表list
    getCourseList () {
      this.showLoading(true)
      courseList({
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
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
      this.timeListLearn = []
      this.showLoading(true)
      testTime({
        user_id: this.user_id,
        course_id: this.planChooseInfo.course_id,
        types: this.planChooseInfo.is_exper || 2 // 1:0元体验 2:购买课程
      }).then(data => {
        this.showLoading(false)
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
      this.showLoading(true)
      addStudy({
        user_id: this.user_id,
        course_id: this.planChooseInfo.course_id,
        test_time: this.planChooseInfo.test_time,
        types: this.planChooseInfo.is_exper || 2 // 1为0元体验 2为购买课程
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          if (res.data.state === 1) {
            this.addLearnIdx = 2
          }
        } else if (res.code === 405) { // 您已参加过
          this.$Message.error(res.msg)
        } else {
          this.visible = false
          this.$Message.error(res.msg)
        }
      })
    },
    // 开始学习之旅
    starStudy () {
      this.visible = false
      this.getLearnIndex() // 添加学习计划后更新首页信息
    },
    // 未完成计划列表
    getHangAir () {
      this.showLoading(true)
      hangAir({
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.noFinishPlanList = res.data
          this.currenNoFinishPlan = this.noFinishPlanList[0]
          this.package_id = this.noFinishPlanList[0].package_id
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 未完成计划去学习/当前正在学习.继续
    goClassDetailLearn () {
      this.$router.push({ path: '/course-detail',
        query: {
          package_id: this.package_id
        }
      })
    },
    // 开始学习
    goLearnVideo () {
      if (this.sameday === 2) {
        this.$Message.error('学习计划已结束')
        return
      }
      this.showLoading(true)
      getVideo({
        user_id: this.user_id,
        course_id: this.currenLearnInfo.course_id,
        plan_id: this.currenLearnInfo.plan_id,
        types: this.currenLearnInfo.is_exper,
        days: this.currenLearnInfo.join_days,
        sameday: 1 // 是今天1不是2
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.isDrawer = true
          if (res.data && res.data.video) {
            this.drawerTit = this.systemTime + ' 课程进行中'
            this.learnVideoList = res.data.video
            this.learnVideoList.forEach(val => {
              val.beforeDate = 2
              val.afterDate = 2
              val.currDate = 1
            })
          } else {
            this.drawerTit = this.systemTime + ' 休息日'
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 首页切换课程学习计划
    dropDownVisible (change) {
      this.selCourseFlag = change
    },
    // 首页切换课程学习计划详情
    selCourse (v) {
      this.currenLearnInfo = v
      this.selCourseName = v.plan_name
      this.selCourseFlag = false
    },
    // 切换未完成课程学习计划
    getPackageIdSel (e, val) {
      this.noFinishPlanList.map((v, index) => {
        if (v.package_id === this.package_id) {
          this.currenNoFinishPlan = v
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
    },
    planChangeTab (index) {
      this.tabIdx = index
    },
    // 月份获取日
    getEveryday (v) {
      this.everydayList = []
      everyday({
        user_id: this.user_id,
        plan_id: this.currenLearnInfo.plan_id,
        month: v,
        is_exper: this.currenLearnInfo.is_exper // 1为0元体验 2为购买课程
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.everydayList = res.data.date
          this.currYear = parseInt(res.data.time.split('-')[0])
          this.currMonth = parseInt(res.data.time.split('-')[1])
          this.currDay = parseInt(res.data.time.split('-')[2])
          this.everydayList.forEach(v => {
            v.monthNum = parseInt(v.date.split('月')[0]) // 月份
            v.dayNum = parseInt(v.date.split('月')[1]) // 日
            v.beforeDate = 2
            v.afterDate = 2
            v.currDate = 2
            if (v.year < this.currYear) {
              v.beforeDate = 1
            } else {
              if (v.monthNum < this.currMonth) {
                v.beforeDate = 1
              } else if (v.monthNum > this.currMonth) {
                v.afterDate = 1
              } else if (v.monthNum === this.currMonth) {
                if (v.dayNum === this.currDay) {
                  v.currDate = 1
                }
                if (v.dayNum < this.currDay) {
                  v.beforeDate = 1
                }
                if (v.dayNum > this.currDay) {
                  v.afterDate = 1
                }
              }
            }
          })
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 学习视频
    getLearnVideo (v) {
      this.learnVideoList = []
      if (v.beforeDate === 1) {
        this.drawerTit = v.date + ' 课程已结束'
      }
      if (v.afterDate === 1) {
        this.drawerTit = v.date + ' 课程未开始'
      }
      if (v.currDate === 1) {
        this.drawerTit = v.date + ' 课程进行中'
      }
      if (v.is_rest === 2) {
        this.drawerTit = v.date + ' 休息日'
        this.isDrawer = true
        return
      }
      this.showLoading(true)
      getVideo({
        user_id: this.user_id,
        course_id: this.currenLearnInfo.course_id,
        plan_id: this.currenLearnInfo.plan_id,
        types: this.currenLearnInfo.is_exper,
        days: v.days,
        sameday: v.sameday
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.data.video && res.data.video.length) {
          this.learnVideoList = res.data.video
          this.learnVideoList.forEach(val => {
            val.beforeDate = v.beforeDate
            val.afterDate = v.afterDate
            val.currDate = v.currDate
          })
        }
        this.isDrawer = true
      })
    },
    // 学习视频 看视频
    goVideoPage (val) {
      if (val.beforeDate === 1 || val.afterDate === 1) {
        return
      }
      let obj = {
        package_id: val.package_id,
        course_id: val.course_id,
        section_id: val.section_id,
        video_id: val.video_id,
        is_zhengke: val.is_zhengke,
        plan_id: this.currenLearnInfo.plan_id, // 计划id
        days: this.currenLearnInfo.join_days // 第几天
      }
      if (this.currenLearnInfo.is_exper === 1) { // 0元体验 未购买 去看视频
        val.userstatus = 2 // 当0元体验的时候 2是未购买
      }
      window.sessionStorage.setItem('userstatus', val.userstatus || 1) // 1购买2未购买
      this.getUserInfo().then(() => {
        this.$router.push({ path: '/learn-center-video',
          query: obj
        })
      })
    },
    // 学习视频 讲义
    goJyPage (val) {
      if (val.beforeDate === 1 || val.afterDate === 1) {
        return
      }
      this.getUserInfo().then(() => {
        window.open(val.handouts, '_blank')
      })
    },
    // 学习视频 去做题
    goDopicPage (val) {
      if (val.beforeDate === 1 || val.afterDate === 1) {
        return
      }
      if (!val.know_id) {
        this.$Message.error('暂时没有题哦～')
        return
      }
      let obj = {
        package_id: val.package_id,
        course_id: val.course_id,
        section_id: val.section_id,
        know_id: val.know_id,
        video_name: val.video_name
      }
      if (this.currenLearnInfo.is_exper === 1) {
        obj.plate_id = 8 // 学习计划的0元体验
      }
      window.sessionStorage.setItem('getQuestion', JSON.stringify(obj))
      this.getUserInfo().then(() => {
        this.$router.push('/dopotic-learn')
      })
    },
    // 退出学习计划modal
    outLearnPlan () {
      this.visible4 = true
    },
    // 确定退出学习计划
    sureOutplan () {
      this.showLoading(true)
      outPlan({
        user_id: this.user_id,
        plan_id: this.currenLearnInfo.plan_id,
        types: this.currenLearnInfo.is_exper
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.getLearnIndex()
          this.visible4 = false
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    window.sessionStorage.removeItem('selIdxAnswer')
    next()
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  $btnGredientOrange: #FBAC78,#FC7873;
  $btnGredientGray: #C7C7C7, #C6C6C6;
  $btnGredientBlue: #39BBFD, #55C2FA;
  .learn-center-wrap{
    min-height: 292px;
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
    width: 1010px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  .lc-login-left{
    width: 410px;
    margin-top: -110px;
    margin-left: 3%;
  }
  .lc-login-right{
    width: 415px;
    height: 421px;
    margin-right: 35px;
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
      line-height: 22px;
      margin-top: 27px;
      img{
        width: 75px;
        height: 16px;
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
        font-size: 16px;
      }
    }
    .yc-instr{
      line-height: 20px;
      color: $col999;
      margin-top: 9px;
    }
  }
  .loginSign-wrap{
    padding-top: 56px;
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
    .know-list li{
      cursor: pointer;
      span{
        position: relative;
      }
    }
  }
  .is-join{
    position: absolute;
    top: -15px;
    width: 56px;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    display: inline-block;
    color: #ffffff;
    font-style: normal;
    @include bg-linear-gradient($btnGredientOrange, to left);
    border-radius: 4px;
    &:after{
      position: absolute;
      content: "";
      bottom: -4px;
      left: 2px;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid #FC7873;
    }
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
  .selmoni-course{
    position: relative;
    width: 440px;
    .ivu-dropdown{
      width: 100%;
    }
  }
  .sel-course-name{
    display: flex;
    justify-content: space-between;
    position: relative;
    padding-left: 10px;
    height: 36px;
    line-height: 36px;
    background:rgba(255,255,255,1);
    border-radius: 6px;
    font-size: 22px;
    border: 1px solid rgba(102,102,102,1);
    box-sizing: border-box;
    cursor: pointer;
    overflow: hidden;
    em{
      display: inline-block;
      overflow: hidden;
      width: 90%;
      height: 100%;
    }
  }
  .sel-course-list{
    width:440px;
    border: 1px solid #979797;
    background: #ffffff;
    li{
      padding: 0 10px;
      height: 60px;
      line-height: 60px;
      font-size: 22px;
      border-bottom: 1px solid #E6E6E6;
      overflow: hidden;
      cursor: pointer;
      &:last-child{
        border: 0;
      }
      &.add-course{
        font-size: 24px;
        color: $col999;
      }
    }
  }
  .sel-box {
    display: inline-block;
    min-width: 473px;
    padding: 0 48px 0 10px;
    margin: 30px 30px 24px;
    height: 46px;
    line-height: 46px;
    background:rgba(255,255,255,1);
    border-radius: 6px;
    font-size: 28px;
    border: 1px solid rgba(102,102,102,1);
    position: relative;
    .com-sel {
      width: 100%;
      position: absolute;
      left: 10px;
      right: 0;
      top: 0;
      cursor: pointer;
      border: 0;
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      background: none;
    }
  }
  .arow{
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    width: 38px;
    text-align: center;
    background: #F5F5F5;
    border-radius: 0px 6px 6px 0;
    .sel-box &{
      top: 1px;
      bottom: 1px;
      right: 1px;
    }
  }
  .learn-status{
    width: 100px;
    height: 26px;
    line-height: 26px;
    font-size: 16px;
    color: $colfff;
    @include bg-linear-gradient($btnGredientOrange, to left);
    border-radius: 20px;
    text-align: center;
    display: inline-block;
    margin: 0 14px;
    &.gray{
      @include bg-linear-gradient($btnGredientGray, to left);
    }
  }
  // .ewm-box{
  //   margin: 0 22px;
  //   .ewm-icon{
  //     vertical-align: middle;
  //     @include bg-img(28, 28, '../../assets/images/learncenter/ewm.png');
  //   }
  // }
  .surplus-day{
    padding: 0 12px;
    // margin-left: 14px;
    height: 30px;
    line-height: 30px;
    background:rgba(232,67,66,.1);
    border-radius: 15px;
    font-size: 16px;
    color: $col666;
    i{
      display: inline-block;
      margin-right: 4px;
      vertical-align: middle;
      @include bg-img(20, 20, '../../assets/images/learncenter/time-icon.png');
    }
    em{
      color: #E84342;
      margin-left: 5px;
    }
  }
  .outplan{
    padding-left: 26px;
    font-size: 18px;
    color: $col999;
    background: url('../../assets/images/learncenter/outplan-small.png') no-repeat left center;
    background-size: 16px 17px;
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
    .head-bor{
      position: absolute;
      right: 0;
      top: -10px;
      width: 24px;
      height: 24px;
      border: 3px solid #FC8974;
      border-radius: 50%;
      font-size: 0;
    }
    .canvas-head{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .learning-ul{
    li{
      position: relative;
      padding: 0 50px;
      text-align: center;
      p{
        font-size: 20px;
        height: 28px;
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
        max-width: 500px;
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
        &.gray{
          @include bg-linear-gradient($btnGredientGray, to left);
          border: 0;
        }
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
    padding-bottom: 20px;
  }
  .month-answer-left{
    width: 901px;
  }
  .month-box{
    background: #ffffff;
    border-radius: 8px;
  }
  .month-title{
    padding: 20px 30px;
    font-size: 18px;
    box-sizing: border-box;
  }
  .menu-list-icon{
    font-size: 28px;
    font-weight: bold;
    color: $blueColor;
    vertical-align: middle;
    margin-top: -3px;
    margin-right: 30px;
  }
  .days-list{
    display: flex;
    flex-flow: wrap;
    padding: 5px 54px;
    border-bottom: 1px solid #E6E6E6;
  }
  .days-item{
    margin: 15px 26px;
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
    &.days-item-orange:hover .status-icon{
      box-shadow: 0 5px 12px 2px rgba(251,172,120,.5);
    }
    &.days-item-gray:hover .status-icon, &.days-item-rest:hover .status-icon{
      box-shadow: 0 5px 12px 2px rgba(199,199,199,.5);
    }
    &.days-item-blue:hover .status-icon{
      box-shadow: 0 5px 12px 2px rgba(78,174,253,.5);
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
    .days-item-orange &{
      width: 100px;
      @include bg-linear-gradient($btnGredientOrange, to left);
      &:before{
        border-bottom: 8px solid #FBAC78;
      }
    }
    .days-item-gray &,.days-item-rest &{
      width: 115px;
      @include bg-linear-gradient($btnGredientGray, to left);
      &:before{
        border-bottom: 8px solid #C7C7C7;
      }
    }
    .days-item-rest &{
      width: 100px;
    }
    .days-item-blue &{
      width: 140px;
      @include bg-linear-gradient($btnGredientBlue, to left);
      &:before{
        border-bottom: 8px solid #39BBFD;
      }
    }
  }
  .status-icon{
    display: inline-block;
    border-radius: 50%;
    @include bg-img(61, 61, '../../assets/images/learncenter/days-gray-icon.png');
    .days-item-orange &{
      @include bg-img(61, 61, '../../assets/images/learncenter/days-orange-icon.png');
    }
    .days-item-gray &{
      @include bg-img(61, 61, '../../assets/images/learncenter/days-gray-icon.png');
    }
    .days-item-rest &{
      @include bg-img(61, 61, '../../assets/images/learncenter/days-rest-icon.png');
    }
    .days-item-blue &{
      @include bg-img(61, 61, '../../assets/images/learncenter/days-blue-icon.png');
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
  .no-finish-list-wrap{
    .btn-com{
      color: #E84342;
      border: 1px solid #E84342;
      border-radius: 13px;
      height: 25px;
      width: 80px;
    }
  }
  // 学习视频
  .drawer-tit{
    font-size: 20px;
    font-weight: 500;
    padding: 64px 20px 25px 20px;
    border-bottom: 1px solid #E6E6E6;
  }
  .learn-course-item{
    border-bottom: 13px solid #F3F6FF;
    font-size: 16px;
    &.gray *{
      color: $col999!important;
    }
  }
  .lci-top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 20px;
    cursor: pointer;
    .lci-img{
      width: 100px;
      height: 60px;
      border-radius: 6px;
    }
  }
  .lock-icon{
    @include bg-img(21, 28, '../../assets/images/learncenter/lock.png');
  }
  .finish-icon{
    position: absolute;
    right: 0;
    bottom: 0;
    @include bg-img(50, 50, '../../assets/images/learncenter/status-gray.png');
    &.isfinish{
      @include bg-img(50, 50, '../../assets/images/learncenter/status-blue.png');
    }
  }
  .lci-n-t{
    flex: 1;
    margin-left: 15px;
    h1{
      line-height: 22px;
    }
    p{
      font-size: 14px;
      line-height: 20px;
      margin-top: 8px;
    }
  }
  .lci-bottom{
    border-top: 1px solid #E6E6E6;
    button{
      width: 50%;
      height: 46px;
      background: #ffffff;
      &.potic-btn{
        border-left: 1px solid #E6E6E6;
      }
    }
  }
  .tab-list{
    li{
      width: 200px;
      height: 100px;
      line-height: 100px;
      background: #f00;
    }
  }
  .reset-day{
    text-align: center;
    padding: 30px 0;
    font-size: 16px;
    img{
      width: 62px;
    }
  }
</style>
