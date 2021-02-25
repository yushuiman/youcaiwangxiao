<template>
  <div class="right-com">
    <div class="com-title">
      <span>最新资讯</span>
    </div>
    <ul class="com-list">
      <li class="com-item" v-for="(item, index) in listNew" :key="index" @click="goJumphref(item.news_id)">
        <span>{{index+1}}、</span>{{item.title}}
      </li>
    </ul>
  </div>
</template>

<script>
import { newInformation } from '@/api/education'
export default {
  data () {
    return {
      listNew: []
    }
  },
  computed: {

  },
  mounted () {
    this.getListNew()
  },
  methods: {
    getListNew () {
      newInformation().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.listNew = res.data.information
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    goJumphref (newsId) {
      this.$router.push({ path: '/zixun-detail',
        query: {
          news_id: newsId
        }
      })
      // window.open(jumphref, '_blank')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .right-com{
    padding: 0 10px;
    background: #ffffff;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .com-title{
    padding-left: 27px;
    height: 39px;
    line-height: 39px;
    border-bottom: 1px solid #E6E6E6;
    background: url('../../assets/images/education/news.png') no-repeat left center;
    background-size: 20px 19px;
  }
  .com-list{
    padding: 10px 0;
    .com-item{
      height: 26px;
      line-height: 26px;
      cursor: pointer;
      color: $col666;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      &:nth-child(1){
        span{
          color:#D30000;
        }
      }
      &:nth-child(2){
        span{
          color:#EB5F1A;
        }
      }
      &:nth-child(3){
        span{
          color:#FFC103;
        }
      }
    }
  }
</style>
