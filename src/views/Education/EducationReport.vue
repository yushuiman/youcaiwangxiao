<template>
  <div class="edu-report-wrap w-wrap">
    <div class="edure-user-info">
      <h1 class="edure-tit">信息填写<span>（必填）</span></h1>
      <ul class="user-report">
        <li :class="{'error-ts': errorTs1}">姓名：<input type="text" v-model="user_name"></li>
        <li :class="{'error-ts': errorTs2}">身份证号：<input type="text" v-model="identity"></li>
        <li :class="{'error-ts': errorTs3}">IMA会员号：<input type="text" v-model="membership"></li>
      </ul>
    </div>
    <div class="edur-main">
      <h1 class="edure-tit">CPE学分报告</h1>
      <div class="edure-year-report" v-for="(item, index) in userIntegralList" :key="index">
        <p class="edure-tit-time">
          <Checkbox class="custom-checkbox"></Checkbox><span>{{item.time}}</span>
        </p>
        <ul class="edure-report-list">
          <li class="edure-report-item" v-for="(val, key) in item.list" :key="key">
            <Checkbox class="custom-checkbox"></Checkbox>
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
      <p class="choose-num">已选择<span>3</span>个已完成课程</p>
      <p class="total-integral">合计：<span>9积分</span></p>
      <button @click="makeReport">生成报告</button>
    </div>
  </div>
</template>
<script>
import { generateImg, userIntegral } from '@/api/education'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      user_name: '于于于',
      membership: '32242342342',
      identity: '412273121122222223',
      start_time: '2017-11-16',
      end_time: '2018-12-15',
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
    })
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
    getUserIntegral () {
      userIntegral({
        user_id: this.user_id,
        id: this.id
      }).then((data) => {
        const res = data.data
        if (res.code === 200) {
          this.userIntegralList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    makeReport () {
      this.makeGenerateImg()
      if (this.user_name === '' && this.membership === '' && this.identity === '') {
        this.$Message.error('请填写信息~')
        this.errorTs1 = true
        this.errorTs2 = true
        this.errorTs3 = true
        return
      }
      if (this.user_name === '') {
        this.$Message.error('请填写信息~')
        this.errorTs1 = true
        return
      }
      if (this.membership === '') {
        this.$Message.error('请填写信息~')
        this.errorTs2 = true
        return
      }
      if (this.identity === '') {
        this.$Message.error('请填写信息~')
        this.errorTs3 = true
        return
      }
      if (this.user_name.length < 2 || this.user_name.length > 10) {
        this.$Message.error('请输入2-10位字符～')
        // return
      }
    },
    makeGenerateImg () {
      generateImg({
        user_id: this.user_id,
        id: '16,17',
        user_name: this.user_name,
        membership: this.membership,
        identity: this.identity,
        start_time: this.start_time,
        end_time: this.end_time
      }).then((data) => {
        const res = data.data
        if (res.code === 200) {
          this.eduBannerList = res.data
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
