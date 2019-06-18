<template>
  <div class="video-wrap">
    <div class="video-header">
      <router-link :to="{ path: '/classDetail', query:{course_id: this.$route.query.package_id}}">></router-link>
      <span>{{videoCredentials.Title}}</span>
      <div class="login-r fr">
        <img src="../../assets/images/global/email-icon.png" alt="email" class="email-icon">
        <img src="../../assets/images/global/head-logo-moren.png" alt="头像" class="head-logo">
      </div>
    </div>
    <div class="video-main clearfix">
      <div class="video-info-l fl">
        <ul class="vinfo-ul">
          <li class="vinfo-item" :class="['vinfo-item-0'+(index+1), {'curren': selMenu==index}]"
            v-for="(item, index) in vinfo" :key="index" @click="showModel(item, index)">
            <i class="vio-icon"></i>
            <p class="txt" v-html="item"></p>
          </li>
        </ul>
      </div>
      <div class="video-info-c fl">
        <ali-player v-if="videoCredentials.playAuth" :vid="VideoId" :playauth="videoCredentials.playAuth" :height="height"></ali-player>
      </div>
      <div class="video-info-r fr">
        <div class="close-box" @click="closeModel()">
          <i class="close-icon">关闭</i>
        </div>
        <h1 class="vc-title">章节目录</h1>
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              background-color="#1D1F21"
              text-color="#E6E6E6"
              active-text-color="#F99111">
              <el-submenu index="1">
                <template slot="title">
                  <span>导航一</span>
                </template>
                <el-menu-item index="1-1">
                  <i class="el-video-icon"></i>
                  <span>P1期中测试-2018年11月-艾瑞</span>
                  <i class="el-dot-icon"></i>
                </el-menu-item>
                <el-menu-item index="1-2">
                  <i class="el-video-icon"></i>
                  <span>2019年4月考期P1成本管理1</span>
                  <i class="el-dot-icon el-dot-now"></i>
                </el-menu-item>
                <el-menu-item index="1-3">
                  <i class="el-video-icon play-icon"></i>
                  <span>2019年4月考期 规划、预算编制与预测</span>
                  <i class="el-dot-icon el-dot-see"></i>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <span>导航二</span>
                </template>
                <el-menu-item index="2-1">
                  <i class="el-video-icon"></i>
                  <span>P1期中测试-2018年11月-艾瑞</span>
                  <i class="el-dot-icon"></i>
                </el-menu-item>
                <el-menu-item index="2-2">
                  <i class="el-video-icon"></i>
                  <span>2019年4月考期P1成本管理1</span>
                  <i class="el-dot-icon el-dot-now"></i>
                </el-menu-item>
                <el-menu-item index="2-3">
                  <i class="el-video-icon play-icon"></i>
                  <span>2019年4月考期 规划、预算编制与预测</span>
                  <i class="el-dot-icon el-dot-see"></i>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </div>
      <!-- 课程 答疑 讲义 -->
      <div class="three-main">
        <div class="video-course-wrap vid-kcqh" v-if="showBox == '课程<br />切换'">
          <h1 class="vc-title">套餐内课程</h1>
          <div class="vc-list" v-for="(item, index) in courseList" :key="index">
            <img :src="item.pc_img" alt="">
            <div class="c-info">
              <h2>{{item.name}}</h2>
              <p>讲师: {{item.teacher_name}}</p>
            </div>
          </div>
        </div>
        <div class="video-course-wrap vid-dy" v-if="showBox == '答疑'">
          <!--提问-->
          <div class="ask" v-if="playCourseInfo.is_zheng == 1">
            <div class="close-box" @click="closeModel()">
              <i class="close-icon">关闭</i>
            </div>
            <h1 class="vc-title">提问题</h1>
            <textarea autofocus v-model="textdata" class="texta" placeholder="请一句话说明你的问题" cols="3" rows="3"
              v-on:focus="stopPlay()" v-on:blur="goPlay() "></textarea>
            <div class="submitAnswer">
              <!-- <i class="upload"></i> -->
              <input type="file" @change="selectImgs()" multiple accept="image/*" ref="file">
              <button class="submit" @click="answerSubmit()">提交</button>
            </div>
          </div>
          <div class="close-box" @click="closeModel()" v-else>
            <i class="close-icon">关闭</i>
          </div>
          <!--其他问题-->
          <div class="others">
            <h1 class="vc-title">本节其他问题</h1>
            <ul class="othq-list">
              <li class="othq-item">
                <div class="othq-item-t">
                  <img src="" alt="" class="head-logo">
                  <div class="othq-info">
                    <h3>都开始</h3>
                    <p>14分钟前</p>
                  </div>
                  <span class="othq-huifu">老师已回复</span>
                </div>
                <p class="othq-txt" :class="!isopen ? 'sl' : ''">的白谁的粉丝沈德符的返回快递发货的白谁的粉丝沈德符的返回快递发货的白谁的粉丝沈德符的返回快递发货的白谁的粉丝沈德符的返回快递发货的白谁的粉丝沈德符的返回快递发货的白谁的粉丝沈德符的返回快递发货</p>
                <div class="open-txt" @click="isopen=!isopen">{{isopen ? '收起' : '展开'}}</div>
              </li>
              <li class="othq-item">
                <div class="othq-item-t">
                  <img src="" alt="" class="head-logo">
                  <div class="othq-info">
                    <h3>都开始</h3>
                    <p>14分钟前</p>
                  </div>
                  <span class="othq-huifu">老师已回复</span>
                </div>
                <p class="othq-txt" :class="!isopen ? 'sl' : ''">递谁的粉丝沈德符的返回快递发货的白谁的粉丝沈德符的返回快递发货</p>
                <div class="open-txt" @click="isopen=!isopen">{{isopen ? '收起' : '展开'}}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="video-course-wrap vid-jy" v-if="showBox == '讲义'">
          <div class="close-box" @click="closeModel()">
            <i class="close-icon">关闭</i>
          </div>
          <h1 class="vc-title">讲义</h1>
          <iframe id="main-frame" :src="videoCredentials.handouts" width="100%" height="750px"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js"></script>
