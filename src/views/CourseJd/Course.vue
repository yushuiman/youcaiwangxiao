<template>
  <div class="class-jd-wrap">
    <!-- 京东课程内容 -->
    <div class="course-main w-wrap">
      <div class="course-list-jd clearfix">
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
        :current="page"
        :page-size="limit"
        size="small"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { jdCourseList } from '@/api/class'

export default {
  data () {
    return {
      courseList: [], // 课程列表
      total: 1,
      page: 1,
      limit: 6
    }
  },
  mounted () {
    this.getCourseList() // 课程列表 默认第一页，6条数据
  },
  methods: {
    // 跳转到课程详情页
    goClassDetails (id) {
      this.$router.push({ path: '/course-detail', query: { package_id: id } })
    },
    // 分页
    onChange (val) {
      this.page = val
      this.getCourseList()
      window.scrollTo(0, 0)
    },
    // 获取数据
    getCourseList () {
      this.showLoading(true)
      jdCourseList({
        page: this.page,
        limit: this.limit
      }).then(data => {
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
  .course-main {
    padding: 19px 0;
  }
  .course-list-jd{
    width: 1184px;
    margin: 0 auto;
  }
  .course-main-con{
    width: 280px;
    margin: 0 8px;
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
</style>
