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
        :mask-closable=false
        :width="795"
        class="iview-modal">
        <error-correction v-if="visibleError" :getQuestion="getQuestion" @modalShow="modalShow"></error-correction>
      </Modal>
    </div>
    <div class="no-data" v-else>
      暂无数据
    </div>
  </div>
</template>

<script>
import { wrongCheck, errorCenter } from '@/api/personal'
import poticList from '../../components/poticList/poticList'
import countUp from '../../components/common/countUp'
import errorCorrection from '../../components/common/errorCorrection'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      stsTxtArr: ['暂停', '保存', '交卷'],
      visible: false,
      visibleError: false, // 纠错show
      txtShow: '',
      topics: [], // 题列表
      answer_time: 0,
      total: 0,
      title: '',
      percent: 0, // 百分比
      percentNum: 0, // 已做题数
      getQuestion: { // 拿题
        course_id: this.$route.query.course_id,
        paper_id: this.$route.query.paper_id,
        section_id: this.$route.query.section_id,
        knob_id: this.$route.query.knob_id,
        know_id: this.$route.query.know_id,
        mock_id: this.$route.query.mock_id,
        plate_id: this.$route.query.plate_id,
        num: this.$route.query.num,
        paper_mode: this.$route.query.paper_mode || 2 // 练习1 考试2
      },
      subTopics: { // 交卷
        status: 1, // 交卷状态 1交卷 2保存
        course_id: this.$route.query.course_id,
        used_time: 0,
        section_id: this.$route.query.section_id || 0,
        knob_id: this.$route.query.knob_id || 0,
        know_id: this.$route.query.know_id || 0,
        paper_id: this.$route.query.paper_id || 0,
        mock_id: this.$route.query.mock_id || 0,
        plate_id: this.$route.query.plate_id,
        paper_type: 2, // 练习1 考试2(错题集没有练习模式)
        question_content: {
          knob_id: this.$route.query.knob_id || 0,
          know_id: this.$route.query.know_id || 0,
          mock_id: this.$route.query.mock_id || 0,
          paper_id: this.$route.query.paper_id,
          question: []
        }
      },
      ID: '#anchor-0',
      scrollTop: 0
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  components: {
    poticList,
    countUp,
    errorCorrection
  },
  mounted () {
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
    // 已做题数量 右边进度条用
    doPoticInfo (num = 0) {
      this.percentNum = num
      this.percent = this.percentNum / this.total * 100
    },
    // 拿题
    getTopicList () {
      wrongCheck({
        user_id: this.user_id,
        section_id: this.getQuestion.section_id,
        course_id: this.getQuestion.course_id,
        know_id: this.getQuestion.know_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          let { topics, total, title } = res.data
          this.topics = topics
          this.total = parseInt(total)
          this.title = title
          this.answer_time = res.data.answer_time // 错题记录没有用到
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
            // 练习模式 错题集没有练习模式
            // if (parseInt(this.getQuestion.paper_mode) === 1) {
            //   val.options.forEach((v, index) => {
            //     if (v.userOption !== '') {
            //       if (v.option.indexOf(v.right) > -1) {
            //         v.rightGreen = true // 遍历哪个是正确答案 对应添加rightGreen
            //       }
            //     }
            //     if (v.option.indexOf(v.userOption) > -1 && v.userOption !== '') {
            //       v.errorRed = false // 初始化当前选项答错状态
            //       if (v.userOption === v.right) { // 判断当前点击的选项是否正确
            //         v.rightGreen = true // 答对当前选项绿色
            //         val.currenRightGreen = true // 答对：右边选项卡对应添加绿色已掌握状态
            //         this.$forceUpdate()
            //       } else {
            //         v.errorRed = true // 答错当前选项红色
            //         val.currenErrorRed = true // 答错：右边选项卡对应添加红色未掌握状态
            //         val.analysis = true // 答错，解析展示
            //         this.$forceUpdate()
            //       }
            //     }
            //   })
            // }
          })
          let num = this.topics.filter((v) => { // 已做题数
            return v.currenOption
          })
          this.doPoticInfo(num.length)
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
    countdownend () {
      console.log('倒计时结束')
    },
    // 交卷
    jiaojuan (type) {
      for (var i = 0; i < this.topics.length; i++) {
        this.subTopics.question_content.question.push({
          question_id: this.topics[i].ID,
          true_options: this.topics[i].options[0].right,
          user_answer: this.topics[i].userOption || ''
        })
      }
      this.visible = false
      this.subTopics.used_time = this.$refs.addCountTime.userAnswerTime
      if (type === 'save') {
        this.subTopics.status = 2
      }
      this.subGetPapers(type)
    },
    subGetPapers (type) {
      errorCenter({
        used_time: this.subTopics.used_time,
        question_content: this.subTopics.question_content.question,
        user_id: this.user_id,
        course_id: this.subTopics.course_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          // 保存之后跳转到题库页面
          if (type === 'save') {
            this.$router.push('/question')
            return
          }
          window.sessionStorage.setItem('subTopics', JSON.stringify(this.subTopics))
          window.sessionStorage.setItem('diffTxt', 10) // 区分查看报告按钮，返回个人中心
          window.sessionStorage.setItem('diffRes', 11) // 区分b不同的接口请求，错题解析分为两个接口，全部，错题不能共用一个
          this.$router.push({ path: '/result-report',
            query: {
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
    text-align: center;
    cursor: pointer;
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
      cursor: pointer;
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
  .stop-box,.save-box,.jiaojuan-box{
    padding-top: 325px;
    text-align: center;
    p{
      padding-top: 33px;
      padding-bottom: 23px;
      font-size: 22px;
    }
    .btn-box{
      button{
        width: 122px;
        height: 36px;
        border-radius: 18px;
        margin: 0 21px;
        &:last-child{
          background: #0066FF;
          color: $colfff;
        }
      }
    }
  }
  .stop-box{
    @include bg-img(447, 465, '../../assets/images/questions/stop-time.png');
  }
  .save-box{
    @include bg-img(447, 465, '../../assets/images/questions/save.png');
  }
  .jiaojuan-box{
    @include bg-img(447, 465, '../../assets/images/questions/jiaojuan-no-finish.png');
    &.jiaojuan-finish{
      @include bg-img(447, 465, '../../assets/images/questions/jiaojuan-finish.png');
    }
  }
</style>
