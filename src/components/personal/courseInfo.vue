<template>
  <div class="u-course-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': changeIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <div class="uc-do-record" v-if="changeIdx == 0">
        <ul class="ucr-do-list">
          <li class="ucr-do-item">
            <div class="ucr-do-l">
              <h2>课程课程课程课程</h2>
              <p>2019-93-833</p>
            </div>
            <button class="btn-com">继续做题</button>
          </li>
          <li class="ucr-do-item">
            <div class="ucr-do-l">
              <h2>课程课程课程课程 v 把势均力敌</h2>
              <p>2019-93-833</p>
            </div>
            <button class="btn-com">继续做题</button>
          </li>
          <li class="ucr-do-item">
            <div class="ucr-do-l">
              <h2>课程课程课程课程 v 把势均力敌</h2>
              <p>2019-93-833</p>
            </div>
            <button class="btn-com">继续做题</button>
          </li>
        </ul>
      </div>
      <!-- 错题集 -->
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
      props: {
        courseList: {
          type: Array
        }
      },
      txtArr: ['做题记录', '错题集', '收藏夹', '习题笔记'],
      changeIdx: 0,
      btnSts: {
        1: '成绩统计',
        2: '继续做题',
        3: '查看解析'
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
    console.log(this.courseList)
    // this.getQuestionRecord()
  },
  methods: {
    getQuestionRecord () {
      questionRecord({
        question_id: this.getQuestion.question_id,
        user_id: this.user_id,
        error_content: this.error_content
      }).then(data => {
        this.$Message.success('纠错问题提交成功')
        this.$emit('modalShow', false)
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";

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
