<template>
  <div class="uc-do-record">
    <div class="select-box">
      <select class="com-sel" v-model="course_id" @change="getCourseIdSel($event)">
        <option class="com-opt" :value="v.course_id" v-for="(v, index) in courseList" :key="index">{{v.name}}</option>
      </select>
      <Icon type="md-arrow-dropdown" style="font-size:24px; position:absolute; right: 5px; top: 3px;" />
    </div>
    <ul class="ucr-do-list">
      <li class="ucr-do-item" v-for="(item, index) in questionRecordList" :key="index">
        <div class="ucr-do-l">
          <h2>{{item.paper_name}}</h2>
          <p>{{item.create_time}}</p>
        </div>
        <button :class="{'yellow-btn': item.state == 1, 'blue-btn': item.state == 2, 'green-btn': item.state == 3}"
        @click="goPage(item)">{{btnSts[item.state]}}</button>
      </li>
    </ul>
    <div style="padding: 20px; text-align: center;">
      <Page
      :total="total"
      @on-change="onChange"
      :current="page"
      :page-size="limit"
      size="small"
      />
    </div>
  </div>
</template>
<script>
import { questionRecord } from '@/api/personal'
import { mapState } from 'vuex'

export default {
  props: {
    courseList: {
      type: Array
    }
  },
  data () {
    return {
      course_id: window.sessionStorage.getItem('course_id') || '',
      questionRecordList: [], // 做题记录
      btnSts: {
        1: '成绩统计',
        2: '继续做题',
        3: '查看解析'
      },
      page: 1,
      total: 1,
      limit: 10,
      getPoticData: {
        id: '',
        course_id: window.sessionStorage.getItem('course_id'),
        paper_id: '',
        section_id: '',
        knob_id: '', // 节id
        know_id: '', // 知识点id
        mock_id: '',
        plate_id: '',
        paper_mode: 2, // 练习模式1 考试2
        paper_type: 1 // 单选1 论述2
      }
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
    this.getQuestionRecord()
  },
  methods: {
    getCourseIdSel (e) {
      window.sessionStorage.setItem('selIdx', e.target.selectedIndex)
      window.sessionStorage.setItem('course_id', this.course_id)
      this.getQuestionRecord()
    },
    // 做题记录
    getQuestionRecord () {
      questionRecord({
        user_id: this.user_id,
        course_id: this.course_id,
        limit: this.limit,
        page: this.page
      }).then(data => {
        const res = data.data
        this.questionRecordList = res.data.question
        this.total = res.data.num
      })
    },
    // 分页
    onChange (val) {
      this.page = val
      this.getQuestionRecord()
    },
    goPage (item) {
      if (item.state === 1) { // 成绩统计
        window.sessionStorage.setItem('diffTxt', 10) // 区分查看报告按钮，返回个人中心
        window.sessionStorage.setItem('diffRes', '') // 区分不同的接口请求
        this.$router.push({ path: 'result-report',
          query: {
            paper_id: item.id
          }
        })
      }
      if (item.state === 2) { // 继续做题
        window.sessionStorage.setItem('diffRes', '') // 区分不同接口请求
        window.sessionStorage.setItem('diffTxt', 10) // 区分查看报告按钮，返回个人中心
        this.getPoticData.id = item.id
        this.getPoticData.course_id = item.course_id
        this.getPoticData.paper_id = item.paper_id
        this.getPoticData.section_id = item.section_id
        this.getPoticData.knob_id = item.knob_id
        this.getPoticData.know_id = item.know_id
        this.getPoticData.mock_id = item.mock_id
        this.getPoticData.plate_id = item.plate_id
        this.getPoticData.paper_mode = item.paper_type // 1练习模式 2考试模式
        this.getPoticData.paper_type = item.paper_type // 1练习模式 2考试模式
        this.$router.push({ path: 'dopotic-continue',
          query: this.getPoticData
        })
        window.sessionStorage.setItem('subTopics', JSON.stringify(this.getPoticData))
      }
      if (item.state === 3) { // 查看解析 论述题才有查看解析
        window.sessionStorage.setItem('diffRes', 0) // 区分不同接口请求
        window.sessionStorage.setItem('diffTxt', 0) // 区分查看报告按钮，返回个人中心
        this.$router.push({ path: 'analysis',
          query: {
            paper_id: item.id, // 试卷id(阶段，论述才有)
            plate_id: item.plate_id, // 板块
            course_id: item.course_id, // 板块
            type: 2 // 所有解析
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../../assets/scss/app";
  .ucr-do-list{
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
  }
  .ucr-do-item{
    background: $colfff;
    background:#ffffff;
    @include flexJustifyAlignItem;
    padding: 22px 20px;
    &:first-child{
      border-radius: 8px 8px 0px 0px;
    }
    &:last-child{
      border-radius: 0px 0px 8px 8px;
    }
    &:hover{
      background: #F3F6FF;
    }
    h2{
      font-size: 18px;
    }
    p{
      color: $col999;
      margin-top: 8px;
    }
    button{
      width: 103px;
      height: 32px;
      color: $colfff;
      border-radius: 16px;
    }
    .yellow-btn{
      background: #F99111;
    }
    .blue-btn{
      background: #1874FD;
    }
    .green-btn{
      background: #0AAB55;
    }
  }
</style>