<script>
import aliPlayer from '@/components/aliPlayer'
import { videoPlayback, answerList, answerSub, videoCredentials, answerDetails } from '@/api/class'
export default {
  data () {
    return {
      selMenu: 3,
      showBox: '答疑',
      courseList: [
        {
          pc_img: '23232323',
          name: '史蒂夫可视电话反馈收到回复',
          teacher_name: '1wefwefefs'
        },
        {
          pc_img: '23232323',
          name: '说的话说的三闾大夫',
          teacher_name: '2wefwefefs'
        },
        {
          pc_img: '23232323',
          name: '23ewe3',
          teacher_name: '3wefwefefs'
        }
      ],
      vinfo: ['课程<br />切换', '答疑', '讲义'],
      textdata: '',
      isopen: false,
      VideoId: '',  // 视频VideoId
      height: '600px',
      videoCredentials: {
        handouts: '', // 讲义
        playauth: '', // 获取视频凭证
        collect:'',
        watch_time:'',
        Title:''
      },
      playCourseInfo: {
        video_id: this.$route.query.video_id,
        section_id: this.$route.query.section_id,
        course_id: this.$route.query.course_id,
        package_id: this.$route.query.package_id,
        is_zheng: this.$route.query.is_zheng
      }
    }
  },
  components: {
    aliPlayer
  },
  computed: {

  },
  mounted () {
    this.getVideoPlayback()
    // this.getAnswerDetails()
    this.$emit('header', false)
  },
  methods: {
    // tab 显示关闭课程，答疑，讲义
    showModel (val, index) {
      this.selMenu = index
      this.showBox = val
      if (val === '答疑') {
        this.getAnswerList()
      }
    },
    closeModel () {
      this.showBox = ''
    },
    // 获取视频凭证
    getVideoPlayback () {
      videoPlayback({
        video_id: this.$route.query.video_id
      }).then(data => {
        const res = data.data
        this.VideoId = res.data.VideoId
        // 获取视频凭证
        let dataForm = Object.assign({ VideoId: res.data.VideoId, user_id: 41, video_time: 5, quiz_image: 'dfsdfsdfsd' }, this.playCourseInfo)
        videoCredentials(dataForm).then(data => {
          let res = data.data
          this.videoCredentials = res.data
          // this.playauth = res.data.playAuth
          // this.handouts = res.data.handouts
        })
      })
    },
    // 问题提交
    answerSubmit () {
      let data = Object.assign({ quiz: 4, video_time: 5, quiz_image: 'dfsdfsdfsd' }, this.playCourseInfo)
      answerSub({
        data
      }).then(data => {

      })
    },
    // 问题列表
    getAnswerList () {
      answerList(this.playCourseInfo).then(data => {
        // console.log(data)
      })
    },
    // answerDetails
    getAnswerDetails () {
      answerDetails({
        answer_id: '2'
      }).then(data => {
        // console.log(data)
      })
    },
    // 答疑
    stopPlay () {
      console.log('停止')
    },
    goPlay () {
      console.log('继续')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .video-header{
    @include lh(70, 70);
    padding: 0 31px;
    background: $colfff;
    span{
      font-size: 16px;
      // margin-left: 17px;
      font-weight:500;
    }
    a{
      margin: 0 8px;
      color: $col999;
      display: inline-block;
      font-family: Consolas,Menlo,Courier,monospace;
      transform: rotate(180deg);
    }
  }
  .login-r{
    img{
      vertical-align: middle;
      &.email-icon{
        @include wh(18, 14);
        margin: 0 31px;
      }
      &.head-logo{
        @include wh(30, 30);
      }
    }
  }
  .video-main{
    background: #1D1F21;
    display: flex;
    justify-content: space-between;
    position: relative;
    .video-info-l{
      width: 60px;
    }
    .video-info-c{
      flex: 1;
      height: 849px;
      background:rgba(0,0,0,1);
      border-radius:10px;
      margin-top: 20px;
    }
    .video-info-r{
      width: 495px;
      height: 890px;
    }
  }
  .vinfo-ul{
    padding-top: 156px;
  }
  .vinfo-item{
    padding: 30px 0;
    text-align: center;
    &:hover,&.curren{
      background: #26292C;
    }
    .txt{
      color: $col999;
      line-height: 18px;
      margin-top: 5px;
    }
  }
  .vio-icon{
    .vinfo-item-01 &{
      @include bg_img(22, 18, '../../assets/images/video/class-icon.png');
    }
    .vinfo-item-02 &{
      @include bg_img(26, 24, '../../assets/images/video/answer-icon.png');
    }
    .vinfo-item-03 &{
      @include bg_img(26, 25, '../../assets/images/video/jiangyi-icon.png');
    }
  }

  .vc-title{
    padding-top: 18px;
    padding-bottom: 30px;
    font-size: 20px;
    color: $col333;
    .video-info-r &{
      color: #E6E6E6;
      padding-left: 20px;
    }
    .vid-kcqh &{
      color: #E6E6E6;
    }
  }
  .el-video-icon{
    @include wh(14, 14);
    display: inline-block;
    margin-right: 10px;
    margin-top: -3px;
    vertical-align: middle;
    @extend %bg-img;
    background-image: url('../../assets/images/video/stop-icon.png');
    &.play-icon{
      background-image: url('../../assets/images/video/play-icon.png');
    }
  }
  .el-menu-item{
    padding-left: 35px!important;
    padding-right: 22px!important;
  }
  .el-dot-icon{
    @include wh(10, 10);
    display: inline-block;
    border-radius: 100%;
    margin-top: 20px;
    border:2px solid rgba(102,102,102,1);
    box-sizing: border-box;
    float: right;
    &.el-dot-see{
      border: 0;
      background: rgba(249,145,17,1);
    }
    &.el-dot-now{
      border: 0;
      border:2px solid rgba(249,145,17,1);
    }
  }
  // 目录 答疑 讲义
  .video-course-wrap{
    position: absolute;
    top: 20px;
    background: #26292C;
    z-index: 9;
    padding: 0 20px;
    box-sizing: border-box;
    &.vid-kcqh{
      left: 60px;
      width: 386px;
      height: 849px;
    }
    &.vid-jy, &.vid-dy{
      width: 495px;
      height: 890px;
      top: 0;
      right: 0;
      background: #ffffff;
      box-shadow: 0px 15px 10px -15px rgba(0,0,0,0.2) inset;
    }
    &.vid-dy{
      padding: 0;
      background: #F8FAFC;
    }
    .ask {
      padding: 0 20px;
      margin-bottom: 12px;
      background: #ffffff;
      box-shadow: 0px 15px 10px -15px rgba(0,0,0,0.2) inset;
    }
    .others{
      padding: 0 20px;
    }
  }
  .vc-list{
    padding-bottom: 30px;
    padding-left: 30px;
    display: flex;
    align-items: center;
    img{
      @include wh(87, 48);
      margin-right: 20px;
      border-radius: 4px;
    }
    .c-info{
      h2{
        font-size: 16px;
        color: #E6E6E6;
      }
      p{
        font-size: 12px;
        color: $col999;
        margin-top: 8px;
      }
    }
  }
  .close-box{
    text-align: right;
    padding-top: 25px;
    padding-right: 23px;
    .close-icon{
      @include wh(12, 12);
      background: #f00;
    }
  }
  .texta {
    resize: none;
    width: 455px;
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
    text-align: right;
    // upload{
    //
    // }
    .ivu-upload-input{
      width: 100px!important;
      height: 40px!important;
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
  }

  .upload {
    display: inline-block;
    width: 22px;
    height: 18px;
    background-color: red;
    position: absolute;
    bottom: 26px;
    left: 361px;
  }

  .othq-item{
    padding: 15px 20px;
    margin-bottom: 10px;
    background: $colfff;
    box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.2);
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
</style>
