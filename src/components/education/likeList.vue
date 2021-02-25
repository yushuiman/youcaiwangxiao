<template>
  <div class="course-like-main">
    <div class="like-title">
      <img src="../../assets/images/course/like.png" alt="">
      <span>课程推荐</span>
    </div>
    <div class="like-list" v-for="(item,index) in curriculumList" :key="index" @click="goClassDetails(item.package_id)">
      <img :src="item.pc_img" alt="">
      <div class="like-info">
        <p>{{item.name}}</p>
        <p>讲师: {{item.teacher_name}}</p>
        <p>￥{{item.price}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { newInformation } from '@/api/education'
export default {
  data () {
    return {
      curriculumList: []
    }
  },
  computed: {

  },
  mounted () {
    this.getCurriculum()
  },
  methods: {
    // 猜你喜欢
    getCurriculum () {
      newInformation().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.curriculumList = res.data.curriculum
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 跳转到课程详情页
    goClassDetails (id) {
      this.$router.push({ path: '/course-detail', query: { package_id: id } })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .course-like-main {
    padding: 0 9px;
    background: $colfff;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 20px;
    .like-title{
      @include lh(39, 39);
      color: $col666;
      margin-bottom: 4px;
      img{
        @include wh(20, 20);
        margin-right: 7px;
        vertical-align: middle;
        margin-top: -3px;
      }
    }
  }
  .like-list {
    height: 86px;
    padding: 11px 0;
    @include display_flex(flex);
    border-top: 1px solid $borderColor;
    box-sizing: border-box;
    cursor: pointer;
    img{
      width: 100%;
      height: 60px;
      margin-right: 6px;
    }
  }
  .like-list img {
    width: 110px;
    height: 60px;
    border-radius:4px;
  }
  .like-info {
    flex: 1;
    p{
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 1;
      &:nth-child(2){
        color: $col999;
        font-size: 12px;
        margin-top: 8px;
        margin-bottom: 7px;
      }
      &:nth-child(3){
        color: #FF9B3A;
        font-size: 16px;
      }
    }
  }
</style>
