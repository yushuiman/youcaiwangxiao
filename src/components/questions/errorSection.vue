<template>
  <div class="error-section-wrap height-com">
    <div class="com-bg">
      考试模式
    </div>
    <Row>
      <Col span="24">
        <Menu accordion width="100%">
          <Submenu :name="index+1" v-for="(item, index) in errorSecList" :key="index">
            <template slot="title" >
              <div class="menu-section-title">
                {{item.section_name}}
                <span>（<em>{{item.sectionnum}}</em>道错题）</span>
              </div>
            </template>
            <MenuItem :name="(index+1)+ '-' + (key+1)" v-for="(val, key) in item.knob" :key="key" style="padding-left: 60px;">
              <div class="menu-jie-title" @click="getKnow(item, val, key)">
                <div>
                  {{val.knob_name}}
                  <span>（<em style="color:#f00;">{{val.knownum}}</em>道错题）</span>
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
      title="系统高频错题"
      class="practiceModal">
      <div class="height-com">
        <div class="com-bg">
          考试模式
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
import { getErrorsection, getKnow } from '@/api/questions'

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
      errorSecList: [], // 知识点章节
      getPoticData: {
        course_id: this.course_id,
        paper_id: '',
        section_id: '',
        knob_id: '', // 节id
        know_id: '', // 知识点id
        mock_id: '',
        user_id: this.user_id,
        plate_id: this.plate_id,
        num: '', // 默认随机15道
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
    this.getErrorsectionList()
  },
  methods: {
    getErrorsectionList (val) {
      console.log('2323232323')
      getErrorsection({
        course_id: this.course_id
      }).then(data => {
        const res = data.data
        this.errorSecList = res.data
      })
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
