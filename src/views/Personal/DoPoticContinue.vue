<template>
  <div>
    <div class="do-potic-wrap w-wrap clearfix" v-if="topics && topics.length">
      <div class="dptic-wrap-l fl">
        <div ref="fixedTit">
          <Row class="dptic-title">
            <Col span="20">
              <span class="menu-title">{{title}}</span>
            </Col>
            <Col span="4">
              <div class="answer-time" v-if="this.getQuestion.plate_id == 6">
                <count-down ref="reduceCountTime" @countdownend="countdownend" :time="answer_time">
                  <template slot-scope="props" >
                      0{{ props.totalHours }}:
                      {{ props.minutes }}:
                      {{ props.seconds }}
                    </template>
                </count-down>
              </div>
              <count-up ref="addCountTime" v-else></count-up>
            </Col>
          </Row>
        </div>
        <potic-list ref="poticWrap" :topics="topics" :total="total" :getQuestion="getQuestion" @doPoticInfo="doPoticInfo" @modalShow="modalShow" :ID="ID"></potic-list>
      </div>
      <div class="dptic-wrap-r fr">
        <div class="right-top-wrap">
          <h2 class="title-com">做题进度</h2>
          <div class="progress-info">
            <Progress :percent="percent" :stroke-width="10" stroke-color="#0267FF" hide-info/>
            <span class="topic-num"><em data-v-680035d5="">{{percentNum}}</em>/{{total}}</span>
          </div>
          <ul class="dopic-status">
            <li class="dopstu-item" :class="['dopstu-item-0' + (index+1)]" v-for="(v, index) in stsTxtArr" :key="index" @click="submitAnswers(v)">
              <span><i class="dopstu-icon"></i></span>
              <p>{{v}}</p>
            </li>
          </ul>
        </div>
        <div class="right-bottom-wrap">
          <div class="answer-card">
            <div class="title-com">
              <h2>答题卡</h2>
              <div class="anscard-sts" v-if="getQuestion.paper_mode == 1">
                <i class="green-bg"></i>已掌握
                <i class="red-bg"></i>未掌握
              </div>
            </div>
            <ul class="anscard-list clearfix" >
              <li :class="{'blue-bg': item.currenOption, 'red-bg': item.currenErrorRed, 'green-bg': item.currenRightGreen}" v-for="(item, index) in topics" :key="index" @click="goAnchor('#anchor-'+index)">
                {{index+1}}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Modal v-model="visible"
        :width="447"
        :mask-closable=false
        :closable=false
        footer-hide
        class="dopic-modal">
        <div class="stop-box" v-if="txtShow == '暂停'">
          <p>休息一下，马上回来</p>
          <div class="btn-box">
            <button class="btn-com" @click="goOnDopic('time')">继续做题</button>
          </div>
        </div>
        <div class="save-box" v-if="txtShow == '保存'">
          <p>保存进度，下次继续</p>
          <div class="btn-box">
            <button class="btn-com" @click="goOnDopic">继续</button>
            <button class="btn-com" @click="jiaojuan('save')">保存</button>
          </div>
        </div>
        <div class="jiaojuan-box" :class="{'jiaojuan-finish': percentNum == total}" v-if="txtShow == '交卷'">
          <div v-if="percentNum != total">
            <p>您还有试题没完成！</p>
            <div class="btn-box">
              <button class="btn-com" @click="goOnDopic">继续</button>
              <button class="btn-com" @click="jiaojuan('sub')">交卷</button>
            </div>
          </div>
          <div v-else>
            <p>确认提交试卷？</p>
            <div class="btn-box">
              <button class="btn-com" @click="goOnDopic">检查</button>
              <button class="btn-com" @click="jiaojuan('sub')">交卷</button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="纠错"
        v-model="visibleError"
        footer-hide
        :width="795"
        class="iview-modal">
        <error-correction v-if="visibleError" :getQuestion="getQuestion" @modalShow="modalShow"></error-correction>
      </Modal>
    </div>
  </div>
</template>

