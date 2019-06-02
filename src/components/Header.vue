<template>
  <div class="hello">
    <ul class="left">
      <li><router-link to="/">首页</router-link></li>
      <li><router-link to="/class">课程</router-link></li>
      <li><router-link to="/question">题库</router-link></li>
      <li><router-link to="/zhibo">直播</router-link></li>
      <li><router-link to="/answer">答疑</router-link></li>
      <li><router-link to="/zixun">咨询</router-link></li>
      <li><router-link to="/app">App</router-link></li>
    </ul>
    <ul class="right">
      <router-link>登录</router-link>
      <router-link>注册</router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  ul li{
    list-style: none;
    display:inline-block;
    margin-left: 20px;
    float: left;
  }
  a{
    text-decoration: none;
  }
  .right{
    float: right;
    margin-right: 20px;
  }
</style>
