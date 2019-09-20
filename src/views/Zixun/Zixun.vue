<template>
  <div class="zixun-wrap">
    <!-- <img src="../../assets/images/index/banner.png" alt="" width="100%" height="100"> -->
    <div class="zx-main w-wrap">
      <div class="zxm-left">
        <ul class="zx-list">
          <li class="zx-item" v-for="(item, index) in zixunList" :key="index">
            <img :src="item.image" alt="">
            {{item.title}}
            {{item.content}}
            {{item.source}}{{item.create_time}}
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
      <div class="zxm-right">
        右边
      </div>
    </div>

  </div>
</template>

<script>
import { newsList, newsDetails } from '@/api/zixun'
export default {
  data () {
    return {
      limit: 10,
      page: 1,
      total: 10,
      zixunList: []
    }
  },
  mounted () {
    this.getNewsList()
    // this.getNewsDetails()
  },
  methods: {
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
    getNewsDetails () {
      newsDetails({
        limit: 10
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.studentsRankList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 分页
    onChange (val) {
      this.page = val
      this.getNewsList()
    }
  }
}
</script>

<style scoped>
</style>
