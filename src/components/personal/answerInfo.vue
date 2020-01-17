<template>
  <div class="u-course-wrap">
    <!-- answerType：personal只为区分样式  -->
    <ul class="tab-list" v-if="answerType == 'personal'">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <ul class="tab-list-learn" v-if="answerType == 'learn'">
      <li class="tab-item-learn" v-for="(v, index) in txtArr" :class="{'active': selIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <div v-if="selIdx == 0">
        <div v-if="courseAnswerList && courseAnswerList.length">
          <ul class="u-othq-list">
            <!-- 提问 -->
            <li class="u-othq-item" v-for="(items, index) in courseAnswerList" :key="index">
              <div class="u-othq-item-t">
                <img :src="items[0].head" alt="" class="head-logo">
                <div class="othq-info">
                  <h3>{{items[0].username}}</h3>
                  <p>{{items[0].creates_time}}</p>
                </div>
                <span class="othq-huifu" v-if="items[0].reply_status == 1">老师已回复</span>
              </div>
              <p class="othq-txt" :class="!items.openFlag? 'sl' : ''">{{items[0].quiz}}</p>
              <div class="quiz-image-list course_img">
                <div class="demo-upload-list" v-for="(val, index) in items[0].quiz_image" :key="index">
                  <template>
                    <img :src="val">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(val)"></Icon>
                    </div>
                  </template>
                </div>
              </div>
              <div class="u-othq-item-b">
                <div class="ans-know-name" v-if="items[0].know_name.length && items[0].know_name!=''">
                  <span v-for="(v, index) in items[0].know_name" :key="index">{{v}}</span>
                </div>
                <div class="ans-know-name" v-else></div>
                <div class="open-txt" @click="openShow(items, index, 0)">
                  {{items.openFlag ? '收起':'展开'}}
                  <Icon type="md-arrow-dropdown" style="font-size: 28px;margin-top: -3px;" v-if="answerType == 'personal' && !items.openFlag"/>
                  <Icon type="md-arrow-dropup" style="font-size: 28px;margin-top: -3px;" v-if="answerType == 'personal' && items.openFlag"/>
                </div>
              </div>
              <ul class="u-othq-list-teacher" v-if="items[0].reply_status == 1 && items.openFlag">
                <!-- 老师回复 -->
                <li class="u-othq-item" v-if="items[1] && items[1].reply_quiz != ''">
                  <div class="u-othq-item-t">
                    <img :src="items[1].head_img" alt="" class="head-logo">
                    <div class="othq-info">
                      <h3>{{items[1].reply_user_name}}<span class="teacher-light">老师</span></h3>
                      <p>{{items[1].repls_time}}</p>
                    </div>
                    <span class="othq-huifu tousu" @click="tousuAnswer(items[0].id)">投诉</span>
                  </div>
                  <p class="othq-txt">{{items[1].reply_quiz}}</p>
                  <div class="quiz-image-list course_img">
                    <div class="demo-upload-list" v-for="(v, index) in items[1].reply_image" :key="index">
                      <template>
                        <img :src="v" alt="">
                        <div class="demo-upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="handleView(v)"></Icon>
                        </div>
                      </template>
                    </div>
                  </div>
                  <button class="zhuiwen" v-if="items[0].is_close == 1" @click="zhuiwen(items[0].id)">追问</button>
                </li>
                <!-- 追问 -->
                <li class="u-othq-item" v-if="items[2] && items[2].z_quiz != ''">
                  <div class="u-othq-item-t">
                    <img :src="items[2].head" alt="" class="head-logo">
                    <div class="othq-info">
                      <h3>{{items[2].username}}</h3>
                      <p>{{items[2].z_create_time}}</p>
                    </div>
                    <span class="othq-huifu" v-if="items[2].z_reply_status == 1">老师已回复</span>
                  </div>
                  <p class="othq-txt" :class="!items.openFlag? 'sl' : ''">{{items[2].z_quiz}}</p>
                  <div class="quiz-image-list course_img">
                    <div class="demo-upload-list" v-for="(val, index) in items[2].z_quiz_image" :key="index">
                      <template>
                        <img :src="val">
                        <div class="demo-upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="handleView(val)"></Icon>
                        </div>
                      </template>
                    </div>
                  </div>
                </li>
                <!-- 追问老师回复 -->
                <li class="u-othq-item" v-if="items[3] && items[3].z_reply_quiz != ''">
                  <div class="u-othq-item-t">
                    <img :src="items[3].head_img" alt="" class="head-logo">
                    <div class="othq-info">
                      <h3>{{items[3].reply_user_name}}<span class="teacher-light">老师</span></h3>
                      <p>{{items[3].z_reply_time}}</p>
                    </div>
                    <span class="othq-huifu tousu" @click="tousuAnswer(items[0].id)">投诉</span>
                  </div>
                  <p class="othq-txt">{{items[3].z_reply_quiz}}</p>
                  <div class="quiz-image-list course_img">
                    <div class="demo-upload-list" v-for="(v, index) in items[3].z_reply_image" :key="index">
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
        <div v-if="questionAnswerList && questionAnswerList.length">
          <ul class="u-othq-list">
            <!-- 提问 -->
            <li class="u-othq-item" v-for="(items, index) in questionAnswerList" :key="index">
              <div class="u-othq-item-t">
                <img :src="items[0].head" alt="" class="head-logo">
                <div class="othq-info">
                  <h3>{{items[0].username}}</h3>
                  <p>{{items[0].create_times}}</p>
                </div>
                <span class="othq-huifu" v-if="items[0].reply_status == 1">老师已回复</span>
              </div>
              <p class="othq-txt" :class="!items.openFlag? 'sl' : ''">{{items[0].quiz}}</p>
              <div class="quiz-image-list course_img">
                <div class="demo-upload-list" v-for="(val, index) in items[0].quiz_image" :key="index">
                  <template>
                    <img :src="val">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(val)"></Icon>
                    </div>
                  </template>
                </div>
              </div>
              <div class="u-othq-item-b">
                <div class="ans-know-name" v-if="items[0].know_name.length && items[0].know_name!=''">
                  <span v-for="(v, index) in items[0].know_name" :key="index">{{v}}</span>
                </div>
                <div class="ans-know-name" v-else></div>
                <div class="open-txt" @click="openShow(items, index, 1)">
                  {{items.openFlag ? '收起':'展开'}}
                  <Icon type="md-arrow-dropdown" style="font-size: 28px;margin-top: -3px;" v-if="answerType == 'personal' && !items.openFlag"/>
                  <Icon type="md-arrow-dropup" style="font-size: 28px;margin-top: -3px;" v-if="answerType == 'personal' && items.openFlag"/>
                </div>
              </div>
              <ul class="u-othq-list-teacher" v-if="items[0].reply_status == 1 && items.openFlag">
                <!-- 老师回复 -->
                <li class="u-othq-item" v-if="items[1] && items[1].reply_quiz != ''">
                  <div class="u-othq-item-t">
                    <img :src="items[1].head_img" alt="" class="head-logo">
                    <div class="othq-info">
                      <h3>{{items[1].reply_user_name}}<span class="teacher-light">老师</span></h3>
                      <p>{{items[1].repls_time}}</p>
                    </div>
                    <span class="othq-huifu tousu" @click="tousuAnswer(items[0].Id)">投诉</span>
                  </div>
                  <p class="othq-txt">{{items[1].reply_quiz}}</p>
                  <div class="quiz-image-list course_img">
                    <div class="demo-upload-list" v-for="(v, index) in items[1].reply_image" :key="index">
                      <template>
                        <img :src="v" alt="">
                        <div class="demo-upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="handleView(v)"></Icon>
                        </div>
                      </template>
                    </div>
                  </div>
                  <button class="zhuiwen" v-if="items[0].is_close == 1" @click="zhuiwen(items[0].Id)">追问</button>
                </li>
                <!-- 追问 -->
                <li class="u-othq-item" v-if="items[2] && items[2].z_quiz != ''">
                  <div class="u-othq-item-t">
                    <img :src="items[2].head" alt="" class="head-logo">
                    <div class="othq-info">
                      <h3>{{items[2].username}}</h3>
                      <p>{{items[2].z_create_time}}</p>
                    </div>
                    <span class="othq-huifu" v-if="items[2].z_reply_status == 1">老师已回复</span>
                  </div>
                  <p class="othq-txt" :class="!items.openFlag? 'sl' : ''">{{items[2].z_quiz}}</p>
                  <div class="quiz-image-list course_img">
                    <div class="demo-upload-list" v-for="(val, index) in items[2].z_quiz_image" :key="index">
                      <template>
                        <img :src="val">
                        <div class="demo-upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="handleView(val)"></Icon>
                        </div>
                      </template>
                    </div>
                  </div>
                </li>
                <!-- 追问老师回复 -->
                <li class="u-othq-item" v-if="items[3] && items[3].z_reply_quiz != ''">
                  <div class="u-othq-item-t">
                    <img :src="items[3].head_img" alt="" class="head-logo">
                    <div class="othq-info">
                      <h3>{{items[3].reply_user_name}}<span class="teacher-light">老师</span></h3>
                      <p>{{items[3].z_reply_time}}</p>
                    </div>
                    <span class="othq-huifu tousu" @click="tousuAnswer(items[0].Id)">投诉</span>
                  </div>
                  <p class="othq-txt">{{items[3].z_reply_quiz}}</p>
                  <div class="quiz-image-list course_img">
                    <div class="demo-upload-list" v-for="(v, index) in items[3].z_reply_image" :key="index">
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
    </div>
    <Modal title="图片预览" v-model="visible" :width="795">
      <img :src="imgUrl" v-if="visible" style="width: 100%;">
    </Modal>
    <zhuiwen :answerVisible.sync="answerVisible" :zhuiwenInfo="zhuiwenInfo" @updateAnswerList="initRes"></zhuiwen>
    <tousu :tousuVisible.sync="tousuVisible" :tousuInfo="tousuInfo"></tousu>
  </div>
