<template>
  <div class="zsd-section-wrap height-com">
    <div class="com-bg">
      <div class="mode-tab">
        <span :class="{'curren':getPoticData.paper_mode == 1 }" @click="doMode(1)"><i></i>练习模式</span>
        <span :class="{'curren':getPoticData.paper_mode == 2 }" @click="doMode(2)"><i></i>考试模式</span>
      </div>
      <div class="order-sel">
        <button class="btn-com" :class="{'curren': getPoticData.num == 15}" @click="orderDoNum(15)">随机15道</button>
        <button class="btn-com" :class="{'curren': getPoticData.num == 30}" @click="orderDoNum(30)">随机30道</button>
      </div>
    </div>
    <!-- 知识点章节 -->
    <Row>
      <Col span="24">
        <Menu accordion width="100%">
          <Submenu :name="index+1" v-for="(item, index) in sectionList" :key="index">
            <template slot="title" >
              <div class="menu-title">
                <div class="menu-section-title">{{item.section_name}}</div>
                <div>
                  <Progress
                    :percent="Number(item.correct)"
                    :stroke-width="10"
                    stroke-color="#0267FF"
                    hide-info style="width: 142px;"/>
                  <span style="margin-right: 30px; width: 68px; display: inline-block;text-align:right;">{{item.correct}}%</span>
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
      </Col>
    </Row>
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
import { getSection, getKnow } from '@/api/questions'

export default {
  props: {
    course_id: {
      type: Number
    },
    user_id: {
      type: Number
    },
    plate_id: {
      type: Number
    }
  },
  data () {
    return {
      sectionList: [], // 知识点章节
      getPoticData: {
        course_id: this.course_id,
        paper_id: '',
        section_id: '',
        knob_id: '', // 节id
        know_id: '', // 知识点id
        mock_id: '',
        user_id: this.user_id,
        plate_id: this.plate_id,
        num: 15, // 默认随机15道
        paper_mode: 1, // 默认练习模式
        paper_type: 1 // 默认单选
      },
      KnowShow: false, // 知识点显示
      knowList: [], // 知识点
      titleObj: {
        zhang: '',
        jie: '',
        dian: ''
      } // 做题页title
    }
  },
  components: {
  },
  mounted () {
    this.getSectionList()
  },
  methods: {
    getSectionList (val) {
      getSection({
        user_id: this.user_id,
        course_id: this.course_id
      }).then(data => {
        const res = data.data
        this.sectionList = res.data
      })
    },
    // 选择练习考试模式
    doMode (type) {
      if (type === 1) {
        this.getPoticData.paper_mode = 1
      } else if (type === 2) {
        this.getPoticData.paper_mode = 2
      }
    },
    // 做题数量
    orderDoNum (num) {
      if (num === 15) {
        this.getPoticData.num = 15
      } else if (num === 30) {
        this.getPoticData.num = 30
      }
    },
    // 知识点显示
    getKnow (item, val, index) {
      this.KnowShow = true
      this.getPoticData.section_id = item.section_id
      this.getPoticData.knob_id = val.knob_id
      this.titleObj.zhang = item.section_name
      this.titleObj.jie = val.knob_name
      this.getKnowList()
    },
    // 知识点数据
    getKnowList () {
      getKnow({
        section_id: this.getPoticData.section_id,
        knob_id: this.getPoticData.knob_id
      }).then(data => {
        const res = data.data
        this.knowList = res.data
      })
    },
    // 去做题
    goToPic (v) {
      this.getPoticData.know_id = v.id
      this.titleObj.dian = v.know_name
      window.localStorage.setItem('titleObj', JSON.stringify(this.titleObj))
      this.$router.push({ path: '/dopotic', query: this.getPoticData })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .com-bg{
    .zsd-section-wrap &{
      display: flex;
      justify-content: space-between;
    }
  }
  .mode-tab{
    span{
      font-size: 18px;
      margin-right: 34px;
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
