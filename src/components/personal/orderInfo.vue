<template>
  <div class="u-order-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="order-main">
      <ul class="order-list" v-if="orderList && orderList.length">
        <li class="order-item" v-for="(item, index) in orderList" :key="index">
          <div class="o-pay-info-top">
            <div class="opi-num">
              <span>订单编号：{{item.order_num}}</span>
              <span>下单时间：{{item.adds_time}}</span>
            </div>
            <em class="opi-status" v-if="item.pay_status == 1">交易成功</em>
            <em class="opi-status waiting" v-if="item.pay_status == 2">待付款</em>
            <em class="opi-status" v-if="item.pay_status == 3">订单取消</em>
          </div>
          <div class="opi-course-info-bottom">
            <img :src="item.pc_img" alt="" class="opi-img">
            <div class="opi-detail">
              <h2 class="opi-name">{{item.name}}</h2>
              <p class="opi-price">应付金额：¥{{item.pay_price}}</p>
            </div>
            <div class="opi-btn" v-if="item.pay_status == 1">
              <button @click="seeDetails(item)">查看详情</button>
            </div>
            <div class="opi-btn" v-if="item.pay_status == 2">
              <button @click="seeDetails(item)">查看详情</button>
              <button class="pay-btn" @click="goPay(item)">去支付</button>
            </div>
          </div>
        </li>
      </ul>
      <div style="padding: 20px; text-align: center;">
        <Page
        :total="total"
        @on-change="onChange"
        :current="page"
        :page-size="limit"
        size="small"
        />
      </div>
      <div class="no-data" v-if="noDataFlag">
        暂无数据
      </div>
      <Modal v-model="visible"
        :width="795"
        footer-hide
        title="订单详情">
        <div class="opi-course-info-bottom order-detail-course">
          <img :src="orderDetail.pc_img" alt="" class="opi-img">
          <div class="opi-detail">
            <h2 class="opi-name">{{orderDetail.name}}</h2>
            <p v-if="orderDetail.is_live!=3" class="opi-teacher"><i class="teacher-icon"></i>{{orderDetail.teacher_name}}</p>
            <p v-if="orderDetail.is_live!=3" class="opi-effective">购买后{{orderDetail.study_days}}天有效</p>
          </div>
        </div>
        <div class="order-detail-address">
          <h3>订单信息</h3>
          <p v-if="orderAddress && orderAddress.address">地址：<span>{{orderAddress.consignee}}</span><span>{{orderAddress.telephone}}</span><span>{{orderAddress.address}}</span></p>
          <p>订单编号：{{orderDetail.order_num}}</p>
          <p>下单时间：{{orderDetail.add_time}}</p>
        </div>
        <div class="order-detail-price">
          <p>课程价格<span>¥{{orderDetail.price}}</span></p>
          <p>优惠金额<span>¥{{orderDetail.coupon_price}}</span></p>
          <p class="actual-payment">实付款<span>¥{{orderDetail.pay_price}}</span></p>
        </div>
        <div class="order-detail-btn">
          <button class="ccs-btn" @click="serviceLink">联系客服</button>
          <button class="cancle-pay" v-if="orderDetail.pay_status == 2" @click="payCancelOrder">取消订单</button>
          <button class="go-pay" v-if="orderDetail.pay_status == 2" @click="goPay(orderDetail)">去支付</button>
          <button v-if="orderDetail.pay_status == 1">申请发票</button>
          <button class="succ-pay" v-if="orderDetail.pay_status == 1">交易成功</button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { myOrder, alreadyOrderlist, cancelOrder } from '@/api/personal'
