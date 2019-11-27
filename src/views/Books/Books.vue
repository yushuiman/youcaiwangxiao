<template>
  <div class="books-wrap">
    <swiper :options="swiperOptionRec">
      <swiper-slide v-for="(v, index) in booksBannerList" :key="index">
        <img :src="v.image_href" alt="" width="100%">
      </swiper-slide>
    </swiper>
    <div class="books-main w-wrap">
      <div class="books-lf">
        <ul class="bks-list">
          <li class="bks-item" v-for="(item, index) in bksList" :key="index" @click="goBooksDetail(item)">
            <img class="bks-img" :src="item.pc_img" alt="">
            <div class="bks-info">
              <h2 class="bks-name">{{item.name}}<span v-if="item.is_presell == 2">（预售）</span></h2>
              <p class="bks-teacher">主编：{{item.author}}<span>{{item.pub_company}}</span></p>
              <div class="bks-prices">
                <span class="original-price">定价：{{item.price}}元</span>
                <span class="yc-price">优财价：<em>{{item.pay_price}}元</em></span>
                <button class="btn-buy-books" @click.stop="buyPay(item)">立即购买</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="books-rt">
        <!-- 报考指南 -->
        <baokao-zhinan></baokao-zhinan>
        <!-- 获取资料 -->
        <get-ziliao></get-ziliao>
      </div>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import baokaoZhinan from '../../components/zixun/baokaoZhinan'
import getZiliao from '../../components/zixun/getZiliao'
import { booksList, booksBanner } from '@/api/books'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      bksList: [],
      booksBannerList: [],
      swiperOptionRec: {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
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
  computed: {
    ...mapState({
      token: state => state.user.token
    })
  },
  mounted () {
    this.getBooksBanner()
    this.getBooksList()
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    // banner
    getBooksBanner () {
      booksBanner().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.booksBannerList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 书籍list
    getBooksList () {
      booksList().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.bksList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 查看书籍详情
    goBooksDetail ({ id }) {
      this.$router.push({ path: '/books-detail', query: { books_id: id } })
    },
    // 订单入库
    buyPay ({ id }) {
      if (!this.token) {
        this.$router.push({ path: '/login',
          query: {
            call_back: 'books'
          }
        })
        return
      }
      this.getUserInfo().then(() => {
        this.$router.push({
          path: '/order-confirm',
          query: {
            package_id: id,
            is_live: 3 // 1直播订单、2课程订单、3图书订单4积分订单
          }
        })
      })
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .books-main{
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    .books-lf{
      width: 873px;
    }
    .books-rt{
      width: 298px;
    }
  }
  .bks-item{
    padding: 12px 46px 14px 21px;
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 6px;
    margin-bottom: 20px;
    cursor: pointer;
    .bks-img{
      width: 122px;
      height: 148px;
    }
  }
  .bks-info{
    padding-left: 28px;
    flex: 1;
    .bks-name{
      font-size: 16px;
      line-height: 24px;
      height: 41px;
    }
    .bks-teacher{
      color: $col999;
      margin-top: 12px;
      span{
        margin-left: 22px;
      }
    }
    .bks-prices{
      margin-top: 23px;
      text-align: right;
      .yc-price{
        font-weight: 400;
        margin-right: 20px;
      }
      .original-price{
        color: $col999;
        margin-right: 14px;
        text-decoration: line-through;
      }
      em{
        color: #F99111;
      }
      .btn-buy-books{
        width: 90px;
        height: 30px;
        background:rgba(249,145,17,1);
        color: #ffffff;
        border-radius: 15px;
      }
    }
  }
</style>
