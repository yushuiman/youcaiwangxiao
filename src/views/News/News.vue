<template>
  <div class="user-wrap">
    <div class="u-news-wrap w-wrap">
      <h1 class="news-tit">消息中心</h1>
      <ul class="tab-list-news">
        <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdxNews == v.types}" :key="index" @click="tabClk(v, index)"><b v-if="v.status == 1"></b>{{v.value}}</li>
      </ul>
      <div class="news-main">
        <!-- 网校公告 系统消息 -->
        <div v-if="systeMessageList.length">
          <ul class="news-list">
            <li class="news-item" :class="{'news-item-pb': selIdxNews == 1 || selIdxNews == 2}" v-for="(item, index) in systeMessageList" :key="index" @click.stop="getRead(item)">
              <div class="nitem-title">
                <p class="nitem-title-lf">
                  <b :class="{'no-read': item.status == 1}"></b>
                  <img v-if="selIdxNews == 3" src="../../assets/images/news/icon-wen.png" alt="">
                  <span v-if="selIdxNews == 3">{{item.quiz}}</span>
                  <span v-else-if="selIdxNews == 4">订单支付成功通知</span>
                  <span v-else>{{item.title}}</span>
                </p>
                <span class="nitem-title-rt">{{item.time}}</span>
              </div>
              <!-- 1系统消息2活动消息 -->
              <div class="nitem-detail" :class="{'sl' : !item.openFlag}" v-if="selIdxNews == 1 || selIdxNews == 2">
                <img v-if="selIdxNews == 3" src="../../assets/images/news/icon-da.png" alt="">
                <span class="d-txt">{{item.content}}</span>
              </div>
              <!-- @click.stop="hrefJump(item)" -->
              <div class="href-info" v-if="selIdxNews == 1 && item.href">
                <img src="../../assets/images/news/icon-href.png" alt="">
                <span>超链接</span>
              </div>
              <div class="nitem-open" v-if="selIdxNews == 1">
                <span @click.stop="openFlag(item, index)">{{item.openFlag ? '收起':'展开'}}</span>
              </div>
              <div class="nitem-open" v-if="selIdxNews == 2">
                <span>查看详情</span>
              </div>
              <!-- 3答疑消息 -->
              <div class="nitem-detail" v-if="selIdxNews == 3">
                <img v-if="selIdxNews == 3" src="../../assets/images/news/icon-da.png" alt="">
                <span class="d-txt">{{item.reply_quiz}}</span>
              </div>
              <!-- 4订单消息 -->
              <div class="nitem-detail" v-if="selIdxNews == 4">
                <p class="order-detail">订单编号：<span>{{item.order_num}}</span></p>
                <p class="order-detail">订单金额：<span>{{item.pay_price}}元</span></p>
                <p class="order-detail">课程名称：<span>{{item.package_name}}</span></p>
              </div>
            </li>
          </ul>
          <div style="margin-top: 50px; padding: 20px; text-align: center;">
            <Page
            :total="total"
            @on-change="onChange"
            :current="page"
            :page-size="limit"
            size="small"
            />
          </div>
        </div>
        <div class="no-data" v-if="noDataFlag">暂无消息</div>
      </div>
    </div>
  </div>
</template>

