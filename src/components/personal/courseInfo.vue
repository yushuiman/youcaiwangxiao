<template>
  <div class="u-course-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdxCourse == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
    </ul>
    <div class="all-main">
      <!-- 课程 -->
      <div class="u-course-main" v-if="selIdxCourse == 0">
        <div class="uc-item" v-for="(val, key) in myCourseList" :key="key">
          <img :src="val.pc_img" alt="" class="uci-img">
          <div class="uci-detail">
            <h2 class="ucid-name">{{val.name}}</h2>
            <p class="ucid-des">{{val.description}}</p>
            <p class="ucid-learn" v-if="val.video">{{val.video.video_name}}</p>
          </div>
          <button class="btn-com uci-learn">去学习</button>
        </div>
      </div>
      <!-- 播放记录 -->
      <div v-if="selIdxCourse == 1">
        <div v-if="watchRecordsList && watchRecordsList.length">

        </div>
        <div v-else>暂无播放记录</div>
      </div>
      <!-- 收藏课程 -->
      <div v-if="selIdxCourse == 2">
        收藏课程
      </div>
    </div>
  </div>
</template>

<script>
import { myCourse, watchRecords } from '@/api/personal'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      txtArr: ['课程', '播放记录', '收藏课程'],
      selIdxCourse: window.sessionStorage.getItem('selIdxCourse') || 0,
      btnSts: {
        1: '成绩统计',
        2: '继续做题',
        3: '查看解析'
      },
      myCourseList: [], //我的课程
      watchRecordsList: [] //播放记录
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    this.getMyCourse()
  },
  methods: {
    tabClk (v, index) {
      if (!this.user_id) {

      }
      window.sessionStorage.setItem('selIdxCourse', index)
      this.selIdxCourse = index
      if(this.selIdxCourse === 1){
        this.getWatchRecords()
      }
      if(this.selIdxCourse === 2){
        this.getMyCourse()
      }
    },
    // 我的课程
    getMyCourse () {
      myCourse({
        user_id: this.user_id,
      }).then(data => {
        const res= data.data
        this.myCourseList = res.data
      })
    },
    // 播放记录
    getWatchRecords () {
      watchRecords({
        user_id: this.user_id,
      }).then(data => {
        const res= data.data
        this.watchRecordsList = res.data
      })
    },
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .uc-item{
    display: flex;
    align-items: center;
    background: #ffffff;
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
    margin-bottom: 20px;
    padding-right: 20px;
    &:hover{
      background: #F3F6FF;
    }
    .uci-img{
      width: 198px;
      height: 109px;
      border-radius: 8px 0 0 8px;
    }
    .uci-detail{
      flex: 1;
      padding: 0 20px;
      h2{
        font-size: 18px;
        line-height: 26px;
      }
      .ucid-des{
        color: $col999;
        line-height: 20px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
      }
      .ucid-learn{
        color: $blueColor;
        margin-top: 13px;
      }
    }
    .btn-com{
      background: #1874FD;
      color: $colfff;
      font-size: 16px;
    }
  }
  // <div class="uc-item" v-for="(val, key) in myCourseList" :key="key">
  //         <img :src="val.pc_img" alt="" class="uci-img">
  //         <div class="uci-detail">
  //           <h2 class="ucid-name">{{val.name}}</h2>
  //           <p class="ucid-des">{{val.description}}</p>
  //           <p class="ucid-learn">{{val.description}}</p>
  //         </div>
  //         <button class="btn-com uci-learn">去学习</button>
  //       </div>
</style>
