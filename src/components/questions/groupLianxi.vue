<template>
  <div class="jieduan-test height-com">
    <div class="com-bg diff-easy">
      请选择需要练习的章节
    </div>
    <ul class="jd-test-list">
      <li class="jd-test-item" v-for="(v, index) in volumeList" :key="index" @click="goToPic(v)">
        <span>{{v.section_name}}</span>
        <button class="btn-com do-potic-btn">去做题</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { volumeList } from '@/api/questions'
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
      volumeList: [],
      getPoticData: {
        course_id: this.course_id,
        paper_id: '',
        section_id: '',
        knob_id: '', // 节id
        know_id: '', // 知识点id
        mock_id: '',
        user_id: this.user_id,
        plate_id: this.plate_id,
        num: '', // 默认15道
        paper_type: 1 // 默认单选
      }
    }
  },
  mounted () {
    this.getVolumeList()
  },
  methods: {
    getVolumeList (val) {
      volumeList({
        course_id: this.course_id,
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        this.volumeList = res.data
      })
    },
    // 去做题
    goToPic (v) {
      this.getPoticData.mock_id = v.mock_id
      this.$router.push({ path: '/dopotic', query: this.getPoticData })
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
