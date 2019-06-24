<template>
  <div class="question-wrap w-wrap clearfix">
    <div class="qt-wrap-l fl">
      <!-- 科目标题 -->
      <Row class="qt-subject">
        <Col span="6" v-for="(item, index) in projectArr" :key="index">
          <div class="qt-course" :class="{'curren': selIdx === index}" @click="getQuestionIndex(item.id, index)">{{item.name}}</div>
        </Col>
      </Row>
      <!-- 答题详情(做题数 正确率 平均分) -->
      <Row class="qt-answer-detail">
        <Col span="8">
          <div class="qta-item qta-item01">
            <span class="tit">做题数</span>
            <p class="record">{{questionResult.total_num}}<em>道</em></p>
            <p class="compare">同类考生平均答题量<span>793</span>道<br>已击败<span>33%</span>同类考生</p>
          </div>
        </Col>
        <Col span="8">
          <div class="qta-item qta-item02">
            <span class="tit">正确率</span>
            <p class="record">{{questionResult.accuracy}}<em>%</em></p>
            <p class="compare">同类考生平均正确率<span>79%</span><br>已击败<span>33%</span>同类考生</p>
          </div>
        </Col>
        <Col span="8">
          <div class="qta-item qta-item03">
            <span class="tit">平均分</span>
            <p class="record">{{questionResult.score}}<em>分</em></p>
            <p class="compare">层同类考生平均分<span>79%</span><br>已击败<span>33%</span>同类考生</p>
          </div>
        </Col>
      </Row>
      <!-- 知识点练习 阶段测试 论述题自测 冲刺 -->
      <Row class="practice-wrap">
        <Col span="12" class="practice-item" v-for="(item, index) in practiceInfo.slice(0, 4)" :key="index">
          <div class="prt-info-com prt-info" :class="['prt-info-0' + (index+1)]">
            <div class="prt-flex">
              <i class="prt-icon"></i>
              <div class="prt-txt">
                <h2>{{item.title}}</h2>
                <p>{{item.describe}}</p>
              </div>
            </div>
            <button class="prt-btn qt-com">去做题</button>
          </div>
        </Col>
      </Row>
      <!-- 系统高频错题 自助练习 组卷模拟 -->
      <Row class="practice-wrap">
        <Col span="8" class="practice-item" v-for="(item, index) in practiceInfo.slice(4, 7)" :key="index">
          <div class="prt-info-com prt-info-three" :class="['prt-info-0' + (index+5)]" >
            <div class="prt-txt">
              <h2>{{item.title}}</h2>
              <p>{{item.describe}}</p>
            </div>
            <button class="prt-btn qt-com">去做题</button>
          </div>
        </Col>
      </Row>
    </div>
    <!-- 预测评估 学员排名 -->
    <div class="qt-wrap-r fr">
      <div class="qt-wrap-r-top">
        <div class="calculate-info">
          <div class="cal-tit">
            <span>预测分</span>
            <button class="qt-com">能力评估</button>
          </div>
          <div class="cal-num">
            82<em>分</em>
          </div>
        </div>
        <ul class="my-question">
          <li class="mq-item mq-item-01">
            <i class="mq-icon"></i>
            <p>答题记录</p>
          </li>
          <li class="mq-item mq-item-02">
            <i class="mq-icon"></i>
            <p>我的错题</p>
          </li>
          <li class="mq-item mq-item-03">
            <i class="mq-icon"></i>
            <p>收藏夹</p>
          </li>
        </ul>
      </div>
      <div class="qt-wrap-r-bottom">
        <div class="students-rank">
          <div class="stu-rank-title">学员排名</div>
          <ul class="stu-rank-list">
            <li class="stu-rank-item">
              <span class="sturi-num">1</span>
              <img src="" alt="" class="sturi-head">
              <div class="sturi-info">
                <h2>某某某</h2>
                <p>做题数量14334道</p>
              </div>
            </li>
            <li class="stu-rank-item">
              <span class="sturi-num">1</span>
              <img src="" alt="" class="sturi-head">
              <div class="sturi-info">
                <h2>某某某</h2>
                <p>做题数量14334道</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProject, questionIndex } from '@/api/questions'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      projectArr: ['中文part1', '中文part2', '中文part3', '中文part4'],
      selIdx: 0,
      subjectId: '',
      practiceInfo: [
        {
          title: '知识点练习',
          describe: '针对章节，详细考点'
        },
        {
          title: '阶段测试',
          describe: '以章节纬度阶段测试'
        },
        {
          title: '论述题自测',
          describe: '精准答案对比'
        },
        {
          title: '冲刺训练营',
          describe: '集中冲刺'
        },
        {
          title: '系统高频错题',
          describe: '高频历史错题'
        },
        {
          title: '自助练习',
          describe: '学习知识点自定义'
        },
        {
          title: '组卷模考',
          describe: '适用于考前冲刺'
        }
      ],
      questionResult: {}, // 正确率，做题数，平均分
      studentsRankList: [] // 学生排名
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId
    })
  },

  mounted () {
    this.projectInfo()
  },
  methods: {
    // 展示课程
    projectInfo () {
      getProject({ user_id: this.userId }).then(data => {
        const res = data.data
        this.projectArr = res.data
        // this.subjectId = res.data[0].id
        this.getQuestionIndex(res.data[0].id, this.selIdx)
      })
    },
    // 课程对应正确率，做题数，平均分
    getQuestionIndex (id, index) {
      this.selIdx = index
      questionIndex({
        user_id: this.userId,
        course_id: id
      }).then(data => {
        const res = data.data
        this.questionResult = res.data
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .question-wrap{
    padding: 20px 0;
    .qt-wrap-l{
      width: 895px;
    }
    .qt-wrap-r{
      width: 285px;
    }
  }
  .qt-subject{
    @include lh(60, 60);
    border-radius: 8px;
    background: $colfff;
  }
  .qt-course{
    text-align: center;
    font-size: 16px;
    color: $col999;
    &.curren{
      font-size: 20px;
      color: $col333;
    }
    // &:hover{
    //   font-size: 20px;
    //   color: $col333;
    // }
  }
  // 答题详情 做题数正确率平均分
  .qt-answer-detail, .practice-wrap{
    margin-left: -20px;
  }
  .qt-subject, .practice-item, .qt-answer-detail{
    margin-bottom: 20px;
  }
  .qta-item{
    padding: 15px;
    width: 285px;
    height: 170px;
    margin-left: 20px;
    background: linear-gradient(130deg,rgba(251,172,120,1) 0%,rgba(252,120,115,1) 100%);
    border-radius: 8px;
    color: $colfff;
    box-sizing: border-box;
    text-align: center;
    &.qta-item02{
      .tit{
        color: #8686FF;
      }
      background: linear-gradient(141deg,rgba(155,145,255,1) 0%,rgba(126,130,255,1) 100%);
    }
    &.qta-item03{
      background: linear-gradient(150deg,rgba(255,147,147,1) 0%,rgba(255,79,79,1) 100%);
      .tit{
        color: #FF6565;
      }
    }
    .tit{
      width: 67px;
      height: 24px;
      line-height: 24px;
      display: block;
      background:rgba(255,255,255,1);
      border-radius: 13px;
      color: #FC8374;
      font-size: 16px;
    }
    .record{
      font-size: 30px;
      font-weight: bold;
      padding: 13px 0;
      em{
        font-size: 14px;
      }
    }
    .compare{
      line-height: 20px;
    }
  }
  // 知识点练习 系统高频错题等7个模块
  .prt-info-com{
    background: #ffffff;
    margin-left: 20px;
    padding: 26px 30px;
    border-radius: 8px;
  }
  .prt-info{
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .prt-info-three{
    background-color: #ffffff;
    background-repeat: no-repeat;
    background-size: 83px 127px;
    background-position: right bottom;
    &.prt-info-05{
      background-image: url('../../assets/images/questions/practice-icon05.png');
    }
    &.prt-info-06{
      background-image: url('../../assets/images/questions/practice-icon06.png');
    }
    &.prt-info-07{
      background-image: url('../../assets/images/questions/practice-icon07.png');
    }
  }
  .prt-flex{
    display: flex;
  }
  .prt-icon{
    .prt-info-01 &{
      @include bg-img(40, 40, '../../assets/images/questions/practice-icon01.png');
    }
    .prt-info-02 &{
      @include bg-img(40, 40, '../../assets/images/questions/practice-icon02.png');
      background-size: 38px 28px;
    }
    .prt-info-03 &{
      @include bg-img(40, 40, '../../assets/images/questions/practice-icon03.png');
      background-size: 34px 37px;
    }
    .prt-info-04 &{
      @include bg-img(40, 40, '../../assets/images/questions/practice-icon04.png');
      background-size: 38px 47px;
    }
  }
  .prt-txt{
    padding-left: 27px;
    .prt-info-three &{
      padding-left: 0;
    }
    h2{
      font-size: 20px;
    }
    p{
      margin-top: 10px;
      font-size: 16px;
      color: $col999;
    }
  }
  .qt-com{
    width: 79px;
    height: 32px;
    line-height: 32px;
    border-radius: 16px;
    text-align: center;
    background: none;
    border: 1px solid rgba(2,103,255,1);
    color: $blueColor;
    &:hover{
      box-shadow:0px 2px 11px 0px rgba(0,113,230,0.65);
    }
    .prt-info &{
      color: $colfff;
      background: rgba(24,116,253,1);
    }
    .prt-info-three &{
      margin-top: 30px;
    }
    .cal-tit &{
      width: 75px;
      height: 22px;
      line-height: 22px;
      &:hover{
        box-shadow: 0 0 0 0 transparent;
      }
    }
  }
  // 预测评估 答题记录 错题 收藏
  .qt-wrap-r-top, .qt-wrap-r-bottom{
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .cal-tit{
    display: flex;
    justify-content: space-between;
    span{
      font-size: 18px;
    }
  }
  .cal-num{
    width: 136px;
    height: 136px;
    line-height: 136px;
    text-align: center;
    font-size: 20px;
    background: url('../../assets/images/questions/yc-num.png') no-repeat center;
    background-size: contain;
    margin: 0 auto;
    margin-top: 16px;
    margin-bottom: 16px;
    em{
      font-size: 14px;
    }
  }
  .my-question{
    display: flex;
    justify-content: space-between;
    text-align: center;
    .mq-item{
      p{
        color: $col999;
        margin-top: 11px;
      }
    }
  }
  .mq-icon{
    .mq-item-01 &{
      @include bg-img(33, 33, '../../assets/images/questions/yc-answer.png');
    }
    .mq-item-02 &{
      @include bg-img(28, 32, '../../assets/images/questions/yc-wrong.png');
    }
    .mq-item-03 &{
      @include bg-img(36, 30, '../../assets/images/questions/yc-collection.png');
    }
  }
  .stu-rank-list{
    padding-top: 10px;
    .stu-rank-title{
      font-size: 18px;
    }
  }
  .stu-rank-item{
    display: flex;
    align-items: center;
    padding: 10px 0;
    .sturi-head{
      width: 38px;
      height: 38px;
      border-radius: 100%;
      margin: 0 10px;
    }
    .sturi-info{
      h2{
        font-size: 16px;
      }
      p{
        margin-top: 5px;
      }
    }
  }
  .sturi-num{
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-size: 14px;
    color: $col999;
    .stu-rank-item01 &{
      @include bg-img(24, 24, '../../assets/images/questions/rank-icon01.png');
    }
    .stu-rank-item02 &{
      @include bg-img(24, 24, '../../assets/images/questions/rank-icon01.png');
    }
    .stu-rank-item03 &{
      @include bg-img(24, 24, '../../assets/images/questions/rank-icon01.png');
    }
  }
</style>
