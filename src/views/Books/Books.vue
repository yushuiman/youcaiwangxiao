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
          <li class="bks-item" v-for="(item, index) in bksList" :key="index">
            <img class="bks-img" :src="item.pc_img" alt="">
            <div class="bks-info">
              <h2 class="bks-name">{{item.name}}<span v-if="item.is_presell == 2">（预售）</span></h2>
              <p class="bks-teacher">主编：{{item.author}}<span>{{item.introduce}}</span></p>
              <div class="bks-prices">
                <span class="yc-price">优财价：<em>{{item.pay_price}}元</em></span>
                <span class="original-price">定价：{{item.price}}元</span>
              </div>
            </div>
            <button class="btn-buy-books">立即购买</button>
          </li>
        </ul>
      </div>
      <div class="books-rt">
        <!-- 猜你喜欢 -->
        <like-list></like-list>
      </div>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import likeList from '@/components/common/likeList.vue'
import { booksList, booksBanner } from '@/api/books'

export default {
  data () {
    return {
      bksList: [],
      booksBannerList: [],
      swiperOptionRec: {
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        loop: true
      }
    }
  },
  components: {
    likeList,
    swiper,
    swiperSlide
  },
  mounted () {
    this.getBooksList()
    this.getBooksBanner()
  },
  methods: {
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
    getBooksBanner () {
      booksBanner().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.booksBannerList = res.data
        } else {
          this.$Message.error(res.msg)
        }
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
  }
  .bks-item{
    padding: 21px 33px;
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 6px;
    margin-bottom: 20px;
    .bks-img{
      width: 82px;
      height: 132px;
    }
  }
  .bks-info{
    padding-left: 45px;
    flex: 1;
    .bks-name{
      font-size: 16px;
    }
    .bks-teacher{
      margin-top: 13px;
      color: $col999;
      span{
        margin-left: 22px;
      }
    }
    .bks-prices{
      margin-top: 24px;
      .yc-price{
        font-weight: 400;
      }
      .original-price{
        color: $col999;
        margin-left: 14px;
        text-decoration: line-through;
      }
      em{
        color: #F99111;
      }
    }
  }
  .btn-buy-books{
    width: 90px;
    height: 30px;
    background:rgba(249,145,17,1);
    color: #ffffff;
    border-radius: 15px;
  }
  // <div class="bks-prices">
  //               <span class="yc-price">优财价：<em>44.7元</em></span>
  //               <span class="original-price">定价：66元</span>
  //             </div>
  // <ul class="bks-list">
  //         <li class="bks-item">
  //           <img src="../../assets/images/zixun/ziliao.png" alt="">
  //           <div class="bks-info">
  //             <h2 class="bks-name">sdsdfsfsdfs都是粉丝地方</h2>
  //             <p class="bks-teacher">主编：养也<span>经济科学出版社</span></p>
  //             <div class="bks-prices">
  //               <span>优财价：<em>44.7元</em></span>
  //               <span>定价：66元</span>
  //             </div>
  //           </div>
  //           <button class="buy-books">立即购买</button>
  //         </li>
  //       </ul>
</style>
