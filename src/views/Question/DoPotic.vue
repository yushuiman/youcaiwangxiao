<template>
  <div>
    <div class="do-potic-wrap w-wrap clearfix" v-if="topics && topics.length">
      <div class="dptic-wrap-l fl">
        <div ref="fixedTit">
          <Row class="dptic-title">
            <Col span="22">
              <span class="menu-title">{{title}}</span>
            </Col>
            <Col span="2">
              <div class="answer-time">
                {{answer_time}}
              </div>
            </Col>
          </Row>
        </div>
        <potic-list ref="poticWrap" :topics="topics" :total="total" :getQuestion="getQuestion" @doPoticInfo="doPoticInfo" :ID="ID"></potic-list>
      </div>
      <div class="dptic-wrap-r fr">
        <div class="right-top-wrap">
          <h2 class="title-com">做题进度</h2>
          <div class="progress-info">
            <Progress :percent="percent" :stroke-width="10" stroke-color="#0267FF" hide-info/>
            <span class="topic-num"><em data-v-680035d5="">{{percentNum}}</em>/{{total}}</span>
          </div>
          <ul class="dopic-status">
            <li class="dopstu-item dopstu-item-01" :class="['dopstu-item-0' + (index+1)]" v-for="(v, index) in stsTxtArr" :key="index" @click="submitAnswers(v)">
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
      :width="330"
      :title="txtShow"
      footer-hide
      class>
      <div class="stop-box" v-if="txtShow == '暂停'">
        <img src="../../assets/images/questions/stop-time.jpg" alt="" width="100%">
        <p>休息一下，马上回来</p>
        <div>
          <button class="btn-com">继续做题</button>
        </div>
      </div>
      <div class="save-box" v-if="txtShow == '保存'">
        <img src="../../assets/images/questions/save.jpg" alt="" width="100%">
        <p>保存进度，下次继续</p>
        <div>
          <button class="btn-com">继续</button>
          <button class="btn-com">保存</button>
        </div>
      </div>
      <div class="jiaojuan-box" v-if="txtShow == '交卷'">
        <img src="../../assets/images/questions/jiaojuan.jpg" alt="" width="100%">
        <div v-if="percentNum != total">
          <p>您还有试题没完成</p>
          <div>
            <button class="btn-com">继续</button>
            <button class="btn-com" @click="jiaojuan">交卷</button>
          </div>
        </div>
        <div v-else>
          <p>确认提交试卷？</p>
          <div>
            <button class="btn-com">检查</button>
            <button class="btn-com" @click="jiaojuan">交卷</button>
          </div>
        </div>
      </div>
    </Modal>
    </div>
    <div v-else>
      没有题
    </div>
  </div>
</template>

