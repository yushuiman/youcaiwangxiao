<template>
  <div class="question-wrap w-wrap clearfix">
    <!-- 0元体验 -->
    <div class="qt-wrap-l fl" v-if="experience">
      <Row class="qt-subject">
        <Col span="6">
          <div class="qt-course-ty">0元体验</div>
        </Col>
      </Row>
       <!-- 答题详情(做题数 正确率 平均分) -->
      <Row class="qt-answer-detail">
        <Col span="8">
          <div class="qta-item qta-item01">
            <span class="tit">做题数</span>
            <p class="record">0<em>道</em></p>
            <p class="compare">同类考生平均答题量<span>{{questionResult.avgtu}}</span>道<br>已击败<span>{{questionResult.donerank}}%</span>同类考生</p>
          </div>
        </Col>
        <Col span="8">
          <div class="qta-item qta-item02">
            <span class="tit">正确率</span>
            <p class="record">0<em>%</em></p>
            <p class="compare">同类考生平均正确率<span>{{questionResult.avgra}}%</span><br>已击败<span>{{questionResult.beatrank}}%</span>同类考生</p>
          </div>
        </Col>
        <Col span="8">
          <div class="qta-item qta-item03">
            <span class="tit">平均分</span>
            <p class="record">0<em>分</em></p>
            <p class="compare">同类考生平均分<span>{{questionResult.avgav}}分</span><br>已击败<span>{{questionResult.pingrank}}%</span>同类考生</p>
          </div>
        </Col>
      </Row>
      <Row class="practice-wrap">
        <Col span="24" class="practice-item">
          <div class="prt-info-com prt-info">
            <div class="prt-flex">
              <i class="prt-icon"></i>
              <div class="prt-txt">
                <h2>权威CMA精准题库</h2>
                <p>名师考题还原，一题三审录入</p>
              </div>
            </div>
            <button class="prt-btn btn-com" @click="zExperienceTopic">去做题</button>
          </div>
        </Col>
      </Row>
      <div class="ty-info">
        <img src="../../assets/images/questions/ty-icon.png" alt="0元体验" class="ty-icon">
        <p class="txt">每天坚持一点，每日进步一点</p>
        <p class="txt-red">购买课程后相应题库会自动打开</p>
      </div>
    </div>
    <!-- 已购买课程 有题库 -->
    <div class="qt-wrap-l fl" v-if="!experience">
      <!-- 科目标题 -->
      <div class="qt-subject" style="display: flex;">
        <div v-for="(item, index) in projectArr" :key="index" class="qt-course" :class="{'curren': course_id == item.id}"
        @click="getQuestionIndex(item, index)" style="padding: 0 30px;">{{item.name}}</div>
      </div>
      <!-- 答题详情(做题数 正确率 平均分) -->
      <Row class="qt-answer-detail">
        <Col span="8">
          <div class="qta-item qta-item01">
            <span class="tit">做题数</span>
            <p class="record">{{questionResult.total_num}}<em>道</em></p>
            <p class="compare">同类考生平均答题量<span>{{questionResult.avgtu}}</span>道<br>已击败<span>{{questionResult.donerank}}%</span>同类考生</p>
          </div>
        </Col>
        <Col span="8">
          <div class="qta-item qta-item02">
            <span class="tit">正确率</span>
            <p class="record">{{questionResult.accuracy}}<em>%</em></p>
            <p class="compare">同类考生平均正确率<span>{{questionResult.avgra}}%</span><br>已击败<span>{{questionResult.beatrank}}%</span>同类考生</p>
          </div>
        </Col>
        <Col span="8">
          <div class="qta-item qta-item03">
            <span class="tit">平均分</span>
            <p class="record">{{questionResult.score}}<em>分</em></p>
            <p class="compare">同类考生平均分<span>{{questionResult.avgav}}分</span><br>已击败<span>{{questionResult.pingrank}}%</span>同类考生</p>
          </div>
        </Col>
      </Row>
      <!-- 知识点练习 阶段测试 论述题自测 冲刺 -->
      <Row class="practice-wrap" v-if="isSprintXly == 1">
        <Col span="12" class="practice-item" v-for="(item, index) in plateList.slice(0, 4)" :key="index">
          <div class="prt-info-com prt-info" :class="['prt-info-0' + (index+1)]">
            <div class="prt-flex">
              <i class="prt-icon"></i>
              <div class="prt-txt">
                <h2>{{item.title}}</h2>
                <p>{{item.describe}}</p>
              </div>
            </div>
            <button class="prt-btn btn-com" @click="doQuestions(item)">去做题</button>
          </div>
        </Col>
      </Row>
      <!-- 知识点练习 阶段测试 论述题自测 -->
      <Row class="practice-wrap" v-if="isSprintXly == 2">
        <Col span="8" class="practice-item" v-for="(item, index) in plateList.slice(0, 3)" :key="index">
          <div class="prt-info-com prt-info-else" :class="['prt-info-0' + (index+1)]" >
            <div class="prt-flex">
              <div class="prt-txt">
                <h2>{{item.title}}</h2>
                <p>{{item.describe}}</p>
              </div>
              <i class="prt-icon"></i>
            </div>
            <button class="prt-btn btn-com" @click="doQuestions(item)">去做题</button>
          </div>
        </Col>
      </Row>
      <!-- 系统高频错题 自助练习 组卷模拟 -->
      <Row class="practice-wrap">
        <Col span="8" class="practice-item" v-for="(item, index) in plateList.slice(4, 7)" :key="index">
          <div class="prt-info-com prt-info-three" :class="['prt-info-0' + (index+5)]" >
            <div class="prt-txt">
              <h2>{{item.title}}</h2>
              <p>{{item.describe}}</p>
            </div>
            <button class="prt-btn btn-com" @click="doQuestions(item)">去做题</button>
          </div>
        </Col>
      </Row>
    </div>
    <!-- 6大板块弹窗 -->
    <div class="question-modal">
      <Modal v-model="visible"
        :width="795"
        footer-hide
        :title="plateTitle"
        class="practiceModal">
        <know-section v-if="plate_id == 1" :course_id="course_id" :user_id="user_id" :plate_id="plate_id" :sectionList="sectionList"></know-section>
        <jieduan-test v-if="plate_id == 2" :course_id="course_id" :user_id="user_id" :plate_id="plate_id" :courseList="courseList"></jieduan-test>
        <discuss-self v-if="plate_id == 3" :course_id="course_id" :user_id="user_id" :plate_id="plate_id" :courseList="courseList"></discuss-self>
        <error-section v-if="plate_id == 4" :course_id="course_id" :user_id="user_id" :plate_id="plate_id" :errorSecList="errorSecList"></error-section>
        <lianxi-self v-if="plate_id == 5" :course_id="course_id" :user_id="user_id" :plate_id="plate_id" :sectionList="sectionList"></lianxi-self>
        <group-lianxi v-if="plate_id == 6" :course_id="course_id" :user_id="user_id" :plate_id="plate_id" :volumeList="volumeList"></group-lianxi>
        <sprint-xly v-if="plate_id == 7" :course_id="course_id" :user_id="user_id" :plate_id="plate_id" :sprintCourseList="sprintCourseList"></sprint-xly>
      </Modal>
    </div>
    <!-- 预测评估 学员排名 -->
    <div class="qt-wrap-r fr">
      <div class="qt-wrap-r-top">
        <div class="calculate-info">
          <div class="cal-tit">
            <h2 class="title-com">我的排名</h2>
            <button class="btn-com" @click="nengLiPingGu">能力评估</button>
          </div>
          <div class="cal-num">
            {{questionResult.ranking || 0}}
          </div>
        </div>
        <ul class="my-question">
          <li class="mq-item" :class="['mq-item-0' + (index+1)]" v-for="(item, index) in personalTxtArr" :key="index" @click="goPersonalPage(index)">
            <i class="mq-icon"></i>
            <p>{{item}}</p>
          </li>
        </ul>
      </div>
      <div class="qt-wrap-r-bottom">
        <div class="students-rank">
          <h2 class="stu-rank-title title-com">学员排名</h2>
          <ul class="stu-rank-list">
            <li class="stu-rank-item" :class="['stu-rank-item0' + (index+1)]" v-for="(item, index) in studentsRankList" :key="index">
              <span class="sturi-num">{{index+1}}</span>
              <img :src="item.head" alt="" class="sturi-head">
              <div class="sturi-info">
                <h2>{{item.username}}</h2>
                <p>做题数量{{item.total_num}}道</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProject, questionIndex, studentsRanking, getSection, getCourse, getErrorsection, volumeList, sprintCourse } from '@/api/questions'
