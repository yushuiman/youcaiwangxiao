<template>
  <div class="right-com">
    <div class="com-title">
      <span>学员动态</span>
    </div>
    <ul class="com-list">
      <li class="com-item">
        是收到粉丝地方<span class="c-black">是到粉丝地方</span>是收到粉丝地方
      </li>
      <li class="com-item">
        是收到粉丝地方<span class="c-black">32是收到粉丝地方</span>计划
      </li>
      <li class="com-item">
        是收到粉丝地方<span class="c-black">2san</span>计划
      </li>
    </ul>
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
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 1;
      color: $col999;
      .c-black{
        color: $col333;
      }
    }
  }
</style>
