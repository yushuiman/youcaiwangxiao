<template>
<!-- 没有用到 -->
  <div class="u-course-main">
    <div class="uc-item" v-for="(val, key) in myCourseList" :key="key">
      <img :src="val.pc_img" alt="" class="uci-img">
      <div class="uci-detail">
        <h2 class="ucid-name">{{val.name}}</h2>
        <p class="ucid-des">{{val.description}}</p>
        <p class="ucid-learn" v-if="val.video">{{val.video.video_name}}</p>
      </div>
      <button class="btn-com uci-learn">去学习</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    myCourseList: {
      type: Array
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../../assets/scss/app";
  .uc-item{
    display: flex;
    align-items: center;
    background: #ffffff;
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
    margin-bottom: 20px;
    padding-right: 20px;
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
        color: $col333;
      }
      .ucid-des{
        color: $col999;
        line-height: 20px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
      }
      .ucid-learn{
        color: $blueColor;
        margin-top: 13px;
      }
    }
    .btn-com{
      background: #1874FD;
      color: $colfff;
      font-size: 16px;
    }
  }
</style>
