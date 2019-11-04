<template>
  <div id="app">
    <Header/>
    <RightSlider/>
    <router-view v-if="isRouterAlive" />
    <Footer/>
  </div>
</template>
<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import RightSlider from '@/components/RightSlider'

export default {
  name: 'home',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
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
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
<style lang="scss">
</style>
