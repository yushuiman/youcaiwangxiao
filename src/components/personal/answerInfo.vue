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
      <!-- 课程答疑 -->
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
      <!-- 题库答疑 -->
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
      <!-- 图书答疑 -->
      <div v-if="selIdx == 2">
        <div class="mybooks-ask-wrap">
          <div class="mybooks-ask-form" v-if="courseList && courseList.length">
            <div class="mybooks-ask-tit">
              <h1>提问题</h1>
              <select class="com-sel1" v-model="course_id">
                <option class="com-opt" :value="v.id" v-for="(v, index) in courseList" :key="index">{{v.name}}</option>
              </select>
            </div>
            <textarea v-model.trim="quiz" class="texta" placeholder="请一句话说明你的问题" cols="3" rows="3"></textarea>
            <div class="submitAnswerBooks">
              <div class="course_img">
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
              <div>
                <span class="errorTxt">{{errorTs}}</span>
                <button class="submit" @click="bookAnswerSubmit">提交</button>
              </div>
            </div>
          </div>
          <div class="others" v-if="booksAnswerlistInfo.length">
            <ul class="u-othq-list">
              <li class="u-othq-item" v-for="(item, index) in booksAnswerlistInfo" :key="index">
                <div class="u-othq-item-t">
                  <img :src="item.head" alt="" class="head-logo">
                  <div class="othq-info">
                    <h3>{{item.username}}</h3>
                    <p>{{item.create_times}}</p>
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
                <!-- <div class="open-txt" @click="openShow(item, index, 2)" v-if="item.reply_status == 1">
                  {{item.openFlag ? '收起':'展开'}}
                </div> -->
                <div class="u-othq-item-b">
                  <div class="ans-know-name"></div>
                  <div class="open-txt" @click="openShow(item, index, 2)" v-if="item.reply_status == 1">
                    {{item.openFlag ? '收起':'展开'}}
                    <Icon type="md-arrow-dropdown" style="font-size: 20px;margin-top: -3px;" v-if="!item.openFlag"/>
                    <Icon type="md-arrow-dropup" style="font-size: 20px;margin-top: -3px;" v-if="item.openFlag"/>
                  </div>
                </div>
                <!-- 老师回复以及追问-->
                <ul class="u-othq-list-teacher" v-if="replyList[item.id] && item.openFlag">
                  <!-- 1老师回复 -->
                  <li class="u-othq-item" :class="{'othq-item-over': replyList[item.id][0].is_close == 1}" v-if="replyList[item.id][0]">
                    <div class="u-othq-item-t">
                      <img :src="replyList[item.id][0].head_image" alt="" class="head-logo">
                      <div class="othq-info">
                        <h3>{{replyList[item.id][0].username}}<span class="teacher-light">老师</span></h3>
                        <p>{{replyList[item.id][0].creates_time}}</p>
                      </div>
                      <span class="othq-huifu tousu" v-if="item.is_complain == 2" @click="tousuAnswer(item.id, item.course_id)">投诉</span>
                    </div>
                    <p class="othq-txt">{{replyList[item.id][0].quiz}}</p>
                    <div class="quiz-image-list course_img">
                      <div class="demo-upload-list" v-for="(v, index) in replyList[item.id][0].quiz_image" :key="index">
                        <template>
                          <img :src="v" alt="">
                          <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(v)"></Icon>
                          </div>
                        </template>
                      </div>
                    </div>
                    <!-- 是自己的提问并且老师有过第一次回复 -->
                    <button class="zhuiwen" v-if="replyList[item.id][0].is_close == 1" @click="zhuiwen(item.id, item.course_id)">追问</button>
                  </li>
                  <!-- 2学员追问 -->
                  <li class="u-othq-item" :class="{'othq-item-zhuiwen': replyList[item.id][1].reply_status == 2}" v-if="replyList[item.id][1] && replyList[item.id][1].quiz">
                    <div class="u-othq-item-t">
                      <img :src="replyList[item.id][1].head_image" alt="" class="head-logo">
                      <div class="othq-info">
                        <h3>{{replyList[item.id][1].username}}</h3>
                        <p>{{replyList[item.id][1].creates_time}}</p>
                      </div>
                      <span class="othq-huifu" v-if="replyList[item.id][0].reply_status == 1">老师已回复</span>
                    </div>
                    <p class="othq-txt">{{replyList[item.id][1].quiz}}</p>
                    <div class="quiz-image-list course_img">
                      <div class="demo-upload-list" v-for="(val, index) in replyList[item.id][1].quiz_image" :key="index">
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
                  <li class="u-othq-item othq-item-reply" v-if="replyList[item.id][2] && replyList[item.id][2].quiz">
                    <div class="u-othq-item-t">
                      <img :src="replyList[item.id][2].head_image" alt="" class="head-logo">
                      <div class="othq-info">
                        <h3>{{replyList[item.id][2].username}}<span class="teacher-light">老师</span></h3>
                        <p>{{replyList[item.id][2].creates_time}}</p>
                      </div>
                      <span class="othq-huifu tousu" v-if="item.is_complain == 2" @click="tousuAnswer(item.id, item.course_id)">投诉</span>
                    </div>
                    <p class="othq-txt">{{replyList[item.id][2].quiz}}</p>
                    <div class="quiz-image-list course_img">
                      <div class="demo-upload-list" v-for="(v, index) in replyList[item.id][2].quiz_image" :key="index">
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
          <Modal title="图片预览" v-model="visible" :width="795">
            <img :src="imgUrl" v-if="visible" style="width: 100%;">
          </Modal>
          <!-- <zhuiwen :answerVisible.sync="answerVisible" :zhuiwenInfo="zhuiwenInfo" @updateAnswerList="getBooksAnswerlist"></zhuiwen>
          <tousu :tousuVisible.sync="tousuVisible" :tousuInfo="tousuInfo"></tousu> -->
        </div>
        <!-- <div class="btn-answer-box"><button class="btn-com btn-answer">我要答疑</button></div> -->
        <!-- <div v-if="courseList && courseList.length">
          <div class="select-box">
            <select class="com-sel" v-model="course_id" @change="getCourseIdSel($event)">
              <option class="com-opt" :value="v.course_id" v-for="(v, index) in courseList" :key="index">{{v.name}}</option>
            </select>
            <Icon type="md-arrow-dropdown" style="font-size:24px; position:absolute; right: 5px; top: 3px;" />
          </div>
        </div> -->
        <!-- <div class="no-data" v-if="noDataFlag">
          暂无答疑
        </div> -->
      </div>
    </div>
    <!-- 答疑来源弹窗 课程、题库-->
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
    <tousu :tousuVisible.sync="tousuVisible" :tousuInfo="tousuInfo" @updateAnswerList="initRes"></tousu>
  </div>
