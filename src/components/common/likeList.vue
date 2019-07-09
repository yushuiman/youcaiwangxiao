<template>
  <div class="course-like-main" :class="{'styw': isW=278}">
    <div class="like-title">
      <img src="../../assets/images/course/like.png" alt="">
      <span>猜你喜欢</span>
    </div>
    <div class="like-list" v-for="(item,index) in likeArr" :key="index">
      <img :src="item.pc_img" alt="">
      <div class="like-info">
        <p>{{item.name}}</p>
        <p>讲师: {{item.teacher_name}}</p>
        <p>￥ {{item.price}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { guessLike } from '@/api/class'
export default {
  data () {
    return {
      props: {
        isW: {
          type: String
        }
      },
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
        this.likeArr = res.data
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .course-like-main {
    width: 298px;
    padding: 0 9px;
    background: $colfff;
    border-radius: 4px;
    box-sizing: border-box;
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
    &.styw{
      width: 278px;
    }
  }
  .like-list {
    height: 86px;
    padding: 11px 0;
    @include display_flex(flex);
    // @extend %alignitem_center;
    border-top: 1px solid $borderColor;
    box-sizing: border-box;
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
    margin-left: 7px;
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
