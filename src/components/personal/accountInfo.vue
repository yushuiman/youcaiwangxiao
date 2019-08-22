<template>
  <div class="u-zhibo-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdxAccount == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="zhibo-main">
      <div v-if="selIdxAccount == 0">
        <!-- 消费记录 -->
        <ul class="consumption-record-list" v-if="consumptionRecordList.length">
          <li>
            <span>消费项目</span>
            <span>金额</span>
            <span>操作类型</span>
            <span>支付类型</span>
            <span>操作时间</span>
          </li>
          <li v-for="(item, index) in consumptionRecordList" :key="index">
            <span>{{item.package_name}}</span>
            <span>{{item.pay_price}}</span>
            <span>{{item.add_time}}</span>
            <span>{{paySts[item.pay_type]}}</span>
            <span>{{item.adds_time}}</span>
          </li>
        </ul>
        <div class="no-data" v-else>
          暂无数据
        </div>
      </div>
      <div v-if="selIdxAccount == 1">
        <!-- 激活 -->
        <div class="card-activation">
          <div class="cactive-left">
            <div class="cactive-input">
              <label>马上激活课程卡：</label>
              <input type="text" name="" id="">
            </div>
            <p class="cactive-txt">课程卡的用途：使用课程卡激活后可以去学习与课程卡金额相应的课程。</p>
          </div>
          <button class="cactive-right btn-com">立即激活</button>
        </div>
        <!-- 课程卡编号 记得判断有无数据-->
        <ul class="card-manager-list">
          <li>
            <span>课程卡编号</span>
            <span>激活课程名称</span>
            <span>激活密钥</span>
            <span>使用时间</span>
            <span>卡状态</span>
          </li>
          <li>
            <span>28421</span>
            <span>CMA中文课程Part-1</span>
            <span>nczx-hjuh-elkd-4328-4kjn</span>
            <span>2017/09/15 15:11:16</span>
            <span>已使用</span>
          </li>
          <li>
            <span>28421</span>
            <span>CMA中文课程Part-1</span>
            <span>nczx-hjuh-elkd-4328-4kjn</span>
            <span>2017/09/15 15:11:16</span>
            <span>已使用</span>
          </li>
        </ul>
      </div>
      <div v-if="selIdxAccount == 2">
        <div class="coupon-com">
          <p class="coupon-tit">您有<i>{{num}}</i>张可用优惠券</p>
          <ul class="coupon-list">
            <li class="coupon-item" v-for="(item, index) in availableList" :key="index">
              <span class="c-price" v-if="item.is_type == 1">¥<em>{{item.coupon_price}}</em></span>
              <span class="c-price" v-if="item.is_type == 2"><em>{{item.coupon_price}}</em>折</span>
              <div class="c-detail">
                <p class="c-full-reduce">{{item.name}}</p>
                <p class="c-validity">有效期至{{item.end_time}}</p>
                <span class="c-use">{{rangeSts[item.range]}}使用</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="coupon-com">
          <p class="coupon-tit">失效优惠券</p>
          <ul class="coupon-list">
            <li class="coupon-item gray" v-for="(item, index) in InvalidList" :key="index">
              <span class="c-price" v-if="item.is_type == 1">¥<em>{{item.coupon_price}}</em></span>
              <span class="c-price" v-if="item.is_type == 2"><em>{{item.coupon_price}}</em>折</span>
              <div class="c-detail">
                <p class="c-full-reduce">{{item.name}}<span v-if="item.is_type == 2">折</span></p>
                <p class="c-validity">有效期至{{item.end_time}}</p>
                <span class="c-use">{{rangeSts[item.range]}}使用</span>
              </div>
              <Icon type="md-close" class="del-coupon" @click="doDelcoupon(item.coupon_id, index)" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { consumptionRecord, coupons, delcoupon } from '@/api/personal'
