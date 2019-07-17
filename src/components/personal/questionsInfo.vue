<template>
  <div class="u-question-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': changeIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <!-- 做题记录 -->
      <questions-menuItem v-if="changeIdx == 0" :courseList="courseList"></questions-menuItem>
      <!-- 错题集 -->
      <error-menuItem v-if="changeIdx == 1" :courseList="courseList"></error-menuItem>
      <!-- 收藏夹 -->
      <collection-menuItem v-if="changeIdx == 2" :courseList="courseList"></collection-menuItem>
      <!-- 习题笔记 -->
      <div v-if="changeIdx == 3">习题笔记</div>
    </div>
  </div>
</template>

<script>
import questionsMenuItem from '../../components/personal/questions/questionsMenuItem'
import errorMenuItem from '../../components/personal/questions/errorMenuItem'
import collectionMenuItem from '../../components/personal/questions/collectionMenuItem'
import { getProject } from '@/api/personal'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      txtArr: ['做题记录', '错题集', '收藏夹', '习题笔记'],
      changeIdx: window.sessionStorage.getItem('changeIdx'),
      courseList: [] // 课程列表
    }
  },
  components: {
    questionsMenuItem,
    errorMenuItem,
    collectionMenuItem
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    this.getProjectList()
  },
  methods: {
    // tab
    tabClk (v, index) {
      if (!this.user_id) {

      }
      window.sessionStorage.setItem('changeIdx', index)
      this.changeIdx = index
    },
    getProjectList (type) {
      getProject({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        this.courseList = res.data
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
</style>
