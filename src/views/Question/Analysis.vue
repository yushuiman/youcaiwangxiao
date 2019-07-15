<template>
  <div>
    <div class="do-potic-wrap w-wrap clearfix">
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
          <button class="btn-com" @click="goPersonal" v-if="getQuestion.plate_id == 3">返回做题记录</button>
          <!-- 其他板块 -->
          <button class="btn-com" @click="goResult" v-else>查看报告</button>
        </div>
        <div class="right-bottom-wrap">
          <div class="answer-card">
            <div class="title-com">
              <h2>答题卡</h2>
              <!-- 论述题 -->
              <div class="anscard-sts" v-if="getQuestion.plate_id == 3">
                <i class="blue-bg"></i>已做
                <i class="white-bg"></i>未做
              </div>
              <!-- 其他板块 -->
              <div class="anscard-sts" v-else>
                <i class="green-bg"></i>已掌握
                <i class="red-bg"></i>未掌握
              </div>
            </div>
            <ul class="anscard-list clearfix" >
              <li :class="{'red-bg': v.redCurren, 'green-bg': v.rightCurren, 'blue-bg': v.discuss_useranswer}" v-for="(v, index) in topics" :key="index">{{index+1}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <Modal
      :title="typeShow=='dy'? '提问题':'纠错'"
      v-model="visible"
      footer-hide
      :width="795"
      class="iview-modal">
      <upload-img v-if="visible && typeShow == 'dy'" :getQuestion="getQuestion"></upload-img>
      <error-correction v-if="visible && typeShow == 'jc'" :getQuestion="getQuestion" @modalShow="modalShow"></error-correction>
    </Modal>
  </div>
</template>

<script>
import { questionParsing, experienceParsing, checkItem } from '@/api/questions'
import poticList from '../../components/poticList/poticList'
import uploadImg from '../../components/common/uploadImg'
import errorCorrection from '../../components/common/errorCorrection'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      topics: [],
      title: '',
      getQuestion: {
        paper_mode: '',
        jiexi: 1,
        question_id: '',
        course_id: this.$route.query.course_id,
        plate_id: this.$route.query.plate_id
      },
      visible: false,
      typeShow: false // 答疑dy，纠错jc
    }
  },
  components: {
    poticList,
    uploadImg,
    errorCorrection
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    // 0元体验解析
    if (parseInt(this.$route.query.plate_id) === 8) {
      this.getExperienceParsing()
      return
    }
    // 答题记录(论述题)解析， 其实和6大板块的论述题解析一模一样，后台说怕后期修改，就新增一个接口
    if (parseInt(this.$route.query.jiexi) === 2) {
      this.getCheckItem()
      return
    }
    // 6大板块解析
    this.getQuestionParsing()
  },
  methods: {
    // 6大板块解析
    getQuestionParsing () {
      questionParsing({
        paper_id: this.$route.query.paper_id,
        user_id: this.user_id,
        type: this.$route.query.type
      }).then(data => {
        const res = data.data
        this.topics = res.data.topics
        this.title = res.data.title
        this.answerSts(this.topics)
      })
    },
    // 0元体验解析
    getExperienceParsing () {
      let obj = JSON.parse(window.localStorage.getItem('experienceStatiInfo'))
      experienceParsing({
        type: this.$route.query.type,
        user_id: this.user_id,
        question_content: obj.question_content
      }).then(data => {
        const res = data.data
        this.topics = res.data.topics
        this.title = res.data.title
        this.answerSts(this.topics)
      })
    },
    // 答题记录论述题解析
    getCheckItem () {
      checkItem({
        paper_id: this.$route.query.paper_id,
        user_id: this.user_id,
        type: this.$route.query.type
      }).then(data => {
        const res = data.data
        this.topics = res.data.topics
        this.title = res.data.title
        this.answerSts(this.topics)
      })
    },
    // 答题卡状态，问题列表状态（解析，用户答案）
    answerSts (topics) {
      if (topics && topics.length) {
        topics.map((val, index) => {
          val.flag = false // 解析展开收起交互
          if (parseInt(this.$route.query.plate_id) === 3) { // 论述题解析不需要下面的逻辑
            return
          }
          let userOptions = val.options[0].userOption // 用户答案
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
      }
    },
    goResult () {
      this.$router.push({ path: '/result-report',
        query: {
          paper_id: this.$route.query.paper_id,
          course_id: this.$route.query.course_id,
          plate_id: this.$route.query.plate_id
        }
      })
    },
    goPersonal () {
      this.$router.push({ path: '/personal',
        query: {
          type: 'questions',
          course_id: this.$route.query.course_id
        }
      })
    },
    modalShow (flag, qId, type) {
      this.visible = flag
      this.typeShow = type
      this.getQuestion.question_id = qId
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .do-potic-wrap{
    padding: 20px 0;
    font-size: 18px;
    color: $col666;
    .dptic-wrap-l{
      width: 895px;
    }
    .dptic-wrap-r{
      width: 285px;
      position: fixed;
      top: 90px;
      margin-left: 915px;
    }
  }
  // 封装start
  .right-bottom-wrap{
    background: $colfff;
    margin-bottom: 20px;
    padding: 20px;
  }
  .title-com{
    font-size: 18px;
    color: $col333;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
   // 封装end
  .dptic-title{
    padding: 0 20px;
    @include lh(60, 60);
    border-radius: 8px;
    background: $colfff;
    margin-bottom: 20px;
    box-sizing: border-box;
    .menu-title{
      color: $col333;
      font-size: 20px;
    }
  }
  .go-result-box{
    text-align: center;
    padding: 12px 0;
    margin-bottom: 20px;
    .btn-com{
      width: 141px;
      height: 37px;
      border-radius: 19px;
      font-size: 18px;
    }
  }
 // 右边做题状态
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
  .anscard-list{
    padding-top: 10px;
    height: 426px;
    li{
      float: left;
      width: 28px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 1px solid $col666;
      border-radius: 14px;
      margin: 10px;
      &.blue-bg, &.red-bg, &.green-bg{
        border: 0;
        color: $colfff;
      }
      &.blue-bg{
        background: #3485FF;
      }
      &.red-bg{
        background: #ED7171;
      }
      &.green-bg{
        background: #47BF7F;
      }
    }
  }
</style>
