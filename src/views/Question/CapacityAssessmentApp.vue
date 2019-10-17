<template>
  <div class="capacity-assessment-wrap">
    <div class="cass-row cass-row-top">
      <div class="cass-title">预测分<span>根据您最近十次答题情况评估</span></div>
      <div class="cass-row-mtb">
        <div class="yc-record-rb">
          <!-- <div class="yc-record">
            <p class="yc-record-top"><em>{{ycfen}}</em>分</p>
            <p class="yc-record-bt">总分100</p>
          </div> -->
          <div class="yc-record">
             <div class="canvasArea">
              <canvas width="200" height="200" id="mask" style="z-index:9"></canvas>
              <canvas width="200" height="200" id="circle" style="z-index:10"></canvas>
            </div>
            <div class="yc-num">
              <p class="yc-record-top"><em>{{ycfen}}</em>分</p>
              <p class="yc-record-bt">总分100</p>
            </div>
          </div>
        </div>
        <div ref="myEchart" id="myChart" style="width: 100%;height: 220px;"></div>
      </div>
    </div>
    <div class="cass-row cass-row-bottom">
      <div class="cass-title">本月统计</div>
      <Row class="cass-row-pt">
        <Col span="8">
          <div class="answer-status-item answer-status-item01">
            <i class="asi-icon"></i>
            <p><em>{{monStatistics.num || 0}}</em>次</p>
            <span>练习次数</span>
          </div>
        </Col>
        <Col span="8">
          <div class="answer-status-item answer-status-item02">
            <i class="asi-icon"></i>
            <p><em>{{monStatistics.used_time || 0}}</em>分钟</p>
            <span>答题时长</span>
          </div>
        </Col>
        <Col span="8">
          <div class="answer-status-item answer-status-item03">
            <i class="asi-icon"></i>
            <p><em>{{monStatistics.answer_speed || 0}}</em>秒/题</p>
            <span>答题速度</span>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { getQueryString } from '../../libs/utils'
