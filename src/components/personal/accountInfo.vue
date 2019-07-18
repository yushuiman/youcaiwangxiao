<template>
  <div class="u-user-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': userChangeIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <div v-if="userChangeIdx == 0">
        个人信息修改内容
      </div>
      <div v-if="userChangeIdx == 1">
        密码修改内容
      </div>
    </div>
  </div>
</template>

<script>
import { getProject } from '@/api/personal'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      txtArr: ['个人信息修改', '密码修改'],
      userChangeIdx: window.sessionStorage.getItem('userChangeIdx') || 0,
      courseList: [] // 课程列表
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
    this.getProjectList()
  },
  methods: {
    // tab
    tabClk (v, index) {
      if (!this.user_id) {

      }
      window.sessionStorage.setItem('userChangeIdx', index)
      this.userChangeIdx = index
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
