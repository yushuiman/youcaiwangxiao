<template>
  <div class="class-wrap">
    <!-- 课程内容 -->
    <div class="course-main w-wrap clearfix">
      <!-- 课程列表 左 -->
      <div class="course-main-left fl">
        <div class="clearfix">
          <div class="course-main-con fl" v-for="(items, index) in courseList" :key="index" @click="goClassDetails(items.id)">
            <img :src="items.pc_img" alt="" class="course-main-con-img">
            <div class="course-main-info">
              <p class="ci-title">{{items.name}}</p>
              <p class="ci-teacher-day"><span>讲师：{{items.teacher_name}}</span>有效期：{{items.study_days}}天</p>
              <span class="ci-pay-free">{{ items.billing_status == 1 ? '免费课' : items.billing_status == 2 ? '¥' + items.price : items.billing_status == 3 ? '积分兑换' : '等级进入' }}</span>
            </div>
          </div>
        </div>
        <div style="padding: 20px; text-align: center;">
          <Page
          :total="total"
          @on-change="onChange"
          :current="form.page"
          :page-size="form.limit"
          size="small"
          />
        </div>
      </div>
      <!-- 猜你喜欢 右 -->
      <div class="course-like-right fr">
        <like-list></like-list>
        <news></news>
      </div>
    </div>
  </div>
</template>
<script>
import likeList from '@/components/class/likeList.vue'
import news from '@/components/education/news.vue'
import { pcourseList } from '@/api/class'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      likeArr: [], // 猜你喜欢
      courseList: [], // 课程列表
      total: 1,
      form: {
        limit: 6,
        page: 1
      },
    }
  },
  components: {
    likeList,
    news
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    }),
  },
  mounted () {
    this.getCourseList() // 课程列表 默认第一页，6条数据
  },
  methods: {
    // 跳转到课程详情页
    goClassDetails (id) {
      this.$router.push({ path: '/course-detail', query: { package_id: id, from: 2 } })
    },
    // 分页
    onChange (val) {
      this.form.page = val
      this.getCourseList()
      window.scrollTo(0, 0)
    },
    // 获取数据
    getCourseList () {
      this.showLoading(true)
      pcourseList(this.form).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.courseList = res.data.data
          this.total = res.data.total
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
  .class-tj-bg{
    background: $colfff;
    &.class-zh, &.class-subject-mt{
      margin-top: 20px;
    }
  }
  .class-com{
    padding: 6px 0;
    line-height: 39px;
    @include display_flex(flex);
    box-sizing: border-box;
    .class-subject &{
      border-bottom: 1px solid $borderColor;
    }
    .cl-aleary-tj &{
      padding: 10px 0;
      @extend %alignitem_center;
      span{
        &:hover{
          color: $col333;
        }
      }
    }
    .class-zh &{
      line-height: 50px;
      padding: 0;
    }
  }
  .cl-txt{
    color: $col666;
    margin-right: 24px;
    font-weight: bold;
    .cl-aleary-tj &{
      color: $col333;
    }
  }
  .cla-list{
    span{
      @include lh(28, 28);
      background: $colfff;
      float: left;
      border: 1px solid #0CA1FF;
      border-radius: 4px;
      margin-right: 21px;
      box-sizing: border-box;
      display: inline-block;
      margin: 5px 0;
      em, i{
        float: left;
        display: inline-block;
        height: 100%;
        font-weight: normal;
        margin-right: 0;
      }
      em{
        padding: 0 18px;
        text-align: center;
      }
      i{
        float: right;
        width: 27px;
        background-color: $blueColor;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        @extend %bg-img;
        text-align: center;
        background-image: url('../../assets/images/course/del-icon.png');
        background-size: 60% 60%;
      }
    }
  }
  .cl-list{
    @include c3(flex, 1);
    @include display_flex(flex);
    @extend %alignitem_center;
    span{
      margin-right: 30px;
      box-sizing: border-box;
      border: 1px solid transparent;
      &.curren, &:hover{
        color: $blueColor;
        cursor: pointer;
      }
    }
  }
  .cl-list-zh{
    span, input{
      margin: 0 10px;
      display: inline-block;
      &:nth-child(1){
        margin-left: 0;
      }
      &.curren{
        color: $blueColor;
        border-bottom: 1px solid $blueColor
      }
      &.lianjie-icon{
        margin: 0;
        color: $borderColor;
      }
    }
    i{
      display: inline-block;
      vertical-align: middle;
      margin-top: -3px;
      margin-left: 5px;
      @extend %bg-img;
      &.hot-down-icon, &.hot-top-icon{
        @include wh(9, 20);
        background-image: url('../../assets/images/course/hot-down-icon.png');
      }
      &.hot-top-icon{
        background-image: url('../../assets/images/course/hot-top-icon.png');
      }
      &.price-icon{
        @include wh(10, 16);
        background-image: url('../../assets/images/course/price-moren-icon.png');
      }
      &.price-top-icon{
        @include wh(10, 16);
        background-image: url('../../assets/images/course/price-top-icon.png');
      }
      &.price-down-icon{
        @include wh(10, 16);
        background-image: url('../../assets/images/course/price-down-icon.png');
      }
    }
    input{
      @include wh(80, 28);
      border: 1px solid $borderColor;
      border-radius: 4px;
      box-sizing: border-box;
      text-indent: 11px;
    }
    button{
      @include whl(60, 28, 28);
      background: $blueColor;
      border-radius: 4px;
      color: $colfff;
      &.sure-btn{
        margin-left: 10px;
      }
      &.clear-btn{
        color: $col666;
        background: none;
      }
    }
  }
  .course-main {
    padding: 19px 0;
  }
  .course-main-left{
    width: 900px;
  }
  .course-like-right{
    width: 298px;
  }
  .course-main-con{
    width: 280px;
    margin-right: 17px;
    margin-bottom: 20px;
    padding: 7px;
    border-radius: 6px;
    &:hover{
      background: $colfff;
      cursor: pointer;
    }
    .course-main-con-img{
      width: 100%;
      height: 147px;
      border-radius: 6px;
      display: block;
    }
    .course-main-info{
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
  .index-active-modal img{
    width: 100%;
  }
</style>
