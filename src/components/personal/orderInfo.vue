<template>
  <div class="u-course-wrap">
    订单页面
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': changeIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <div v-if="changeIdx == 0">做题记录</div>
      <div v-if="changeIdx == 1">错题集</div>
      <div v-if="changeIdx == 2">收藏夹</div>
      <div v-if="changeIdx == 3">习题笔记</div>
    </div>
  </div>
</template>

<script>
import { errorCorrection } from '@/api/questions'
import { mapState } from 'vuex'
export default {
  props: {
    getQuestion: {
      type: Object
    }
  },
  data () {
    return {
      txtArr: ['做题记录', '错题集', '收藏夹', '习题笔记'],
      changeIdx: 0
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  mounted () {
  },
  methods: {
    tabClk (v, index) {
      this.changeIdx = index
    },
    subErrorCorrection () {
      if (this.error_content.length < 5 && this.error_content.length > 0) {
        this.tsTxt = '请至少输入5个字'
        return
      }
      if (this.error_content === '') {
        this.tsTxt = '请输入纠错内容'
        return
      }
      if (/^\s+$/gi.test(this.error_content) || this.error_content.trim() === '') {
        this.tsTxt = '不能全为空格'
        return
      }
      if (this.error_content > 200) {
        this.tsTxt = '最多输入200字'
        return
      }
      errorCorrection({
        question_id: this.getQuestion.question_id,
        user_id: this.user_id,
        error_content: this.error_content
      }).then(data => {
        this.$Message.success('纠错问题提交成功')
        this.$emit('modalShow', false)
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  @import "../../assets/scss/iview.css";
  .texta {
    resize: none;
    width: 100%;
    height: 121px;
    color: rgba(199, 199, 199, 1);
    padding: 7px 12px;
    border: 1px solid rgba(102, 102, 102, 1);
    border-radius: 8px;
    color: $col333;
    box-sizing: border-box;
  }
  .ts-box{
    height: 20px;
  }
  .btn-box{
    text-align: center;
    button{
      width: 122px;
      height: 36px;
      border-radius: 18px;
      margin: 0 21px;
      &:last-child{
        background: #0066FF;
        color: $colfff;
      }
    }
  }
</style>
