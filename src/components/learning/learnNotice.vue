<template>
  <div class="right-com">
    <div class="com-title">
      <span>学习公告</span>
    </div>
    <ul class="com-list">
      <li class="com-item" v-for="(item, index) in news" :key="index">
        <!-- <span class="c-black">{{item.title}}</span>
        <span class="c-gray">{{item.creates_time}}</span> -->
      </li>
      <!-- <li class="com-item">
        <span class="c-black">是收到粉丝地方等待323</span>
        <span class="c-gray">2019-32-23</span>
      </li>
      <li class="com-item">
        <span class="c-black">是收到粉丝地方等待323</span>
        <span class="c-gray">2019-32-23</span>
      </li> -->
    </ul>
  </div>
</template>

<script>
import { guessLike } from '@/api/class'
export default {
  props: {
    news: {
      type: Object
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
    background: url('../../assets/images/learncenter/r-icon01.png') no-repeat left center;
    background-size: 12px 14px;
  }
  .com-list{
    padding: 10px 0;
    margin-bottom: 20px;
    .com-item{
      height: 20px;
      line-height: 20px;
      display: flex;
      justify-content: space-between;
      .c-black{
        width: 60%;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
      }
      .c-gray{
        font-size: 12px;
        color: $col999;
      }
    }
  }
  // <ul class="com-list">
  //     <li class="com-item">
  //       <span class="c-black">是收到粉丝地方等待323</span>
  //       <span>2019-32-23</span>
  //     </li>
  //     <li class="com-item">
  //       <span class="c-black">是收到粉丝地方等待323</span>
  //       <span>2019-32-23</span>
  //     </li>
  //     <li class="com-item">
  //       <span class="c-black">是收到粉丝地方等待323</span>
  //       <span>2019-32-23</span>
  //     </li>
  //   </ul>
</style>
