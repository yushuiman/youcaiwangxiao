<template>
  <div class="hxjy-wrap">
    <div class="hxjy-type-cont">
      <h1>课程预告</h1>
      <ul class="hxjy-couse-list">
        <li class="hxjy-couse-item">
          <img :src="items.pc_img" alt="" class="hxjy-couse-item-img">
          <div class="hxjy-course-str">
            <p class="ci-title">{{items.name}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="hxjy-type-cont">
      <h1>学员专区</h1>
      <ul class="hxjy-couse-list">
        <li class="hxjy-couse-item">
          <img :src="items.pc_img" alt="" class="hxjy-couse-item-img">
          <div class="hxjy-course-str">
            <p class="ci-title">{{items.name}}</p>
            <p class="ci-teacher-day"><span>讲师：{{items.teacher_name}}</span>CPE积分：{{items.study_days}}分</p>
            <span class="ci-pay-free">{{ items.billing_status == 1 ? '免费课' : items.billing_status == 2 ? '¥' + items.price : items.billing_status == 3 ? '积分兑换' : '等级进入' }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="hxjy-type-cont">
      <h1>财务管理</h1>
      <ul class="hxjy-couse-list">
        <li class="hxjy-couse-item">
          <img :src="items.pc_img" alt="" class="hxjy-couse-item-img">
          <div class="hxjy-course-str">
            <p class="ci-title">{{items.name}}</p>
            <p class="ci-teacher-day"><span>讲师：{{items.teacher_name}}</span>CPE积分：{{items.study_days}}分</p>
            <span class="ci-pay-free">{{ items.billing_status == 1 ? '免费课' : items.billing_status == 2 ? '¥' + items.price : items.billing_status == 3 ? '积分兑换' : '等级进入' }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="hxjy-type-cont">
      <h1>管会训练营</h1>
      <ul class="hxjy-couse-list">
        <li class="hxjy-couse-item">
          <img :src="items.pc_img" alt="" class="hxjy-couse-item-img">
          <div class="hxjy-course-str">
            <p class="ci-title">{{items.name}}</p>
            <p class="ci-teacher-day"><span>讲师：{{items.teacher_name}}</span>CPE积分：{{items.study_days}}分</p>
            <span class="ci-pay-free">{{ items.billing_status == 1 ? '免费课' : items.billing_status == 2 ? '¥' + items.price : items.billing_status == 3 ? '积分兑换' : '等级进入' }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import likeList from '@/components/class/likeList.vue'
import { courseList, subjects } from '@/api/class'
import { mapState } from 'vuex'

export default {
  data () {
    return {

    }
  },
  components: {
    likeList
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .hxjy-couse-item{
    width: 280px;
    margin-right: 17px;
    margin-bottom: 20px;
    padding: 7px;
    border-radius: 6px;
    &:hover{
      background: $colfff;
      cursor: pointer;
    }
    .hxjy-couse-item-img{
      width: 100%;
      height: 147px;
      border-radius: 6px;
      display: block;
    }
    .hxjy-course-str{
      padding: 12px 8px 8px;
      .ci-title{
        font-size: 16px;
        @extend %singleline-ellipsis;
      }
      .ci-teacher-day{
        padding: 8px 0;
        color: $col999;
        span{
          margin-right: 20px;
        }
      }
      .ci-pay-free{
        padding: 0 6px;
        @include lh(23, 23);
        text-align: center;
        display: inline-block;
        background: #FFF1E4;
        color: #FF8915;
        border-radius: 4px;
      }
    }
  }
</style>
