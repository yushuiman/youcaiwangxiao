<template>
  <div class="capacity-assessment-wrap w-wrap">
    <div class="cass-row cass-row-top">
      <Row>
        <Col span="24">
          <div class="cass-title">预测分<span>根据您最近十次答题情况评估</span></div>
        </Col>
      </Row>
      <Row class="cass-row-mtb">
        <Col span="12">
          <div class="yc-record"><em>{{ycfen}}</em>分</div>
        </Col>
        <Col span="12">
          <div>
            <div id="main" ref="myEchart" style="width: 400px;height: 240px;"></div>
            <!-- <chart ref="chart1" :options="orgOptions" :auto-resize="true" style="width:500px; height: 500px;"></chart> -->
          </div>
        </Col>
      </Row>
    </div>
    <div class="cass-row cass-row-bottom">
      <Row>
        <Col span="24">
          <div class="cass-title">本月统计</div>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <div class="answer-status-item answer-status-item01">
            <i class="asi-icon"></i>
            <p><em>{{monStatistics.num}}</em>次</p>
            <span>练习次数</span>
          </div>
        </Col>
        <Col span="8">
          <div class="answer-status-item answer-status-item02">
            <i class="asi-icon"></i>
            <p><em>{{monStatistics.used_time}}</em>分钟</p>
            <span>练习天数</span>
          </div>
        </Col>
        <Col span="8">
          <div class="answer-status-item answer-status-item03">
            <i class="asi-icon"></i>
            <p><em>{{monStatistics.answer_speed}}</em>秒/题</p>
            <span>答题进度</span>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { abiAssess } from '@/api/questions'
import { mapState } from 'vuex'
import echarts from 'echarts'
export default {
  data () {
    return {
      ycfen: '',
      nlpgInfo: {}, // 能力评估
      monStatistics: {}, // 本月统计
      orgOptions: {}
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  components: {
    // echarts
  },
  mounted () {
    // this.getAbiAssess()
    // this.orgOptions = {
    //   xAxis: {
    //     type: 'category',
    //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    //   },
    //   yAxis: {
    //     type: 'value'
    //   },
    //   series: [{
    //     data: [820, 932, 901, 934, 1290, 1330, 1320],
    //     type: 'line',
    //     smooth: true
    //   }]
    // }
    this.initCharts()
  },
  methods: {
    initCharts () {
      this.chart = echarts.init(this.$refs.myEchart)
      this.chart.setOption({
        color: ['none'],
        tooltip: {
          trigger: 'axis'
        },
        textStyle: {
          fontSize: 16,
          color: '#666666' // 主标题文字颜色
        },
        radar: [
          {
            indicator: [
              { text: '答题时间', max: 100 },
              { text: '错题数', max: 100 },
              { text: '做题数', max: 100 },
              { text: '学员排名', max: 100 },
              { text: '平均分', max: 100 },
              { text: '正确率', max: 100 }
            ],
            radius: 80,
            center: ['50%', '50%']
          }
        ],
        splitArea: {
          show: true,
          areaStyle: {
            color: 'rgba(17,81,249,1)' // 图表背景网格线的颜色
          }
        },
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(0,0,0,0.5)'
            },
            itemStyle: {
              normal: {
                color: '#1151F9', // 图表中各个图区域的边框线拐点颜色
                lineStyle: {
                  color: '#1151F9' // 图表中各个图区域的边框线颜色
                },
                areaStyle: {
                  color: 'rgba(17,81,249,1)'
                }
              }
            },
            data: [
              {
                value: [60, 73, 85, 40, 90],
                name: '能力评估'
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
        console.log(res)
        this.ycfen = res.data.ycfen
        this.nlpgInfo = res.data.data
        this.monStatistics = res.data.monStatistics
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .capacity-assessment-wrap{

  }
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
    padding-top: 55px;
    padding-bottom: 35px;
  }
  .yc-record{
    line-height: 220px;
    @include bg-img(220, 220, '../../assets/images/questions/yc-record.png');
    em{
      font-size: 54px;
    }
  }
  .answer-status-item{
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
  .asi-icon{
    .answer-status-item &{
      @include bg-img(52, 48, '../../assets/images/questions/yc-record.png');
    }
    .answer-status-item02 &{
      @include bg-img(48, 48, '../../assets/images/questions/yc-record.png');
    }
    .answer-status-item03 &{
      @include bg-img(48, 48, '../../assets/images/questions/yc-record.png');
    }
  }
  // <div class="answer-status-item answer-status-item01">
  //           <i class="asi-icon"></i>
  //           <p>12<em>分钟</em></p>
  //           <span>练习天数</span>
  //         </div>
</style>
