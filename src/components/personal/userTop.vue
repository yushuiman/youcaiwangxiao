<template>
  <div class="user-top-wrap">
    <div class="w-wrap">
      <div class="user-info">
        <img ref="fixedTit" :src="personalInfo.head" alt="头像" class="head-logo" :class="{'headCla': fixedFlag, 'headCla2': fixedFlag2}" @click="setBaseInfo">
        <div class="user-flex">
          <div class="user-detail-left">
            <h2>{{personalInfo.username}}</h2>
            <div class="days-num">
              <p>加入优财<span><i>{{personalInfo.day}}</i>天</span></p>
              <em></em>
              <p>累计做题<span><i>{{personalInfo.day}}</i>道</span></p>
            </div>
            <!-- 1进行中2过期3未设置 -->
            <div class="test-time" v-if="examine.status == 1">
              <i @click="setTestTime"></i>距离考试还有<span>{{days.substring(0,1)}}</span><span>{{days.substring(1,2)}}</span><span>{{days.substring(2,3)}}</span>天啦！
            </div>
            <div class="test-time" v-if="examine.status == 2" @click="setTestTime">
              <i></i><a>考试已结束，请重新选择您的课程～</a>
            </div>
            <div class="test-time" v-if="examine.status == 3" @click="setTestTime">
              <i></i><a>请输入考试日期～</a>
            </div>
          </div>
          <div class="user-detail-right">
            <div class="integral-signin">{{personalInfo.integral}}积分
              <span :class="{'gray': personalInfo.is_card == 1}" @click="getLearnClock">{{personalInfo.is_card == 1 ? '已签到' : '签到'}}</span>
            </div>
            <div class="go-on-some">
              <a class="zhibo"><Icon type="ios-play" />最近直播</a>
              <a @click="goStudy">继续学习</a>
              <a @click="goDotopic">继续做题</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal title="设置考试时间"
      v-model="visible"
      footer-hide
      :width="401"
      @on-visible-change="testVisible"
      class="iview-modal">
      <div class="set-test-time-modal">
        <ul class="set-test-time">
          <li class="st-item">
            <label>考试科目</label>
            <select name="public-choice" v-model="courseId" @change="getCourseSelected">
              <option :value="item.course_id" v-for="item in userCourseList" :key="item.course_id">{{item.name}}</option>
            </select>
          </li>
          <li class="st-item">
            <label>考试时间</label>
            <select name="public-choice" v-model="examineId" @change="getTimeSelected">
              <option :value="item.examine_id" v-for="item in courseTimeList" :key="item.course_id">{{item.examine_time}}</option>
            </select>
          </li>
        </ul>
        <div class="test-time-save">
          <button class="btn-com test-btn" @click="saveTestTime">保存</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { learnClock, userCourse, courseTime, ctimeSub } from '@/api/personal'
import { mapActions, mapState } from 'vuex'
export default {
  // 个人中心fixedFlag 消息中心fixedFlag2
  props: ['personalInfo', 'user_id', 'fixedFlag', 'fixedFlag2', 'examine'],
  data () {
    return {
      learnClockInfo: {}, // 签到打卡
      visible: false,
      examineId: '', /// 当前选中
      courseId: '', // 当前选中
      userCourseList: [], // 科目
      courseTimeList: [] // 时间
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      watchRecordsList: state => state.user.watchRecordsList
    }),
    days () {
      let num
      if (this.examine.day == 0) {
        num = '000'
      }
      if (this.examine.day >= 10) {
        num = '0' + this.examine.day
      }
      if (this.examine.day >= 100) {
        num = '' + this.examine.day
      }
      return num
    }
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
    },
    // 设置科目考试时间
    setTestTime () {
      this.getUserCourse()
      // this.getCourseTime()
      this.visible = true
    },
    testVisible (val) {
      // console.log(val)
    },
    getUserCourse () {
      userCourse({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.userCourseList = res.data // 科目
          this.courseId = res.data[0].course_id
          // examine.status：1进行中2过期3未设置
          if (this.examine.status == 1 || this.examine.status == 2) {
            this.userCourseList.forEach(val => {
              if (val.course_id == this.examine.course_id) {
                this.courseId = val.course_id
              }
            })
          }
          this.getCourseTime()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    getCourseTime () {
      courseTime({
        course_id: this.courseId
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.courseTimeList = res.data // 时间
          // examine.status：1进行中2过期3未设置
          this.examineId = res.data[0].examine_id
          if (this.examine.status == 1 || this.examine.status == 2) {
            this.courseTimeList.forEach(val => {
              if (val.examine_id == this.examine.examine_id) {
                this.examineId = val.examine_id
              }
            })
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    saveTestTime () {
      ctimeSub({
        user_id: this.user_id,
        examine_id: this.examineId
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.visible = false
          this.$emit('getPersonalInfo')
          if (res.data.status == 2) {
            this.$Message.error('失败')
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    getCourseSelected (e) {
      this.getCourseTime()
    },
    getTimeSelected (e) {
      console.log(this.examineId)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  $btnGredientYellow: #FFE17A,#FFD338;
  .user-top-wrap{
    font-size: 18px;
    background: #112441 url('../../assets/images/user/user-top-bg.jpg') repeat center;
    background-size: 349px 167px;
    color: #ffffff;
    padding: 14px 0;
  }
  .user-flex{
    height: 178px;
    @include flexJustifyAlignItem;
    margin-left: 186px;
  }
  .user-info{
    .head-logo{
      width: 178px;
      height: 178px;
      border: 4px solid $colfff;
      border-radius: 50%;
      box-sizing: border-box;
      cursor: pointer;
      position: fixed;
      top: 84px;
      margin-left: -36px;
      &.headCla{
        width: 120px;
        height: 120px;
        top: 50px;
        margin-left: 11px;
      }
      &.headCla2{
        position: absolute;
      }
    }
  }
  .user-detail-left{
    font-size: 16px;
    h2{
      font-size: 22px;
    }
  }
  .days-num{
    display: flex;
    align-items: center;
    margin-top: 13px;
    margin-bottom: 35px;
    em{
      margin: 0 20px;
      width: 1px;
      height: 32px;
      background: #979797;
    }
    p{
      line-height: 22px;
      text-align: center;
      span{
        display: block;
        i{
          color: #FFDF70;
          font-style: normal;
        }
      }
    }
  }
  .test-time{
    height: 21px;
    line-height: 21px;
    i{
      margin-right: 8px;
      vertical-align: middle;
      margin-top: -4px;
      @include bg-img(23, 21, '../../assets/images/user/calendar-icon.png');
    }
    a{
      text-decoration: underline;
      color: #ffffff;
      &:hover{
        color: #8EBBFF;
      }
    }
    span{
      width: 26px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      color: #1F314C;
      margin: 0 2px;
      display: inline-block;
      @include bg-linear-gradient($btnGredientYellow, to bottom);
      border-radius: 4px;
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
  .go-on-some{
    margin-top: 84px;
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
  .set-test-time{
    padding: 15px 28px;
    border-top: 1px solid #E6E6E6;
    border-bottom: 1px solid #E6E6E6;
  }
  .st-item{
    margin: 20px 0;
    color: $col999;
    font-size: 16px;
    label{
      margin-right: 20px;
      color: $col333;
    }
    select{
      width: 257px;
      height: 45px;
      background: #E6E6E6;
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      color: $col999;
    }
  }
  .test-time-save{
    padding: 20px 0;
    text-align: center;
  }
  .test-btn{
    background: $blueColor;
    color: #ffffff;
  }
</style>
