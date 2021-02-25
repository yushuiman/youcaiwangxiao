<template>
  <div class="class-wrap">
    <div class="class-choose">
      <!-- 已选条件 -->
      <div class="cl-aleary-tj">
        <!-- <div class="w-wrap class-com al-class-com" v-if="classNamea != '' || form.billing_status != '' || form.ym != ''"> -->
        <div class="w-wrap class-com al-class-com" v-if="classNamea != '' || form.billing_status != ''">
          <span class="cl-txt">已选条件</span>
          <div class="cl-list cla-list">
            <span v-if="classNamea != ''"><em>{{classNamea}}</em><i class="del-cion" @click="delChoose('科目')"></i></span>
            <span v-if="form.billing_status != ''"><em>{{form.billing_status == 1 ? '免费': '收费'}}</em><i class="del-cion" @click="delChoose('类型')"></i></span>
            <!-- <span v-if="form.ym != ''"><em>{{form.ym == 1 ? '远程课程': '面授课程'}}</em><i class="del-cion" @click="delChoose('班型')"></i></span> -->
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
      <!-- <div class="class-bx class-tj-bg">
        <div class="w-wrap class-com">
          <span class="cl-txt">班型:</span>
          <div class="cl-list">
            <span :class="{'curren': form.ym == 1}" @click="screenCourse('班型', form.ym = 1)">远程课程</span>
            <span :class="{'curren': form.ym == 2}" @click="screenCourse('班型', form.ym = 2)">面授课程</span>
          </div>
        </div>
      </div> -->
    </div>
    <!-- 综合 -->
    <div class="class-zh class-tj-bg">
      <div class="w-wrap class-com">
        <div class="cl-list cl-list-zh">
          <span @click="screenCourse('综合')" :class="{'curren': form.multiple == 2}">综合</span>
          <span @click="screenCourse('人气')">人气<i :class="[form.popularity == 1 ? 'hot-top-icon' : 'hot-down-icon']"></i></span>
          <span @click="screenCourse('价格')">价格<i class="price-icon" :class="{'price-top-icon': form.pricesort==1, 'price-down-icon': form.pricesort==2}"></i></span>
          <input type="number" name="" placeholder="¥" v-model.number="form.price_start">
          <span class="lianjie-icon">-</span>
          <input type="number" name="" placeholder="¥" v-model.number="form.price_end">
          <button type="button" name="button" class="sure-btn" @click="screenCourse('确认价格')">确认</button>
          <button type="button" name="button" class="clear-btn" @click="screenCourse('清空价格')">清空</button>
        </div>
      </div>
    </div>
    <!-- 课程内容 -->
    <div class="course-main w-wrap clearfix">
      <!-- 课程列表 左 -->
      <div class="course-main-left fl">
        <div class="clearfix">
          <div class="course-main-con fl" v-for="(items, index) in courseList" :key="index" @click="goClassDetails(items.id)">
            <img :src="items.pc_img" alt="" class="course-main-con-img">
            <div class="course-main-info">
              <p class="ci-title">{{items.name}}</p>
              <p class="ci-teacher-day"><span>讲师：{{items.teacher_name}}</span>有效期：{{items.study_days}}天</p>
              <span class="ci-pay-free">{{ items.billing_status == 1 ? '免费课' : items.billing_status == 2 ? '¥' + items.price : items.billing_status == 3 ? '积分兑换' : '等级进入' }}</span>
            </div>
          </div>
        </div>
        <div style="padding: 20px; text-align: center;">
          <Page
          :total="total"
          @on-change="onChange"
          :current="form.page"
          :page-size="form.limit"
          size="small"
          />
        </div>
      </div>
      <!-- 猜你喜欢 右 -->
      <div class="course-like-right fr">
        <like-list></like-list>
      </div>
    </div>
    <!-- 活动 -->
    <div v-if="status == 1">
      <Modal v-model="visible"
        :width="495"
        :closable="false"
        footer-hide
        class="index-active-modal">
        <img :src="image_url" alt="" @click="freeGet">
      </Modal>
    </div>
  </div>
