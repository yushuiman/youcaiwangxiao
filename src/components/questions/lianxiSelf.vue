<template>
  <div class="lianxi-self-wrap height-com">
    <div class="com-bg menu-jie-title">
      <span>请选择需要练习的章节</span>
      <button class="btn-com do-potic-btn" v-for="(num, index) in numArr" :key="index">{{num}}</button>
    </div>
    <Row>
      <Col span="24">
        <Menu accordion width="100%">
          <Submenu :name="index+1" v-for="(item, index) in sectionList" :key="index">
            <template slot="title" >
              <div class="menu-section-title">
                {{item.section_name}}
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
      </Col>
    </Row>
    <!-- 知识点 -->
    <Modal v-model="KnowShow"
      :width="795"
      draggable
      footer-hide
      title="自助练习"
      class="practiceModal">
      <div class="height-com">
        <div class="com-bg menu-jie-title">
          请选择需要练习的知识点（最多选三个）<button class="btn-com do-potic-btn">去做题</button>
        </div>
        <ul class="know-list">
          <li v-for="(val, key) in knowList" :key="key" @click="goToPic(val)">
            <span><label class="check"></label>{{val.know_name}}</span>
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
    }
  },
  data () {
    return {
      sectionList: [], // 知识点章节
      numArr: [5, 10, 15, 20, 25, 30], // 随即题数
      getQuestion: {
        course_id: this.course_id,
        paper_id: '',
        section_id: '',
        knob_id: '', // 节id
        know_id: '', // 知识点id
        mock_id: '',
        user_id: this.user_id,
        plate_id: this.plate_id,
        num: 5, // 默认随机15道
        paper_mode: 1, // 默认练习模式
        paper_type: 1 // 默认单选
      },
      KnowShow: false, // 知识点显示
      knowList: [] // 知识点
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
        course_id: this.course_id,
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        this.sectionList = res.data
      })
    },
    // 知识点显示
    getKnow (item, val, index) {
      this.KnowShow = true
      this.getQuestion.section_id = item.section_id
      this.getQuestion.knob_id = val.knob_id
      this.getKnowList()
    },
    // 知识点数据
    getKnowList () {
      getKnow({
        section_id: this.getQuestion.section_id,
        knob_id: this.getQuestion.knob_id
      }).then(data => {
        const res = data.data
        this.knowList = res.data
      })
    },
    // 去做题
    goToPic ({ id }) {
      this.getQuestion.know_id = id
      console.log('跳转做题页')
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
  }
</style>
