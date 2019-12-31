<template>
  <div class="user-wrap">
    <!-- 用户信息 -->
    <user-top :personalInfo="personalInfo" :user_id="user_id" @setBaseInfo="setBaseInfo" @getPersonalInfo="getPersonalInfo"></user-top>
    <!-- main -->
    <div class="user-main w-wrap">
      <div class="userm-left" ref="usermLeft">
        <ul class="userm-list">
          <li class="userm-item" :class="[v.class_name, {'curren': clkTit == v.type}]" v-for="(v, index) in userArr" :key="index" @click="switchInfo(v, index)">
            <i class="userm-icon"></i>{{v.tit}}
          </li>
        </ul>
      </div>
      <div class="userm-right" ref="usermRight">
        <course-info v-if="clkTit == 'course'" :user_id="user_id"></course-info>
        <education-info v-if="clkTit == 'education'" :user_id="user_id"></education-info>
        <questions-info v-if="clkTit == 'questions'" :user_id="user_id"></questions-info>
        <!-- <zhibo-info v-if="clkTit == 'zhibo'" :user_id="user_id"></zhibo-info> -->
        <answer-info v-if="clkTit == 'answer'" :user_id="user_id"></answer-info>
        <order-info v-if="clkTit == 'order'" :user_id="user_id"></order-info>
        <account-info v-if="clkTit == 'account'" :user_id="user_id"></account-info>
        <set-info v-if="clkTit == 'set' && personalInfo.username" :user_id="user_id" :personalInfo="personalInfo" @getPersonalInfo="getPersonalInfo"></set-info>
      </div>
    </div>
  </div>
</template>

