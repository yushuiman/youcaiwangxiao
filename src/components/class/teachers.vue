<template>
  <div class="course-main-right">
    <div class="like-title">
      <img class="tc-icon" src="@/assets/images/course/teacher-icon.png" alt="">
      <span>老师姓名</span>
    </div>
    <swiper :options="swiperOptionRec">
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
import { studentVoice } from '@/api/class'
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
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        loop: true
      }
    }
  },
  computed: {
    swiper,
    swiperSlide
  },
  mounted () {
    this.getStudentVoice()
  },
  methods: {
    // 学员心声
    getStudentVoice () {
      studentVoice().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.tudentVoiceList = res.data.slice(0, 3)
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
  .course-main-right {
    width: 278px;
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
