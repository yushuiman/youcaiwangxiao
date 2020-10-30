<template>
  <div class="zsd-section-wrap height-com">
    <div class="com-bg">
      <div class="mode-tab">
        <span :class="{'curren':getPoticData.paper_mode == 1 }" @click="doMode(1)"><i></i>练习模式</span>
        <span :class="{'curren':getPoticData.paper_mode == 2 }" @click="doMode(2)"><i></i>考试模式</span>
      </div>
      <div class="order-sel">
        <button class="btn-com" :class="{'curren': getPoticData.num == 30}" @click="orderDoNum(30)">顺序做题</button>
        <button class="btn-com" :class="{'curren': getPoticData.num == 15}" @click="orderDoNum(15)">随机15道</button>
      </div>
    </div>
    <!-- 知识点章节 -->
    <Menu accordion width="100%">
      <Submenu :name="index+1" v-for="(item, index) in sectionList" :key="index">
        <template slot="title" >
          <div class="menu-title">
            <div class="menu-section-title">{{item.know_section_name}}</div>
            <div>
              <span style="font-size: 12px;margin-right: 5px;">已做</span>
              <Progress
                :percent="Number(item.have)"
                :stroke-width="10"
                stroke-color="#0267FF"
                hide-info style="width: 142px;font-size:14px;"/>
              <span style="margin-right: 30px; width: 68px; display: inline-block;text-align:right;">{{item.have}}%</span>
            </div>
          </div>
        </template>
        <MenuItem :name="(index+1)+ '-' + (key+1)" v-for="(val, key) in item.knob" :key="key" style="padding-left: 60px;">
          <div class="menu-jie-title" @click="getKnow(item, val, key)">
            <div>{{val.knob_name}}</div>
            <button class="btn-com do-potic-btn">去做题</button>
          </div>
        </MenuItem>
      </Submenu>
    </Menu>
    <!-- 知识点 -->
    <Modal v-model="KnowShow"
      :width="795"
      draggable
      footer-hide
      title="知识点练习"
      class="practiceModal">
      <div class="height-com">
        <div class="com-bg">
            请选择需要练习的知识点
        </div>
        <ul class="know-list">
          <li v-for="(val, key) in knowList" :key="key" @click="goToPic(val)">
            <span>{{val.know_name}}</span>
            <button class="btn-com do-potic-btn">去做题</button>
          </li>
        </ul>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getKnow } from '@/api/questions'

export default {
  props: {
    sectionList: {
      type: Array
    },
    course_id: {
      type: Number
    },
    plate_id: {
      type: Number
    }
  },
  data () {
    return {
      getPoticData: {
        course_id: this.course_id,
        paper_id: '', // 阶段测试,论述题,冲刺训练营 这个取接口返回的
        section_id: 0,
        knob_id: 0, // 节id
        know_id: 0, // 知识点id
        mock_id: 0,
        plate_id: this.plate_id,
        num: 30, // 默认顺序30道
        paper_mode: 1, // 练习模式1 考试模式2
        paper_type: 1 // 单选1 论述2
      },
      KnowShow: false, // 知识点显示
      knowList: [] // 知识点
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    // 选择练习考试模式
    doMode (type) {
      this.getPoticData.paper_mode = type
    },
    // 做题数量
    orderDoNum (num) {
      this.getPoticData.num = num
    },
    // 知识点显示
    getKnow (item, val, index) {
      this.KnowShow = true
      this.getPoticData.section_id = item.section_id
      this.getPoticData.knob_id = val.knob_id
      this.getKnowList()
    },
    // 知识点数据
    getKnowList () {
      getKnow({
        course_id: this.getPoticData.course_id,
        section_id: this.getPoticData.section_id,
        knob_id: this.getPoticData.knob_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.knowList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 去做题
    goToPic (v) {
      this.getPoticData.know_id = v.know_id
      this.$router.push({ path: '/dopotic', query: this.getPoticData })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .mode-tab{
    span{
      font-size: 18px;
      margin-right: 34px;
      cursor: pointer;
      i{
        width: 16px;
        height: 16px;
        display: inline-block;
        border-radius: 100%;
        box-sizing: border-box;
        margin-right: 12px;
        border: 1px solid $blueColor;
        vertical-align: middle;
        margin-top: -3px;
        position: relative;
      }
      &.curren{
        i{
          &:after{
            position: absolute;
            content: "";
            left: 50%;
            top: 50%;
            margin-left: -4px;
            margin-top: -4px;
            width: 8px;
            height: 8px;
            border-radius: 100%;
            background: $blueColor;
          }
        }
      }
    }
  }
  .order-sel{
    text-align: center;
    .btn-com{
      width: 90px;
      height: 26px;
      margin-left: 20px;
      border-radius: 14px;
      &.curren{
        background: $blueColor;
        color: $colfff;
      }
    }
  }
  // iview
  .menu-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .menu-jie-title{
    display: flex;
    justify-content: space-between;
  }
  .menu-section-title, .menu-jie-title{
    color: $col333;
    font-size: 18px;
    div{
      color: $col666;
      font-size: 16px;
    }
    span{
      font-size: 16px;
      color: $col666;
      em{
        color: #f00;
      }
    }
  }
</style>
