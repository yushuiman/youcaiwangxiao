<template>
  <div class="learn-center-wrap">
    <!-- 左上角图片 -->
    <!-- <img class="lc-left-top-img" src="../../assets/images/learncenter/left-top-img.png" alt=""> -->
    <!-- 已登录 addlearn == 1有学习计划-->
    <div class="plan-detail-wrap w-wrap" v-if="addlearn == 1">
      <!-- 学习详情 top -->
      <div class="plan-info-top">
        <div class="plan-status-top">
          <div class="curren-info-left">
            <select class="com-sel" v-model="course_id" @change="getCourseIdSel($event)">
              <option class="com-opt" :value="v.course_id" v-for="(v, index) in learnList" :key="index">{{v.plan_name}}</option>
            </select>
            <i class="ewm-icon"></i>
            <span class="learn-status">学习中</span>
            <span><i></i>离中卫收到粉红色的开发和思考15天</span>
          </div>
          <div class="out-plan"><i></i>退出</div>
        </div>
        <div class="plan-status-bottom">
          <div class="learn-day">左边</div>
          <div class="learning-info">中间</div>
          <div class="goon-learn"><button>继续学习</button></div>
        </div>
      </div>
      <!-- 学习日期 ，答疑 ，公告，动态... bottom-->
      <div class="plan-info-bottom">
        <div class="plan-info-tab">
          <span>学习路径</span>
          <span>我的答疑</span>
        </div>
        <div class="plan-main">
          <div class="month-answer-left">日期和答疑</div>
          <div class="about-learncenter-right">公告学员动态等</div>
        </div>
      </div>
    </div>
    <!-- 已登录 addlearn == 2无学习计划-->
    <div class="lc-login-wrap" v-if="addlearn == 2">
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
            <button class="btn-com experience-btn" @click="planLearn()">立即制定</button>
          </div>
        </div>
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
          <a>返回上一步</a>
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
                <button class="btn-com experience-btn" @click="getAddStudy()">开始学习之旅</button>
              </div>
            </div>
          </div>
          <img class="star-learning-right" src="../../assets/images/learncenter/zkz-img2.png" alt="">
        </div>
        <div class="dot"><span></span><span></span><span class="curren"></span></div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { learnIndex, courseList, testTime, addStudy, studyContent } from '@/api/learncenter'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      visible: false,
      addLearnIdx: 0, // 添加学习计划div 1选择课程 2考试时间时间 3计划完成
      styles: {
        top: '15%'
      },
      titTxt: {
        0: '添加学习计划',
        1: '添加学习计划',
        2: ''
      },
      course_id: 0, // select默认选择
      addlearn: 0, // 是否有学习计划
      state: 0, // 是否有未完成的计划
      user: {}, // 用户信息，打卡天数
      // plan: {}, // 学习计划
      learnList: [], // 学习计划详情
      news: [], // 学习公告
      courseListLearn: [], // 课程列表
      timeListLearn: [], // 考试时间列表
      planChooseInfo: {} // 制定计划详情（课程，时间，是否为0元体验）
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
          this.state = state
          this.user = user
          this.learnList = learnList
          this.news = news
          if (addlearn === 2) {
            this.courseListLearn = plan // 没有学习计划 课程列表
          }
          this.course_id = this.learnList[0].course_id
          this.getStudyContent(this.learnList[0]) // 获取当前课程对应的计划日期
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
          this.getLearnIndex() // 添加学习计划后更新首页信息
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 切换课程学习计划
    getCourseIdSel (e, val) {
      this.learnList.map((v, index) => {
        if (v.course_id === this.course_id) {
          console.log(v)
        }
      })
      // this.getStudyContent(val)
      // window.sessionStorage.setItem('questionIndexSel', e.target.selectedIndex)
      // window.sessionStorage.setItem('course_id', this.course_id)
      // this.getErrorsectionList()
    },
    getStudyContent (val) {
      studyContent({
        user_id: this.user_id,
        course_id: val.course_id,
        plan_id: val.plan_id,
        types: val.is_exper // 1为0元体验 2为购买课程
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          console.log(res)
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .learn-center-wrap{
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
    width: 28%;
  }
  // 无学习计划样式
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
</style>