import knowSection from '../../components/questions/knowSection'
import jieduanTest from '../../components/questions/jieduanTest'
import discussSelf from '../../components/questions/discussSelf'
import errorSection from '../../components/questions/errorSection'
import lianxiSelf from '../../components/questions/lianxiSelf'
import groupLianxi from '../../components/questions/groupLianxi'
import sprintXly from '../../components/questions/sprintXly'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      projectArr: [], // 科目
      course_id: parseInt(window.sessionStorage.getItem('course_id')) || '',
      isSprintXly: 2, // 1展示2不展示冲刺训练营
      plateList: [
        {
          id: 1,
          title: '知识点练习',
          describe: '小节知识点训练'
        },
        {
          id: 2,
          title: '阶段测试',
          describe: '章节重点知识测试'
        },
        {
          id: 3,
          title: '论述题自测',
          describe: '论述题综合训练'
        },
        {
          id: 7,
          title: '冲刺训练营',
          describe: '考前系统冲刺训练'
        },
        {
          id: 4,
          title: '平台高频错题',
          describe: '全网高频错题收集'
        },
        {
          id: 5,
          title: '自助练习',
          describe: '薄弱知识点练习'
        },
        {
          id: 6,
          title: '组卷模考',
          describe: '经典试卷随机抽取'
        }
      ],
      personalTxtArr: ['答题记录', '我的错题', '收藏夹'],
      visible: false,
      plate_id: 0, // 显示弹窗对应模块
      plateTitle: '', // 显示弹窗对应模块title问案
      questionResult: {}, // 正确率，做题数，平均分
      studentsRankList: [], // 学生排名
      experience: true, // 0元体验
      sectionList: [], // 1、5板块
      courseList: [], // 2、3板块
      errorSecList: [], // 4板块
      volumeList: [], // 6板块
      sprintCourseList: [] // 7板块
    }
  },
  components: {
    knowSection,
    jieduanTest,
    discussSelf,
    errorSection,
    lianxiSelf,
    groupLianxi,
    sprintXly
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
    if (this.token) {
      if (this.isLoadHttpRequest) {
        this.projectList() // 已登录，获取课程列表
      } else {
        this.$watch('isLoadHttpRequest', function (val, oldVal) {
          this.projectList() // 已登录，获取课程列表
        })
      }
      return
    }
    this.getStudentsRanking() // 学员排名
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    // 展示课程
    projectList () {
      this.showLoading(true)
      getProject({
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          // 非0元体验
          if (res.data && res.data.length) {
            this.experience = false
            this.projectArr = res.data
            let array = this.projectArr
            for (let index = 0; index < array.length; index++) {
              if (array[index].id == this.course_id) {
                this.isSprintXly = array[index].status
                this.getQuestionIndex({
                  id: this.course_id,
                  status: this.isSprintXly
                })
                return
              }
            }
            this.course_id = this.projectArr[0].id
            this.isSprintXly = this.projectArr[0].status
            this.getQuestionIndex({
              id: this.course_id,
              status: this.isSprintXly
            })
          }
          // 0元体验
          if (this.experience) {
            this.getStudentsRanking()
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 课程对应正确率，做题数，平均分
    getQuestionIndex ({ id, status }, index) {
      this.course_id = id
      window.sessionStorage.setItem('course_id', id)
      this.isSprintXly = status
      if (!this.token) {
        this.$router.push({ path: '/login',
          query: {
            call_back: 'question'
          }
        })
        return
      }
      this.showLoading(true)
      questionIndex({
        user_id: this.user_id,
        course_id: id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.questionResult = res.data
          this.getStudentsRanking(this.course_id) // 学员排名
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 去做题 展示对应模块题库
    // async doQuestions ({ id, title }) {
    doQuestions ({ id, title }) {
      // await this.getUserInfo()
      this.plateTitle = title
      this.plate_id = id
      this.sectionList = [] // 1、5板块
      this.courseList = [] // 2、3板块
      this.errorSecList = [] // 4板块
      this.volumeList = [] // 6板块
      this.sprintCourseList = [] // 7板块
      if (id === 1 || id === 5) {
        this.getSectionList()
      }
      if (id === 2 || id === 3) {
        this.getCourseList()
      }
      if (id === 4) {
        this.getErrorsectionList()
      }
      if (id === 6) {
        this.getVolumeList()
      }
      if (id === 7) {
        this.getSprintCourseList()
      }
      this.visible = true
    },

    // 7大板块拿题
    // 1、5板块
    getSectionList () {
      this.showLoading(true)
      getSection({
        user_id: this.user_id,
        course_id: this.course_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.sectionList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 2、3板块
    getCourseList () {
      this.showLoading(true)
      getCourse({
        course_id: this.course_id,
        plate_id: this.plate_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.courseList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 4板块
    getErrorsectionList (val) {
      this.showLoading(true)
      getErrorsection({
        course_id: this.course_id,
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.errorSecList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 6板块
    getVolumeList (val) {
      this.showLoading(true)
      volumeList({
        course_id: this.course_id,
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.volumeList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 7板块
    getSprintCourseList () {
      this.showLoading(true)
      sprintCourse({
        course_id: this.course_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.sprintCourseList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 学员排名
    getStudentsRanking (id) {
      studentsRanking({
        course_id: id || '',
        limit: 10
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.studentsRankList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 能力评估
    nengLiPingGu () {
      if (!this.token) {
        this.$router.push({ path: '/login',
          query: {
            call_back: 'question'
          }
        })
        return
      }
      if (this.experience) {
        this.$Message.error('请购买课程')
        return
      }
      this.$router.push({ path: '/capacity-assessment',
        query: {
          course_id: this.course_id || 0
        }
      })
    },
    // 0元体验
    zExperienceTopic () {
      if (!this.user_id) {
        this.$router.push({ path: '/login',
          query: {
            call_back: 'question'
          }
        })
        return
      }
      this.$router.push({ path: '/dopotic-experience',
        query: {
          plate_id: 8 // 代表0元体验
        }
      })
    },
    // 个人中心
    goPersonalPage (index) {
      if (!this.token) {
        this.$router.push({ path: '/login',
          query: {
            call_back: 'question'
          }
        })
        return
      }
      if (this.experience) {
        this.$Message.error('请购买课程')
        return
      }
      window.sessionStorage.setItem('course_id', this.course_id)
      this.$router.push({ path: '/personal',
        query: {
          type: 'questions',
          selIdx: index
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    document.body.removeAttribute('style')
    this.visible = false
    next()
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  // @import "../../assets/scss/questions.css";
  .question-wrap{
    padding: 20px 0;
    // font-size: 14px;
    // line-height: 1;
    .qt-wrap-l{
      width: 895px;
    }
    .qt-wrap-r{
      width: 285px;
    }
  }
  .qt-subject{
    @include lh(60, 60);
    border-radius: 8px;
    background: $colfff;
    overflow: hidden;
  }
  .qt-course{
    text-align: center;
    font-size: 16px;
    color: $col999;
    cursor: pointer;
    &.curren{
      font-size: 20px;
      color: $col333;
    }
    // &:hover{
    //   font-size: 20px;
    //   color: $col333;
    // }
  }
  .qt-course-ty{
    font-size: 20px;
    padding-left: 20px;
    color: $col333;
  }
  // 答题详情 做题数正确率平均分
  .qt-answer-detail, .practice-wrap{
    margin-left: -20px;
  }
  .qt-subject, .practice-item, .qt-answer-detail{
    margin-bottom: 20px;
  }
  .qta-item{
    padding: 15px;
    width: 285px;
    height: 170px;
    margin-left: 20px;
    background: linear-gradient(130deg,rgba(251,172,120,1) 0%,rgba(252,120,115,1) 100%);
    border-radius: 8px;
    color: $colfff;
    box-sizing: border-box;
    text-align: center;
    position: relative;
    &:after{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      content: "";
    }
    &.qta-item01{
      &:after{
        @include bg-img(285, 67, '../../assets/images/questions/wave-bg01.png');
      }
    }
    &.qta-item02{
      &:after{
        @include bg-img(285, 78, '../../assets/images/questions/wave-bg02.png');
      }
      .tit{
        color: #8686FF;
      }
      background: linear-gradient(141deg,rgba(155,145,255,1) 0%,rgba(126,130,255,1) 100%);
    }
    &.qta-item03{
      &:after{
        @include bg-img(285, 93, '../../assets/images/questions/wave-bg03.png');
      }
      background: linear-gradient(150deg,rgba(255,147,147,1) 0%,rgba(255,79,79,1) 100%);
      .tit{
        color: #FF6565;
      }
    }
    .tit{
      width: 67px;
      height: 24px;
      line-height: 24px;
      display: block;
      background:rgba(255,255,255,1);
      border-radius: 13px;
      color: #FC8374;
      font-size: 16px;
    }
    .record{
      font-size: 36px;
      font-weight: bold;
      padding: 13px 0;
      em{
        font-size: 16px;
      }
    }
    .compare{
      line-height: 20px;
    }
  }
  // 知识点练习 系统高频错题等7个模块
  .prt-info-com{
    background: #ffffff;
    margin-left: 20px;
    padding: 23px 20px 21px 20px;
    border-radius: 8px;
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    &.prt-info{
      padding: 26px 30px;
    }
  }
  .prt-info{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .prt-info-three{
    background-color: #ffffff;
    background-repeat: no-repeat;
    background-position: right 50px;
    background-size: 80px 103px;
    &.prt-info-05{
      background-image: url('../../assets/images/questions/practice-icon05.png');
      background-size: 91px 102px;
    }
    &.prt-info-06{
      background-image: url('../../assets/images/questions/practice-icon06.png');
    }
    &.prt-info-07{
      background-image: url('../../assets/images/questions/practice-icon07.png');
    }
  }
  .prt-flex{
    width: 80%;
    display: flex;
    align-items: center;
  }
  .prt-icon{
    .prt-info-01 &{
      @include bg-img(40, 40, '../../assets/images/questions/practice-icon01.png');
    }
    .prt-info-02 &{
      @include bg-img(40, 40, '../../assets/images/questions/practice-icon02.png');
      background-size: 38px 28px;
    }
    .prt-info-03 &{
      @include bg-img(40, 40, '../../assets/images/questions/practice-icon03.png');
      background-size: 34px 37px;
    }
    .prt-info-04 &{
      @include bg-img(40, 40, '../../assets/images/questions/practice-icon04.png');
      background-size: 38px 47px;
    }
    .prt-info-08 &{
      @include bg-img(40, 40, '../../assets/images/questions/practice-icon08.png');
    }
  }
  .prt-txt{
    padding-left: 27px;
    flex: 1;
    .prt-info-else &, .prt-info-three &{
      padding-left: 0;
    }
    h2{
      font-size: 20px;
      line-height: 27px;
    }
    p{
      line-height: 22px;
      margin-top: 5px;
      font-size: 16px;
      color: $col999;
    }
  }
  .btn-com{
    .prt-info-else &, .prt-info &{
      color: $colfff;
      background: rgba(24,116,253,1);
    }
    .prt-info-else &, .prt-info-three &{
      margin-top: 30px;
    }
    .cal-tit &{
      width: 75px;
      height: 24px;
      &:hover{
        box-shadow: 0 0 0 0 transparent;
      }
    }
    .prt-info-com &:hover{
      box-shadow: 0px 2px 11px 0px rgba(0, 113, 230, 0.65);
    }
  }
  .ty-info{
    text-align: center;
    padding: 20px 0;
    .ty-icon{
      width: 110px;
      height: 101px;
    }
    .txt{
      font-size: 18px;
      line-height: 25px;
      font-weight: 500;
      margin-top: 18px;
    }
    .txt-red{
      color: #E84342;
      font-size: 16px;
      line-height: 22px;
      margin-top: 4px;
    }
  }

  // 预测评估 答题记录 错题 收藏
  .qt-wrap-r-top, .qt-wrap-r-bottom{
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .qt-wrap-r-bottom{
    padding-bottom: 4px;
  }
  .cal-tit{
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
      font-size: 18px;
    }
  }
  .cal-num{
    width: 136px;
    height: 136px;
    line-height: 136px;
    text-align: center;
    font-size: 34px;
    background: url('../../assets/images/questions/yc-num.png') no-repeat center;
    background-size: contain;
    margin: 0 auto;
    margin-top: 16px;
    margin-bottom: 16px;
    em{
      font-size: 14px;
    }
  }
  .my-question{
    display: flex;
    justify-content: space-between;
    text-align: center;
    .mq-item{
      cursor: pointer;
      p{
        color: $col999;
        margin-top: 11px;
      }
    }
  }
  .mq-icon{
    .mq-item-01 &{
      @include bg-img(33, 32, '../../assets/images/questions/yc-answer.png');
    }
    .mq-item-02 &{
      @include bg-img(28, 32, '../../assets/images/questions/yc-wrong.png');
    }
    .mq-item-03 &{
      @include bg-img(36, 32, '../../assets/images/questions/yc-collection.png');
    }
  }
  .stu-rank-list{
    padding-top: 10px;
    .stu-rank-title{
      font-size: 18px;
    }
  }
  .stu-rank-item{
    display: flex;
    align-items: center;
    padding: 10px 0;
    .sturi-head{
      width: 38px;
      height: 38px;
      border-radius: 100%;
      margin: 0 10px;
    }
    .sturi-info{
      h2{
        font-size: 16px;
      }
      p{
        margin-top: 5px;
      }
    }
  }
  .sturi-num{
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-size: 14px;
    color: $col999;
    .stu-rank-item01 &{
      color: transparent;
      @include bg-img(24, 24, '../../assets/images/questions/rank-icon01.png');
    }
    .stu-rank-item02 &{
      color: transparent;
      @include bg-img(24, 24, '../../assets/images/questions/rank-icon02.png');
    }
    .stu-rank-item03 &{
      color: transparent;
      @include bg-img(24, 24, '../../assets/images/questions/rank-icon03.png');
    }
  }
</style>
