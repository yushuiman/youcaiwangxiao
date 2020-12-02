<template>
  <Modal title="投诉"
    v-model="tousuVisible"
    footer-hide
    :width="795"
    :scrollable="true"
    @on-visible-change="tousuChangeVisible"
    class="iview-modal">
    <div class="ask">
      <textarea autofocus v-model.trim="quiz" class="texta" placeholder="请一句话说明你的问题" cols="3" rows="3"></textarea>
      <div class="submitAnswer">
        <div class="tousu-type">
          <span v-for="item in complainTypeList" :class="{'cur': complain_id == item.id}" :key="item.id" @click="changeTousuType(item)">
            {{item.complain_name}}
          </span>
        </div>
        <div>
          <span class="errorTxt">{{errorTs}}</span>
          <button class="submit" :class="{'cur': complain_id != ''}" @click="questionSubmit">提交</button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import { complainType, complainSub } from '@/api/answer'
import { mapState } from 'vuex'
export default {
  props: {
    tousuVisible: {
      type: Boolean
    },
    tousuInfo: {
      type: Object
    }
  },
  data () {
    return {
      quiz: '', // 提问文案
      errorTs: '',
      complainTypeList: [],
      complain_id: '' // 投诉类型id
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    this.getComplainType()
  },
  methods: {
    getComplainType () {
      complainType().then((data) => {
        const res = data.data
        if (res.code === 200) {
          this.complainTypeList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    changeTousuType (val) {
      this.complain_id = val.id
    },
    // 问题提交
    questionSubmit () {
      if (this.quiz.length < 5 || this.quiz === '') {
        this.errorTs = '请至少输入5个字'
        return
      }
      if (/^\s+$/gi.test(this.quiz) || this.quiz.trim() === '') {
        this.errorTs = '不能全为空格'
        return
      }
      if (this.quiz.length > 200) {
        this.errorTs = '最多输入200字'
        return
      }
      if (this.complain_id === '') {
        this.errorTs = '请选择投诉类型'
        return
      }
      this.errorTs = ''
      this.showLoading(true)
      complainSub({
        user_id: this.user_id,
        answer_id: this.tousuInfo.id,
        complain_id: this.complain_id,
        answer_type: this.tousuInfo.answer_type, // 追问类型1课程2题库3图书答疑
        content: this.quiz
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.quiz = ''
          this.complain_id = ''
          this.$emit('update:tousuVisible', false)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    tousuChangeVisible (val) {
      if (!val) {
        this.$emit('update:tousuVisible', false)
        this.complain_id = ''
        this.quiz = ''
        this.errorTs = ''
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .ask{
    padding: 0 30px;
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
  .submitAnswer{
    padding: 20px 0;
    position: relative;
    display: flex;
    justify-content: flex-end;
    .course_img{
      margin-right: 60px;
    }
    .submit {
      width: 77px;
      height: 30px;
      line-height: 30px;
      background: #DCDCDC;
      border-radius: 20px;
      font-size: 16px;
      color: $colfff;
      &.cur{
        background: rgba(249, 145, 17, 1);
      }
    }
    .errorTxt{
      position: absolute;
      top: 3px;
      left: 0px;
      color: #E84342;
    }
  }
  .tousu-type{
    width: 444px;
    span{
      height: 24px;
      line-height: 24px;
      border-radius: 6px;
      display: inline-block;
      text-align: center;
      padding: 0 10px;
      margin-right: 20px;
      margin-bottom: 16px;
      color: $blueColor;
      cursor: pointer;
      border: 1px solid $blueColor;
      &.cur{
        background: $blueColor;
        color: $colfff;
      }
    }
  }
</style>
