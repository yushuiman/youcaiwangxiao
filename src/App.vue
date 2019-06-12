<template>
  <div id="app">
    <div id="nav">
      <Header/>
    </div>
    <router-view/>
    <Footer/>
  </div>
</template>
<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'home',
  components: {
    Header,
    Footer
  },
  created () {
    // 在页面加载时读取localStorage里的状态信息
    sessionStorage.getItem('is_change') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(sessionStorage.getItem('is_change'))))
    // 在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('is_change', JSON.stringify(this.$store.state))
    })
  }
}
</script>
<style lang="scss">
</style>
