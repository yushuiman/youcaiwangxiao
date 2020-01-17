<template>
  <div class="zixun-wrap">
    <img src="../../assets/images/zixun/banner.jpg" alt="" width="100%" height="100">
    <div class="zx-main w-wrap">
      <div class="zxm-left">
        <p class="zx-address">您的位置：<router-link :to="{path: '/zixun'}">{{detailInfo.parent_name}} </router-link>> {{detailInfo.type_name}}</p>
        <h1 class="zx-title">{{detailInfo.title}}</h1>
        <p class="zx-source">{{detailInfo.create_time}}<span>来源：{{detailInfo.source}}</span></p>
        <div class="zx-cont" v-html="detailInfo.content"></div>
      </div>
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
import { newsDetails } from '@/api/zixun'
import baokaoZhinan from '../../components/zixun/baokaoZhinan'
import getZiliao from '../../components/zixun/getZiliao'
export default {
  data () {
    return {
      news_id: this.$route.query.news_id,
      detailInfo: {}
    }
  },
  components: {
    baokaoZhinan,
    getZiliao
  },
  mounted () {
    this.getNewsDetails() // 消息列表
  },
  methods: {
    // 详情
    getNewsDetails () {
      this.showLoading(true)
      newsDetails({
        news_id: this.news_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.detailInfo = res.data
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
  .zx-main{
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    border-radius: 8px;
    .zxm-left{
      width: 903px;
      background: #ffffff;
      padding: 20px 60px;
    }
    .zxm-right{
      width: 278px;
    }
  }
  .zx-address{
    line-height: 25px;
    font-size: 18px;
    color: $col999;
    a{
      color: $col999;
    }
  }
  .zx-title{
    font-size: 18px;
    line-height: 25px;
    margin-top: 31px;
    margin-bottom: 6px;
    text-align: center;
  }
  .zx-source{
    text-align: center;
    color: $col999;
    span{
      margin-left: 14px;
    }
  }
  .zx-cont{
    padding-top: 21px;
    margin-top: 21px;
    border-top: 1px solid #E6E6E6;
    line-height: 22px;
  }
</style>
