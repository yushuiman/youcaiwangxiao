<template>
  <div class="zixun-detail-wrap">
    <zixun-banner></zixun-banner>
    <div class="zx-main w-wrap">
      <div class="zxm-left" v-if="detailInfo.title">
        <!-- <p class="zx-address">您的位置：<router-link :to="{path: '/zixun'}">{{detailInfo.parent_name}} </router-link>> {{detailInfo.type_name}}</p> -->
        <h1 class="zx-title">{{detailInfo.title}}</h1>
        <p class="zx-source">{{detailInfo.create_time}}<span>来源：{{detailInfo.source}}</span></p>
        <div class="zx-cont" v-html="detailInfo.content"></div>
      </div>
      <div class="zxm-left" v-else>
        <span class="no-info">暂无数据</span>
      </div>
      <div class="zxm-right">
        <!-- 报考指南 -->
        <!-- <baokao-zhinan></baokao-zhinan> -->
        <!-- 获取资料 -->
        <get-ziliao></get-ziliao>
      </div>
    </div>
  </div>
</template>

<script>
import { footerContent } from '@/api/index'
import zixunBanner from '../../components/zixun/zixunBanner'
import baokaoZhinan from '../../components/zixun/baokaoZhinan'
import getZiliao from '../../components/zixun/getZiliao'
export default {
  data () {
    return {
      footer_id: this.$route.query.footer_id,
      detailInfo: {}
    }
  },
  components: {
    zixunBanner,
    baokaoZhinan,
    getZiliao
  },
  watch: {
    '$route': 'getNewsDetails'
  },
  mounted () {
    this.getNewsDetails()
  },
  methods: {
    // 详情
    getNewsDetails () {
      this.detailInfo = {}
      this.showLoading(true)
      footerContent({
        footer_id: this.$route.query.footer_id
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

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .zixun-detail-wrap{
    .zx-main{
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      border-radius: 8px;
      .zxm-left{
        width: 903px;
        background: #ffffff;
        padding: 20px 60px;
        .no-info{
          margin: 0 auto;
          display: block;
          text-align: center;
          line-height: 180px;
        }
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
      img{
        width: 100%;
        max-width: 100%;
      }
    }
  }
</style>