<script>
import courseInfo from '../../components/personal/courseInfo'
import questionsInfo from '../../components/personal/questionsInfo'
// import zhiboInfo from '../../components/personal/zhiboInfo'
import answerInfo from '../../components/personal/answerInfo'
import orderInfo from '../../components/personal/orderInfo'
import accountInfo from '../../components/personal/accountInfo'
import educationInfo from '../../components/personal/educationInfo'
import setInfo from '../../components/personal/setInfo'
import userTop from '../../components/personal/userTop'
import { getPersonal } from '@/api/personal'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      userArr: [
        {
          type: 'course',
          tit: '课程',
          class_name: 'userm-item-01'
        },
        {
          type: 'education',
          tit: '后续教育',
          class_name: 'userm-item-07'
        },
        {
          type: 'questions',
          tit: '题库',
          class_name: 'userm-item-02'
        },
        // {
        //   type: 'zhibo',
        //   tit: '直播',
        // class_name: 'userm-item-03'
        // },
        {
          type: 'answer',
          tit: '答疑',
          class_name: 'userm-item-04'
        },
        {
          type: 'order',
          tit: '订单',
          class_name: 'userm-item-05'
        },
        {
          type: 'account',
          tit: '账号',
          class_name: 'userm-item-06'
        }
      ],
      clkTit: this.$route.query.type || 'course',
      personalInfo: {} // 个人信息
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  components: {
    courseInfo,
    questionsInfo,
    // zhiboInfo,
    answerInfo,
    orderInfo,
    accountInfo,
    educationInfo,
    setInfo,
    userTop
  },
  mounted () {
    this.getUserInfo()
    if (this.isLoadHttpRequest) {
      this.getPersonalInfo()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getPersonalInfo()
      })
    }
    // window.addEventListener('scroll', this.scrollToTop)
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    // scrollToTop () {
    //   let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    //   if (scrollTop > 70) {
    //     this.$refs.usermLeft.style.position = 'fixed'
    //     this.$refs.userTop1.style.position = 'fixed'
    //     this.$refs.userTop1.style.top = 70 + 'px'
    //     this.$refs.usermLeft.style.top = 120 + 'px'
    //     this.$refs.usermLeft.style.width = 120 + 'px'
    //     this.$refs.usermLeft.style.height = 120 + 'px'
    //     this.$refs.usermRight.style.marginLeft = 229 + 'px'
    //     if (this.$refs.usermLeft.style) {
    //     }
    //   } else {
    //     if (this.$refs.usermLeft.style && scrollTop > 0) {
    //       this.$refs.usermLeft.removeAttribute('style')
    //       this.$refs.usermRight.removeAttribute('style')
    //     }
    //   }
    // },
    // 切换tab课程题库答疑直播订单账号
    switchInfo ({ type }, index) {
      this.clkTit = type
      this.$router.replace({ path: '/personal',
        query: {
          ...this.$route.query,
          type: type,
          selIdx: 0
        }
      })
    },
    // 设置用户信息
    setBaseInfo () {
      this.clkTit = 'set'
      this.$router.replace({ path: '/personal',
        query: {
          ...this.$route.query,
          type: 'set',
          selIdx: 0
        }
      })
    },
    // 用户信息
    getPersonalInfo (type) {
      getPersonal({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.personalInfo = res.data
          this.personalInfo.address.forEach(v => {
            v.flag = false
            v.value = '设置默认地址'
            if (v.is_default === 1) {
              v.value = '取消默认地址'
            }
          })
          let obj = {
            username: this.personalInfo.username,
            head: this.personalInfo.head,
            sex: this.personalInfo.sex
          }
          window.sessionStorage.setItem('personalInfo', JSON.stringify(obj))
          this.getUserInfo()
        } else {
          this.$Message.error(res.msg)
        }
      })
    }

  },
  beforeRouteLeave (to, from, next) {
    // window.sessionStorage.removeItem('type')
    // window.sessionStorage.removeItem('selIdxCourse')
    // window.sessionStorage.removeItem('selIdxQuestion')
    // window.sessionStorage.removeItem('selIdxAnswer')
    // window.sessionStorage.removeItem('selIdxOrder')
    // window.sessionStorage.removeItem('selIdxAccount')
    document.body.removeAttribute('style')
    this.visible = false
    next()
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  @import "../../assets/scss/personal.css";
  .user-main{
    @include flexJustify;
    padding-top: 38px;
    .userm-left{
      width: 128px;
      font-size: 18px;
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
    padding-left: 15px;
    height: 46px;
    line-height: 46px;
    color: $col666;
    cursor: pointer;
    &.curren, &:hover{
      color: $colfff;
      background: $blueColor;
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
        border-left-color: $blueColor;
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
    }
    .userm-item-01.curren &, .userm-item-01:hover &{
      background-image: url('../../assets/images/user/user-active-icon01.png');
    }
    .userm-item-02 &{
      background-image: url('../../assets/images/user/user-icon02.png');
    }
    .userm-item-02.curren &, .userm-item-02:hover &{
      background-image: url('../../assets/images/user/user-active-icon02.png');
    }
    .userm-item-03 &{
      background-image: url('../../assets/images/user/user-icon03.png');
    }
    .userm-item-03.curren &, .userm-item-03:hover &{
      background-image: url('../../assets/images/user/user-active-icon03.png');
    }
    .userm-item-04 &{
      background-image: url('../../assets/images/user/user-icon04.png');
    }
    .userm-item-04.curren &, .userm-item-04:hover &{
      background-image: url('../../assets/images/user/user-active-icon04.png');
    }
    .userm-item-05 &{
      background-image: url('../../assets/images/user/user-icon05.png');
    }
    .userm-item-05.curren &, .userm-item-05:hover &{
      background-image: url('../../assets/images/user/user-active-icon05.png');
    }
    .userm-item-06 &{
      background-image: url('../../assets/images/user/user-icon06.png');
    }
    .userm-item-06.curren &, .userm-item-06:hover &{
      background-image: url('../../assets/images/user/user-active-icon06.png');
    }
    .userm-item-07 &{
      background-image: url('../../assets/images/user/user-icon07.png');
    }
    .userm-item-07.curren &, .userm-item-07:hover &{
      background-image: url('../../assets/images/user/user-active-icon07.png');
    }
  }
</style>
