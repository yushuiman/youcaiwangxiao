<template>
  <div>
    <h2>测试报告</h2>
    <div>
      <div>
        <img src="" alt="">
      </div>
      <div>
        <div>结果正确率</div>
        <div>
          答题卡
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { resultsStati } from '@/api/questions'
import { mapState } from 'vuex'
export default {
  data () {
    return {
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
        }
      }
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  components: {
  },
  mounted () {
    this.getResultsStati()
  },
  methods: {
    getResultsStati () {
      resultsStati({
        user_id: this.user_id,
        paper_id: this.$route.query.paper_id
      }).then(data => {

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
  // <div class="stop-box" v-if="txtShow == '暂停'">
  //       地方换个卡地方换个卡都发挥更大发挥更开放1
  //     </div>
  //     <div class="save-box" v-if="txtShow == '保存'">
  //       地方换个卡地方换个卡都发挥更大发挥更开放2
  //     </div>
  //     <div class="jiaojuan-box" v-if="txtShow == '交卷'">
  //       地方换个卡地方换个卡都发挥更大发挥更开放3
  //     </div>
</style>
