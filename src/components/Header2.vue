<template>
  <div>
    <header class="head-wrap">
      <div class="head-w">
        <div class="head-list">
          <img src="" alt="">
          <ul>
            <li v-for="(item, index) in classList" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="login-wrap">
          <div class="">
            <a>登录</a>|<a>注册</a><span>学习中心</span>
            <div class="">
              <img src="" alt="" class="email-icon">
              <img src="" alt="" class="head-logo">
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  data () {
    return {
      classList: ['首页','课程','题库','直播','答疑','咨询']
    }
  },
  methods: {
    fn(){

    }
  }
}
</script>

<style lang='scss' scoped>
  .head-wrap{
    width: 100%;
    height: 70px;
    .head-w {
      width: 1300px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
    }
  }
</style>
