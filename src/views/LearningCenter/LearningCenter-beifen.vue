<template>
  <div class="learn-center-wrap">
    <!-- 左上角图片 -->
    <img class="lc-left-top-img" src="../../assets/images/learncenter/left-top-img.png" alt="">
    <!-- 未登录 addlearn == 2无学习计划-->
    <div class="lc-login-wrap" v-if="addlearn!=1">
      <!-- 未登录 去登录注册-->
      <div class="no-token-left lc-login-left" v-if="!token">
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
      <!-- 已登录 判断是否有计划-->
      <div class="have-token-left" v-if="token">
        <!-- addlearn == 2无学习计划-->
        <div class="lc-login-left" v-if="addlearn == 2">
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
      </div>
      <img class="lc-login-right" v-if="addlearn != 1" src="../../assets/images/learncenter/zkz-img.png" alt="">
    </div>
    <!-- 已登录 addlearn == 1有学习计划-->
    <div class="w-wrap" v-if="addlearn == 1">
      <div class="plan-info-top">
      打卡
      </div>
      <div class="plan-info-bottom">
计划
      </div>
    </div>
    <!-- 右下角图片 -->
    <img v-if="addlearn != 1" class="lc-right-bottom-img" src="../../assets/images/learncenter/right-bottom-img.png" alt="">
    <!-- 制定学习计划 自定义modal样式 :styles=styles -->
    <Modal v-model="visible"
      :width="795"
      footer-hide
      :title=titTxt[addLearnIdx]
      class="plan-modal">
      <div class="height-com" v-if="addLearnIdx == 0">
        <div class="com-bg">
          请选择需要学习的课程
        </div>
        <ul class="know-list">
          <li v-for="(val, key) in courseListLearn" :key="key" @click="nextPage(1, val.course_id)">
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
          <li v-for="(val, key) in timeListLearn" :key="key" @click="nextPage(2, val.test_time)">
            <span>{{val.test_time}}</span>
            <Icon type="ios-arrow-forward" style="color: #999999;"/>
          </li>
        </ul>
        <div class="dot"><span></span><span class="curren"></span><span></span></div>
      </div>
      <div class="height-com" style="height: 575px;" v-if="addLearnIdx == 2">
        <div class="star-learning-wrap">
          <div class="star-learning-left">
            <h1 class="plan-finish">自定义学习计划完成</h1>
            <p class="plan-next">接下来，希望通过本次计划顺利通过考试。成为会管理、懂业务、能决策的管理会计！</p>
            <div class="loginSign-wrap">
              <div class="info-bottom">
                <button class="btn-com experience-btn" @click="getAddStudy()">开始学习之旅</button>
              </div>
            </div>
          </div>
          <img class="star-learning-right" src="../../assets/images/learncenter/zkz-img2.png" alt="">
        </div>
        <div class="dot"><span></span><span></span><span class="curren"></span></div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { isRegister, kRegister, learnIndex, courseList, testTime, addStudy } from '@/api/learncenter'
import { getSmsCode, quickLogin, accountLogin, forgetPaw, resetPaw } from '@/api/login'
import { Encrypt } from '@/libs/crypto'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 以下是登录注册
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
      // 以下是学习计划
      visible: false,
      addLearnIdx: 0, // 添加学习计划div 1选择课程 2考试时间时间 3计划完成
      styles: {
        top: '15%'
      },
      titTxt: {
        0: '添加学习计划',
        1: '添加学习计划',
        2: ''
      },
      addlearn: 0, // 是否有学习计划
      state: 0, // 是否有未完成的计划
      user: {}, // 用户信息，打卡天数
      plan: {}, // 学习计划
      learnList: {}, // 学习计划详情
      news: [], // 学习公告
      courseListLearn: [], // 课程列表
      timeListLearn: [], // 考试时间列表
      is_exper: 0, // 是否是0元体验
      planCourseId: 0, // 计划课程id
      planTesttime: '' // 计划考试时间
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
      this.addLearnIdx = 0
      this.getCourseList() // 选择课程列表
    },
    nextPage (index, str) {
      this.addLearnIdx = index
      if (index === 1) {
        this.planCourseId = str // 选择课程id
        this.getTestTime(str) // 选择考试时间
      }
      if (index === 2) {
        this.planTesttime = str // 选择考试time
      }
    },
    // 学习计划首页详情
    getLearnIndex () {
      learnIndex({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          let { addlearn, state, user, plan, learnList, news } = res.data
          this.addlearn = addlearn
          this.state = state
          this.user = user
          this.plan = plan
          this.learnList = learnList[0]
          this.news = news
          this.is_exper = this.learnList.is_exper
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 学习计划课程列表list
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
    // 学习计划考试时间list
    getTestTime (id) {
      testTime({
        user_id: this.user_id,
        course_id: id,
        types: this.is_exper // 1:0元体验 2:购买课程
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.timeListLearn = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 添加学习计划
    getAddStudy () {
      addStudy({
        user_id: this.user_id,
        course_id: this.planCourseId,
        test_time: this.planTesttime,
        types: this.is_exper // 1为0元体验 2为购买课程
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          console.log(res)
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
          this.getUserInfo().then(() => {
            this.getLearnIndex() // 登录成功 查询学习计划详情
          })
          // this.errorTxt = ''
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
          // this.getUserInfo().then(() => {
          //   this.getLearnIndex() // 登录成功 查询学习计划详情
          // })
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
  }
  .lc-right-bottom-img{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 60%;
  }
  .lc-login-wrap{
    width: 1281px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .lc-login-left{
    width: 620px;
  }
  .yc-detail{
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
  // modal以及内容
  .plan-modal{
    position: relative;
  }
  .dot{
    padding: 30px 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    font-size: 0;
    text-align: center;
    span{
      width: 10px;
      height: 10px;
      border-radius: 10px;
      background:rgba(51,51,51,.3);
      display: inline-block;
      margin: 0 10px;
      &.curren{
        background: $col333;
      }
    }
  }
  .star-learning-wrap{
    display: flex;
    justify-content: space-between;
    padding: 113px 30px 0 30px;
  }
  .star-learning-left{
    padding-top: 49px;
    .plan-finish{
      font-size: 30px;
      line-height: 42px;
    }
    .plan-next{
      width: 338px;
      font-size: 16px;
      line-height: 26px;
      margin-top: 7px;
    }
  }
</style>
