<template>
  <div>学分报告</div>
</template>
<script>
import { listPackage, deuType } from '@/api/education'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      total: 1,
      form: {
        // class_id: '',
        // billing_status: '',
        type_id: this.$route.query.type_id, // 课程类型id
        multiple: 1, // 综合1升序2降序
        popularity: 2, // 人气1升序2降序
        pricesort: 2, // 价格1升序2降序
        price_start: '', // 起始价格
        price_end: '', // 结束价格
        limit: 8, // 每页显示数量
        page: 1
      }, // 课程列表 默认第一页 显示6个
      deuTypeList: [], // 类别
      listPackageArr: [] // 课程包列表
    }
  },
  components: {
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    }),
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
  mounted () {
    this.getDeuType() // 类别
    this.getListPackage() // 课程包列表
  },
  methods: {
    // 条件筛选
    screenCourse (type, val) {
      if (type === '课程类别') {
        this.form.type_id = val.type_id
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
      if (type === '清空价格') {
        this.form.price_start = ''
        this.form.price_end = ''
      }
      this.getListPackage()
    },
    // 条件删除
    delChoose (type) {
      switch (type) {
        case '课程类别':
          this.form.class_id = ''
          break
        case '类型':
          this.form.billing_status = ''
          break
      }
      this.getListPackage()
    },
    // 分页
    onChange (val) {
      this.form.page = val
      this.getListPackage()
      window.scrollTo(0, 0)
    },
    // 课程包列表
    getListPackage () {
      listPackage(this.form).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.listPackageArr = res.data.data
          this.total = res.data.total
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 类别
    getDeuType () {
      deuType().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.deuTypeList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 课程包列表详情
    goPackageDetail (val, item) {
      this.$router.push({ path: '/education-course-detail',
        query: {
          type_id: this.form.type_id,
          course_id: val.package_id
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
    &.class-zh, &.class-subject{
      margin-top: 20px;
    }
  }
  .class-com{
    padding: 6px 0;
    line-height: 39px;
    @include display_flex(flex);
    box-sizing: border-box;
    .class-bx &, .class-zh &, .cl-aleary-tj &{
      border: 0;
    }
    .cl-aleary-tj &{
      padding: 10px 0;
      @extend %alignitem_center;
      span{
        &:hover{
          color: $col333;
        }
      }
    }
    .class-zh &{
      line-height: 50px;
      padding: 0;
    }
  }
  .cl-txt{
    color: $col666;
    margin-right: 24px;
    font-weight: bold;
    .cl-aleary-tj &{
      color: $col333;
    }
  }
  .cla-list{
    span{
      @include lh(28, 28);
      background: $colfff;
      float: left;
      border: 1px solid #0CA1FF;
      border-radius: 4px;
      margin-right: 21px;
      box-sizing: border-box;
      display: inline-block;
      margin: 5px 0;
      em, i{
        float: left;
        display: inline-block;
        height: 100%;
        font-weight: normal;
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
      &.curren, &:hover{
        color: $blueColor;
        cursor: pointer;
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
  .edu-content{
    padding-top: 20px;
  }
  .edu-couse-list{
    display: flex;
    // justify-content: center;
  }
  .edu-couse-item{
    width: 280px;
    margin-right: 17px;
    margin-bottom: 20px;
    padding: 7px;
    border-radius: 6px;
    &:hover{
      background: $colfff;
      cursor: pointer;
    }
    .edu-couse-item-img{
      width: 100%;
      height: 147px;
      border-radius: 6px;
      display: block;
    }
  }
  .edu-course-str{
    padding: 12px 8px 8px;
    .ci-title{
      font-size: 16px;
      @extend %singleline-ellipsis;
    }
    .ci-teacher-day{
      padding: 8px 0;
      color: $col999;
      span{
        margin-left: 20px;
        color: $blueColor;
        &.noml{
          margin-left: 0;
        }
      }
    }
    .ci-pay-free{
      padding: 0 6px;
      @include lh(23, 23);
      text-align: center;
      display: inline-block;
      background: #FFF1E4;
      color: #FF8915;
      border-radius: 4px;
    }
  }
</style>