</template>
<script>
import likeList from '@/components/class/likeList.vue'
import { courseList, subjects, thickness } from '@/api/class'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      likeArr: [], // 猜你喜欢
      courseList: [], // 课程列表
      total: 1,
      form: {
        class_id: '',
        billing_status: '', // 计费方式
        multiple: 2, // 综合1
        popularity: '', // 人气1
        pricesort: '', // 价格1升序2降序
        price_start: '', // 起始价格
        price_end: '', // 结束价格
        limit: 6,
        page: 1
      }, // 课程列表 默认第一页 显示6个
      // typeInfo: [
      //   {
      //     freePay: '收费',
      //     courseWay: '远程课程'
      //   },
      //   {
      //     freePay: '免费',
      //     courseWay: '面授课程'
      //   }
      // ],
      subject_type: [], // 筛选科目列表
      visible: true,
      status: 0, // 买正课以后不展示免费领取
      image_url: ''
    }
  },
  components: {
    likeList
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
    this.getCourseList() // 课程列表 默认第一页，6条数据
    this.getSubjects() // 科目
    if (!this.token) {
      this.getThickness() // 免费领取活动
      return
    }
    if (this.isLoadHttpRequest) {
      this.getThickness() // 免费领取活动
    } else {
      this.$watch('isLoadHttpRequest', function (val, oldVal) {
        this.getThickness() // 免费领取活动
      })
    }
  },
  methods: {
    // 条件筛选
    screenCourse (type, val) {
      if (type === '综合') {
        this.form.popularity = ''
        this.form.pricesort = ''
        this.form.multiple = 2
      }
      if (type === '人气') {
        this.form.multiple = ''
        if (this.form.popularity === 1) {
          this.form.popularity = 2
        } else {
          this.form.popularity = 1
        }
      }
      if (type === '价格') {
        this.form.multiple = ''
        if (this.form.pricesort == '') {
          this.form.pricesort = 1
        } else if (this.form.pricesort == 1) {
          this.form.pricesort = 2
        } else if (this.form.pricesort == 2) {
          this.form.pricesort = 1
        }
      }
      if (type === '班型') {
        return
      }
      if (type === '清空价格') {
        this.form.price_start = ''
        this.form.price_end = ''
      }
      this.form.page = 1
      this.getCourseList()
    },
    // 条件删除
    delChoose (type) {
      switch (type) {
        case '科目':
          this.form.class_id = ''
          break
        case '类型':
          this.form.billing_status = ''
          break
        case '班型':
          this.form.ym = ''
          break
      }
      this.form.page = 1
      this.getCourseList()
    },
    // 跳转到课程详情页
    goClassDetails (id) {
      this.$router.push({ path: '/course-detail', query: { package_id: id } })
    },
    // 分页
    onChange (val) {
      this.form.page = val
      this.getCourseList()
      window.scrollTo(0, 0)
    },
    // 获取数据
    getCourseList () {
      this.showLoading(true)
      courseList(this.form).then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.courseList = res.data.data
          this.total = res.data.total
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 科目
    getSubjects () {
      this.showLoading(true)
      subjects().then(data => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.subject_type = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 免费领取活动
    getThickness () {
      thickness({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.status = res.data.status
          this.image_url = res.data.image_url
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 免费领取
    freeGet () {
      if (!this.token) {
        this.$router.push({ path: '/login',
          query: {
            call_back: 'personal'
          }
        })
        return
      }
      this.$router.push('/personal')
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
    box-sizing: border-box;
    .class-subject &{
      border-bottom: 1px solid $borderColor;
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
      border: 1px solid transparent;
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
  .course-main {
    padding: 19px 0;
  }
  .course-main-left{
    width: 900px;
  }
  .course-like-right{
    width: 298px;
  }
  .course-main-con{
    width: 280px;
    margin-right: 17px;
    margin-bottom: 20px;
    padding: 7px;
    border-radius: 6px;
    &:hover{
      background: $colfff;
      cursor: pointer;
    }
    .course-main-con-img{
      width: 100%;
      height: 147px;
      border-radius: 6px;
      display: block;
    }
    .course-main-info{
      padding: 12px 8px 8px;
      .ci-title{
        font-size: 16px;
        @extend %singleline-ellipsis;
      }
      .ci-teacher-day{
        padding: 8px 0;
        color: $col999;
        span{
          margin-right: 20px;
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
  }
  .index-active-modal img{
    width: 100%;
  }
</style>
