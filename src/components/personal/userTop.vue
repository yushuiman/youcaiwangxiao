<template>
  <div class="user-top-wrap">
    <div class="w-wrap">
      <div class="integral-signin">{{personalInfo.integral}}积分
        <span :class="{'gray': personalInfo.is_card == 1}" @click="getLearnClock">{{personalInfo.is_card == 1 ? '已签到' : '签到'}}</span>
      </div>
      <div class="user-flex">
        <div class="user-info">
          <img ref="fixedTit" :src="personalInfo.head" alt="头像" class="head-logo" @click="setBaseInfo">
          <div class="user-name-instr">
            <h2>{{personalInfo.username}}</h2>
            <p>您已入学<span>{{personalInfo.day}}</span>天啦！</p>
          </div>
        </div>
        <div class="go-on-some">
          <a class="zhibo"><Icon type="ios-play" />最近直播</a>
          <a @click="goStudy">继续学习</a>
          <a @click="goDotopic">继续做题</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { learnClock } from '@/api/personal'
import { mapActions, mapState } from 'vuex'
export default {
  props: ['personalInfo', 'user_id'],
  data () {
    return {
      learnClockInfo: {} // 签到打卡
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      watchRecordsList: state => state.user.watchRecordsList
    })
  },
  mounted () {

  },
  methods: {
    ...mapActions([
      'getWatchRecords'
    ]),
    // 签到打卡
    getLearnClock () {
      if (this.personalInfo.is_card === 1) {
        this.$Message.error('今日已签到')
        return
      }
      learnClock({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.learnClockInfo = res.data
          this.personalInfo.is_card = 1
          // this.$Message.success('签到第' + res.data.num + '天')
          this.$Message.success('签到成功')
          this.$emit('getPersonalInfo')
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 继续学习
    goStudy () {
      this.getWatchRecords({ userId: this.user_id }).then(() => {
        this.goonWatch()
      }) // 观看记录
    },
    goonWatch () {
      if (!(this.watchRecordsList && this.watchRecordsList.video)) {
        this.$router.push('/course')
        return
      }
      // 未购买
      if (this.watchRecordsList.is_purchase === 2) {
        this.$Message.error('请购买课程')
        return
      }
      // 购买
      let obj = {
        package_id: this.watchRecordsList.package_id,
        course_id: this.watchRecordsList.video.course_id,
        section_id: this.watchRecordsList.video.section_id,
        video_id: this.watchRecordsList.video.video_id
      }
      window.sessionStorage.setItem('userstatus', this.watchRecordsList.is_purchase) // 是否购买
      window.sessionStorage.setItem('playtime', this.watchRecordsList.video.watch_time) // 获取当前播放时间
      this.$router.push({ path: '/course-video', query: obj })
    },
    // 继续做题
    goDotopic () {
      this.$router.push('/question')
    },
    // 点击头像
    setBaseInfo () {
      this.$emit('setBaseInfo', 'set')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .user-top-wrap{
    font-size: 18px;
    height: 206px;
    background: #112441 url('../../assets/images/user/user-top-bg.jpg') repeat center;
    background-size: 349px 167px;
    color: #ffffff;
    padding-top: 30px;
    padding-bottom: 24px;
    .w-wrap{
      position: relative;
    }
  }
  .integral-signin{
    text-align: right;
    line-height: 33px;
    span{
      width: 72px;
      height: 33px;
      text-align: center;
      display: inline-block;
      border-radius: 17px;
      margin-left: 16px;
      background: $colfff;
      color: #112441;
      cursor: pointer;
      &.gray{
        background: #dddddd;
        color: $col666;
      }
    }
  }
  .user-flex{
    @include flexJustifyAlignItem;
    position: absolute;
    width: 100%;
    top: 60px;
  }
  .user-info{
    @include flexJustifyAlignItem;
    .head-logo{
      width: 142px;
      height: 142px;
      border: 4px solid $colfff;
      border-radius: 50%;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
  .user-name-instr{
    // position: absolute;
    // left: 142px;
    margin-left: 28px;
    h2{
      font-size: 28px;
    }
    p{
      font-size: 16px;
      line-height: 40px;
      span{
        font-size: 24px;
        margin: 0 4px;
      }
    }
  }
  .go-on-some{
    a{
      padding: 0 16px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      border-radius: 18px;
      border: 1px solid $colfff;
      color: $colfff;
      display: inline-block;
      margin-left: 15px;
      &.zhibo{
        background:rgba(216,216,216,0.3017);
        border: 0;
        .ivu-icon{
          margin-top: -3px;
          margin-right: 4px;
        }
      }
    }
  }
</style>
