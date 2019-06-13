<template>
  <div class="class-wrap">
    <div class="class-choose">
      <!-- 已选条件 -->
      <div class="cl-aleary-tj">
        <div class="w-wrap class-com" v-if="alearyChoose.length">
          <span class="cl-txt">已选条件</span>
          <div class="cl-list cla-list">
            <span><em>中文全23科</em><i class="del-cion"></i></span>
            <span><em>{{classNamea}}</em><i class="del-cion"></i></span>
          </div>
        </div>
        <div class="w-wrap class-com" v-else></div>
      </div>
      <!-- 科目 -->
      <div class="class-subject class-tj-bg">
        <div class="w-wrap class-com">
          <span class="cl-txt">科目:</span>
          <div class="cl-list">
            <span :class="form.class_id == item.id ? 'curren' : ''" @click="screenCourse(form.class_id = item.id)" v-for="(item,index) in subject_type" :key="index">{{item.class_name}}</span>
          </div>
        </div>
      </div>
      <!-- 类型 -->
      <div class="class-type class-tj-bg">
        <div class="w-wrap class-com">
          <span class="cl-txt">类型:</span>
          <div class="cl-list">
            <span :class="{'curren': form.billing_status == 1}" @click="screenCourse(form.billing_status = 1)">免费</span>
            <span :class="{'curren': form.billing_status == 2}" @click="screenCourse(form.billing_status = 2)">收费</span>
          </div>
        </div>
      </div>
      <!-- 班型 -->
      <div class="class-bx class-tj-bg">
        <div class="w-wrap class-com">
          <span class="cl-txt">班型:</span>
          <div class="cl-list">
            <span :class="{'curren': form.ym == 1}" @click="screenCourse('班型', form.ym = 1)">远程课程</span>
            <span :class="{'curren': form.ym == 2}" @click="screenCourse('班型', form.ym = 2)">面授课程</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 综合 -->
    <div class="class-zh class-tj-bg">
      <div class="w-wrap class-com">
        <div class="cl-list cl-list-zh">
          <span class="curren">综合</span>
          <span @click="screenCourse('人气')">人气<i :class="[form.popularity == 1 ? 'hot-top-icon' : 'hot-down-icon']"></i></span>
          <span @click="screenCourse('价格')">价格<i class="price-icon" :class="{'price-top-icon': form.pricesort==1, 'price-down-icon': form.pricesort==2}"></i></span>
          <input type="text" name="" placeholder="3232">
          <span class="lianjie-icon">-</span>
          <input type="text" name="" placeholder="¥">
          <button type="button" name="button" class="sure-btn">确认</button>
          <button type="button" name="button" class="clear-btn">清空</button>
        </div>
      </div>
    </div>
    <!-- 课程内容 -->
    <div class="course-main w-wrap clearfix">
      <!-- 课程列表 左 -->
      <div class="course-main-left fl">
        <div class="course-main-con fl" v-for="(items, index) in courseList" :key="index" @click="goClassDetails(items.id)">
          <img :src="items.pc_img" alt="" class="course-main-con-img">
          <div class="course-main-info">
            <p class="ci-title">{{items.email}}</p>
            <p class="ci-teacher-day"><span>讲师：{{items.email}}</span>有效期：730天</p>
            <span class="ci-pay-free">{{ items.billing_status == 1 ? '免费课' : items.billing_status == 2 ? items.price : item.billing_status == 3 ? '积分兑换' : '等级进入' }}</span>
          </div>
        </div>
      </div>

      <!-- 猜你喜欢 右 -->
      <div class="fr">
        <like-list :likeArr="likeArr"></like-list>
      </div>
    </div>
    <div style="padding: 20px; text-align: center;">
      <Page
      :total="total"
      @on-change="onChange"
      @on-page-size-change="onPageSizeChange"
      :current="form.page"
      :page-size="form.limit"
      size="small"
      />
    </div>
  </div>
