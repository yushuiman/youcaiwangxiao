<template>
  <div class="right-com get-ziliao">
    <p class="tit">每周更新优财独家CMA资料</p>
    <p class="ts">[温馨提示：每周分发前100人，还有30人]</p>
    <div class="ziliao-inp">
      <input type="text" placeholder="姓名" v-model="user_name">
      <input type="text" placeholder="电话" v-model="mobile" maxlength="11">
      <input type="text" placeholder="邮箱" v-model="email" @keyup.enter="subDataAsk">
      <button @click="subDataAsk">提交</button>
    </div>
  </div>
</template>

<script>
import { dataAsk } from '@/api/zixun'

export default {
  data () {
    return {
      user_name: '',
      mobile: '',
      email: '',
      dataAsk: []
    }
  },
  computed: {

  },
  mounted () {
  },
  methods: {
    // 获取资料
    subDataAsk () {
      const regMobile = /^[1]([3-9])[0-9]{9}$/
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (this.user_name === '' || this.mobile === '' || this.email === '') {
        this.$Message.error('姓名，电话，邮箱不能为空～')
        return
      }
      // if (this.user_name.length < 2 || this.user_name.length > 10) {
      //   this.$Message.error('请输入2-10位姓名字符～')
      //   return
      // }
      if (!regMobile.test(this.mobile)) {
        this.$Message.error('请输入正确的手机号～')
        return
      }
      if (!regEmail.test(this.email)) {
        this.$Message.error('请输入正确的邮箱～')
        return
      }
      dataAsk({
        user_name: this.user_name,
        email: this.email,
        mobile: this.mobile
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.user_name = ''
          this.mobile = ''
          this.email = ''
          this.$Message.success('收集成功')
        } else {
          this.$Message.error(res.data)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  // 报考指南
  .right-com{
    padding: 0 10px;
    background: #ffffff;
    border-radius: 8px;
  }
  .get-ziliao{
    height: 239px;
    background: url('../../assets/images/zixun/ziliao.png') no-repeat center top;
    background-size: 100% 100%;
    text-align: center;
    p{
      font-size: 12px;
      color: #ffffff;
      padding-top: 6px;
      &.tit{
        font-size: 16px;
        padding-top: 22px;
        font-weight: bold;
      }
    }
  }
  .ziliao-inp{
    width: 240px;
    margin: 0 auto;
    padding-top: 16px;
    input{
      width: 100%;
      line-height: 28px;
      font-size: 12px;
      color: #666666;
      border-radius: 3px;
      margin-bottom: 8px;
      padding: 0 10px;
      text-align: left;
      border: 1px solid #ccc;
      background-color: #ffffff;
      box-sizing: border-box;
    }
    button{
      width: 80px;
      background-color: transparent;
      color: #ffffff;
      line-height: 30px;
      border: 1px solid #ffffff;
      // display: inline-block;
      // margin: 0 auto;
      margin-top: 8px;
    }
  }
</style>
