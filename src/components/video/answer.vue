<template>
  <div class="ask-wrap">
    <!--提问-->
    <div class="ask">
      <div class="close-box" @click="closeModel">
        <i class="close-icon"></i>
      </div>
      <h1 class="vc-title">提问题</h1>
      <textarea autofocus v-model.trim="quiz" class="texta" placeholder="请一句话说明你的问题" cols="3" rows="3"
        v-on:focus="send"></textarea>
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
              <p>{{item.creates_time}}</p>
            </div>
            <span class="othq-huifu" v-if="item.reply_status == 1">老师已回复</span>
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
          <!-- 老师回复以及追问-->
          <ul class="othq-list-teacher" v-if="replyList[item.id] && item.openFlag">
            <!-- 1老师回复 -->
            <li class="othq-item" :class="{'othq-item-over': item.user_self == 1 && item.is_close == 1}" v-if="replyList[item.id][0].reply_quiz && (replyList[item.id][0].reply_quiz != '')">
              <div class="othq-item-t">
                <img :src="replyList[item.id][0].head_img" alt="" class="head-logo">
                <div class="othq-info">
                  <h3>{{replyList[item.id][0].reply_user_name}}<span class="teacher-light">老师</span></h3>
                  <p>{{replyList[item.id][0].repls_time}}</p>
                </div>
                <span class="tousu" v-if="item.user_self == 1" @click="tousuAnswer(item)">投诉</span>
              </div>
              <p class="othq-txt">{{replyList[item.id][0].reply_quiz}}</p>
              <div class="quiz-image-list course_img" v-if="replyList[item.id][0].reply_image">
                <div class="demo-upload-list" v-for="(v, index) in replyList[item.id][0].reply_image" :key="index">
                  <template>
                    <img :src="v" alt="">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(v)"></Icon>
                    </div>
                  </template>
                </div>
              </div>
              <!-- 是自己的提问并且老师有过第一次回复 -->
              <button class="zhuiwen" v-if="item.user_self == 1 && item.is_close == 1" @click="zhiwen(item)">追问</button>
            </li>
            <!-- 2学员追问 -->
            <li class="othq-item" v-if="replyList[item.id][1] && (replyList[item.id][1].z_quiz != '')">
              <div class="othq-item-t">
                <img :src="replyList[item.id][1].head" alt="" class="head-logo">
                <div class="othq-info">
                  <h3>{{replyList[item.id][1].username}}</h3>
                  <p>{{replyList[item.id][1].create_time}}</p>
                </div>
                <span class="othq-huifu" v-if="replyList[item.id][1].z_reply_status == 1">老师已回复</span>
              </div>
              <p class="othq-txt">{{replyList[item.id][1].z_quiz}}</p>
              <div class="quiz-image-list course_img">
                <div class="demo-upload-list" v-for="(val, index) in replyList[item.id][1].z_quiz_image" :key="index">
                  <template>
                    <img :src="val">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(val)"></Icon>
                    </div>
                  </template>
                </div>
              </div>
            </li>
            <!-- 3追问老师回复 -->
            <li class="othq-item othq-item-reply" v-if="replyList[item.id][2].z_reply_quiz && (replyList[item.id][2].z_reply_quiz != '')">
              <div class="othq-item-t">
                <img :src="replyList[item.id][2].head_img" alt="" class="head-logo">
                <div class="othq-info">
                  <h3>{{replyList[item.id][2].reply_user_name}}<span class="teacher-light">老师</span></h3>
                  <p>{{replyList[item.id][2].z_reply_time}}</p>
                </div>
                <span class="tousu" v-if="item.user_self == 1" @click="tousuAnswer(item)">投诉</span>
              </div>
              <p class="othq-txt">{{replyList[item.id][2].z_reply_quiz}}</p>
              <div class="quiz-image-list course_img">
                <div class="demo-upload-list" v-for="(v, index) in replyList[item.id][2].z_reply_image" :key="index">
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
    <zhuiwen :answerVisible.sync="answerVisible" :zhuiwenInfo="zhuiwenInfo" @updateAnswerList="getAnswerList"></zhuiwen>
    <tousu :tousuVisible.sync="tousuVisible" :tousuInfo="tousuInfo"></tousu>
  </div>
