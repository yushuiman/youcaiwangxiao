<template>
  <div class="right-com">
    <div class="com-title">
      <span>学员动态</span>
    </div>
    <div style="height: 123px; overflow:hidden;">
      <ul class="com-list" :class="{'anim': animate == true}">
        <li class="com-item" v-for="(item, index) in userDynamicList" :key="index">
          <span class="c-black">{{item}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import { userDynamic } from '@/api/learncenter'
export default {
  data () {
    return {
      animate: false,
      userDynamicList: [],
      scrollTimer: null,
      timer: null
    }
  },
  computed: {
  },
  mounted () {
    this.getUserDynamic()
  },
  methods: {
    scroll () {
      this.animate = true // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
      this.timer = setTimeout(() => { //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
        this.userDynamicList.push(this.userDynamicList[0]) // 将数组的第一个元素添加到数组的
        this.userDynamicList.shift() // 删除数组的第一个元素
        this.animate = false // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      }, 300)
    },
    getUserDynamic () {
      userDynamic().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.userDynamicList = res.data
          if (this.userDynamicList.length > 5) {
            this.scrollTimer = setInterval(() => {
              this.scroll()
            }, 1500)
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.scrollTimer)
    clearTimeout(this.timer)
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
    font-size: 14px;
    background: url('../../assets/images/learncenter/r-icon03.png') no-repeat left center;
    background-size: 14px 14px;
  }
  .com-list{
    padding: 10px 0;
    .com-item{
      height: 22px;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: $col999;
      .c-black{
        color: $col333;
      }
    }
  }
  .anim{
    transition: all 0.5s;
    margin-top: -22px;
  }
</style>
