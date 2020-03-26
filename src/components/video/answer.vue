<template>
  <div class="ask-wrap">
    <!--提问-->
    <div class="my-ask">
      <div class="vc-title">
        <p>提问题</p>
        <Icon type="md-close" style="color:#999999;font-size: 22px;" @click="closeModel"/>
      </div>
      <textarea v-model.trim="quiz" class="texta" placeholder="请一句话说明你的问题" cols="3" rows="3" v-on:focus="send" v-on:blur="blurInp"></textarea>
      <div class="submitAnswer clearfix">
        <div class="course_time fl">
          <Icon type="ios-play" style="color:#999999;font-size: 16px;vertical-align:center;margin-right:5px;margin-top: -3px;"/>
          <span>{{formatSeconds(answerTime)}}</span>
          <!-- <span>{{answerTime}}</span> -->
        </div>
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
    <!--其他问题 :class="{'has-img': quiz_image.length}"-->
    <div class="others" v-if="answerList.length">
      <div class="vc-title">相关答疑</div>
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
          <div class="open-txt" @click="openShow(item, index)" v-if="item.reply_status == 1">
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
                <span class="tousu" v-if="item.user_self == 1 && item.is_complain == 2" @click="tousuAnswer(item)">投诉</span>
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
                <span class="tousu" v-if="item.user_self == 1 && item.is_complain == 2" @click="tousuAnswer(item)">投诉</span>
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
    },
    videoCredentials: {
      type: Object
    },
    answerTime: {
      type: Number
    }
  },
  data () {
    return {
      limit: 2,
      page: 1,
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
  computed: {
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
      document.onkeydown = undefined
    },
    blurInp () {
      this.$emit('addKeydown')
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
      this.$emit('closeModel', 'answer')
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
      // let vtime = window.sessionStorage.getItem('pauseWatchTime') || 0
      answerSub({
        quiz: this.quiz,
        video_time: this.answerTime,
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
        user_id: this.user_id,
        video_id: this.playCourseInfo.video_id,
        section_id: this.playCourseInfo.section_id,
        course_id: this.playCourseInfo.course_id,
        package_id: this.playCourseInfo.package_id,
        limit: this.limit,
        page: this.page,
        video_time: this.videoCredentials.watch_time, // 视频时间节点
        status: 1 // 是否是按照视频节点查询1是2不是3精选
      }).then(data => {
        const res = data.data
        this.answerList = res.data
        if (this.answerList && this.answerList.length) {
          this.answerList.map((val, index) => {
            val.openFlag = false
          })
        }
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
    },
    // 时分秒
    formatSeconds (value) {
      let result = parseInt(value)
      let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
      let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
      if (parseInt(h.substr(1)) > 0) {
        result = `${h}:${m}:${s}`
      } else {
        result = `${m}:${s}`
      }
      return result
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
    font-size: 16px;
    height: 65px;
    line-height: 65px;
    font-weight: 500;
    display: flex;
    align-items: center;
    p{
      flex: 1;
    }
    span{
      margin: 0 20px;
      &.active{
        color: $blueColor;
      }
    }
  }
  .my-ask {
    padding: 0 20px;
    background: #ffffff;
    box-sizing: border-box;
  }
  .others{
    width: 100%;
    padding: 8px 20px 0 20px;
    background: #F8FAFC;
    // position: absolute;
    // top: 252px;
    // left: 0;
    // bottom: 0;
    box-sizing: border-box;
    overflow: auto;
    // &.has-img{
    //   top: 298px;
    // }
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
    .course_time{
      padding: 0 6px;
      height: 26px;
      line-height: 26px;
      border-radius: 2px;
      text-align: center;
      margin-right: 10px;
      background: #F5F5F5;
    }
    .submit {
      width: 72px;
      height: 26px;
      line-height: 26px;
      background: rgba(249, 145, 17, 1);
      border-radius: 20px;
      font-size: 14px;
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
