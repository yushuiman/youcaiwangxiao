<template>
  <div class="bks-detail-wrap w-wrap">
    <div class="nav-title">
      <router-link to="/books">书架</router-link><i>></i>
      <span class="curren">{{booksDetail.name}}</span>
    </div>
    <div class="bks-detail">
      <img class="bks-img" :src="booksDetail.pc_img" alt="">
      <div class="bks-info">
        <h2 class="bks-name">{{booksDetail.name}}<span v-if="booksDetail.is_presell == 2">（预售）</span></h2>
        <p class="bks-teacher">主编：{{booksDetail.author}}<span>{{booksDetail.pub_company}}</span></p>
        <div class="bks-prices">
          <span class="yc-price">优财价：<em>{{booksDetail.pay_price}}元</em></span>
          <span class="original-price">定价：{{booksDetail.price}}元</span>
        </div>
        <div class="bks-buy-consult">
          <button type="button" name="button" class="btn-buy-books" @click="buyPay">立即购买</button>
          <button type="button" name="button" class="consult-btn" @click="consultLink">在线咨询</button>
        </div>
      </div>
    </div>
    <div class="bks-tab">书籍简介</div>
    <div class="books-main w-wrap">
      <div class="books-lf">
        <img :src="booksDetail.introduce" alt="" width="100%">
      </div>
      <div class="books-rt">
        <!-- 学员心声 -->
        <students-voice></students-voice>
        <!-- 猜你喜欢 -->
        <like-list></like-list>
      </div>
    </div>
  </div>
</template>
<script>
import { booksDetails } from '@/api/books'
import studentsVoice from '@/components/class/studentsVoice.vue'
import likeList from '@/components/class/likeList.vue'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      books_id: this.$route.query.books_id,
      booksDetail: {},
      consultInfo: JSON.parse(window.sessionStorage.getItem('consultInfo')) || {} // 在线咨询
    }
  },
  components: {
    studentsVoice,
    likeList
  },
  computed: {
    ...mapState({
      token: state => state.user.token
    })
  },
  mounted () {
    this.getBooksDetail()
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    getBooksDetail () {
      booksDetails({
        id: this.books_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.booksDetail = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 订单入库
    buyPay () {
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
            package_id: this.booksDetail.id,
            is_live: 3 // 1直播订单、2课程订单、3图书订单4积分订单
          }
        })
      })
    },
    consultLink () {
      window.open(this.consultInfo.consult_href, '_blank')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/scss/app";
  .nav-title{
    padding-left: 24px;
    color: $col999;
    @include lh(44, 44);
    i{
      margin: 0 10px;
    }
    a{
      color: $col999;
      &:hover{
        color: $blueColor;
      }
    }
    span{
      color: $col333;
    }
  }
  .bks-detail{
    padding: 34px 90px 39px;
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 6px;
    margin-bottom: 20px;
    cursor: pointer;
    .bks-img{
      width: 174px;
      height: 210px;
    }
  }
  .bks-info{
    padding-left: 121px;
    flex: 1;
    .bks-name{
      font-size: 24px;
      line-height: 24px;
    }
    .bks-teacher{
      color: $col999;
      margin-top: 16px;
      font-size: 16px;
      span{
        margin-left: 22px;
      }
    }
    .bks-prices{
      font-size: 16px;
      margin-top: 36px;
      .yc-price{
        font-weight: 400;
        margin-right: 27px;
      }
      .original-price{
        color: $col999;
        text-decoration: line-through;
      }
      em{
        color: #F99111;
        font-size: 22px;
      }
    }
  }
  .bks-buy-consult{
    margin-top: 13px;
    button{
      width: 117px;
      height: 32px;
      margin-right: 12px;
      border-radius: 16px;
      color: #ffffff;
      &.btn-buy-books{
        background:#FF9B3A;
        border: 1px solid #FF9B3A;
      }
      &.consult-btn{
        color: $blueColor;
        border: 1px solid $blueColor;
      }
    }
  }
  .bks-tab{
    padding: 0 24px;
    font-size: 16px;
  }
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
</style>
