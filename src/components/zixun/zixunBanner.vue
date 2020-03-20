<template>
  <div class="banner-list">
    <img :src="zixunBanner[0].image_href" alt="" width="100%" v-if="zixunBanner.length==1">
    <swiper :options="swiperOptionRec" v-if="zixunBanner.length>1">
      <swiper-slide class="banner-slide" v-for="(item, index) in zixunBanner" :key="index">
        <img :src="item.image_href" alt="">
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { zxbanner } from '@/api/zixun'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  props: {
  },
  data () {
    return {
      zixunBanner: [],
      swiperOptionRec: {
        loop: true,
        autoplay: {
          delay: 5000,
          stopOnLastSlide: false
        }
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  mounted () {
    this.getZxbanner() // 资讯banner
  },
  methods: {
    getZxbanner () {
      zxbanner().then((data) => {
        const res = data.data
        if (res.code === 200) {
          this.zixunBanner = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .banner-slide{
    img{
      width: 100%;
    }
  }
</style>
