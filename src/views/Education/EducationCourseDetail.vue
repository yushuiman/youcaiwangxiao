<template>
  <div class="class-detail-wrap w-wrap">
    <div class="nav-title">
      <router-link to="/education">后续教育</router-link><i>></i>
      <router-link :to="{path:'/education-course-list', query: {type_id: type_id}}">课程</router-link><i>></i>
      <span class="curren">{{isntroduction.name}}</span>
    </div>
    <div class="class-detail-info clearfix">
      <div class="cdi-wrap-l fl">
        <div class="cdi-video">
          <img class="cdi-img" :src="isntroduction.pc_img" alt="">
        </div>
      </div>
      <div class="cdi-wrap-r fr">
        <h2 class="cdi-tit">{{isntroduction.name}}</h2>
        <p class="cdi-instr">{{isntroduction.description}}</p>
        <p class="cdi-teacher">讲师：{{isntroduction.teacher_name}}</p>
        <div class="cdi-type">
          <span>CPE积分：{{isntroduction.cpe_integral}}分</span>
        </div>
        <p class="cdi-buy-people">{{isntroduction.buy_num}}人购买<span>{{isntroduction.join_num}}次播放</span></p>
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
          <span @click="tabChoose('kczx')" :class="{'on': isChoose == 'kczx'}">课程咨询</span>
          <span @click="tabChoose('qxfw')" :class="{'on': isChoose == 'qxfw'}">七星服务</span>
        </div>
        <div class="clt-main">
          <div class="clt-jianjie" v-show="isChoose == 'kcjj'">
            <img :src="isntroduction.brief_img" alt="" width="100%">
          </div>
          <div class="clt-kcdg" v-show="isChoose == 'kjdg'">
            <course-list :package_id="package_id" :type_id="type_id" :userstatus="isntroduction.userstatus"></course-list>
          </div>
          <div class="clt-jianjie" v-show="isChoose == 'kczx'">
            <div v-html="isntroduction.consult"></div>
          </div>
          <div class="clt-jianjie" v-show="isChoose == 'qxfw'">
            <div v-html="isntroduction.seven_serve"></div>
          </div>
        </div>
      </div>
      <div class="clt-else-info-r fr">
        <!-- 猜你喜欢 -->
        <like-list></like-list>
      </div>
    </div>
  </div>
</template>
<script>
import { courseIntroduction } from '@/api/education'
import courseList from '@/components/education/courseList.vue'
import likeList from '@/components/education/likeList.vue'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      type_id: this.$route.query.type_id,
      package_id: this.$route.query.package_id,
      isChoose: 'kcjj',
      isntroduction: {}, // 课程简介
      consultInfo: JSON.parse(window.sessionStorage.getItem('consultInfo')) || {} // 在线咨询
    }
  },
  components: {
    likeList,
    courseList
    // payModal
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      token: state => state.user.token,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
    if (!this.token) {
      this.getCourseIntroduction() // 课程简介
      return
    }
    if (this.isLoadHttpRequest) {
      this.getCourseIntroduction() // 课程简介
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getCourseIntroduction() // 课程简介
      })
    }
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    // 课程简介
    getCourseIntroduction () {
      this.showLoading(true)
      courseIntroduction({
        user_id: this.user_id || '',
        package_id: this.package_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.isntroduction = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // tab切换 (课程简介 课程大纲)
    tabChoose (type) {
      this.isChoose = type
    },
    consultLink () {
      window.open(this.consultInfo.consult_href, '_blank')
    },
    goSeeVideo () {
      window.sessionStorage.setItem('userstatus', this.isntroduction.userstatus) // 是否购买
      this.$router.push({ path: '/education-video',
        query: {
          package_id: this.package_id,
          type_id: this.type_id
        }
      })
    },
    // 订单入库
    goPay () {
      if (!this.token) {
        this.$router.push({ path: '/login',
          query: {
            package_id: this.package_id,
            type_id: this.type_id,
            call_back: 'education-course-detail'
          }
        })
        return
      }
      this.getUserInfo().then(() => {
        this.$router.push({
          path: '/order-confirm',
          query: {
            package_id: this.package_id,
            is_live: 5 // 1直播订单、2课程订单、3图书订单4积分订单5后续教育
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
      height: 34px;
      line-height: 17px;
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
        @include whl(110, 30, 30);
        border-radius: 15px;
        font-size: 16px;
        box-sizing: border-box;
        background: none;
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
    img{
      width: 100%;
    }
  }
  .clt-tab{
    @include lh(49, 49);
    span{
      font-size: 16px;
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
  }
  .clt-else-info-r{
    padding-top: 49px;
  }
</style>
