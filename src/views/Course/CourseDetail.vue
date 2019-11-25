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
          <div v-if="videoflag" class="video-object">
            <!-- <video style="position:absolute;left:0;top:0;z-index:999;" autoplay="autoplay" controls="controls" src="https://p.bokecc.com/flash/single/8E7175958932B212_FBBCC178D6FB98CC9C33DC5901307461_false_0CCEB0A89A516E59_1/player.swf" width="650" height="364">
              <source src="https://p.bokecc.com/flash/single/8E7175958932B212_FBBCC178D6FB98CC9C33DC5901307461_false_0CCEB0A89A516E59_1/player.swf" type="video/ogg" />
            </video> -->
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
        <p class="cdi-instr">{{isntroduction.description}}</p>
        <p class="cdi-teacher">讲师：{{isntroduction.teacher_name}}</p>
        <div class="cdi-type">
          <span v-if="isntroduction.vip_video == 1">VIP视频</span>
          <span v-if="isntroduction.vip_bank == 1">VIP题库</span>
          <span>有效期：{{isntroduction.study_days}}天</span>
        </div>
        <p class="cdi-buy-people">{{isntroduction.join_num}}人购买<span>{{isntroduction.play_num}}次播放</span></p>
        <p class="cdi-price"><em>¥</em>{{isntroduction.price}}</p>
        <div class="cdi-buy-consult">
          <button type="button" name="button" class="buy-btn" v-if="isntroduction.userstatus == 1" @click="goSeeVideo">立即观看</button>
          <button type="button" name="button" class="buy-btn" v-if="isntroduction.userstatus == 2" @click="goPay">立即购买</button>
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
            <course-list :package_id="package_id" :userstatus="isntroduction.userstatus"></course-list>
          </div>
        </div>
      </div>
      <div class="clt-else-info-r fr">
        <!-- 教师姓名 -->
        <teachers :teacehr="teacehr"></teachers>
        <!-- 学员心声 -->
        <students-voice></students-voice>
        <!-- 猜你喜欢 -->
        <like-list></like-list>
      </div>
    </div>
  </div>
</template>
<script>
import { courseIntroduction } from '@/api/class'
import courseList from '@/components/class/courseList.vue'
import teachers from '@/components/class/teachers.vue'
import studentsVoice from '@/components/class/studentsVoice.vue'
import likeList from '@/components/class/likeList.vue'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      package_id: parseInt(this.$route.query.package_id),
      isChoose: 'kcjj',
      teacehr: [], // 教师信息
      isntroduction: {}, // 课程简介
      videoflag: false,
      consultInfo: JSON.parse(window.sessionStorage.getItem('consultInfo')) || {} // 在线咨询
    }
  },
  components: {
    teachers,
    studentsVoice,
    likeList,
    courseList
    // payModal
  },
  computed: {
    ...mapState({
      token: state => state.user.token
    })
  },
  mounted () {
    this.getCourseIntroduction() // 课程简介
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    // 课程简介
    getCourseIntroduction () {
      courseIntroduction({
        package_id: this.package_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.isntroduction = res.data
          this.teacehr = res.data.teacehr
        } else {
          this.$Message.error(res.msg)
        }
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
      window.open(this.consultInfo.consult_href, '_blank')
    },
    goSeeVideo () {
      window.sessionStorage.setItem('userstatus', this.isntroduction.userstatus) // 是否购买
      this.$router.push({ path: '/course-video',
        query: {
          package_id: this.package_id
        }
      })
    },
    // 订单入库
    goPay () {
      if (!this.token) {
        this.$router.push({ path: '/login',
          query: {
            package_id: this.package_id,
            call_back: 'course-detail'
          }
        })
        return
      }
      this.getUserInfo().then(() => {
        this.$router.push({
          path: '/order-confirm',
          query: {
            package_id: this.package_id,
            is_live: 2 // 1直播订单、2课程订单、3图书订单4积分订单
          }
        })
      })
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
      margin: 0 10px;
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
      cursor: pointer;
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
      cursor: pointer;
      img{
        @include wh(40, 40);
        border-radius: 100%;
        margin-right: 10px;
      }
      span{
        width: 87%;
        height: 48px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
          border: 1px solid $blueColor;
          color: $blueColor;
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
      cursor: pointer;
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
</style>
