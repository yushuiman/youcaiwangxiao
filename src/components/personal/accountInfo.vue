<template>
  <div class="u-zhibo-wrap">
    <ul class="tab-list" v-if="personalInfo.type && personalInfo.type == 2">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <ul class="tab-list" v-else>
      <li class="tab-item" v-for="(v, index) in txtArr.slice(0, 2)" :class="{'active': selIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="zhibo-main">
      <div v-if="selIdx == 0">
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
            <span>消费</span>
            <span>{{paySts[item.pay_type]}}</span>
            <span>{{item.adds_time}}</span>
          </li>
        </ul>
        <div class="no-data" v-if="noDataFlag">
          暂无数据
        </div>
      </div>
      <div v-if="selIdx == 3">
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
      <div v-if="selIdx == 1">
        <div class="coupon-com">
          <p class="coupon-tit">您有<i>{{num}}</i>张可用优惠券</p>
          <ul class="coupon-list">
            <li class="coupon-item" v-for="(item, index) in availableList" :key="index">
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
        <div class="coupon-com" v-if="InvalidList.length">
          <p class="coupon-tit">失效优惠券</p>
          <ul class="coupon-list">
            <li class="coupon-item gray" v-for="(item, index) in InvalidList" :key="index">
              <span class="c-price" v-if="item.is_type == 1">¥<em>{{item.coupon_price}}</em></span>
              <span class="c-price" v-if="item.is_type == 2"><em>{{item.coupon_price}}</em>折</span>
              <div class="c-detail">
                <p class="c-full-reduce">{{item.name}}<span v-if="item.is_type == 2">折</span></p>
                <p class="c-validity">有效期至{{item.end_time}}</p>
                <span class="c-use">{{rangeSts[item.range]}}</span>
              </div>
              <Icon type="md-close" class="del-coupon" @click="doDelcoupon(item.coupon_id, index)" />
            </li>
          </ul>
        </div>
      </div>
      <div v-if="selIdx == 2" class="omo-info">
        <div class="omo-wri-a" v-if="personalInfo.is_adj == 1">
          <a @click="goOmoWri">完善OMO信息</a>
        </div>
        <div class="omo-card" v-if="personalInfo.is_adj == 2">
          优财实战课VIP
          <span>{{omoUserInfo.omo_num}}</span>
          <!-- <p><label>姓名：</label>{{omoUserInfo.realname}}</p>
          <p><label>手机号：</label>{{omoUserInfo.omo_mobile}}</p>
          <p><label>邮箱：</label>{{omoUserInfo.omo_email}}</p>
          <p><label>身份证号：</label>{{omoUserInfo.identity_card}}</p> -->
        </div>
        <div class="omo-rules" v-if="personalInfo.is_adj == 2">
          <h4>VIP会员卡使用须知：</h4>
          <p>1、本卡每人限办一张，限申请人本人实名制使用，不得转借或转让；</p>
          <p>2、本卡使用期限为两年，如本卡两年内未使用，本卡将自动失效；</p>
          <p>3、听课时请学员向签到处提供与本卡绑定的手机号；</p>
          <p>4、保留修改、变更权利，且不另行个别通知，此卡不得抵用现金使用，最终解释权归优财所有。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { consumptionRecord, coupons, delcoupon, getOmoUserInfo } from '@/api/personal'
import { mapState } from 'vuex'
export default {
  props: ['user_id', 'personalInfo'],
  data () {
    return {
      txtArr: ['消费记录', '优惠券', 'OMO'],
      selIdx: this.$route.query.selIdx || 0,
      consumptionRecordList: [],
      noDataFlag: false,
      paySts: {
        1: '银联',
        2: '微信',
        3: '余额',
        4: '支付宝',
        5: '后台',
        6: '积分兑换',
        7: '课程卡开通',
        8: '京东白条'
      },
      rangeSts: {
        1: '仅限正课使用',
        2: '仅限直播使用',
        3: '全局使用'
      },
      num: 0, // 有效个数
      availableList: [], // 有效
      InvalidList: [], // 失效
      omoUserInfo: {}
    }
  },
  computed: {
    ...mapState({
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.initRes()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.initRes()
      })
    }
  },
  methods: {
    tabClk (v, index) {
      this.selIdx = index
      this.$router.replace({ path: '/personal',
        query: {
          ...this.$route.query,
          selIdx: index
        }
      })
      this.initRes()
    },
    initRes () {
      if (this.selIdx == 0) {
        this.getConsumptionRecord()
      }
      if (this.selIdx == 1) {
        this.getCoupons()
      }
      if (this.selIdx == 2) {
        if (this.personalInfo.is_adj == 2) {
          this.$emit('omoWriShow', true)
        }
        if (this.personalInfo.is_adj == 1) {
          this.getOmoUserInfoFn()
        }
      }
    },
    // 去完善omo信息
    goOmoWri () {
      this.$emit('omoWriShow', true)
    },
    // 消费记录
    getConsumptionRecord () {
      this.showLoading(true)
      consumptionRecord({
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.consumptionRecordList = res.data
          if (this.consumptionRecordList.length === 0) {
            this.noDataFlag = true
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 优惠券列表
    getCoupons () {
      this.showLoading(true)
      coupons({
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          let { num, available, Invalid } = res.data
          this.num = num
          this.availableList = available
          this.InvalidList = Invalid
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
    },
    // omo信息
    getOmoUserInfoFn () {
      getOmoUserInfo({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.omoUserInfo = res.data
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
  $btnGredientOrange: #FC7873,#FBAC78;
  .consumption-record-list, .card-manager-list{
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
    li{
      font-size: 0;
      padding: 0 30px;
      height: 50px;
      color: $col666;
      background: #ffffff;
      display: flex;
      align-items: center;
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
        line-height: 20px;
        &:nth-child(1){
          width: 290px;
          padding-right: 10px;
        }
        &:nth-child(2){
          width: 135px;
        }
        &:nth-child(3){
          width: 158px;
        }
        &:nth-child(4){
          width: 140px;
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
    @include bg-linear-gradient($btnGredientOrange, to right);
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
  .omo-info{
    padding: 20px 30px;
    background:rgba(255,255,255,1);
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
  }
  .omo-card{
    width: 355px;
    height: 186px;
    line-height: 186px;
    text-align: center;
    border-radius: 8px;
    background: url('../../assets/images/user/omo.jpg') no-repeat;
    background-size: 100% 100%;
    position: relative;
    font-size: 24px;
    color: #ffffff;

    p, span{
      line-height: 30px;
      label{
        width: 75px;
        display: inline-block;
      }
    }
    span{
      position: absolute;
      right: 10px;
      top: 2px;
      font-weight: bold;
      font-size: 16px;
      text-shadow: 0px 1px 1px #056599;
    }
  }
  .omo-rules{
    padding-top: 15px;
    line-height: 26px;
    p{
      color: $col666;
    }
  }
  .omo-wri-a{
    a{
      text-decoration: underline;
    }
  }
</style>
