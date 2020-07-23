<template>
  <div class="jieduan-test">
    <div class="com-bg">
      <div class="diff-easy">
        试卷难度：简单
        <i class="star-icon star-easy-icon"></i>中等
        <i class="star-icon star-middle-icon"></i>困难
        <i class="star-icon star-diff-icon"></i>
      </div>
    </div>
    <ul class="jd-test-list">
      <li class="jd-test-item" v-for="(v, index) in courseList" :key="index" @click="goToPic(v)">
        <div>
          <i class="star-icon" :class="{'star-diff-icon': v.difficulty == 'C', 'star-middle-icon': v.difficulty == 'B', 'star-easy-icon': v.difficulty == 'A'}"></i>
          <span>{{v.paper_name}}</span>
        </div>
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
    },
    entrance_type: {
      type: String,
      default: ''
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
        paper_type: 1, // 单选1 论述2
        entrance_type: this.entrance_type
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
  .jd-test-list{
    height: 351px;
    overflow: auto;
  }
  .star-icon{
    margin-left: 11px;
    margin-right: 39px;
    vertical-align: middle;
    margin-top: -3px;
    &.star-easy-icon{
      @include bg-img(16, 15, '../../assets/images/questions/star-easy.png');
    }
    &.star-middle-icon{
      @include bg-img(16, 15, '../../assets/images/questions/star-middle.png');
    }
    &.star-diff-icon{
      @include bg-img(16, 15, '../../assets/images/questions/star-diff.png');
    }
  }
  .jd-test-item{
    line-height: 25px;
    padding: 10px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    .star-icon{
      margin-left: 0;
      margin-right: 17px;
    }
  }
</style>
