<template>
  <div class="error-section-wrap">
    <Row>
      <Col span="24">
        <Menu accordion width="100%" class="error-menu-list">
          <Submenu :name="index+1" class="error-menu-item" v-for="(item, index) in errorSecList" :key="index">
            <template slot="title">
              <div class="menu-section-title">
                {{item.know_section_name}}
                <span>（收藏<em>{{item.sectioncoun}}</em>道题）</span>
              </div>
            </template>
            <MenuItem class="error-menu-er" :name="(index+1)+ '-' + (key+1)" v-for="(val, key) in item.knob" :key="key" style="padding-left: 40px;padding-right: 40px;">
              <div class="menu-jie-title">
                <div>
                  {{val.knob_name}}
                  <span>（收藏<em style="color:#f00;">{{val.knobcoun}}</em>道题）</span>
                </div>
                <button class="btn-zsd" @click="getKnow(item, val, key)">选择知识点</button>
              </div>
            </MenuItem>
          </Submenu>
        </Menu>
      </Col>
    </Row>
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
              <!-- <button class="btn-com" @click="goToPic(val, '2')">去做题</button> -->
            </div>
          </li>
        </ul>
      </div>
    </Modal>
  </div>
</template>
<script>
import { myCollquestion, myCollquestionknob } from '@/api/personal'
import { mapState } from 'vuex'

export default {
  data () {
    return {
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
        paper_type: 1, // 单选1 论述2
        sc: 1 // 收藏用户答案文案不展示
      },
      visible: false, // 知识点显示
      knowList: [] // 知识点
    }
  },
  components: {
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    this.getMyCollquestion()
  },
  methods: {
    getMyCollquestion (val) {
      myCollquestion({
        course_id: this.getPoticData.course_id,
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        this.errorSecList = res.data
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
      myCollquestionknob({
        user_id: this.user_id,
        course_id: this.getPoticData.course_id,
        section_id: this.getPoticData.section_id,
        knob_id: this.getPoticData.knob_id
      }).then(data => {
        const res = data.data
        this.knowList = res.data
      })
    },
    goToPic (v, type) {
      this.getPoticData.know_id = v.know_id
      window.sessionStorage.setItem('subTopics', JSON.stringify(this.getPoticData))
      window.sessionStorage.setItem('diffRes', 2) // 区分不同的接口请求
      // 查看解析
      window.sessionStorage.setItem('diffTxt', 2) // 区分查看报告按钮，返回个人中心
      window.sessionStorage.setItem('userOptionFlag', 1) // 收藏记录查看解析，只有正确答案展示，用户答案没有
      this.$router.push({ path: '/analysis', query: this.getPoticData })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  @import "../../assets/scss/ivu-menu.css";
  // @import "../../assets/scss/questions.css";

  // .error-menu-item{
  //   border-radius: 8px;
  //   box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
  //   background: #ffffff;
  //   margin-bottom: 20px;
  //   // padding: 18px 20px;
  // }
  // .com-bg {
  //   background: #F3F6FF;
  //   color: #666666;
  //   font-size: 18px;
  //   padding: 12px 30px;
  //   margin-bottom: 10px;
  // }
</style>
