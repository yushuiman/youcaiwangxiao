<template>
  <div class="quick-pay-wrap" :class="{'h5-quick-pay-wrap': isMobile == 2}">
    <div class="head-pay">
      <div class="w-wrap">
        <img src="../../assets/images/global/yc-logo.png" alt="" @click="goIndex">
        <em>｜</em>
        <span>网上快捷支付通道</span>
      </div>
    </div>
    <div class="quick-main w-wrap">
      <ul class="tab-list">
        <li class="tab-item" :class="{'active': selIdx == 1}" @click="tabClk(1)">开始支付</li>
        <li class="tab-item" :class="{'active': selIdx == 2}" @click="tabClk(2)">查询订单</li>
      </ul>
      <div class="quick-pay-content">
        <div class="quick-pay-info" v-if="selIdx == 1">
          <div class="qp-left">
            <ul class="payul">
              <!-- 支付方式1支付宝2微信3京东 -->
              <!-- isWxZfb：true代表支付宝和微信 -->
              <li><span>支付方式：</span></li>
              <li v-if="!isWxZfb">
                <input type="radio" value="1" v-model="pay_type">
                <label for="支付宝">支付宝</label>
              </li>
              <li v-if="!isWxZfb">
                <input type="radio" value="2" v-model="pay_type">
                <label for="微信">微信</label>
              </li>
              <li v-if="!isWxZfb">
                <input type="radio" value="3" v-model="pay_type">
                <label for="京东">京东</label>
              </li>
              <li v-if="!isWxZfb">
                <input type="radio" value="4" v-model="pay_type">
                <label for="银联">银联</label>
              </li>
              <li v-if="!isWxZfb">
                <input type="radio" value="5" v-model="pay_type">
                <label for="花呗分期">花呗分期</label>
              </li>
              <li v-if="isWxZfb && isMobile == 2">
                <input type="radio" value="6" v-model="pay_type">
                <label for="快捷支付">快捷支付</label>
              </li>
            </ul>
            <ul class="payform">
              <li v-if="pay_type == 4">
                <i>*</i>
                <label for="">银行卡号：</label>
                <p><input type="text" v-model="accNo" maxlength="19"></p>
              </li>
              <li v-if="pay_type == 5">
                <i>*</i>
                <label for="">分期支付：</label>
                <select class="interest-number" v-model="interest_number">
                  <option value="3">3期</option>
                  <option value="6">6期</option>
                  <option value="12">12期</option>
                </select>
              </li>
              <li>
                <i>*</i>
                <label for="">支付金额：</label>
                <p><input type="number" v-model="pay_price"></p>
              </li>
              <li>
                <i>*</i>
                <label for="">姓名：</label>
                <p><input type="text" v-model="user_name"></p>
              </li>
              <li>
                <i>*</i>
                <label for="">手机号码：</label>
                <p><input type="text" v-model="mobile" maxlength="11"></p>
              </li>
              <li>
                <i>*</i>
                <label for="">课程名称：</label>
                <p><input type="text" v-model="course_name"></p>
              </li>
              <li>
                <label for=""></label>
                <button class="btn-com quick-btn" @click="payOrder">开始支付</button>
              </li>
            </ul>
          </div>
          <div class="qp-right">
            <p>注意：</p>
            <p>1.客户支付成功后，请点击<span>返回用户</span>，或者<span>详情</span>获取订单号；</p>
            <p>2.支付成功后，请将订单号和自己的姓名和报班信息发给咨询老师。</p>
            <div class="ewm-pay" v-if="wxpayFlag">
              <img :src="ewmPayImg" alt="支付二维码" class="wx-code">
              <p>请用微信扫描此二维码完成支付</p>
            </div>
            <img v-else src="../../assets/images/order/pay2.jpg" alt="" width="100">
          </div>
        </div>
        <div class="quick-pay-info quick-order-info" v-if="selIdx == 2">
          <div class="qp-left">
            <ul class="payform">
              <li>
                  <label for="">姓名：</label>
                  <p><input type="text" v-model="o_user_name"></p>
              </li>
              <!-- <li>
                <label for="">支付单号：</label>
                <input type="number" v-model="o_order_num">
                <i>*</i>
              </li> -->
              <li>
                <label for="">手机号码：</label>
                <p><input type="text" v-model="o_mobile" maxlength="11"></p>
                <i>*</i>
              </li>
              <li>
                <label for=""></label>
                <button class="btn-com quick-btn" @click="orderSeach">查询</button>
              </li>
            </ul>
          </div>
          <div class="qp-right">
            <img src="../../assets/images/order/pay2.jpg" alt="" width="100">
          </div>
        </div>
        <div class="order-search" v-if="selIdx == 2">
          <Table :columns="columns1" :data="orderList"></Table>
        </div>
      </div>
    </div>
    <footer id="footer">
      <div class="footer-wrap">
        <div class="footer-top w-wrap">
          <img src="@/assets/images/global/yc-logo-gray.png" alt="logo" class="yc-logo">
        </div>
        <div class="footer_center">
          <div class="w-wrap clearfix">
            <ul class="footer-instru" v-for="(item, index) in footerNavList" :key="index">
              <li>
                <h1>{{item.title}}</h1>
              </li>
              <li v-for="(val, key) in item.son" :key="key">
                <router-link :to="{path: 'foot-detail', query: {footer_id: val.footer_id}}" v-if="val.is_jump == 2">{{val.title}}</router-link>
                <a :href="val.jump_href" v-else>{{val.title}}</a>
              </li>
            </ul>
            <div class="erweima">
              <img src="@/assets/images/global/ewm-icon.png" alt="">
              <p>优财网校APP</p>
            </div>
          </div>
        </div>
        <div class="footer-bottom w-wrap">
          <p><a href="https://youcai2020.oss-cn-beijing.aliyuncs.com/style/images/20180904/F58FBBE07FB7268C8F37F0524B52BF37.jpg" target="_blank">营业执照</a><a href="https://youcai2020.oss-cn-beijing.aliyuncs.com/style/pdf/20181120/13F2CCEDD2AFDD16839A4A7DB644274D.pdf" target="_blank" style="margin-left: 20px;">出版物经营许可证</a></p>
          <p>2014-{{curYear}} 优财智业（北京）科技发展有限公司-美国注册管理会计师CMA认证培训 CMA培训专家 版权所有</p>   
          <p><a href="https://beian.miit.gov.cn/" target="_blank">京IPC备10036536号-8</a><img src="@/assets/images/global/gongan.png" alt="">京公网安备 11010802020104号<span>客服电话：400-867-5318</span></p>
          <!-- <p>客服电话：400-867-5318</p> -->
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { getGoods, addQuickOrder, setCode2, queryQuickOrder, getGoodsQucik, getQrcode } from '@/api/order'
import { footerNav } from '@/api/index'
import { mapState } from 'vuex'
import { Decrypt } from '@/libs/crypto'
import config from '@/config'
let Base64 = require('js-base64').Base64

