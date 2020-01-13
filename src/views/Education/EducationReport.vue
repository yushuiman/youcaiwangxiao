<template>
  <div class="edu-report-wrap w-wrap">
    <div class="no-data" v-if="noDataFlag">
      暂无数据
    </div>
    <div id="captureId"></div>
    <div v-if="userIntegralList.length">
      <div class="edure-user-info">
        <h1 class="edure-tit">信息填写<span>（必填）</span></h1>
        <ul class="user-report">
          <li :class="{'error-ts': errorTs1}">姓名：<input type="text" v-model="user_name"></li>
          <li :class="{'error-ts': errorTs2}">身份证号：<input type="text" v-model="identity" maxlength="18"></li>
          <li :class="{'error-ts': errorTs3}">IMA会员号：<input type="text" v-model="membership" maxlength="10"></li>
        </ul>
      </div>
      <div class="edur-main">
        <h1 class="edure-tit">CPE学分报告</h1>
        <div class="edure-year-report" v-for="(item, index) in userIntegralList" :key="index">
          <p class="edure-tit-time">
            <input type="checkbox" v-model="item.all_checked" @click="shop_all_check(index)">
            <span>{{item.time}}年</span>
          </p>
          <ul class="edure-report-list">
            <li class="edure-report-item" v-for="(val, key) in item.list" :key="key">
              <input type="checkbox" v-model="val.product_checked"
                          @click="product_checked_click(index, key)"/>
              <img :src="val.pc_img" alt="">
              <span class="course-name">{{val.name}}</span>
              <span class="course-teacher">讲师：{{val.teacher_name}}</span>
              <span class="course-integral">{{val.cpe_integral}}积分</span>
              <span class="course-time">{{val.end_time}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="edure-report-foot">
        <p class="choose-num">已选择<span>{{selectedProducts}}</span>个已完成课程</p>
        <p class="total-integral">合计：<span>{{total_amount}}积分</span></p>
        <button @click="makeReport">生成报告</button>
      </div>
    </div>
  </div>
</template>
<script>
import { generateImg, userIntegral } from '@/api/education'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      noDataFlag: false,
      user_name: '',
      identity: '',
      membership: '',
      userIntegralList: [],
      errorTs1: false,
      errorTs2: false,
      errorTs3: false
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    }),
    // 已选择商品数目
    selectedProducts () {
      var selectedProducts = 0
      for (var i = 0; i < this.userIntegralList.length; i++) {
        var product = this.userIntegralList[i].list
        for (var j = 0; j < product.length; j++) {
          if (product[j].product_checked) {
            selectedProducts++
          }
        }
      }
      return selectedProducts
    },
    // 已选择商品id
    selectedProductsId () {
      var arr = []
      for (var i = 0; i < this.userIntegralList.length; i++) {
        var product = this.userIntegralList[i].list
        for (var j = 0; j < product.length; j++) {
          if (product[j].product_checked) {
            arr.push(product[j].id)
          }
        }
      }
      return arr.join(',')
    },
    // 购买商品总金额
    total_amount () {
      var totalPrice = 0
      for (var i = 0; i < this.userIntegralList.length; i++) {
        var product = this.userIntegralList[i].list
        for (var j = 0; j < product.length; j++) {
          if (product[j].product_checked) {
            totalPrice += product[j].cpe_integral
          }
        }
      }
      return totalPrice
    }
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.getUserIntegral() // 我的cpe报告
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getUserIntegral() // 我的cpe报告
      })
    }
  },
  methods: {
    // 店铺下属商品全部选择时
    shop_all_check (index) {
      var shop = this.userIntegralList[index]
      shop.all_checked = !shop.all_checked
      for (var i = 0; i < shop.list.length; i++) {
        shop.list[i].product_checked = shop.all_checked
      }
    },
    product_checked_click (index, key) {
      var product = this.userIntegralList[index].list[key]
      product.product_checked = !product.product_checked
      // 检测是否该店铺内的商品全选
      for (var i = 0; i < this.userIntegralList[index].list.length; i++) {
        if (!this.userIntegralList[index].list[i].product_checked) {
          this.userIntegralList[index].all_checked = false
          return
        }
      }
      this.userIntegralList[index].all_checked = true
    },
    getUserIntegral () {
      userIntegral({
        user_id: this.user_id,
        id: this.id
      }).then((data) => {
        const res = data.data
        this.noDataFlag = true
        if (res.code === 200) {
          if (res.data && res.data.length) {
            this.noDataFlag = false
            res.data.forEach((item) => {
              item.all_checked = false
              item.list.forEach((val) => {
                val.product_checked = false
              })
            })
            this.userIntegralList = res.data
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    makeReport () {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (this.user_name === '' && this.identity === '' && this.membership === '') {
        this.$Message.error('请填写信息~')
        return
      }
      if (this.user_name === '') {
        this.$Message.error('请填写姓名~')
        // this.errorTs1 = true
        // this.errorTs2 = false
        // this.errorTs3 = false
        return
      }
      if (this.user_name.length < 2 || this.user_name.length > 10) {
        this.$Message.error('请输入2-10位姓名字符～')
        return
      }
      if (this.identity === '') {
        this.$Message.error('请填写身份证号~')
        // this.errorTs1 = false
        // this.errorTs2 = true
        // this.errorTs3 = false
        return
      }
      if (!reg.test(this.identity)) {
        this.$Message.error('请输入正确的身份证号~')
        // this.errorTs1 = false
        // this.errorTs2 = true
        // this.errorTs3 = false
        return
      }
      if (this.membership === '') {
        this.$Message.error('请填写IMA会员号~')
        // this.errorTs1 = false
        // this.errorTs2 = false
        // this.errorTs3 = true
        return
      }
      if (this.selectedProductsId === '') {
        this.$Message.error('请选择课程～')
        return
      }
      this.makeGenerateImg()
    },
    makeGenerateImg () {
      generateImg({
        user_id: this.user_id,
        id: this.selectedProductsId,
        user_name: this.user_name,
        membership: this.membership,
        identity: this.identity,
        source: 1 // pc1app2
      }).then((data) => {
        const res = data.data
        if (res.code === 200) {
          this.download(res.data.img_href)
          this.selectedProductsId = ''
          this.userIntegralList.forEach((item) => {
            item.all_checked = false
            item.list.forEach((val) => {
              val.product_checked = false
            })
          })
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    download (url) {
      this.getUrlBase64(url).then(base64 => {
        let link = document.createElement('a')
        link.href = base64
        link.download = this.user_name + '的CPE学分报告.png'
        link.click()
      })
    },
    getUrlBase64 (url) {
      return new Promise(resolve => {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let img = new Image()
        img.crossOrigin = 'Anonymous' // 允许跨域
        img.src = url
        img.onload = function () {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0, img.width, img.height)
          let dataURL = canvas.toDataURL('image/png')
          canvas = null
          resolve(dataURL)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .edu-report-wrap{
    color: $col333;
  }
  .edur-main{
    padding-bottom: 80px;
  }
  .edure-tit{
    font-size: 18px;
    padding-top: 25px;
    padding-bottom: 20px;
    .edur-main &{
      padding-bottom: 0px;
    }
    span{
      color: #E84342;
    }
  }
  .user-report{
    padding: 15px 20px;
    background:rgba(255,255,255,1);
    border-radius: 4px;
    display: flex;
    li{
      line-height: 30px;
      margin-right: 130px;
      font-size: 16px;
      input{
        width: 220px;
        height: 30px;
        border: 1px solid rgba(199,199,199,1);
        text-indent: 6px;
      }
      &:nth-child(1){
        input{
          width: 100px;
        }
      }
      &.error-ts{
        input{
          border: 1px solid #f00;
        }
      }
    }
  }
  .edure-tit-time{
    padding: 20px 0 11px 20px;
    font-size: 16px;
    input{
      margin-right: 24px;
    }
  }
  .edure-report-list{
    background: #ffffff;
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 4px;
  }
  .edure-report-item{
    font-size: 18px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #E6E6E6;
    input{
      margin-right: 24px;
    }
    &:last-child{
      border: 0;
    }
    img{
      width: 169px;
      height: 93px;
      margin-right: 30px;
    }
    .course-name{
      width: 358px;
    }
    .course-teacher{
      width: 248px;
    }
    .course-integral{
      width: 172px;
    }
    .course-time{
      width: 142px;
    }
  }
  .edure-report-foot{
    position: fixed;
    left: 50%;
    bottom: 0;
    width: 1200px;
    height: 60px;
    line-height: 60px;
    margin-left: -600px;
    background:rgba(255,255,255,1);
    box-shadow: 0px -2px 14px 0px rgba(0,0,0,0.2);
    border-radius: 4px;
    display: flex;
    span{
      color: $blueColor;
    }
    .choose-num{
      flex: 1;
      color: $col666;
      padding-left: 20px;
    }
    .total-integral{
      margin-right: 55px;
      color: $blueColor;
      span{
        font-size: 18px;
      }
    }
    button{
      width: 230px;
      font-size: 20px;
      background: #1874FD;
      color: #ffffff;
    }
  }
</style>
