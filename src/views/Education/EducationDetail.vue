<template>
  <div class="edu-detail-wrap">
    <div class="class-choose">
      <!-- 已选条件 -->
      <div class="cl-aleary-tj">
        <!-- <div class="w-wrap class-com al-class-com" v-if="classNamea != '' || form.billing_status != '' || form.ym != ''"> -->
        <div class="w-wrap class-com al-class-com" v-if="classNamea != '' || form.billing_status != ''">
          <span class="cl-txt">已选条件</span>
          <div class="cl-list cla-list">
            <span v-if="classNamea != ''"><em>{{classNamea}}</em><i class="del-cion" @click="delChoose('课程类别')"></i></span>
            <span v-if="form.billing_status != ''"><em>{{form.billing_status == 1 ? '免费': '收费'}}</em><i class="del-cion" @click="delChoose('类型')"></i></span>
          </div>
        </div>
        <div class="w-wrap class-com" v-else></div>
      </div>
      <!-- 课程类别 -->
      <div class="class-subject class-tj-bg">
        <div class="w-wrap class-com">
          <span class="cl-txt">课程类别:</span>
          <div class="cl-list">
            <span :class="form.class_id == item.id ? 'curren' : ''" @click="screenCourse(form.class_id = item.id)" v-for="(item, index) in deuTypeList" :key="index">
              {{item.type_name}}
            </span>
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
          <input type="number" name="" placeholder="¥" v-model.number="priceStart">
          <span class="lianjie-icon">-</span>
          <input type="number" name="" placeholder="¥" v-model.number="priceEnd">
          <button type="button" name="button" class="sure-btn" @click="screenCourse('确认价格')">确认</button>
          <button type="button" name="button" class="clear-btn" @click="screenCourse('清空价格')">清空</button>
        </div>
      </div>
    </div>
    <div class="edu-content">
      <div class="edu-left">
        <div class="edu-type-cont">
          <h1 class="edu-title">课程预告</h1>
          <ul class="edu-couse-list">
            <li class="edu-couse-item" v-for="(items, index) in previewCourseList" :key="index" @click="previewCourseJump(items.jump)">
              <img :src="items.pc_img" alt="" class="edu-couse-item-img">
              <div class="edu-course-str">
                <p class="ci-title">时间：{{items.start_time}}</p>
                <p class="ci-teacher-day"><span class="noml">CPE积分：{{items.cpe}}分</span></p>
              </div>
            </li>
          </ul>
        </div>
        <div class="edu-typle-cont" v-for="(val, index) in firstPackageList" :key="index">
          <h1 class="edu-title">{{val.type_name}}</h1>
          <ul class="edu-couse-list">
            <li class="edu-couse-item" v-for="(items, key) in val.package" :key="key" @click="packageDetail(val, items)">
              <img :src="items.pc_img" alt="" class="edu-couse-item-img">
              <div class="edu-course-str">
                <p class="ci-title">{{items.name}}</p>
                <p class="ci-teacher-day">讲师：{{items.teacher_name}}<span>CPE积分：{{items.study_days}}分</span></p>
                <span class="ci-pay-free">{{ items.billing_status == 1 ? '免费课' : items.billing_status == 2 ? '¥' + items.price : items.billing_status == 3 ? '积分兑换' : '等级进入' }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { listPackage, deuType } from '@/api/education'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      total: 1,
      form: {
        class_id: '',
        billing_status: '',
        type_id: this.$route.query.type_id, // 课程类型id
        multiple: '', // 综合1升序2降序
        popularity: '', // 人气1升序2降序
        pricesort: '', // 价格1升序2降序
        price_start: '', // 起始价格
        price_end: '', // 结束价格
        limit: 6, // 每页显示数量
        page: 1
      }, // 课程列表 默认第一页 显示6个
      priceStart: '', // 价格筛选
      priceEnd: '', // 价格筛选
      deuTypeList: [] // 类别
    }
  },
  components: {
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
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
    this.getListPackage() // 课程包列表
  },
  methods: {
    // 条件筛选
    screenCourse (type, val) {
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
        this.priceStart = ''
        this.priceEnd = ''
      }
      if (type === '确认价格' || type === '清空价格') {
        this.form.price_start = this.priceStart
        this.form.price_end = this.priceEnd
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
    // 跳转到课程详情页
    goClassDetails (id) {
      this.$router.push({ path: '/course-detail', query: { package_id: id } })
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
          this.courseList = res.data.data
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
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .class-tj-bg{
    background: $colfff;
    &.class-zh, &.class-subject-mt{
      margin-top: 20px;
    }
  }
  .class-com{
    padding: 6px 0;
    line-height: 39px;
    @include display_flex(flex);
    border-bottom: 1px solid $borderColor;
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

</style>
