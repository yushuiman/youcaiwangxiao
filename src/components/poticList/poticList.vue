<template>
  <div class="topic-main">
    <div class="topic-list" :id="'anchor-' + index" v-for="(item, index) in topics" :key="index">
      <div class="topic-top">
        <span class="topic-num"><em>{{item.questionNumber}}</em>/{{total}}</span>
        <ul class="topic-error-sc">
          <li><i class="error"></i><p>纠错</p></li>
          <li @click="qtCollection(item)"><i class="collect" :class="{'active': item.collection == 1}"></i><p>收藏</p></li>
        </ul>
      </div>
      <div class="topic-item">
        <div class="topic-title">
          <p v-if="item.topic[0]">{{item.topic[0]}}</p>
          <img v-if="item.topic[1]" :src="item.topic[1]" alt="">
          <p v-if="item.topic[2]">{{item.topic[2]}}</p>
          <img v-if="item.topic[3]" :src="item.topic[3]" alt="">
          <p v-if="item.topic[4]">{{item.topic[4]}}</p>
        </div>
        <ul class="topic-opition">
          <li class="tpc-opi" v-for="(v, key) in item.options" :key="key" @click="doPotic(item, v, index, key)">
            <div class="opi-abcd">
              <!-- 'green-bg': currenSelOption!=v.right &&getQuestion.paper_mode == 1 }" -->
              <span :class="{'blue-bg': v.currenSelOption}">{{v.option}}</span>
            </div>
            <p>{{v.topic}}</p>
          </li>
        </ul>
      </div>
      <div class="resolving" v-if="getQuestion.paper_mode == 1">
        <span class="resolve-tit" @click="resolveToggle(item.flag, index)">{{item.flag ? '收起' : '解析'}}<Icon type="ios-arrow-down" :class="{'shouqi': item.flag}"/></span>
        <div class="resolve-detail" v-show="item.flag">
          <p class="right-resolve">
            <span>正确答案<em class="right">A</em></span>
            <span v-if="item.discuss_useranswer">你的答案<em>{{item.discuss_useranswer}}</em></span>
          </p>
          <p class="instr-resolve"><span>解析：</span>的返回港口地方高考的发给客服电话个会发光</p>
          <img v-if="item.analysisPic" :src="item.analysisPic" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { questionCollection } from '@/api/questions'
import { mapState } from 'vuex'
export default {
  props: {
    topics: {
      type: Array
    },
    getQuestion: {
      type: Object
    },
    total: {
      type: String
    },
    ID: {
      type: String
    }
  },
  data () {
    return {
      type: 0, // 收藏
      percentNum: 0, // 已做题数
      selId: false,
      topicArr: [],
      currenSelOption: ''
    }
  },
  computed: {
    ...mapState({
      user_id: state => state.user.user_id
    })
  },
  mounted () {
  },
  methods: {
    // 解析展开收起
    resolveToggle (currentFlag, index) {
      this.topics[index].flag = !currentFlag
      this.$forceUpdate()
    },
    // 做题
    doPotic (item, val, index, key) {
      item.selId = true // 解析用到
      this.topics[index].currenOption = true
      this.topics[index].options[key].currenSelOption = true
      console.log(this.topics[index].options[key])
      // if (this.topics[index].currenOption) {
      //   this.topics[index].options.map((v, index) => {
      //     v.flag = true
      //   })
      // }
      for (var i = 0; i < this.topicArr.length; i++) {
        if (item.ID === this.topicArr[i].questionId) {
          this.topicArr[i].answerOption = val.option
          this.$forceUpdate()
          return
        }
      }
      this.topicArr.push({
        questionId: item.ID,
        answerOption: val.option
      })
      this.$emit('doPoticInfo', this.topicArr.length)
      // this.goAnchor('#anchor-' + index)
    },
    goAnchor (selector) {
      var anchor = this.$el.querySelector(selector)
      document.documentElement.scrollTop = anchor.offsetTop
    },
    // 收藏
    qtCollection ({ ID }) {
      if (this.type === 0) {
        this.type = 1
        this.topics.map((val, index) => {
          val.collection = 1
        })
      } else {
        this.type = 0
        this.topics.map((val, index) => {
          val.collection = 0
        })
      }
      questionCollection({
        user_id: this.getQuestion.user_id,
        course_id: this.getQuestion.course_id,
        question_id: ID,
        type: this.type
      }).then(data => {
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .topic-list{
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
    background: $colfff;
    margin-bottom: 20px;
    padding: 0 30px;
  }
  .topic-top{
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .topic-num{
    em {
      font-size: 24px;
    }
  }
  .topic-error-sc{
    text-align: center;
    li{
      display: inline-block;
      margin-left: 30px;
      p{
        color: $col999;
        font-size: 12px;
        margin-top: 2px;
      }
      .error{
        @include bg-img(20, 20, '../../assets/images/questions/error-icon.png');
      }
      .collect{
        @include bg-img(20, 20, '../../assets/images/questions/collection.png');
        &.active{
          @include bg-img(20, 20, '../../assets/images/questions/collection-active.png');
        }
      }
    }
  }
  .topic-title{
    p{
      line-height: 22px;
    }
    img{
      max-width: 100%;
    }
  }
  .topic-opition{
    padding: 10px 0;
    .tpc-opi{
      padding: 8px 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .opi-abcd{
        span{
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          display: inline-block;
          border-radius: 50%;
          border: 1px solid $col666;
          margin-right: 26px;
          box-sizing: border-box;
          &.red-bg{
            border: 1px solid #ED7171;
            color: #ED7171;
          }
          &.green-bg{
            border: 1px solid #0AAB55;
            color: #0AAB55;
            background: #0AAB55;
          }
          &.blue-bg{
            border: 1px solid #0267FF;
            color: #0267FF;
          }
        }
      }
      p{
        line-height: 22px;
      }
    }
  }
  .resolving{
    .resolve-tit{
      width: 82px;
      height: 33px;
      line-height: 33px;
      text-align: center;
      display: inline-block;
      color: $blueColor;
      background: #F3F8FF;
      i{
        &.shouqi{
          transform: rotate(-180deg)
        }
      }
    }
  }
  .resolve-detail{
    background: #F3F8FF;
    padding: 16px 24px;
    p{
      font-size: 16px;
      line-height: 26px;
      &.right-resolve{
        span{
          margin-right: 28px;
          em{
            margin-left: 16px;
            font-weight: bold;
            &.right{
              color: #0AAB55;
            }
          }
        }
      }
    }
  }
</style>
