<template>
  <div class="logReg">
    <img class="Bookend" :src="Bookend" alt="">
    <div class="background">
      <div class="con" v-if="is_forget == 'log-reg'">
        <div class="login_nav">
          <span :class="isLogin == 'login' ? 'span_on' : ''" @click="isLogin = 'login'">登录</span>
          <span :class="isLogin == 'reg' ? 'span_on' : ''" @click="isLogin = 'reg'">注册</span>
        </div>
        <!-- 登录 -->
        <div v-if="isLogin == 'login'">
          <div class="logo_img">
            <img :src="logoImg" alt="">
          </div>
          <div class="description">优财网校—打造案例式教学 能考会用</div>
          <div class="tel">
            <img :src="phone" alt="">
            <input v-model.trim="form.mobile" placeholder="请输入手机号" maxlength="11" />
          </div>
          <div class="tel">
            <img :src="password" alt="">
            <input type="password" v-model.trim="form.password" placeholder="请输入密码">
          </div>
          <div class="forget" @click="is_forget = 'forget'">忘记密码 ?</div>
          <i-button type="primary" shape="circle" class="log" @click="accountLogin">登录</i-button>
          <div class="line">
            <span class="line-lr"></span>
            <span>or</span>
            <span class="line-lr"></span>
          </div>
          <div class="Third">
            <div class="Third-left">
              <img :src="wx" v-if="is_show == 2" @mouseenter="onMouseOver" @mouseleave="onMouseOut"/>
              <img :src="wx2" v-if="is_show == 1" @mouseenter="onMouseOver" @mouseleave="onMouseOut" @click="wx_login"/>
              <p>微信</p>
            </div>
            <div class="Third-right">
              <img :src="dx" v-if="is_show2 == 2" @mouseenter="onMouseOver2" @mouseleave="onMouseOut2"/>
              <img :src="dx2" v-if="is_show2 == 1" @click="isLogin = 'fast_login'" @mouseenter="onMouseOver2" @mouseleave="onMouseOut2"/>
              <p>手机短信登录</p>
            </div>
          </div>
          <div class="yc-bot">优财智业（北京）科技发展有限公司</div>
        </div>
        <!-- 注册 -->
        <div v-if="isLogin == 'reg'">
          <div class="logo_img2">
            <img :src="logoImg" alt="">
          </div>
          <div class="description">优财网校—打造案例式教学 能考会用</div>
          <div class="tel">
            <img :src="phone" alt="">
            <input v-model="form2.mobile" placeholder="请输入手机号">
          </div>
          <div class="tel">
            <img :src="code" alt="">
            <input type="text" v-model="form2.code" placeholder="请输入手机验证码">
            <i-button type="primary" class="getCode" v-show="show"  @click="getCode">获取验证码</i-button>
            <i-button type="primary" class="count" v-show="!show">{{count}} s</i-button>
          </div>
          <div class="voice" v-show="Sms_no == true">
            <p>收不到短信,试试</p>
            <span @click="voice">语音验证码</span>
          </div>
          <div class="tel">
            <img :src="password" alt="">
            <input type="password" v-model="form2.text_pwd" placeholder="请设置密码">
          </div>
          <div class="tel">
            <img :src="password" alt="">
            <input type="password" v-model="form2.confirm_pwd" placeholder="请确认密码">
          </div>
          <div class="read">
            <Checkbox v-model="single">我已同意并阅读</Checkbox>
            <span class="Agreement" @click="modal1 = true">《用户注册协议》</span>
            <!-- <Modal
              v-model="modal1"
              footer-hide = "false"
              width="1200">
              <div class="content">
                本用户协议双方为优财网校(www.youcaiwx.com)所有者优财CMA培训中心与网校使用学员，本协议具有法律效力。学员须遵守本用户协议，并在本协议中承诺遵守所有优财培训中心已经发布的或将来可能发布的各类规则。
              </div>
              <div class="htitle">一、优财网校服务条款的确认和接受</div>
              <div class="content">
                  优财网校的各项网络服务的所有权、运作权、运营权，以及网站内容的著作权、复制传播权等归优财所有。优财网校提供的服务将完全按照其发布的章程、服务 条款和操作规则执行。只要学员点击了网站上协议正本下方的"确认"按钮并按照优财网校在线注册程序成功注册为优财网校学员，学员的行为即表示其在注册之前认真阅读了本用户协议，同意并点击确认本用户协议。
              </div>
              <div class="htitle">二、学员的账号，密码和安全性</div>
              <div class="content">
                  学员务必确保网校用户名及密码的安全性，如果丢失，造成的损失将由本人承担全部后果。学员不得将账号借予他人或多人共同使用一个账号。如果发现有正当的理由怀疑多人共用一个帐号的现象，优财网校保留结束或终止该账号的权利同时我公司会进一步追究违规人员的法律责任，包含不限于追偿损失、司法追责等。优财网校有判定学员的行为是否符合优财网校服务条款的要求的保留权利，如果学员违背了服务条款的规定，优财网校有中断对其提供网络服务的权利。
              </div>
              <div class="htitle">三、优财网校的权利和义务</div>
              <div class="content">
                  优财网校有义务在现有技术上维护整个网校教育平台的正常运行，并努力提升和改进技术，使学员的网络教育活动得以顺利进行。优财网校提供的网络服务内容包 括：文字、软件、声音、图片、录像图表、邮件及广告中的全部内容，优财网校拥有以上内容的完全版权，严禁任何个人或单位在未经优财网校许可的情况下对这些内容进行翻版、复制、转载、篡改等一切用于商业活动的行为。对于学员在优财网校平台上的不当行为或其它任何优财网校认为应当终止服务的情况，优财网校有权随时作出删除相关信息、终止服务提供等处理，而无须征得学员的同意；优财网校应本着诚实信用的原则向学员提供远程教育服务，不得随意中断或停止提供该项服务。
              </div>
              <div class="htitle">四、开始、结束服务</div>
              <div class="content">
                  学员注册完成后，享受优财网校提供的各类咨询、信息查询、试听等多重免费服务。具体服务内容开通的时间和进度以网站的最新公告或课件更新记录为准。结束服务后，学员使用相应服务权限的权利马上终止。从那时起，学员没有权利，优财网校也没有义务传送任何未处理的信息或未完成的服务给学员或第三方。
              </div>
              <div class="htitle">五、关于网络课程的说明</div>
              <div class="content">
                  1、优财网校所有产品一经购买（包括网上注册、邮局汇款、银行电汇、报名点缴费等各种购买方式），都不允许任何形式的退换。
              </div>
              <div class="content">
                  2、学员缴费为优财网校在线网络课堂的教育信息费，不包含学员的上网电话费、上网信息费等。
              </div>
              <div class="content">
                  3、学员使用优财网校提供的账号和密码登录注册后，网络课程中的金额将自动注入学员账号。转入学员账号中的金额仅能作为优财网校在线网络课堂中听课使用，不找零，不兑换现金或其他产品和服务。
              </div>
              <div class="content">
                  4、所有类型的网络课程账号都有截止登录时间，学员应在指定日期前登录并学习。如果学员没有在最后期限之前登录网络课程，账号权限将作自动作废处理，学员自己应对此承担全部责任。
              </div>
              <div class="htitle">六、学员承担的责任</div>
              <div class="content">
                  1、优财网校所有学员需自备上网所需要的设备，自行承担上网产生的各项费用。使用自己的电脑能够顺利地接入国际互联网，并能访问本网站主页。
              </div>
              <div class="content">
                  2、学员需提供详尽、准确的个人资料并及时更新。若学员提供任何错误、不实、过时或不完整的资料为网校所知，或者网校有合理理由怀疑资料为错误、不实、过时或不完整，优财网校保留结束或终止其注册学员资格的权利。优财网校承诺不对外透露学员信息，除以下情况外：
                  (1)学员授权优财网校透露这些信息。(2)相应的法律及程序要求优财网校提供学员的个人资料。如果学员提供的资料包含有不正确的信息，优财网校保留结束学员使用网络服务资格的权利。
              </div>
              <div class="content">
                  3、学员必须遵守中华人民共和国的法律、法规、规章、条例、以及其他具有法律效力的规范，不使用网络服务做任何非法用途。
              </div>
              <div class="content">
                  4、不得干扰或混乱网络服务。
              </div>
              <div class="content">
                  5、不得侵犯优财网校所有著作权、版权。
              </div>
              <div class="content">
                  6、不得将广告、促销资料等，通过上载、张贴、发送电子邮件或以其他方式传送，供前述目的使用的专用区域除外。
              </div>
              <div class="content">
                  7、不得在优财网校内发布违法信息，用户对其发布的内容单独承担法律责任。
              </div>
              <div class="content">
                  8、严禁发表、散布、传播任何反动、色情及违反国家安全、扰乱社会秩序等有害信息，学员需对自己在网上的行为承担法律责任。学员若在优财网校上散布和传播反动、色情或其他违反国家法律的信息，优财网校的系统记录将作为学员违反法律的证据。
              </div>
              <div class="htitle">七、免责条款</div>
              <div class="content">
                  1、优财网校不保证（包括但不限于）：(1)服务不受干扰，及时、安全、可靠或不出现任何错误；(2)用户经由本服务取得的任何产品、服务或其他材料符合用户的期望。
              </div>
              <div class="content">
                  2、由于地震、台风、洪水、火灾、战争、政府禁令以及其他不能预见并且对其发生和后果不能防止或避免的不可抗力或互联网上的黑客攻击事件，致使影响优财网校服务履行的，优财网校不承担责任。
              </div>
              <div class="content">
                  3、任何由于黑客攻击、计算机病毒侵入或发作、因政府管制而造成的暂时性关闭等影响网络正常经营的不可抗力而造成的个人资料泄露、丢失、被盗用、被窜改或不能正常看课等，优财网校均得免责。
              </div>
              <div class="content">
                  4、优财网校如因系统维护或升级而需暂停服务时，将事先公告。若因线路及非本公司控制范围外的硬件故障或其它不可抗力而导致暂停服务，于暂停服务期间造成的一切不便与损失，优财网校不负任何责任。
              </div>
              <div class="content">
                  5、优财网校使用者因违反本声明的规定而触犯中华人民共和国法律的，一切后果自己负责，本网站不承担任何责任。本用户协议根据现行中华人民共和国法律法规制定。如发生协议条款与中华人民共和国法律法规相抵触时，则这些条款将完全按法律法规的规定重新解释，本用户协议的其它条款仍对优财网校和学员具有法律约束力。
              </div>
              <div class="content">

              </div>
            </Modal> -->
          </div>
          <i-button type="primary" class="registered" @click="webReg">注册</i-button>
          <div class="yc-bot">优财智业（北京）科技发展有限公司</div>
        </div>
        <!-- 快速登录 -->
        <div v-if="isLogin == 'fast_login'">
          <div class="logo_img">
            <img :src="logoImg" alt="">
          </div>
          <div class="description">优财网校—打造案例式教学 能考会用</div>
          <div class="tel">
            <img :src="phone" alt="">
            <input v-model="form4.mobile" placeholder="请输入手机号" />
          </div>
          <div class="tel">
            <img :src="code" alt="">
            <input type="text" v-model="form4.code" placeholder="请输入手机验证码">
            <i-button type="primary" class="getCode" v-show="show3"  @click="getCode3">获取验证码</i-button>
            <i-button type="primary" class="count" v-show="!show3">{{count3}} s</i-button>
          </div>
          <div class="voice2" v-show="Sms_no == true">
            <p>收不到短信,试试</p>
            <span @click="voice2">语音验证码</span>
          </div>
          <i-button type="primary" shape="circle" class="log"  style="width:320px;height:50px;cursor: pointer;color:#fff;outline:none;border:none;border-radius:25px;font-size:24px;" @click="quickLogin">登录</i-button>
          <div class="line">
            <span class="line-lr"></span>
            <span>or</span>
            <span class="line-lr"></span>
          </div>
          <div class="Third">
            <div class="Third-left">
              <img :src="wx" v-if="is_show == 2" @mouseenter="onMouseOver" @mouseleave="onMouseOut"/>
              <img :src="wx2" v-if="is_show == 1" @mouseenter="onMouseOver" @mouseleave="onMouseOut" @click="wx_login"/>
              <p>微信</p>
            </div>
            <div class="Third-right">
              <img :src="icon" v-if="is_show2 == 2" @mouseenter="onMouseOver2" @mouseleave="onMouseOut2"/>
              <img :src="icon2" v-if="is_show2 == 1" @click="isLogin = 'login'" @mouseenter="onMouseOver2" @mouseleave="onMouseOut2"/>
              <p>账号登录</p>
            </div>
          </div>
          <div class="yc-bot3">优财智业（北京）科技发展有限公司</div>
        </div>
      </div>
      <!-- 忘记密码 -->
      <div class="forget-pwd"  v-if="is_forget == 'forget'">
        <div class="logo_img3">
          <img :src="logoImg" alt="">
        </div>
        <div class="description2">优财网校—打造案例式教学 能考会用</div>
        <div class="tel">
          <img :src="phone" alt="">
          <input v-model="form3.mobile" placeholder="请输入手机号">
        </div>
        <div class="tel">
          <img :src="code" alt="">
          <input v-model="form3.code" placeholder="验证码">
          <i-button type="primary" class="getCode" v-show="show2"  @click="forgetPaw">获取验证码</i-button>
          <i-button type="primary" class="count" v-show="!show2">{{count2}} s</i-button>
        </div>
        <div class="voice2" v-show="Sms_no == true">
          <p>收不到短信,试试</p>
          <span @click="voice3">语音验证码</span>
        </div>
        <div class="tel">
          <img :src="password" alt="">
          <input type="password" v-model="form3.new_pwd" placeholder="新密码">
        </div>
        <i-button type="primary" class="confirm" @click="resetPaw">确认</i-button>
        <div class="yc-bot2">优财智业（北京）科技发展有限公司</div>
      </div>
      <!-- 欢迎页 -->
      <div class="finish" v-if="is_forget == 'finish'">
        <div class="logo_img">
          <img :src="logo_img" alt="">
        </div>
        <div class="description">优财网校—打造案例式教学 能考会用</div>
        <div class="success">
          <img :src="success" alt="">
        </div>
        <div class="prompt">恭喜您注册成功</div>
        <i-button type="primary" shape="circle" class="log"  style="width:320px;height:50px;cursor: pointer;color:#fff;outline:none;border:none;border-radius:25px;font-size:24px;">开始学习</i-button>
        <div class="perfect">完善资料</div>
        <div class="yc-bot4">优财智业（北京）科技发展有限公司</div>
      </div>
    </div>
  </div>
