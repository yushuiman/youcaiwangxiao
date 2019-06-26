<template>
  <div class="jieduan-test">
    <div class="com-bg">
      精准答案对比
    </div>
    <ul class="jd-test-list">
      <li class="jd-test-item" v-for="(v, index) in courseList" :key="index">
        <span>{{v.paper_name}}</span>
        <button class="btn-com" @click="goDoPotic(v)">去做题</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { getCourse } from '@/api/questions'
export default {
  props: {
    course_id: {
      type: Number
    },
    plate_id: {
      type: Number
    }
  },
  data () {
    return {
      courseList: []
    }
  },
  mounted () {
    this.getCourseList()
  },
  methods: {
    getCourseList () {
      getCourse({
        course_id: this.course_id,
        plate_id: this.plate_id
      }).then(data => {
        const res = data.data
        this.courseList = res.data
      })
    },
    // 去做题
    goDoPotic (v) {
      console.log('做题页')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .com-bg{
    margin-top: -2px;
    background: #F3F6FF;
    color: $col666;
    padding: 12px 14px;
  }
  .jd-test-list{
    padding-top: 10px;
  }
  .jd-test-item{
    display: flex;
    padding: 10px 14px;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    .star-icon{
      margin-left: 0;
      margin-right: 17px;
    }
    .btn-com{
      width: 69px;
      height: 24px;
    }
  }
</style>
