<template>
  <div class="preview-detail-wrap w-wrap">
    <div class="nav-title">
      <!-- <router-link to="/education">后续教育</router-link><i>></i> -->
      <router-link to="/education">课程预告</router-link><i>></i>
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
        <div class="cdi-type">
          <span>CPE积分：{{isntroduction.cpe}}分</span>
        </div>
        <p class="cdi-time">{{start_time}}-{{end_time}}</p>
        <p class="cdi-map">{{isntroduction.activity_address}}</p>
        <p class="cdi-sign"><span>已报名{{isntroduction.num}}人</span>/限{{isntroduction.people_num}}人报名</p>
        <div class="cdi-buy-consult">
          <button type="button" name="button" class="sign-btn" v-if="isntroduction.time_type == 1 && isntroduction.user_type == 1">我要报名</button>
          <button type="button" name="button" class="sign-btn gray" v-if="isntroduction.time_type == 1 && isntroduction.user_type == 2">您已报名</button>
          <button type="button" name="button" class="sign-btn gray" v-if="isntroduction.time_type == 2 && isntroduction.user_type == 1">已过期</button>
          <button type="button" name="button" class="sign-btn gray" v-if="isntroduction.time_type == 2 && isntroduction.user_type == 2">您已报名</button>
        </div>
      </div>
    </div>
    <div class="cl-three-wrap clearfix">
      <div class="clt-list-info-l fl">
        <div class="clt-tab">
          <span>课程简介</span>
        </div>
        <div class="clt-main">
          <img :src="isntroduction.content" alt="" width="100%">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { previewDetails } from '@/api/education'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      preview_id: this.$route.query.preview_id,
      isntroduction: {
        start_time: '',
        end_time: ''
      }
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      token: state => state.user.token,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    }),
    start_time () {
      return this.isntroduction.start_time.replace(/-/g, '.')
    },
    end_time () {
      return this.isntroduction.end_time.replace(/-/g, '.')
    }
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.getpreviewDetails() // 课程简介
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getpreviewDetails() // 课程简介
      })
    }
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    // 课程简介
    getpreviewDetails () {
      previewDetails({
        user_id: this.user_id,
        preview_id: this.preview_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.isntroduction = res.data
        } else {
          this.$Message.error(res.msg)
        }
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
  .preview-detail-wrap{
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
    padding: 40px 26px;
    box-sizing: border-box;
    .cdi-tit{
      font-size: 24px;
      font-weight:bold;
    }
    .cdi-type{
      padding-top: 9px;
      padding-bottom: 40px;
      span{
        display: inline-block;
        padding: 8px 11px;
        background: #D2EEFF;
        border-radius: 4px;
        color: $blueColor;
        margin-right: 20px;
      }
    }
    .cdi-time,.cdi-map,.cdi-sign{
      padding-left: 31px;
      height: 30px;
      line-height: 30px;
      background-repeat: no-repeat;
      background-position: left center;
      span{
        color: $blueColor;
      }
    }
    .cdi-time{
      background-image: url('../../assets/images/education/time.png');
      background-size: 17px 17px;
    }
    .cdi-map{
      background-image: url('../../assets/images/education/map.png');
      background-size: 15px 20px;
    }
    .cdi-sign{
      background-image: url('../../assets/images/education/people.png');
      background-size: 21px 17px;
    }
    .cdi-buy-consult{
      padding-top: 50px;
      button{
        @include whl(110, 30, 30);
        border-radius: 15px;
        font-size: 16px;
        box-sizing: border-box;
        &.sign-btn{
          text-align: center;
          background: #FF9B3A;
          color: $colfff;
          margin-right: 20px;
        }
        &.gray{
          background: $col999;
        }
      }
    }
  }
  .clt-main{
    width: 902px;
    padding: 20px;
    border-radius: 4px;
    box-sizing: border-box;
    background: #ffffff;
  }
  .clt-tab{
    padding-top: 44px;
    padding-bottom: 16px;
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
</style>
