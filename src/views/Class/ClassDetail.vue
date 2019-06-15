<template>
  <div class="class-detail-wrap w-wrap">
    <div class="nav-title">
      <router-link to="/">首页</router-link><i>></i>
      <router-link to="/class">课程</router-link><i>></i>
      <span class="curren">{{isntroduction.name}}</span>
    </div>
    <div class="class-detail-info clearfix">
      <div class="cdi-wrap-l fl">
        <div class="cdi-video" @click="playVideo">
          <img class="cdi-img" :src="isntroduction.pc_img" alt="">
          <div class="cdi-opa">
            <p class="cdi-tit">{{isntroduction.name}}</p>
            <span class="cdi-play-btn"><i></i>免费试听</span>
            <div class="cdi-jieshao">
              <img :src="isntroduction.pc_img" alt="">
              <span>{{isntroduction.description}}</span>
            </div>
          </div>
        </div>
        <div class="cdi-special">
          特色服务：
          <span><i class="icon-server"></i>1对1服务</span>
          <span><i class="icon-answer"></i>在线答疑</span>
          <span><i class="icon-fanzhuan"></i>翻转课堂</span>
        </div>
      </div>
      <div class="cdi-wrap-r fr">
        <h2 class="cdi-tit">{{isntroduction.name}}</h2>
        <p class="cdi-instr">{{isntroduction.description}} 是否收到</p>
        <p class="cdi-teacher">讲师：{{isntroduction.teacher_name}}</p>
        <div class="cdi-type">
          <span>VIP视频</span>
          <span>VIP题库</span>
          <span>有效期：{{isntroduction.study_days}}天</span>
        </div>
        <p class="cdi-buy-people">{{isntroduction.join_num}}人购买<span>9993次播放</span></p>
        <p class="cdi-price"><em>¥</em>{{isntroduction.price}}</p>
        <div class="cdi-buy-consult">
          <button type="button" name="button" class="buy-btn">立即购买</button>
          <button type="button" name="button" class="consult-btn">在线咨询</button>
        </div>
      </div>
    </div>
    <div class="cl-three-wrap clearfix">
      <div class="clt-list-info-l fl">
        <div class="clt-tab">
          <span @click="tabChoose('kcjj')" :class="{'on': isChoose == 'kcjj'}">课程简介</span>
          <span @click="tabChoose('kjdg')" :class="{'on': isChoose == 'kjdg'}">课程大纲</span>
        </div>
        <div class="clt-main">
          <div class="clt-jianjie" v-show="isChoose == 'kcjj'">
            <img :src="isntroduction.brief_img" alt="" width="100%">
          </div>
          <div class="clt-kcdg" v-show="isChoose == 'kjdg'">
            <el-row class="tac">
              <el-col :span="24">
                <el-menu
                  default-active="2"
                  class="el-menu-vertical-demo" v-for="(item, index) in courseCatalogInfo" :key="index">
                  <div class="el-menu-title fsbold">
                    <i class="elt-icon elt-icon-01"></i>{{item.section_name}}
                  </div>
                  <!-- {{item.videos}} -->
                  <el-submenu index="1" v-for="(val, index) in item.videos" :key="index">
                    <template slot="title">
                      <i class="elt-icon elt-icon-02"></i>
                      <span>{{val.video_name}}</span>
                    </template>
                    <el-menu-item class="menu-item" index="1-1"><i class="elt-icon elt-icon-play"></i>选项1</el-menu-item>
                    <el-menu-item index="1-2"><i class="elt-icon elt-icon-stop"></i>选项2</el-menu-item>
                  </el-submenu>
                  <el-submenu index="2">
                    <template slot="title">
                      <i class="elt-icon elt-icon-02"></i>
                      <span>导航二</span>
                    </template>
                    <el-menu-item class="menu-item" index="1-1"><i class="elt-icon elt-icon-play"></i>选项1</el-menu-item>
                    <el-menu-item index="1-2"><i class="elt-icon elt-icon-stop"></i>选项2</el-menu-item>
                  </el-submenu>
                  <el-submenu index="3">
                    <template slot="title">
                      <i class="elt-icon elt-icon-02"></i>
                      <span>导航三</span>
                    </template>
                    <el-menu-item class="menu-item" index="1-1"><i class="elt-icon elt-icon-play"></i>选项1</el-menu-item>
                    <el-menu-item index="1-2"><i class="elt-icon elt-icon-stop"></i>选项2</el-menu-item>
                  </el-submenu>
                </el-menu>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="clt-else-info-r fr">
        <div class="course-main-right">
          <div class="like-title">
            <img class="tc-icon" src="@/assets/images/course/teacher-icon.png" alt="">
            <span>老师姓名</span>
          </div>
          <div class="cl-teacher">
            <img src="@/assets/images/course/like.png" alt="">
            <p>带困</p>
            <span>书山有路勤为径</span>
          </div>
          <div class="cl-t-detail">
            <p class="cl-t-tit">讲师简介：</p>
            <p class="cl-t-info">优财特约实战讲师；<br />
              资深财务管理顾问高级财务咨询顾问；<br />
              市金融与财务协会理事；<br />
              10年大型企业财务经理工作经验；<br />
              多年高级讲师及咨询师；</p>
          </div>
        </div>
        <div class="course-main-right course-main-student">
          <div class="like-title">
            <img class="stu-icon" src="@/assets/images/course/student-icon.png" alt="">
            <span>学员心声</span>
          </div>
        </div>
        <!-- 猜你喜欢 -->
        <like-list :isW="isW"></like-list>
      </div>
    </div>
  </div>
