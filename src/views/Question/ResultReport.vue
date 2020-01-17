<template>
  <div class="result-wrap">
    <div class="w-wrap">
      <h2 class="r-title">测试报告</h2>
      <div class="result-main">
        <div class="result-left">
          <img src="../../assets/images/questions/result-img.png" alt="">
        </div>
        <div class="result-right">
          <h2 class="r-section-title">{{resultsInfo.paper_name}}</h2>
          <div class="r-statistics">
            <div class="result-water">
              <wave :accuracy="resultsInfo.accuracy" v-if="resultsInfo.accuracy >= 0"></wave>
              <p>正确率(%)</p>
            </div>
            <ul class="right-wrong-list">
              <li class="rw-item">
                <p><em>{{resultsInfo.true_num}}</em>道</p>
                <span>做对</span>
              </li>
              <li class="rw-item">
                <p><em>{{resultsInfo.false_num}}</em>道</p>
                <span>做错</span>
              </li>
              <li class="rw-item">
                <p><em>{{resultsInfo.as_num}}</em>/{{resultsInfo.question_num}}</p>
                <span>已做/总题</span>
              </li>
            </ul>
          </div>
          <div class="r-statistics-card">
            <div class="title-com">
              <h2>答题卡</h2>
              <div class="anscard-sts">
                <i class="green-bg"></i>已掌握
                <i class="red-bg"></i>未掌握
                <i class="white-bg"></i>未做答
              </div>
            </div>
            <div class="rsc-list">
              <ul class="anscard-list clearfix" v-for="(item, index) in cardList" :key="index">
                <li :class="{'red-bg': v.redCurren, 'green-bg': v.rightCurren}" v-for="(v, index) in item" :key="index">{{v.num}}</li>
              </ul>
            </div>
            <div class="jiexi-btn">
              <button class="btn-com error-btn" @click="viewAnalysis('1')">错题解析</button>
              <button class="btn-com all-btn" @click="viewAnalysis('2')">全部解析</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { resultsStati } from '@/api/questions'
import { errorStati } from '@/api/personal'
import wave from '../../components/common/wave'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      resultsInfo: {},
      cardList: [],
      diffRes: parseInt(window.sessionStorage.getItem('diffRes'))
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  components: {
    wave
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      // 0元体验做题成绩统计
      if (parseInt(this.$route.query.plate_id) === 8) {
        this.experienceStatiInfo()
        return
      }
      // 错题集成绩统计 全部和错题不能共用一个 所以又区分了
      if (this.diffRes === 1 || this.diffRes === 11) {
        this.getErrorStati()
        return
      }
      // 正常做题成绩统计 答题记录成绩统计
      this.getResultsStati()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        // 0元体验做题成绩统计
        if (parseInt(this.$route.query.plate_id) === 8) {
          this.experienceStatiInfo()
          return
        }
        // 错题集成绩统计 全部和错题不能共用一个 所以又区分了
        if (this.diffRes === 1 || this.diffRes === 11) {
          this.getErrorStati()
          return
        }
        // 正常做题成绩统计 答题记录成绩统计
        this.getResultsStati()
      })
    }
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    // 正常做题成绩统计
    getResultsStati () {
      this.showLoading(true)
      resultsStati({
        user_id: this.user_id,
        paper_id: this.$route.query.paper_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.resultsInfo = res.data
          this.cardSts(res.data.question_content) // 答题卡颜色状态
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 0元体验成绩统计
    experienceStatiInfo () {
      let obj = JSON.parse(window.sessionStorage.getItem('experienceStatiInfo'))
      this.resultsInfo = obj
      this.cardSts(obj.question_content)// 答题卡颜色状态
    },
    cardSts (answerList) {
      if (answerList && answerList.length) {
        answerList.map((v, index) => {
          v.num = index + 1
          if (v.user_answer !== '' && v.user_answer === v.true_options) {
            v.rightCurren = true
          }
          if (v.user_answer !== '' && v.user_answer !== v.true_options) {
            v.redCurren = true
          }
        })
        for (let i = 0; i < answerList.length; i += 10) {
          this.cardList.push(answerList.slice(i, i + 10))
        }
      }
    },
    // 错题集成绩统计
    getErrorStati () {
      let obj = JSON.parse(window.sessionStorage.getItem('subTopics'))
      this.showLoading(true)
      errorStati({
        used_time: obj.used_time,
        user_id: this.user_id,
        course_id: obj.course_id,
        section_id: obj.section_id,
        question_content: obj.question_content.question
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.resultsInfo = res.data
          this.cardSts(res.data.question_content) // 答题卡颜色状态
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 查看解析
    async viewAnalysis (type) {
      await this.getUserInfo()
      this.$router.push({ path: '/analysis',
        query: {
          paper_id: this.$route.query.paper_id,
          type: type,
          course_id: this.$route.query.course_id,
          plate_id: this.$route.query.plate_id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .result-wrap{
    position: absolute;
    width: 100%;
    top: 70px;
    min-height: 100%;
    background: url('../../assets/images/questions/result-bg.png') no-repeat center;
    background-size: cover;
  }
  .r-title{
    font-size: 28px;
    padding-top: 46px;
    padding-bottom: 20px;
  }
  .result-main{
    display: flex;
    height: 806px;
    // margin-bottom: 46px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 10px;
    font-size: 18px;
    color: $col666;
  }
  .result-left{
    width: 538px;
    height: 100%;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .result-right{
    padding: 36px 36px 0;
    flex: 1;
    position: relative;
  }
  .r-section-title{
    font-size: 24px;
  }
  .r-statistics{
    padding: 29px 24px 50px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .result-water{
    width: 135px;
    text-align: center;
    p{
      margin-top: 10px;
    }
  }
  .right-wrong-list{
    display: flex;
  }
  .rw-item{
    padding: 0 32px;
    text-align: center;
    p{
      margin-bottom: 10px;
      em{
        font-size: 34px;
      }
    }
    &:nth-child(1){
      p{
        color: #0AAB55;
      }
    }
    &:nth-child(2){
      p{
        color: #E84342;
      }
    }
  }
  .title-com{
    font-size: 18px;
    color: $col333;
    display: flex;
    align-items: center;
  }
  .anscard-sts{
    margin-left: 35px;
    i{
      width: 10px;
      height: 10px;
      border-radius: 1px;
      vertical-align: middle;
      margin-top: -3px;
      margin-right: 6px;
      margin-left: 20px;
      display: inline-block;
      box-sizing: border-box;
      &.red-bg{
        background: #ED7171;
      }
      &.green-bg{
        background: #47BF7F;
      }
      &.white-bg{
        border: 1px solid $col666;
      }
    }
  }
  .rsc-list{
    padding: 20px 0;
    margin-left: -8px;
    height: 410px;
    overflow: auto;
  }
  .anscard-list{
    li{
      float: left;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid $col666;
      border-radius: 100%;
      margin: 10px 9px;
      cursor: pointer;
      &:nth-child(5){
        margin-right: 60px;
      }
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
  .jiexi-btn{
    position: absolute;
    bottom: 30px;
    right: 30px;
    text-align: right;
    button{
      width: 122px;
      height: 36px;
      line-height: 36px;
      border-radius: 18px;
      margin-left: 20px;
      &.on{
        background: #0066FF;
      }
    }
  }
</style>
