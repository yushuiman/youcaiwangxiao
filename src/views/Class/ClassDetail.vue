<template>
  <div class="class-detail-wrap w-wrap">
    <div class="nav-title">
      <router-link to="/">首页</router-link><i>></i>
      <router-link to="/class">课程</router-link><i>></i>
      <span class="curren">{{isntroduction.name}}</span>
    </div>
    <div class="class-detail-info clearfix">
      <div class="cdi-wrap-l fl">
        <div class="cdi-video" @click="playVideo()">
          <img class="cdi-img" :src="isntroduction.pc_img" alt="">
          <div class="cdi-opa">
            <p class="cdi-tit">{{isntroduction.name}}</p>
            <span class="cdi-play-btn"><i></i>免费试听</span>
            <div class="cdi-jieshao">
              <img :src="isntroduction.pc_img" alt="">
              <span>{{isntroduction.description}}</span>
            </div>
          </div>
          <div v-if="videoflag" class="video-object">
            <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="650" height="364" id="cc_FBBCC178D6FB98CC9C33DC5901307461">
              <param name="movie" value="https://p.bokecc.com/flash/single/8E7175958932B212_FBBCC178D6FB98CC9C33DC5901307461_false_0CCEB0A89A516E59_1/player.swf" />
              <param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" />
              <param value="transparent" name="wmode" />
              <embed src="https://p.bokecc.com/flash/single/8E7175958932B212_FBBCC178D6FB98CC9C33DC5901307461_false_0CCEB0A89A516E59_1/player.swf" width="650" height="364" name="cc_FBBCC178D6FB98CC9C33DC5901307461" allowFullScreen="true" wmode="transparent" allowScriptAccess="always" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"/>
            </object>
          </div>
        </div>
        <div class="cdi-special">
          特色服务：
          <span><i class="icon-server"></i>1对1服务</span>
          <span v-if="isntroduction.line_answer == 1"><i class="icon-answer"></i>在线答疑</span>
          <span v-if="isntroduction.is_overclass == 1"><i class="icon-fanzhuan"></i>翻转课堂</span>
        </div>
      </div>
      <div class="cdi-wrap-r fr">
        <h2 class="cdi-tit">{{isntroduction.name}}</h2>
        <p class="cdi-instr">{{isntroduction.description}} 是否收到</p>
        <p class="cdi-teacher">讲师：{{isntroduction.teacher_name}}</p>
        <div class="cdi-type">
          <span v-if="isntroduction.vip_video == 1">VIP视频</span>
          <span v-if="isntroduction.vip_bank == 1">VIP题库</span>
          <span>有效期：{{isntroduction.study_days}}天</span>
        </div>
        <p class="cdi-buy-people">{{isntroduction.join_num}}人购买<span>9993次播放</span></p>
        <p class="cdi-price"><em>¥</em>{{isntroduction.price}}</p>
        <div class="cdi-buy-consult">
          <button type="button" name="button" class="buy-btn">立即购买</button>
          <button type="button" name="button" class="consult-btn" @click="consultLink">在线咨询</button>
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
            <course-list :course_id="this.$route.query.course_id"></course-list>
          </div>
        </div>
      </div>
      <div class="clt-else-info-r fr">
        <div class="course-main-right">
          <div class="like-title">
            <img class="tc-icon" src="@/assets/images/course/teacher-icon.png" alt="">
            <span>老师姓名</span>
          </div>
          <swiper :options="swiperOptionRec">
            <swiper-slide v-for="(item, index) in teacehr" :key="index">
              <div class="cl-teacher">
                <img :src="item.pictrue" alt="">
                <p>{{item.teacher_name}}</p>
                <span>{{item.teacher_title}}</span>
              </div>
              <div class="cl-t-detail">
                <p class="cl-t-tit">讲师简介：</p>
                <p class="cl-t-info">{{item.introduce}}</p>
              </div>
            </swiper-slide>
          </swiper>
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
import 'swiper/dist/css/swiper.css'
import { courseIntroduction } from '@/api/class'
import courseList from '@/components/class/courseList.vue'
import likeList from '@/components/common/likeList.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  data () {
    return {
      isW: 278,
      isChoose: 'kcjj',
      isntroduction: {}, // 课程简介
      teacehr: [], // 教师信息
      swiperOptionRec: {
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        loop: true
      },
      videoflag: false
    }
  },
  components: {
    likeList,
    courseList,
    swiper,
    swiperSlide
  },
  computed: {
  },
  mounted () {
    this.getCourseIntroduction() // 课程简介
  },
  methods: {
    // 课程简介
    getCourseIntroduction () {
      courseIntroduction({
        package_id: this.$route.query.course_id
      }).then(data => {
        const res = data.data
        this.isntroduction = res.data
        this.teacehr = res.data.teacehr
      })
    },
    // tab切换 (课程简介 课程大纲)
    tabChoose (type) {
      this.isChoose = type
    },
    playVideo () {
      this.videoflag = true
    },
    consultLink () {
      window.open('https://awt.zoosnet.net/LR/Chatpre.aspx?id=AWT95637580&cid=1453186017984561518698&lng=cn&sid=1519874658448243043282&p=http%3A//www.ucfo.com.cn/&rf1=&rf2=&e=%25u6765%25u81EA%25u9996%25u9875%25u81EA%25u52A8%25u9080%25u8BF7%25u7684%25u5BF9%25u8BDD&msg=&d=1519874661546', '_blank')
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
  .cdi-opa,.video-object{
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
        height: 48px;
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
  .clt-main{
    width: 902px;
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
    background: $colfff;
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
  // .swiper-button-prev, .swiper-button-next{
  //   width: 17px;
  //   height: 28px;
  //   background-size: contain;
  // }
</style>
