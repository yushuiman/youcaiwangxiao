<template>
  <div class="user-wrap">
    <div class="user-top-wrap">
      <div class="w-wrap">
        <div class="integral-signin">{{personalInfo.integral}}积分
          <span :class="{'gray': personalInfo.is_card == 1}" @click="getLearnClock">{{personalInfo.is_card == 1 ? '已签到' : '签到'}}</span>
        </div>
        <div class="user-flex">
          <div class="user-info">
            <img :src="personalInfo.head" alt="头像" class="head-logo">
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
    <!-- main -->
    <div class="u-news-wrap w-wrap">
      <ul class="tab-list">
        <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdxNews == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
      </ul>
      <div class="news-main">
        <!-- 网校公告 系统消息 -->
        <div v-if="systeMessageList.length">
          <div v-if="newsFlag">
            <ul class="news-list">
              <li class="news-item" :class="{'invalid': item.status == 2}" v-for="(item, index) in systeMessageList" :key="index" @click="getRead(item)">
                <span class="news-left" v-if="item.type != 4" :class="{'bule': (item.type == 1 ||item.type == 2), 'green': item.type == 6, 'orange': item.type == 3, 'red': item.type == 5 }">{{types[item.type]}}</span>
                <img src="../../assets/images/global/news-logo.png" alt="优财logo" class="news-l" v-if="item.type == 4 && item.status == 1">
                <img src="../../assets/images/global/new-logo-gray.png" alt="优财logo" class="news-l" v-if="item.type == 4 && item.status == 2">
                <!-- 1课程 2题库-->
                <div class="news-center" v-if="item.type == 1 || item.type == 2">
                  <h3>{{item.title}}<em>{{item.create_time}}</em></h3>
                  <p>您的提问{{item.content}}有新的回答</p>
                </div>
                <!-- 3订单 4普通 5链接 6直播 -->
                <div class="news-center" v-if="item.type == 3 || item.type == 4 || item.type == 5 || item.type == 6">
                  <h3><span>{{item.title}}</span><em>{{item.create_time}}</em></h3>
                  <p>{{item.content}}</p>
                </div>
              </li>
            </ul>
            <div style="padding: 20px; text-align: center;">
              <Page
              :total="total"
              @on-change="onChange"
              :current="page"
              :page-size="limit"
              size="small"
              />
            </div>
          </div>
          <div class="news-datail" v-if="!newsFlag">
            <div class="news-title">
              <a class="return" @click="returnNewsList">返回</a>
              <div class="txt">
                <h2>{{newsDetail.message.title}}</h2>
                <p>{{newsDetail.message.create_time}}</p>
              </div>
              <div class="change-item">
                <a class="next-item" @click="changeItem(1)">&lt;&lt; 上一条</a>
                <a class="prev-item" @click="changeItem(2)">下一条 &gt;&gt;</a>
              </div>
            </div>
            <div class="news-info">
              {{newsDetail.message.content}}
            </div>
          </div>
        </div>
        <div class="no-data" v-else>暂无消息</div>
      </div>
    </div>
  </div>
</template>

