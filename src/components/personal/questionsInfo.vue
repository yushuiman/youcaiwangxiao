<template>
  <div class="u-course-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': changeIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <div class="uc-do-record" v-if="changeIdx == 0">
        <ul class="ucr-do-list">
          <li class="ucr-do-item" v-for="(item, index) in questionRecord" :key="index">
            <div class="ucr-do-l">
              <h2>{{item.paper_name}}</h2>
              <p>{{item.create_time}}</p>
            </div>
            <button class="btn-com">继续做题</button>
          </li>
        </ul>
        <!-- <div style="padding: 20px; text-align: center;">
          <Page
          :total="total"
          @on-change="onChange"
          @on-page-size-change="onPageSizeChange"
          :current="page"
          :page-size="limit"
          size="small"
          />
        </div> -->
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
      total: 1,
      limit: 3, // 一页显示几条
      page: 1, // 第几页
      questionRecord: [] // 做题记录
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    this.getQuestionRecord() // 做题记录
  },
  methods: {
    getQuestionRecord () {
      questionRecord({
        course_id: this.$route.query.course_id,
        user_id: this.user_id,
        limit: this.limit,
        page: this.page
      }).then(data => {
        const res = data.data
        this.questionRecord = res.data
        this.total = this.questionRecord.length / this.limit
      })
    },
    // 分页
    onChange (val) {
      this.page = val
    // this.getCourseList()
    },
    onPageSizeChange (val) {
      this.limit = val
    // this.getCourseList()
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
  // <ul class="ucr-do-list">
  //         <li class="ucr-do-item">
  //           <div class="ucr-do-l">
  //             <h2>这姑娘问 v 把势均力敌</h2>
  //             <p>2019-93-833</p>
  //           </div>
  //           <button class="btn-com">继续做题</button>
  //         </li>
  //         <li class="ucr-do-item">
  //           <div class="ucr-do-l">
  //             <h2>这姑娘问 v 把势均力敌</h2>
  //             <p>2019-93-833</p>
  //           </div>
  //           <button class="btn-com">继续做题</button>
  //         </li>
  //         <li class="ucr-do-item">
  //           <div class="ucr-do-l">
  //             <h2>这姑娘问 v 把势均力敌</h2>
  //             <p>2019-93-833</p>
  //           </div>
  //           <button class="btn-com">继续做题</button>
  //         </li>
  //       </ul>
</style>
