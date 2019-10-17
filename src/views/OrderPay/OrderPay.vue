<template>
  <div class="order-pay-wrap w-wrap">
    <h1 class="order-tit">确认订单</h1>
    <div class="order-pay-com user-addess">
      <h2>收获地址</h2>
      <div class="edit-address">
        <ul class="address-list">
          <li class="address-item" v-for="(item, index) in addressList" :key="index">
            <p class="adr-name">
              <span>{{item.consignee}}</span>
              <span class="moren" v-if="item.is_default == 1">默认地址</span>
            </p>
            <p class="adr-mobile">{{item.telephone}}</p>
            <p class="adr-detail">{{item.address}}</p>
            <p class="adr-change"><span @click="changeAddress(1,item)">修改</span></p>
          </li>
          <li class="address-item add-new-adress" @click="changeAddress(2)">
            <span></span>
            <p>添加新地址</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="order-pay-com course-detail">
      <h2>商品信息</h2>
      <div class="curse-info">
        <img class="curse-img" :src="packages.app_img" alt="">
        <div class="curse-instr">
          <h3>{{packages.name}}</h3>
          <p>讲师：{{packages.teacher_name}}</p>
          <p>有效期：{{packages.validity}}天</p>
        </div>
        <span class="curse-price">{{packages.price}}元</span>
      </div>
    </div>
    <div class="order-pay-com make-bill">
      <h2>发票信息<span>开企业抬头发票须填写纳税人识别号，以免影响报销</span></h2>
      <div class="need-bill">
        <RadioGroup v-model="bill" @on-change="onBillChange">
          <Radio label="不需要" class="rai"></Radio>
          <Radio label="需要" class="rai"></Radio>
        </RadioGroup>
      </div>
    </div>
    <div class="order-pay-com use-coupon" v-if="coupon_num > 0">
      <h2>优惠券</h2>
      <ul class="coupon-list">
        <li class="coupon-item" :class="{'cur': useCouponIndx == index}" v-for="(item, index) in couponList" :key="index"
        @click="useCoupon(item, index)">
          <span class="c-price" v-if="item.is_type == 1">¥<em>{{item.coupon_price}}</em></span>
          <span class="c-price" v-if="item.is_type == 2"><em>{{item.coupon_price}}</em>折</span>
          <div class="c-detail">
            <p class="c-full-reduce">{{item.name}}</p>
            <p class="c-validity">有效期至{{item.end_time}}</p>
            <span class="c-use">{{rangeSts[item.range]}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="order-pay-com sub-order">
      <p><Checkbox v-model="agree" @on-change="agreReadChange"></Checkbox>我已阅读并同意<a href="http://www.youcaiwx.com/html/app/pc_buy.html" target="_blank">《 用户付费协议 》</a></p>
      <div class="total-info">
        <span>共<em>{{buyNum}}</em>件商品</span>
        <span>应付：<i>{{totalPrice}}元</i></span>
        <button>提交订单</button>
      </div>
    </div>
    <Modal
      title="编辑收货人信息"
      v-model="visibleAddress"
      footer-hide
      :width="795"
      class="iview-modal">
      <div class="edit-wrap">
        <div class="goods">
          <input type="text" placeholder="收货人" v-model="curAddressInfo.consignee">
          <input style="margin-left: 20px" type="text" maxlength="11" v-model="curAddressInfo.telephone" placeholder="手机号码">
        </div>
        <div>
          <input class="detalis_address" type="text" maxlength="100" v-model="curAddressInfo.address" placeholder="详细地址：省市区、道路、门牌号、小区、楼栋号、单元室等">
        </div>
        <button class="btn-com btn-edit" v-if="typeAddres == 1" @click="editAddress">修改</button>
        <button class="btn-com btn-edit" v-if="typeAddres == 2" @click="addNewAdress">确定</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { showOrder, addOrder, availableCoupon } from '@/api/order'
import { editAddress, addAddress } from '@/api/personal'

import { mapState } from 'vuex'
export default {
  data () {
    return {
      buyNum: 1, // 购买数量
      bill: '不需要',
      agree: true,
      package_id: this.$route.query.package_id,
      visibleAddress: false,
      packages: {}, // 商品信息
      addressList: [], // 地址list
      curAddressInfo: {
        consignee: '',
        telephone: '',
        address: ''
      }, // 地址手机号昵称
      typeAddres: 0, // 修改、新增区分
      rangeSts: {
        1: '仅限正课使用',
        2: '仅限直播使用',
        3: '全局使用'
      },
      couponList: [], // 可用优惠券
      coupon_num: 0, // 可用优惠券张数
      useCouponIndx: 0, // 选择的优惠券index
      useCouponId: 0, // 选择的优惠券id
      totalPrice: 0 // 最终价格
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
      this.getShowOrder() // 订单信息
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getShowOrder() // 订单信息
      })
    }
  },
  methods: {
    onBillChange (val) {
      console.log(val)
    },
    agreReadChange (val) {
      console.log(val)
    },
    // 订单信息
    getShowOrder () {
      showOrder({
        user_id: this.user_id,
        package_id: this.package_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.addressList = res.data.address
          this.packages = res.data.packages
          this.coupon_num = res.data.coupon_num
          this.totalPrice = res.data.packages.price
          if (res.data.coupon_num > 0) {
            this.getCoupon() // 优惠券
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 地址手机号昵称验证
    checkForm () {
      // 新增收货地址name
      if (this.curAddressInfo.consignee === '') {
        this.$Message.error('请输入昵称')
        return false
      }
      if (/^\s+$/gi.test(this.curAddressInfo.consignee) || this.curAddressInfo.consignee.trim() === '') {
        this.$Message.error('不能全为空格')
        return false
      }
      if (this.curAddressInfo.consignee.length > 20) {
        this.$Message.error('昵称最多20个字符')
        return false
      }
      // 新增收货地址mobile
      if (this.curAddressInfo.telephone === '') {
        this.$Message.error('请输入手机号')
        return false
      }
      const reg = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/
      if (!(reg.test(this.curAddressInfo.telephone))) {
        this.$Message.error('该手机号不符合格式')
        return false
      }
      if (this.curAddressInfo.address === '') {
        this.$Message.error('请输入地址')
        return false
      }
      return true
    },
    // 修改收货地址
    changeAddress (type, v) {
      // type1修改 type2新增
      this.typeAddres = type
      if (type === 2) {
        if (this.addressList.length === 5) {
          this.$Message.error('最多可创建5个收货地址')
          return
        }
        this.visibleAddress = true
        return
      }
      this.visibleAddress = true
      this.curAddressInfo = v
    },
    // 新增收获地址
    addNewAdress () {
      if (!this.checkForm()) {
        return
      }
      addAddress({
        user_id: this.user_id,
        consignee: this.curAddressInfo.consignee,
        telephone: this.curAddressInfo.telephone,
        address: this.curAddressInfo.address,
        is_default: 2
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.getShowOrder()
          this.curAddressInfo.consignee = ''
          this.curAddressInfo.telephone = ''
          this.curAddressInfo.address = ''
          this.visibleAddress = false
        }
      })
    },
    // 修改收货地址
    editAddress () {
      if (!this.checkForm()) {
        return
      }
      editAddress({
        user_id: this.user_id,
        address_id: this.curAddressInfo.address_id,
        consignee: this.curAddressInfo.consignee,
        telephone: this.curAddressInfo.telephone,
        address: this.curAddressInfo.address,
        is_default: this.curAddressInfo.is_default
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.getShowOrder()
          this.curAddressInfo.consignee = ''
          this.curAddressInfo.telephone = ''
          this.curAddressInfo.address = ''
          this.visibleAddress = false
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 优惠券列表
    getCoupon () {
      availableCoupon({
        user_id: this.user_id,
        package_id: this.package_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.couponList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 使用优惠券
    useCoupon (item, index) {
      this.useCouponIndx = index
      this.useCouponId = item.coupon_id
      // 1满减2打折
      if (item.is_type === 1) {
        this.totalPrice = this.packages.price - item.coupon_price
      }
      if (item.is_type === 2) {
        this.totalPrice = this.packages.price * (item.coupon_price / 10)
      }
    },
    // 提交订单
    subAddOrder () {
      addOrder({

      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  $btnGredientOrange: #FC7873,#FBAC78;
  .order-pay-wrap{
    .order-tit{
      height: 88px;
      line-height: 88px;
      font-size: 28px;
    }
    .order-pay-com{
      background: #ffffff;
      border-radius: 4px;
      margin-bottom: 20px;
      padding: 25px 36px;
      &.sub-order{
        padding: 0 0 0 36px;
      }
      h2{
        font-size: 18px;
        line-height: 18px;
        span{
          font-size: 14px;
          color: $col666;
          margin-left: 15px;
        }
      }
    }
  }
  // 收货地址
  .address-list{
    display: flex;
    flex-wrap: wrap;
  }
  .address-item{
    width: 320px;
    height: 187px;
    border: 1px solid #E5E5E5;
    padding: 20px;
    margin-right: 20px;
    margin-top: 20px;
    border-radius: 6px;
    box-sizing: border-box;
    &:hover{
      border: 1px solid #0267FF;
      & .adr-change{
        display: block;
      }
    }
    .adr-name{
      display: flex;
      justify-content: space-between;
      height: 23px;
      line-height: 23px;
      .moren{
        width: 74px;
        height: 23px;
        line-height: 23px;
        display: inline-block;
        text-align: center;
        color: #FF9B3A;
        background:rgba(255,155,58,.2);
        border-radius: 12px;
        margin-top: -2px;
      }
    }
    .adr-mobile{
      margin-top: 2px;
      margin-bottom: 10px;
    }
    .adr-mobile,.adr-detail{
      color: $col666;
      line-height: 21px;
    }
    .adr-detail{
      height: 63px;
      text-align: justify;
    }
    .adr-change{
      margin-top: 20px;
      text-align: right;
      display: none;
      span{
        color: $blueColor;
        cursor: pointer;
      }
    }
  }
  .add-new-adress{
    text-align: center;
    span{
      width: 36px;
      height: 36px;
      border-radius: 50%;
      position: relative;
      display: inline-block;
      background: #E5E5E5;
      margin-top: 42.5px;
      &:after,&:before{
        position: absolute;
        content: "";
        top: 50%;
        left: 50%;
        background: #ffffff;
        border-radius: 2px;
      }
      &:after{
        width: 3px;
        height: 21px;
        margin-left: -1.5px;
        margin-top: -10.5px;
      }
      &:before{
        width: 21px;
        height: 3px;
        margin-left: -10.5px;
        margin-top: -1.5px;
      }
    }
    p{
      color: $col666;
      margin-top: 12px;
    }
  }
  // 商品信息
  .curse-info{
    display: flex;
    align-items: center;
    margin-top: 20px;
    .curse-img{
      width: 144px;
      height: 91px;
    }
    .curse-instr{
      flex: 1;
      margin-left: 21px;
      h3{
        font-size: 18px;
      }
      p{
        color: $col999;
        &:nth-child(2){
          margin: 12px 0;
        }
      }
    }
    .curse-price{
      font-size: 16px;
      color: #FF9B3A;
      font-weight: bold;
    }
  }
  // 发票信息
  .need-bill{
    margin-top: 33px;
    .rai{
      margin-right: 78px;
    }
  }
  // 提交订单
  .sub-order{
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .total-info{
    em, i{
      color: #FF9B3A;
      margin: 0 3px;
      font-style: normal;
      font-weight: bold;
    }
    span{
      margin-right: 43px;
      line-height: 26px;
      em{
        margin: 0 5px;
      }n
      i{
        font-size: 22px;
        vertical-align: middle;
      }
    }
    button{
      width: 175px;
      height: 48px;
      margin-left: 21px;
      background: $blueColor;
      color: #ffffff;
      font-size: 18px;
      border-radius: 0 4px 4px 0;
    }
  }
  /*修改地址*/
  .edit-wrap{
    padding-bottom: 20px;
  }
  .btn-edit{
    width: 122px;
    height: 36px;
    background: $blueColor;
    color: #ffffff;
    margin: 0 auto;
    margin-top: 20px;
    display: block;
  }
  .goods {
    margin-left: 83px;
    margin-top: 20px;
  }
  .goods input, .goods .g-input {
    display: inline-block;
    width: 275px;
    height: 40px;
    padding-left: 14px;
    background: rgba(245, 245, 245, 1);
    border-radius: 4px;
    border: 1px solid rgba(220, 220, 220, 1);
  }
  .goods .g-input {
    line-height: 40px;
  }
  .detalis_address {
    display: inline-block;
    margin-top: 10px;
    margin-left: 83px;
    width: 570px;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    background: rgba(245, 245, 245, 1);
    border-radius: 4px;
    border: 1px solid rgba(220, 220, 220, 1);
  }
  // 优惠券
  .coupon-list{
    display: flex;
    flex-wrap: wrap;
  }
  .coupon-item{
    width: 382px;
    display: flex;
    align-items: center;
    height: 112px;
    border-radius: 16px;
    margin: 20px 40px 0 0;
    color: #ffffff;
    @include bg-linear-gradient($btnGredientOrange, to right);
    overflow: hidden;
    position: relative;
    &.cur{
      border: 1px solid #0267FF;
    }
  }
  .c-price{
    width: 111px;
    height: 112px;
    line-height: 112px;
    text-align: center;
    border-right: 1px dashed rgba(255, 255, 255, .3);
    position: relative;
    em{
      font-size: 30px;
      font-weight: 600;
    }
    &:after, &:before{
      position: absolute;
      content: "";
      width: 16px;
      height: 16px;
      background: #ffffff;
      border-radius: 50%;
    }
    &:after{
      right: -8px;
      bottom: -8px;
    }
    &:before{
      right: -8px;
      top: -8px;
    }
  }
  .c-detail{
    padding: 0 22px;
    .c-full-reduce{
      font-size: 18px;
      font-weight: 400;
      line-height: 25px;
    }
    .c-validity{
      line-height: 22px;
      font-size: 16px;
    }
    .c-use{
      padding: 4px;
      color: #FD7D74;
      background:rgba(255,255,255,.7);
      border-radius: 16px;
      margin-top: 8px;
      display: inline-block;
      text-align: center;
    }
  }
</style>