import { Encrypt } from '@/libs/crypto'
import { mapState, mapActions } from 'vuex'
export default {
  props: ['user_id'],
  data () {
    return {
      visible: false,
      txtArr: ['全部订单', '已支付', '未支付'],
      selIdx: this.$route.query.selIdx || 0,
      noDataFlag: false,
      orderList: [], // 订单
      orderAllList: [], // 全部订单
      orderAlearyPayList: [], // 已付款
      orderNoPayList: [], // 未付款
      orderDetail: {}, // 订单详情课程
      orderAddress: {}, // 订单详情地址
      total: 1,
      limit: 10,
      page: 1,
      pay_status: 3 // 3全部1支付2未支付
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.getMyOrder()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getMyOrder()
      })
    }
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    tabClk (v, index) {
      this.page = 1
      this.selIdx = index
      this.$router.replace({ path: '/personal',
        query: {
          ...this.$route.query,
          selIdx: index
        }
      })
      this.getMyOrder()
      // this.initRes()
    },
    getMyOrder () {
      this.pay_status = this.selIdx
      if (parseInt(this.selIdx) === 0) {
        this.pay_status = 3
      }
      this.showLoading(true)
      myOrder({
        user_id: this.user_id,
        limit: this.limit,
        page: this.page,
        pay_status: this.pay_status
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.orderList = res.data.data
          this.total = res.data.total
          // this.orderAlearyPayList = res.data.data.filter(v => {
          //   return v.pay_status === 1
          // })
          // this.orderNoPayList = res.data.data.filter(v => {
          //   return v.pay_status === 2
          // })
          // this.initRes()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    initRes () {
      this.noDataFlag = false
      if (parseInt(this.selIdx) === 0) {
        this.orderList = this.orderAllList
      }
      if (parseInt(this.selIdx) === 1) {
        this.orderList = this.orderAlearyPayList
      }
      if (parseInt(this.selIdx) === 2) {
        this.orderList = this.orderNoPayList
      }
      if (this.orderList.length === 0) {
        this.noDataFlag = true
      }
    },
    // 分页
    onChange (val) {
      this.page = val
      this.getMyOrder()
      window.scrollTo(0, 0)
    },
    // 查看详情
    seeDetails (item) {
      this.visible = true
      alreadyOrderlist({
        user_id: this.user_id,
        order_num: item.order_num
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          let { course, address } = res.data
          this.orderDetail = course
          if (address) {
            this.orderAddress = address
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 去支付
    goPay (item) {
      if (!this.token) {
        this.$router.push({ path: '/login',
          query: {
            call_back: 'personal'
          }
        })
        return
      }
      this.getUserInfo().then(() => {
        this.$router.push({ path: '/order-pay',
          query: {
            trade_number: item.order_num,
            is_live: item.is_live, // 1直播订单、2课程订单、3图书订单4积分订单
            package_id: item.package_id,
            pay_price: Encrypt(item.pay_price),
            name: Encrypt(item.name)
          }
        })
      })
    },
    // 取消订单
    payCancelOrder (item) {
      cancelOrder({
        user_id: this.user_id,
        order_num: this.orderDetail.order_num
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          if (res.data.state === 1) {
            this.visible = false
            this.getMyOrder()
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 客服
    serviceLink () {
      window.open('https://awt.zoosnet.net/lr/chatpre.aspx?id=AWT95637580', '_blank')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  @import "../../assets/scss/modal";
  .order-list{
    // max-height: 1000px;
    // overflow: auto;
    .order-item{
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    }
  }
  .o-pay-info-top{
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    background: #F5F5F5;
    color: $col999;
    font-size: 16px;
    border-radius: 8px 8px 0px 0px;
    .opi-status{
      color: $col333;
      &.waiting{
        color: #F99111;
      }
    }
    .opi-num{
      span{
        margin-right: 15px;
      }
    }
  }
  .opi-course-info-bottom{
    display: flex;
    padding: 20px;
    background: #ffffff;
    border-radius: 0px 0px 8px 8px;
    .opi-img{
      width: 100px;
      height: 60px;
      border-radius: 6px;
    }
    .opi-btn{
      margin-top: 20px;
      button{
        width: 104px;
        height: 30px;
        border-radius: 33px;
        color: #F99111;
        font-size: 18px;
        border: 1px solid #F99111;
        box-sizing: border-box;
        margin-left: 20px;
        background: none;
        &.pay-btn{
          width: 80px;
          color: #ffffff;
          background: #F99111;
        }
      }
    }
  }
  .opi-detail{
    flex: 1;
    padding: 0 20px;
    .opi-name{
      font-size: 18px;
    }
    .opi-price, .opi-teacher, .opi-effective{
      font-size: 16px;
      line-height: 22px;
      margin-top: 10px;
    }
    .opi-teacher{
      color: $col999;
      margin-top: 6px;
      .teacher-icon{
        margin-right: 8px;
        @include bg_img(16, 13, '../../assets/images/user/teacher-icon.png');
        background-size: contain;
      }
    }
    .opi-effective{
      margin-top: 3px;
      color: #F99111;
    }
  }
  .order-detail-course{
    padding: 20px 30px;
    border-top: 1px solid #E6E6E6;
    border-bottom: 1px solid #E6E6E6;
    .opi-img{
      width: 117px;
      height: 70px;
    }
  }
  .order-detail-address{
    border-bottom: 1px solid #E6E6E6;
    padding: 16px 30px;
    line-height: 24px;
    h3{
      font-size: 18px;
    }
    p{
      color: $col999;
      font-size: 16px;
      span{
        margin-right: 6px;
      }
    }
  }
  .order-detail-price{
    text-align: right;
    padding: 11px 30px;
    p{
      line-height: 22px;
      margin: 5px 0;
      font-size: 16px;
      span{
        width: 130px;
        display: inline-block;
      }
      &.actual-payment{
        font-size: 18px;
      }
    }
  }
  .order-detail-btn{
    padding: 100px 30px 30px;
    text-align: right;
    button{
      margin-left: 20px;
      font-size: 18px;
      height: 30px;
      background: none;
      &.go-pay{
        width: 80px;
        color: #ffffff;
        background: #F99111;
        border-radius: 33px;
      }
      &.succ-pay{
        color: $blueColor;
      }
    }
  }
</style>
