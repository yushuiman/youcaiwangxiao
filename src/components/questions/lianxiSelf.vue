<template>
  <div class="lianxi-self-wrap height-com">
    <div class="com-bg">
      <span>请选择需要练习的章节</span>
      <div class="order-sel">
        <button class="btn-com" :class="{'curren': selNum == index}" v-for="(num, index) in numArr" :key="index" @click="orderDoNum(num, index)">{{num}}</button>
      </div>
    </div>
    <Menu accordion width="100%">
      <Submenu :name="index+1" v-for="(item, index) in sectionList" :key="index">
        <template slot="title" >
          <div class="menu-section-title">
            {{item.know_section_name}}
          </div>
        </template>
        <MenuItem :name="(index+1)+ '-' + (key+1)" v-for="(val, key) in item.knob" :key="key" style="padding-left: 60px;">
          <div class="menu-jie-title" @click="getKnow(item, val, key)">
            <div>
              {{val.knob_name}}
            </div>
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
      title="自助练习"
      class="practiceModal">
      <div class="height-com">
        <div class="com-bg menu-jie-title">
          请选择需要练习的知识点（最多选三个）<button class="btn-com do-potic-btn" v-if="this.knowIdArr.length>0" @click="goToPic()">去做题</button>
        </div>
        <ul class="know-list">
          <li v-for="(val, key) in knowList" :key="key" @click="multipleChoices(val, key)">
            <span>
              <label class="check" :class="{'checked': knowIdArr.indexOf(val.know_id)>=0}">
                <Icon type="md-checkmark" v-if="knowIdArr.indexOf(val.know_id)>=0"/>
              </label>
              {{val.know_name}}
            </span>
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
      numArr: [5, 10, 15, 20, 25, 30], // 随即题数
      getPoticData: {
        course_id: this.course_id,
        paper_id: '', // 阶段测试,论述题,冲刺训练营 这个取接口返回的
        section_id: 0,
        knob_id: 0, // 节id
        know_id: 0, // 知识点id
        mock_id: 0,
        plate_id: this.plate_id,
        num: 5, // 默认随机15道
        paper_type: 1 // 单选1 论述2
      },
      KnowShow: false, // 知识点显示
      knowList: [], // 知识点
      selId: false,
      selNum: 0,
      knowIdArr: []
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    // 知识点显示
    getKnow (item, val, index) {
      this.KnowShow = true
      this.getPoticData.section_id = item.section_id
      this.getPoticData.knob_id = val.knob_id
      this.getKnowList()
    },
    // 知识点数据
    getKnowList () {
      this.knowIdArr = []
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
    // 做题数量
    orderDoNum (num, index) {
      this.selNum = index
      this.getPoticData.num = num
    },
    // 多选
    multipleChoices (val, index) {
      let idIndex = this.knowIdArr.indexOf(val.know_id)
      if (idIndex >= 0) {
        this.knowIdArr.splice(idIndex, 1)
      } else {
        if (this.knowIdArr.length >= 3) {
          this.$Message.warning('最多选择3个')
          return
        }
        this.knowIdArr.push(val.know_id)
      }
      this.getPoticData.know_id = this.knowIdArr.join(',')
    },
    // 去做题
    goToPic () {
      this.$router.push({ path: '/dopotic', query: this.getPoticData })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
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
  .check{
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1px solid $col999;
    display: inline-block;
    vertical-align: middle;
    margin-top: -3px;
    margin-right: 10px;
    position: relative;
    &.checked{
      border: 1px solid $blueColor;
      // i{
      //   display: inline-block;
      // }
    }
  }
  .order-sel{
    .btn-com{
      width: 58px;
      height: 25px;
      margin-left: 20px;
      &.curren{
        background: $blueColor;
        color: $colfff;
      }
    }
  }
</style>
