<template>
  <div class="u-course-wrap">
    <!-- answerType：personal只为区分样式  -->
    <ul class="tab-list" v-if="answerType == 'personal'">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdxAnswer == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <ul class="tab-list-learn" v-if="answerType == 'learn'">
      <li class="tab-item-learn" v-for="(v, index) in txtArr" :class="{'active': selIdxAnswer == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <div v-if="selIdxAnswer == 0">
        <div v-if="courseAnswerList && courseAnswerList.length">
          <ul class="othq-list">
            <li class="othq-item" v-for="(item, index) in courseAnswerList" :key="index">
              <div class="othq-item-t">
                <img :src="item.data.head" alt="" class="head-logo">
                <div class="othq-info">
                  <h3>{{item.data.username}}</h3>
                  <p>{{item.data.creates_time}}</p>
                </div>
                <span class="othq-huifu" v-if="item.data.reply_status == 1">老师已回复</span>
              </div>
              <p class="othq-txt" :class="!item.openFlag? 'sl' : ''">{{item.data.quiz}}</p>
              <div class="quiz-image-list course_img">
                <div class="demo-upload-list" v-for="(val, index) in item.data.quiz_image" :key="index">
                  <template>
                    <img :src="val">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(val)"></Icon>
                    </div>
                  </template>
                </div>
              </div>
              <div class="othq-item-b">
                <div class="ans-know-name" v-if="item.data.know_name.length && item.data.know_name!=''">
                  <span v-for="(v, index) in item.data.know_name" :key="index">{{v}}</span>
                </div>
                <div class="ans-know-name" v-else></div>
                <div class="open-txt" @click="openShow(item, index, 0)">
                  {{item.openFlag ? '收起':'展开'}}
                  <Icon type="md-arrow-dropdown" style="font-size: 28px;margin-top: -3px;" v-if="answerType == 'personal' && !item.openFlag"/>
                  <Icon type="md-arrow-dropup" style="font-size: 28px;margin-top: -3px;" v-if="answerType == 'personal' && item.openFlag"/>
                </div>
              </div>
              <ul class="othq-list-teacher" v-if="item.data.reply_status == 1 && item.openFlag">
                <li class="othq-item">
                  <div class="othq-item-t">
                    <img :src="item.reply.head_img" alt="" class="head-logo">
                    <div class="othq-info">
                      <h3>{{item.reply.reply_user_name}}<span class="teacher-light">老师</span></h3>
                      <p>{{item.reply.repls_time}}</p>
                    </div>
                  </div>
                  <p class="othq-txt">{{item.reply.reply_quiz}}</p>
                  <div class="quiz-image-list course_img">
                    <div class="demo-upload-list" v-for="(v, index) in item.reply.reply_image" :key="index">
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
          <div style="padding: 20px; text-align: center;">
            <Page
            :total="total"
            @on-change="onChange"
            :current="page"
            :page-size="limit"
            size="small"
            />
          </div>
        </div>
        <div class="no-data" v-else>
          暂无答疑
        </div>
      </div>
      <div v-if="selIdxAnswer == 1">
        <div v-if="questionAnswerList && questionAnswerList.length">
          <ul class="othq-list">
            <li class="othq-item" v-for="(item, index) in questionAnswerList" :key="index">
              <div class="othq-item-t">
                <img :src="item.data.head" alt="" class="head-logo">
                <div class="othq-info">
                  <h3>{{item.data.username}}</h3>
                  <p>{{item.data.create_times}}</p>
                </div>
                <span class="othq-huifu" v-if="item.data.reply_status == 1">老师已回复</span>
              </div>
              <p class="othq-txt" :class="!item.openFlag? 'sl' : ''">{{item.data.quiz}}</p>
              <div class="quiz-image-list course_img">
                <div class="demo-upload-list" v-for="(val, index) in item.data.quiz_image" :key="index">
                  <template>
                    <img :src="val">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(val)"></Icon>
                    </div>
                  </template>
                </div>
              </div>
              <div class="othq-item-b">
                <div class="ans-know-name" v-if="item.data.know_name.length && item.data.know_name!=''">
                  <span v-for="(v, index) in item.data.know_name" :key="index">{{v}}</span>
                </div>
                <div class="ans-know-name" v-else></div>
                <div class="open-txt" @click="openShow(item, index, 1)">
                  {{item.openFlag ? '收起':'展开'}}
                  <Icon type="md-arrow-dropdown" style="font-size: 28px;margin-top: -3px;" v-if="answerType == 'personal' && !item.openFlag"/>
                  <Icon type="md-arrow-dropup" style="font-size: 28px;margin-top: -3px;" v-if="answerType == 'personal' && item.openFlag"/>
                </div>
              </div>
              <ul class="othq-list-teacher" v-if="item.data.reply_status == 1 && item.openFlag">
                <li class="othq-item">
                  <div class="othq-item-t">
                    <img :src="item.reply.head_img" alt="" class="head-logo">
                    <div class="othq-info">
                      <h3>{{item.reply.reply_user_name}}<span class="teacher-light">老师</span></h3>
                      <p>{{item.reply.repls_time}}</p>
                    </div>
                  </div>
                  <p class="othq-txt">{{item.reply.reply_quiz}}</p>
                  <div class="quiz-image-list course_img">
                    <div class="demo-upload-list" v-for="(v, index) in item.reply.reply_image" :key="index">
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
          <div style="padding: 20px; text-align: center;">
            <Page
            :total="total"
            @on-change="onChange"
            :current="page"
            :page-size="limit"
            size="small"
            />
          </div>
        </div>
        <div class="no-data" v-else>
          暂无答疑
        </div>
      </div>
    </div>
    <Modal title="图片预览" v-model="visible" :width="795">
      <img :src="imgUrl" v-if="visible" style="width: 100%;">
    </Modal>
  </div>
