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
    <div class="tishi" v-if="flagTs1">
      <p>这是一堆提示文字，有多少字呢，也不知道，反正两行应该足够了，这个条的高度就随着行数变，每次 打开都有，反正也不碍事，他嫌碍事就叉掉。</p>
      <i class="close-icon" @click="tsPopup"></i>
    </div>
    <Modal
      v-model="flagTs2"
      title="提示"
      @on-ok="ok"
      @on-cancel="cancel">
      <p class="ts">这又是一堆提示文字，有多少字呢，也不知道，反正两行应该足够了，这个条的高度就随着行数变，每次 打开都有。</p>
    </Modal>
  </div>
</template>

<script>
import { sprintCourse } from '@/api/questions'
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
        paper_id: '', // 阶段测试,论述题,冲刺训练营 这个取接口返回的
        section_id: 0,
        knob_id: 0, // 节id
        know_id: 0, // 知识点id
        mock_id: 0,
        plate_id: this.plate_id,
        num: '', // 默认随机15道
        paper_type: 1 // 单选1 论述2
      },
      flagTs1: true,
      flagTs2: false
    }
  },
  mounted () {
    this.getCourseList()
  },
  methods: {
    tsPopup (type) {
      this.flagTs1 = false
    },
    getCourseList () {
      sprintCourse({
        course_id: this.course_id
        // plate_id: this.plate_id
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
      this.flagTs2 = true
      this.curVal = v
    },
    ok () {
      this.flagTs2 = false
      this.getPoticData.paper_id = this.curVal.paper_id
      this.getPoticData.paper_type = this.curVal.paper_type
      this.$router.push({ path: '/dopotic', query: this.getPoticData })
    },
    cancel () {
      this.flagTs2 = false
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
  .tishi{
    padding: 10px 30px;
    background:rgba(255,0,0,.1);
    line-height: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p{
      flex: 1;
    }
    .close-icon{
      margin-left: 20px;
      cursor: pointer;
      @include bg-img(24, 25, '../../assets/images/questions/close-icon.png');
    }
  }
  .ts{
    font-size: 16px;
    padding: 10px 30px;
    line-height: 24px;
  }
</style>
