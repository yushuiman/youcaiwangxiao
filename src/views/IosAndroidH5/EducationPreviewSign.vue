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
          <li class="tec-item" v-for="v in isntroduction.teacehr_list" :key="v.id" @click="teacClkInfo(v)">
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
      <span class="sign-btn" v-if="isntroduction.time_type == 1 && isntroduction.user_type == 1" @click="signEduPreview">我要报名</span>
      <span class="sign-btn gray" v-if="isntroduction.time_type == 1 && isntroduction.user_type == 2">您已报名</span>
      <span class="sign-btn gray" v-if="isntroduction.time_type == 2 && isntroduction.user_type == 1">已过期</span>
      <span class="sign-btn gray" v-if="isntroduction.time_type == 2 && isntroduction.user_type == 2">您已报名</span>
    </div>
    <span class="ts-succ" v-if="tsSucc">报名成功～</span>
    <div class="edu-sign-popup" v-if="visible">
      <div class="opa"></div>
      <div class="preview-sign-modal">
        <div class="sign-info">
          <input class="bm-name" type="text" maxlength="10" v-model="signName" @blur="onblur" placeholder="姓名">
          <input class="bm-phone" type="text" maxlength="11" v-model="signMobile" @blur="onblur" placeholder="电话">
          <p>{{tsError}}</p>
          <button class="btn-com" @click="previewSign">确定</button>
        </div>
        <span class="close-icon" @click="closeSign">X</span>
      </div>
    </div>
    <div class="edu-teacher-popup" v-if="tacVisible">
      <div class="opa"></div>
      <div class="teac-modal">
        <div class="teac-info">
          <img :src="teacInfo.pictrue" alt="" class="tec-head">
          <p class="t-name">{{teacInfo.teacher_name}}</p>
          <p class="t-touxie">{{teacInfo.teacher_title}}</p>
          <p class="t-instr">{{teacInfo.longevity}}</p>
        </div>
        <span class="close-icon" @click="closeSign">X</span>
      </div>
    </div>
  </div>
</template>
<script>
import { previewDetailsApp, activityUserApp } from '@/api/education'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      user_id: this.$route.query.user_id,
      preview_id: this.$route.query.preview_id,
      isntroduction: {
        start_time: '',
        end_time: ''
      },
      signMobile: '', // 课程预告报名手机号
      signName: '', // 课程预告报名名字
      previewCourseList: [], // 课程预告
      visible: false, // 课程预告报名
      tsError: '',
      tsSucc: false,
      timer: null,
      tacVisible: false,
      teacInfo: {}
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
    onblur () {
      window.scroll(0, 0)
    },
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
    },
    teacClkInfo (v) {
      this.tacVisible = true
      this.teacInfo = v
    },
    // 报名
    signEduPreview () {
      if (this.isntroduction.href_type === 1) {
        window.open(this.isntroduction.activity_address, '_blank')
        return
      }
      this.visible = true
    },
    closeSign () {
      this.tacVisible = false
      this.visible = false
      this.signName = ''
      this.signMobile = ''
      this.tsError = ''
    },
    previewSign () {
      if (this.signName === '' || this.signMobile === '') {
        this.tsError = '姓名，电话不能为空～'
        return
      }
      // if (this.signName.length < 2 || this.signName.length > 10) {
      //   this.tsError = '请输入2-10位姓名字符～'
      //   return
      // }
      const reg = /^[1]([3-9])[0-9]{9}$/
      if (!(reg.test(this.signMobile))) {
        this.tsError = '该手机号不符合格式'
        return false
      }
      activityUserApp({
        preview_id: this.preview_id,
        user_name: this.signName,
        mobile: this.signMobile,
        user_id: this.user_id
      }).then((data) => {
        const res = data.data
        if (res.code === 200) {
          if (res.data.status === 1) {
            this.getpreviewDetails()
            this.signName = ''
            this.signMobile = ''
            this.tsError = ''
            this.visible = false
            this.tsSucc = true
            let countTime = 3
            this.timer = setInterval(() => {
              countTime--
              if (countTime < 1) {
                this.tsSucc = false
                clearInterval(this.timer)
              }
            }, 1000)
          }
        } else {
          this.tsError = res.msg
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
      margin-top: .133333rem;
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
  // 我要报名
  .edu-sign-popup .opa, .edu-teacher-popup .opa{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.6);
    z-index: 2;
  }
  .preview-sign-modal,.teac-modal{
    text-align: center;
    position: fixed;
    width: 70%;
    left: 50%;
    top: 50%;
    z-index: 3;
    border-radius: .106667rem;
    transform: translate(-50%, -50%);
    .sign-info,.teac-info{
      background: #ffffff;
      border-radius: .106667rem;
      padding: .266667rem .533333rem;
      @include font-dpr(28);
      text-align: center;
    }
  }
  .sign-info{
    input{
      width: 100%;
      display: block;
      margin: .266667rem auto;
      height: .8rem;
      text-indent: .08rem;
      background: rgba(245, 245, 245, 1);
      border-radius: .053333rem;
      border: 1px solid rgba(220, 220, 220, 1);
      outline: none;
      -webkit-appearance: none;
      &:nth-child(2){
        margin-bottom: .066667rem!important;
      }
    }
    button{
      width: 2.133333rem;
      height: .8rem;
      background: #0267FF;
      color: #ffffff;
      margin: .266667rem auto;
      border-radius: .106667rem;
      @include font-dpr(28);
    }
    p{
      height: .4rem;
      @include font-dpr(24);
      text-align: left;
      color: red;
    }
  }
  .teac-info{
    // text-align: left;
    @include font-dpr(24);
    line-height: .4rem;
    color: #999999;
    img{
      display: block;
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 100%;
      margin: 0 auto;
      margin-top: -1.066667rem;
    }
    .t-name,.t-touxie{
      margin: .266667rem 0;
    }
    .t-instr{
      text-align: left;
    }
  }
  .close-icon{
    width: .8rem;
    height: .8rem;
    line-height: .8rem;
    border-radius: 50%;
    display: inline-block;
    margin: 0 auto;
    margin-top: 1.333333rem;
    border: 1px solid #ffffff;
    text-align: center;
    color: #ffffff;
    @include font-dpr(32);
    border-radius: 50%;
  }
  .ts-succ{
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    color: #ffffff;
    @include font-dpr(28);
    background: rgba(0,0,0,0.6);
    padding: .133333rem .266667rem;
    border-radius: .053333rem;
    z-index: 232;
  }
</style>
