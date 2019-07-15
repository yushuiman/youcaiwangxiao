<template>
  <div class="ask-wrap">
    <!--提问-->
    <div class="ask">
      <div class="close-box" @click="closeModel()">
        <i class="close-icon"></i>
      </div>
      <h1 class="vc-title">提问题</h1>
      <textarea autofocus v-model="quiz" class="texta" placeholder="请一句话说明你的问题" cols="3" rows="3"
        v-on:focus="send()" v-on:blur="goPlay()"></textarea>
      <div class="submitAnswer clearfix">
        <div class="course_img fl">
          <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
            <template>
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove3(item)"></Icon>
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
              action="/upload/Index/uploadImage"
              name="image"
              class="uploadSty">
              <div class="icon-upload"></div>
          </Upload>
        </div>
        <div class="fr">
          <span class="errorTxt">{{errorTs}}</span>
          <button class="submit" @click="answerSubmit()">提交</button>
        </div>
      </div>
    </div>
    <!--其他问题-->
    <div class="others" :class="{'has-img': quiz_image.length}" v-if="answerList.length">
      <h1 class="vc-title">本节其他问题</h1>
      <ul class="othq-list">
        <li class="othq-item" v-for="(item, index) in answerList" :key="index">
          <div class="othq-item-t">
            <img :src="item.head" alt="" class="head-logo">
            <div class="othq-info">
              <h3>{{item.username}}</h3>
              <p>{{item.create_time}}</p>
            </div>
            <span class="othq-huifu" v-if="item.reply_status == 1">{{item.reply_name}}</span>
          </div>
          <p class="othq-txt" :class="!item.openFlag? 'sl' : ''">{{item.quiz}}</p>
          <div class="quiz-image-list course_img">
            <div class="demo-upload-list" v-for="(val, index) in item.quiz_image" :key="index">
              <template>
                <img :src="val">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(val)"></Icon>
                </div>
              </template>
            </div>
          </div>
          <div class="open-txt" @click="openShow(item, index)">
            {{item.openFlag ? '收起':'展开'}}
          </div>
          <!-- 老师回复 -->
          <ul class="othq-list-teacher" v-if="replyList[item.id] && item.openFlag">
            <li class="othq-item">
              <div class="othq-item-t">
                <img :src="replyList[item.id].head_img" alt="" class="head-logo">
                <div class="othq-info">
                  <h3>{{replyList[item.id].reply_user_name}}<span class="teacher-light">老师</span></h3>
                  <p>{{replyList[item.id].reply_times}}</p>
                </div>
              </div>
              <p class="othq-txt">{{replyList[item.id].reply_quiz}}</p>
              <div class="quiz-image-list course_img">
                <div class="demo-upload-list" v-for="(v, index) in replyList[item.id].reply_image" :key="index">
                  <template>
                    <img :src="v" alt="">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(v)"></Icon>
                    </div>
                  </template>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <Modal title="图片预览" v-model="visible" :width="795">
      <img :src="imgUrl" v-if="visible" style="width: 100%;">
    </Modal>
  </div>
</template>

