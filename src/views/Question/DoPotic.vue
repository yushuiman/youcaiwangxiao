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
        <potic-list :topics="topics" :total="total" :getQuestion="getQuestion" @doPoticInfo="doPoticInfo" :ID="ID"></potic-list>
      </div>
      <div class="dptic-wrap-r fr">
        <div class="right-top-wrap">
          <h2 class="title-com">做题进度</h2>
          <div class="progress-info">
            <Progress :percent="percent" :stroke-width="10" stroke-color="#0267FF" hide-info/>
            <span class="topic-num"><em data-v-680035d5="">{{percentNum}}</em>/{{total}}</span>
          </div>
          <ul class="dopic-status">
            <li class="dopstu-item dopstu-item-01">
              <span><i class="dopstu-icon"></i></span>
              <p>暂停</p>
            </li>
            <li class="dopstu-item dopstu-item-02">
              <span><i class="dopstu-icon"></i></span>
              <p>保存</p>
            </li>
            <li class="dopstu-item dopstu-item-03">
              <span><i class="dopstu-icon"></i></span>
              <p>交卷</p>
            </li>
          </ul>
        </div>
        <div class="right-bottom-wrap">
          <div class="answer-card">
            <div class="title-com">
              <h2>答题卡</h2>
              <div class="anscard-sts">
                <i class="green-bg"></i>已掌握
                <i class="red-bg"></i>为掌握
              </div>
            </div>
            <ul class="anscard-list clearfix" >
              <li :class="{'blue-bg': item.selId}" v-for="(item, index) in topics" :key="index" @click="goAnchor('#anchor-'+index)">
                {{index+1}}
              </li>
              <!-- <li class="green-bg">1</li>
              <li class="red-bg">1</li>
              <li class="blue-bg">1</li> -->

            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      没有题
    </div>
  </div>
</template>

<script>
import { topicList } from '@/api/questions'
import poticList from '../../components/poticList/poticList'
export default {
  data () {
    return {
      topics: [],
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
      topicArr: [], // 已做题目
      selId: false,
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
    doPoticInfo (num = 0) {
      this.percentNum = num
      this.percent = this.percentNum / this.total * 100
    },
    goAnchor (selector) {
      var anchor = this.$el.querySelector(selector)
      document.documentElement.scrollTop = anchor.offsetTop
    },
    // 题
    getTopicList () {
      topicList(this.getQuestion).then(data => {
        const res = data.data
        this.topics = res.data.topics
        this.answer_time = res.data.answer_time
        this.total = res.data.total
        this.title = res.data.title
        this.topics.map((val, index) => {
          val.flag = false
          val.currenOption = false
          // console.log(val.options)
          // val.options.map((v, index) => {
          //   v.selOption = false
          // })
          // console.log(this.topics)
          // val.options.selOption = false
        })
        // this.topics.options.map((val, index) => {
        //   val.flag = false
        //   // val.options.selOption = false
        // })
        this.doPoticInfo()
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
    // position: fixed;
    // left: 0;
    // right:0;
    // width: 895px;
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
      &.green-bg{
        background: #47BF7F;
      }
      &.red-bg{
        margin-left: 20px;
        background: #ED7171;
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
      &.green-bg, &.red-bg, &.blue-bg{
        border: 0;
        color: $colfff;
        background: #ED7171;
      }
      &.green-bg{
        background: #47BF7F;
      }
      &.blue-bg{
        background: #3485FF;
      }
    }
  }
</style>
