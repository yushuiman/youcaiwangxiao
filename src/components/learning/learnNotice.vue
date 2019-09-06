<template>
  <div class="right-com">
    <div class="com-title">
      <span>学习公告</span>
    </div>
    <ul class="com-list">
      <li class="com-item" v-for="(item, index) in listNew" :key="index" @click="goJumphref(item)">
        <span class="c-black">{{item.title}}</span>
        <span class="c-gray">{{item.create_time.split(' ')[0]}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { listNew } from '@/api/learncenter'
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
      listNew().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.listNew = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    goJumphref ({ jumphref }) {
      window.open(jumphref, '_blank')
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
    padding-left: 22px;
    height: 39px;
    line-height: 39px;
    border-bottom: 1px solid #E6E6E6;
    background: url('../../assets/images/learncenter/r-icon01.png') no-repeat left center;
    background-size: 12px 14px;
  }
  .com-list{
    padding: 10px 0;
    margin-bottom: 20px;
    .com-item{
      height: 20px;
      line-height: 20px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
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
