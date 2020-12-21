<template>
  <div class="ask-wrap-course">
    <ul class="ask-tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <!-- 全部答疑 -->
    <div v-if="selIdx == 0">
      <div class="all-main" v-if="answerList.length">
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
              <Icon type="md-arrow-dropdown" style="font-size: 20px; margin-top: -3px;" v-if="!item.openFlag"/>
              <Icon type="md-arrow-dropup" style="font-size: 20px; margin-top: -3px;" v-if="item.openFlag"/>
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
      <div class="no-data" v-if="noDataFlag">
          暂无答疑
      </div>
    </div>
    <div v-if="selIdx == 1">
      <div class="all-main" v-if="answerList.length">
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
            <div class="u-othq-item-b">
              <div class="ans-know-name" v-if="item.know_name.length && item.know_name!=''">
                <span v-for="(v, index) in item.know_name" :key="index">{{v}}</span>
              </div>
              <div class="ans-know-name" v-else></div>
              <div class="open-txt" @click="openShow(item, index)" v-if="item.reply_status == 1">
                {{item.openFlag ? '收起':'展开'}}
                <Icon type="md-arrow-dropdown" style="font-size: 20px;margin-top: -3px;" v-if="!item.openFlag"/>
                <Icon type="md-arrow-dropup" style="font-size: 20px;margin-top: -3px;" v-if="item.openFlag"/>
              </div>
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
      <div class="no-data" v-if="noDataFlag">
          暂无答疑
      </div>
    </div>
    <Modal title="图片预览" v-model="visible" :width="795" :scrollable="true">
      <img :src="imgUrl" v-if="visible" style="width: 100%;">
    </Modal>
    <zhuiwen :answerVisible.sync="answerVisible" :zhuiwenInfo="zhuiwenInfo" @updateAnswerList="getAnswerList"></zhuiwen>
    <tousu :tousuVisible.sync="tousuVisible" :tousuInfo="tousuInfo" @updateAnswerList="getAnswerList"></tousu>
  </div>
</template>

<script>
import config from '@/config'
import zhuiwen from '@/components/answer/zhuiwen'
import tousu from '@/components/answer/tousu'
import { answerList, answerDetails } from '@/api/class'
export default {
  props: ['playCourseInfo', 'user_id', 'videoCredentials'],
  data () {
    return {
      txtArr: ['全部', '精选'],
      selIdx: 0,
      limit: 10,
      page: 1,
      total: 0,
      noDataFlag: false,
      answerList: [],
      quiz: '', // 提问文案
      quiz_image: [], // 提问图片 以,号分割
      isopen: false,
      imageUrl: '',
      visible: false,
      imgUrl: '',
      replyList: {}, // 老师回复内容
      apiPath: '/upload/Index/uploadImage',
      answerVisible: false, // 追问modal
      zhuiwenInfo: {
        answer_type: 1
      }, // 追问内容
      tousuVisible: false, // 投诉modal
      tousuInfo: {
        answer_type: 1
      } // 投诉内容
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
    this.initRes()
  },
  methods: {
    handleView (url) {
      this.imgUrl = url
      this.visible = true
    },
    tabClk (v, index, type) {
      this.selIdx = index
      this.page = 1
      this.initRes()
    },
    initRes () {
      this.answerList = []
      if (this.selIdx == 0) {
        this.getAnswerList(2)
      }
      if (this.selIdx == 1) {
        this.getAnswerList(3)
      }
    },
    // 问题列表
    getAnswerList (status) {
      answerList({
        user_id: this.user_id,
        video_id: this.playCourseInfo.video_id,
        section_id: this.playCourseInfo.section_id,
        course_id: this.playCourseInfo.course_id,
        package_id: this.playCourseInfo.package_id,
        limit: this.limit,
        page: this.page,
        video_time: this.videoCredentials.watch_time, // 视频时间节点
        status: status // 是否是按照视频节点查询1是2不是3精选
      }).then(data => {
        this.noDataFlag = true
        const res = data.data
        this.answerList = res.data.data
        this.total = res.data.total
        if (this.answerList && this.answerList.length) {
          this.noDataFlag = false
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
    // 分页
    onChange (val) {
      this.page = val
      this.initRes()
      // setTimeout(() => {
      //   document.documentElement.scrollTop = document.body.scrollTop = anchor.offsetTop - 150
      // }, 300)
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
  .ask-wrap-course{
    // background: #ffffff;
    // border-radius: 0 0 8px 8px;
  }
  .ask-tab-list{
    width: 100%;
    padding: 10px 41px 20px 41px;
    text-align: center;
    display: flex;
    background: #ffffff;
    li{
      width: 49px;
      height: 22px;
      line-height: 22px;
      border-radius: 11px;
      margin-right: 24px;
      cursor: pointer;
      background: #F3F6FF;
      color: #5C646E;
      font-size: 12px;
      &.active{
        background: #0267FF;
        color: #ffffff;
      }
    }
  }
  .othq-list-teacher{
    margin-top: 15px;
  }
  .othq-item{
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0px 2px 20px 0px rgba(153,153,153,0.3);
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
    .head-logo{
      @include wh(40, 40);
      border-radius: 100%;
      margin-right: 10px;
    }
    h3{
      line-height: 26px;
      font-weight: 500;
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
  .u-othq-item-b{
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