</template>

<script>
import config from '@/config'
import zhuiwen from '@/components/answer/zhuiwen'
import tousu from '@/components/answer/tousu'
import { answerList, answerSub, answerDetails } from '@/api/class'
export default {
  props: {
    playCourseInfo: {
      type: Object
    },
    user_id: {
      type: Number
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
      imageUrl: '',
      visible: false,
      imgUrl: '',
      errorTs: '',
      replyList: {}, // 老师回复内容
      apiPath: '/upload/Index/uploadImage',
      answerVisible: false, // 追问modal
      zhuiwenInfo: {}, // 追问内容
      tousuVisible: false, // 投诉modal
      tousuInfo: {} // 投诉内容
    }
  },
  components: {
    zhuiwen,
    tousu
  },
  mounted () {
    if (process.env.NODE_ENV === 'production') {
      this.apiPath = config.baseUrl.pro + '/upload/Index/uploadImage'
    }
    this.getAnswerList()
  },
  methods: {
    // 暂停播放
    send () {
      this.$emit('stopVideo')
    },
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
    answerSubmit () {
      if (this.quiz.length < 5 || this.quiz === '') {
        this.errorTs = '请至少输入5个字'
        return
      }
      if (/^\s+$/gi.test(this.quiz)) {
        this.errorTs = '不能全为空格'
        return
      }
      if (this.quiz.length > 200) {
        this.errorTs = '最多输入200字'
        return
      }
      this.errorTs = ''
      let quizImage = this.quiz_image.join(',')
      let vtime = window.sessionStorage.getItem('pauseWatchTime') || 0
      answerSub({
        quiz: this.quiz,
        video_time: vtime,
        quiz_image: quizImage,
        user_id: this.user_id,
        video_id: this.playCourseInfo.video_id,
        section_id: this.playCourseInfo.section_id,
        course_id: this.playCourseInfo.course_id,
        package_id: this.playCourseInfo.package_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.quiz_image = []
          this.quiz = ''
          this.getAnswerList()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 问题列表
    getAnswerList () {
      answerList({
        video_id: this.playCourseInfo.video_id,
        section_id: this.playCourseInfo.section_id,
        course_id: this.playCourseInfo.course_id,
        package_id: this.playCourseInfo.package_id,
        user_id: this.user_id
      }).then(data => {
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
        if (res.code === 200) {
          this.$set(this.replyList, [id], res.data)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 追问
    zhiwen (val) {
      this.zhuiwenInfo.id = val.id
      this.zhuiwenInfo.answer_type = 1
      this.answerVisible = true
    },
    // 投诉
    tousuAnswer (val) {
      this.tousuInfo.id = val.id
      this.tousuInfo.answer_type = 1
      this.tousuVisible = true
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .ask-wrap{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
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
    width: 100%;
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
    overflow: auto;
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
      color: #E84342;
    }
  }
  .othq-list-teacher{
    // border-top: 1px solid #E6E6E6;
    margin-top: 15px;
  }
  .othq-item{
    padding: 15px 20px;
    margin-bottom: 10px;
    background: $colfff;
    box-shadow: 0px 2px 8px -4px rgba(0,0,0,0.2);
    border-radius: 8px;
    &.othq-item-over{
      padding-bottom: 30px!important;
    }
    &.othq-item-zhiwen, &.othq-item-reply, &.othq-item-else{
      padding-bottom: 0px!important;
    }
    .othq-txt{
      line-height: 20px;
      color: #4A4A4A;
      word-wrap: break-word;
      &.sl{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
      }
    }
    .open-txt{
      cursor: pointer;
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
      border-top: 1px solid #E6E6E6;
      border-radius: 0px;
      position: relative;
    }
    .zhuiwen{
      position: absolute;
      right: 0px;
      bottom: 0px;
      width: 60px;
      height: 24px;
      border-radius: 16px;
      border: 1px solid $blueColor;
      color: $blueColor;
      &:hover{
        background: $blueColor;
        color: $colfff;
      }
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
    .othq-huifu, .tousu{
      flex: 1;
      text-align: right;
      color: #F99111;
    }
    .tousu{
      color: $col999;
      cursor: pointer;
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
