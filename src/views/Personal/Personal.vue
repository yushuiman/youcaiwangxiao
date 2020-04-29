<template>
  <div class="user-wrap">
    <!-- 用户信息 -->
    <user-top :personalInfo="personalInfo" :examine="examine" :user_id="user_id" :fixedFlag="fixedFlag" @setBaseInfo="setBaseInfo" @getPersonalInfo="getPersonalInfo"></user-top>
    <!-- main -->
    <div class="user-main w-wrap">
      <div class="userm-left" ref="usermLeft" :class="{'fixedCla': fixedFlag}">
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
        <account-info v-if="clkTit == 'account'" :user_id="user_id" :personalInfo="personalInfo" @omoWriShow="omoWriShow"></account-info>
        <set-info v-if="clkTit == 'set' && personalInfo.username" :user_id="user_id" :personalInfo="personalInfo" @getPersonalInfo="getPersonalInfo"></set-info>
      </div>
    </div>
    <Modal v-model="omoVisible"
      :width="495"
      footer-hide
      title="完善OMO信息">
      <div class="omo-wri">
        <p><input type="text" placeholder="请输入姓名" v-model.trim="omoName"></p>
        <p><input type="text" disabled placeholder="请输入手机号" v-model="personalInfo.mobile"></p>
        <p><input type="text" placeholder="请输入邮箱" v-model="omoEmail"></p>
        <!-- <p><input type="text" placeholder="请输入身份证号" v-model.trim="omoIdentity"></p> -->
        <div class="omo-submit">
          <button class="btn-com" @click="omoWriSub">提交</button>
        </div>
      </div>
    </Modal>
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
import { getPersonal, putOmoUser } from '@/api/personal'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      fixedFlag: false,
      userArr: [
        {
          type: 'course',
          tit: '课程',
          class_name: 'userm-item-01'
        },
        {
          type: 'questions',
          tit: '题库',
          class_name: 'userm-item-02'
        },
        // {
        //   type: 'zhibo',
        //   tit: '直播',
        //   class_name: 'userm-item-03'
        // },
        {
          type: 'answer',
          tit: '答疑',
          class_name: 'userm-item-04'
        },
        {
          type: 'education',
          tit: '后续教育',
          class_name: 'userm-item-07'
        },
        {
          type: 'order',
          tit: '订单',
          class_name: 'userm-item-05'
        },
        {
          type: 'account',
          tit: '账户',
          class_name: 'userm-item-06'
        }
      ],
      clkTit: this.$route.query.type || 'course',
      personalInfo: {}, // 个人信息
      examine: {}, // 设置课程考试时间
      omoVisible: false,
      omoName: '',
      omoEmail: '',
      omoIdentity: ''
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
    if (this.isLoadHttpRequest) {
      this.getPersonalInfo()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getPersonalInfo()
      })
    }
    window.addEventListener('scroll', this.scrollToTop)
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    scrollToTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 100) {
        this.fixedFlag = true
      } else {
        this.fixedFlag = false
      }
    },
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
      this.showLoading(true)
      getPersonal({
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.personalInfo = res.data
          if (this.personalInfo.is_adj === 2) { // is_adj:OMO用户是否完善了信息 1完善了2 未完善
            this.omoVisible = true
          }
          this.examine = res.data.examine
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
    },
    // 完善omo信息
    omoWriShow () {
      this.omoVisible = true
    },
    omoWriSub () {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (this.omoName === '') {
        this.$Message.error('请输入姓名～')
        return
      }
      if (this.omoName.length < 2 || this.omoName.length > 10) {
        this.$Message.error('请输入2-10位姓名字符～')
        return
      }
      if (this.omoEmail === '') {
        this.$Message.error('请输入邮箱～')
        return
      }
      if (!regEmail.test(this.omoEmail)) {
        this.$Message.error('请输入正确的邮箱～')
        return
      }
      // if (this.omoIdentity === '') {
      //   this.$Message.error('请输入身份证号～')
      //   return
      // }
      // if (!reg.test(this.omoIdentity)) {
      //   this.$Message.error('请输入正确的身份证号~')
      //   return
      // }
      putOmoUser({
        user_id: this.user_id,
        // identity_card: this.omoIdentity,
        realname: this.omoName,
        omo_email: this.omoEmail,
        omo_mobile: this.personalInfo.mobile
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.omoVisible = false
          this.$Message.success('提交成功～')
          this.getPersonalInfo()
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    // window.sessionStorage.removeItem('type')
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
    // @include flexJustify;
    position: relative;
    padding-top: 38px;
    min-height: 700px;
    .userm-left{
      width: 128px;
      font-size: 18px;
      position: fixed;
      &.fixedCla{
        top: 160px;
      }
    }
    .userm-right{
      width: 971px;
      position: absolute;
      left: 229px;
      top: 38px;
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
    height: 20px;
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
  .omo-wri{
    text-align: center;
    padding-bottom: 20px;
    p{
      margin-bottom: 20px;
      input{
        width: 275px;
        height: 40px;
        padding-left: 14px;
        background: #f5f5f5;
        border-radius: 4px;
        border: 1px solid #dcdcdc;
      }
    }
    .btn-com{
      width: 122px;
      height: 36px;
      background: $blueColor;
      color: #ffffff;
      margin: 0 auto;
      margin-top: 20px;
      display: block;
      border-radius: 30px;
    }
  }
</style>
