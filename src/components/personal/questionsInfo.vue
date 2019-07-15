<template>
  <div class="u-course-wrap">
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
            <button class="btn-com">{{btnSts[item.state]}}</button>
          </li>
        </ul>
      </div>
      <div v-if="changeIdx == 1">错题集</div>
      <div v-if="changeIdx == 2">收藏夹</div>
      <div v-if="changeIdx == 3">习题笔记</div>
    </div>
  </div>
</template>

<script>
import { questionRecord } from '@/api/personal'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      txtArr: ['做题记录', '错题集', '收藏夹', '习题笔记'],
      changeIdx: 0,
      questionRecordList: [],
      btnSts: {
        1: '成绩统计',
        2: '继续做题',
        3: '查看解析'
      },
      page: 1,
      limit: 10
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    this.getQuestionRecord()
  },
  methods: {
    getQuestionRecord () {
      questionRecord({
        user_id: this.user_id,
        course_id: this.$route.query.course_id,
        limit: this.limit,
        page: this.page
      }).then(data => {
        const res = data.data
        this.questionRecordList = res.data
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  // 做题记录
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
    .btn-com{
      width: 103px;
      height: 32px;
      font-size: 16px;
    }
  }
</style>
