<template>
  <div class="course-main-right">
    <div class="like-title">
      <img class="tc-icon" src="@/assets/images/course/teacher-icon.png" alt="">
      <span>老师姓名</span>
    </div>
    <div v-if="teacehr.length == 1">
      <div class="cl-teacher">
        <img :src="teacehr[0].pictrue" alt="">
        <p>{{teacehr[0].teacher_name}}</p>
        <span>{{teacehr[0].teacher_title}}</span>
      </div>
      <div class="cl-t-detail">
        <p class="cl-t-tit">讲师简介：</p>
        <p class="cl-t-info">{{teacehr[0].introduce}}</p>
      </div>
    </div>
    <swiper :options="swiperOptionRec" v-if="teacehr.length>1">
      <swiper-slide v-for="(item, index) in teacehr" :key="index">
        <div class="cl-teacher">
          <img :src="item.pictrue" alt="">
          <p>{{item.teacher_name}}</p>
          <span>{{item.teacher_title}}</span>
        </div>
        <div class="cl-t-detail">
          <p class="cl-t-tit">讲师简介：</p>
          <p class="cl-t-info">{{item.introduce}}</p>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  props: {
    teacehr: {
      type: Array
    }
  },
  data () {
    return {
      swiperOptionRec: {
        loop: true,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false
        }
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .course-main-right {
    padding: 0 9px;
    margin-bottom: 20px;
    background: $colfff;
    border-radius: 4px;
    box-sizing: border-box;
    .like-title{
      @include lh(39, 39);
      margin-bottom: 4px;
      .tc-icon{
        @include wh(16, 19);
        margin-right: 7px;
        vertical-align: middle;
        margin-top: -3px;
      }
    }
  }
  .cl-teacher{
    text-align: center;
    padding-top: 16px;
    padding-bottom: 14px;
    border-top: 1px solid $borderColor;
    border-bottom: 1px solid $borderColor;
    img{
      @include wh(80, 80);
      border-radius: 100%;
    }
    p{
      padding-top: 9px;
      padding-bottom: 7px;
    }
    span{
      color: $col999;
      font-size: 12px;
    }
  }
  .cl-t-detail{
    padding: 13px 0;
    .cl-t-tit{
      margin-bottom: 8px;
    }
    .cl-t-info{
      line-height: 20px;
      font-size: 12px;
      color: $col999;
    }
  }
</style>