<script>
import { continueQuestion, getdtPapers } from '@/api/personal'
import poticList from '../../components/poticList/poticList'
import countDown from '../../components/count'
import countUp from '../../components/common/countUp'
import errorCorrection from '../../components/common/errorCorrection'
import { mapState } from 'vuex'
// import Cookies from 'js-cookie'
export default {
  data () {
    return {
      stsTxtArr: ['暂停', '保存', '交卷'],
      visible: false,
      visibleError: false, // 纠错show
      txtShow: '',
      topics: [], // 题列表
      answer_time: 0,
      timers: null,
      user_s: 0, // 用时秒数
      total: 0,
      title: '',
      percent: 0, // 百分比
      percentNum: 0, // 已做题数
      getQuestion: { // 拿题
        course_id: this.$route.query.course_id,
        paper_id: this.$route.query.paper_id, // 阶段测试,论述题
        section_id: this.$route.query.section_id,
        knob_id: this.$route.query.knob_id,
        know_id: this.$route.query.know_id,
        mock_id: this.$route.query.mock_id,
        plate_id: this.$route.query.plate_id,
        paper_mode: this.$route.query.paper_mode || 2 // 练习1 考试2
      },
      subTopics: { // 交卷
        id: this.$route.query.id,
        status: 1, // 交卷状态 1交卷 2保存
        course_id: this.$route.query.course_id,
        section_id: this.$route.query.section_id || 0,
        knob_id: this.$route.query.knob_id || 0,
        know_id: this.$route.query.know_id || 0,
        paper_id: this.$route.query.paper_id || 0, // 阶段测试,论述题
        mock_id: this.$route.query.mock_id || 0,
        plate_id: this.$route.query.plate_id, // 板块
        used_time: 0,
        paper_type: this.$route.query.paper_mode || 2, // 练习1 考试2
        question_content: {
          knob_id: this.$route.query.knob_id || 0,
          know_id: this.$route.query.know_id || 0,
          mock_id: this.$route.query.mock_id || 0,
          paper_id: this.$route.query.paper_id || 0, // 阶段测试,论述题
          question: []
        }
      },
      ID: '#anchor-0'
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  components: {
    poticList,
    countDown,
    countUp,
    errorCorrection
  },
  created () {
    this.prohibit()
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.getTopicList()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getTopicList()
      })
    }
    window.addEventListener('scroll', this.scrollToTop)
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
        if (scrollTop > 100) {
          this.$refs.fixedTit.style.position = 'fixed'
          this.$refs.fixedTit.style.top = 70 + 'px'
          this.$refs.fixedTit.style.width = 895 + 'px'
        } else {
          this.$refs.fixedTit.style = ''
        }
      }
    },
    goAnchor (selector) {
      var anchor = this.$el.querySelector(selector)
      setTimeout(() => {
        document.documentElement.scrollTop = document.body.scrollTop = anchor.offsetTop - 150
      }, 300)
    },
    // 已做题数量 右边进度条用
    doPoticInfo (num = 0, index = 0) {
      this.percentNum = num
      this.percent = this.percentNum / this.total * 100
      if (this.total === index) {
        return
      }
      if (index > 0) {
        this.goAnchor('#anchor-' + index)
      }
    },
    // 拿题
    getTopicList () {
      this.showLoading(true)
      continueQuestion({
        Id: this.$route.query.id,
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          let { topics, total, title } = res.data
          this.topics = topics
          this.total = parseInt(total)
          this.title = title
          this.answer_time = parseInt(res.data.answer_time) * 1000
          window.sessionStorage.setItem('answer_times', parseInt(res.data.answer_time))
          this.topics.map((val, index) => {
            val.analysis = false // 解析默认false，只有做错题的时候true(练习模式)
            val.flag = false // 解析展开收起交互(练习模式)
            val.currenOption = false // 点击当前题，不能重复选择(练习模式)
            val.userOption = val.discuss_useranswer
            val.options.forEach((v, index) => {
              if (v.option.indexOf(v.userOption) > -1 && v.userOption !== '') {
                val.currenOption = true // 答题卡蓝色
                v.selOption = true // 选项蓝色
              }
            })
            // 练习模式
            if (parseInt(this.getQuestion.paper_mode) === 1) {
              val.options.forEach((v, index) => {
                if (v.userOption !== '') {
                  if (v.option.indexOf(v.right) > -1) {
                    v.rightGreen = true // 遍历哪个是正确答案 对应添加rightGreen
                  }
                }
                if (v.option.indexOf(v.userOption) > -1 && v.userOption !== '') {
                  v.errorRed = false // 初始化当前选项答错状态
                  if (v.userOption === v.right) { // 判断当前点击的选项是否正确
                    v.rightGreen = true // 答对当前选项绿色
                    val.currenRightGreen = true // 答对：右边选项卡对应添加绿色已掌握状态
                    this.$forceUpdate()
                  } else {
                    v.errorRed = true // 答错当前选项红色
                    val.currenErrorRed = true // 答错：右边选项卡对应添加红色未掌握状态
                    val.analysis = true // 答错，解析展示
                    this.$forceUpdate()
                  }
                }
              })
            }
          })
          let num = this.topics.filter((v) => { // 已做题数
            return v.currenOption
          })
          this.doPoticInfo(num.length)
          // 拿到题，开始倒计时
          if (parseInt(this.getQuestion.plate_id) === 6) {
            this.timerDown()
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 组卷末考倒计时
    timerDown () {
      this.timers = setInterval(() => {
        this.user_s = this.user_s + 1
      }, 1000)
    },
    // 交卷 保存 暂停
    submitAnswers (v) {
      this.visible = true
      this.txtShow = v
      if (v === '暂停') {
        if (parseInt(this.getQuestion.plate_id) === 6) { // 组卷模考 为倒计时 其他为正计时
          this.$refs.reduceCountTime.pause()
          clearInterval(this.timers)
          return
        }
        this.$refs.addCountTime.stop()
      }
    },
    // 继续
    goOnDopic (type) {
      this.visible = false
      if (type === 'time') {
        if (parseInt(this.getQuestion.plate_id) === 6) { // 组卷模考 为倒计时 其他为正计时
          this.$refs.reduceCountTime.start()
          this.timerDown()
          return
        }
        this.$refs.addCountTime.start()
      }
    },
    // 倒计时结束 自动提交答案
    countdownend () {
      this.jiaojuan('sub')
    },
    // 交卷
    jiaojuan (type) {
      this.visible = false
      this.subTopics.question_content.question = []
      for (var i = 0; i < this.topics.length; i++) {
        this.subTopics.question_content.question.push({
          question_id: this.topics[i].ID,
          true_options: this.topics[i].options[0].right,
          user_answer: this.topics[i].userOption || ''
        })
      }
      this.subTopics.user_id = this.user_id
      if (parseInt(this.getQuestion.plate_id) === 6) {
        this.subTopics.used_time = this.user_s
      } else {
        this.subTopics.used_time = this.$refs.addCountTime.userAnswerTime
      }
      if (type === 'save') {
        this.subTopics.status = 2
      }
      this.subGetdtPapers(type)
    },
    subGetdtPapers (type) {
      window.sessionStorage.setItem('subTopics', JSON.stringify(this.subTopics))
      window.sessionStorage.setItem('diffTxt', 10) // 区分查看报告按钮，返回个人中心
      window.sessionStorage.setItem('diffRes', '') // 区分不同接口请求
      this.showLoading(true)
      getdtPapers(this.subTopics).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          // 保存之后跳转到题库页面
          if (type === 'save') {
            this.$router.push('/question')
            return
          }
          this.$router.push({ path: '/result-report',
            query: {
              paper_id: res.data.paper_id,
              course_id: this.getQuestion.course_id
            }
          })
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 纠错显示
    modalShow (flag, qId) {
      this.visibleError = flag
      this.getQuestion.question_id = qId
    }
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollToTop)
    if (this.timers) {
      clearInterval(this.timers)
    }
    window.sessionStorage.removeItem('answer_times')
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/dopotic";
</style>