</template>

<script>
import { courseAnswer, questionAnswer, onlyQuestion, booksAnswerlist, bookskAnswerdetails, bookAnswersub } from '@/api/personal'
import { getProject } from '@/api/questions'
import zhuiwen from '@/components/answer/zhuiwen'
import tousu from '@/components/answer/tousu'
import { videoCredentials } from '@/api/class'
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
      txtArr: ['课程答疑', '题库答疑', '图书答疑'],
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
      },
      courseList: [], // 课程列表
      course_id: '',
      answerList: [],
      quiz: '', // 提问文案
      quiz_image: [], // 提问图片 以,号分割
      visible: false,
      imgUrl: '',
      errorTs: '',
      booksAnswerlistInfo: [], // 全部答疑
      replyList: {}, // 老师回复内容
      apiPath: '/upload/Index/uploadImage',
      answerVisible: false, // 追问modal
      zhuiwenInfo: {}, // 追问内容
      tousuVisible: false, // 投诉modal
      tousuInfo: {}, // 投诉内容
      answer_id: ''
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
        this.zhuiwenInfo.answer_type = 1 // 课程答疑追问
        this.tousuInfo.answer_type = 1 // 课程答疑投诉
      }
      if (this.selIdx == 1) {
        this.getQuestionAnswer()
        this.zhuiwenInfo.answer_type = 2 // 题库答疑追问
        this.tousuInfo.answer_type = 2 // 题库答疑投诉
      }
      if (this.selIdx == 2) {
        this.getProjectList()
        this.getBooksAnswerlist()
        this.zhuiwenInfo.answer_type = 3 // 图书答疑追问
        this.tousuInfo.answer_type = 3 // 图书答疑投诉
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
      if (type === 1) {
        this.questionAnswerList[index].openFlag = !item.openFlag
        this.$forceUpdate()
        return
      }
      if (type === 2) {
        this.booksAnswerlistInfo[index].openFlag = !item.openFlag
        this.$forceUpdate()
        if (item.reply_status === 1 && item.openFlag) { // 已回复并且是展开的状态
          this.booksDetailsInfo(item.id)
        }
      }
    },
    // 分页
    onChange (val) {
      this.page = val
      this.initRes()
      window.scrollTo(0, 0)
    },
    // 追问
    zhuiwen (id, cId) {
      this.zhuiwenInfo.id = id
      this.zhuiwenInfo.course_id = cId
      this.answerVisible = true
    },
    // 投诉
    tousuAnswer (id, cId) {
      this.tousuInfo.id = id
      this.tousuInfo.course_id = cId
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
    // 视频播放信息
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
    // 题干来源信息
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
    // 购买课程
    getProjectList () {
      getProject({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.courseList = res.data
          if (this.courseList.length > 0) {
            this.course_id = this.courseList[0].id
          }
          if (this.courseList.length === 0) {
            this.noDataFlag = true
            return
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // getCourseIdSel (e) {
      // this.getBooksAnswerlist()
    // },
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
    },
    // 图书答疑
    // handleView (url) {
    //   this.imgUrl = url
    //   this.visible = true
    // },
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
    // 问题提交
    bookAnswerSubmit () {
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
      bookAnswersub({
        user_id: this.user_id,
        course_id: this.course_id,
        answer_id: this.answer_id,
        quiz: this.quiz,
        quiz_image: quizImage
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.quiz = ''
          this.quiz_image = []
          this.$Message.success('提交成功~')
          this.getBooksAnswerlist()
          this.$emit('modalShow', false)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 全部答疑列表
    getBooksAnswerlist () {
      booksAnswerlist({
        user_id: this.user_id,
        limit: this.limit,
        page: this.page
      }).then(data => {
        this.noDataFlag = true
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          if (res.data && res.data.data) {
            this.booksAnswerlistInfo = res.data.data
            this.total = res.data.total
            if (this.booksAnswerlistInfo.length) {
              this.noDataFlag = false
            }
            this.booksAnswerlistInfo.map((val, index) => {
              val.openFlag = false
            })
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 答疑回复内容
    booksDetailsInfo (id, index) {
      bookskAnswerdetails({
        answer_id: id,
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.$set(this.replyList, [id], res.data.reply)
        } else {
          this.$Message.error(res.msg)
        }
      })
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
    &.othq-item-zhuiwen, &.othq-item-reply{
      padding-bottom: 0px!important;
    }
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
    .u-othq-list-teacher &{
      padding-top: 0;
    }
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
      background: #0267FF;
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
  // 图书答疑
  .mybooks-ask-form{
    background: #ffffff; 
    padding: 15px 20px 0;
    margin-bottom: 20px;
    border-radius: 8px;
  }
  .mybooks-ask-tit{
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    h1{
      font-size: 20px;
      color: $col333;
    }
    .com-sel1{
      border: solid 1px #666666;
      margin-top: 6px;
      border-radius: 4px;
      height: 30px;
      line-height: 30px; 
    }
  }
  .othq-list{
    margin-top: 20px;
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
  .submitAnswerBooks{
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
