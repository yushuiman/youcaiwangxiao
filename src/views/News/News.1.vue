<template>
  <div class="user-wrap">
    <!-- 用户信息 -->
    <user-top :personalInfo="personalInfo" :examine="examine" :user_id="user_id" :fixedFlag2="fixedFlag2" @setBaseInfo="setBaseInfo" @getPersonalInfo="getPersonalInfo"></user-top>
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
                <span class="news-left" v-if="item.type != 4" :class="{'blue': (item.type == 1 ||item.type == 2), 'green': item.type == 6, 'orange': item.type == 3, 'red': item.type == 5 }">{{types[item.type]}}</span>
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
                  <p v-html="item.content"></p>
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
            <div class="news-info" v-html="newsDetail.message.content"></div>
          </div>
        </div>
        <div class="no-data" v-if="noDataFlag">暂无消息</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPersonal } from '@/api/personal'
import { systeMessage, read, listMessage } from '@/api/message'
import userTop from '../../components/personal/userTop'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      personalInfo: {}, // 个人信息
      fixedFlag2: true,
      txtArr: ['网校公告', '系统消息'],
      selIdxNews: 0,
      limit: 10,
      page: 1,
      noDataFlag: false,
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
      newsFlag: true,
      examine: {} // 设置课程考试时间
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
    userTop
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
      this.showLoading(true)
      getPersonal({
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.personalInfo = res.data
          this.examine = res.data.examine
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    setBaseInfo () {
      this.$router.push({ path: '/personal', query: { type: 'set' } })
    },
    tabClk (v, index) {
      this.selIdxNews = index
      this.page = 1
      this.newsFlag = true
      this.getSysteMessage()
    },
    // 消息列表
    getSysteMessage () {
      this.showLoading(true)
      systeMessage({
        user_id: this.user_id,
        limit: this.limit,
        page: this.page,
        types: this.selIdxNews === 0 ? 1 : 2 // 1网校公告2系统消息
      }).then(data => {
        this.showLoading(false)
        this.noDataFlag = false
        const res = data.data
        let { message, num } = res.data
        this.systeMessageList = message
        if (this.systeMessageList.length === 0) {
          this.noDataFlag = true
        }
        this.total = num
      })
    },
    // 已读
    getRead (item) {
      if (item.status === 2) { // 已读消息
        this.diffNews(item) // 12345种消息
        return
      }
      this.showLoading(true)
      read({
        user_id: this.user_id,
        message_id: item.message_id,
        type: item.type
      }).then(data => {
        this.showLoading(false)
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
        this.$router.push({ path: '/personal', query: { type: 'answer', selIdx: 0, num: item.content_id } })
      }
      if (item.type === 2) { // 题库回复
        this.$router.push({ path: '/personal', query: { type: 'answer', selIdx: 1, num: item.content_id } })
      }
      if (item.type === 3) { // 订单
        this.$router.push({ path: '/personal', query: { type: 'order' } })
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
      this.showLoading(true)
      listMessage({
        message_id: item.message_id
      }).then(data => {
        this.showLoading(false)
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
        if (!this.newsDetail.lastPage) {
          this.$Message.error('已是第一条')
          return
        }
      }
      if (type === 2) {
        obj.message_id = this.newsDetail.nextPage
        if (!this.newsDetail.nextPage) {
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
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
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
      color: #066AE4;
  }
  .tab-list .tab-item.active:before {
      background: #066AE4;
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
