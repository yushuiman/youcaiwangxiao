<template>
  <div class="jieduan-test height-com">
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
      type: String
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
        paper_id: '',
        section_id: '',
        knob_id: '', // 节id
        know_id: '', // 知识点id
        mock_id: '',
        user_id: this.user_id,
        plate_id: this.plate_id,
        num: '', // 默认随机15道
        paper_type: 1 // 默认单选
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
        this.courseList = res.data
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
    display: flex;
    padding: 10px 30px;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    .star-icon{
      margin-left: 0;
      margin-right: 17px;
    }
  }
</style>
