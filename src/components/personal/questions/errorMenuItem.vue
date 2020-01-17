<template>
  <div class="error-section-wrap">
    <div class="select-box">
      <select class="com-sel" v-model="course_id" @change="getCourseIdSel($event)">
        <option class="com-opt" :value="v.course_id" v-for="(v, index) in courseList" :key="index">{{v.name}}</option>
      </select>
      <Icon type="md-arrow-dropdown" style="font-size:24px; position:absolute; right: 5px; top: 3px;" />
    </div>
    <div v-if="errorSecList.length">
      <Menu accordion width="100%" class="error-menu-list">
        <Submenu :name="index+1" class="error-menu-item" v-for="(item, index) in errorSecList" :key="index">
          <template slot="title">
            <div class="menu-section-title">
              {{item.know_section_name}}
              <span>（<em>{{item.section_num}}</em>道错题）</span>
            </div>
          </template>
          <div class="error-menu-er" v-for="(val, key) in item.knob" :key="key" style="padding: 10px 40px;">
            <div class="menu-jie-title">
              <div>
                {{val.knob_name}}
                <span>（<em style="color:#f00;">{{val.knob_num}}</em>道错题）</span>
              </div>
              <button class="btn-zsd" @click="getKnow(item, val, key)">选择知识点</button>
            </div>
          </div>
        </Submenu>
      </Menu>
    </div>
    <div class="no-data" v-if="noDataFlag">
      暂无数据
    </div>
    <!-- 知识点 -->
    <Modal v-model="visible"
      :width="795"
      footer-hide
      title="知识点选择"
      class="practiceModal">
      <div class="height-com">
        <div class="com-bg">请选择需要练习的知识点</div>
        <ul class="know-list">
          <li v-for="(val, key) in knowList" :key="key">
            <span>{{val.know_name}}</span>
            <div class="error-btn">
              <button class="" @click="goToPic(val, '1')">查看解析</button>
              <button class="btn-com" @click="goToPic(val, '2')">去做题</button>
            </div>
          </li>
        </ul>
      </div>
    </Modal>
  </div>
</template>
<script>
import { personalWrongtopic, getKnow } from '@/api/personal'
// import { mapState } from 'vuex'

export default {
  props: {
    courseList: {
      type: Array
    },
    user_id: {
      type: Number
    }
  },
  data () {
    return {
      course_id: window.sessionStorage.getItem('course_id'),
      noDataFlag: false,
      errorSecList: [], // 知识点章节
      getPoticData: {
        course_id: window.sessionStorage.getItem('course_id'),
        paper_id: '', // 阶段测试,论述题
        section_id: '',
        knob_id: '', // 节id
        know_id: '', // 知识点id
        mock_id: '',
        plate_id: 4, // 错题
        num: '', // 默认随机15道
        paper_type: 1 // 单选1 论述2(错题记录没有论述)
      },
      visible: false, // 知识点显示
      knowList: [] // 知识点
    }
  },
  components: {
  },
  // computed: {
  //   ...mapState({
  //     token: state => state.user.token,
  //     user_id: state => state.user.user_id
  //   })
  // },
  mounted () {
    this.getErrorsectionList()
  },
  methods: {
    getCourseIdSel (e) {
      window.sessionStorage.setItem('course_id', this.course_id)
      this.getErrorsectionList()
    },
    getErrorsectionList (val) {
      this.noDataFlag = false
      personalWrongtopic({
        course_id: this.course_id,
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.errorSecList = res.data
          if (this.errorSecList.length === 0) {
            this.noDataFlag = true
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 知识点显示
    getKnow (item, val, index) {
      this.visible = true
      this.getPoticData.section_id = item.section_id
      this.getPoticData.knob_id = val.knob_id
      this.getKnowList()
    },
    // 知识点数据
    getKnowList () {
      getKnow({
        user_id: this.user_id,
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
    goToPic (v, type) {
      this.visible = false
      this.getPoticData.know_id = v.know_id
      window.sessionStorage.setItem('subTopics', JSON.stringify(this.getPoticData))
      // 查看解析
      if (type === '1') {
        window.sessionStorage.setItem('diffRes', 1) // 区分不同的接口请求
        window.sessionStorage.setItem('diffTxt', 1) // 区分查看报告按钮，返回个人中心
        this.$router.push({ path: '/analysis', query: this.getPoticData })
      }
      // 去做题
      if (type === '2') {
        window.sessionStorage.setItem('diffTxt', 10) // 区分查看报告按钮，返回个人中心
        window.sessionStorage.setItem('diffRes', 11) // 区分不同的接口请求，错题解析分为两个接口，全部，错题不能共用一个
        this.$router.push({ path: '/dopotic-error', query: this.getPoticData })
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../../assets/scss/app";
</style>