</template>
<script>
// import courseOne from '@/components/courseOne.vue'
// import courseTwo from '@/components/courseTwo.vue'
// import WebSocket from '@/libs/web-socket'
import likeList from '@/components/likeList.vue'
// // 加密 解密
import { Decrypt, Encrypt } from '@/libs/crypto'
import { courseList, guessLike, subjects } from '@/api/class'
// const initWS = () => {
//   return new WebSocket(ws => {
//     ws.onmessage(data => {
//       console.log('%c%s', 'color:green;', data)
//     })
//   })
// }

export default {
  data () {
    return {
      likeArr: [], // 猜你喜欢
      courseList: [], // 课程列表
      total: 1,
      form: {
        class_id: '',
        billing_status: '',
        multiple: '',
        popularity: '',
        pricesort: '',
        limit: 6,
        page: 1,
        ym: ''
      },
      alearyChoose: ['2323', 332], // 已选条件
      subjectsArr: [], // 科目
      selId: '',
      typeInfo: [
        {
          freePay: '收费',
          courseWay: '远程课程'
        },
        {
          freePay: '免费',
          courseWay: '面授课程'
        }
      ],

      className: '中文part1',
      arrangement: 1,
      agmet_img: 1,
      agmet_img2: 1,

      subject_color: '',
      subject_type: [
        {
          'class_name': 'sfsfsdnsjdk'
        },
        {
          'class_name': '3sefsfsfsfsdnsjdk'
        }
      ]

    }
  },
  components: {
    likeList
  },
  computed: {
    classNamea () {
      if (this.form.class_id) {
        let cla = ''
        this.subject_type.forEach(val => {
          if (val.id === this.form.class_id) {
            cla = val.class_name
          }
        })
        return cla
      } else {
        return ''
      }
    }
  },
  // watch: {
  //   form: {
  //     handler (newVal, oldVal) {
  //       this.getCourseList(this.form)
  //     },
  //     deep: true
  //   }
  // },
  mounted () {
    this.getCourseList(this.form) // 课程列表 默认第一页，6条数据
    this.getGuessLike() // 猜你喜欢
    this.getSubjects() // 科目
    // this.Ws = initWS(this)
  },
  methods: {
    // 条件筛选
    screenCourse (type, val) {
      if (type === '班型') {
        return
      }
      if (type === '人气') {
        if (this.form.popularity === 1) {
          this.form.popularity = ''
        } else {
          this.form.popularity = 1
        }
      }
      if (type === '价格') {
        if (this.form.pricesort === 1) {
          this.form.pricesort = 2
        } else {
          this.form.pricesort = 1
        }
      }
      this.getCourseList(this.form)
    },
    // 跳转到课程详情页
    goClassDetails (id) {
      this.$router.push(`/classDetail?courseId=${'id'}`)
    },
    // 分页
    onChange (val) {
      this.form.page = val
      this.getCourseList(this.form)
    },
    onPageSizeChange (val) {
      this.form.limit = val
      this.getCourseList(this.form)
    },
    // 获取数据
    getCourseList () {
      courseList(this.form).then(data => {
        const res = data.data.data
        this.courseList = res.data
        this.total = res.total
      })
    },
    // 猜你喜欢
    getGuessLike () {
      guessLike().then(data => {
        const res = data.data
        this.likeArr = res.data
      })
    },
    // 科目
    getSubjects () {
      subjects().then(data => {
        const res = data.data
        this.subject_type = res.data
      })
    },
    sendText () {
      this.Ws.send(222)
      console.log(Encrypt('123'))
      console.log(Decrypt(Encrypt('亲猪猪')))
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  @import "../../assets/scss/iview.css";
  // @import '../../../node_modules/iview/dist/styles/iview.css';
  .class-tj-bg{
    background: $colfff;
    &.class-zh, &.class-subject-mt{
      margin-top: 20px;
    }
  }
  .class-com{
    padding: 6px 0;
    line-height: 40px;
    @include display_flex(flex);
    // @extend %alignitem_center;
    border-bottom: 1px solid $borderColor;
    box-sizing: border-box;
    .class-bx &, .class-zh &, .cl-aleary-tj &{
      border: 0;
    }
    .cl-aleary-tj &{
      padding: 10px 0;
      @extend %alignitem_center;
    }
    .class-zh &{
      line-height: 50px;
      padding: 0;
    }
  }
  .cl-txt{
    color: $col666;
    margin-right: 24px;
    .cl-aleary-tj &{
      color: $col333;
    }
  }
  .cla-list{
    span{
      @include lh(28, 28);
      background: $colfff;
      float: left;
      border: 1px solid $blueColor;
      border-radius: 4px;
      margin-right: 21px;
      box-sizing: border-box;
      display: inline-block;
      margin: 5px 0;
      em, i{
        float: left;
        display: inline-block;
        height: 100%;
        margin-right: 0;
      }
      em{
        padding: 0 18px;
        text-align: center;
      }
      i{
        float: right;
        width: 27px;
        background-color: $blueColor;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        @extend %bg-img;
        text-align: center;
        background-image: url('../../assets/images/course/del-icon.png');
        background-size: 60% 60%;
      }
    }
  }
  .cl-list{
    @include c3(flex, 1);
    @include display_flex(flex);
    @extend %alignitem_center;
    span{
      margin-right: 30px;
      box-sizing: border-box;
      &.curren{
        color: $blueColor;
      }
    }
  }
  .cl-list-zh{
    span, input{
      margin: 0 10px;
      display: inline-block;
      &:nth-child(1){
        margin-left: 0;
      }
      &.curren{
        color: $blueColor;
        border-bottom: 1px solid $blueColor
      }
      &.lianjie-icon{
        margin: 0;
        color: $borderColor;
      }
    }
    i{
      display: inline-block;
      vertical-align: middle;
      margin-top: -3px;
      margin-left: 5px;
      @extend %bg-img;
      &.hot-down-icon, &.hot-top-icon{
        @include wh(9, 20);
        background-image: url('../../assets/images/course/hot-down-icon.png');
      }
      &.hot-top-icon{
        background-image: url('../../assets/images/course/hot-top-icon.png');
      }
      &.price-icon{
        @include wh(10, 16);
        background-image: url('../../assets/images/course/price-moren-icon.png');
      }
      &.price-top-icon{
        @include wh(10, 16);
        background-image: url('../../assets/images/course/price-top-icon.png');
      }
      &.price-down-icon{
        @include wh(10, 16);
        background-image: url('../../assets/images/course/price-down-icon.png');
      }
    }
    input{
      @include wh(80, 28);
      border: 1px solid $borderColor;
      border-radius: 4px;
      box-sizing: border-box;
      text-indent: 11px;
    }
    button{
      @include whl(60, 28, 28);
      background: $blueColor;
      border-radius: 4px;
      color: $colfff;
      &.sure-btn{
        margin-left: 10px;
      }
      &.clear-btn{
        color: $col666;
        background: none;
      }
    }
  }
  .course-main {
    padding: 19px 0;
  }
  .course-main-left{
    width: 900px;
  }
  .course-main-con{
    width: 279px;
    margin-right: 20px;
    margin-bottom: 20px;
    border-radius: 0px 0px 10px 10px;
    &:hover{
      background: $colfff;
    }
    .course-main-con-img{
      width: 100%;
      height: 157px;
      display: block;
      border-radius: 10px 10px 0px 0px;
    }
    .course-main-info{
      padding: 13px 13px 15px;
      .ci-title{
        font-size: 16px;
        @extend %singleline-ellipsis;
      }
      .ci-teacher-day{
        padding: 10px 0;
        color: $col999;
        span{
          margin-right: 20px;
        }
      }
      .ci-pay-free{
        @include whl(56, 23, 23);
        text-align: center;
        display: inline-block;
        background: #FFF1E4;
        color: #FF8915;
        border-radius: 4px;
      }
    }
  }
</style>