</template>
<script>
// import WebSocket from '@/libs/web-socket'
import logoImg from '@/assets/images/login/logo-yc.png'
import phone from '@/assets/images/login/User.png'
import password from '@/assets/images/login/mim.png'
import wx from '@/assets/images/login/wx2.png'
import dx from '@/assets/images/login/dx2.png'
import wx2 from '@/assets/images/login/wx.png'
import dx2 from '@/assets/images/login/dx.png'
import icon from '@/assets/images/login/icon.png'
import icon2 from '@/assets/images/login/icon2.png'
import Bookend from '@/assets/images/login/Bookend.png'
import code from '@/assets/images/login/code.png'
import success from '@/assets/images/login/success.png'
import { mapActions } from 'vuex'
// 加密 解密
import { Encrypt } from '@/libs/crypto'
import { getSmsCode, webReg, voice, resetPaw, quickLogin, wxLogin, forgetPaw } from '@/api/login'

export default {
  data () {
    return {
      Ws: '',
      phone,
      logoImg,
      password,
      wx,
      dx,
      wx2,
      dx2,
      Bookend,
      code,
      icon,
      icon2,
      success,
      Sms_no: false,
      single: true,
      modal1: false,
      type_num: 1,
      is_show: 2,
      is_show2: 2,
      is_forget: 'log-reg',
      isLogin: 'login',
      show: true,
      /* 不可以点击 */
      disabled: false,
      show2: true,
      show3: true,
      count: '',
      count2: '',
      count3: '',
      timer: null,
      timer2: null,
      timer3: null,
      dialogFormVisible: false,
      form: {
        mobile: '18810399514',
        password: 'qwe123'
      },
      form2: {
        mobile: '',
        code: '',
        text_pwd: '',
        confirm_pwd: ''
      },
      form3: {
        mobile: '',
        code: '',
        new_pwd: ''
      },
      form4: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),

    onMouseOver: function () {
      this.is_show = 1
    },
    onMouseOut: function () {
      this.is_show = 2
    },
    onMouseOver2: function () {
      this.is_show2 = 1
    },
    onMouseOut2: function () {
      this.is_show2 = 2
    },
    wx_login () {
      wxLogin().then((res) => {
        if (res.data.code === 200) {
          window.open(res.data.data)
        }
      })
    },
    sendText () {
      this.Ws.send(222)
    },
    // 注册--获取验证码
    getCode () {
      const TIME_COUNT = 60
      const re = /^1(3|4|5|7|8)\d{9}$/
      if (this.form2.mobile === '') {
        this.$Message.error('请输入手机号')
      } else if (re.test(this.form2.mobile)) {
        if (!this.timer) {
          this.count = TIME_COUNT
          this.show = false
          this.disabled = true
          getSmsCode({ mobile: Encrypt(this.form2.mobile), state: 1 }).then(res => {
            if (res.data.code === 200) {
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.disabled = false
                  this.count--
                  this.show = false
                  if (this.count === 0) {
                    this.Sms_no = true
                  }
                } else {
                  this.disabled = true
                  this.show = true
                  clearInterval(this.timer)
                  this.timer = null
                }
              }, 1000)

              this.form2.password = ''
            } else if (res.data.code === 405) {
              /* 保存token */
              this.$Message.error('短信发送失败，请检查手机信息功能')
              this.form2.mobile = ''
            } else if (res.data.code === 407) {
              this.disabled = true
              this.show = true
              clearInterval(this.timer)
              this.timer = null
              /* 保存token */
              this.$Message.error('该手机号已注册')
              this.form2.mobile = ''
            }
          })
        }
      } else {
        this.$Message.error('该手机号不符合格式')
      }
    },
    // 忘记密码--获取验证码
    forgetPaw () {
      const TIME_COUNT2 = 60
      if (this.form3.mobile === '') {
        this.$Message.error('请输入手机号')
      } else {
        if (!this.timer2) {
          this.count2 = TIME_COUNT2
          this.show2 = false
          this.disabled = true
          forgetPaw({ mobile: Encrypt(this.form3.mobile) }).then(res => {
            if (res.data.code === 200) {
              this.timer2 = setInterval(() => {
                if (this.count2 > 0 && this.count2 <= TIME_COUNT2) {
                  this.disabled = false
                  this.count2--
                  this.show2 = false
                  if (this.count2 === 0) {
                    this.Sms_no = true
                  }
                } else {
                  this.disabled = true
                  this.show2 = true
                  clearInterval(this.timer2)
                  this.timer2 = null
                }
              }, 1000)
            }
          })
        }
      }
    },
    // 快捷登录--获取验证码
    getCode3 () {
      const TIME_COUNT3 = 60
      if (this.form4.mobile === '') {
        this.$Message.error('请输入手机号')
      } else {
        if (!this.timer3) {
          this.count3 = TIME_COUNT3
          this.show3 = false
          this.disabled = true
          getSmsCode({ mobile: Encrypt(this.form4.mobile), state: 2 }).then(res => {
            if (res.data.code === 200) {
              this.timer3 = setInterval(() => {
                if (this.count3 > 0 && this.count3 <= TIME_COUNT3) {
                  this.disabled = false
                  this.count3--
                  this.show3 = false
                  if (this.count3 === 0) {
                    this.Sms_no = true
                  }
                } else {
                  this.disabled = true
                  this.show3 = true
                  clearInterval(this.timer3)
                  this.timer3 = null
                }
              }, 1000)
            }
          })
        }
      }
    },
    // 登录
    accountLogin () {
      var re = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (this.form.mobile === '') {
        this.$Message.error('请输入手机号')
      } else if (!re.test(this.form.mobile)) {
        this.$Message.error('手机号错误')
      } else if (this.form.password === '') {
        this.$Message.error('请输入密码')
      } else if (this.form.password.length < 6 || this.form.password.length > 16) {
        this.$Message.error('密码必须为6-16位哦~~')
      } else {
        this.handleLogin({ mobile: Encrypt(this.form.mobile), password: this.form.password }).then(data => {
          setTimeout(() => {
            this.$router.push('/')
          }, 1000)
        })
      }
    },
    // 注册
    webReg () {
      var re = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (this.form2.mobile === '' || this.form2.text_pwd === '' || this.form2.confirm_pwd === '' || this.form2.code === '') {
        this.$Message.error('手机号 ，验证码 ，密码 ，确认密码均为必填项')
      } else if (!re.test(this.form2.mobile)) {
        this.$Message.error('手机号错误')
      } else if (this.form2.confirm_pwd !== this.form2.text_pwd) {
        this.$Message.error('两次密码不一致，请重新输入')
      } else if (this.form2.text_pwd.length < 6 || this.form2.text_pwd.length > 16) {
        this.$Message.error('密码必须为6-16位哦~~')
      } else if (this.single === false) {
        this.$Message.error('请仔细阅读用户注册协议')
      } else {
        webReg({ 'mobile': Encrypt(this.form2.mobile), 'password': this.form2.text_pwd, 'pass': this.form2.confirm_pwd, 'mobilecode': this.form2.code }).then(res => {
          if (res.data.code === 200) {
            this.$store.commit('setToken', res.data.data)
            this.$Message.success('注册成功')
            this.is_forget = 'finish'
            this.form2.mobile = ''
            this.form2.confirm_pwd = ''
            this.form2.text_pwd = ''
            this.form2.code = ''
          } else if (res.data.code === 406) {
            this.$store.commit('setToken', res.data.data)
            this.$Message.error('账号 or 密码错误')
          } else if (res.data.code === 408) {
            this.$store.commit('setToken', res.data.data)
            this.$Message.error('验证码错误')
          }
        })
      }
    },
    // 语音验证码
    voice () {
      voice({ mobile: Encrypt(this.form2.mobile) }).then(res => {
        if (res.data.code === 200) {
          this.$store.commit('setToken', res.data.data)
          this.$Message.success('语音电话拨打成功，请注意接听')
        } else if (res.data.code === 408) {
          this.$store.commit('setToken', res.data.data)
          this.$Message.error('验证码错误')
        }
      })
    },
    // 快捷登录语音验证
    voice2 () {
      voice({ 'mobile': Encrypt(this.form4.mobile) }).then(res => {
        if (res.data.code === 200) {
          this.$store.commit('setToken', res.data.data)
          this.$Message.success('语音电话拨打成功，请注意接听')
        } else if (res.data.code === 408) {
          this.$store.commit('setToken', res.data.data)
          this.$Message.error('验证码错误')
        }
      })
    },
    // 忘记密码语音验证
    voice3 () {
      voice({ 'mobile': Encrypt(this.form3.mobile) }).then(res => {
        if (res.data.code === 200) {
          this.$store.commit('setToken', res.data.data)
          this.$Message.success('语音电话拨打成功，请注意接听')
        } else if (res.data.code === 408) {
          this.$store.commit('setToken', res.data.data)
          this.$Message.error('验证码错误')
        }
      })
    },
    // 重置密码
    resetPaw () {
      var re = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (this.form3.mobile === '' || this.form3.new_pwd === '' || this.form3.code === '') {
        this.$Message.error('手机号，验证码，密码均为必填项')
      } else if (!re.test(this.form3.mobile)) {
        this.$Message.error('手机号错误')
      } else if (this.form3.new_pwd.length < 6 || this.form3.new_pwd.length > 16) {
        this.$Message.error('密码必须为6-16位哦~~')
      } else {
        resetPaw({ 'mobile': Encrypt(this.form3.mobile), 'password': this.form3.new_pwd, 'verifycode': this.form3.code }).then(res => {
          if (res.data.code === 200) {
            this.count2 = 0
            this.show2 = true
            this.$Message.success('密码重置成功')
            this.isLogin = 'login'
          }
        })
      }
    },
    // 快捷登录
    quickLogin () {
      var re = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (this.form4.mobile === '' || this.form4.code === '') {
        this.$Message.error('手机号，验证码均为必填项')
      } else if (!re.test(this.form4.mobile)) {
        this.$Message.error('手机号错误')
      } else {
        quickLogin({ 'mobile': Encrypt(this.form4.mobile), 'mobilecode': this.form4.code }).then(res => {
          if (res.data.code === 200) {
            this.$Message.success('登录成功')
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .logReg {
    width:1300px;
    height:835px;
    opacity:0.8;
    margin: 0 auto;
    position: relative;
    padding-top: 50px;
    @extend %bg-img;
    background-image: url('../../assets/images/login/back3.png');
    display: flex;
    justify-content: center;
  }
  .Bookend {
    width: 110px;
    height: 114px;
    position: absolute;
    top: 36px;
    left: 264px;
  }
  .background {
    height: 650px;
    width: 1200px;
    margin: 0 auto;
    background:rgba(255,255,255,1);
    border-radius:20px;
  }
  .con {
    width: 340px;
    height: 100%;
    margin: 0 auto;
  }
  .forget-pwd {
    width: 340px;
    height: 100%;
    margin: 0 auto;
  }
  .finish {
    width: 340px;
    height: 100%;
    margin: 0 auto;
  }
  .logo_img3 {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 60px;
    margin-bottom: 5px;
  }
  .logo_img3 img{
    width: 200px;
    height: 53px;
  }
  .description2 {
    color: #999999;
    font-size: 16px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing:4px;
    margin-bottom: 20px;
  }
  .span_on {
    color: #58C7FF !important;
    border-bottom: 1px solid #58C7FF;
  }
  .login_nav {
    color: #58C7FF;
    height: 75px;
    display: flex;
    align-items: flex-end;
  }
  .login_nav span {
    color: #999999;
    font-size: 16px;
    margin-right: 50px;
    padding-bottom: 5px;
    cursor: pointer;
  }
  .logo_img {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 50px;
  }
  .logo_img img{
    width: 200px;
    height: 53px;
  }
  .logo_img2 {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .logo_img2 img{
    width: 198px;
    height: 52px;
  }
  .description {
    color: #999999;
    font-size: 16px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing:4px;
  }
  .tel {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #EEEEEE;
  }
  .tel input {
    border: none;
    color: #A9A9A9;
    padding-left: 15px;
    outline: none;
    height: 30px;
  }
  .tel img {
    width: 18px;
    height: 22px;
  }
  .forget {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    color: #58C7FF;
    cursor: pointer;
  }
  .log {
    width:320px;
    height:50px;
    background:rgba(88,199,255,1);
    border-radius:25px;
    margin: 40px 0px 20px 10px;
  }
  .line {
    height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .line .line-lr {
    width: 150px;
    border: 1px solid #EEEEEE;
  }
  .line span:nth-of-type(2) {
    padding-bottom: 5px;
    color: #999999;
  }
  .Third {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
  }
  .Third .Third-left {
    width:120px;
    text-align: center;
    font-size: 12px;
    color: #999999;
  }
  .Third .Third-right {
    width:120px;
    text-align: center;
    font-size: 12px;
    color: #999999;
  }
  .Third img {
    margin-bottom: 5px;
  }
  .yc-bot {
    height: 40px;
    display: flex;
    justify-content: center;
    padding-top: 30px;
    box-sizing: border-box;
    color: #A9A9A9;
    font-size: 14px;
  }
  .yc-bot3 {
    height: 40px;
    display: flex;
    justify-content: center;
    padding-top: 45px;
    color: #A9A9A9;
    font-size: 14px;
  }
  .getCode {
    width:100px;
    height:24px;
    margin-left: 50px;
    line-height: 3px;
    display: flex;
    align-items: center;
    background:rgba(88,199,255,1);
    border:1px solid rgba(88,199,255,1);
    border-radius:12px;
    font-size: 13px;
    color: #FFFFFF;
  }
  .read {
    margin-top: 20px;
  }
  .count {
    width:100px;
    height:24px;
    line-height: 1px;
    margin-left: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background:rgba(88,199,255,1);
    border-radius:12px;
    font-size: 13px;
    color: #FFFFFF;
  }
  .Agreement {
    display: inline-block;
    color: #58C7FF;
    cursor: pointer;
  }
  .registered {
    width: 320px;
    height: 50px;
    background:rgba(88,199,255,1);
    border:1px solid rgba(88,199,255,1);
    border-radius:25px;
    font-size: 24px;
    margin: 0 auto;
    margin-top: 22px;
    margin-bottom: 15px;
  }
  .confirm {
    width: 100%;
    height: 50px;
    background:rgba(88,199,255,1);
    border: 1px solid rgba(88,199,255,1);
    border-radius:25px;
    font-size: 24px;
    margin: 0 auto;
    margin-top: 60px;
    margin-bottom: 15px;
  }
  .yc-bot2 {
    height: 40px;
    display: flex;
    justify-content: center;
    padding-top: 100px;
    color: #A9A9A9;
    font-size: 18px;
  }
  .content {
    margin-left: 0.34rem;
    margin-right: 0.34rem;
    font-size: 20px;
    color: #666666;
    line-height: 45px;
    text-indent: 2em;
    margin-top: 30px;
  }
  .htitle {
    margin-left: 34px;
    margin-right: 34px;
    font-size: 20px;
    color: #666666;
    font-weight: bold;
    margin-top: 38px;
    margin-bottom: 25px;
  }
  .voice {
    width: 100%;
    height: 50px;
    background-image: url('../../assets/images/login/tishi.png');
    background-repeat: no-repeat;
    color: #999999;
    font-size: 12px;
    padding-left: 15px;
    display: flex;
    padding-top: 7px;
    letter-spacing:1px;
  }
  .voice2 {
    width: 100%;
    height: 30px;
    background-image: url('../../assets/images/login/tishi.png');
    background-repeat: no-repeat;
    color: #999999;
    font-size: 12px;
    padding-left: 15px;
    display: flex;
    padding-top: 7px;
    letter-spacing:1px;
  }
  .voice span {
    color: red;
    cursor: pointer;
    display: block;
  }
  .voice2 span {
    color: red;
    cursor: pointer;
    display: block;
  }
  .success {
    width: 100%;
    height: 94px;
    margin-top: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .success img {
    width: 94px;
    height: 94px;
  }
  .prompt {
    width:100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    font-size:16px;
    font-family:MicrosoftYaHei-Bold;
    font-weight:bold;
    color:rgba(51,51,51,1);
  }
  .perfect {
    width:100%;
    height:15px;
    font-size:14px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family:MicrosoftYaHei-Bold;
    font-weight:bold;
    color:rgba(51,51,51,1);
    cursor: pointer;
  }
  .yc-bot4 {
    height: 40px;
    display: flex;
    justify-content: center;
    padding-top: 170px;
    box-sizing: border-box;
    color: #A9A9A9;
    font-size: 14px;
  }
  .tankuang {
    width: 1200px;
  }
</style>
