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
  }
}
</script>
<style lang="scss">
</style>
