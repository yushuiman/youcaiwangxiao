<template>
  <div class="wechat-pay-wrap w-wrap">
    <h1>微信支付</h1>
    <div class="wechat-modal">
      <p class="price">实付金额: <span>{{pay_price}}</span></p>
      <p class="wxts">请在24小时内完成支付,否则可能导致购买失败</p>
      <img :src="ewmPayImg" alt="">
      <p class="wxpay-txt">使用微信扫描二维码进行支付</p>
    </div>
  </div>
</template>

<script>
import { getGoods } from '@/api/order'
import { mapState } from 'vuex'
import { Decrypt } from '@/libs/crypto'
import config from '@/config'

export default {
  data () {
    return {
      ewmPayImg: '', // 二维码支付
      orderInfo: JSON.parse(window.sessionStorage.getItem('payInfo')),
      package_id: this.$route.query.package_id,
      order_num: this.$route.query.trade_number,
      pay_price: Decrypt(this.$route.query.pay_price),
      is_live: this.$route.query.is_live, // 1直播订单、2课程订单、3图书订单4积分订单
      timer: null
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      token: state => state.user.token,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.ewmPayImg = config.baseUrl.pro + '/web/Pay/setCode?is_live=' + this.is_live + '&user_id=' + this.user_id + '&order_num=' + this.order_num + '&pbook_id=' + this.package_id + '&price=' + this.pay_price
      this.timer = setInterval(() => {
        this.callBackGetGoods()
      }, 2000)
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.ewmPayImg = config.baseUrl.pro + '/web/Pay/setCode?is_live=' + this.is_live + '&user_id=' + this.user_id + '&order_num=' + this.order_num + '&pbook_id=' + this.package_id + '&price=' + this.pay_price
        this.timer = setInterval(() => {
          this.callBackGetGoods()
        }, 2000)
      })
    }
  },
  methods: {
    callBackGetGoods () {
      getGoods({
        order_num: this.order_num
      }).then((data) => {
        const res = data.data
        if (res.code === 200) {
          if (res.data.status === 1) {
            this.$Message.success('支付成功')
            if (this.is_live == 2) {
              this.$router.push({ path: 'course' })
            }
            if (this.is_live == 3) {
              this.$router.push({ path: 'books' })
            }
          }
        }
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .wechat-pay-wrap{
    h1{
      font-size: 28px;
      height: 88px;
      line-height: 88px;
      color: #555555;
    }
  }
  .wechat-modal{
    background-color: #fff;
    text-align: center;
    padding: 1px;
    .price{
      margin-top: 70px;
      color: #333333;
      font-size: 14px;
      margin-bottom: 15px;
      span{
        color: #FF9B3A;
        font-size: 20px;
      }
    }
    .wxts,.wxpay-txt{
      color: $col666;
      font-size: 12px;
      margin-bottom: 20px;
    }
    img{
      width: 180px;
      height: 180px;
    }
  }
</style>
