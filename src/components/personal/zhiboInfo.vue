<template>
  <div class="u-zhibo-wrap">
    <ul class="tab-list">
      <li class="tab-item active">预约直播</li>
    </ul>
    <div class="zhibo-main">
      <div class="uc-item">
        <img src="../../assets/images/questions/practice-icon03.png" alt="" class="uci-img">
        <div class="uci-detail">
          <h2 class="ucid-name">阿米巴经营的人事评价制度</h2>
          <p class="ucid-teacher">讲师：代坤</p>
          <p class="ucid-time">时间：2019.09.28 19:00-20:30</p>
        </div>
        <span class="price">¥0.00</span>
        <!-- <div class="zhibo-status"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      zhiboList: []
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .uc-item{
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    position: relative;
    &:after{
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 76px;
      height: 74px;
      background: url('../../assets/images/user/yuyue.png') no-repeat;
      background-size: contain;
    }
    .uci-img{
      width: 198px;
      height: 109px;
      border-radius: 8px 0 0 8px;
    }
    .uci-detail{
      flex: 1;
      padding: 0 20px;
      h2{
        font-size: 18px;
        line-height: 26px;
      }
      .ucid-teacher{
        color: $col999;
        line-height: 20px;
      }
      .ucid-time{
        color: $col333;
        font-size: 18px;
        line-height: 20px;
      }
    }
    .price{
      color: #F99111;
      font-size: 26px;
      margin-right: 96px;
    }
  }
</style>