<script>
import { answerList, answerSub, answerDetails } from '@/api/class'
import { EventBus } from '@/event-bus.js'
export default {
  props: {
    playCourseInfo: {
      type: Object
    }
  },
  data () {
    return {
      answerList: [],
      quiz: '', // 提问文案
      quiz_image: [], // 提问图片 以,号分割
      isopen: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadImgList: [],
      fileList: [],
      imageUrl: '',
      visible: false,
      imgUrl: '',
      uploadList: [],
      errorTs: '',
      playStatus: true,
      replyList: {} // 老师回复内容
    }
  },
  mounted () {
    this.getAnswerList()
  },
  methods: {
    send () {
      EventBus.$emit('stopPlay')
    },
    handleView (url) {
      this.imgUrl = url
      this.visible = true
    },
    handleBeforeUpload () {
      console.log('准备上传')
    },
    handleRemove3 (file) {
      let fileList = this.uploadList
      this.uploadList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      if (res.code === 200) {
        let obj = {
          name: file.name,
          url: res.data.image_url
        }
        this.uploadList.push(obj)
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
        desc: '文件 “' + file.name + '” 太大, 不要超过 2m'
      })
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    closeModel () {
      this.$emit('closeModel', '')
    },
    // 问题提交
    answerSubmit () {
      if (this.quiz.length < 5 && this.quiz.length > 0) {
        this.errorTs = '请至少输入5个字'
        return
      }
      if (this.quiz === '') {
        this.errorTs = '请输入纠错内容'
        return
      }
      if (/^\s+$/gi.test(this.quiz) || this.quiz.trim() === '') {
        this.errorTs = '不能全为空格'
        return
      }
      if (this.quiz > 200) {
        this.errorTs = '最多输入200字'
        return
      }
      this.errorTs = ''
      let quizImage = this.quiz_image.join(',')
      let data = Object.assign({ quiz: this.quiz, video_time: 5, quiz_image: quizImage }, this.playCourseInfo)
      answerSub(data).then(data => {
        this.uploadList = []
        this.quiz_image = []
        this.quiz = ''
        this.getAnswerList()
      })
    },
    // 问题列表
    getAnswerList () {
      answerList(this.playCourseInfo).then(data => {
        const res = data.data
        this.answerList = res.data
        this.answerList.map((val, index) => {
          val.openFlag = false
        })
      })
    },
    // 展开收起
    openShow (item, index) {
      this.answerList[index].openFlag = !item.openFlag
      this.$forceUpdate()
      if (item.reply_status === 1 && item.openFlag) { // 已回复并且是展开的状态
        this.getAnswerDetails(item.id)
      }
    },
    // 问题详情老师回复
    getAnswerDetails (id) {
      answerDetails({
        answer_id: id
      }).then(data => {
        const res = data.data
        console.log(res.data)
        this.$set(this.replyList, [id], res.data)
      })
    },
    // 答疑
    stopPlay () {
      this.playStatus = false
    },
    goPlay () {
      this.playStatus = true
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  @import "../../assets/scss/iview.css";
  // @import "../../../node_modules/iview/dist/styles/iview.css";
  .ask-wrap{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    overflow-y: scroll;
    background: #F8FAFC;
  }
  .vc-title{
    padding-top: 18px;
    padding-bottom: 30px;
    font-size: 20px;
    color: $col333;
  }
  .ask {
    width: 495px;
    height: 100%;
    padding: 0 20px;
    background: #ffffff;
    box-sizing: border-box;
    overflow-y: scroll;
  }
  .others{
    width: 100%;
    padding: 12px 20px 0 20px;
    background: #F8FAFC;
    position: absolute;
    top: 295px;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
    overflow-y: scroll;
    &.has-img{
      top: 348px;
    }
  }
  .othq-list{
    // position: absolute;
    // width: 100%;
    // top: 68px;
    // left: 0;
    // bottom: 0;
    // overflow-y: scroll;
  }
  .close-box{
    text-align: right;
    padding-top: 25px;
    .close-icon{
      @include bg_img(15, 15, '../../assets/images/video/close-icon.png');
    }
  }
  .texta {
    resize: none;
    width: 100%;
    height: 114px;
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
      color: $col999;
    }
  }
  .othq-list-teacher{
    border-top: 1px solid #E6E6E6;
    margin-top: 15px;
  }
  .othq-item{
    padding: 15px 20px;
    margin-bottom: 10px;
    background: $colfff;
    box-shadow: 0px 2px 8px -4px rgba(0,0,0,0.2);
    border-radius: 8px;
    .othq-txt{
      line-height: 20px;
      color: #4A4A4A;
      &.sl{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
      }
    }
    .open-txt{
      font-size: 13px;
      color: $blueColor;
      text-align: right;
      margin-top: 5px;
    }
    .othq-list-teacher &{
      padding: 20px 0;
      margin-bottom: 0;
      box-shadow: 0px 0px 0px rgba(0,0,0,0);
      background: none;
    }
  }
  .othq-item-t{
    padding-bottom: 5px;
    display: flex;
    align-items: center;
    line-height: 26px;
    .head-logo{
      @include wh(40, 40);
      border-radius: 100%;
      margin-right: 10px;
    }
    p{
      font-size: 12px;
      color: $col999;
    }
    .othq-huifu{
      flex: 1;
      text-align: right;
      color: #F99111;
    }
  }
  .teacher-light{
    width: 46px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color:#F99111;
    background:rgba(249,145,17,.15);
    border-radius: 18px;
    display: inline-block;
    text-align: center;
    margin-left: 10px;
  }
  .quiz-image-list, .teacher-answer{
    img{
      width: 80px;
      height: 80px;
      margin-right: 10px;
      display: inline-block;
    }
  }
  .teacher-answer{
    padding: 10px 20px;
    background: #999999;
  }
</style>
