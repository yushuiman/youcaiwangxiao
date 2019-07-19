<template>
  <div class="u-zhibo-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdxAccount == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="zhibo-main">
      <div v-if="selIdxAccount == 0">消费项目</div>
      <div v-if="selIdxAccount == 1">课程卡管理</div>
    </div>
  </div>
</template>

<script>
// import { errorCorrection } from '@/api/questions'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      txtArr: ['消费记录', '课程卡管理'],
      selIdxAccount: window.sessionStorage.getItem('selIdxAccount') || 0
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  mounted () {

  },
  methods: {
    tabClk (v, index) {
      this.selIdxAccount = index
      window.sessionStorage.setItem('selIdxAccount', index)
      this.initRes()
    },
    initRes () {
      if (parseInt(this.selIdxAccount) === 0) {
        // this.getCourseAnswer()
      }
      if (parseInt(this.selIdxAccount) === 1) {
        // this.getQuestionAnswer()
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  @import "../../assets/scss/personal";
</style>
