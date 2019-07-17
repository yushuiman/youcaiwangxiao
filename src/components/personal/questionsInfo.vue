<template>
  <div class="u-question-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': changeIdx == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <!-- 做题记录 -->
      <questions-menuItem v-if="changeIdx == 0" :courseList="courseList"></questions-menuItem>
      <!-- 错题集 -->
      <error-menuItem v-if="changeIdx == 1" :courseList="courseList"></error-menuItem>
      <!-- 收藏夹 -->
      <collection-menuItem v-if="changeIdx == 2" :courseList="courseList"></collection-menuItem>
      <!-- 习题笔记 -->
      <div v-if="changeIdx == 3">习题笔记</div>
    </div>

  </div>
</template>

<script>
import questionsMenuItem from '../../components/personal/questionsMenuItem'
import errorMenuItem from '../../components/personal/errorMenuItem'
import collectionMenuItem from '../../components/personal/collectionMenuItem'
import { mapState } from 'vuex'
export default {
  props: {
    courseList: {
      type: Array
    }
  },
  data () {
    return {
      txtArr: ['做题记录', '错题集', '收藏夹', '习题笔记'],
      changeIdx: window.sessionStorage.getItem('changeIdx'),
    }
  },
  components: {
    questionsMenuItem,
    errorMenuItem,
    collectionMenuItem
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    })
  },
  mounted () {
  },
  methods: {
    // tab
    tabClk (v, index) {
      if (!this.user_id) {

      }
      window.sessionStorage.setItem('changeIdx', index)
      this.changeIdx = index
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  // 做题记录
  .u-question-wrap{
    font-size: 18px;
  }
  // tab
  .tab-list{
    display: flex;
    align-items: center;
    text-align: center;
    margin-bottom: 20px;
    .tab-item{
      margin: 0 30px;
      position: relative;
      &:before{
        position: absolute;
        content: "";
        left: 50%;
        width: 36px;
        height: 2px;
        background: none;
        margin-top: 22px;
        margin-left: -18px;
      }
      &.active{
        color: #0267FF;
        &:before{
          background: #0267FF;
        }
      }
    }
  }
  .all-main{
    position: relative;
  }
</style>
