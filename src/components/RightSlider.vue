<template>
  <div class="r_slider" v-if="$route.meta.showRightSlider">
    <ul class="slider-list">
      <li class="try-item">
        <i class="r-icon"></i>
        <p class="r-txt">试听<br />课程</p>
        <div class="com-show r-try">
          <div class="com-btn" @click="freeGet">免费领取</div>
        </div>
      </li>
      <li class="service-item" v-if="consultInfo.status == 1">
        <i class="r-icon"></i>
        <p class="r-txt">客服</p>
        <div class="com-show r-service">
          <p class="r-time">{{consultInfo.work_time}}</p>
          <div class="com-btn" @click="serviceLink">咨询</div>
        </div>
      </li>
      <li class="hotline-item">
        <i class="r-icon"></i>
        <p class="r-txt">热线</p>
        <div class="com-show r-hotline">{{consultInfo.telephone}}</div>
      </li>
      <li class="weixin-item">
        <i class="r-icon"></i>
        <p class="t-weixin r-txt">微信</p>
        <div class="com-show r-weixin">
          <img class="ewm" :src="consultInfo.wx_code" alt="">
          <p>关注优财网校</p>
          <p>获得MAC最新咨询</p>
        </div>
      </li>
      <li class="qq-item">
        <i class="r-icon"></i>
        <p class="r-txt">QQ</p>
        <div class="com-show r-qq">
          <div class="com-btn" @click="goQq(1)">班主任群</div>
          <div class="com-btn" @click="goQq(2)">CMA群</div>
        </div>
      </li>
      <li class="go-top-item" @click="backTop">
        <i class="r-icon"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import { consult } from '@/api/index'
import { mapState } from 'vuex'
export default {
  name: 'RightSlider',
  data () {
    return {
      isRes: true,
      consultInfo: JSON.parse(window.localStorage.getItem('consultInfo')) || {}, // 在线咨询
      scrollTop: 0,
      btnFlag: false // 默认隐藏回到顶部
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    // window.addEventListener('scroll', this.scrollToTop)
    if (this.consultInfo.wx_code) {
      return
    }
    this.getConsult()
    // this.scrollToTop()
  },
  destroyed () {
    // window.removeEventListener('scroll', this.scrollToTop)
  },
  methods: {
    getConsult (val) {
      consult().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.consultInfo = res.data[0]
          window.localStorage.setItem('consultInfo', JSON.stringify(res.data[0]))
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    backTop () {
      let timer = setInterval(() => {
        let ispeed = Math.floor(-this.scrollTop / 5)
        document.documentElement.scrollTop = document.body.scrollTop = this.scrollTop + ispeed
        if (this.scrollTop === 0) {
          clearInterval(timer)
        }
      }, 16)
    },
    scrollToTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.scrollTop = scrollTop
      if (this.scrollTop > 100) {
        this.btnFlag = true
      } else {
        this.btnFlag = false
      }
    },
    serviceLink () {
      window.open(this.consultInfo.consult_href, '_blank')
    },
    goQq (type) {
      if (type === 1) {
        let teacHref = 'https://wpa.qq.com/msgrd?v=3&uin=' + this.consultInfo.teacher_qq + '&site=qq&menu=yes'
        window.open(teacHref, '_blank')
      }
      if (type === 2) {
        let cmaHref = 'https://shang.qq.com/wpa/qunwpa?idkey=e33037fc4880b2d99424c556bc769a8f15c7793538ff38e32a581a7dc55debd2'
        window.open(cmaHref, '_blank')
      }
    },
    // 免费领取
    freeGet () {
      if (!this.token) {
        this.$router.push({ path: '/login',
          query: {
            type: 'login',
            is_forget: 'log-reg'
          }
        })
        return
      }
      this.$router.push('/class')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../assets/scss/app";
  .r_slider{
    width: 50px;
    position: fixed;
    top: 180px;
    right: 0;
    z-index: 13;
    background: rgba(0,0,0,.5);
  }
  .slider-list {
    li{
      position: relative;
      text-align: center;
      padding: 12.5px 0;
      color: $colfff;
      &:hover{
        cursor: pointer;
        background: $blueColor;
      }
      .r-txt {
        margin-top: 2px;
        line-height: 18px;
      }
    }
  }
  .r-icon{
    .try-item &{
      @include bg_img(30, 30, '../assets/images/fixed/try.png');
    }
    .service-item &{
      @include bg_img(20, 20, '../assets/images/fixed/service.png');
    }
    .hotline-item &{
      @include bg_img(20, 20, '../assets/images/fixed/line.png');
    }
    .weixin-item &{
      @include bg_img(23, 23, '../assets/images/fixed/iweixin.png');
    }
    .qq-item &{
      @include bg_img(23, 23, '../assets/images/fixed/QQ.png');
    }
    .go-top-item &{
      @include bg_img(30, 30, '../assets/images/fixed/top.png');
    }
  }
  .com-show {
    width: 139px;
    padding: 16px 0;
    text-align: center;
    position: absolute;
    top: 0;
    right: 50px;
    color: #666666;
    background: #ffffff;
    display: none;
    &.r-try{
      top: 21.5px;
    }
    &.r-service{
      top: -15px;
    }
    &.r-hotline{
      top: 9.5px;
    }
    &.r-weixin{
      top: -42.5px;
    }
    &.r-qq{
      top: -12px;
    }
    p{
      line-height: 20px;
    }
    .ewm {
      width: 75px;
      height: 75px;
      margin-bottom: 6px;
    }
  }
  .r-service{
    .r-time{
      width: 65%;
      margin: 0 auto;
    }
  }
  .com-btn {
    width: 79px;
    height: 19px;
    line-height: 19px;
    background: $blueColor;
    border-radius: 10px;
    font-size: 12px;
    color: #ffffff;
    display: inline-block;
    margin-top: 6px;
    cursor: pointer;
    .r-try &{
      margin-top: 0;
    }
    .r-qq &{
      margin: 6px 0;
    }
  }
  .try-item,.service-item,.hotline-item,.weixin-item,.qq-item{
    &:hover{
      .com-show{
        display: block;
      }
    }
  }
</style>
