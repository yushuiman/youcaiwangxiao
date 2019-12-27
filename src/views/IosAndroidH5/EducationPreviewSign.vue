<template>
  <div class="education-preview-wrap">
    <div class="education-preview-pb">
      <img class="cdi-img" :src="isntroduction.app_img" alt="" width="100%">
      <div class="edu-preview-fmt edu-com-sty">
        <h1>{{isntroduction.name}}</h1>
        <p>CPE积分：{{isntroduction.cpe}}分</p>
      </div>
      <div class="edu-preview-info edu-com-sty">
        <p class="cdi-time">{{start_time}}-{{end_time}}</p>
        <p class="cdi-map">{{isntroduction.activity_address}}</p>
        <p class="cdi-sign"><span>已报名{{isntroduction.num}}人</span>/限{{isntroduction.people_num}}人报名</p>
      </div>
      <div class="edu-preview-tec edu-com-sty">
        <p class="tit">讲师简介</p>
        <ul class="tc-list">
          <li class="tec-item" v-for="v in isntroduction.teacehr_list" :key="v.id">
            <img :src="v.pictrue" alt="" class="tec-head">
            <div class="tec-insr">
              <p>{{v.teacher_name}}</p>
              <span>{{v.teacher_title}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="edu-preview-instr edu-com-sty">
        <p class="tit">课程介绍</p>
        <img :src="isntroduction.content" alt="" width="100%">
      </div>
    </div>
    <div class="edu-sign-box">
      <span class="sign-btn" v-if="isntroduction.time_type == 1 && isntroduction.user_type == 1">我要报名</span>
      <span class="sign-btn gray" v-if="isntroduction.time_type == 1 && isntroduction.user_type == 2">您已报名</span>
      <span class="sign-btn gray" v-if="isntroduction.time_type == 2 && isntroduction.user_type == 1">已过期</span>
      <span class="sign-btn gray" v-if="isntroduction.time_type == 2 && isntroduction.user_type == 2">您已报名</span>
    </div>
    <div>
      
    </div>
  </div>
</template>
<script>
import { previewDetailsApp } from '@/api/education'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      user_id: this.$route.query.user_id,
      preview_id: this.$route.query.preview_id,
      isntroduction: {
        start_time: '',
        end_time: ''
      }
    }
  },
  computed: {
    start_time () {
      return this.isntroduction.start_time.replace(/-/g, '.')
    },
    end_time () {
      return this.isntroduction.end_time.replace(/-/g, '.')
    }
  },
  mounted () {
    this.getpreviewDetails() // 课程简介
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    // 课程简介
    getpreviewDetails () {
      previewDetailsApp({
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
  .education-preview-wrap{
    color: #333333;
  }
  .education-preview-pb{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 1.2rem;
    overflow-y: scroll;
    width: 100%;
    height: auto;
    -webkit-overflow-scrolling: touch;   /*这句是为了滑动更顺畅*/
  }
  .cdi-img{
    display: block;
  }
  .edu-com-sty{
    background: #ffffff;
    margin-bottom: .266667rem;
    padding: 0 .32rem;
  }
  .edu-preview-fmt{
    padding-top: .36rem;
    padding-bottom: .266667rem;
    h1{
      @include font-dpr(34);
      line-height: .64rem;
    }
    p{
      color: #0267FF;
      line-height: .493333rem;
      @include font-dpr(26);
      margin-top: .106667rem;
    }
  }
  .edu-preview-info{
    padding: .2rem .32rem;
    p{
      height: .533333rem;
      line-height: .533333rem;
      margin: .066667rem 0;
      padding-left: .613333rem;
      @include font-dpr(28);
      color: #999999;
      background-repeat: no-repeat;
      background-position: left center;
      &.cdi-time{
        background-image: url('../../assets/images/education/time.png');
        background-size: .36rem .36rem;
      }
      &.cdi-map{
        background-image: url('../../assets/images/education/map.png');
        background-size:.32rem .44rem;
      }
      &.cdi-sign{
        background-image: url('../../assets/images/education/people.png');
        background-size: .413333rem .333333rem;
      }
      span{
        color: #0267FF;
      }
    }
  }
  .edu-preview-tec,.edu-preview-instr{
    .tit{
      @include font-dpr(32);
      font-weight: 500;
      height: 1.066667rem;
      line-height: 1.066667rem;
      @include border_color(#E6E6E6);
    }
  }
  .edu-preview-instr{
    padding-bottom: .266667rem;
    img{
      display: block;
      margin-top: .533333rem;
    }
  }
  .tec-item{
    padding: .506667rem 0;
    @include border_color(#E6E6E6);
    display: flex;
    align-items: center;
    &:last-child{
      &:after{
        border: 0;
        background-color: transparent;
      }
    }
    .tec-head{
      width: 1.333333rem;
      height: 1.333333rem;
      border-radius: 100%;
      margin-right: .333333rem;
    }
    .tec-insr{
      flex: 1;
      p{
        @include font-dpr(30);
        height: .56rem;
        line-height: .56rem;
      }
      span{
        @include font-dpr(26);
        color: #999999;
        margin-top: .08rem;
        line-height: .493333rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
      }
    }
  }
  .edu-sign-box{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size:.4rem;
    text-align: center;
    span{
      width: 100%;
      height: 100%;
      color: #ffffff;
      display: block;
      background: url('../../assets/images/education/btn-bg.png') no-repeat center;
      background-size: 100% 100%;
      &.gray{
        background: url('../../assets/images/education/btn-gray-bg.png') no-repeat center;
        background-size: 100% 100%;
      }
    }
  }
</style>
