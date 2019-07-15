<template>
  <div class="u-question-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': changeIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <div class="uc-do-record" v-if="changeIdx == 0">
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
      </div>
      <div v-if="changeIdx == 1">错题集</div>
      <div v-if="changeIdx == 2">收藏夹</div>
      <div v-if="changeIdx == 3">习题笔记</div>
    </div>
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
import { questionRecord, personalWrongtopic } from '@/api/personal'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      txtArr: ['做题记录', '错题集', '收藏夹', '习题笔记'],
      changeIdx: 0,
      questionRecordList: [], // 做题记录
      PersonalWrongtopicList: [], // 错题记录
      btnSts: {
        1: '成绩统计',
        2: '继续做题',
        3: '查看解析'
      },
      page: 1,
      total: 1,
      limit: 10,
      getPoticData: {
        course_id: '',
        paper_id: '',
        section_id: '',
        knob_id: '', // 节id
        know_id: '', // 知识点id
        mock_id: '',
        user_id: '',
        plate_id: '',
        paper_mode: 2, // 练习模式1 考试2
        paper_type: 1 // 单选1 论述2
      }
    }
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
    // tab
    tabClk (v, index) {
      if (!this.user_id) {

      }
      this.changeIdx = index
      if (index === 1) {
        this.getPersonalWrongtopic()
        // course_id=2&paper_id=3&section_id=&knob_id=&know_id=&mock_id=&user_id=20&plate_id=2&num=&paper_type=1
      }
      if (index === 2) {
        // this.getPersonalWrongtopic()
      }
      if (index === 3) {
        // this.getPersonalWrongtopic()
      }
    },
    // 做题记录
    getQuestionRecord () {
      questionRecord({
        user_id: this.user_id,
        course_id: this.$route.query.course_id,
        limit: this.limit,
        page: this.page
      }).then(data => {
        const res = data.data
        this.questionRecordList = res.data.question
        this.total = res.data.num
      })
    },
    // 错题记录
    getPersonalWrongtopic () {
      personalWrongtopic({
        user_id: this.user_id,
        course_id: this.$route.query.course_id
      }).then(data => {
        const res = data.data
        this.questionRecordList = res.data.question
        this.total = res.data.num
      })
    },
    // 分页
    onChange (val) {
      this.page = val
      if (this.changeIdx === 0) {
        this.getQuestionRecord()
      }
      if (this.changeIdx === 1) {
        this.getPersonalWrongtopic()
      }
      if (this.changeIdx === 1) {
        this.getPersonalWrongtopic()
      }
      if (this.changeIdx === 1) {
        this.getPersonalWrongtopic()
      }
    },
    goPage (item) {
      if (item.state === 1) { // 成绩统计
        this.$router.push({ path: 'result-report',
          query: {
            paper_id: item.id
          }
        })
      }
      if (item.state === 2) { // 继续做题
        this.getPoticData.course_id = item.course_id
        this.getPoticData.paper_id = item.id
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
      }
      if (item.state === 3) { // 查看解析 论述题才有查看解析
        this.$router.push({ path: 'analysis',
          query: {
            paper_id: item.id, // 试卷id(阶段，论述才有)
            plate_id: item.plate_id, // 板块
            course_id: item.course_id, // 板块
            type: 2, // 所有解析
            jiexi: 2 // 区分答题记录的解析，6大板块解析没有这个参数的
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  // 做题记录
  .u-question-wrap{
    font-size: 18px;
  }
  .ucr-do-list{
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
  }
  .ucr-do-item{
    background: $colfff;
    background:#ffffff;
    @include flexJustifyAlignItem;
    padding: 22px 20px;
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
