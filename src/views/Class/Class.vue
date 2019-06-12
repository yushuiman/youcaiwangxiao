<template>
  <div class="class-wrap">
    <div class="class-choose">
      <!-- 已选条件 -->
      <div class="cl-aleary-tj">
        <div class="w-wrap class-com">
          <span class="cl-txt">已选条件</span>
          <div class="cl-list cla-list">
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
            <span>中文全科</span>
            <span>英文全科</span>
            <span>中文全科part-1</span>
            <span>中文全科</span>
            <span>英文全科</span>
            <span>中文全科part-1</span>
            <span>中文全科</span>
            <span>英文全科</span>
            <span>中文全科part-1</span>
            <span>中文全科</span>
            <span>英文全科</span>
            <span>中文全科part-1</span>
            <span>中文全科</span>
            <span>英文全科</span>
            <span>中文全科part-1</span>
            <span>中文全科</span>
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
    <div class="course-main w-wrap clearfix">
      <!-- 课程列表 左 -->
      <div class="course-main-left fl">
        <div class="course-main-con fl" v-for="(items, index) in tableData" :key="index" @click="goClassDetails(items.id)">
          <img :src="items.pc_img" alt="" class="course-main-con-img">
          <div class="course-main-info">
            <p class="ci-title">{{items.email}}</p>
            <p class="ci-teacher-day"><span>讲师：{{items.email}}</span>有效期：730天</p>
            <span class="ci-pay-free">免费课</span>
            <!-- <span class="ci-pay-free">{{ items.billing_status == 1 ? '免费课' : items.billing_status == 2 ? items.price : item.billing_status == 3 ? '积分兑换' : '等级进入' }}</span> -->
          </div>
        </div>
        <!-- <div v-if="arrangement === 1">
           <course-two v-for="(val, index) in courseList" :key="index" :items="val"></course-two>
         </div>
         <div clasies="course-main-horizontal" v-if="arrangement === 2">
           <course-one v-for="(val, index) in courseList" :key="index" :items="val"></course-one>
         </div>-->
      </div>

      <!-- 猜你喜欢 右 -->
      <div class="course-main-right fr">
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
    <el-row :span="24">
      <div class="pagination">
        <el-pagination
          background
          v-if='paginations.total > 0'
          :page-size="paginations.pageSize"
          :layout="paginations.layout"
          :total="paginations.total"
          :current-page.sync='paginations.page_index'
          @current-change='handleCurrentChange'>
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>
<script>
// import courseOne from '@/components/courseOne.vue'
// import courseTwo from '@/components/courseTwo.vue'
// import WebSocket from '@/libs/web-socket'
import duoxuan from '@/assets/images/course/duoxuan.png'
import duoxuan2 from '@/assets/images/course/duoxuan2.png'
import duoxuan2x from '@/assets/images/course/duoxuan2x.png'
import duoxuan1 from '@/assets/images/course/duoxuan(1).png'
// // 加密 解密
import { Decrypt, Encrypt } from '@/libs/crypto'

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
      // 每页存放的数据
      tableData: [],
      // 所有的数据
      allTableData: [],
      // 需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        pageSize: 10, // 1页显示多少条
        layout: 'prev, pager, next' // 翻页属性
      },
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
    // courseOne,
    // courseTwo
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
  created () {
    this.getInfoList()
  },
  methods: {
    // 跳转到课程详情页
    goClassDetails () {
      this.$router.push('/classDetail')
    },
    handleCurrentChange (page) {
      // 当前页
      let sortnum = this.paginations.pageSize * (page - 1)
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum
      })
      // 设置默认分页数据
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.pageSize
      })
    },
    handleSizeChange (pageSize) {
      // 切换size
      this.paginations.page_index = 1
      this.paginations.pageSize = pageSize
      this.tableData = this.allTableData.filter((item, index) => {
        return index < pageSize
      })
    },
    setPaginations () {
      // 总页数
      this.paginations.total = this.allTableData.length
      this.paginations.page_index = 1
      // 设置每页显示8条
      this.paginations.pageSize = 6
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.pageSize
      })
    },
    // 获取数据
    getInfoList () {
      this.$axios.get('https://www.easy-mock.com/mock/5bee2bf96b3691268016a10f/getInfoList').then(res => {
        if (res.data.status === 1) {
          const data = res.data.data
          console.log(data)
          // this.tableData = data;
          this.allTableData = data
          // this.gethowpages();
          this.setPaginations()
        }
      })
    },

    /* //计算一共多少页
      gethowpages() {
        let pagesTotal = 0;
        let len = this.allTableData.length;
        let pagenum = len % 6;//得到余数
        if (pagenum !== 0) {
          pagesTotal = Math.floor((len / 6)) + 1;
          console.log(pagesTotal + "总数")
        } else {
          pagesTotal = len / 6;
          console.log(pagesTotal)
        }

      }, */
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
  .pagination {
    text-align: center;
    margin: 50px 0 50px 0;
    height: 50px;
  }
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
      &.hot-icon{
        @include wh(9, 20);
        @extend %bg-img;
        background-image: url('../../assets/images/course/hot-top-icon.png');
      }
      &.price-icon{
        @include wh(10, 16);
        @extend %bg-img;
        background-image: url('../../assets/images/course/price-moren-icon.png');
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
    .course-main-con-img{
      width: 100%;
      height: 157px;
      display: block;
      border-radius: 10px 10px 0px 0px;
    }
    .course-main-info{
      padding: 13px 13px 15px;
      border-radius: 0px 0px 10px 10px;
      background: $colfff;
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
    // @extend %alignitem_center;
    border-top: 1px solid $borderColor;
    box-sizing: border-box;
    img{
      width: 100%;
      height: 60px;
      margin-right: 6px;
    }
  }
  .like-list img {
    width: 110px;
    height: 60px;
    border-radius:4px;
  }
  .like-info {
    width: 148px;
    margin-left: 7px;
    p{
      @extend %singleline-ellipsis;
      &:nth-child(2){
        color: $col999;
        font-size: 12px;
        margin-top: 8px;
        margin-bottom: 7px;
      }
      &:nth-child(3){
        color: #FF9B3A;
        font-size: 16px;
      }
    }
  }
</style>