<script>
import { systeMessage, read, listMessage, menuList } from '@/api/message'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      txtArr: [
      ],
      selIdxNews: 1,
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
      }
      // newsFlag: false
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id,
      token: state => state.user.token,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
    if (this.isLoadHttpRequest) {
      this.getMenuList()
      this.getSysteMessage()
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getMenuList()
        this.getSysteMessage()
      })
    }
  },
  methods: {
    ...mapActions([
      'getIndexMessage'
    ]),
    tabClk (v, index) {
      this.selIdxNews = v.types
      this.page = 1
      this.getMenuList()
      this.getSysteMessage()
    },
    openFlag (item, index) {
      this.systeMessageList[index].openFlag = !item.openFlag
      this.$forceUpdate()
    },
    // tab列表已读状态
    getMenuList () {
      this.systeMessage = []
      this.showLoading(true)
      menuList({
        user_id: this.user_id
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        this.txtArr = [
          {
            value: '系统消息',
            types: 1,
            status: res.data.notice
          },
          {
            value: '活动消息',
            types: 2,
            status: res.data.activity
          },
          {
            value: '答疑消息',
            types: 3,
            status: res.data.answer
          },
          {
            value: '订单消息',
            types: 4,
            status: res.data.order
          }
        ]
      })
    },
    // 消息列表
    getSysteMessage () {
      this.systeMessageList = []
      this.showLoading(true)
      systeMessage({
        user_id: this.user_id,
        limit: this.limit,
        page: this.page,
        types: this.selIdxNews // 1系统2活动3答疑4订单
      }).then(data => {
        this.showLoading(false)
        this.noDataFlag = false
        const res = data.data
        let { list, total } = res.data
        if (list.length) {
          this.systeMessageList = list
          this.systeMessageList.map((val, index) => {
            val.openFlag = false
          })
        }
        if (this.systeMessageList.length === 0) {
          this.noDataFlag = true
        }
        this.total = total
      })
    },
    // 已读
    hrefJump (item) {
      // 此方法只会执行1和2
      // 1系统，无链接默认为已读，有链接需要点击为已读
      // 2活动，无链接默认为已读；有链接需要点击为已读
      // 3答疑，需点击为已读
      // 4订单，需点击为已读
      if (!item.href) {
        return
      }
      window.open(item.href, '_blank')
      if (item.status === 2) {
        return
      }
      read({
        user_id: this.user_id,
        message_id: item.message_id,
        type: item.type || 4 // 1课程回复2题库回复3图书回复4链接消息
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.systeMessageList.forEach(v => {
            if (item.message_id === v.message_id) {
              v.status = 2
            }
          })
          this.getMenuList() // 更新tab未读消息状态
          this.getIndexMessage() // 更新小铃铛消息状态
        }
      })
    },
    getRead (item) {
      // 1系统，无链接默认为已读，有链接需要点击为已读
      // 2活动，无链接默认为已读；有链接需要点击为已读
      // 3答疑，需点击为已读
      // 4订单，需点击为已读
      if (this.selIdxNews === 1 || this.selIdxNews === 2) {
        if (!item.href) {
          return
        }
      }
      this.diffNews(item) // 1234种消息
      if (item.status === 2) {
        return
      }
      this.showLoading(true)
      read({
        user_id: this.user_id,
        message_id: item.message_id,
        type: item.type || 4 // 1课程回复2题库回复3图书回复4链接消息
      }).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.systeMessageList.forEach(v => {
            if (item.message_id === v.message_id) {
              v.status = 2
            }
          })
          this.getMenuList() // 更新tab未读消息状态
          this.getIndexMessage() // 更新小铃铛消息状态
        }
      })
    },
    diffNews (item) {
      // 消息类型1课程回复2题库回复3订单支付成功4图书答疑5消息链接"
      if (item.type === 1) { // 课程回复
        this.$router.push({ path: '/personal', query: { type: 'answer', selIdx: 0, num: item.content_id } })
        return
      }
      if (item.type === 2) { // 题库回复
        this.$router.push({ path: '/personal', query: { type: 'answer', selIdx: 1, num: item.content_id } })
        return
      }
      if (item.type === 3) { // 订单
        this.$router.push({ path: '/personal', query: { type: 'order' } })
        return
      }
      if (item.type === 4) { // 图书
        this.$router.push({ path: '/personal', query: { type: 'answer', selIdx: 2, num: item.content_id } })
        return
      }
      if (item.type === 5) { // 推送
        window.open(item.href, '_blank')
        return
      }
      window.open(item.href, '_blank')
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
  .user-wrap{
    padding-top: 50px;
    .news-tit{
      font-size: 28px;
      line-height: 48px;
      font-weight: bold;
    }
  }
  /* tab */
  .tab-list-news {
      display: flex;
      align-items: center;
      text-align: center;
      padding-top: 30px;
      padding-bottom: 22px;
      font-size: 18px;
      border-bottom: 2px solid #DDDDDD;
      .tab-item {
        margin: 0 40px;
        position: relative;
        cursor: pointer;
        &:before {
            position: absolute;
            content: "";
            left: 50%;
            width: 26px;
            height: 3px;
            background: none;
            margin-top: 26px;
            margin-left: -13px;
        }
        &.active {
            color: #066AE4;
            &:before {
                background: #4797F8;
            }
        }
        b{
          position: absolute;
          right: -5px;
          top: -5px;
          width: 8px;
          height: 8px;
          background: #FF5235;
          border-radius: 50%;
        }
    }
  }
  // 消息
  .u-news-wrap{
    padding: 50px 50px 20px;
    background: #FFFFFF;
    border: 1px solid #EEEEEE;
    border-radius: 10px;
  }
  .news-item {
    font-size: 16px;
    padding: 30px 0 30px 22px;
    border-bottom: 1px solid #DDDDDD;
    cursor: pointer;
    &.news-item-pb{
      padding-bottom: 10px;
    }
    &.invalid *{
      color: #C7C7C7!important;
    }
  }
  .nitem-detail{
    width: 75%;
    font-size: 16px;
    color: #666666;
    line-height: 24px;
    margin-top: 10px;
    padding-left: 18px;
    &.sl{
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 2;
    }
    img{
      width: 20px;
      height: 18px;
      vertical-align: middle;
      margin-top: -3px;
      margin-right: 10px;
    }
    .order-detail{
      span{
        color: #163076;
      }
    }
  }
  .nitem-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .nitem-title-lf{
      color: #000000;
      font-size: 16px;
      b{
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 10px;
        &.no-read{
          background: #F68902;
        }
      }
      img{
        width: 20px;
        height: 18px;
        vertical-align: middle;
        margin-top: -3px;
        margin-right: 10px;
      }
    }
    .nitem-title-rt{
      color: #999999;
      font-size: 14px;
    }
  }
  .href-info{
    color: #1C3DA5;
    margin-top: 8px;
    padding-left: 18px;
    img{
      width: 16px;
      height: 6px;
      vertical-align: middle;
      margin-top: -3px;
      margin-right: 4px;
    }
  }
  .nitem-open{
    margin-top: 4px;
    text-align: right;
    color: #1C3DA5;
    font-size: 14px;
  }
</style>
