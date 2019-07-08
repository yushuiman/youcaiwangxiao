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
        <potic-list ref="poticWrap" :topics="topics" :getQuestion="getQuestion" @answerQuestion="answerQuestion"></potic-list>
      </div>
      <div class="dptic-wrap-r fr">
        <div class="go-result-box">
          <button class="btn-com" @click="goResult">查看报告</button>
        </div>
        <div class="right-bottom-wrap">
          <div class="answer-card">
            <div class="title-com">
              <h2>答题卡</h2>
              <div class="anscard-sts">
                <i class="green-bg"></i>已掌握
                <i class="red-bg"></i>未掌握
              </div>
            </div>
            <ul class="anscard-list clearfix" >
              <li :class="{'red-bg': v.redCurren, 'green-bg': v.rightCurren}" v-for="(v, index) in topics" :key="index">{{index+1}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <Modal title="提问题" v-model="visibleAnswer" footer-hide :width="795">
      <upload-img v-if="visibleAnswer" :getQuestion="getQuestion"></upload-img>
    </Modal>
  </div>
</template>

<script>
import { questionParsing } from '@/api/questions'
import poticList from '../../components/poticList/poticList'
import uploadImg from '../../components/uploadImg'
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
        course_id: this.$route.query.course_id
      },
      visibleAnswer: false
    }
  },
  components: {
    poticList,
    uploadImg
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    this.getQuestionParsing()
  },
  methods: {
    getQuestionParsing () {
      questionParsing({
        paper_id: this.$route.query.paper_id,
        user_id: this.user_id,
        type: this.$route.query.type
      }).then(data => {
        const res = data.data
        this.topics = res.data.topics
        this.title = res.data.title
        this.topics.map((val, index) => {
          val.flag = false // 解析展开收起交互
          let userOptions = val.options[0].userOption // 用户答案 右边答题卡样式
          let trueOptions = val.options[0].right // 用户答案 右边答题卡样式
          if (userOptions !== '' && userOptions === trueOptions) {
            val.rightCurren = true
          }
          if (userOptions !== '' && userOptions !== trueOptions) {
            val.redCurren = true
          }
          val.options.map((v, index) => { // 易错答案
            if (val.eprone.indexOf(v.option) > -1) {
              v.eprone = true
            }
          })
        })
      })
    },
    goResult () {
      this.$router.push({ path: '/result-report',
        query: {
          paper_id: this.$route.query.paper_id,
          course_id: this.$route.query.course_id
        }
      })
    },
    answerQuestion (flag, qId) {
      this.visibleAnswer = flag
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
