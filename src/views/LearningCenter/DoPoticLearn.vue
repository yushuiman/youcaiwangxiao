<template>
  <div>
    <div class="do-potic-wrap w-wrap clearfix" v-if="topics.length">
      <div class="dptic-wrap-l fl">
        <div ref="fixedTit">
          <Row class="dptic-title">
            <Col span="20">
              <span class="menu-title">{{title}}</span>
            </Col>
            <Col span="4">
              <count-up ref="addCountTime"></count-up>
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
            <li></li>
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
        <!-- <div class="save-box" v-if="txtShow == '保存'">
          <p>保存进度，下次继续</p>
          <div class="btn-box">
            <button class="btn-com" @click="goOnDopic">继续</button>
            <button class="btn-com" @click="jiaojuan('save')">保存</button>
          </div>
        </div> -->
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
    <div class="no-data" v-if="noDataFlag">
      暂无数据
    </div>
  </div>
</template>

<script>
import { withTopic, getPaper } from '@/api/learncenter'
import poticList from '../../components/poticList/poticList'
import countUp from '../../components/common/countUp'
import errorCorrection from '../../components/common/errorCorrection'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      stsTxtArr: ['暂停', '交卷'],
      visible: false,
      visibleError: false, // 纠错show
      txtShow: '',
      noDataFlag: false,
      topics: [], // 题列表
      answer_time: 0,
      user_s: 0, // 用时秒数
      total: 0,
      title: '',
      percent: 0, // 百分比
      percentNum: 0, // 已做题数
      getQuestion: JSON.parse(window.sessionStorage.getItem('getQuestion')),
      subTopics: { // 交卷
        status: 1, // 交卷状态 1交卷 2保存
        course_id: 0,
        used_time: 0,
        question_content: {
          knob_id: 0,
          know_id: 0,
          mock_id: 0,
          paper_id: 0, // 阶段测试3,论述题2
          question: []
        },
        video_name: ''
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
    countUp,
    errorCorrection
  },
  created () {
    this.this.prohibit()
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
        document.documentElement.scrollTop = anchor.offsetTop - 150
      }, 300)
    },
    // 已做题数量 右边进度条用
    doPoticInfo (num = 0, index) {
      this.percentNum = num
      this.percent = this.percentNum / this.total * 100
      if (this.total === index) {
        return
      }
      this.goAnchor('#anchor-' + index)
    },
    // 拿题
    getTopicList () {
      this.getQuestion.user_id = this.user_id
      this.showLoading(true)
      withTopic({
        user_id: this.user_id,
        know_id: this.getQuestion.know_id,
        video_name: this.getQuestion.video_name
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          let { topics, total, title } = res.data
          this.topics = topics
          this.total = parseInt(total)
          this.title = title
          this.answer_time = parseInt(res.data.answer_time) * 1000
          if (this.topics.length === 0) {
            this.noDataFlag = true
            return
          }
          this.topics.map((val, index) => {
            val.analysis = false // 解析默认false，只有做错题的时候true(练习模式)
            val.flag = false // 解析展开收起交互(练习模式)
            val.currenOption = false // 点击当前题，不能重复选择(练习模式)
            val.userOption = ''
            val.options.map((v, index) => {
              v.selOption = false // 选择当前选项变蓝色，其他默认颜色，可以重复选择(除了练习模式，都是这个逻辑)
            })
          })
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 交卷 保存 暂停
    submitAnswers (v) {
      this.visible = true
      this.txtShow = v
      if (v === '暂停') {
        this.$refs.addCountTime.stop()
      }
    },
    // 继续
    goOnDopic (type) {
      this.visible = false
      if (type === 'time') {
        this.$refs.addCountTime.start()
      }
    },
    // 交卷
    jiaojuan (type) {
      this.visible = false
      this.subTopics.question_content.question = []
      for (var i = 0; i < this.topics.length; i++) {
        this.subTopics.question_content.question.push({
          question_id: this.topics[i].ID,
          true_options: this.topics[i].options[0].right,
          user_answer: this.topics[i].discuss_useranswer || this.topics[i].userOption
        })
      }

      this.subTopics.user_id = this.user_id
      this.subTopics.course_id = this.getQuestion.course_id
      this.subTopics.video_name = this.getQuestion.video_name
      this.subTopics.used_time = this.$refs.addCountTime.userAnswerTime
      this.subTopics.question_content.know_id = this.getQuestion.know_id
      // if (type === 'save') {
      //   this.subTopics.status = 2
      // }
      this.subGetPapers(type)
    },
    subGetPapers (type) {
      window.sessionStorage.setItem('diffTxt', 3) // 区分查看报告按钮，返回个人中心
      window.sessionStorage.setItem('diffRes', 3) // 区分接口请求
      this.showLoading(true)
      getPaper(this.subTopics).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          // if (type === 'save') {
          //   this.$router.push('/learning-center-detail')
          //   return
          // }
          // this.$router.push({ path: '/result-report',
          //   query: {
          //     paper_id: res.data.paper_id,
          //     course_id: this.getQuestion.course_id
          //   }
          // })
          let obj = {
            paper_id: res.data.paper_id,
            course_id: this.getQuestion.course_id,
            plate_id: this.getQuestion.plate_id
          }
          // if(){
          //   obj.plate_id = 8
          // }
          this.$router.push({ path: '/analysis',
            query: obj
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
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  // @import "../../assets/scss/app";
  @import "../../assets/scss/dopotic";
</style>