export default {
  data () {
    return {
      footerNavList: [],
      curYear: '2021',
      selIdx: 1,
      ewmPayImg: '', // 二维码支付
      order_num: '',
      accNo: '', // 4367420010390365237
      mobile: '',
      course_name: '', // ceshi
      user_name: '',
      pay_type: 1,
      pay_price: '',
      wxpayFlag: false,
      timer: null,
      o_user_name: '',
      o_order_num: '',
      o_mobile: '',
      interest_number: 3,
      orderList: [],
      columns1: [
        {
            type: 'index',
            title: '编号',
            key: 'index',
            minWidth: 60,
            align: 'center'
        },
        {
            title: '金额',
            key: 'pay_price',
            minWidth: 90,
            align: 'center'
        },
        {
            title: '支付单号',
            key: 'order_num',
            minWidth: 150,
            align: 'center'
        },
        {
            title: '支付类型',
            key: 'pay_type',
            minWidth: 90,
            align: 'center'
        },
        {
            title: '支付时间',
            key: 'pay_time',
            minWidth: 110,
        },
        {
            title: '姓名',
            key: 'user_name',
            minWidth: 80,
            align: 'center'
        },
        {
            title: '课程',
            key: 'course_name',
            minWidth: 180,
            align: 'center'
        },
        {
            title: '电话',
            key: 'mobile',
            minWidth: 120,
            align: 'center'
        },
        {
          title: '状态',
          key: 'pay_status',
          minWidth: 90,
          align: 'center'
        }
      ],
      isMobile: 1, // 1浏览器2手机
      isWxZfb: false // 微信.支付宝打开
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      token: state => state.user.token
    })
  },
  watch: {
    pay_type: function (val) {
      if (val != 2) {
        this.wxpayFlag = false
      }
    }
  },
  mounted () {
    this.getFooterNav()
    let ua = window.navigator.userAgent.toLowerCase()
    if (this._isMobile()) {
      this.isMobile = 2 // h5
      if (ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/Alipay/i) == 'alipay') {
        this.isWxZfb = true
        this.pay_type = 6
        // alert('微信/支付宝')
      } else {
        this.isWxZfb = false
        // alert('外部浏览器')
      }
    } else {
      this.isMobile = 1 // pc
      var myDate = new Date()
      this.curYear = myDate.getFullYear()
    }
  },
  methods: {
    goIndex () {
      this.$router.push('/')
    },
    getFooterNav () {
      footerNav().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.footerNavList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    _isMobile () {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag
    },
    tabClk (index) {
      this.selIdx = index
    },
    orderSeach () {
      var re = /^[1]([3-9])[0-9]{9}$/
      if (this.o_mobile == '') {
        this.$Message.error('请输入手机号~')
        return
      } 
      if (!re.test(this.o_mobile)) {
        this.$Message.error('手机号格式错误~')
        return
      } 
      if (this.o_mobile) {
        queryQuickOrder({
          o_user_name: this.o_user_name,
          mobile: this.o_mobile,
        }).then((data) => {
          const res = data.data
          if (res.code === 200) {
            this.orderList = res.data
          } else {
            this.$Message.error(res.data)
          }
        })
      } else {
        this.$Message.error('请输入或手机号～')
      }
    },
    payOrder () {
      var re = /^[1]([3-9])[0-9]{9}$/
      var regExp = /^([1-9]{1})(\d{15}|\d{18})$/
      if (!this.pay_price || !this.user_name || !this.mobile || !this.course_name) {
        this.$Message.error('请输入必填信息～')
        return
      }
      if (!re.test(this.mobile)) {
        this.$Message.error('手机号格式错误~')
        return
      }
      if (this.pay_type == 4) {
        if(!this.accNo) {
          this.$Message.error('请输入必填信息～')
          return
        }
        if (!regExp.test(this.accNo)) {
          this.$Message.error('银行卡格式错误~')
          return
        }
      }
      let fenqi_num = 0
      if (this.pay_type == 5) {
        fenqi_num = this.interest_number
      }
      addQuickOrder({
        user_name: this.user_name,
        mobile: this.mobile,
        pay_price: this.pay_price,
        pay_type: this.pay_type,
        course_name: this.course_name,
        fenqi_num: fenqi_num // 分期期数
      }).then((data) => {
        const res = data.data
        if (res.code === 200) {
          this.order_num = res.data.order_num
          let callback // 京东支付回调url,个人中心我的订单
          let callback2 // 测试和生产接口
          if (window.location.href.indexOf('web.youcaiwx.cn') > -1) {
            callback = 'https://web.youcaiwx.cn'
            callback2 = config.baseUrl.dev
          } else {
            callback = 'https://www.youcaiwx.cn'
            callback2 = config.baseUrl.pro
          }
          // 支付宝
          if (this.pay_type == 1) {
            if (this.isMobile == 1) {
              window.open(callback2 + '/alipay/Quickpay/zfbpay?order_num=' + this.order_num + '&name=' + '优财' + '&price=' + this.pay_price + '&body=' + '&activity_type=' + this.isMobile, "_blank")
            }
            if (this.isMobile == 2) {
              window.location.href = callback2 + '/alipay/Quickpay/zfbpay?order_num=' + this.order_num + '&name=' + '优财' + '&price=' + this.pay_price + '&body=' + '&activity_type=' + this.isMobile
            }
          }
          // 微信
          if (this.pay_type == 2) {
            if (this.isMobile == 1) {
              this.ewmPayImg = callback2 + '/web/Quickpay/setCode?order_num=' + this.order_num + '&activity_type=' + this.isMobile
              this.wxpayFlag = true
              this.timer = setInterval(() => {
                this.callBackGetGoods(this.order_num)
              }, 2000)
            }
            if (this.isMobile == 2) {
              this.quickSetCode()
            }
          }
          // 京东
          if (this.pay_type == 3) {
            let tradeTime = this.transformTime()
            let amount = this.pay_price * 100
            let obj = Base64.encode(JSON.stringify({
              version: 'V2.0',
              merchant: '111934986001',
              device: '111',
              tradeNum: this.order_num + '',
              tradeName: this.order_num + '',
              tradeDesc: '',
              tradeTime: tradeTime,
              amount: amount + '', // 价格
              currency: 'CNY',
              note: '',
              callbackUrl: callback + '/quick-pay',
              notifyUrl: callback2 + '/jdpay/Quickpayaction/execute',
              ip: '10.45.251.153',
              userType: '',
              userId: '22222222',
              expireTime: '',
              industryCategoryCode: '',
              orderType: '1',
              specCardNo: '',
              specId: '',
              specName: '',
              saveUrl: 'https://wepay.jd.com/jdpay/saveOrder'
            }))
            if (this.isMobile == 1) {
              window.open(callback2 + '/demo/action/ClientOrder.php?list=' + obj, "_blank")
            }
            if (this.isMobile == 2) {
              window.location.href = callback2 + '/demo/action/ClientOrder.php?list=' + obj
            }
          }
          // 银联
          if (this.pay_type == 4) {
            if (this.isMobile == 1) {
              window.open(callback2 + '/Unionpay/Unionconsume/unionpay?order_num=' + this.order_num + '&name=' + this.course_name + '&price=' + this.pay_price + '&accNo=' + this.accNo + '&phoneNo=' + this.mobile, "_blank")
            }
            if (this.isMobile == 2) {
              window.location.href = callback2 + '/Unionpay/Unionconsume/unionpay?order_num=' + this.order_num + '&name=' + this.course_name + '&price=' + this.pay_price + '&accNo=' + this.accNo + '&phoneNo=' + this.mobile
            }
          }
          // 花呗分期3 6 12
          if (this.pay_type == 5) {
            if (this.isMobile == 1) {
              window.open(callback2 + '/alipay/Tokiopay/huabeipay?order_num=' + this.order_num + '&name=' + this.course_name + '&price=' + this.pay_price + '&accNo=' + this.accNo + '&phoneNo=' + this.mobile + '&interest_number=' + this.interest_number, "_blank")
            }
            if (this.isMobile == 2) {
              window.location.href = callback2 + '/alipay/Tokiopay/huabeipay?order_num=' + this.order_num + '&name=' + this.course_name + '&price=' + this.pay_price + '&accNo=' + this.accNo + '&phoneNo=' + this.mobile + '&interest_number=' + this.interest_number
            }
          }
          // 新银联
          if (this.pay_type == 6) {
            getQrcode({
              order_num: this.order_num,
              name: this.course_name,
              price: this.pay_price,
              pay_type: this.pay_type,
              // accNo: this.accNo,
              phoneNo: this.mobile
            }).then((data) => {
              const res = data.data
              if (res.errCode === 'SUCCESS') {
                if (this.isMobile == 1) {
                  // window.open(callback2 + '/unionpay/Cbpay/getQrcode?order_num=' + this.order_num + '&name=' + this.course_name + '&price=' + this.pay_price + '&accNo=' + this.accNo + '&phoneNo=' + this.mobile, "_blank")
                  window.open(res.billQRCode, "_blank")
                }
                if (this.isMobile == 2) {
                  window.location.href = res.billQRCode
                }
              }
            })
          }
        } else {
          this.$Message.error(res.data)
        }
      })
    },
    quickSetCode () {
      setCode2({
        order_num: this.order_num,
        activity_type: this.isMobile
      }).then((data) => {
        const res = data.data
        if (res.code === 200) {
          window.location.href = res.data.mweb_url
          this.timer = setInterval(() => {
            this.callBackGetGoods(this.order_num)
          }, 2000)
        } else {
          this.$Message.error(res.data)
        }
      })
    },
    callBackGetGoods (ordernum) {
      getGoodsQucik({
        order_num: ordernum
      }).then((data) => {
        const res = data.data
        if (res.code === 200) {
          if (res.data.status === 1) {
            this.$Message.success('支付成功')
            this.mobile = ''
            this.course_name = ''
            this.user_name = ''
            this.pay_price = ''
            this.pay_type = 1
            this.wxpayFlag = false
            clearInterval(this.timer)
            this.timer = null
          }
        }
      })
    },
    transformTime () {
      var time = new Date()
      var y = time.getFullYear()
      var M = time.getMonth() + 1
      var d = time.getDate()
      var h = time.getHours()
      var m = time.getMinutes()
      var s = time.getSeconds()
      return y + '' + this.addZero(M) + '' + this.addZero(d) + '' + this.addZero(h) + '' + this.addZero(m) + '' + this.addZero(s)
    },
    addZero (m) {
      return m < 10 ? '0' + m : m
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .head-pay{
    height: 60px;
    line-height: 60px;
    background: #ffffff;
    color: $col333;
    font-size: 18px;
    .w-wrap{
      width: 1300px;
    }
    img{
      width: 130px;
      vertical-align: middle;
      margin-top: -3px;
      cursor: pointer;
    }
    em{
      color: $col999;
      margin: 0 3px;
    }
  }
  .quick-main{
    padding: 50px 0;
  }
  .quick-pay-content{
    padding: 50px 100px;
    box-shadow: 0 2px 20px 0 rgba(140,196,255,.3);
    border-radius: 8px;
    background: #ffffff;
  }
  .tab-list {
      display: flex;
      align-items: center;
      text-align: center;
      margin-bottom: 20px;
      font-size: 18px;
      .tab-item {
        margin: 0 30px;
        position: relative;
        cursor: pointer;
        &:before {
          position: absolute;
          content: "";
          left: 50%;
          width: 36px;
          height: 2px;
          background: none;
          margin-top: 22px;
          margin-left: -18px;
        }
        &.active {
          color: #066AE4;
          &:before {
            background: #066AE4;
          }
        }
    }
  }
  // 支付
  .quick-pay-info{
    display: flex;
    justify-content: space-between;
  }
  .payul{
    display: flex;
    li{
      cursor: pointer;
      padding: 15px 0;
      span{
        font-weight: bold;
        width: 100px;
        display: inline-block;
      }
      label{
        margin-left: 3px;
        margin-right: 15px;
      }
    }
  }
  .payform{
    // width: 65%;
    li{
      padding: 15px 0;
      line-height: 34px;
      display: flex;
      label{
        width: 100px;
        display: inline-block;
      }
      i{
        margin-right: 3px;
        color: red;
      }
      p{
        width: 200px;
        // flex: 1;
        height: 34px;
        border: 1px solid $borderColor;
        border-radius: 6px;
        input{
          width: 100%;
          line-height: normal;
          text-indent: 5px;
          border: none;
          background: transparent;
        }
      }
      .interest-number{
        width: 200px;
      }
    }
  }
  .quick-btn{
    width: 120px;
    margin-left: 40px;
    margin-top: 20px;
    color: #ffffff;
    background: $blueColor;
  }
  .qp-left{
    flex: 1;
  }
  .qp-right{
    width: 420px;
    p{
      line-height: 30px;
      span{
        color: red;
      }
    }
    img{
      width: 395px;
      margin-top: 40px;
      &.wx-code{
        width: 220px;
      }
    }
  }
  .ewm-pay{
    text-align: center;
    p{
      font-size: 18px;
      color: #f99111;
      font-weight: bold;
    }
  }
  .order-search{
    margin-top: 30px;
  }
  // 移动端
  .h5-quick-pay-wrap {
    .head-pay{
      padding: 0 .266667rem /* 20px -> .266667rem */;
      height: .8rem /* 60px -> .8rem */;
      line-height:.8rem /* 60px -> .8rem */;
      background: #ffffff;
      color: $col333;
      font-size: 0.24rem;
      img{
        width: 1.733333rem;
        vertical-align: middle;
        margin-top: -3px;
      }
      em{
        color: $col999;
        margin: 0 3px;
      }
    }
    .quick-main{
      padding: .666667rem 0;
      width: auto;
    }
    .quick-pay-content{
      padding: .666667rem .4rem;
      border-radius: .106667rem;
    }
    .tab-list {
        display: flex;
        align-items: center;
        text-align: center;
        margin-bottom: .266667rem;
        font-size: .426667rem;
        .tab-item {
          margin: 0 .4rem;
          position: relative;
          cursor: pointer;
          &:before {
            position: absolute;
            content: "";
            left: 50%;
            width: .48rem;
            height: .026667rem;
            background: none;
            margin-top: .533333rem;
            margin-left: -0.24rem;
          }
          &.active {
            color: #066AE4;
            &:before {
              background: #066AE4;
            }
          }
      }
    }
    // 支付
    .quick-pay-info{
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    }
    .payul{
      li{
        padding: .2rem 0;
        span{
          width: 2.4rem;
        }
        label{
          margin-left: .08rem;
          margin-right: .533333rem;
        }
      }
    }
    .payform{
      li{
        padding: .2rem 0;
        line-height: .96rem;
        label{
          width: 2.4rem;
        }
        i{
          margin-left: .133333rem;
        }
        p{
          width: 60%;
          // flex: 1;
          height: .96rem;
          border: 1px solid $borderColor;
          border-radius: .08rem;
          input{
            width: 100%;
            text-indent: .066667rem;
            border: none;
          }
        }
      }
      .interest-number{
        width: 60%;
      }
    }
    .quick-btn{
      width: 2.666667rem;
      height: .853333rem;
      font-size: .426667rem;
      border-radius: .106667rem;
      margin-left: 0;
      margin-top: .266667rem;
    }
    .qp-right{
      width: 100%;
      font-size: .373333rem;
      p{
        line-height: .533333rem;
      }
      img{
        width: 100%;
        margin-top: .533333rem;
        &.wx-code{
          width: 2.933333rem;
        }
      }
    }
    .ewm-pay{
      p{
        font-size: .48rem;
      }
    }
    .order-search{
      margin-top: 0.4rem;
    }
    #footer{
      display: none;
    }
  }
  // footer
  #footer {
    // height: 354px;
    background: #3B3B3B;
    .footer-wrap{
      padding: 0 3%;
    }
   }
   .footer-top {
     height: 93px;
     .yc-logo{
       width: 144px;
      //  height: 38px;
       margin-top: 29px;
     }
   }
   .footer_center {
     padding: 19px 0 16px 0;
    //  height: 204px;
     border-top: 2px solid $col666;
     border-bottom: 2px solid $col666;
     box-sizing: border-box;
   }
   .footer-instru {
     margin-left: 146px;
     float: left;
     &:first-child{
       margin-left: 0px;
     }
     li {
       line-height: 30px;
       h1 {
         font-size: 18px;
         color: #EFEFEF;
         margin-bottom: 18px;
       }
       a{
         color: $col999;
       }
     }
   }
   .erweima{
     float: right;
     text-align: center;
     margin-top: 6px;
     img {
       width: 119px;
       height: 119px;
       margin-bottom: 14px;
     }
     p {
       color: $col999;
     }
   }
  .footer-bottom {
    padding: 10px 0;
    // height: 55px;
    line-height: 24px;
    text-align: center;
    // @include display_flex(flex);
    // @extend %justify-content;
    // @extend %alignitem_center;
    p{
      color: $col999;
      span{
        margin-left: 20px;
      }
      img{
        vertical-align: middle;
        margin-top: -5px;
        margin-left: 20px;
      }
    }
    a{
      color: $col999;
    }
  }
</style>
