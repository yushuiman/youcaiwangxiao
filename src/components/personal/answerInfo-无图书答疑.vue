<template>
  <div class="u-course-wrap">
    <!-- 个人中心  -->
    <ul class="tab-list" v-if="answerType == 'personal'">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <!-- 学习计划 -->
    <ul class="tab-list-learn" v-if="answerType == 'learn'">
      <li class="tab-item-learn" v-for="(v, index) in txtArr" :class="{'active': selIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <div v-if="selIdx == 0">
        <div v-if="courseAnswerList && courseAnswerList.length">
          <ul class="u-othq-list">
            <!-- 提问 -->
            <li class="u-othq-item" v-for="(items, index) in courseAnswerList" :key="index">
              <div class="answer-source answer-source-course" @click="sourceVidTopic(items[0], 1)">
                <i></i>来自：{{items[0].video_name}}<span>{{formatSeconds(items[0].video_time)}}</span>
              </div>
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
                <div class="open-txt" @click="openShow(items, index, 0)" v-if="items[0].reply_status == 1">
                  {{items.openFlag ? '收起':'展开'}}
                  <Icon type="md-arrow-dropdown" style="font-size: 20px;margin-top: -3px;" v-if="answerType == 'personal' && !items.openFlag"/>
                  <Icon type="md-arrow-dropup" style="font-size: 20px;margin-top: -3px;" v-if="answerType == 'personal' && items.openFlag"/>
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
                    <span class="othq-huifu tousu" v-if="items.user_self == 1 && items.is_complain == 2" @click="tousuAnswer(items[0].id)">投诉</span>
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
                    <span class="othq-huifu tousu" v-if="items.user_self == 1 && items.is_complain == 2" @click="tousuAnswer(items[0].id)">投诉</span>
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
              <div class="answer-source answer-source-topic" @click="sourceVidTopic(items[0], 2)">
                <i></i>来自：{{items[0].topic[0]}}
              </div>
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
                <div class="open-txt" @click="openShow(items, index, 1)" v-if="items[0].reply_status == 1">
                  {{items.openFlag ? '收起':'展开'}}
                  <Icon type="md-arrow-dropdown" style="font-size: 20px;margin-top: -3px;" v-if="answerType == 'personal' && !items.openFlag"/>
                  <Icon type="md-arrow-dropup" style="font-size: 20px;margin-top: -3px;" v-if="answerType == 'personal' && items.openFlag"/>
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
                    <span class="othq-huifu tousu" v-if="items.user_self == 1 && items.is_complain == 2" @click="tousuAnswer(items[0].Id)">投诉</span>
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
                    <span class="othq-huifu tousu" v-if="items.user_self == 1 && items.is_complain == 2" @click="tousuAnswer(items[0].Id)">投诉</span>
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
    <!-- 答疑来源 课程、题库-->
    <div class="source-visible" :class="{'source-course-visible': selIdx == 0, 'source-topic-visible': selIdx == 1}" v-if="sourceVisible" @mousedown.stop="move">
      <Icon type="ios-close" class="close-source" style="color:#bdbdbd;font-size: 36px;" @click="closeSource(2)"/>
      <div class="answer-video-box" v-if="selIdx == 0">
        <ali-player
          ref="aliPlayers"
          v-if="videoCredentials.playAuth"
          :vid="videoCredentials.VideoId"
          :playauth="videoCredentials.playAuth"
          :videoCredentials="videoCredentials"
          :answerVideo="true"
          :user_id="user_id"
          @ready="ready">
        </ali-player>
      </div>
      <div class="topic-list" v-if="selIdx == 1">
        <div class="topic-type">
          <em></em>{{onlyQuestionInfo.topicType == 1 ? '选择题' : '论述题'}}
        </div>
        <div class="topic-item">
          <div class="topic-title">
            <p v-if="onlyQuestionInfo.topic[0]">{{onlyQuestionInfo.topic[0]}}</p>
            <img v-if="onlyQuestionInfo.topic[1]" :src="onlyQuestionInfo.topic[1]" alt="">
            <p v-if="onlyQuestionInfo.topic[2]">{{onlyQuestionInfo.topic[2]}}</p>
            <img v-if="onlyQuestionInfo.topic[3]" :src="onlyQuestionInfo.topic[3]" alt="">
            <p v-if="onlyQuestionInfo.topic[4]">{{onlyQuestionInfo.topic[4]}}</p>
          </div>
          <!-- 论述题样式 -->
          <div v-if="onlyQuestionInfo.topicType == 2">
            <textarea disabled class="texta-discuss"></textarea>
          </div>
          <!-- 做题ABCD样式 else -->
          <ul class="topic-opition" v-if="onlyQuestionInfo.topicType == 1">
            <li class="tpc-opi" v-for="(v, key) in onlyQuestionInfo.options" :key="key">
              <div class="opi-abcd">
                <span :class="{'green-bg': v.option == v.right}">{{v.option}}</span>
              </div>
              <p>{{v.topic}}</p>
            </li>
          </ul>
        </div>
        <div class="resolving">
          <div class="resolve-detail">
            <!-- 非论述题，展示正确答案，用户答案 -->
            <p class="right-resolve" v-if="onlyQuestionInfo.topicType == 1">
              <span>正确答案<em class="right">{{onlyQuestionInfo.options[0].right}}</em></span>
            </p>
            <div class="instr-resolve instr-resolve-tw">
              <span>解析：</span>
              <div class="twtw">
                <p v-if="onlyQuestionInfo.analysis">{{onlyQuestionInfo.analysis}}</p>
                <img v-if="onlyQuestionInfo.analysisPic" :src="onlyQuestionInfo.analysisPic" alt="">
                <p v-if="onlyQuestionInfo.analysis_one">{{onlyQuestionInfo.analysis_one}}</p>
                <img v-if="onlyQuestionInfo.analysis_img_one" :src="onlyQuestionInfo.analysis_img_one" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 答疑图片预览 -->
    <Modal title="图片预览" v-model="visible" :width="795" scrollable>
      <img :src="imgUrl" v-if="visible" style="width: 100%;">
    </Modal>
    <!-- 答疑追问 -->
    <zhuiwen :answerVisible.sync="answerVisible" :zhuiwenInfo="zhuiwenInfo" @updateAnswerList="initRes"></zhuiwen>
    <!-- 答疑投诉 -->
    <tousu :tousuVisible.sync="tousuVisible" :tousuInfo="tousuInfo"></tousu>
  </div>
