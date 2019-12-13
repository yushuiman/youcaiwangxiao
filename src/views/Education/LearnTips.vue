<template>
  <div>
学习须知列表
  </div>
</template>

<script>
import { tipsList } from '@/api/education'
export default {
  data () {
    return {
      type_id: this.$route.query.type_id,
      parent_id: this.$route.query.parent_id,
      tipsDetail: {}
    }
  },
  computed: {

  },
  mounted () {
    this.getTipsList()
  },
  methods: {
    getTipsList () {
      tipsList({
        type_id: this.type_id,
        parent_id: this.parent_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          console.log(res.data)
          this.listTips = res.data.information
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
  }
  .com-title{
    padding-left: 27px;
    height: 39px;
    line-height: 39px;
    border-bottom: 1px solid #E6E6E6;
    background: url('../../assets/images/course/like.png') no-repeat left center;
    background-size: 20px 20px;
  }
  .com-list{
    padding: 10px 0;
    margin-bottom: 20px;
    .com-item{
      height: 26px;
      line-height: 26px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      color: $col666;
      .c-black{
        width: 65%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .c-gray{
        font-size: 12px;
        color: $col999;
      }
    }
  }
</style>
