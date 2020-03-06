<template>
  <div class="group-lianxi height-com">
    <div class="com-bg">
      请选择需要练习的章节course_id:{{course_id}}
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
      <p class="ts">您已进入模拟考试模式，中途离开请退出保存当前进度，恢复请从“答题记录”，点击“继续做题”完成测试。</p>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    volumeList: {
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
        num: '', // 默认15道
        paper_type: 1 // 单选1 论述2
      },
      modal1: false,
      curVal: {}
    }
  },
  mounted () {
  },
  methods: {
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
