<template>
  <div class="class-wrap">
    <div class="class-choose">
      <!-- 已选条件 -->
      <div class="cl-aleary-tj">
        <div class="w-wrap class-com">
          <span class="cl-txt">已选条件</span>
          <div class="cla-list">
            <span><em>中文全科</em><i class="del-cion"></i></span>
            <span><em>中文全23科</em><i class="del-cion"></i></span>
            <span><em>中文全we科</em><i class="del-cion"></i></span>
          </div>
        </div>
      </div>
      <!-- 科目 -->
      <div class="class-subject class-tj-bg">
        <div class="w-wrap class-com">
          <span class="cl-txt">科目:</span>
          <div class="cl-list">
            <span class="curren">中文全科</span>
            <span>英文全科</span>
            <span>中文全科part-1</span>
            <span class="curren">中文全科</span>
            <span>英文全科</span>
            <span>中文全科part-1</span>
            <span class="curren">中文全科</span>
            <span>英文全科</span>
            <span>中文全科part-1</span>
            <span class="curren">中文全科</span>
            <span>英文全科</span>
            <span>中文全科part-1</span>
            <span class="curren">中文全科</span>
            <span>英文全科</span>
            <span>中文全科part-1</span>
            <span class="curren">中文全科</span>
            <span>英文全科</span>
            <span>中文全科part-1</span>
          </div>
        </div>
      </div>
      <!-- 类型 -->
      <div class="class-type class-tj-bg">
        <div class="w-wrap class-com">
          <span class="cl-txt">类型:</span>
          <div class="cl-list">
            <span>收费</span>
            <span>免费</span>
            <span>中文全科part-1</span>
          </div>
        </div>
      </div>
      <!-- 班型 -->
      <div class="class-bx class-tj-bg">
        <div class="w-wrap class-com">
          <span class="cl-txt">班型:</span>
          <div class="cl-list">
            <span>远程课程</span>
            <span>面授课程</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 综合 -->
    <div class="class-zh class-tj-bg">
      <div class="w-wrap class-com">
        <div class="cl-list cl-list-zh">
          <span class="curren">综合</span>
          <span>人气<i class="hot-icon"></i></span>
          <span>价格<i class="price-icon"></i></span>
          <input type="text" name="" placeholder="3232">
          <span class="lianjie-icon">-</span>
          <input type="text" name="" placeholder="¥">
          <button type="button" name="button" class="sure-btn">确认</button>
          <button type="button" name="button" class="clear-btn">清空</button>
        </div>
      </div>
    </div>
    <!-- 课程内容 -->
    <div class="course-main w-wrap">
      <!-- 课程列表 左 -->
      <div class="course-main-left">
        <div v-if="arrangement === 1">
          <course-two v-for="(val, index) in courseList" :key="index" :items="val"></course-two>
        </div>
        <div class="course-main-horizontal" v-if="arrangement == 2">
          <course-one v-for="(val, index) in courseList" :key="index" :items="val"></course-one>
        </div>
      </div>
      <!-- 猜你喜欢 右 -->
      <div class="course-main-right">
        <div class="like-title">
          <img src="@/assets/images/course/like.png" alt="">
          <span>猜你喜欢</span>
        </div>
        <div class="like-list" v-for="(item,index) in likeArr" :key="index">
          <img :src="item.pc_img" alt="">
          <div class="like-info">
              <p>{{item.name}}</p>
              <p>讲师: {{item.teacher_name}}</p>
              <p>￥ {{item.price}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import courseOne from '@/components/courseOne.vue'
import courseTwo from '@/components/courseTwo.vue'
// import WebSocket from '@/libs/web-socket'
import duoxuan from '@/assets/images/course/duoxuan.png'
import duoxuan2 from '@/assets/images/course/duoxuan2.png'
import duoxuan2x from '@/assets/images/course/duoxuan2x.png'
import duoxuan1 from '@/assets/images/course/duoxuan(1).png'
// // 加密 解密
import { Encrypt, Decrypt } from '@/libs/crypto'

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
      duoxuan1,
      duoxuan,
      duoxuan2x,
      duoxuan2,
      total: 0,
      className: '中文part1',
      arrangement: 1,
      agmet_img: 1,
      agmet_img2: 1,
      form: {
        class_id: '',
        billing_status: '全部',
        multiple: '',
        popularity: '',
        pricesort: '',
        limit: 20,
        page: 1
      },
      type: [
        {
          type_name: '全部',
          type_id: 3
        },
        {
          type_name: '收费',
          type_id: 1
        },
        {
          type_name: '免费',
          type_id: 2
        }
      ],
      subject_color: '',
      courseList: [
        {
          id: '2',
          name: '课程包名称课程包名称',
          teacher_name: '王强',
          pc_img: duoxuan,
          billing_status: 1,
          price: '10800'
        },
        {
          id: '2',
          name: '课程包名称课程包名称',
          teacher_name: '王强',
          pc_img: duoxuan,
          billing_status: 1,
          price: '10800'
        }
      ],
      subject_type: [
        {
          'class_name': 'sfsfsdnsjdk'
        },
        {
          'class_name': '3sefsfsfsfsdnsjdk'
        }
      ],
      likeArr: [
        {
          'pc_img': require('@/assets/images/course/duoxuan.png'),
          'name': '速度速度速度速度发生的多sfsfsdnsjdk',
          'teacher_name': 'wang',
          'price': '1888000'
        },
        {
          'pc_img': require('@/assets/images/course/duoxuan.png'),
          'name': 'sfsfsdnsjdk',
          'teacher_name': 'wang',
          'price': '1888000'
        }
      ]
    }
  },
  components: {
    courseOne,
    courseTwo
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
        return '全部'
      }
    }
  },
  watch: {
    form: {
      handler (newVal, oldVal) {
        // list 接口
        this.$axios.post('/web/images/course/images/courseList', this.form)
        // .then((res) => {
        //     if (res.data.code === 200) {
        // this.courseList = res.data.data.data
        // console.log(this.courseList);
        //     }
        // })
      },
      deep: true
    }
  },
  mounted () {
    // this.Ws = initWS(this)
  },
  methods: {
    sendText () {
      this.Ws.send(222)
      console.log(this.Ws.send)
      console.log(Encrypt('123'))
      console.log(Decrypt(Encrypt('亲猪猪')))
    },
    onChangePage (val) {

    },
    getSubject (wor) {
      this.$axios.post('/web/images/course/images/courseList', this.form).then((res) => {
        if (res.data.code === 200) {
          this.courseList = res.data.data.data
          console.log(this.courseList)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .class-tj-bg{
    background: $colfff;
    &.class-zh{
      margin-top: 20px;
    }
  }
  .class-com{
    padding: 6px 0;
    line-height: 40px;
    @include display_flex(flex);
    @extend %alignitem_center;
    border-bottom: 1px solid $borderColor;
    box-sizing: border-box;
    .class-bx &, .class-zh &, .cl-aleary-tj &{
      border: 0;
    }
    .cl-aleary-tj &{
      padding: 10px 0;
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
        background: $blueColor;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
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
      &.hot-icon{
        @include wh(12, 18);
        background: #0f0;
      }
      &.price-icon{
        @include wh(18, 26);
        background: #f00;
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
    @include display_flex(flex);
    @extend %justify-content;
    padding: 19px 0;
  }
  .course-main-left {
    @include c3(flex, 1);
    @include display_flex(flex);
  }
  .course_main_con {
    height: 192px;
    width: 211px;
    background-color: #fff;
    margin-right: 19px;
    margin-bottom: 30px;
  }
  .course_main_con img {
    width: 211px;
    height: 112px;
  }
  .course_main_con .course_main_con_img {
    width: 211px;
    height: 112px;
  }
  .course_main_info {
    margin: 0px 13px;

  }
  .course_main_info p:nth-of-type(1) {
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .course_main_info p:nth-of-type(2) {
    font-size: 14px;
    color: #666666;
    margin-top: 6px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .course_main_info p .fire {
    width:50px;
    height:20px;
    font-size: 12px;
    background:rgba(255,232,210,1);
    border-radius:4px;
    color: #FF9B3A;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .course_main_info p:nth-of-type(3) {
    font-size: 12px;
    color: #999999;
  }
  .course_main_info p:nth-of-type(3) span {
    color: #FF9B3A;
  }

  .course-main-right {
    width: 298px;
    padding: 0 9px;
    background: $colfff;
    border-radius: 4px;
    box-sizing: border-box;
    .like-title{
      @include lh(39, 39);
      color: $col666;
      margin-bottom: 4px;
      img{
        @include wh(20, 20);
        margin-right: 7px;
        vertical-align: middle;
        margin-top: -3px;
      }
    }
  }
  .like-list {
    height: 86px;
    padding: 11px 0;
    @include display_flex(flex);
    @extend %alignitem_center;
    border-top: 1px solid $borderColor;
    box-sizing: border-box;
    img{
      width: 100%;
      height: 60px;
      margin-right: 6px;
    }
  }
  .like-list img {
    width:110px;
    height:60px;
    border-radius:4px;
  }
  .like-info {
    width: 148px;
    margin-left: 7px;
    p{
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:nth-child(2){
        color: $col999;
        font-size: 12px;
      }
      &:nth-child(3){
        color: #FF9B3A;
        font-size: 16px;
      }
    }
  }
</style>
