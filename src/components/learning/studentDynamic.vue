<template>
  <div class="right-com">
    <div class="com-title">
      <span>学员动态</span>
    </div>
    <ul class="com-list">
      <li class="com-item" v-for="(item, index) in userDynamicList" :key="index">
        <span class="c-black">{{item}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { userDynamic } from '@/api/learncenter'
export default {
  data () {
    return {
      userDynamicList: []
    }
  },
  computed: {

  },
  mounted () {
    this.getUserDynamic()
  },
  methods: {
    getUserDynamic () {
      userDynamic().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.userDynamicList = res.data
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
    font-size: 14px;
    background: url('../../assets/images/learncenter/r-icon03.png') no-repeat left center;
    background-size: 14px 14px;
  }
  .com-list{
    padding: 10px 0;
    .com-item{
      height: 20px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: $col999;
      .c-black{
        color: $col333;
      }
    }
  }
</style>
