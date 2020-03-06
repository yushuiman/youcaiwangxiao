<template>
  <div class="discuss-self height-com">
    <div class="com-bg">
      精准答案对比course_id:{{course_id}}
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
export default {
  props: {
    courseList: {
      type: Array
    },
    course_id: {
      type: Number
    },
    plate_id: {
      type: Number
    }
  },
  data () {
    return {
      getPoticData: {
        course_id: this.course_id,
        paper_id: '', // 阶段测试,论述题,冲刺训练营 这个取接口返回的
        section_id: 0,
        knob_id: 0, // 节id
        know_id: 0, // 知识点id
        mock_id: 0,
        plate_id: this.plate_id,
        num: '', // 默认随机15道
        paper_type: 2 // 单选1 论述2
      }
    }
  },
  mounted () {
  },
  methods: {
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
