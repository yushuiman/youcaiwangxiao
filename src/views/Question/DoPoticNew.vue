<template>
  <div class="test-topic-wrap w-wrap">
    <ul class="topics-list" v-for="(item, index) in topics" :key="index">
      <div class="topic-top">
        <span class="topic-num"><em>{{index+1}}</em>/{{topics.length}}</span>
      </div>
      <div class="tigan">
        <p style="white-space: pre-wrap;" v-html="item.question_steam"></p>
      </div>
      <ul class="topic-opition">
        <li class="tpc-opi" v-for="(v, key) in item.options" :key="key" @click="doPoticPractice(item, v, index, key)">
          <div class="opi-abcd">
            <!-- :class="{'green': v.is_right && v.is_answer == 1, 'red': !v.is_right && v.is_answer == 2}" -->
            <!-- <span :class="{'red-bg': v.errorRed, 'green-bg': v.rightGreen}">{{v.option}}</span> -->
            <!-- <span :class="{'blue-bg': v.selOption}">{{v.option}}</span> -->
            <span :class="{'blue-bg': v.selOption, 'red-bg': v.errorRed, 'green-bg': v.rightGreen}">{{v.option}}</span>
            <!-- <span :class="{'blue': item.yizuo, 'green': v.option == v.right && item.yizuo, 'red': v.userOption != v.right && item.yizuo}">{{v.option}}</span> -->
          </div>
          <p>{{v.topic}}</p>
          <!-- <div>rightGreen:{{v.rightGreen}}，option:{{v.option}}，right:{{v.right}}，is_answer:{{v.is_answer}}，userOption:{{v.userOption}}</div> -->
        </li>
      </ul>
      <div class="jiex-box">
        <div class="view-ani" @click="seeVideo(item)">
          {{item.flag ? '收起' : '解析'}}<Icon type="ios-arrow-down" :class="{'shouqi': item.flag}"/>
        </div>
        <div class="jiexi" v-if="item.flag">
          <p style="white-space: pre-wrap;" v-html="item.question_steam"></p>
          <video width="200" height="100" :src="item.video_explain" autoplay controls v-if="item.flag"></video>
        </div>
      </div>
      <!-- <div class="shipin">
        <span>查看视频{{item.flag}}</span>
        <div class="video-object">
          <video width="200" height="100" :src="item.video_explain" autoplay controls v-if="item.flag"></video>
        </div>
      </div> -->
    </ul>
    <!-- <potic-list ref="poticWrap" :topics="topics" :total="total" :getQuestion="getQuestion" @doPoticInfo="doPoticInfo"></potic-list> -->
  </div>
</template>

