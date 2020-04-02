<template>
  <div class="do-potic-mian">
    <div class="do-potic-wrap w-wrap clearfix" v-if="topics && topics.length">
      <div class="dptic-wrap-l fl">
        <div ref="fixedTit">
          <Row class="dptic-title">
            <Col span="24">
              <span class="menu-title">{{title}}</span>
            </Col>
          </Row>
        </div>
        <potic-list ref="poticWrap" :topics="topics" :getQuestion="getQuestion" @modalShow="modalShow"></potic-list>
      </div>
      <div class="dptic-wrap-r fr">
        <div class="go-result-box">
          <!-- 论述题 -->
          <button class="btn-com" @click="goPersonal" v-if="getQuestion.paper_type == 2">返回做题记录</button>
          <!-- 其他板块 包含个人中心 1错题集 2做题记录 3收藏夹-->
          <button class="btn-com" @click="goResult" v-else>{{txtSts[diffTxt]}}</button>
        </div>
        <div class="right-bottom-wrap">
          <div class="answer-card" v-if="getQuestion.paper_type == 2">
            <div class="title-com">
              <h2>答题卡</h2>
              <!-- 论述题 -->
              <div class="anscard-sts">
                <i class="blue-bg"></i>已做
                <i class="white-bg"></i>未做
              </div>
            </div>
            <ul class="anscard-list clearfix">
              <li :class="{'blue-bg': v.discuss_useranswer}" v-for="(v, index) in topics" :key="index" @click="goAnchor('#anchor-'+index)">{{index+1}}</li>
            </ul>
          </div>
          <div class="answer-card" v-else>
            <!-- 其他板块 -->
            <div class="title-com">
              <h2>答题卡</h2>
              <div class="anscard-sts">
                <i class="green-bg"></i>已掌握
                <i class="red-bg"></i>未掌握
              </div>
            </div>
            <ul class="anscard-list clearfix">
              <li :class="{'red-bg': v.redCurren, 'green-bg': v.rightCurren}" v-for="(v, index) in topics" :key="index" @click="goAnchor('#anchor-'+index)">{{index+1}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="no-data" v-if="noDataFlag">
      暂无数据
    </div>
    <Modal
      :title="typeShow=='dy'? '提问题':'纠错'"
      v-model="visible"
      footer-hide
      :width="795"
      :scrollable="true"
      @on-visible-change="modalQueVisible"
      class="iview-modal">
      <upload-img v-if="typeShow == 'dy'" :getQuestion="getQuestion" @modalShow="modalShow"></upload-img>
      <error-correction v-if="typeShow == 'jc'" :getQuestion="getQuestion" @modalShow="modalShow"></error-correction>
    </Modal>
  </div>
</template>

<script>
import { questionParsing, experienceParsing, checkItem } from '@/api/questions'
import { errorParsing, error2Parsing, myCollcsee } from '@/api/personal'
import { questionParsingLearn } from '@/api/learncenter'
import poticList from '../../components/poticList/poticList'
import uploadImg from '../../components/analysis/askQuestion'
import errorCorrection from '../../components/common/errorCorrection'
import $ from 'jquery'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      txtSts: {
        0: '返回做题记录',
        1: '返回错题集',
        2: '返回收藏夹',
        3: '返回学习中心',
        10: '查看报告'
      },
      diffRes: parseInt(window.sessionStorage.getItem('diffRes')), // 请求不同的接口
      diffTxt: parseInt(window.sessionStorage.getItem('diffTxt')), // 请求不同的接口
      topics: [],
      noDataFlag: false,
      title: '',
      getQuestion: {
        jiexi: 1,
        question_id: 0, // 题id
        course_id: this.$route.query.course_id,
        plate_id: this.$route.query.plate_id,
        sc: this.$route.query.sc,
        paper_type: this.$route.query.paper_type || 1
      },
      visible: false,
      typeShow: '', // 答疑dy，纠错jc
      dataStorage: JSON.parse(window.sessionStorage.getItem('subTopics'))
    }
  },
  components: {
    poticList,
    uploadImg,
    errorCorrection
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  created () {
    this.prohibit()
  },
  mounted () {
    window.addEventListener('scroll', this.scrollToTop)
    if (this.isLoadHttpRequest) {
      // 0元体验解析
      if (this.getQuestion.plate_id == 8 && this.diffRes !== 3) {
        this.getExperienceParsing()
        return
      }
      // 个人中心答题记录做题集(论述题)解析
      if (this.diffRes === 0) {
        this.getCheckItem()
        return
      }
      // 个人中心错题集解析，全部
      if (this.diffRes === 1) {
        this.getErrorParsing()
        return
      }
      // 错题集记录去做题后解析，全部和错题
      if (this.diffRes === 11) {
        this.getErrorParsing2()
        return
      }
      // 收藏夹查看解析
      if (this.diffRes === 2) {
        this.getMyCollcsee()
        return
      }
      // 学习中心查看解析-全部
      if (this.diffRes === 3) {
        this.getQuestionParsingLearn()
        return
      }
      // 6大板块解析
      this.getQuestionParsing()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        // 0元体验解析 之前没有考虑这么周全，需求一点点增加，不想改变已有的逻辑了
        if (this.getQuestion.plate_id == 8 && this.diffRes !== 3) {
          this.getExperienceParsing()
          return
        }
        // 个人中心答题记录做题集(论述题)解析
        if (this.diffRes === 0) {
          this.getCheckItem()
          return
        }
        // 个人中心错题集解析，全部
        if (this.diffRes === 1) {
          this.getErrorParsing()
          return
        }
        // 错题集记录去做题后解析，全部和错题
        if (this.diffRes === 11) {
          this.getErrorParsing2()
          return
        }
        // 收藏夹查看解析
        if (this.diffRes === 2) {
          this.getMyCollcsee()
          return
        }
        // 学习中心查看解析-全部
        if (this.diffRes === 3) {
          this.getQuestionParsingLearn()
          return
        }
        // 6大板块解析
        this.getQuestionParsing()
      })
    }
  },
  methods: {
    prohibit () { // 禁用鼠标右击、F12
      document.oncontextmenu = function () {
        return false
      }
      document.onkeydown = function (e) {
        if (e.ctrlKey && (e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 80 || e.keyCode === 83 || e.keyCode === 85 || e.keyCode === 86 || e.keyCode === 117)) {
          return false
        }
        if (e.keyCode === 18 || e.keyCode === 123) {
          return false
        }
      }
    },
    scrollToTop () {
      if (this.$refs.fixedTit) {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop > 50) {
          this.$refs.fixedTit.style.position = 'fixed'
          this.$refs.fixedTit.style.top = 60 + 'px'
          this.$refs.fixedTit.style.width = 895 + 'px'
        } else {
          this.$refs.fixedTit.style = ''
        }
      }
    },
    goAnchor (selector) {
      var anchor = this.$el.querySelector(selector)
      $('html, body').stop().animate({
        scrollTop: anchor.offsetTop - 150
      }, 500)
    },
    // 6大板块解析
    getQuestionParsing () {
      this.showLoading(true)
      questionParsing({
        paper_id: this.$route.query.paper_id,
        user_id: this.user_id,
        type: this.$route.query.type
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.topics = res.data.topics
          this.title = res.data.title
          this.answerSts(this.topics)
        } else if (res.code === 405) {
          this.answerSts(this.topics)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 0元体验解析
    getExperienceParsing () {
      let obj = JSON.parse(window.sessionStorage.getItem('experienceStatiInfo'))
      this.showLoading(true)
      experienceParsing({
        type: this.$route.query.type,
        user_id: this.user_id,
        question_content: obj.question_content
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.topics = res.data.topics
          this.title = res.data.title
          this.answerSts(this.topics)
        } else if (res.code === 405) {
          this.answerSts(this.topics)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 答题记录论述题解析
    getCheckItem () {
      this.showLoading(true)
      checkItem({
        paper_id: this.$route.query.paper_id,
        user_id: this.user_id,
        type: this.$route.query.type
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.topics = res.data.topics
          this.title = res.data.title
          this.answerSts(this.topics)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 错题集查看解析 全部
    getErrorParsing (val) {
      this.showLoading(true)
      errorParsing({
        section_id: this.dataStorage.section_id,
        course_id: this.dataStorage.course_id,
        know_id: this.dataStorage.know_id,
        knob_id: this.dataStorage.knob_id,
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.topics = res.data.topics
          this.title = res.data.title
          this.answerSts(this.topics)
        } else if (res.code === 405) {
          this.answerSts(this.topics)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 错题集继续做题,交卷后-报告页面，查看解析,全部-错题
    getErrorParsing2 (val) {
      this.showLoading(true)
      error2Parsing({
        type: this.$route.query.type,
        section_id: this.dataStorage.section_id,
        course_id: this.dataStorage.course_id,
        know_id: this.dataStorage.know_id,
        user_id: this.user_id,
        question_content: this.dataStorage.question_content.question
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.topics = res.data.topics
          this.title = res.data.title
          this.answerSts(this.topics)
        } else if (res.code === 405) {
          this.answerSts(this.topics)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 学习计划全部解析
    getQuestionParsingLearn () {
      this.showLoading(true)
      questionParsingLearn({
        paper_id: this.$route.query.paper_id,
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.topics = res.data.topics
          this.title = res.data.title
          this.answerSts(this.topics)
        } else if (res.code === 405) {
          this.answerSts(this.topics)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 收藏夹
    getMyCollcsee (val) {
      this.showLoading(true)
      myCollcsee({
        user_id: this.user_id,
        course_id: this.dataStorage.course_id,
        section_id: this.dataStorage.section_id,
        know_id: this.dataStorage.know_id,
        knob_id: this.dataStorage.knob_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.topics = res.data.topics
          this.title = res.data.title
          this.answerSts(this.topics)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 答题卡状态，问题列表状态（解析，用户答案）
    answerSts (topics) {
      if (topics.length === 0) {
        this.noDataFlag = true
        return
      }
      topics.map((val, index) => {
        val.flag = false // 解析展开收起交互
        if (this.getQuestion.paper_type === 2) { // 论述题解析不需要下面的逻辑
          return
        }
        let userOptions = val.options[0].userOption || val.discuss_useranswer // 用户答案
        let trueOptions = val.options[0].right // 正确答案
        if (userOptions !== '' && userOptions === trueOptions) {
          val.rightCurren = true
        }
        if (userOptions !== '' && userOptions !== trueOptions) {
          val.redCurren = true
        }
        val.options.forEach((v, index) => {
          if (val.eprone.indexOf(v.option) > -1) {
            v.eprone = true // 易错答案
          }
          if (v.option.indexOf(userOptions) > -1 && userOptions !== '') {
            v.errorRed = true // 用户答案 答错选项红色
          }
          if (v.option === v.right) {
            v.rightGreen = true // 正确答案 选项添加绿色
          }
        })
      })
    },
    goResult () {
      // 如果是错题中心，查看报告
      if (this.diffTxt === 0 || this.diffTxt === 1 || this.diffTxt === 2) {
        this.$router.push({ path: '/personal',
          query: {
            type: 'questions',
            selIdx: this.diffTxt
          }
        })
        return
      }
      // 如果是学习中心
      if (this.diffTxt === 3) {
        this.$router.push({ path: '/learning-center-detail' })
        return
      }
      // 正常回到查看报告页
      this.$router.push({ path: '/result-report',
        query: {
          paper_id: this.$route.query.paper_id,
          course_id: this.$route.query.course_id,
          plate_id: this.$route.query.plate_id
        }
      })
    },
    // 论述题
    goPersonal () {
      this.$router.push({ path: '/personal',
        query: {
          type: 'questions'
        }
      })
    },
    modalShow (flag, qId, type) {
      this.visible = flag
      if (this.visible) {
        this.typeShow = type
      } else {
        this.typeShow = ''
      }
      this.getQuestion.question_id = qId
    },
    modalQueVisible (val) {
      document.body.removeAttribute('style')
      if (!val) {
        this.visible = false
        this.typeShow = ''
      }
    }
  },
  beforeDestroy () {
    document.oncontextmenu = undefined
    document.onkeydown = undefined
    window.removeEventListener('scroll', this.scrollToTop)
    document.oncontextmenu = undefined
    document.onkeydown = undefined
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  @import "../../assets/scss/dopotic";
//  // 右边做题状态
  .anscard-sts{
    i{
      width: 10px;
      height: 10px;
      border-radius: 1px;
      vertical-align: middle;
      margin-top: -3px;
      margin-right: 6px;
      display: inline-block;
      &.red-bg{
        margin-left: 20px;
        background: #ED7171;
      }
      &.green-bg{
        background: #47BF7F;
      }
      &.blue-bg{
        background: #3485FF;
      }
      &.white-bg{
        border: 1px solid $col666;
        margin-left: 20px;
      }
    }
  }
</style>