</template>

<script>
import { courseAnswer, questionAnswer } from '@/api/personal'
import { mapState } from 'vuex'
export default {
  // props: ['user_id', 'answerType'],
  props: {
    user_id: {
      type: Number
    },
    answerType: {
      type: String,
      default: 'personal'
    }
  },
  data () {
    return {
      visible: false,
      txtArr: ['课程答疑', '题库答疑'],
      selIdxAnswer: window.sessionStorage.getItem('selIdxAnswer') || 0,
      limit: 5,
      page: 1,
      total: 1,
      courseAnswerList: [],
      // courseMyAnswer: {},
      // courseReply: {},
      questionAnswerList: [],
      // questionMyAnswer: {},
      // questionReply: {},
      numNew: parseInt(this.$route.query.num) // 如果从消息页面提醒进来，对应的消息展开
    }
  },
  computed: {
    ...mapState({
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.initRes()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.initRes()
      })
    }
  },
  methods: {
    // 图片放大
    handleView (url) {
      this.imgUrl = url
      this.visible = true
    },
    tabClk (v, index) {
      this.selIdxAnswer = index
      window.sessionStorage.setItem('selIdxAnswer', index)
      this.initRes()
    },
    initRes () {
      if (parseInt(this.selIdxAnswer) === 0) {
        this.getCourseAnswer()
      }
      if (parseInt(this.selIdxAnswer) === 1) {
        this.getQuestionAnswer()
      }
    },
    // 课程答疑
    getCourseAnswer () {
      courseAnswer({
        user_id: this.user_id,
        limit: this.limit,
        page: this.page
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          if (res.data && res.data.list) {
            let { num, list } = res.data
            this.total = num
            this.courseAnswerList = list
            this.courseAnswerList.map((val, index) => {
              val.openFlag = false
              if (this.numNew === val.data.id) { // 如果从消息页面提醒进来，对应的消息展开
                val.openFlag = true
              }
            })
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 题库答疑
    getQuestionAnswer () {
      questionAnswer({
        user_id: this.user_id,
        limit: this.limit,
        page: this.page
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          if (res.data && res.data.data) {
            let { num, data } = res.data
            this.total = num
            this.questionAnswerList = data
            this.questionAnswerList.map((val, index) => {
              val.openFlag = false
              if (this.numNew === val.data.Id) { // 如果从消息页面提醒进来，对应的消息展开
                val.openFlag = true
              }
            })
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 展开收起
    openShow (item, index, type) {
      if (type === 0) {
        this.courseAnswerList[index].openFlag = !item.openFlag
        this.$forceUpdate()
        return
      }
      this.questionAnswerList[index].openFlag = !item.openFlag
      this.$forceUpdate()
    },
    // 分页
    onChange (val) {
      this.page = val
      this.initRes()
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .othq-list{
    // min-height: 320px;
    // max-height: 420px;
    // overflow-y: scroll;
    // margin-top: 20px;
  }
  .othq-list-teacher{
    border-top: 1px solid #E6E6E6;
    margin-top: 15px;
  }
  .othq-item{
    padding: 20px;
    margin-bottom: 20px;
    background: $colfff;
    box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1);
    border-radius: 8px;
    .othq-txt{
      line-height: 20px;
      margin-top: 5px;
      color: #4A4A4A;
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
    }
    .othq-list-teacher &{
      padding: 20px 0;
      margin-bottom: 0;
      box-shadow: 0px 0px 0px rgba(0,0,0,0);
      background: none;
    }
  }
  .othq-item-t{
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
  .tab-list-learn{
    width: 100%;
    padding-bottom: 20px;
    text-align: center;
    display: flex;
    background: #F3F6FF;
    li{
      width: 107px;
      height: 37px;
      line-height: 37px;
      font-size: 16px;
      color: $col666;
      background: #ffffff;
      cursor: pointer;
      &:first-child{
        border-radius: 4px 0 0 4px;
      }
      &:last-child{
        border-radius: 0 4px 4px 0;
      }
      &.active{
        background: #0267FF;
        color: #ffffff;
      }
    }
  }
  .othq-item-b{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  .ans-know-name{
    span{
      padding: 0 6px;
      height: 25px;
      line-height: 25px;
      background:rgba(2,103,255,.15);
      border-radius: 6px;
      color: $blueColor;
      display: inline-block;
      text-align: center;
      margin-right: 5px;
    }
  }
</style>
