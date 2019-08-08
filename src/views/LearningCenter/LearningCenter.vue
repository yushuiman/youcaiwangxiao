<template>
  <div class="learn-center-wrap">
    <img class="lc-left-top-img" src="../../assets/images/learncenter/left-top-img.png" alt="">
    <div class="lc-login-wrap w-wrap">
      <div class="lc-login-left" v-if="!token">
        <div class="yc-detail">
          <h1 class="yc-welcome">欢迎体验<span>优财CMA课程学习中心</span></h1>
          <div class="yc-logo">
            <img src="../../assets/images/learncenter/logo.png" alt="">
            <em></em>
            <span>一个与时俱进的CMA学习平台</span>
          </div>
          <p class="yc-instr">提供专业与时俱进的CMA智能学习平台，培养新一代财务管理者。具有独家案例式教学模式的特色。</p>
        </div>
        <div class="loginSign-wrap">
          <p class="yc-tiyan">CMA网络课程体验：</p>
          <div class="inp-box">
            <input type="text" placeholder="请输入您的手机号码" v-model="mobile" maxlength="11" class="mobile">
          </div>
          <div class="inp-box" v-if="isSign == 1">
            <input type="password" placeholder="请输入密码" v-model="password" maxlength="16" class="pasw">
            <button class="forget-pawd" @click="forgetPawd">忘记密码</button>
          </div>
          <div class="inp-box" v-if="isSign == 2">
            <input type="text" placeholder="请输入手机验证码" v-model="yzmcode" maxlength="6" class="yzmcode">
            <button class="get-code" @click="getCode(1)" v-bind:disabled="disabled">{{codeTxt}}</button>
          </div>
          <div class="inp-box" v-if="isSign == 3">
            <input type="text" placeholder="请输入手机验证码" v-model="yzmcode" maxlength="6" class="yzmcode">
            <button class="get-code" @click="forgetPawYzm" v-bind:disabled="disabled">{{codeTxt}}</button>
          </div>
          <div class="inp-box" v-if="isSign == 3">
            <input type="password" placeholder="请输入新密码" v-model="password" maxlength="16" class="pasw">
          </div>
          <div class="info-bottom">
            <button class="btn-com experience-btn" @click="signLogin(isSign)">立即体验</button>
            <span class="error-ts">{{errorTxt}}</span>
          </div>
        </div>
      </div>
      <div v-if="token" style="width: 100%;">
        <!-- learnInfo.addlearn == 1有 2没有 -->
        <div class="lc-login-left" v-if="learnInfo.addlearn == 1">
          <div class="yc-detail">
            <h1 class="yc-welcome">您还没有制定<span>优财CMA课程学习计划</span></h1>
            <div class="yc-logo">
              <img src="../../assets/images/learncenter/logo.png" alt="">
              <em></em>
              <span>一个与时俱进的CMA学习平台</span>
            </div>
            <p class="yc-instr">提供专业与时俱进的CMA智能学习平台，培养新一代财务管理者。具有独家案例式教学模式的特色。</p>
          </div>
          <div class="loginSign-wrap">
            <div class="info-bottom">
              <button class="btn-com experience-btn" @click="planLearn()">立即制定</button>
            </div>
          </div>
        </div>
        <div v-if="learnInfo.addlearn == 2">
          没有学习计划呢
        </div>
      </div>
    </div>
    <img v-if="learnInfo.addlearn == 1" class="lc-right-bottom-img" src="../../assets/images/learncenter/right-bottom-img.png" alt="">
    <!-- 自定义modal样式 :styles=styles -->
    <Modal v-model="visible"
      :width="795"
      footer-hide
      title="添加学习计划"
      class="">
      <div class="height-com" v-if="addLearnIdx == 0">
        <div class="com-bg">
          请选择需要学习的课程
        </div>
        <ul class="know-list">
          <li v-for="(val, key) in courseListLearn" :key="key" @click="nextPage(key)">
            <span>{{val.course_name}}</span>
            <Icon type="ios-arrow-forward" style="color: #999999;"/>
          </li>
        </ul>
        <div class="dot"><span class="curren"></span><span></span><span></span></div>
      </div>
      <div class="height-com" v-if="addLearnIdx == 1">
        <div class="com-bg">
          <span>请选择考试时间</span>
          <a>返回上一步</a>
        </div>
        <ul class="know-list">
          <!-- <li v-for="(val, key) in knowList" :key="key" @click="goToPic(val)">
            <span>{{val.know_name}}</span>
            <button class="btn-com do-potic-btn">去做题</button>
          </li> -->
        </ul>
        <div class="dot"><span></span><span class="curren"></span><span></span></div>
      </div>
      <div class="height-com" v-if="addLearnIdx == 2">
        <div>
          计划完成
        </div>
        <button>开始学习之旅</button>
        <div class="dot"><span></span><span></span><span class="curren"></span></div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { isRegister, kRegister, learnIndex, courseList, testTime, addStudy } from '@/api/learncenter'
