<template>
  <div class="quick-pay-wrap w-wrap">
    <ul class="tab-list">
      <li class="tab-item" :class="{'active': selIdx == 1}" @click="tabClk(1)">开始支付</li>
      <li class="tab-item" :class="{'active': selIdx == 2}" @click="tabClk(2)">查询订单</li>
    </ul>
    <div class="quick-pay-content">
      <div class="quick-pay-info" v-if="selIdx == 1">
        <div class="qp-left">
          <ul class="payul">
            <!-- 支付方式1支付宝2微信3京东 -->
            <li><span>支付方式：</span></li>
            <li>
              <input type="radio" value="1" v-model="pay_type">
              <label for="支付宝">支付宝</label>
            </li>
            <li>
              <input type="radio" value="2" v-model="pay_type">
              <label for="微信">微信</label>
            </li>
            <li>
              <input type="radio" value="3" v-model="pay_type">
              <label for="京东">京东</label>
            </li>
          </ul>
          <ul class="payform">
            <li>
              <label for="">支付金额：</label>
              <input type="number" v-model="pay_price">
              <i>*</i>
            </li>
            <li>
                <label for="">姓名：</label>
                <input type="text" v-model="user_name">
                <i>*</i>
            </li>
            <li>
              <label for="">手机号码：</label>
              <input type="text" v-model="mobile" maxlength="11">
              <i>*</i>
            </li>
            <li>
              <label for="">课程名称：</label>
              <input type="text" v-model="course_name">
              <i>*</i>
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
                <input type="text" v-model="o_user_name">
            </li>
            <!-- <li>
              <label for="">支付单号：</label>
              <input type="number" v-model="o_order_num">
              <i>*</i>
            </li> -->
            <li>
              <label for="">手机号码：</label>
              <input type="text" v-model="o_mobile" maxlength="11">
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
      <Table :columns="columns1" :data="orderList" v-if="selIdx == 2"></Table>
    </div>
  </div>
</template>

<script>
import { getGoods, addQuickOrder, setCode2, queryQuickOrder, getGoodsQucik } from '@/api/order'
import { mapState } from 'vuex'
import { Decrypt } from '@/libs/crypto'
import config from '@/config'
let Base64 = require('js-base64').Base64

export default {
  data () {
    return {
      selIdx: 1,
      ewmPayImg: '', // 二维码支付
      order_num: '',
      mobile: '',
      course_name: '',
      user_name: '',
      pay_type: 1,
      pay_price: '',
      wxpayFlag: false,
      timer: null,
      o_user_name: '',
      o_order_num: '',
      o_mobile: '',
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
            key: 'pay_times',
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
      ]
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
  },
  methods: {
    tabClk (index) {
      this.selIdx = index
    },
    orderSeach () {
       var re = /^[1]([3-9])[0-9]{9}$/
      if (!re.test(this.o_mobile)) {
        this.$Message.error('手机号格式错误~')
        return
      } 
      if (this.o_mobile) {
        queryQuickOrder({
          // order_num: this.o_order_num,
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
        this.$Message.error('请输入订单号或手机号～')
      }
    },
    payOrder () {
      var re = /^[1]([3-9])[0-9]{9}$/
      if (!this.pay_price || !this.user_name || !this.mobile || !this.course_name) {
        this.$Message.error('请输入必填信息～')
        return
      }
      if (!re.test(this.mobile)) {
        this.$Message.error('手机号格式错误~')
        return
      } 
      addQuickOrder({
        user_name: this.user_name,
        mobile: this.mobile,
        pay_price: this.pay_price,
        pay_type: this.pay_type,
        course_name: this.course_name
      }).then((data) => {
        const res = data.data
        if (res.code === 200) {
          this.order_num = res.data.order_num
          let callback // 京东支付回调url,个人中心我的订单
          let callback2 // 测试和生产接口
          if (window.location.host == 'youcaiwx.cn') {
            callback = 'https://www.youcaiwx.cn'
            callback2 = config.baseUrl.pro
          } else {
            callback = 'https://web.youcaiwx.cn'
            callback2 = config.baseUrl.dev
          }
          // 支付宝
          if (this.pay_type == 1) {
            window.open(callback2 + '/alipay/Quickpay/zfbpay?order_num=' + this.order_num + '&name=' + '优财' + '&price=' + this.pay_price + '&body=', "_blank")
          }
          // 微信
          if (this.pay_type == 2) {
            this.ewmPayImg = callback2 + '/web/Quickpay/setCode?user_id=' + this.user_id + '&order_num=' + this.order_num
            this.wxpayFlag = true
            this.timer = setInterval(() => {
              this.callBackGetGoods()
            }, 2000)
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
            window.open(callback2 + '/demo/action/ClientOrder.php?list=' + obj, "_blank")
          }
        } else {
          this.$Message.error(res.data)
        }
      })
    },
    callBackGetGoods () {
      getGoodsQucik({
        order_num: this.order_num
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
  .quick-pay-wrap{
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
          color: #0267FF;
          &:before {
            background: #0267FF;
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
        margin-right: 10px;
      }
    }
  }
  .payform{
    li{
      padding: 15px 0;
      label{
        width: 100px;
        line-height: 34px;
        display: inline-block;
      }
      i{
        margin-left: 10px;
        color: red;
      }
      input{
        width: 200px;
        height: 34px;
        border: 1px solid $borderColor;
        border-radius: 6px;
        text-indent: 5px;
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
    width: 500px;
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
  // 查询
</style>
