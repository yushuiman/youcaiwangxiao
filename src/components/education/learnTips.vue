<template>
  <div class="right-com">
    <div class="com-title">
      <span>学习须知</span>
    </div>
    <ul class="com-list">
      <li class="tips-item" v-for="(item, index) in listTips" :key="index" @click="goJumphref(item)">
        <img :src="item.img" alt="">
        <p>{{item.type_name}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { tipsType } from '@/api/education'
export default {
  data () {
    return {
      listTips: []
    }
  },
  computed: {

  },
  mounted () {
    this.getTipsType()
  },
  methods: {
    getTipsType () {
      tipsType().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.listTips = res.data
          this.listTips.forEach((v, index) => {
            if (v.type_name === '学习要求') {
              v.img = require('../../assets/images/education/tips01.png')
            }
            if (v.type_name === '学习流程') {
              v.img = require('../../assets/images/education/tips02.png')
            }
            if (v.type_name === '上传CPE积分') {
              v.img = require('../../assets/images/education/tips03.png')
            }
            if (v.type_name === '常见问题') {
              v.img = require('../../assets/images/education/tips04.png')
            }
          })
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    goJumphref (item) {
      this.$router.push({ path: '/learn-tips',
        query: {
          type_id: item.type_id,
          parent_id: item.parent_id
        }
      })
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
    background: url('../../assets/images/education/like.png') no-repeat left center;
    background-size: 20px 20px;
  }
  .com-list{
    padding: 10px 0;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    .tips-item{
      margin: 10px 0;
      width: 50%;
      text-align: center;
      img{
        width: 59px;
        height: 59px;
      }
      p{
        margin-top: 7px;
        color: $col666;
      }
    }
  }
</style>
