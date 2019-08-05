<template>
  <div class="u-news-wrap">
    <div class="news-tab-top">
      <ul class="tab-list">
        <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdxNews == index}" :key="index" @click="tabClk(v, index)">{{v}}</li>
      </ul>
      <span class="all-read" @click="getAllRead()">全部已读</span>
    </div>
    <div class="news-main">
      <div v-if="selIdxNews == 0">
        <!-- <span class="all-read" @click="getAllRead(1)">全部已读</span> -->
        <ul class="news-list" v-if="answerMessage && answerMessage.length">
          <li class="news-item" :class="{'invalid': item.status == 2}" v-for="(item, index) in answerMessage" :key="index" @click="getRead(1, item.message_id)">
            <span class="news-left" :class="{'bule': item.type == 2, 'orange': item.type == 3 }">{{types[item.type]}}</span>
            <div class="news-center">
              <h2>您的提问<span>{{item.content}}</span>有新的回答</h2>
              <p>{{item.create_time}}</p>
            </div>
          </li>
        </ul>
        <div class="no-data" v-else>暂无消息</div>
      </div>
      <div v-if="selIdxNews == 1">
        <!-- <span class="all-read" @click="getAllRead(2)">全部已读</span> -->
        <ul class="news-list" v-if="systeMessageList && systeMessageList.length">
          <li class="news-item" :class="{'invalid': item.status == 2}" v-for="(item, index) in systeMessageList" :key="index" @click="getRead(2, item.message_id)">
            <!-- <img src="" alt="" class="news-l"> -->
            <div class="news-center">
              <h3><span>{{item.title}}</span><em>{{item.create_time}}</em></h3>
              <p>{{item.content}}</p>
            </div>
          </li>
        </ul>
        <div class="no-data" v-else>暂无消息</div>
      </div>
    </div>
  </div>
</template>

<script>
import { allRead, systeMessage, read } from '@/api/personal'
import BScroll from 'better-scroll'
export default {
  props: {
    user_id: {
      type: Number
    }
  },
  data () {
    return {
      txtArr: ['答疑消息', '系统消息'],
      selIdxNews: window.sessionStorage.getItem('selIdxNews') || 0,
      limit: 10,
      page: 1,
      answerMessage: [], // 答疑消息
      systeMessageList: [], // 系统消息
      types: {
        1: '优财网校维护通知',
        2: '课程',
        3: '题库',
        4: '订单支付成功'
      },
      allReadAns: false, // 全部已读-答疑
      allReadSys: false, // 全部已读-系统
      currenRead: false, // 已读
      options: {
        pullDownRefresh: {
          threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        pullUpLoad: {
          threshold: -20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        },
        //          pullDownRefresh: false, //关闭下拉
        //          pullUpLoad: false, // 关闭上拉
        click: true,
        probeType: 3,
        startY: 0,
        scrollbar: true
      }
    }
  },
  mounted () {
    this.initRes()
  },
  methods: {
    tabClk (v, index) {
      if (!this.user_id) {

      }
      this.selIdxNews = index
      window.sessionStorage.setItem('selIdxNews', index)
      this.initRes()
    },
    initRes () {
      if (parseInt(this.selIdxNews) === 0) {
        this.getSysteMessage(1)
      }
      if (parseInt(this.selIdxNews) === 1) {
        this.getSysteMessage(2)
      }
    },
    getSysteMessage (type) {
      systeMessage({
        user_id: this.user_id,
        limit: this.limit,
        page: this.page,
        types: type // 1答疑消息2系统消息
      }).then(data => {
        const res = data.data
        if (type === 1) {
          this.answerMessage = res.data
        }
        if (type === 2) {
          this.systeMessageList = res.data
        }
      })
    },
    // 全部已读
    getAllRead () {
      let type = parseInt(window.sessionStorage.getItem('selIdxNews')) + 1
      allRead({
        user_id: this.user_id,
        types: type // 1答疑消息2系统消息
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          let { status } = res.data
          if (status === 1) {
            if (type === 1) {
              this.answerMessage.map((v, index) => {
                v.status = 2
              })
            }
            if (type === 2) {
              this.systeMessageList.map((v, index) => {
                v.status = 2
              })
            }
          }
        }
      })
    },
    // 已读
    getRead (type, id) {
      read({
        user_id: this.user_id,
        message_id: id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          let { status } = res.data
          if (status === 1) {
            if (type === 1) {
              this.answerMessage.map((v, index) => {
                if (id === v.message_id) {
                  v.status = 2
                }
              })
            }
            if (type === 2) {
              this.systeMessageList.map((v, index) => {
                if (id === v.message_id) {
                  v.status = 2
                }
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .news-tab-top{
    display: flex;
    justify-content: space-between;
    .all-read{
      color: $blueColor;
      font-size: 18px;
      cursor: pointer;
    }
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
    &.invalid *{
      color: #C7C7C7!important;
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
  // .news-right{
  //   color: $col999;
  // }
  // <ul class="news-list">
  //         <li class="news-item">
  //           <span class="news-left">课程</span>
  //           <div class="news-center">
  //             <h2>您的提问<span>的大概都快感动哭过的开放后</span>有新的回答</h2>
  //           </div>
  //         </li>
  //         <li class="news-item">
  //           <span class="news-left">课程</span>
  //           <div class="news-center">
  //             <h2>您的提问<span>的大概都快感动哭过的开放后</span>有新的回答</h2>
  //           </div>
  //         </li>
  //         <li class="news-item">
  //           <span class="news-left">课程</span>
  //           <div class="news-center">
  //             <h2>您的提问<span>的大概都快感动哭过的开放后</span>有新的回答</h2>
  //           </div>
  //         </li>
  //       </ul>
</style>
