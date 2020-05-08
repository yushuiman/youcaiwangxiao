<template>
  <!-- 一、解析页面 纯展示-->
  <div class="topic-main" v-if="getQuestion.jiexi == 1">
    <!-- :class="{'topic-list-pb': item.flag}" -->
    <div class="topic-list" :id="'anchor-' + index" v-for="(item, index) in topics" :key="index">
      <div class="topic-top">
        <span class="topic-num"><em>{{index+1}}</em>/{{topics.length}}</span>
        <ul class="topic-error-sc" v-if="getQuestion.plate_id != 8">
          <li @click="modalShow(item, 'dy')"><i class="dy"></i><p>答疑</p></li>
          <li @click="modalShow(item, 'jc')"><i class="error"></i><p>纠错</p></li>
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
        <!-- 论述题样式 -->
        <div v-if="item.topicType == 2">
          <textarea v-model.trim="item.discuss_useranswer" disabled class="texta-discuss"></textarea>
        </div>
        <!-- 做题ABCD样式 else -->
        <ul class="topic-opition" v-if="item.topicType == 1">
          <li class="tpc-opi" v-for="(v, key) in item.options" :key="key">
            <div class="opi-abcd">
              <span :class="{'red-bg': v.errorRed, 'green-bg': v.rightGreen}">{{v.option}}</span>
            </div>
            <p>{{v.topic}}</p>
            <span class="eprone" v-if="v.eprone">{{item.eprone}}</span>
          </li>
        </ul>
      </div>
      <div class="resolving">
        <span class="resolve-tit" @click="resolveToggle(item.flag, index)">{{num}}{{item.flag ? '收起' : '解析'}}<Icon type="ios-arrow-down" :class="{'shouqi': item.flag}"/></span>
        <div class="resolve-detail" v-show="item.flag">
          <!-- 非论述题，展示正确答案，用户答案 -->
          <p class="right-resolve" v-if="item.topicType == 1 && getQuestion.sc != 1">
            <span>正确答案<em class="right">{{item.options[0].right}}</em></span>
            <span v-if="item.options[0].userOption">我的答案<em>{{item.options[0].userOption}}</em></span>
            <span v-else>我的答案<em>未作答</em></span>
          </p>
          <!-- 非论述题，收藏不展示用户答案 -->
          <p class="right-resolve" v-if="item.topicType == 1 && getQuestion.sc == 1">
            <span>正确答案<em class="right">{{item.options[0].right}}</em></span>
          </p>
          <div class="instr-resolve instr-resolve-tw">
            <span>解析：</span>
            <div class="twtw">
              <p v-if="item.analysis">{{item.analysis}}</p>
              <img v-if="item.analysisPic" :src="item.analysisPic" alt="">
              <p v-if="item.analysis_one">{{item.analysis_one}}</p>
              <img v-if="item.analysis_img_one" :src="item.analysis_img_one" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 二、真题/练习模式 做题-->
  <div class="topic-main" v-else>
    <div class="topic-list" :class="{'topic-list-pb': item.flag}" :id="'anchor-' + index" v-for="(item, index) in topics" :key="index">
      <div class="topic-top">
        <span class="topic-num"><em>{{index+1}}</em>/{{total}}</span>
        <ul class="topic-error-sc" v-if="getQuestion.plate_id != 8">
          <li @click="modalShow(item, 'jc')"><i class="error"></i><p>纠错</p></li>
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
        <!-- 练习模式：有解析、答对、答错状态-->
        <ul class="topic-opition" v-if="getQuestion.paper_mode == 1 && item.topicType == 1">
          <li class="tpc-opi" v-for="(v, key) in item.options" :key="key" @click="doPoticPractice(item, v, index, key)">
            <div class="opi-abcd">
              <span :class="{'blue-bg': v.selOption, 'red-bg': v.errorRed, 'green-bg': v.rightGreen}">{{v.option}}</span>
            </div>
            <p>{{v.topic}}</p>
          </li>
        </ul>
        <!-- 真题模式：正常，无解析、答对、答错状态-->
        <ul class="topic-opition" v-if="getQuestion.paper_mode != 1 && item.topicType == 1">
          <li class="tpc-opi" v-for="(v, key) in item.options" :key="key" @click="doPotic(item, v, index, key)">
            <div class="opi-abcd">
              <span :class="{'blue-bg': v.selOption}">{{v.option}}</span>
            </div>
            <p>{{v.topic}}</p>
          </li>
        </ul>
        <!-- 论述题：没有ABCD样式 -->
        <div v-if="item.topicType == 2">
          <textarea v-model.trim="item.discuss_useranswer" class="texta-discuss" placeholder="请填写您的答案" v-on:focus="doPoticDiscuss(item, index)" @blur="doPoticDiscuss(item, index)"></textarea>
        </div>
      </div>
      <!-- 练习模式答错才显示解析 12.11号改为答对答错都展示解析-->
      <div class="resolving" v-if="getQuestion.paper_mode == 1 && item.showAnalysis">
        <span class="resolve-tit" @click="resolveToggle(item.flag, index)">{{item.flag ? '收起' : '解析'}}<Icon type="ios-arrow-down" :class="{'shouqi': item.flag}"/></span>
        <div class="resolve-detail" v-show="item.flag">
          <p class="right-resolve">
            <span>正确答案<em class="right">{{item.options[0].right}}</em></span>
            <span v-if="item.userOption">我的答案<em>{{item.userOption}}</em></span>
          </p>
          <p class="instr-resolve"><span>解析：</span>{{item.analysis}}</p>
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
  props: ['topics', 'getQuestion', 'total', 'ID'],
  // props: {
  //   topics: {
  //     type: Array
  //   },
  //   getQuestion: {
  //     type: Object
  //   },
  //   total: {
  //     type: Number
  //   },
  //   ID: {
  //     type: String
  //   }
  // },
  data () {
    return {
      num: 0
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
    // 做题练习模式
    doPoticPractice (item, val, index, key) {
      if (item.currenOption) { // 练习模式：当前题选择以后不能再选
        return
      }
      item.currenOption = true // 练习模式：当前题选择以后不能再选
      item.userOption = val.option // 交卷用户答案
      item.options.forEach((v, index) => {
        v.selOption = false // 蓝色状态取消
        v.errorRed = false // 初始化答错状态
        if (v.option === v.right) {
          v.rightGreen = true // 遍历哪个是正确答案 对应添加rightGreen
        }
      })
      if (val.option === val.right) { // 判断当前点击的选项是否正确
        // val.selOption = false // 蓝色状态取消
        val.rightGreen = true // 答对当前选项绿色
        item.currenRightGreen = true // 答对：右边选项卡对应添加绿色已掌握状态
        item.showAnalysis = true // 答对，解析也展示
        this.$forceUpdate()
      } else {
        // val.selOption = false // 蓝色状态取消
        val.errorRed = true // 答错当前选项红色
        item.currenErrorRed = true // 答错：右边选项卡对应添加红色未掌握状态
        item.showAnalysis = true // 答错，解析展示
        this.$forceUpdate()
      }
      let num = this.topics.filter((v) => { // 已做题数
        return v.currenOption
      })
      this.$forceUpdate()
      this.$emit('doPoticInfo', num.length, index + 1)
    },
    // 做题考试模式
    doPotic (item, val, index, key) {
      item.options.forEach((v, index) => {
        v.selOption = false // 初始化false
      })
      val.selOption = true // 点击当前选项true蓝色，else false
      item.currenOption = true // 点击当前题 右边选项卡对应添加已做蓝色状态
      item.userOption = val.option // 交卷用户答案
      let num = this.topics.filter((v) => { // 已做题数
        return v.currenOption
      })
      this.$forceUpdate()
      this.$emit('doPoticInfo', num.length, index + 1)
    },
    // 论述题
    doPoticDiscuss (item) {
      item.currenOption = true // 点击当前题 右边选项卡对应添加已做蓝色状态
      // if (item.discuss_useranswer.length > 0) {
      //   item.currenOption = true // 点击当前题 右边选项卡对应添加已做蓝色状态
      // } else {
      //   item.currenOption = false
      // }
      let num = this.topics.filter((v) => { // 已做题数
        return v.currenOption
      })
      this.$forceUpdate()
      this.$emit('doPoticInfo', num.length, 0) // 论述题不要scroll
    },
    // 解析展开收起
    resolveToggle (currentFlag, index) {
      this.topics[index].flag = !currentFlag
      this.num += 1
      console.log(1)
      // this.$forceUpdate()
    },
    // 收藏
    qtCollection (item) {
      let { ID, collection } = item
      if (collection == 1) {
        item.collection = 0
      } else {
        item.collection = 1
      }
      questionCollection({
        user_id: this.user_id,
        course_id: this.getQuestion.course_id || window.sessionStorage.getItem('course_id'),
        question_id: ID,
        type: item.collection
      }).then(data => {
        if (data.data.code === 200) {
          this.$Message.success('收藏成功~')
        } else {
          this.$Message.error(data.data.msg)
        }
      })
    },
    // 答疑显示
    modalShow ({ ID }, type) {
      this.$emit('modalShow', true, ID, type)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .topic-main{
    -moz-user-select: none;
    -o-user-select:none;
    -khtml-user-select:none;
    -webkit-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
  .topic-list{
    box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
    border-radius: 8px;
    background: $colfff;
    margin-bottom: 20px;
    padding: 0 30px;
    &.topic-list-pb{
      padding-bottom: 20px;
    }
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
      cursor: pointer;
      p{
        color: $col999;
        font-size: 12px;
        margin-top: 2px;
      }
      .dy{
        @include bg-img(20, 20, '../../assets/images/questions/answer-icon.png');
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
      font-size: 18px;
      color: $col333;
      line-height: 25px;
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
      font-size: 18px;
      color: $col666;
      .opi-abcd{
        span{
          width: 26px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          display: inline-block;
          border-radius: 50%;
          border: 1px solid $col666;
          margin-right: 26px;
          box-sizing: border-box;
          cursor: pointer;
          &.blue-bg{
            border: 1px solid $blueColor;
            color: $blueColor;
          }
          &.red-bg{
            border: 1px solid #ED7171;
            color: #ED7171;
          }
          &.green-bg{
            border: 1px solid #0AAB55;
            color: #0AAB55;
          }
        }
      }
      p{
        line-height: 22px;
      }
      .eprone{
        color: $col999;
        font-size: 16px;
        margin-left: 50px;
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
      cursor: pointer;
      i{
        &.shouqi{
          transform: rotate(-180deg)
        }
      }
    }
  }
  .resolve-detail{
    background: #F3F8FF;
    padding: 20px 24px;
    &.opa{
      opacity: 0.3;
    }
    p{
      font-size: 16px;
      line-height: 22px;
      &.right-resolve{
        span{
          margin-right: 28px;
          color: $col333;
          &:first-child{
            font-weight: 500;
          }
          em{
            margin-left: 16px;
            &.right{
              color: #0AAB55;
            }
          }
        }
      }
    }
  }
  .instr-resolve-tw{
    font-size: 16px;
    line-height: 26px;
    display: flex;
    .twtw{
      flex: 1;
    }
    img{
      width: 100%;
    }
  }
  .texta-discuss{
    width: 100%;
    height: 133px;
    padding: 9px 14px;
    border-radius: 8px;
    margin: 22px 0;
    border: 1px solid #C7C7C7;
    outline: none;
    resize: none;
    box-sizing: border-box;
  }
</style>
