<template>
  <div class="course-main-right course-main-student">
    <div class="like-title">
      <img class="stu-icon" src="@/assets/images/course/student-icon.png" alt="">
      <span>学员心声</span>
    </div>
    <div class="tudentVoice-list">
      <div class="tudentvoic-item" v-for="(item, index) in tudentVoiceList" :key="index">
        <img :src="item.head" alt="">
        <div class="tudentvoic-info">
          <p>{{item.student_name}}</p>
          <p class="str">{{item.title}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { studentVoice } from '@/api/class'
export default {
  data () {
    return {
      tudentVoiceList: [] // 学员心声
    }
  },
  computed: {

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
    padding: 0 9px;
    margin-bottom: 20px;
    background: $colfff;
    border-radius: 4px;
    box-sizing: border-box;
    .like-title{
      @include lh(39, 39);
      margin-bottom: 4px;
      .stu-icon{
        @include wh(18, 18);
        margin-right: 7px;
        vertical-align: middle;
        margin-top: -3px;
      }
    }
  }
  .tudentvoic-item {
    padding: 11px 0;
    @include display_flex(flex);
    @extend %alignitem_center;
    border-top: 1px solid $borderColor;
    box-sizing: border-box;
    img{
      @include wh(60, 60);
      border-radius: 50%;
      margin-right: 7px;
    }
    .tudentvoic-info{
      flex: 1;
      .str{
        margin-top: 10px;
        font-size: 12px;
        color: $col999;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
    }
  }
</style>
