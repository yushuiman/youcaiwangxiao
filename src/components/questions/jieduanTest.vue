<template>
  <div class="jieduan-test height-com">
    <div class="com-bg diff-easy">
      试卷难度：简单
      <i class="star-icon star-easy-icon"></i>中等
      <i class="star-icon star-middle-icon"></i>困难
      <i class="star-icon star-diff-icon"></i>
    </div>
    <ul class="jd-test-list">
      <li class="jd-test-item" v-for="(v, index) in courseList" :key="index" @click="goDoPotic(v)">
        <div>
          <i class="star-icon" :class="{'star-diff-icon': v.difficulty == 'A', 'star-middle-icon': v.difficulty == 'B', 'star-easy-icon': v.difficulty == 'C'}"></i>
          <span>{{v.paper_name}}</span>
        </div>
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
