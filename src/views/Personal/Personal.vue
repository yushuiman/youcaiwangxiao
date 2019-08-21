<template>
    <div class="user-wrap">
      <div class="user-top-wrap">
        <div class="w-wrap">
          <div class="integral-signin">{{personalInfo.integral}}积分<span @click="getLearnClock">签到</span></div>
          <div class="user-flex">
            <div class="user-info">
              <img :src="personalInfo.head" alt="头像" class="head-logo" @click="setBaseInfo">
              <div class="user-name-instr">
                <h2>{{personalInfo.username}}</h2>
                <p>您已入学<span>{{personalInfo.day}}</span>天啦！</p>
              </div>
            </div>
            <div class="go-on-some">
              <a class="zhibo"><Icon type="ios-play" />最近直播</a>
              <a>继续学习</a>
              <a>继续做题</a>
            </div>
          </div>
        </div>
      </div>
      <!-- main -->
      <div class="user-main w-wrap">
        <div class="userm-left">
          <ul class="userm-list">
            <li class="userm-item" :class="['userm-item-0' + (index+1), {'curren': clkTit == v.type}]" v-for="(v, index) in userArr" :key="index" @click="switchInfo(v, index)">
              <i class="userm-icon"></i>{{v.tit}}
            </li>
          </ul>
        </div>
        <div class="userm-right">
          <course-info v-if="clkTit == 'course'" :user_id="user_id"></course-info>
          <questions-info v-if="clkTit == 'questions'" :user_id="user_id"></questions-info>
          <zhibo-info v-if="clkTit == 'zhibo'" :user_id="user_id"></zhibo-info>
          <answer-info v-if="clkTit == 'answer'" :user_id="user_id"></answer-info>
          <order-info v-if="clkTit == 'order'" :user_id="user_id"></order-info>
          <account-info v-if="clkTit == 'account'" :user_id="user_id"></account-info>
          <set-info v-if="clkTit == 'set'" :personalInfo="personalInfo" :user_id="user_id" @getPersonalInfo="getPersonalInfo"></set-info>
        </div>
      </div>
    </div>
</template>