<script>
// import news from '../../components/personal/news'
import { getPersonal, learnClock } from '@/api/personal'
import { systeMessage, read, listMessage } from '@/api/message'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      personalInfo: {}, // 个人信息
      learnClockInfo: {}, // 签到
      txtArr: ['网校公告', '系统消息'],
      // selIdxNews: window.sessionStorage.getItem('selIdxNews') || 0,
      selIdxNews: 0,
      limit: 10,
      page: 1,
      ycwxMessageList: [], // 网校公告
      systeMessageList: [], // 系统消息
      types: {
        1: '答疑',
        2: '答疑',
        3: '订单',
        4: '普通',
        5: '推送',
        6: '课程'
      },
      newsDetail: {},
      newsFlag: true
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      token: state => state.user.token,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  components: {
    // news
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.getPersonalInfo()
      this.getSysteMessage()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getPersonalInfo()
        this.getSysteMessage()
      })
    }
  },
  methods: {
    ...mapActions([
      'getIndexMessage'
    ]),
    // 用户信息
    getPersonalInfo () {
      getPersonal({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.personalInfo = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
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
          this.$Message.success('签到' + res.data.num + '次')
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 继续学习
    goStudy () {
      this.$router.push('/class')
    },
    // 继续做题
    goDotopic () {
      this.$router.push('/question')
    },
    tabClk (v, index) {
      if (!this.user_id) {

      }
      this.selIdxNews = index
      this.page = 1
      this.newsFlag = true
      this.getSysteMessage()
    },
    // 消息列表
    getSysteMessage () {
      let type
      if (this.selIdxNews === 0) {
        type = 1
      }
      if (this.selIdxNews === 1) {
        type = 2
      }
      systeMessage({
        user_id: this.user_id,
        limit: this.limit,
        page: this.page,
        types: type // 1网校公告2系统消息
      }).then(data => {
        const res = data.data
        let { message, num } = res.data
        this.systeMessageList = message
        this.total = num
        // if (type === 1) {
        //   this.ycwxMessageList = res.data.message
        //   this.total = res.num
        // }
        // if (type === 2) {
        //   this.systeMessageList = res.data.message
        //   this.total = res.num
        // }
      })
    },
    // 已读
    getRead (item) {
      if (item.status === 2) { // 已读消息
        this.diffNews(item) // 12345种消息
        return
      }
      read({
        user_id: this.user_id,
        message_id: item.message_id,
        type: item.type
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.getIndexMessage() // 更新未读消息状态
          this.systeMessageList.forEach(v => {
            if (item.message_id === v.message_id) {
              v.status = 2
            }
          })
          this.diffNews(item) // 12345种消息
        }
      })
    },
    diffNews (item) {
      if (item.type === 1) { // 课程回复
        window.sessionStorage.setItem('type', 'answer')
        window.sessionStorage.setItem('selIdxAnswer', 0)
        this.$router.push({ path: 'personal', query: { num: item.content_id } })
      }
      if (item.type === 2) { // 题库回复
        window.sessionStorage.setItem('type', 'answer')
        window.sessionStorage.setItem('selIdxAnswer', 1)
        this.$router.push({ path: 'personal', query: { num: item.content_id } })
      }
      if (item.type === 3) { // 订单
        window.sessionStorage.setItem('type', 'order')
        this.$router.push('/personal')
      }
      if (item.type === 4) { // 普通
        this.getListMessage(item)
      }
      if (item.type === 5) { // 推送
        window.open(item.href, '_blank')
      }
    },
    // 详情
    getListMessage (item) {
      listMessage({
        message_id: item.message_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          const res = data.data
          this.newsDetail = res.data
          this.newsFlag = false
        }
      })
    },
    // 详情上一条下一条
    changeItem (type) {
      let obj = {
        type: this.newsDetail.type
      }
      if (type === 1) {
        obj.message_id = this.newsDetail.lastPage
        if (this.newsDetail.lastPage === '') {
          this.$Message.error('已是第一条')
          return
        }
      }
      if (type === 2) {
        obj.message_id = this.newsDetail.nextPage
        if (this.newsDetail.nextPage === '') {
          this.$Message.error('已是最后一条')
          return
        }
      }
      this.getRead(obj)
    },
    // 返回
    returnNewsList () {
      this.newsFlag = true
    },
    // 分页
    onChange (val) {
      this.page = val
      this.getSysteMessage()
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  // @import "../../assets/scss/personal.css";
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
  /* tab */
  .tab-list {
      display: flex;
      align-items: center;
      text-align: center;
      margin-bottom: 20px;
      font-size: 18px;
  }
  .tab-list .tab-item {
      margin: 0 30px;
      position: relative;
      cursor: pointer;
  }
  .tab-list .tab-item:before {
      position: absolute;
      content: "";
      left: 50%;
      width: 36px;
      height: 2px;
      background: none;
      margin-top: 22px;
      margin-left: -18px;
  }

  .tab-list .tab-item.active {
      color: #0267FF;
  }
  .tab-list .tab-item.active:before {
      background: #0267FF;
  }
  // 消息
  .u-news-wrap{
    padding-top: 50px;
  }
  .news-item {
    padding: 20px 30px;
    background:rgba(255,255,255,1);
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
    font-size: 16px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &.invalid *{
      color: #C7C7C7!important;
    }
    &.invalid{
      .news-left{
        border: 1px solid #C7C7C7;
      }
    }
  }
  .news-l{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 20px;
  }
  .news-left{
    width: 53px;
    height: 24px;
    line-height: 24px;
    border-radius: 2px;
    text-align: center;
    margin-right: 20px;
    &.blue{
      border: 1px solid $blueColor;
      color: $blueColor;
    }
    &.orange{
      border: 1px solid #F99111;
      color: #F99111;
    }
    &.red{
      border: 1px solid #E84342;
      color: #E84342;
    }
    &.green{
      border: 1px solid #0AAB55;
      color: #0AAB55;
    }
    &.gray{
      border: 1px solid #C7C7C7;
      color: #C7C7C7;
    }
  }
  .news-center{
    flex: 1;
    h2, h3{
      line-height: 25px;
      font-size: 18px;
      color: $col666;
      span{
        margin: 0 5px;
        color: $col333;
      }
      em{
        color: $col999;
      }
    }
    h3{
      display: flex;
      justify-content: space-between;
    }
    p{
      margin-top: 8px;
      line-height: 20px;
      color: $col999;
    }
  }
  // 消息详情
  .news-datail{
    font-size: 16px;
    background: #ffffff;
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
  }
  .news-title{
    padding: 29px 30px 19px;
    text-align: center;
    border-bottom: 1px solid #E6E6E6;
    position: relative;
    .txt{
      h2{
        font-size: 20px;
        line-height: 28px;
      }
      p{
        color: $col999;
        line-height: 20px;
      }
    }
    a{
      line-height: 28px;
      color: $blueColor;
      &.prev-item{
        margin-left: 30px;
      }
    }
    .return{
      position: absolute;
      left: 30px;
      top: 29px;
    }
    .change-item{
      position: absolute;
      top: 29px;
      right: 30px;
    }
  }
  .news-info{
    padding: 19px 30px 29px;
    font-size: 16px;
    color: $col666;
    line-height: 26px;
  }
</style>
