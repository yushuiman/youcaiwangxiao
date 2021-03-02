<template>
  <div id="app">
    <Header/>
    <RightSlider/>
    <router-view v-if="isRouterAlive" />
    <Footer/>
    <div class="yc-loading" v-show="isShowLoadFlag">
      <div class="loading-info">
        <img src="../src/assets/images/global/loading-logo.png" alt="">
        <p>正在加载</p>
        <div class="pulse-container">
          <span class="pulse-bubble pulse-bubble-1"></span>
          <span class="pulse-bubble pulse-bubble-2"></span>
          <span class="pulse-bubble pulse-bubble-3"></span>
        </div>
      </div>
    </div>
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
  computed: {
    isShowLoadFlag () {
      return this.$store.state.loading.isShowLoadFlag
    }
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
  body{
    margin: 0!important;
    padding: 0!important;
  }
  .yc-loading{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 1999;
  }
  .loading-info{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    padding: 15px 0;
    box-sizing: border-box;
    border-radius: 10px;
    background: rgba(0,0,0,.6);
    text-align: center;
    img{
      height: 50px;
      display: block;
      margin: 0 auto;
    }
    p{
      margin-top: 6px;
      line-height: 20px;
      color: #ffffff;
    }
  }
  .pulse-bubble {
    width: 10px;
    height: 10px;
    display: inline-block;
    margin: 0 5px;
    border-radius: 50%;
    background-color: #ffffff;
  }

  .pulse-bubble-1 {
      animation: pulse .4s ease 0s infinite alternate;
  }
  .pulse-bubble-2 {
      animation: pulse .4s ease .2s infinite alternate;
  }
  .pulse-bubble-3 {
      animation: pulse .4s ease .4s infinite alternate;
  }
  @keyframes pulse {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: .25;
      transform: scale(.75);
    }
  }
</style>
