<template>
  <div class="order-confirm-wrap w-wrap">
    <h1 class="order-tit">确认订单</h1>
    <div class="order-confirm-com user-addess">
      <h2>收货地址</h2>
      <div class="edit-address">
        <ul class="address-list">
          <li class="address-item" :class="{'cur': originBillInfo.address_id == item.address_id}" v-for="(item, index) in addressList" :key="index" @click="changeAdrs(item, index)">
            <p class="adr-name">
              <span>{{item.consignee}}</span>
              <span class="moren" v-if="item.is_default == 1">默认地址</span>
            </p>
            <p class="adr-mobile">{{item.telephone}}</p>
            <p class="adr-detail">{{item.address}}</p>
            <p class="adr-change"><span @click="changeAddress(1, item)">修改</span></p>
          </li>
          <li class="address-item add-new-adress" @click="changeAddress(2)">
            <span></span>
            <p>添加新地址</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="order-confirm-com course-detail">
      <h2>商品信息</h2>
      <div class="curse-info">
        <img class="curse-img" :src="packages.pc_img" alt="">
        <div class="curse-instr">
          <h3>{{packages.name}}</h3>
          <p>讲师：{{packages.teacher_name}}</p>
          <p>有效期：{{packages.validity}}</p>
        </div>
        <span class="curse-price">{{packages.price}}元</span>
      </div>
    </div>
    <!-- 课程有发票 书没有 -->
    <div class="order-confirm-com make-bill" v-if="is_live != 3">
      <h2>发票信息<span>开企业抬头发票须填写纳税人识别号，以免影响报销</span></h2>
      <div class="need-bill">
        <RadioGroup v-model="bill" @on-change="onBillChange">
          <Radio label="不需要" class="rai"></Radio>
          <Radio label="需要" class="rai"></Radio>
        </RadioGroup>
      </div>
      <p v-if="showBillType" class="bill-type-show">{{originBillInfo.couponType == 1 ? '增值税普通发票' : '增值税专用发票'}}:{{originBillInfo.couponType == 1 ? originBillInfo.invoice_title : originBillInfo.companyName}}<span @click="changeAgainBill">修改</span></p>
    </div>
    <!-- 课程有优惠券 书没有 -->
    <div class="order-confirm-com use-coupon" v-if="coupon_num > 0 && is_live != 3">
      <h2>优惠券</h2>
      <ul class="coupon-list">
        <li class="coupon-item" :class="{'cur': originBillInfo.user_coupon_id == item.coupon_id}" v-for="(item, index) in couponList" :key="index"
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
    <div class="order-confirm-com sub-order">
      <!-- // 1直播订单、2课程订单、3图书订单4积分订单 -->
      <p><Checkbox v-model="agree" @on-change="agreReadChange"></Checkbox>我已阅读并同意<a href="https://youcaiwx.cn/Agreement/buy.html" target="_blank">《 用户付费协议 》</a></p>
      <div class="total-info">
        <span>共<em>{{buyNum}}</em>件商品</span>
        <span>应付：<i>{{totalPrice}}元</i></span>
        <button @click="subAddOrder">提交订单</button>
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
    <!-- 发票信息 -->
    <Modal
      title="发票信息"
      v-model="visibleBill"
      footer-hide
      :mask-closable=false
      :closable=false
      :width="360"
      class="iview-modal">
      <div class="bill-modal">
        <div class="bill-type">
          <span :class="{'cur': originBillInfo.couponType == 1}" @click="getBillType(1)">增值税普通发票</span>
          <span :class="{'cur': originBillInfo.couponType == 2}" @click="getBillType(2)">增值税专用发票</span>
        </div>
        <div class="bill-content">
          <div class="bill-common" v-if="originBillInfo.couponType == 1">
            <div class="bill-item">
              <label>发票抬头类型:</label>
              <RadioGroup v-model="billType" @on-change="onBillChange">
                <Radio label="个人" class="rai" style="width: 60px;"></Radio>
                <Radio label="单位" class="rai" style="width: 60px;"></Radio>
              </RadioGroup>
            </div>
            <div class="bill-item">
              <label>发票抬头:</label>
              <input type="text" placeholder="请填写公司发票抬头" v-model="originBillInfo.invoice_title">
            </div>
            <div class="bill-item" v-if="originBillInfo.userOrcompany == 2">
              <label>纳税人识别号:</label>
              <input type="text" placeholder="请填写纳税人识别号" v-model="originBillInfo.taxpayerNumberPt" maxlength="18">
            </div>
            <div class="bill-item">
              <label>发票内容:</label>
              <span class="cur">培训费</span>
            </div>
            <div class="bill-item" style="margin-top: -15px;">
              <label></label>
              <span>发票内容将显示详细商品名称与价格信息</span>
            </div>
          </div>
          <div class="bill-special" v-if="originBillInfo.couponType == 2">
            <div class="bill-item">
              <label>开票方式</label>
              <span class="cur">订单完成后开票</span>
            </div>
            <div class="bill-item">
              <label><i>*</i>单位名称</label>
              <input type="text" v-model="originBillInfo.companyName">
            </div>
            <div class="bill-item">
              <label><i>*</i>纳税人识别号</label>
              <input type="text" v-model="originBillInfo.taxpayerNumberZy" maxlength="18">
            </div>
            <div class="bill-item">
              <label><i>*</i>注册地址</label>
              <input type="text" v-model="originBillInfo.companAddress">
            </div>
            <div class="bill-item">
              <label><i>*</i>注册电话</label>
              <input type="text" v-model="originBillInfo.companTel" maxlength="11">
            </div>
            <div class="bill-item">
              <label><i>*</i>开户银行</label>
              <input type="text" v-model="originBillInfo.companOpenBank">
            </div>
            <div class="bill-item">
              <label><i>*</i>银行账户</label>
              <input type="text" v-model="originBillInfo.companBankNum">
            </div>
          </div>
          <div class="bill-btn">
            <button class="save-btn" @click="saveBillInfo">保存</button>
            <button class="cancle-btn" @click="cancelBillInfo">取消</button>
          </div>
        </div>
      </div>
    </Modal>
    <!-- 是否完成支付 -->
    <pay-modal :visible.sync="visible" :orderInfo="payInfo"></pay-modal>
  </div>