</template>

<script>
import { courseAnswer, questionAnswer } from '@/api/personal'
import zhuiwen from '@/components/answer/zhuiwen'
import tousu from '@/components/answer/tousu'
import { mapState } from 'vuex'
export default {
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
      selIdx: this.$route.query.selIdx || 0,
      limit: 5,
      page: 1,
      total: 1,
      courseAnswerList: [],
      // courseMyAnswer: {},
      // courseReply: {},
      questionAnswerList: [],
      // questionMyAnswer: {},
      // questionReply: {},
      noDataFlag: false,
      numNew: parseInt(this.$route.query.num), // 如果从消息页面提醒进来，对应的消息展开
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
      this.selIdx = index
      this.$router.replace({ path: '/personal',
        query: {
          ...this.$route.query,
          type: 'answer',
          selIdx: index
        }
      })
      this.page = 1
      this.initRes()
    },
    initRes () {
      if (parseInt(this.selIdx) === 0) {
        this.getCourseAnswer()
        this.zhuiwenInfo.answer_type = 1
        this.tousuInfo.answer_type = 1
      }
      if (parseInt(this.selIdx) === 1) {
        this.getQuestionAnswer()
        this.zhuiwenInfo.answer_type = 2
        this.tousuInfo.answer_type = 2
      }
    },
    // 课程答疑
    getCourseAnswer () {
      this.showLoading(true)
      courseAnswer({
        user_id: this.user_id,
        limit: this.limit,
        page: this.page
      }).then(data => {
        this.noDataFlag = true
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          if (res.data && res.data.list) {
            let { num, list } = res.data
            this.total = num
            this.courseAnswerList = list
            if (this.courseAnswerList.length) {
              this.noDataFlag = false
            }
            this.courseAnswerList.map((val, index) => {
              val.openFlag = false
              if (this.numNew === val[0].id) { // 如果从消息页面提醒进来，对应的消息展开
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
      this.showLoading(true)
      questionAnswer({
        user_id: this.user_id,
        limit: this.limit,
        page: this.page
      }).then(data => {
        this.noDataFlag = true
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          if (res.data && res.data.list) {
            let { num, list } = res.data
            this.total = num
            this.questionAnswerList = list
            if (this.questionAnswerList.length) {
              this.noDataFlag = false
            }
            this.questionAnswerList.map((val, index) => {
              val.openFlag = false
              if (this.numNew === val[0].Id) { // 如果从消息页面提醒进来，对应的消息展开
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
      window.scrollTo(0, 0)
    },
    // 追问
    zhuiwen (id) {
      this.zhuiwenInfo.id = id
      this.answerVisible = true
    },
    // 投诉
    tousuAnswer (id) {
      this.tousuInfo.id = id
      this.tousuVisible = true
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .u-othq-list{
  }
  .u-othq-list-teacher{
    border-top: 1px solid #E6E6E6;
    margin-top: 15px;
  }
  .u-othq-item{
    padding: 20px;
    margin-bottom: 20px;
    background: $colfff;
    box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1);
    border-bottom: 1px solid #E6E6E6;
    border-radius: 8px;
    position: relative;
    .othq-txt{
      line-height: 20px;
      margin-top: 5px;
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
    }
    .u-othq-list-teacher &{
      padding: 20px 0;
      margin-bottom: 0;
      box-shadow: 0px 0px 0px rgba(0,0,0,0);
      border-radius: 0px;
      &:last-child{
        border: 0;
        padding-bottom: 0;
      }
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
  .u-othq-item-t{
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
</style>
