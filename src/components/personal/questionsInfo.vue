<template>
  <div class="u-question-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main" v-if="courseList.length">
      <!-- 做题记录 -->
      <questions-menuItem v-if="selIdx == 0" :courseList="courseList" :user_id="user_id"></questions-menuItem>
      <!-- 错题集 -->
      <error-menuItem v-if="selIdx == 1" :courseList="courseList" :user_id="user_id"></error-menuItem>
      <!-- 收藏夹 -->
      <collection-menuItem v-if="selIdx == 2" :courseList="courseList" :user_id="user_id"></collection-menuItem>
      <!-- 习题笔记 -->
      <!-- <div v-if="selIdx == 3">
        <div class="no-data">
          暂无数据
        </div>
      </div> -->
    </div>
    <div class="no-data" v-if="noDataFlag">
      暂无数据
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
      // txtArr: ['做题记录', '错题集', '收藏夹', '习题笔记'],
      txtArr: ['做题记录', '错题集', '收藏夹'],
      selIdx: this.$route.query.selIdx || 0,
      noDataFlag: false,
      courseList: [], // 课程列表
      course_id: window.sessionStorage.getItem('course_id') || ''
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
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.getProjectList()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getProjectList()
      })
    }
  },
  methods: {
    // tab
    tabClk (v, index) {
      this.selIdx = index
      this.$router.replace({ path: '/personal',
        query: {
          ...this.$route.query,
          selIdx: index
        }
      })
    },
    getProjectList (type) {
      getProject({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.courseList = res.data
          window.sessionStorage.setItem('course_id', this.course_id || this.courseList[0].course_id)
          if (this.courseList.length === 0) {
            this.noDataFlag = true
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
  .all-main{
    padding-top: 1px;
  }
</style>