<script>
import { topicListNew, getPapers } from '@/api/questions'
import poticList from '../../components/poticList/poticList'
import countDown from '../../components/count'
import countUp from '../../components/common/countUp'
import uploadImg from '../../components/analysis/askQuestion'
import errorCorrection from '../../components/common/errorCorrection'
import $ from 'jquery'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      stsTxtArr: ['暂停', '保存', '交卷'],
      stsTxtArr2: ['暂停', '交卷'],
      visible: false,
      visibleError: false, // 纠错show
      txtShow: '',
      topics: [], // 题列表
      noDataFlag: false,
      answer_time: 0,
      timers: null,
      user_s: 0, // 用时秒数
      total: 0,
      title: '',
      percent: 0, // 百分比
      percentNum: 0, // 已做题数
      getQuestion: { // 拿题
        course_id: this.$route.query.course_id, // 课程id
        paper_id: this.$route.query.paper_id, // 卷子id(阶段测试,论述题)
        section_id: this.$route.query.section_id, // 章id(知识点,错题,自助)
        knob_id: this.$route.query.knob_id, // 节id(知识点,错题,自助)
        know_id: this.$route.query.know_id, // 知识点id(知识点,错题,自助)
        mock_id: this.$route.query.mock_id, // 组卷id(组卷)
        plate_id: this.$route.query.plate_id, // 板块id(1知识点练习,2阶段测试,3论述题自测,4错题智能练习,5自主练习,6组卷模考)
        num: this.$route.query.num, // 题数(知识点,自助5 10 15 ...30)
        paper_mode: this.$route.query.paper_mode || 2, // 练习1 考试2自己用来区分
        paper_type: this.$route.query.paper_type, // 试题类型1单选2论述题
        entrance_type: this.$route.query.entrance_type || '' // 入学测试
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
        plate_id: this.$route.query.plate_id, // 1知识点练习,2阶段测试,3论述题自测,4错题智能练习,5自主练习,6组卷模考,7冲刺训营
        paper_type: this.$route.query.paper_mode || 2, // 交卷 练习1 考试2
        question_content: {
          knob_id: this.$route.query.knob_id || 0,
          know_id: this.$route.query.know_id || 0,
          mock_id: this.$route.query.mock_id || 0,
          paper_id: this.$route.query.paper_id || 0,
          question: []
        },
        entrance_type: this.$route.query.entrance_type || ''
      },
      typeShow: '', // 答疑dy，纠错jc
      right: ''
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  created () {
    // this.prohibit()
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.getTopicList()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getTopicList()
      })
    }
    // window.addEventListener('scroll', this.scrollToTop)
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    seeVideo (item) {
      // this.topics.forEach(v => {
      //   v.flag = false
      // });
      item.flag = !item.flag
      this.$forceUpdate()
    },
    // 练习模式
    doPoticPractice (item, val, index, key) {
      if (item.currenOption) { // 练习模式：当前题选择以后不能再选
        return
      }
      item.currenOption = true // 练习模式：当前题选择以后不能再选
      item.userOption = val.option // 交卷用户答案
      item.showAnalysis = true // 答对答错，解析都展示
      item.options.forEach((v, index) => {
        if (v.is_answer == 1) {
          v.rightGreen = true // 遍历哪个是正确答案 对应添加rightGreen
        }
      })
      if (val.is_answer != 1) { // 判断当前点击的选项是否正确
        // val.selOption = false // 蓝色状态取消
        // val.rightGreen = true // 答对当前选项绿色
        val.errorRed = true // 答错当前选项红色
      }
      this.$forceUpdate()
    },
    // 考试模式
    doPotic (item, val, index, key) {
      item.options.forEach((v, index) => {
        v.selOption = false // 初始化false
      })
      val.selOption = true // 点击当前选项true蓝色，else false
      item.currenOption = true // 点击当前题 右边选项卡对应添加已做蓝色状态
      item.userOption = val.option // 交卷用户答案
      this.$forceUpdate()
    },
    // 拿题
    getTopicList () {
      this.showLoading(true)
      this.getQuestion.user_id = this.user_id
      topicListNew(this.getQuestion).then(data => {
        this.showLoading(false)
        this.noDataFlag = true
        const res = data.data
        if (res.code === 200) {
          // let { topics, total, title } = res.data
          // this.topics = topics
          // this.total = total
          // this.title = title
          // if (topics && topics.length) {
          //   this.noDataFlag = false
          //   this.topics.map((val, index) => {
          //     val.showAnalysis = false // 解析默认false，只有做错题的时候true(练习模式)
          //     val.flag = false // 解析展开收起交互(练习模式)
          //     val.currenOption = false // 点击当前题，不能重复选择(练习模式)
          //     val.userOption = ''
          //     val.options.map((v, index) => {
          //       v.selOption = false // 选择当前选项变蓝色，其他默认颜色，可以重复选择(除了练习模式，都是这个逻辑)
          //     })
          //   })
          // }
          this.topics = res.data
          if (this.topics && this.topics.length) {
            this.noDataFlag = false
            this.topics.map((val, index) => {
              val.showAnalysis = false // 解析默认false，只有做错题的时候true(练习模式)
              val.flag = false // 解析展开收起交互(练习模式)
              val.currenOption = false // 点击当前题，不能重复选择(练习模式)
              val.userOption = ''
              val.options.map((v, index) => {
                v.selOption = false // 选择当前选项变蓝色，其他默认颜色，可以重复选择(除了练习模式，都是这个逻辑)
                v.errorRed = false
                v.rightGreen = false
              })
            })
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  },
  beforeDestroy () {
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.blue {
  color: blue!important;
}
.green{
  color: #11cc19!important;
}
 .red{
  color: #ff0000!important;
}
  .test-topic-wrap{
    background: #ffffff;
  }
  .topics-list{
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
    background: #ffffff;
    margin-bottom: 20px;
    padding: 0 30px;
    margin-top: 20px;
  }
  .topic-top{
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .topic-num{
    em {
      font-size: 24px;
    }
  }
  .tigan{
    font-size: 18px;
    color: #333;
    line-height: 25px;
    display: flex;
    p{
      // margin-left: 10px;
    }
  }
  .tpc-opi{
    display: flex;
    align-items: center;
    line-height: 30px;
    margin: 3px 0;
    cursor: pointer;
  }
  .opi-abcd{
    span{
      width: 26px;
      height: 26px;
      border-radius: 26px;
      text-align: center;
      line-height: 26px;
      border: 1px solid #666;
      display: inline-block;
      margin-right: 10px;
      &.blue-bg{
        border: 1px solid blue;
        color: blue;
      }
      &.red-bg{
        border: 1px solid #ED7171;
        color: #ED7171;
      }
      &.green-bg{
        border: 1px solid #0AAB55;
        color: #0AAB55;
      }
    }
  }
  .jiex-box{
    padding: 10px 0;
  }
  .view-ani, .jiexi,.shipin{
    cursor: pointer;
    // margin-top: 10px;
        color: #066ae4;
        i{
        &.shouqi{
          transform: rotate(-180deg)
        }
      }
  }
</style>
