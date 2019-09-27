<template>
  <div class="right-com">
    <div class="com-title">
      <span>正在学习的学员</span>
    </div>
    <div class="com-list">
      <img class="student-head" :src="item.head" alt="" v-for="(item, index) in learnuser" :key="index">
    </div>
  </div>
</template>

<script>
import { listuser } from '@/api/learncenter'
export default {
  data () {
    return {
      learnuser: []
    }
  },
  computed: {

  },
  mounted () {
    this.getListuser()
  },
  methods: {
    getListuser () {
      listuser().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.learnuser = res.data
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
    height: 170px;
    padding: 10px 4px;
    box-sizing: border-box;
    margin-bottom: 20px;
    overflow: auto;
    .student-head{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin: 5px;
    }
  }
</style>
