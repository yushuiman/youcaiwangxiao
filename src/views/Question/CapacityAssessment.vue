<template>
  <div class="capacity-assessment-wrap w-wrap">
    <div class="cass-row cass-row-top">
      <div class="cass-title">预测分<span>根据您最近十次答题情况评估</span></div>
      <Row class="cass-row-mtb">
        <Col span="12" class="yc-record-rb">
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
        </Col>
        <Col span="12">
          <div ref="myEchart" style="width: 400px;height: 240px;margin:0 auto;"></div>
        </Col>
      </Row>
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
            <p><em>{{(monStatistics.used_time) || 0}}</em>分钟</p>
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
import { abiAssess } from '@/api/questions'
import { mapState } from 'vuex'

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
      radius: 80,
      perV: 0,
      load: 0,
      maskctx: null,
      circlectx: null
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.getAbiAssess()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getAbiAssess()
      })
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
          fontSize: 16,
          color: '#666666' // 主标题文字颜色
        },
        radar: [
          {
            indicator: [
              { text: '答题时间', max: 86400 },
              { text: '错题数', max: 1000 },
              { text: '做题数', max: 1000 },
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
      this.showLoading(true)
      abiAssess({
        user_id: this.user_id,
        course_id: this.$route.query.course_id
      }).then(data => {
        this.showLoading(false)
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
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .cass-row{
    padding: 20px;
    margin-top: 20px;
    background: #ffffff;
    border-radius: 8px;
    text-align: center;
    .cass-title{
      font-size: 28px;
      font-weight: 500;
      text-align-last: left;
      span{
        font-size: 18px;
        color: $col999;
        margin-left: 14px;
      }
    }
  }
  .cass-row-mtb{
    padding-top: 40px;
  }
  .cass-row-pt{
    padding-top: 38px;
  }
  .yc-record{
    @include bg-img(275, 203, '../../assets/images/questions/yc-record-pc.png');
    .yc-record-top{
      margin-left: -10px;
      margin-top: 85px;
      em{
        font-size: 54px;
      }
    }
    .yc-record-bt{
      margin-left: -10px;
      margin-top: 22px;
      font-size: 16px;
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
    position: relative;
    &:after{
      position: absolute;
      content: "";
      right: 0;
      top: 50%;
      margin-top: -35px;
      width: 2px;
      height: 70px;
      background: #DCDCDC;
    }
    p{
      margin-top: 10px;
      margin-bottom: 8px;
      em{
        font-size: 26px;
      }
    }
    span{
      font-size: 16px;
      color: $col999;
    }
  }
  .answer-status-item03{
    &:after{
      width: 0;
    }
  }
  .yc-record-rb{
    &:after{
      height: 112px;
      margin-bottom: -56px;
    }
  }
  .asi-icon{
    width: 52px;
    height: 55px;
    display: inline-block;
    background-size: 52px 52px;
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
      background-size: 50px 55px;
    }
  }
  .canvasArea {
    height: 200px;
    width: 200px;
    position: relative;
    margin-left: 31px;
    margin-top: 25px;
    canvas {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }
</style>
