<template>
  <div class="question-wrap w-wrap clearfix">
    <div class="qt-wrap-l fl">
      <!-- 科目标题 -->
      <Row class="qt-subject">
        <Col span="6" @click="getGuessLike" v-for="(item, index) in qtTitArr" :key="index">
          <div class="qt-course">{{item}}</div>
        </Col>
      </Row>
      <!-- 答题详情(做题数 正确率 平均分) -->
      <Row class="qt-answer-detail">
        <Col span="8">
          <div class="qta-item qta-item01">
            <span class="tit">做题数</span>
            <p class="record">1435<em>道</em></p>
            <p class="compare">同类考生平均答题量<span>793</span>道<br>已击败<span>33%</span>同类考生</p>
          </div>
        </Col>
        <Col span="8">
          <div class="qta-item qta-item02">
            <span class="tit">正确率</span>
            <p class="record">67<em>%</em></p>
            <p class="compare">同类考生平均正确率<span>79%</span><br>已击败<span>33%</span>同类考生</p>
          </div>
        </Col>
        <Col span="8">
          <div class="qta-item qta-item03">
            <span class="tit">平均分</span>
            <p class="record">65<em>分</em></p>
            <p class="compare">层同类考生平均分<span>79%</span><br>已击败<span>33%</span>同类考生</p>
          </div>
        </Col>
      </Row>
      <!-- 知识点练习 阶段测试 论述题自测 冲刺 -->
      <Row>
        <Col span="12">col-12</Col>
        <Col span="12">col-12</Col>
        <Col span="12">col-12</Col>
        <Col span="12">col-12</Col>
      </Row>
      <!-- 系统高频错题 自助练习 组卷模拟 -->
      <Row>
        <Col span="8">col-8</Col>
        <Col span="8">col-8</Col>
        <Col span="8">col-8</Col>
      </Row>
    </div>
    <div class="qt-wrap-r fr"></div>
  </div>
</template>

<script>
import { guessLike } from '@/api/class'
export default {
  data () {
    return {
      qtTitArr: ['中文part1', '中文part2', '中文part3', '中文part4']
    }
  },
  computed: {

  },
  mounted () {
    this.getGuessLike()
  },
  methods: {
    // 猜你喜欢
    getGuessLike () {
      console.log(2323)
      guessLike().then(data => {
        const res = data.data
        this.likeArr = res.data
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .question-wrap{
    padding: 20px 0;
  }
  .qt-wrap-l{
    width: 895px;
  }
  .qt-wrap-r{
    width: 285px;
    background: #000;
    height: 700px;
  }
  .ivu-row{
    margin-bottom: 20px;
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
    &:hover{
      font-size: 20px;
      color: $col333;
    }
  }
  .qta-item{
    padding: 15px;
    height: 170px;
    margin-right: 20px;
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
</style>
