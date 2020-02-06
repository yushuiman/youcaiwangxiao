<template>
  <Modal v-model="visible"
    :width="490"
    :mask-closable=false
    :closable=false
    @on-visible-change="payModalVisible"
    footer-hide
    >
    <div class="pay-status-modal">
      <div class="stop_msg1">请在新打开的页面完成支付</div>
      <div class="stop_msg2" :class="{'act': finishSts}">{{finishSts ? '未完成支付，请尝试重新支付' : '支付完成前,请不要关闭此窗口'}}</div>
      <button class="finish-pay-btn" @click="callBackGetGoods(btnTxt)">{{btnTxt}}</button>
      <div class="stop_msg3">
        支付遇到问题?
        <span class="stop_service">
          <a @click="consultLink">联系客服</a>
        </span>获得帮助
      </div>
    </div>
  </Modal>
</template>

<script>
import { getGoods } from '@/api/order'

export default {
  props: {
    visible: {
      type: Boolean
    },
    orderInfo: {
      type: Object
    }
  },
  data () {
    return {
      // visible: true,
      is_live: parseInt(this.$route.query.is_live), // 1直播订单、2课程订单、3图书订单4积分订单
      btnTxt: '已完成支付',
      finishSts: false,
      consultInfo: JSON.parse(window.sessionStorage.getItem('consultInfo')) || {} // 在线咨询
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    callBackGetGoods (val) {
      if (val === '确定') {
        this.$emit('update:visible', false)
        return
      }
      getGoods({
        order_num: (this.orderInfo && this.orderInfo.order_num) ? this.orderInfo.order_num : ''
      }).then((data) => {
        const res = data.data
        if (res.code === 200) {
          if (res.data.status === 1) {
            this.$emit('update:visible', false)
            document.body.removeAttribute('style')
            this.$Message.success('支付成功')
            if (this.is_live === 2) {
              this.$router.push({ path: 'course' })
            }
            if (this.is_live === 3) {
              this.$router.push({ path: 'books' })
            }
          }
          if (res.data.status === 2) {
            this.btnTxt = '确定'
            this.finishSts = true
          }
        } else {
          this.btnTxt = '确定'
          this.finishSts = true
        }
      })
    },
    payModalVisible (val) {
      if (!val) {
        this.btnTxt = '已完成支付'
        this.finishSts = false
      }
    },
    consultLink () {
      window.open(this.consultInfo.consult_href, '_blank')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .pay-status-modal{
    padding: 1px;
    text-align: center;
    .stop_msg1{
      font-size: 20px;
      margin-top: 54px;
      margin-bottom: 12px;
    }
    .stop_msg2 {
      color: $col999;
      font-size: 14px;
      &.act{
        color: #E84342;
      }
    }
    .finish-pay-btn {
      width: 120px;
      height: 42px;
      background: $blueColor;
      color: #ffffff;
      text-align: center;
      line-height: 42px;
      border-radius: 5px;
      margin-top: 30px;
    }
    .stop_msg3 {
      margin: 30px 0;
      color: #555555;
      font-size: 14px;
      a{
        color: $blueColor;
      }
    }
    .finish-txt{
      color: #E84342;
      margin-top: 12px;
      font-size: 14px;
    }
  }
</style>
