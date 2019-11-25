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
              <count-up ref="addCountTime"></count-up>
            </Col>
          </Row>
        </div>
        <potic-list ref="poticWrap" :topics="topics" :getQuestion="getQuestion" :total="total" @doPoticInfo="doPoticInfo" :ID="ID"></potic-list>
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
            </div>
            <ul class="anscard-list clearfix" >
              <li :class="{'blue-bg': item.userOption, 'red-bg': item.currenErrorRed, 'green-bg': item.currenRightGreen}" v-for="(item, index) in topics" :key="index" @click="goAnchor('#anchor-'+index)">
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
    </div>
    <div class="no-data" v-else>
      暂无数据
    </div>
  </div>
</template>

<script>
import { zExperience, experienceStati } from '@/api/questions'
import poticList from '../../components/poticList/poticList'
import countUp from '../../components/common/countUp'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      stsTxtArr: ['暂停', '交卷'],
      visible: false,
      visibleError: false, // 纠错show
      txtShow: '',
      topics: [], // 题列表
      answer_time: 0,
      total: 0,
      title: '',
      percent: 0, // 百分比
      percentNum: 0, // 已做题数
      getQuestion: {
        course_id: this.$route.query.course_id,
        paper_id: this.$route.query.paper_id,
        section_id: this.$route.query.section_id,
        knob_id: this.$route.query.knob_id,
        know_id: this.$route.query.know_id,
        mock_id: this.$route.query.mock_id,
        plate_id: this.$route.query.plate_id,
        paper_type: 2 // 体验考试模式
      },
      experienceTopics: {
        used_time: 0,
        question_content: [] // 交卷信息
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
    countUp
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.getZExperience()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getZExperience()
      })
    }
    window.addEventListener('scroll', this.scrollToTop)
  },
  methods: {
    scrollToTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 100) {
        this.$refs.fixedTit.style.position = 'fixed'
        this.$refs.fixedTit.style.top = 70 + 'px'
        this.$refs.fixedTit.style.width = 895 + 'px'
      } else {
        if (scrollTop > 0) {
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
    doPoticInfo (num = 0, index = 0) {
      this.percentNum = num
      this.percent = this.percentNum / this.total * 100
      if (this.total === index) {
        return
      }
      this.goAnchor('#anchor-' + index)
    },
    // 0元体验拿题
    getZExperience () {
      zExperience({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          let { topics, total, title } = res.data
          this.topics = topics
          this.total = parseInt(total)
          this.title = title
          this.answer_time = res.data.answer_time // 0元体验没有用到
          if (res.data && res.data.length) {
            this.topics.map((val, index) => {
              val.analysis = false // 解析默认false，只有做错题的时候true(练习模式)
              val.flag = false // 解析展开收起交互(练习模式)
              val.currenOption = false // 点击当前题，不能重复选择(练习模式)
              val.userOption = ''
              val.options.map((v, index) => {
                v.selOption = false // 选择当前选项变蓝色，其他默认颜色，可以重复选择(除了练习模式，都是这个逻辑)
              })
            })
          }
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
    // 保存
    saveDopic () {

    },
    // 交卷
    jiaojuan () {
      // 未做题，直接点击交卷，做题信息user_answer=‘’
      for (var j = 0; j < this.topics.length; j++) {
        this.experienceTopics.question_content.push({
          question_id: this.topics[j].ID,
          true_options: this.topics[j].options[0].right,
          user_answer: this.topics[j].userOption || ''
        })
      }
      this.visible = false
      this.experienceTopics.user_id = this.user_id
      this.experienceTopics.used_time = this.$refs.addCountTime.userAnswerTime
      this.getExperienceStati()
    },
    getExperienceStati () {
      window.sessionStorage.setItem('diffTxt', 10) // 区分查看报告按钮，返回个人中心
      window.sessionStorage.setItem('diffRes', '') // 区分接口请求
      experienceStati(this.experienceTopics).then(data => {
        const res = data.data
        if (res.code === 200) {
          window.sessionStorage.setItem('experienceStatiInfo', JSON.stringify(res.data))
          this.$router.push({ path: '/result-report',
            query: {
              plate_id: this.$route.query.plate_id
            }
          })
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollToTop)
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/dopotic";
</style>
