<template>
  <div>
    <!--提问-->
    <div class="ask" v-if="playCourseInfo.is_zheng == 1">
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
          <span class="errorTxt" v-if="errorTs">至少输入5个字</span>
          <button class="submit" @click="answerSubmit()">提交</button>
        </div>
      </div>
    </div>
    <div class="close-box" @click="closeModel()" v-else>
      <i class="close-icon"></i>
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
          <div class="open-txt" @click="openShow(item.openFlag, index)">
            {{item.openFlag ? '收起':'展开'}}
          </div>
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
      errorTs: false,
      playStatus: true
    }
  },
  mounted () {
    this.getAnswerList()
  },
  methods: {
    send () {
      EventBus.$emit('stopPlay', this.playStatus)
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
      this.quiz_image.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      if (res.code === 200) {
        // this.uploadList = []
        let obj = {
          name: file.name,
          url: res.data.image_url
        }
        this.uploadList.push(obj)
        this.imageUrl = res.data.image_url
        this.quiz_image.push(res.data.image_url)
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
      this.$emit('closeModel')
    },
    // 问题提交
    answerSubmit () {
      if (this.quiz.length < 5) {
        this.errorTs = true
        return
      } else {
        this.errorTs = false
      }
      let quizImage = this.quiz_image.join(',')
      let data = Object.assign({ quiz: this.quiz, video_time: 5, quiz_image: quizImage }, this.playCourseInfo)
      answerSub(data).then(data => {
        this.getAnswerList()
      })
    },
    // 问题列表
    getAnswerList () {
      answerList(this.playCourseInfo).then(data => {
        const res = data.data
        this.answerList = res.data
        this.uploadList = []
        this.quiz = ''
        this.answerList.map((val, index) => {
          val.openFlag = false
        })
      })
    },
    // 展开收起
    openShow (currentOpenFlag, index) {
      this.answerList[index].openFlag = !currentOpenFlag
      this.$forceUpdate()
    },
    // 问题详情
    getAnswerDetails () {
      answerDetails({
        answer_id: '2'
      }).then(data => {
        // console.log(data)
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
  .vc-title{
    padding-top: 18px;
    padding-bottom: 30px;
    font-size: 20px;
    color: $col333;
  }
  .ask {
    padding: 0 20px;
    background: #ffffff;
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
    &.has-img{
      top: 348px;
    }
  }
  .othq-list{
    position: absolute;
    width: 100%;
    top: 68px;
    left: 0;
    bottom: 0;
    overflow-y: scroll;
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
  .quiz-image-list{
    padding-top: 6px;
    img{
      width: 80px;
      height: 80px;
      margin-right: 10px;
    }
  }
</style>
