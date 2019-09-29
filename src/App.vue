<template>
  <div id="app">
    <Header/>
    <RightSlider/>
    <router-view/>
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
    }
  },
  provide () {
    return {
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
  }
}
</script>
<style lang="scss">
</style>