</template>
<script>
import { courseIntroduction, secvCatalog, courseCatalog } from '@/api/class'
import likeList from '@/components/likeList.vue'
export default {
  data () {
    return {
      isW: 278,
      isChoose: 'kcjj',
      isntroduction: {}, // 课程简介
      courseCatalogInfo: {} // 课程大纲（目录 章节）
    }
  },
  components: {
    likeList
  },
  computed: {

  },
  mounted () {
    this.getCourseIntroduction() // 课程简介
    this.getSecvCatalog() // 课程大纲（目录 章节）
    this.getCourseCatalog() // 不知道
  },
  methods: {
    // 课程简介
    getCourseIntroduction () {
      courseIntroduction({
        package_id: 2
      }).then(data => {
        const res = data.data
        this.isntroduction = res.data
      })
    },
    // 课程大纲(目录，章节)
    getSecvCatalog () {
      secvCatalog({
        course_id: this.$route.query.course_id
      }).then(data => {
        const res = data.data
        this.courseCatalogInfo = res.data
      })
    },
    // 不知道
    getCourseCatalog () {
      courseCatalog({
        package_id: 2
      }).then(data => {
        // const res = data.data
        // console.log(res)
      })
    },
    // tab切换 (课程简介 课程大纲)
    tabChoose (type) {
      this.isChoose = type
    },
    // 跳转到播放页面
    playVideo () {
      this.$router.push('/classVideo')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/scss/app";
  .nav-title{
    color: $col999;
    @include lh(44, 44);
    i{
      margin: 0 8px;
      font-family: Consolas,Menlo,Courier,monospace;
    }
    a{
      color: $col999;
      &:hover{
        color: $blueColor;
      }
    }
    span{
      color: $col666;
    }
  }
  .class-detail-wrap{
    padding-bottom: 19px;
    .class-detail-info{
      background: $colfff;
      border-radius:10px;
    }
  }
  .cdi-wrap-l{
    width: 650px;
    position: relative;
    .cdi-video{
      height: 364px;
      .cdi-img{
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
  .cdi-opa{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    height: 364px;
    color: $colfff;
    background:rgba(0,0,0,.5);
    .cdi-tit{
      font-size: 20px;
      padding: 22px 20px;
    }
    .cdi-play-btn{
      @include whl(130, 34, 34);
      border: 1px solid $colfff;
      border-radius: 17px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -75px;
      margin-top: -17px;
      text-align: center;
      i{
        @include wh(14, 16);
        @extend %bg-img;
        background-image: url('../../assets/images/course/video-icon.png');
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        margin-top: -3px;
      }
    }
    .cdi-jieshao{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      @include lh(48, 48);
      background: rgba(0, 0, 0, .67);
      padding: 0 20px;
      display: flex;
      align-items: center;
      img{
        @include wh(40, 40);
        border-radius: 100%;
        margin-right: 10px;
      }
      span{
        width: 87%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      &:after{
        position: absolute;
        content: '>';
        top: 0;
        right: 20px;
        font-size: 20px;
        margin-left: 10px;
      }
    }
  }
  .cdi-special{
    @include lh(47, 47);
    padding: 0 22px;
    span{
      color: $col666;
      margin-left: 36px;
      &:nth-child(1){
        margin-left: 29px;
      }
      i{
        @include wh(13, 16);
        display: inline-block;
        vertical-align: middle;
        margin-top: -3px;
        @extend %bg-img;
        margin-right: 10px;
        &.icon-server{
          background-image: url('../../assets/images/course/people-icon.png');
        }
        &.icon-answer{
          @include wh(14, 13);
          background-image: url('../../assets/images/course/new-icon.png');
        }
        &.icon-fanzhuan{
          @include wh(14, 14);
          background-image: url('../../assets/images/course/fanzhuan-icon.png');
        }
      }
    }
  }
  .cdi-wrap-r{
    width: 549px;
    padding: 30px 20px;
    box-sizing: border-box;
    .cdi-tit{
      font-size: 24px;
      font-weight:bold;
    }
    .cdi-instr{
      margin-top: 8px;
      margin-bottom: 12px;
      color: $col999;
      max-height: 40px;
      line-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .cdi-teacher{
      font-size: 16px;
    }
    .cdi-type{
      padding-top: 29px;
      padding-bottom: 16px;
      span{
        display: inline-block;
        padding: 8px 11px;
        background: #D2EEFF;
        border-radius: 4px;
        color: $blueColor;
        margin-right: 20px;
      }
    }
    .cdi-buy-people{
      color: $col666;
      span{
        margin-left: 21px;
      }
    }
    .cdi-price{
      padding-top: 34px;
      padding-bottom: 24px;
      font-size: 20px;
      font-weight:bold;
      color: #FF9B3A;
      em{
        font-size: 14px;
      }
    }
    .cdi-buy-consult{
      button{
        @include whl(130, 40, 40);
        border-radius: 20px;
        font-size: 18px;
        box-sizing: border-box;
        &.buy-btn{
          text-align: center;
          background: #FF9B3A;
          color: $colfff;
          margin-right: 20px;
        }
        &.consult-btn{
          border: 1px solid #0267FF;
          color: #0267FF;
        }
      }
    }
  }
  .clt-tab{
    @include lh(49, 49);
    span{
      padding: 0 21px;
      display: inline-block;
      &.on{
        color: $blueColor;
      }
    }
  }
  .clt-kcdg{
    width: 902px;
  }
  .clt-else-info-r{
    padding-top: 49px;
  }
  .course-main-right {
    width: 278px;
    padding: 0 9px;
    margin-bottom: 20px;
    background: $colfff;
    border-radius: 4px;
    box-sizing: border-box;
    .like-title{
      @include lh(39, 39);
      margin-bottom: 4px;
      img{
        @include wh(20, 20);
        margin-right: 7px;
        vertical-align: middle;
        margin-top: -3px;
      }
    }
  }
  .like-list {
    padding: 11px 0;
    @include display_flex(flex);
    @extend %alignitem_center;
    border-top: 1px solid $borderColor;
    box-sizing: border-box;
    img{
      @include wh(110, 60);
      border-radius:4px;
      margin-right: 7px;
      &.tc-icon{
        @include wh(16, 19);
      }
      &.stu-icon{
        @include wh(18, 18);
      }
    }
    .course-main-student &{
      img{
        width: 60px;
        border-radius: 100%;
      }
    }
  }
  .like-info {
    flex: 1;
    p{
      line-height: 20px;
      max-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 1;
      // &.col{
      //   color: $col999;
      //   font-size: 12px;
      //   margin-top: 7px;
      //   margin-bottom: 8px;
      // }
      // &.sl-txt{
      //   display: -webkit-box;
      //   -webkit-box-orient: vertical;
      //   overflow: hidden;
      //   -webkit-line-clamp: 1;
      //   max-height: 20px;
      // }
      // &.price{
      //   color: #FF9B3A;
      //   font-size: 16px;
      // }
      &.student-instr{
        max-height: 60px;
        -webkit-line-clamp: 3;
        color: $col999;
        font-size: 12px;
      }
    }
  }
  .cl-teacher{
    text-align: center;
    padding-top: 16px;
    padding-bottom: 14px;
    border-top: 1px solid $borderColor;
    border-bottom: 1px solid $borderColor;
    img{
      @include wh(80, 80);
      border-radius: 100%;
    }
    p{
      padding-top: 9px;
      padding-bottom: 7px;
    }
    span{
      color: $col999;
      font-size: 12px;
    }
  }
  .cl-t-detail{
    padding: 13px 0;
    .cl-t-tit{
      margin-bottom: 8px;
    }
    .cl-t-info{
      line-height: 20px;
      font-size: 12px;
      color: $col999;
    }
  }
  .el-menu{
    .el-submenu{
      border-bottom: 1px solid $borderColor;
      .el-menu-item{
        padding-left: 20px!important;
      }
    }
  }
  .el-menu-title, .el-submenu__title{
    line-height: 50px;
    padding-left: 20px;
    border-bottom: 1px solid $borderColor;
    &.fsbold{
      font-size: 16px;
      font-weight: bold;
    }
  }
  .elt-icon{
    display: inline-block;
    vertical-align: middle;
    margin-top: -3px;
    margin-right: 11px;
    @extend %bg-img;
    background-size: contain;
    &.elt-icon-01{
      @include wh(17, 16);
      margin-left: 2.5px;
      background-image: url('../../assets/images/course/neau-1.png');
    }
    &.elt-icon-02{
      @include wh(22, 22);
      background-image: url('../../assets/images/course/neau-2.png');
    }
    &.elt-icon-play, &.elt-icon-stop{
      @include wh(8, 12);
      margin-left: 7px;
      background-image: url('../../assets/images/course/play-icon.png');
    }
    &.elt-icon-stop{
      @include wh(10, 12);
      margin-left: 6px;
      background-image: url('../../assets/images/course/stop-icon.png');
    }
  }
</style>
