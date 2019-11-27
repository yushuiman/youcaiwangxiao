<template>
  <div class="zixun-wrap">
    <swiper :options="swiperOptionRec" v-if="zixunBanner.length>0">
      <swiper-slide class="zixun-slide" v-for="(item, index) in zixunBanner" :key="index">
        <img :src="item.image_href" alt="">
      </swiper-slide>
    </swiper>
    <div class="zx-main w-wrap">
      <keep-alive>
      <div class="zxm-left">
        <ul class="zx-list">
          <li class="zx-item" v-for="(item, index) in zixunList" :key="index" @click="getNewsDetails(item.news_id)">
            <img class="fengmian-img" :src="item.image" alt="">
            <div class="wenan-info">
              <h1 class="title">{{item.title}}</h1>
              <div class="details" v-html="item.content"></div>
              <p class="source-time">
                <span>来源：{{item.source}}</span>
                <span>{{item.create_time}}</span>
              </p>
            </div>
          </li>
        </ul>
        <div style="padding: 20px; text-align: center;">
          <Page
          :total="total"
          @on-change="onChange"
          :current="page"
          :page-size="limit"
          size="small"
          />
        </div>
      </div>
      </keep-alive>
      <div class="zxm-right">
        <!-- 报考指南 -->
        <baokao-zhinan></baokao-zhinan>
        <!-- 获取资料 -->
        <get-ziliao></get-ziliao>
      </div>
    </div>
  </div>
</template>

<script>
import { newsList, zxbanner } from '@/api/zixun'
import baokaoZhinan from '../../components/zixun/baokaoZhinan'
import getZiliao from '../../components/zixun/getZiliao'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  data () {
    return {
      limit: 10,
      page: 1,
      total: 10,
      zixunBanner: [],
      zixunList: [],
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
    baokaoZhinan,
    getZiliao,
    swiper,
    swiperSlide
  },
  mounted () {
    this.getZxbanner() // 资讯banner
    this.getNewsList() // 消息列表
  },
  methods: {
    getZxbanner () {
      zxbanner().then((data) => {
        const res = data.data
        if (res.code === 200) {
          this.zixunBanner = res.data
        }
      })
    },
    // 列表
    getNewsList () {
      newsList({
        limit: this.limit,
        page: this.page
        // parent_id: 1 // 父类id
        // type_id: 1 // 子类id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.total = res.data.total
          this.zixunList = res.data.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 分页
    onChange (val) {
      this.page = val
      this.getNewsList()
      window.scrollTo(0, 0)
    },
    // 详情
    getNewsDetails (id) {
      this.$router.push({ path: '/zixun-detail',
        query: {
          news_id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .zx-main{
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    border-radius: 8px;
    .zxm-left{
      width: 903px;
    }
    .zxm-right{
      width: 278px;
    }
  }
  .zixun-slide{
    img{
      width: 100%;
    }
  }
  .zx-list{
    background: #ffffff;
    padding: 0 20px;
    min-height: 1000px;
  }
  .zx-item{
    padding: 21px 0;
    display: flex;
    .fengmian-img{
      width: 160px;
      height: 101px;
      margin-right: 21px;
      cursor: pointer;
    }
  }
  .wenan-info{
    cursor: pointer;
    flex: 1;
    h1{
      font-size: 18px;
      line-height: 20px;
      color: $col333;
    }
    .details{
      line-height: 20px;
      height: 40px;
      margin-top: 14px;
      color: $col666;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 2;
    }
    .details *{
      width: auto!important;
    }
    .source-time{
      line-height: 20px;
      margin-top: 4px;
      color: $col999;
      display: flex;
      justify-content: space-between;
    }
  }
</style>
