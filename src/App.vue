<template>
  <div id="app">
    <div id="nav">
      <Header/>
      <RightSlider/>
    </div>
    <router-view v-if="isAlive"/>
    <Footer/>
  </div>
</template>
<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import RightSlider from '@/components/RightSlider'

export default {
  name: 'home',
  data () {
    return {
      isAlive: true
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  components: {
    Header,
    Footer,
    RightSlider
  },
  mounted () {

  },
  created () {
    // 在页面加载时读取localStorage里的状态信息
    sessionStorage.getItem('is_change') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(sessionStorage.getItem('is_change'))))
    // 在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('is_change', JSON.stringify(this.$store.state))
    })
  },
  methods: {
    reload () {
      this.isAlive = false
      this.$nextTick(function () {
        this.isAlive = true
      })
    }
  }
}
</script>
<style lang="scss">
</style>
