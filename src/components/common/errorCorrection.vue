<template>
  <div class="error-wrap">
    <textarea autofocus v-model="error_content" class="texta" placeholder="请输入纠错内容，我们在收到后会及时为您解决。" cols="3" rows="3"></textarea>
    <div class="ts-box">{{errorTs}}</div>
    <div class="btn-box">
      <!-- <button class="btn-com" @click="cancleFun">取消</button> -->
      <button class="btn-com" @click="subErrorCorrection">提交</button>
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
      error_content: '',
      errorTs: ''
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
    subErrorCorrection () {
      if (this.error_content.length < 5 && this.error_content.length > 0) {
        this.errorTs = '请至少输入5个字'
        return
      }
      if (this.error_content === '') {
        this.errorTs = '请输入纠错内容'
        return
      }
      if (/^\s+$/gi.test(this.error_content) || this.error_content.trim() === '') {
        this.errorTs = '不能全为空格'
        return
      }
      if (this.error_content > 200) {
        this.errorTs = '最多输入200字'
        return
      }
      this.errorTs = ''
      errorCorrection({
        question_id: this.getQuestion.question_id,
        user_id: this.user_id,
        error_content: this.error_content
      }).then(data => {
        if (res.code === 200) {
          this.$Message.success('纠错问题提交成功')
          this.$emit('modalShow', false)
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  @import "../../assets/scss/iview.css";
  .error-wrap{
    padding: 0 30px 20px;
  }
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