import { getSmsCode, voice, quickLogin, accountLogin, forgetPaw, resetPaw } from '@/api/login'
import { Encrypt } from '@/libs/crypto'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      isSign: 0, // 1注册2未注册
      mobile: '',
      password: '',
      newpwd: '',
      yzmcode: '',
      codeTxt: '获取验证码',
      errorTxt: '', // 请输入您的手机号 您已注册，请直接登录。
      disabled: false,
      countTime: 60, // 倒计时
      timer: null,
      visible: false,
      styles: {
        top: '15%'
      },
      learnInfo: {}, // 详情
      addLearnIdx: 0, // 添加学习计划 1选择课程 2考试时间时间 3计划完成
      courseListLearn: [] // 课程列表
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    })
  },
  components: {
  },
  mounted () {
    if (this.token) {
      this.getLearnIndex()
    }
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    ...mapMutations([
      'setChange'
    ]),
    // 立即制定学习计划
    planLearn () {
      this.visible = true
      this.learnIndex = 0
      this.getCourseList() // 选择课程列表
    },
    nextPage (index) {
      this.addLearnIdx = index + 1
      if (index === 1) {
        this.getTestTime() // 选择考试时间
      }
    },
    // 学习计划详情
    getLearnIndex () {
      learnIndex({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.learnInfo = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 学习计划课程列表
    getCourseList () {
      courseList({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.courseListLearn = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 学习计划考试时间
    getTestTime () {
      testTime({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          console.log(res)
          // this.learnInfo = res.data
          // this.$set(this.$data, 'learnInfo', res.data)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 添加学习计划
    getAddStudy () {
      addStudy({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          console.log(res)
          // this.learnInfo = res.data
          // this.$set(this.$data, 'learnInfo', res.data)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 是否注册
    signLogin (type) {
      const re = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (this.mobile === '') {
        this.errorTxt = '请输入您的手机号'
      } else if (!re.test(this.mobile)) {
        this.errorTxt = '请输入正确的手机号'
      } else {
        // 初始化 是否注册
        if (type === 0) {
          this.getIsRegister()
        }
        // 已注册 密码登录
        if (type === 1) {
          this.accountLogin()
        }
        // 未注册 快捷短信注册 快捷短信登录
        if (type === 2) {
          this.getkRegister()
        }
        // 忘记密码
        if (type === 3) {
          this.resetPawd()
        }
      }
    },
    // 是否注册
    getIsRegister () {
      isRegister({
        mobile: Encrypt(this.mobile)
      }).then(data => {
        const res = data.data
        // const res = {
        //   code: 200,
        //   data: { status: 2 },
        //   msg: '操作成功'
        // }
        if (res.code === 200) {
          this.errorTxt = ''
          this.isSign = res.data.status
        } else {
          this.errorTxt = res.msg
          // this.$Message.error(res.msg)
        }
      })
    },
    // 已注册 密码登录
    accountLogin () {
      if (this.password.length < 6 || this.password.length > 16) {
        this.errorTxt = '密码必须为6-16位哦~~'
        return
      }
      accountLogin({
        mobile: Encrypt(this.mobile),
        password: this.password
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.$store.commit('setToken', res.data.token)
          this.getUserInfo()
          this.errorTxt = ''
          this.getLearnIndex() // 登录成功 查询是学习计划详情
          // this.visible = true
          // this.isSign = 0
          // this.mobile = ''
          // this.password = ''
          // this.yzmcode = ''
        } else if (res.code === 403) {
          // this.$Message.error('账号已被冻结，请联系管理员!')
          this.errorTxt = '账号已被冻结，请联系管理员!'
        } else {
          this.errorTxt = res.msg
        }
      })
    },
    // 未注册 快捷注册 然后快捷登录
    getkRegister () {
      if (this.yzmcode === '') {
        this.errorTxt = '请输入验证码'
        return
      }
      kRegister({
        mobile: Encrypt(this.mobile),
        mobilecode: this.yzmcode
      }).then(data => {
        const res = data.data
        // const res = {
        //   code: 200,
        //   data: [],
        //   msg: '验证码错误'
        // }
        if (res.code === 200) {
          this.errorTxt = ''
          this.quickLoginRes()
        } else {
          this.errorTxt = res.msg
        }
      })
    },
    // 快捷短信登录
    quickLoginRes () {
      quickLogin({
        mobile: Encrypt(this.mobile),
        mobilecode: this.yzmcode
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.$store.commit('setToken', res.data.token)
          this.getUserInfo()
          this.getLearnIndex() // 登录成功 查询是学习计划详情
          // this.visible = true
          // this.isSign = 0
          // this.mobile = ''
          // this.password = ''
          // this.yzmcode = ''
        } else {
          this.errorTxt = res.msg
          // this.$Message.error(res.msg)
        }
      })
    },
    // 忘记密码 获取验证码
    forgetPawYzm () {
      forgetPaw({
        mobile: Encrypt(this.mobile)
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.downCount()
        } else {
          this.errorTxt = res.msg
          // this.$Message.error(res.data.msg)
        }
      })
    },
    // 忘记密码 重置密码
    forgetPawd () {
      this.isSign = 3
      this.password = ''
    },
    // 获取短信验证码
    getCode (type) {
      clearInterval(this.timer)
      getSmsCode({
        mobile: Encrypt(this.mobile),
        state: type // 注册1 快捷2
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.downCount() // 倒计时
        } else if (res.code === 405) {
          this.errorTxt = '短信发送失败，请检查手机信息功能'
          // this.$Message.error('短信发送失败，请检查手机信息功能')
        } else if (res.code === 407) {
          this.errorTxt = '您已注册，请直接登录'
          this.$set(this.$data, 'isSign', 1)
        } else {
          this.errorTxt = res.msg
          // this.$Message.error(res.msg)
        }
      })
    },
    resetPawd () {
      if (this.yzmcode === '') {
        this.errorTxt = '请输入验证码'
      } else if (this.password.length < 6 || this.password.length > 16) {
        this.errorTxt = '密码必须为6-16位哦~~'
      } else {
        resetPaw({
          'mobile': Encrypt(this.mobile),
          'password': this.password,
          'verifycode': this.yzmcode
        }).then(data => {
          const res = data.data
          if (res.code === 200) {
            this.errorTxt = '密码重置成功'
            this.quickLoginRes() // 快捷短信登录
          } else {
            this.errorTxt = res.msg
            // this.$Message.error(res.data.msg)
          }
        })
      }
    },
    // 倒计时60
    downCount () {
      this.countTime = 60
      this.disabled = true
      this.codeTxt = this.countTime + 's'
      this.timer = setInterval(() => {
        if (this.countTime > 0) {
          this.countTime--
          this.codeTxt = this.countTime + 's'
        } else {
          this.disabled = false
          clearInterval(this.timer)
          this.timer = null
          this.codeTxt = '重新获取'
        }
      }, 1000)
    },
    // 语音验证码
    getVoice () {
      voice({
        mobile: this.mobile
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .learn-center-wrap{
    position: absolute;
    width: 100%;
    left: 0;
    top: 70px;
    bottom: 0;
    right: 0;
    background: #ffffff;
  }
  .lc-left-top-img{
    position: absolute;
    left: 0;
    top: 0;
    width: 28%;
    // height: 292px;
  }
  .lc-right-bottom-img{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 60%;
    // height: 131px;
  }
  .lc-login-wrap{
    // position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    // background: #000;
  }
  .lc-login-left{
    // flex: 1;
    width: 100%;
    // padding-left: 5%;
    padding: 5% 0;
    background: url('../../assets/images/learncenter/zkz-img.png') no-repeat;
    background-size: contain;
    background-position: right bottom;
  }
  .lc-login-right{
    position: absolute;
    right: 0;
    // top: 50%;
    // margin-top: -25%;
    // top: 10%;
    img{
      // width: 75%;
      // margin-top: 20%;
      // height: 50%;
      // height: 576px;
      // width: 55%;
      // height: 576px;
    }
  }
  .yc-detail{
    // padding-top: 9%;
    .yc-welcome{
      font-size: 50px;
      line-height: 70px;
      color: #002E80;
      span{
        font-size: 30px;
        line-height: 42px;
        display: block;
      }
    }
    .yc-logo{
      line-height: 28px;
      img{
        width: 94px;
        height: 20px;
        vertical-align: middle;
        margin-top: -4px;
      }
      em{
        height: 20px;
        width: 1px;
        display: inline-block;
        vertical-align: middle;
        margin: 0 10px;
        margin-top: -4px;
        background: #979797;
      }
      span{
        font-size: 20px;
      }
    }
    .yc-instr{
      line-height: 20px;
      color: $col999;
      margin-top: 7px;
    }
  }
  .loginSign-wrap{
    padding-top: 60px;
    .yc-tiyan{
      font-size: 18px;
      line-height: 30px;
    }
  }
  .inp-box{
    margin-top: 14px;
    height: 34px;
    line-height: 34px;
    input{
      padding: 7px 10px;
      border: 1px solid #979797;
      border-radius: 2px;
      font-size: 16px;
      box-sizing: border-box;
    }
    .get-code, .forget-pawd{
      margin-left: 21px;
      font-size: 16px;
      color: $blueColor;
    }
  }
  input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: #C7C7C7;
  }
  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #C7C7C7;
  }
  input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #C7C7C7;
  }
  input:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #C7C7C7;
  }
  .info-bottom{
    font-size: 16px;
    margin-top: 20px;
    .btn-com{
      width: 122px;
      height: 36px;
      background:rgba(0,102,255,1);
      border-radius: 18px;
      color: $colfff;
    }
    .error-ts{
      color: #E84342;
      margin-left: 20px;
    }
  }
  // <div class="loginSign-wrap">
  //         <p class="yc-tiyan">CMA网络课程体验：</p>
  //         <div>
  //           <input type="text" placeholder="请输入您的手机号码" v-model="mobile" class="mobile">
  //         </div>
  //         <div>
  //           <input type="text" placeholder="请输入手机验证码" v-model="yzmcode" class="yzmcode">
  //           <button class="getCode">获取验证码</button>
  //         </div>
  //         <div>
  //           <input type="password" placeholder="请输入密码" v-model="password" class="pasw">
  //         </div>
  //         <button class="btn-com experience-btn">立即体验</button>
  //       </div>
  // <div class="yc-detail">
  //         <h1 class="yc-welcome">欢迎体验<span>优财CMA课程学习中心</span></h1>
  //         <div class="yc-logo">
  //           <img src="../../assets/images/learncenter/logo.png" alt="">
  //           |
  //           <span>一个与时俱进的CMA学习平台</span>
  //         </div>
  //         <p class="yc-instr">提供专业与时俱进的CMA智能学习平台，培养新一代财务管理者。具有独家案例式教学模式的特色。</p>
  //       </div>
</style>
