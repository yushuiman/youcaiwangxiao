<template>
  <div class="wrap">
    <Header/>
    <RightSlider/>
    <Footer/>
  </div>
</template>
<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import RightSlider from '@/components/RightSlider'
export default {
  data () {
    return {
      header_show: true
    }
  },
  components: {
    Header,
    Footer,
    RightSlider
  },
  created () {
    // 在页面加载时读取localStorage里的状态信息
    sessionStorage.getItem('is_change') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(sessionStorage.getItem('is_change'))))
    // 在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('is_change', JSON.stringify(this.$store.state))
    })
  },
  mounted(){
    if(this.$route.name === 'classVideo'){
      this.headerFooterShow = false
    }
  },
  methods: {
    //是否显示头部
    header (bool) {
      this.header_show = bool;
    },
    //是否显示底部
    footer (bool) {
      this.footer_show = bool;
    }
  }
}
</script>

<style>
</style>
