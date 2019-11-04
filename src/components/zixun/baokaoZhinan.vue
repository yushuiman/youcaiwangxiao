<template>
  <div class="right-com">
    <div class="com-title">
      <span>报考指南</span>
    </div>
    <ul class="com-list">
      <li class="com-item" v-for="(item, index) in bkznList" :key="index" @click="getNewsDetails(item.news_id)">
        <a>{{item.type_name}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { bkznList } from '@/api/zixun'

export default {
  inject: ['reload'],
  data () {
    return {
      bkznList: []
    }
  },
  computed: {

  },
  mounted () {
    this.getBkznList() // 报考指南
  },
  methods: {
    // 报考指南
    getBkznList () {
      bkznList().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.bkznList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 详情
    getNewsDetails (id) {
      this.$router.push({ path: '/zixun-detail',
        query: {
          news_id: id
        }
      })
      if (this.$route.name === 'zixun-detail') {
        this.reload()
        // window.location.reload()
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  // 报考指南
  .right-com{
    padding: 0 10px;
    background: #ffffff;
    border-radius: 8px;
  }
  .com-title{
    padding-left: 22px;
    height: 39px;
    line-height: 39px;
    border-bottom: 1px solid #E6E6E6;
    background: url('../../assets/images/learncenter/r-icon01.png') no-repeat left center;
    background-size: 16px 18px;
  }
  .com-list{
    padding: 10px 0;
    margin-bottom: 20px;
    margin-left: -4.3%;
    display: flex;
    flex-wrap: wrap;
    .com-item{
      width: 29%;
      height: 23px;
      line-height: 23px;
      font-size: 12px;
      text-align: center;
      background: #F3F6FF;
      margin-left: 4.3%;
      margin-bottom: 5px;
      a{
        color: $col333;
      }
    }
  }
</style>