<script>
import courseInfo from '../../components/personal/courseInfo'
import questionsInfo from '../../components/personal/questionsInfo'
import zhiboInfo from '../../components/personal/zhiboInfo'
import answerInfo from '../../components/personal/answerInfo'
import orderInfo from '../../components/personal/orderInfo'
import accountInfo from '../../components/personal/accountInfo'
import setInfo from '../../components/personal/setInfo'
import { getPersonal, learnClock } from '@/api/personal'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      userArr: [
        {
          type: 'course',
          tit: '课程'
        },
        {
          type: 'questions',
          tit: '题库'
        },
        {
          type: 'zhibo',
          tit: '直播'
        },
        {
          type: 'answer',
          tit: '答疑'
        },
        {
          type: 'order',
          tit: '订单'
        },
        {
          type: 'account',
          tit: '账号'
        }
      ],
      clkTit: window.sessionStorage.getItem('type') || 'course',
      personalInfo: {}, // 个人信息
      learnClockInfo: {} // 签到打卡
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
      // clkTit: state => state.nav.clkTit
    })
  },
  components: {
    courseInfo,
    questionsInfo,
    zhiboInfo,
    answerInfo,
    orderInfo,
    accountInfo,
    setInfo
  },
  mounted () {
    this.getPersonalInfo()
  },
  methods: {
    switchInfo ({ type }, index) {
      this.clkTit = type
      window.sessionStorage.setItem('type', type)
    },
    setBaseInfo () {
      if (this.clkTit === 'news') {
        return
      }
      this.clkTit = 'set'
      window.sessionStorage.setItem('clkTit', 'set')
    },
    // 用户信息
    getPersonalInfo () {
      getPersonal({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.personalInfo = res.data
          this.personalInfo.address.forEach(v => {
            v.flag = false
            v.value = '设置默认地址'
            if (v.is_default === 1) {
              v.value = '取消默认地址'
            }
          })
          let obj = {
            username: this.personalInfo.username,
            head: this.personalInfo.head,
            sex: this.personalInfo.sex
          }
          window.sessionStorage.setItem('personalInfo', JSON.stringify(obj))
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 签到打卡
    getLearnClock () {
      learnClock({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.learnClockInfo = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    window.sessionStorage.removeItem('selIdxCourse')
    window.sessionStorage.removeItem('selIdxQuestion')
    window.sessionStorage.removeItem('selIdxAnswer')
    window.sessionStorage.removeItem('selIdxOrder')
    window.sessionStorage.removeItem('selIdxAccount')
    next()
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  @import "../../assets/scss/personal.css";
  .user-top-wrap{
    font-size: 18px;
    height: 206px;
    background: #112441 url('../../assets/images/user/user-top-bg.jpg') repeat center;
    background-size: 349px 167px;
    color: #ffffff;
    padding-top: 30px;
    padding-bottom: 24px;
    .w-wrap{
      position: relative;
    }
  }
  .integral-signin{
    text-align: right;
    line-height: 33px;
    span{
      width: 72px;
      height: 33px;
      text-align: center;
      display: inline-block;
      border-radius: 17px;
      margin-left: 16px;
      background: $colfff;
      color: #112441;
      cursor: pointer;
    }
  }
  .user-flex{
    @include flexJustifyAlignItem;
    position: absolute;
    width: 100%;
    top: 60px;
  }
  .user-info{
    @include flexJustifyAlignItem;
    .head-logo{
      width: 142px;
      height: 142px;
      border: 4px solid $colfff;
      border-radius: 50%;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
  .user-name-instr{
    margin-left: 28px;
    h2{
      font-size: 28px;
    }
    p{
      font-size: 16px;
      line-height: 40px;
      span{
        font-size: 24px;
        margin: 0 4px;
      }
    }
  }
  .go-on-some{
    a{
      padding: 0 16px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      border-radius: 18px;
      border: 1px solid $colfff;
      color: $colfff;
      display: inline-block;
      margin-left: 15px;
      &.zhibo{
        background:rgba(216,216,216,0.3017);
        border: 0;
        .ivu-icon{
          margin-top: -3px;
          margin-right: 4px;
        }
      }
    }
  }
  .user-main{
    @include flexJustify;
    padding-top: 38px;
    .userm-left{
      width: 142px;
      font-size: 18px;
    }
    .userm-right{
      width: 971px;
    }
  }
  .userm-list{
    padding-top: 15px;
  }
  .userm-item{
    margin: 15px 0;
    height: 46px;
    line-height: 46px;
    text-align: center;
    color: $col666;
    cursor: pointer;
    &.curren, &:hover{
      color: $colfff;
      background: $blueColor;
      border-radius: 8px 0px 0px 8px;
      position: relative;
      &:before{
        position: absolute;
        content: "";
        right: -30px;
        top: 0px;
        width: 0;
        height: 0;
        border: 23px solid transparent;
        border-right-width: 15px;
        border-left-color: $blueColor;
        border-left-width: 15px;
      }
    }
  }
  .userm-icon{
    width: 20px;
    height: 18px;
    margin-right: 10px;
    margin-top: -5px;
    vertical-align: middle;
    @extend %bg-img;
    .userm-item-01 &{
      background-image: url('../../assets/images/user/user-icon01.png');
    }
    .userm-item-01.curren &, .userm-item-01:hover &{
      background-image: url('../../assets/images/user/user-active-icon01.png');
    }
    .userm-item-02 &{
      background-image: url('../../assets/images/user/user-icon02.png');
    }
    .userm-item-02.curren &, .userm-item-02:hover &{
      background-image: url('../../assets/images/user/user-active-icon02.png');
    }
    .userm-item-03 &{
      background-image: url('../../assets/images/user/user-icon03.png');
    }
    .userm-item-03.curren &, .userm-item-03:hover &{
      background-image: url('../../assets/images/user/user-active-icon03.png');
    }
    .userm-item-04 &{
      background-image: url('../../assets/images/user/user-icon04.png');
    }
    .userm-item-04.curren &, .userm-item-04:hover &{
      background-image: url('../../assets/images/user/user-active-icon04.png');
    }
    .userm-item-05 &{
      background-image: url('../../assets/images/user/user-icon05.png');
    }
    .userm-item-05.curren &, .userm-item-05:hover &{
      background-image: url('../../assets/images/user/user-active-icon05.png');
    }
    .userm-item-06 &{
      background-image: url('../../assets/images/user/user-icon06.png');
    }
    .userm-item-06.curren &, .userm-item-06:hover &{
      background-image: url('../../assets/images/user/user-active-icon06.png');
    }
  }
</style>
