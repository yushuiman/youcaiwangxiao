<template>
  <Modal title="追问"
    v-model="answerVisible"
    footer-hide
    :width="795"
    @on-visible-change="answerChangeVisible"
    class="iview-modal">
    <!--提问题-->
    <div class="ask">
      <textarea autofocus v-model.trim="quiz" class="texta" placeholder="请一句话说明你的问题" cols="3" rows="3"></textarea>
      <div class="submitAnswer clearfix">
        <div class="course_img fl">
          <div class="demo-upload-list" v-for="(item, index) in quiz_image" :key="index">
            <template>
              <img :src="item">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
              </div>
            </template>
          </div>
          <Upload ref="upload"
              :show-upload-list="false"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              type="drag"
              :action="apiPath"
              name="image"
              class="uploadSty">
              <div class="icon-upload"></div>
          </Upload>
        </div>
        <div class="fr">
          <span class="errorTxt">{{errorTs}}</span>
          <button class="submit" @click="questionSubmit">提交</button>
        </div>
      </div>
    </div>
    <Modal title="图片预览" v-model="visible" :width="795">
      <img :src="imgUrl" v-if="visible" style="width: 100%;">
    </Modal>
  </Modal>
</template>

<script>
import { answerClose } from '@/api/answer'
import { mapState } from 'vuex'
import config from '@/config'
export default {
  props: {
    answerVisible: {
      type: Boolean
    },
    zhuiwenInfo: {
      type: Object
    }
  },
  data () {
    return {
      quiz: '', // 提问文案
      quiz_image: [], // 提问图片 以,号分割
      visible: false,
      imgUrl: '',
      errorTs: '',
      apiPath: '/upload/Index/uploadImage'
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    if (process.env.NODE_ENV === 'production') {
      this.apiPath = config.baseUrl.pro + '/upload/Index/uploadImage'
    }
  },
  methods: {
    handleView (url) {
      this.imgUrl = url
      this.visible = true
    },
    handleBeforeUpload () {
      const check = this.quiz_image.length < 3
      if (!check) {
        this.$Notice.warning({
          title: '最多上传3张图片！'
        })
      }
      return check
    },
    handleRemove (index) {
      this.quiz_image.splice(index, 1)
    },
    handleSuccess (res, file) {
      if (res.code === 200) {
        let obj = {
          name: file.name,
          url: res.data.image_url
        }
        this.quiz_image.push(obj.url)
      }
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式验证',
        desc: '文件 “' + file.name + '” 格式错误, 请上传 jpg 或 png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '文件大小验证',
        desc: '文件 “' + file.name + '” 太大, 不要超过 5m'
      })
    },
    closeModel () {
      this.$emit('closeModel')
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
      this.errorTs = ''
      let quizImage = this.quiz_image.join(',')
      this.showLoading(true)
      answerClose({
        answer_id: this.zhuiwenInfo.id,
        z_quiz: this.quiz,
        user_id: this.user_id,
        z_quiz_image: quizImage,
        answer_type: this.zhuiwenInfo.answer_type // 追问类型1课程2题库
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.quiz = ''
          this.quiz_image = []
          this.$emit('updateAnswerList')
          this.$emit('update:answerVisible', false)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    answerChangeVisible (val) {
      if (!val) {
        this.$emit('update:answerVisible', false)
        this.errorTs = ''
        this.quiz = ''
        this.quiz_image = []
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
    .submit {
      width: 77px;
      height: 30px;
      line-height: 30px;
      background: rgba(249, 145, 17, 1);
      border-radius: 20px;
      font-size: 16px;
      color: $colfff;
    }
    .errorTxt{
      position: absolute;
      top: 3px;
      left: 0px;
      color: #E84342;
    }
  }
</style>