<script>
import { topicList, getPapers } from '@/api/questions'
import poticList from '../../components/poticList/poticList'
export default {
  data () {
    return {
      stsTxtArr: ['暂停', '保存', '交卷'],
      visible: false,
      txtShow: '',
      topics: [], // 题列表
      answer_time: '',
      total: '',
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
        user_id: this.$route.query.user_id,
        plate_id: this.$route.query.plate_id,
        num: this.$route.query.num,
        paper_mode: this.$route.query.paper_mode,
        paper_type: this.$route.query.paper_type
      },
      subTopics: {
        user_id: this.$route.query.user_id,
        status: 1, // 交卷状态 1完成2未完成
        course_id: this.$route.query.course_id,
        section_id: this.$route.query.section_id || 0,
        knob_id: this.$route.query.knob_id || 0,
        know_id: this.$route.query.know_id || 0,
        paper_id: this.$route.query.paper_id || 0,
        mock_id: this.$route.query.mock_id || 0,
        plate_id: this.$route.query.plate_id,
        used_time: 600,
        paper_type: this.$route.query.paper_mode || 2, // 练习1 考试2
        question_content: {
          knob_id: this.$route.query.knob_id || 0,
          know_id: this.$route.query.know_id || 0,
          mock_id: this.$route.query.mock_id || 0,
          paper_id: this.$route.query.plate_id,
          question: []
        } // 交卷信息
      },
      ID: '#anchor-0',
      scrollTop: 0
    }
  },
  components: {
    poticList
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  mounted () {
    window.addEventListener('scroll', this.scrollToTop)
    this.getTopicList()
  },
  methods: {
    scrollToTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.scrollTop = scrollTop
      if (this.scrollTop > 100) {
        this.$refs.fixedTit.style.position = 'fixed'
        this.$refs.fixedTit.style.top = 70 + 'px'
        this.$refs.fixedTit.style.width = 895 + 'px'
      } else {
        this.$refs.fixedTit.style.position = ''
        this.$refs.fixedTit.style.top = ''
        this.$refs.fixedTit.style.width = ''
      }
    },
    goAnchor (selector) {
      var anchor = this.$el.querySelector(selector)
      document.documentElement.scrollTop = anchor.offsetTop
    },
    // 题list
    doPoticInfo (num = 0, val) {
      this.percentNum = num
      if (val) {
        this.subTopics.question_content.question = val
      }
      this.percent = this.percentNum / this.total * 100
    },
    getTopicList () {
      topicList(this.getQuestion).then(data => {
        const res = data.data
        this.topics = res.data.topics
        this.answer_time = res.data.answer_time
        this.total = res.data.total
        this.title = res.data.title
        this.topics.map((val, index) => {
          val.analysis = false // 解析默认false，只有做错题的时候true(练习模式)
          val.flag = false // 解析展开收起交互(练习模式)
          val.currenOption = false // 点击当前题，不能重复选择(练习模式)
          val.options.map((v, index) => {
            v.selOption = false // 选择当前选项变蓝色，其他默认颜色，可以重复选择(除了练习模式，都是这个逻辑)
          })
        })
        this.doPoticInfo() // 百分比
      })
    },
    // 交卷 保存 暂停
    submitAnswers (v) {
      this.visible = true
      this.txtShow = v
    },
    // 交卷
    jiaojuan () {
      this.visible = false
      if (this.subTopics.question_content.question.length === 0) {
        for (var j = 0; j < this.topics.length; j++) {
          this.subTopics.question_content.question.push({
            question_id: this.topics[j].ID,
            true_options: this.topics[j].options[0].right,
            user_answer: ''
          })
        }
      }
      if (this.percent === this.total) {
        this.subTopics.status = 2
      }
      this.subGetPapers()
    },
    subGetPapers () {
      getPapers(this.subTopics).then(data => {
        const res = data.data
        this.$router.push({ path: '/result-report', query: { paper_id: res.data.paper_id } })
      })
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
  .right-top-wrap, .right-bottom-wrap{
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
  .answer-time{
    text-align: right;
  }
 // 右边做题状态
  .progress-info{
    padding-top: 20px;
    padding-bottom: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .topic-num{
     margin-left: 32px;
    }
  }
  .dopic-status{
    display: flex;
    justify-content: space-between;
    text-align: center;
    padding: 0 20px;
  }
  .dopstu-item{
    span{
      height: 35px;
      display: block;
      i{
        vertical-align: middle;
      }
    }
    p{
      color: $col999;
      font-size: 14px;
      margin-top: 10px;
    }
  }
  .dopstu-icon{
    .dopstu-item-01 &{
      @include bg-img(35, 35, '../../assets/images/questions/do-prt-icon01.png');
    }
    .dopstu-item-02 &{
      @include bg-img(30, 30, '../../assets/images/questions/do-prt-icon02.png');
    }
    .dopstu-item-03 &{
      @include bg-img(31, 33, '../../assets/images/questions/do-prt-icon03.png');
    }
  }
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
  // modal
  .stop-box{
    // @include bg-img(795, 400, '../../assets/images/questions/stop-time.png');
  }
  .save-box{
    // @include bg-img(795, 400, '../../assets/images/questions/save.png');
  }
  .jiaojuan-box{
    // @include bg-img(795, 400, '../../assets/images/questions/jiaojuan.png');
  }
</style>
