<template>
  <div class="group-lianxi height-com">
    <div class="com-bg">
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
      volumeList: [],
      getPoticData: {
        course_id: this.course_id,
        paper_id: '', // 阶段测试,论述题
        section_id: '',
        knob_id: '', // 节id
        know_id: '', // 知识点id
        mock_id: '',
        user_id: this.user_id,
        plate_id: this.plate_id,
        num: '', // 默认15道
        paper_type: 1 // 单选1 论述2
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
        if (res.code === 200) {
          this.volumeList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 去做题
    goToPic (v) {
      this.getPoticData.mock_id = v.mock_id
      this.getPoticData.paper_type = v.mock_type
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
  }
</style>
