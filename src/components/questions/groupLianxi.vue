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
    <Modal
        v-model="modal1"
        title="提示"
        @on-ok="ok"
        @on-cancel="cancel">
        <p class="ts">您已进入模拟考试模式，请随时点击“保存“按钮保存，否则您的做题结果会消失。在完成所有题目后，请点击“交卷”按钮，系统会自动为您评分。谢谢配合！</p>
    </Modal>
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
        paper_id: '', // 阶段测试,论述题
        section_id: '',
        knob_id: '', // 节id
        know_id: '', // 知识点id
        mock_id: '',
        plate_id: this.plate_id,
        num: '', // 默认15道
        paper_type: 1 // 单选1 论述2
      },
      modal1: false,
      curVal: {}
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
      this.modal1 = true
      this.curVal = v
    },
    ok () {
      this.modal1 = false
      this.getPoticData.mock_id = this.curVal.mock_id
      this.getPoticData.paper_type = this.curVal.mock_type
      this.$router.push({ path: '/dopotic', query: this.getPoticData })
    },
    cancel () {
      this.modal1 = false
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
  .ts{
    font-size: 16px;
    padding: 10px 30px;
    line-height: 24px;
  }
</style>