</template>

<script>
import payModal from '@/components/orders/payModal.vue'
import { showOrder, addOrder, availableCoupon } from '@/api/order'
import { editAddress, addAddress } from '@/api/personal'
import { Encrypt } from '@/libs/crypto'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      buyNum: 1, // 购买数量
      bill: '不需要',
      billType: '个人',
      agree: true,
      package_id: this.$route.query.package_id,
      is_live: this.$route.query.is_live, // 1直播2课程3图书4积分5后续教育
      visibleAddress: false,
      visibleBill: false,
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
      showBillType: false, // 显示已选择发票类型
      coupon_num: 0, // 可用优惠券张数
      couponList: [], // 可用优惠券
      totalPrice: 0, // 最终价格
      originBillInfo: {
        address_id: '', // 选择地址ID
        user_coupon_id: '', // 选择的优惠券id
        haveCoupon: 2, // 是否有发票1有2没有
        couponType: '', // 普通发票增值税发票1普通发票2增值税发票
        userOrcompany: '', // 个人发票单位发票1个人发票2单位发票
        invoice_title: '', // 发票抬头
        companyName: '', // 单位名称
        taxpayerNumber: '', // 发票税号
        taxpayerNumberPt: '', // 发票税号
        taxpayerNumberZy: '', // 发票税号
        companAddress: '', // 公司地址
        companTel: '', // 公司电话
        companOpenBank: '', // 公司开户银行
        companBankNum: '' // 银行账户
      },
      currBillInfo: {},
      payInfo: {}, // 去支付的信息
      consultInfo: JSON.parse(window.sessionStorage.getItem('consultInfo')) || {}, // 在线咨询
      visible: false // 是否完成支付
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      token: state => state.user.token,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  components: {
    payModal
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
    ...mapActions([
      'getUserInfo'
    ]),
    onBillChange (val) {
      if (val === '需要') {
        this.originBillInfo.haveCoupon = 1
        this.originBillInfo.couponType = 1
        this.originBillInfo.userOrcompany = 1
        this.visibleBill = true
        this.currBillInfo = JSON.parse(JSON.stringify(this.originBillInfo))
      }
      if (val === '不需要') {
        this.showBillType = false
        this.originBillInfo.haveCoupon = 2
        this.originBillInfo.couponType = ''
        this.originBillInfo.userOrcompany = ''
        this.originBillInfo.invoice_title = ''
        this.originBillInfo.companyName = ''
        this.originBillInfo.taxpayerNumber = ''
        this.originBillInfo.taxpayerNumberPt = ''
        this.originBillInfo.taxpayerNumberZy = ''
        this.originBillInfo.companAddress = ''
        this.originBillInfo.companTel = ''
        this.originBillInfo.companOpenBank = ''
        this.originBillInfo.companBankNum = ''
      }
      if (val === '个人') {
        this.originBillInfo.userOrcompany = 1
        this.originBillInfo.taxpayerNumber = ''
        this.originBillInfo.taxpayerNumberPt = ''
      }
      if (val === '单位') {
        this.originBillInfo.userOrcompany = 2
      }
    },
    // 发票类型 展示普通和专用
    getBillType (type) {
      this.originBillInfo.couponType = type
    },
    agreReadChange (val) {
      this.agree = val
    },
    // 订单信息
    getShowOrder () {
      this.showLoading(true)
      showOrder({
        user_id: this.user_id,
        package_id: this.package_id,
        is_live: this.is_live
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.addressList = res.data.address
          if (this.addressList && this.addressList.length) {
            this.originBillInfo.address_id = this.addressList[0].address_id
          }
          this.packages = res.data.packages
          this.coupon_num = res.data.packages.coupon_num
          this.totalPrice = res.data.packages.price
          if (this.coupon_num > 0) {
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
      const reg = /^[1]([3-9])[0-9]{9}$/
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
    // 新增收货地址
    addNewAdress () {
      if (!this.checkForm()) {
        return
      }
      this.showLoading(true)
      addAddress({
        user_id: this.user_id,
        consignee: this.curAddressInfo.consignee,
        telephone: this.curAddressInfo.telephone,
        address: this.curAddressInfo.address,
        is_default: 2
      }).then(data => {
        this.showLoading(false)
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
      this.showLoading(true)
      editAddress({
        user_id: this.user_id,
        address_id: this.curAddressInfo.address_id,
        consignee: this.curAddressInfo.consignee,
        telephone: this.curAddressInfo.telephone,
        address: this.curAddressInfo.address,
        is_default: this.curAddressInfo.is_default
      }).then(data => {
        this.showLoading(false)
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
    // 选择收货地址
    changeAdrs (item, index) {
      this.originBillInfo.address_id = item.address_id
    },
    // 优惠券列表
    getCoupon () {
      this.showLoading(true)
      availableCoupon({
        user_id: this.user_id,
        package_id: this.package_id,
        is_live: this.is_live
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.couponList = res.data
          this.useCoupon(this.couponList[0])
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 使用优惠券
    useCoupon (item) {
      this.originBillInfo.user_coupon_id = item.coupon_id
      // 1满减2打折
      if (item.is_type === 1) {
        this.totalPrice = (this.packages.price - item.coupon_price).toFixed(2)
      }
      if (item.is_type === 2) {
        this.totalPrice = (this.packages.price * (item.coupon_price / 10)).toFixed(2)
      }
    },
    // 保存发票信息
    saveBillInfo () {
      // 普通
      if (this.originBillInfo.couponType === 1) {
        if (this.originBillInfo.invoice_title === '') {
          this.$Message.error('请输入发票抬头')
          return
        }
        // 个人(发票类型，抬头)
        if (this.originBillInfo.userOrcompany === 1) {
          this.originBillInfo.taxpayerNumber = ''
        }
        // 单位(发票类型，抬头，纳税号)
        if (this.originBillInfo.userOrcompany === 2) {
          if (this.originBillInfo.invoice_title === '') {
            this.$Message.error('请输入发票抬头')
            return
          }
          if (this.originBillInfo.taxpayerNumberPt === '') {
            this.$Message.error('请输入纳税人识别号')
            return
          }
          if (this.originBillInfo.taxpayerNumberPt.length !== 18) {
            this.$Message.error('请输入18位纳税人识别号')
            return
          }
          let regex = /^[0-9a-zA-Z]+$/
          if (!regex.test(this.taxpayerNumberPt)) {
            this.$Message.error('纳税人识别号错误')
            return
          }
          this.originBillInfo.taxpayerNumber = this.originBillInfo.taxpayerNumberPt
        }
        this.originBillInfo.companyName = ''
        this.originBillInfo.companAddress = ''
        this.originBillInfo.companTel = ''
        this.originBillInfo.companOpenBank = ''
        this.originBillInfo.companBankNum = ''
      }
      // 专用
      if (this.originBillInfo.couponType === 2) {
        if (this.originBillInfo.companyName === '' || this.originBillInfo.taxpayerNumberZy === '' || this.originBillInfo.companAddress === '' || this.originBillInfo.companTel === '' || this.originBillInfo.companOpenBank === '' || this.originBillInfo.companBankNum === '') {
          this.$Message.error('有必填信息未填写')
          return
        }
        if (this.originBillInfo.taxpayerNumberZy.length !== 18) {
          this.$Message.error('请输入18位纳税人识别号')
          return
        }
        let regex = /^[0-9a-zA-Z]+$/
        if (!regex.test(this.taxpayerNumberZy)) {
          this.$Message.error('纳税人识别号错误')
          return
        }
        let ph = /^(0|86|17951)?[1]([3-9])[0-9]{9}$/
        let mb = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/
        if (!ph.test(this.originBillInfo.companTel) && !mb.test(this.originBillInfo.companTel)) {
          this.$Message.error('注册电话错误')
          return
        }
        let pattern = /^([1-9]{1})(\d{14}|\d{18})$/
        let str = this.originBillInfo.companBankNum.trim()
        if (!pattern.test(str)) {
          this.$Message.error('银行账户错误')
          return
        }
        this.billType = '个人'
        this.originBillInfo.invoice_title = ''
        this.originBillInfo.userOrcompany = ''
        this.originBillInfo.taxpayerNumber = this.originBillInfo.taxpayerNumberZy
      }
      this.visibleBill = false
      this.showBillType = true
    },
    // 取消发票信息
    cancelBillInfo () {
      this.visibleBill = false
      if (this.currBillInfo.userOrcompany === 2) {
        this.billType = '单位'
      } else {
        this.billType = '个人'
      }
      this.originBillInfo = this.currBillInfo
      if (this.showBillType && this.originBillInfo.haveCoupon === 1) {
        return
      }
      this.bill = '不需要'
      this.originBillInfo.haveCoupon = 2
      this.originBillInfo.couponType = ''
      this.originBillInfo.userOrcompany = ''
    },
    // 修改发票信息
    changeAgainBill (type) {
      this.currBillInfo = JSON.parse(JSON.stringify(this.originBillInfo))
      this.visibleBill = true
    },
    // 提交订单
    async subAddOrder () {
      if (!this.agree) {
        this.$Message.error('请阅读并同意用户付费协议')
        return
      }
      if (this.originBillInfo.address_id === '') {
        this.$Message.error('请选择收货地址')
        return
      }
      const tempPage = window.open('', '_blank')
      await this.getUserInfo()
      this.showLoading(true)
      addOrder({
        user_id: this.user_id,
        package_id: this.package_id, // 课程套餐id或者直播id
        is_live: this.is_live, // 1直播订单、2课程订单、3图书订单4积分订单
        user_coupon_id: this.originBillInfo.user_coupon_id, // 优惠卷id
        address_id: this.originBillInfo.address_id, // 地址id
        haveCoupon: this.originBillInfo.haveCoupon, // 是否有发票1有2没有
        couponType: this.originBillInfo.couponType, // 普通发票增值税发票1普通发票2增值税发票
        userOrcompany: this.originBillInfo.userOrcompany, // 个人发票单位发票1个人发票2单位发票
        invoice_title: this.originBillInfo.invoice_title, // 发票抬头
        companyName: this.originBillInfo.companyName, // 单位名称
        taxpayerNumber: this.originBillInfo.taxpayerNumber, // 发票税号
        companAddress: this.originBillInfo.companAddress, // 公司地址
        companTel: this.originBillInfo.companTel, // 公司电话
        companOpenBank: this.originBillInfo.companOpenBank, // 公司开户银行
        companBankNum: this.originBillInfo.companBankNum // 银行账户
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.payInfo = res.data
          const routerdata = this.$router.resolve({
            path: '/order-pay',
            query: {
              trade_number: this.payInfo.order_num,
              is_live: this.is_live,
              package_id: this.payInfo.package_id,
              pay_price: Encrypt(this.totalPrice),
              name: Encrypt(this.payInfo.name)
            }
          })
          const newhref = routerdata.href
          tempPage.location = newhref
          this.visible = true
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    consultLink () {
      window.open(this.consultInfo.consult_href, '_blank')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  $btnGredientOrange: #FC7873,#FBAC78;
  .order-confirm-wrap{
    .order-tit{
      height: 88px;
      line-height: 88px;
      font-size: 28px;
    }
    .order-confirm-com{
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
      border: 1px solid $blueColor;
      & .adr-change{
        display: block;
      }
    }
    &.cur{
      border: 1px solid $blueColor;
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
  .bill-type-show{
    color: $col999;
    font-size: 12px;
    margin-top: 20px;
    span{
      color: $blueColor;
      margin-left: 30px;
      cursor: pointer;
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
  /* 发票信息 */
  .bill-modal{
    padding: 0 20px 20px;
  }
  .bill-type{
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    margin-bottom: 15px;
    span{
      width: 150px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #E5E5E5;
      cursor: pointer;
      &.cur{
        border: 1px solid $blueColor;
      }
    }
  }
  .bill-item{
    display: flex;
    height: 28px;
    line-height: 28px;
    margin-bottom: 15px;
    label{
      width: 100px;
      display: inline-block;
      i{
        color: #E84342;
        vertical-align: top;
        margin-right: 3px;
      }
    }
    span{
      color: $col999;
      &.cur{
        border: 1px solid $blueColor;
        padding: 0 20px;
        color: $blueColor;
      }
    }
    input{
      width: 220px;
      border: 1px solid #E5E5E5;
      text-indent: 6px;
    }
  }
  .bill-btn{
    text-align: center;
    button{
      width: 100px;
      height: 30px;
      margin: 0 10px;
      &.save-btn{
        background: $blueColor;
        border: 1px solid $blueColor;
        color: #ffffff;
      }
      &.cancle-btn{
        border: 1px solid #E5E5E5;
      }
    }
  }
</style>
