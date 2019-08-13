<template>
  <div class="right-com">
    <div class="com-title">
      <span>正在学习的学员</span>
    </div>
    <div class="com-list">
      <img class="student-head" src="../../assets/images/learncenter/outplan-small.png" alt="">
      <img class="student-head" src="../../assets/images/learncenter/r-icon01.png" alt="">
      <img class="student-head" src="../../assets/images/learncenter/r-icon01.png" alt="">
      <img class="student-head" src="../../assets/images/learncenter/progress-icon.png" alt="">
      <img class="student-head" src="../../assets/images/learncenter/status-blue.png" alt="">
      <img class="student-head" src="../../assets/images/learncenter/r-icon01.png" alt="">
    </div>
  </div>
</template>

<script>
import { guessLike } from '@/api/class'
export default {
  props: {
    isW: {
      type: Boolean
    }
  },
  data () {
    return {
      likeArr: []
    }
  },
  computed: {

  },
  mounted () {
    this.getGuessLike()
  },
  methods: {
    // 猜你喜欢
    getGuessLike () {
      guessLike().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.likeArr = res.data.slice(0, 3)
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
  .right-com{
    padding: 0 10px;
    background: #ffffff;
    border-radius: 8px;
  }
  .com-title{
    padding-left: 22px;
    height: 39px;
    line-height: 39px;
    border-bottom: 1px solid #E6E6E6;
    background: url('../../assets/images/learncenter/r-icon02.png') no-repeat left center;
    background-size: 15px 16px;
  }
  .com-list{
    padding: 10px 4px;
    margin-bottom: 20px;
    .student-head{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin: 5px;
    }
  }
</style>