// import { mapState } from 'vuex'
export default {
  props: {
    user_id: {
      type: Number
    }
  },
  data () {
    return {
      txtArr: ['消费记录', '课程卡管理', '优惠券'],
      selIdxAccount: window.sessionStorage.getItem('selIdxAccount') || 0,
      consumptionRecordList: [],
      paySts: {
        1: '银联',
        2: '微信',
        3: '余额',
        4: '支付宝',
        5: '后台',
        6: '积分兑换'
      },
      rangeSts: {
        1: '仅限正课',
        2: '仅限直播',
        3: '全局使用'
      },
      num: 0, // 有效个数
      availableList: [], // 有效
      InvalidList: [] // 失效
    }
  },
  // computed: {
  //   ...mapState({
  //     user_id: state => state.user.user_id
  //   })
  // },
  mounted () {
    this.initRes()
  },
  methods: {
    tabClk (v, index) {
      this.selIdxAccount = index
      window.sessionStorage.setItem('selIdxAccount', index)
      this.initRes()
    },
    initRes () {
      if (parseInt(this.selIdxAccount) === 0) {
        this.getConsumptionRecord()
      }
      if (parseInt(this.selIdxAccount) === 1) {
        // this.getCoupons()
      }
      if (parseInt(this.selIdxAccount) === 2) {
        this.getCoupons()
      }
    },
    // 消费记录
    getConsumptionRecord () {
      consumptionRecord({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.consumptionRecordList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 优惠券列表
    getCoupons () {
      coupons({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          let { num, available, Invalid } = res.data
          this.num = num
          this.availableList = available
          this.InvalidList = Invalid
          // this.availableList = [
          //   {// 可用卷
          //     'coupon_id': '1',
          //     'range': 1,
          //     'name': '优惠券名',
          //     'coupon_price': '50',
          //     'end_time': '到期时间',
          //     'is_type': 1
          //   },
          //   {// 可用卷
          //     'coupon_id': '2',
          //     'range': 2,
          //     'name': '优惠券名',
          //     'coupon_price': '3.8',
          //     'end_time': '3232323',
          //     'is_type': 2
          //   },
          //   {// 可用卷
          //     'coupon_id': '1',
          //     'range': 1,
          //     'name': '优惠券名',
          //     'coupon_price': '50',
          //     'end_time': '到期时间',
          //     'is_type': 1
          //   },
          //   {// 可用卷
          //     'coupon_id': '2',
          //     'range': 2,
          //     'name': '优惠券名',
          //     'coupon_price': '3.8',
          //     'end_time': '3232323',
          //     'is_type': 2
          //   }
          // ]
          // this.InvalidList = [
          //   {// 可用卷
          //     'coupon_id': '3',
          //     'range': 3,
          //     'name': '优惠券名',
          //     'coupon_price': '50',
          //     'end_time': '到期时间',
          //     'is_type': 2
          //   },
          //   {// 可用卷
          //     'coupon_id': '4',
          //     'range': 2,
          //     'name': '优惠券名',
          //     'coupon_price': '100',
          //     'end_time': '到期时间',
          //     'is_type': 1
          //   },
          //   {// 可用卷
          //     'coupon_id': '3',
          //     'range': 3,
          //     'name': '优惠券名',
          //     'coupon_price': '50',
          //     'end_time': '到期时间',
          //     'is_type': 2
          //   },
          //   {// 可用卷
          //     'coupon_id': '4',
          //     'range': 2,
          //     'name': '优惠券名',
          //     'coupon_price': '100',
          //     'end_time': '到期时间',
          //     'is_type': 1
          //   },
          //   {// 可用卷
          //     'coupon_id': '3',
          //     'range': 3,
          //     'name': '优惠券名',
          //     'coupon_price': '50',
          //     'end_time': '到期时间',
          //     'is_type': 2
          //   },
          //   {// 可用卷
          //     'coupon_id': '4',
          //     'range': 2,
          //     'name': '优惠券名',
          //     'coupon_price': '100',
          //     'end_time': '到期时间',
          //     'is_type': 1
          //   }
          // ]
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 删除
    doDelcoupon (id, index) {
      delcoupon({
        user_id: this.user_id,
        coupon_id: id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.InvalidList.splice(index, 1)
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  $btnGredientOrange: #FBAC78,#FC7873;
  .consumption-record-list, .card-manager-list{
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
    li{
      font-size: 0;
      padding: 0 30px;
      height: 50px;
      line-height: 50px;
      color: $col666;
      background: #ffffff;
      &:first-child{
        color: $col333;
        border-radius: 8px 8px 0 0;
        font-weight: 500;
      }
      &:last-child{
        border-radius: 0 0 8px 8px;
      }
      &:nth-child(odd){
        background: #F3F6FF;
      }
      span{
        font-size: 18px;
        display: inline-block;
        &:nth-child(1){
          width: 265px;
        }
        &:nth-child(2){
          width: 160px;
        }
        &:nth-child(3){
          width: 158px;
        }
        &:nth-child(4){
          width: 160px;
        }
      }
    }
  }
  .card-manager-list{
    li{
      span{
        &:nth-child(1){
          width: 125px;
        }
        &:nth-child(2){
          width: 232px;
        }
        &:nth-child(3){
          width: 292px;
        }
        &:nth-child(4){
          width: 208px;
        }
      }
    }
  }
  .card-activation{
    margin-bottom: 20px;
    padding: 20px 30px;
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    button{
      width: 97px;
      height: 32px;
      color: #ffffff;
      background:rgba(24,116,253,1);
      border-radius: 16px;
    }
  }
  .cactive-left{
    .cactive-input{
      height: 32px;
      line-height: 32px;
      font-size: 18px;
      font-weight:400;
    }
    // label{
    //   width: 144px;
    // }
    input{
      width: 347px;
      height: 32px;
      border-radius: 3px;
      border: 1px solid rgba(102,102,102,1);
      box-sizing: border-box;
      text-indent: 6px;
    }
    .cactive-txt{
      color: $col999;
      margin-top: 20px;
    }
  }
  // 优惠券
  .coupon-com{
    // height: 470px;
    // overflow: auto;
    padding: 30px 60px 20px;
    margin-bottom: 20px;
    background:rgba(255,255,255,1);
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
  }
  .coupon-tit{
    font-size: 18px;
    line-height: 25px;
    i{
      color: $blueColor;
      font-style: normal;
    }
  }
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
    @include bg-linear-gradient($btnGredientOrange, right);
    overflow: hidden;
    position: relative;
    &.gray{
      background: #DCDCDC;
      .c-use{
        background: #ffffff;
        color: #DDDDDD;
      }
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
  .del-coupon{
    color: #ffffff;
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 22px;
    cursor: pointer;
  }
</style>
