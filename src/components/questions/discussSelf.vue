<template>
  <div class="discuss-self height-com">
    <div class="com-bg">
      精准答案对比
    </div>
    <ul class="jd-test-list">
      <li class="jd-test-item" v-for="(v, index) in courseList" :key="index" @click="goToPic(v)">
        <span>{{v.paper_name}}</span>
        <button class="btn-com do-potic-btn">去做题</button>
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
    user_id: {
      type: Number
    },
    plate_id: {
      type: Number
    }
  },
  data () {
    return {
      courseList: [],
      getPoticData: {
        course_id: this.course_id,
        paper_id: 0, // // 阶段测试1,论述题2 这个取接口返回的
        section_id: '',
        knob_id: '', // 节id
        know_id: '', // 知识点id
        mock_id: '',
        plate_id: this.plate_id,
        num: '', // 默认随机15道
        paper_type: 2 // 单选1 论述2
      }
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
        if (res.code === 200) {
          this.courseList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 去做题
    goToPic (v) {
      this.getPoticData.paper_id = v.paper_id
      this.$router.push({ path: '/dopotic', query: this.getPoticData })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .jd-test-item{
    line-height: 25px;
    padding: 10px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
  }
</style>