import { abiAssess } from '@/api/questions'
let echarts = require('echarts/lib/echarts')
// 引入饼状图组件
require('echarts/lib/chart/radar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data () {
    return {
      ycfen: 0,
      nlpgInfo: {}, // 能力评估
      monStatistics: {}, // 本月统计
      chart: null,
      maskid: '#mask',
      circleid: '#circle',
      x: 100,
      y: 100,
      radius: 60,
      perV: 0,
      load: 0,
      maskctx: null,
      circlectx: null
    }
  },
  mounted () {
    let user = this.$route.query.user_id || getQueryString('user_id')
    let course = this.$route.query.course_id || getQueryString('course_id')
    this.user_id = user
    this.course_id = course
    this.getAbiAssess()
    this.initCharts()
    window.onresize = () => {
      echarts.init(this.$refs.myEchart).resize()
    }
  },
  methods: {
    init () {
      this.circlectx = document.querySelector(this.circleid).getContext('2d')
      this.maskctx = document.querySelector(this.maskid).getContext('2d')
      this.drawMaskLayer()
    },
    drawMaskLayer () {
      var draw = setInterval(() => {
        if (this.load <= this.perV) {
          this.drawCircle()
          this.load += 1
        } else {
          clearInterval(draw)
          draw = null
        }
      }, 10)
    },
    drawCircle () {
      var vv = this.load / 100 * (4 / 3) + (5 / 6)
      if (vv > 2) {
        vv = vv - 2
      }
      var loaded = vv * Math.PI
      this.maskctx.clearRect(0, 0, 400, 400)
      this.maskctx.beginPath()
      this.maskctx.lineWidth = 1
      this.maskctx.strokeStyle = 'transparent'
      this.maskctx.arc(this.x, this.y, this.radius, (5 / 6) * Math.PI, loaded, false)
      this.maskctx.stroke()

      var para = vv * 3.14
      var px = this.x + this.radius * Math.cos(para - 0.03)
      var py = this.y + this.radius * Math.sin(para - 0.03)
      this.circlectx.clearRect(0, 0, 400, 400)
      this.circlectx.beginPath()
      this.circlectx.arc(px, py, 6, 0, 360, false)
      this.circlectx.fillStyle = '#FF9B3A'
      this.circlectx.fill()
    },
    initCharts () {
      this.chart = echarts.init(this.$refs.myEchart)
      this.chart.setOption({
        color: ['none'],
        tooltip: {
          trigger: 'axis',
          padding: 8,
          extraCssText: 'width:180px'
        },
        textStyle: {
          fontSize: '1.2rem',
          color: '#666666' // 主标题文字颜色
        },
        radar: [
          {
            indicator: [
              { text: '答题时间', max: 86400 },
              { text: '错题数', max: 500 },
              { text: '做题数', max: 500 },
              { text: '学员排名', max: this.nlpgInfo.user },
              { text: '平均分', max: 100 },
              { text: '正确率', max: 100 }
              // { text: '答题时间', max: 100 },
              // { text: '错题数', max: 100 },
              // { text: '做题数', max: 100 },
              // { text: '学员排名', max: 100 },
              // { text: '平均分', max: 100 },
              // g{ text: '正确率', max: 100 }
            ],
            splitArea: {
              show: true,
              areaStyle: {// 每个分割区域的颜色
                color: ['#C4D8FB', '#D6E4FE', '#E9F1FE']
              }
            },
            radius: 80,
            splitNumber: 3,
            center: ['50%', '50%'],
            axisLine: { // 设置雷达图中间射线的颜色
              lineStyle: {
                color: 'rgba(24, 116, 253, 0.2)'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: 'rgba(24, 116, 253, 0.2)' // 图表背景网格线的颜色
              }
            }
          }
        ],
        series: [
          {
            type: 'radar',
            symbol: 'circle',
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(0,0,0,0.5)'
            },
            itemStyle: {
              normal: {
                width: 3,
                color: '#1151F9', // 图表中各个图区域的边框线拐点颜色
                borderColor: 'rgba(24, 116, 253, 0.4)',
                borderWidth: 4,
                lineStyle: {
                  color: '#1151F9' // 图表中各个图区域的边框线颜色
                }
              }
            },
            data: [
              {
                value: [
                  this.nlpgInfo.user_time + '秒/道' || 0,
                  this.nlpgInfo.error_num || 0,
                  this.nlpgInfo.total_num || 0,
                  this.nlpgInfo.ranking || 0,
                  this.nlpgInfo.scores || 0,
                  this.nlpgInfo.accuracy + '%' || 0 + '%'
                  // 98 + '秒/道' || 0,
                  // 77 || 0,
                  // 164 || 0,
                  // 2476 || 0,
                  // 29 || 0,
                  // 29 + '%' || 0 + '%'
                ],
                name: '能力评估',
                areaStyle: {
                  opacity: 0,
                  color: 'rgb(255, 225, 123, 0)'
                }
              }
            ]
          }
        ]
      })
    },
    getAbiAssess () {
      abiAssess({
        user_id: this.user_id,
        course_id: this.$route.query.course_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.ycfen = res.data.ycfen
          this.perV = res.data.ycfen
          this.nlpgInfo = res.data.data
          this.monStatistics = res.data.monStatistics
          this.init()
          this.initCharts()
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  }
}
document.addEventListener('DOMContentLoaded', () => {
  // 获取到页面的宽度，按照10等分平分
  let fontSize = window.innerWidth / 10
  // 给fontsize设置最大的字体大小
  fontSize = fontSize > 50 ? 50 : fontSize
  // 找到根节点
  const html = document.querySelector('html')
  // 给html添加字体样式
  html.style.fontSize = fontSize + 'px'
})
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  $ratio:375/10;
  @function px2rem($px){
    @return $px/$ratio+rem;
  }
  .cass-row{
    padding: px2rem(20);
    margin-top: px2rem(20);
    background: #ffffff;
    text-align: center;
    .cass-title{
      font-size: px2rem(46);
      font-weight: 500;
      text-align: left;
      span{
        font-size: px2rem(36);
        color: $col999;
        margin-left: px2rem(24);
      }
    }
  }
  .cass-row-mtb{
    padding-top: px2rem(40);
    // padding-bottom: 30px;
  }
  .cass-row-pt{
    padding-top: px2rem(38);
  }
  .yc-record{
    width: px2rem(495);
    height: px2rem(365);
    background: url('../../assets/images/questions/yc-record.png') no-repeat;
    background-size: contain;
    margin: 0 auto;
    position: relative;
    .yc-record-top{
      padding-top: px2rem(150);
      em{
        font-size: px2rem(108);
      }
    }
    .yc-record-bt{
      margin-top: px2rem(34);
      margin-left: px2rem(-10);
      font-size: px2rem(32);
      color: $col999;
    }
  }
  .yc-num{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .answer-status-item,.yc-record-rb{
    p{
      margin-top: px2rem(10);
      margin-bottom: px2rem(8);
      em{
        font-size: px2rem(52);
      }
    }
    span{
      font-size: px2rem(32);
      color: $col999;
    }
  }
  .answer-status-item03{
    &:after{
      width: 0;
    }
  }
  .asi-icon{
    width: px2rem(52);
    height: px2rem(55);
    display: inline-block;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center bottom;
    .answer-status-item01 &{
      background-image: url('../../assets/images/questions/statistics-icon01.png');
    }
    .answer-status-item02 &{
      background-image: url('../../assets/images/questions/statistics-icon02.png');
    }
    .answer-status-item03 &{
      background-image: url('../../assets/images/questions/statistics-icon03.png');
    }
  }
  #myChart{
    margin: 0 auto;
    @include px2rem(margin-top, 100);
  }
  .canvasArea {
    position: relative;
    @include px2rem(width, 920);
    @include px2rem(height, 920);
    @include px2rem(margin-left, 16);
    canvas {
      position: absolute;
      width: 100%;
      height: 100%;
      @include px2rem(top, -14);
      left: 0;
    }
  }
</style>
