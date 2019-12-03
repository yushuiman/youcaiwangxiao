<template>
  <div class="order-pay-wrap w-wrap">
    <div class="orpay-info">
      <div class="orpay-top">
        <p class="p1"><span>订单提交成功，请尽快支付～</span><em>订单金额：¥{{orderInfo.pay_price}}</em></p>
        <p class="p2">请在24小时内完成支付，超时后将取消订单</p>
      </div>
      <div class="orpay-bt">
        <p class="p3"><span>订单编号：</span>{{orderInfo.order_num}}</p>
        <p class="p4"><span>商品名称：</span>{{orderInfo.name}}</p>
      </div>
    </div>
    <div class="orpay-way-info">
      <p class="orpay-tit">支付方式</p>
      <ul class="orpay-way">
        <li class="zfb-way" :class="{'cur': pay_type == 4}" @click="changePayWay(4)">
          <div class="bottomright" v-if="pay_type == 4">
            <div class="triangle"></div>
            <Icon type="md-checkmark" />
          </div>
        </li>
        <li class="wx-way" :class="{'cur': pay_type == 2}" @click="changePayWay(2)">
          <div class="bottomright" v-if="pay_type == 2">
            <div class="triangle"></div>
            <Icon type="md-checkmark" />
          </div>
        </li>
        <li class="jd-way" :class="{'cur': pay_type == 8}" @click="changePayWay(8)">
          <div class="bottomright" v-if="pay_type == 8">
            <div class="triangle"></div>
            <Icon type="md-checkmark" />
          </div>
        </li>
      </ul>
      <div class="orpay-cashier">
        <p>应付金额：<span>¥{{orderInfo.pay_price}}</span></p>
        <button @click="subPayOrder">立即支付</button>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config'
import { mapState, mapActions } from 'vuex'
let Base64 = require('js-base64').Base64
export default {
  data () {
    return {
      orderInfo: JSON.parse(window.sessionStorage.getItem('payInfo')),
      pay_type: 4, // 1银联2微信3余额4支付宝5后台6积分越换
      order_num: this.$route.query.trade_number, // 订单号
      is_live: this.$route.query.is_live // 1直播订单、2课程订单、3图书订单4积分订单
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      token: state => state.user.token
    })
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    // 支付订单
    subPayOrder () {
      this.getUserInfo().then(() => {
        // 支付宝
        if (this.pay_type === 4) {
          window.location.href = config.baseUrl.pro + '/alipay/Pagepay/zfbpay?order_num=' + this.orderInfo.order_num + '&name=' + '优财' + '&price=' + this.orderInfo.pay_price + '&body='
          // window.open(config.baseUrl.pro + '/alipay/Pagepay/zfbpay?order_num=' + this.orderInfo.order_num + '&name=' + '优财' + '&price=' + this.orderInfo.pay_price + '&body=' + '')
        }
        // 微信
        if (this.pay_type === 2) {
          this.$router.push({
            path: '/wechat-pay',
            query: { trade_number: this.order_num, is_live: this.is_live }
          })
        }
        // 京东
        if (this.pay_type === 8) {
          let tradeTime = this.transformTime()
          let amount = this.orderInfo.pay_price * 100
          let callback = config.baseUrl.pro + '/personal?order'
          if (this.is_live === 2) {
            callback = config.baseUrl.pro + '/personal'
          }
          let obj = Base64.encode(JSON.stringify({
            version: 'V2.0',
            merchant: '111934986001',
            device: '111',
            tradeNum: this.orderInfo.order_num + '',
            tradeName: this.orderInfo.order_num + '',
            tradeDesc: '',
            tradeTime: tradeTime,
            amount: amount + '', // 价格
            currency: 'CNY',
            note: '',
            callbackUrl: callback,
            notifyUrl: config.baseUrl.pro + '/Jdpay/AsynNotifyAction/execute',
            ip: '10.45.251.153',
            userType: '',
            userId: this.user_id + '',
            expireTime: '',
            industryCategoryCode: '',
            orderType: '1',
            specCardNo: '',
            specId: '',
            specName: '',
            saveUrl: 'https://wepay.jd.com/jdpay/saveOrder'
          }))
          window.location.href = 'http://ycapi.youcaiwx.com/demo/action/ClientOrder.php?list=' + obj
          // window.open('http://ycapi.youcaiwx.com/demo/action/ClientOrder.php?list=' + obj)
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
    },
    // 选择支付方式
    changePayWay (type) {
      this.pay_type = type
    }
  }
}
</script>n

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .order-pay-wrap{
    padding-bottom: 20px;
  }
  .orpay-info,.orpay-way-info{
    padding: 30px 50px;
    margin-top: 20px;
    background: #ffffff;
  }
  .orpay-info{
    background:#ffffff url('../../assets/images/order/order_img6.png') no-repeat 50px center;
    background-size: 60px 60px;
    padding-left: 160px;
  }
  .orpay-top{
    padding-bottom: 10px;
    border-bottom: 1px solid $blueColor;
    .p1{
      margin-bottom: 10px;
      span,em{
        width: 50%;
        display: inline-block;
      }
      span{
        font-size: 22px;
      }
      em{
        text-align: right;
      }
    }
    .p2{
      font-size: 12px;
      color: $col999;
      margin-top: 10px;
    }
  }
  .orpay-bt{
    padding-top: 10px;
    font-size: 16px;
    p{
      &.p4{
        margin-top: 10px;
      }
      span{
        color: $blueColor;
      }
    }
  }
  .orpay-way-info{
    .orpay-way{
      padding: 30px 0;
      display: flex;
      li{
        width: 175px;
        height: 70px;
        margin-right: 30px;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        &.zfb-way{
          background-image: url('../../assets/images/order/order_zfb.png');
          background-size: 113px 37px;
        }
        &.wx-way{
          background-image: url('../../assets/images/order/order_wechat.png');
          background-size: 127px 34px;
        }
        &.jd-way{
          background-image: url('../../assets/images/order/order_jd.png');
          background-size: 120px 37px;
        }
        &.cur{
          border: 2px solid $blueColor;
        }
      }
    }
  }
  .bottomright{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 20px;
    height: 20px;
    .triangle{
      width: 0;
      height: 0;
      border-bottom: 20px solid $blueColor;
      border-left: 20px solid transparent;
    }
    i{
      position: absolute;
      right: -1px;
      bottom: 0;
      color: #fff;
      font-size: 12px;
    }
  }
  .orpay-cashier{
    text-align: right;
    span{
      color: #FF9B3A;
      font-size: 24px;
    }
    button{
      width: 140px;
      height: 40px;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      background-color: $blueColor;
      border-radius: 2px;
      margin-top: 30px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }
  }
</style>
