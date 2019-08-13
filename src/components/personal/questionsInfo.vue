<template>
  <div class="u-question-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdxQuestion == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main" v-if="courseList.length">
      <!-- 做题记录 -->
      <questions-menuItem v-if="selIdxQuestion == 0" :courseList="courseList" :user_id="user_id"></questions-menuItem>
      <!-- 错题集 -->
      <error-menuItem v-if="selIdxQuestion == 1" :courseList="courseList" :user_id="user_id"></error-menuItem>
      <!-- 收藏夹 -->
      <collection-menuItem v-if="selIdxQuestion == 2" :courseList="courseList" :user_id="user_id"></collection-menuItem>
      <!-- 习题笔记 -->
      <div v-if="selIdxQuestion == 3">
        习题笔记
      </div>
    </div>
    <div class="no-data" v-else>
      暂无数据
    </div>
  </div>
</template>

<script>
import questionsMenuItem from '../../components/personal/questions/questionsMenuItem'
import errorMenuItem from '../../components/personal/questions/errorMenuItem'
import collectionMenuItem from '../../components/personal/questions/collectionMenuItem'
import { getProject } from '@/api/personal'
// import { mapState } from 'vuex'
export default {
  props: {
    user_id: {
      type: Number
    }
  },
  data () {
    return {
      txtArr: ['做题记录', '错题集', '收藏夹', '习题笔记'],
      selIdxQuestion: window.sessionStorage.getItem('selIdxQuestion') || 0,
      courseList: [] // 课程列表
    }
  },
  components: {
    questionsMenuItem,
    errorMenuItem,
    collectionMenuItem
  },
  // computed: {
  //   ...mapState({
  //     token: state => state.user.token,
  //     user_id: state => state.user.user_id
  //   })
  // },
  mounted () {
    this.getProjectList()
  },
  methods: {
    // tab
    tabClk (v, index) {
      if (!this.user_id) {

      }
      window.sessionStorage.setItem('selIdxQuestion', index)
      this.selIdxQuestion = index
    },
    getProjectList (type) {
      getProject({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.courseList = res.data
          let cId = window.sessionStorage.getItem('course_id')
          if (!cId) {
            window.sessionStorage.setItem('course_id', this.courseList[0].course_id)
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
</style>
