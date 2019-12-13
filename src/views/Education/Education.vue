<template>
  <div class="edu-wrap">
    <swiper :options="swiperOptionRec" v-if="eduBannerList.length>0">
      <swiper-slide v-for="(item, index) in eduBannerList" :key="index">
        <img :src="item.pic" alt="">
      </swiper-slide>
    </swiper>
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
      <div class="edu-right">
        <learn-tips></learn-tips>
        <news></news>
      </div>
    </div>
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import learnTips from '@/components/education/learnTips.vue'
import news from '@/components/education/news.vue'
import { deuShuffling, previewCourse, firstPackage } from '@/api/education'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      eduBannerList: [],
      swiperOptionRec: {
        loop: true,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false
        }
      },
      previewCourseList: [], // 课程预告
      getDeuType: [], // 分类
      firstPackageList: [] // 课程包
    }
  },
  components: {
    swiper,
    swiperSlide,
    news,
    learnTips
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id,
      isLoadHttpRequest: state => state.user.isLoadHttpRequest
    })
  },
  mounted () {
    this.deuShufflingList() // banner
    this.getPreviewCourseList() // 课程预告
    this.getFirstPackageList() // 课程包
  },
  methods: {
    // banenr
    deuShufflingList () {
      deuShuffling().then((data) => {
        const res = data.data
        if (res.code === 200) {
          this.eduBannerList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 课程预告
    getPreviewCourseList () {
      previewCourse().then((data) => {
        const res = data.data
        if (res.code === 200) {
          this.previewCourseList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    previewCourseJump (href) {
      window.open(href, '_blank')
    },
    // 课程包
    getFirstPackageList () {
      firstPackage().then((data) => {
        const res = data.data
        if (res.code === 200) {
          this.firstPackageList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 课程包列表
    packageDetail (val, item) {
      this.$router.push({ path: '/education-detail',
        query: {
          type_id: val.type_id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .edu-wrap{
    width: 1198px;
    margin: 0 auto;
  }
  .edu-content{
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    .edu-left{
      flex: 1;
    }
    .edu-right{
      width: 298px;
      margin-left: 20px;
    }
  }
  .edu-couse-list{
    display: flex;
  }
  .edu-title{
    padding: 0 9px;
    line-height: 40px;
    color: $blueColor;
    border-radius: 4px;
    background: #ffffff;
    margin-bottom: 20px;
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