</template>

<script>
import { courseAnswer, questionAnswer, onlyQuestion } from '@/api/personal'
import { videoCredentials } from '@/api/class'

import zhuiwen from '@/components/answer/zhuiwen'
import tousu from '@/components/answer/tousu'
import aliPlayer from '@/components/video/aliPlayer'
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
      numNew: this.$route.query.num, // 如果从消息页面提醒进来，对应的消息展开
      visible: false, // 图片预览modal
      sourceVisible: false, // 课程、题库来源modal
      answerVisible: false, // 追问modal
      zhuiwenInfo: {}, // 追问内容
      tousuVisible: false, // 投诉modal
      tousuInfo: {}, // 投诉内容
      onlyQuestionInfo: {}, // 答疑题干来源
      videoCredentials: {
        VideoId: '',
        handouts: '', // 讲义
        playAuth: '', // 获取视频凭证
        collect: '', // 收藏
        watch_time: 0, // 观看时间,视频上次播放时间
        Title: '', // name
        format: 'mp4'
      }
    }
  },
  components: {
    zhuiwen,
    tousu,
    aliPlayer
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
    move (e) {
      let odiv = document.querySelector('.source-visible') // 获取目标元素
      // 算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft
      let disY = e.clientY - odiv.offsetTop
      document.onmousemove = (e) => {
        // 获取拖拽元素的位置
        let left = e.clientX - disX
        let top = e.clientY - disY
        // 把拖拽元素 放到 当前的位置
        if (left <= 0) {
          left = 0
        } else if (left >= document.documentElement.clientWidth - odiv.offsetWidth) {
          left = document.documentElement.clientWidth - odiv.offsetWidth
        }

        if (top <= 0) {
          top = 0
        } else if (top >= document.documentElement.clientHeight - odiv.offsetHeight) {
          top = document.documentElement.clientHeight - odiv.offsetHeight
        }
        odiv.style.left = left + 'px'
        odiv.style.top = top + 'px'
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // 图片放大
    handleView (url) {
      this.imgUrl = url
      this.visible = true
    },
    tabClk (v, index, type) {
      this.selIdx = index
      this.page = 1
      this.initRes()
      if (this.answerType === 'learn') {
        return
      }
      this.$router.replace({ path: '/personal',
        query: {
          ...this.$route.query,
          type: 'answer',
          selIdx: index
        }
      })
    },
    formatSeconds (value) {
      let result = parseInt(value)
      let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
      let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
      result = `${h}:${m}:${s}`
      return result
    },
    initRes () {
      this.sourceVisible = false
      if (this.selIdx == 0) {
        this.getCourseAnswer()
        this.zhuiwenInfo.answer_type = 1
        this.tousuInfo.answer_type = 1
      }
      if (this.selIdx == 1) {
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
              if (this.numNew == val[0].id) { // 如果从消息页面提醒进来，对应的消息展开
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
              if (this.numNew == val[0].Id) { // 如果从消息页面提醒进来，对应的消息展开
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
    },
    // 答疑来源
    sourceVidTopic (val, type) {
      this.sourceVisible = false
      if (type === 1) { // 视频
        this.getVideoCredentials(val)
      }
      if (type === 2) { // 题干
        this.getOnlyQuestion(val)
      }
    },
    closeSource (type) {
      this.sourceVisible = false
    },
    getVideoCredentials (val) {
      videoCredentials({
        VideoId: val.VideoId,
        user_id: this.user_id,
        package_id: val.package_id,
        course_id: val.course_id,
        section_id: val.section_id,
        video_id: val.video_id
      }).then(data => {
        let res = data.data
        if (res.code === 200) {
          this.sourceVisible = true
          let { Title, collect, handouts, playAuth, watch_time, status } = res.data
          if(status == 1){
            this.videoCredentials.format = 'm3u8'
          } else {
            this.videoCredentials.format = 'mp4'
          }
          this.videoCredentials.Title = Title
          this.videoCredentials.collect = collect
          this.videoCredentials.handouts = handouts
          this.videoCredentials.playAuth = playAuth
          // 列表取videoid video_time，可以少调一个接口
          this.videoCredentials.watch_time = val.video_time
          this.videoCredentials.VideoId = val.VideoId

        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    getOnlyQuestion (val) {
      onlyQuestion({
        question_id: val.question_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          if (res.data.topicType) {
            this.onlyQuestionInfo = res.data
            this.sourceVisible = true
            return
          }
          this.$Message.error('该题已下架~')
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 播放器
    ready (instance) {
      // 倍速设置
      instance.setSpeed(1)
      // 音量设置
      instance.setVolume(1)
      // 跳转到答题时间
      instance.seek(this.videoCredentials.watch_time)
      // 添加快捷键
      var _this = this
      document.onkeydown = function (e) {
        e.preventDefault()
        let key = window.event.keyCode
        _this.watchKeydοwn(key)
      }
    },
    watchKeydοwn (keyNum) {
      let player = this.$refs.aliPlayers
      let playStatus = player.getStatus()
      if (keyNum === 32) { // 空格暂停播放
        if (player.getCurrentTime() > 0) {
          this.isPlay = true
        }
        if (playStatus === 'playing' || this.isPlay) {
          player.pause()
        }
        if (playStatus === 'pause') {
          player.play()
        }
      }
      if (keyNum === 37) { // 快退
        let videotimes = player.getDuration()
        let playnum = player.getCurrentTime()
        playnum = parseInt(playnum - 5)
        if (playnum <= (videotimes - 30)) {
          player.seek(playnum)
        }
      }
      if (keyNum === 39) { // 快进
        let playnum = player.getCurrentTime()
        playnum = parseInt(playnum + 5)
        if (playnum > 15) {
          player.seek(playnum)
        } else {
          player.seek(0)
        }
      }
    }
  },
  beforeDestroy () {
    if (this.$refs.aliPlayers) {
      this.$refs.aliPlayers.dispose()
      document.onkeydown = undefined
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .answer-source{
    height: 55px;
    line-height: 55px;
    color: $col666;
    border-bottom: 1px solid #E6E6E6;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1;
    cursor: pointer;
    i{
      margin-right: 12px;
      vertical-align: middle;
      margin-top: -3px;
    }
    &.answer-source-course i{
      @include bg-img(24, 23, '../../assets/images/user/source-course-icon.png');
    }
    &.answer-source-topic i{
      @include bg-img(19, 22, '../../assets/images/user/source-topic-icon.png');
    }
  }
  .u-othq-list-teacher{
    border-top: 1px solid #E6E6E6;
    margin-top: 15px;
  }
  .u-othq-item{
    padding: 0 20px 20px;
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
      color: $blueColor;
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
    padding-top: 14px;
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
        background: #066AE4;
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
  // 答疑来源
  .source-visible{
    position: fixed;
    top: 80px;
    right: 4%;
    z-index: 2;
    cursor: move;
    overflow: auto;
    box-sizing: border-box;
    &.source-course-visible{
      width: 380px;
      height: 214px;
      &:hover{
        &:before{
          position: absolute;
          top: 0;
          left: 0;
          z-index: 3;
          width: 100%;
          height: 100px;
          background-image: linear-gradient(180deg,rgba(3,0,0,.8) 0,rgba(0,0,0,0));
          content: "";
        }
      }
      .answer-video-box{
        width: 100%;
        height: 100%;
      }
    }
    &.source-topic-visible{
      width: 765px;
      height: 435px;
      border-radius:8px;
      background: #ffffff;
      border: 1px solid #979797;
    }
    &:hover{
      .close-source{
        display: block;
      }
    }
  }
  .topic-list{
    padding: 0 30px 30px;
  }
  .topic-type{
    padding-top: 20px;
    padding-bottom: 16px;
    font-size: 16px;
    line-height: 22px;
    em{
      width: 2px;
      height: 14px;
      background: #066AE4;
      display: inline-block;
      vertical-align: middle;
      margin-top: -3px;
      margin-right: 5px;
    }
  }
  .close-source{
    position: absolute;
    right: 10px;
    top: 5px;
    z-index: 10;
    cursor: pointer;
    display: none;
  }
  .topic-title{
    p{
      line-height: 22px;
      font-size: 15px;
    }
    img{
      max-width: 100%;
    }
  }
  .topic-opition{
    padding: 10px 0;
    .tpc-opi{
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: $col666;
      .opi-abcd{
        span{
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          display: inline-block;
          border-radius: 50%;
          border: 1px solid $col666;
          margin-right: 14px;
          box-sizing: border-box;
          cursor: pointer;
          &.green-bg{
            border: 1px solid #0AAB55;
            color: #0AAB55;
          }
        }
      }
      p{
        line-height: 22px;
      }
    }
  }
  .resolve-detail{
    background: #F3F8FF;
    padding: 16px 20px;
    font-size: 15px;
    line-height: 26px;
    p{
      &.right-resolve{
        span{
          margin-right: 28px;
          em{
            margin-left: 16px;
          }
        }
      }
    }
  }
  .instr-resolve-tw{
    margin-top: 9px;
    display: flex;
    .twtw{
      flex: 1;
    }
    img{
      width: 100%;
    }
  }
  .texta-discuss{
    width: 100%;
    height: 133px;
    padding: 9px 14px;
    border-radius: 8px;
    margin: 22px 0;
    border: 1px solid #C7C7C7;
    outline: none;
    resize: none;
    box-sizing: border-box;
  }
</style>
