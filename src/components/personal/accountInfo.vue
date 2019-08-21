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
          <p class="coupon-tit">您有<i>3</i>张可用优惠券</p>
          <ul class="coupon-list">
            <li class="coupon-item">
              <span class="c-price">¥<em>150</em></span>
              <div class="c-yuan"><i></i></div>
              <div class="c-detail">
                <p class="c-full-reduce">满的地方减150</p>
                <p class="c-validity">有效期</p>
                <span class="c-use">仅限dfs私用</span>
              </div>
            </li>
            <li class="coupon-item">
              <span class="c-price">¥<em>150</em></span>
              <div class="c-yuan"><i></i></div>
              <div class="c-detail">
                <p class="c-full-reduce">满的地方减150</p>
                <p class="c-validity">有效期</p>
                <span class="c-use">仅限dfs私用</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="coupon-com">
          <p class="coupon-tit">失效优惠券</p>
          <ul class="coupon-list">
            <li class="coupon-item gray">
              <span class="c-price">¥<em>150</em></span>
              <div class="c-yuan"><i></i></div>
              <div class="c-detail">
                <p class="c-full-reduce">满的地方减150</p>
                <p class="c-validity">有效期</p>
                <span class="c-use">仅限dfs私用</span>
              </div>
              <a class="del-coupon">X</a>
            </li>
            <li class="coupon-item gray">
              <span class="c-price">¥<em>150</em></span>
              <div class="c-yuan"><i></i></div>
              <div class="c-detail">
                <p class="c-full-reduce">满的地方减150</p>
                <p class="c-validity">有效期</p>
                <span class="c-use">仅限dfs私用</span>
              </div>
              <a class="del-coupon">X</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { consumptionRecord } from '@/api/personal'
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
      }
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
        // this.getQuestionAnswer()
      }
      if (parseInt(this.selIdxAccount) === 2) {
        // this.getQuestionAnswer()
      }
    },
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
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  $btnGredientOrange: #FBAC78,#FC7873;
  $btnGredientGray: #C7C7C7, #C6C6C6;
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
    padding: 30px 60px 20px;
    margin-bottom: 20px;
    background:rgba(255,255,255,1);
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
  }
  .coupon-tit{
    font-size: 18px;
    line-height: 25px;
  }
  .coupon-list{
    display: flex;
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
    &.gray{
      @include bg-linear-gradient($btnGredientGray, right);
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
  .c-use{
    height: 30px;
    line-height: 30px;
    border-radius: 18px;
    background: #ffffff;
    text-align: center;
  }
  .c-detail{
    padding: 0 22px;
    .c-full-reduce{
      font-size: 18px;
      font-weight: 400;
      line-height: 25px;
    }
  }
  // <div class="c-yuan"><i><i></div>
  // <p class="coupon-tit">您有3张可用优惠券</p>
  //       <ul class="coupon-list">
  //         <li class="coupon-item">
  //           <span class="c-price"><em>¥</em>150</span>
  //           <div class="c-detail">
  //             <p class="c-full-reduce">满的地方减150</p>
  //             <p class="c-validity">有效期</p>
  //             <span class="c-use">仅限dfs私用</span>
  //           </div>
  //         </li>
  //       </ul>
  //       <p class="coupon-tit">失效优惠券</p>
  //       <ul class="coupon-list">
  //         <li class="coupon-item gray">
  //           <span class="c-price"><em>¥</em>150</span>
  //           <div class="c-detail">
  //             <p class="c-full-reduce">满的地方减150</p>
  //             <p class="c-validity">有效期</p>
  //             <span class="c-use">仅限dfs私用</span>
  //           </div>
  //           <a class="del-coupon">X</a>
  //         </li>
  //       </ul>
</style>
