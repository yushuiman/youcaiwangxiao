<template>
    <div class="user-wrap">
      <div class="user-top-wrap">
        <div class="w-wrap">
          <div class="integral-signin">35积分<span>签到</span></div>
          <div class="user-flex">
            <div class="user-info">
              <img src="../../assets/images/user/user-top-bg.jpg" alt="头像" class="head-logo">
              <div class="user-name-instr">
                <h2>优财学员昵称</h2>
                <p>您已入学<span>124</span>天啦！</p>
              </div>
            </div>
            <div class="go-on-some">
              <a class="zhibo"><Icon type="ios-play" />最近直播</a>
              <a>继续学习</a>
              <a>继续做题</a>
            </div>
          </div>
        </div>
      </div>
      <!-- main -->
      <div class="user-main w-wrap">
        <div class="userm-left">
          <ul class="userm-list">
            <li class="userm-item" :class="['userm-item-0' + (index+1), {'curren': clkTit == v.type}]" v-for="(v, index) in userArr" :key="index" @click="switchInfo(v, index)">
              <i class="userm-icon" :class="{'curren': clkTit == v.type}"></i>{{v.tit}}
            </li>
          </ul>
        </div>
        <div class="userm-right">
          <div>
            <select class="com-sel" v-model="courseIdSel" @change="getCourseIdSel($event)">
              <option class="com-opt" :value="v.course_id" v-for="(v, index) in courseList" :key="index">{{v.name}}</option>
            </select>
          </div>
          <course-info v-if="clkTit == 'course'"></course-info>
          <questions-info v-if="clkTit == 'questions'"></questions-info>
          <zhibo-info v-if="clkTit == 'zhibo'"></zhibo-info>
          <answer-info v-if="clkTit == 'answer'"></answer-info>
          <order-info v-if="clkTit == 'order'"></order-info>
          <account-info v-if="clkTit == 'account'"></account-info>
        </div>
      </div>
    </div>
</template>

<script>
import { getProject } from '@/api/personal'
import courseInfo from '../../components/personal/courseInfo'
import questionsInfo from '../../components/personal/questionsInfo'
import zhiboInfo from '../../components/personal/zhiboInfo'
import answerInfo from '../../components/personal/answerInfo'
import orderInfo from '../../components/personal/orderInfo'
import accountInfo from '../../components/personal/accountInfo'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      userArr: [
        {
          type: 'course',
          tit: '课程'
        },
        {
          type: 'questions',
          tit: '题库'
        },
        {
          type: 'zhibo',
          tit: '直播'
        },
        {
          type: 'answer',
          tit: '答疑'
        },
        {
          type: 'order',
          tit: '订单'
        },
        {
          type: 'account',
          tit: '账号'
        }
      ],
      clkTit: window.sessionStorage.getItem('type') || 'course',
      courseList: [], // 课程列表
      courseIdSel: window.sessionStorage.getItem('course_id') || ''
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  components: {
    courseInfo,
    questionsInfo,
    zhiboInfo,
    answerInfo,
    orderInfo,
    accountInfo
  },
  mounted () {
    this.getProjectList()
  },
  methods: {
    switchInfo ({ type }, index) {
      this.clkTit = type
      window.sessionStorage.setItem('type', type)
    },
    getProjectList (type) {
      getProject({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        this.courseList = res.data
      })
    },
    getCourseIdSel (e) {
      window.sessionStorage.setItem('selIdx', e.target.selectedIndex)
      window.sessionStorage.setItem('course_id', this.courseIdSel)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .user-wrap{
    font-size: 18px;
  }
  .user-top-wrap{
    height: 206px;
    background: #112441 url('../../assets/images/user/user-top-bg.jpg') repeat center;
    background-size: 349px 167px;
  }
  .user-top-wrap{
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
    }
  }
  .user-name-instr{
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
  .user-main{
    @include flexJustify;
    padding-top: 38px;
    .userm-left{
      width: 142px;
    }
    .userm-right{
      width: 971px;
    }
  }
  .userm-list{
    padding-top: 15px;
  }
  .userm-item{
    margin: 15px 0;
    height: 46px;
    line-height: 46px;
    text-align: center;
    color: $col666;
    &.curren{
      color: $colfff;
      background: #0267FF;
      border-radius: 8px 0px 0px 8px;
      position: relative;
      &:before{
        position: absolute;
        content: "";
        right: -30px;
        top: 0px;
        width: 0;
        height: 0;
        border: 23px solid transparent;
        border-right-width: 15px;
        border-left-color: #0267FF;
        border-left-width: 15px;
      }
    }
  }
  .userm-icon{
    width: 20px;
    height: 18px;
    margin-right: 10px;
    margin-top: -5px;
    vertical-align: middle;
    @extend %bg-img;
    .userm-item-01 &{
      background-image: url('../../assets/images/user/user-icon01.png');
      &.curren{
        background-image: url('../../assets/images/user/user-active-icon01.png');
      }
    }
    .userm-item-02 &{
      background-image: url('../../assets/images/user/user-icon02.png');
      &.curren{
        background-image: url('../../assets/images/user/user-active-icon02.png');
      }
    }
    .userm-item-03 &{
      background-image: url('../../assets/images/user/user-icon03.png');
      &.curren{
        background-image: url('../../assets/images/user/user-active-icon03.png');
      }
    }
    .userm-item-04 &{
      background-image: url('../../assets/images/user/user-icon04.png');
      &.curren{
        background-image: url('../../assets/images/user/user-active-icon04.png');
      }
    }
    .userm-item-05 &{
      background-image: url('../../assets/images/user/user-icon05.png');
      &.curren{
        background-image: url('../../assets/images/user/user-active-icon05.png');
      }
    }
    .userm-item-06 &{
      background-image: url('../../assets/images/user/user-icon06.png');
      &.curren{
        background-image: url('../../assets/images/user/user-active-icon06.png');
      }
    }
  }
  .com-sel {
    line-height: 30px;
    cursor: pointer;        /*鼠标上移变成小手*/
    border: solid 1px $col666;
    padding-left: 14px;
    padding-right: 34px;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    // background: url("../../assets/images/questions/practice-icon01.png") no-repeat right center transparent;
    // background-size: 20px 20px;
}

.com-opt {
}
</style>
