<template>
  <div class="education-wrap">
    <img :src="eduBannerList[0].image_href" alt="" width="100%" v-if="eduBannerList.length == 1">
    <swiper :options="swiperOptionRec" v-if="eduBannerList.length>1">
      <swiper-slide v-for="(item, index) in eduBannerList" :key="index">
        <img :src="item.image_href" alt="" width="100%">
      </swiper-slide>
    </swiper>
    <div class="edu-content w-wrap">
      <div class="edu-left">
        <div class="edu-type-cont">
          <h1 class="edu-title"><p>课程预告</p></h1>
          <ul class="edu-couse-list">
            <li class="edu-couse-item" v-for="(items, index) in previewCourseList" :key="index" @click="previewCourseClk(items)">
              <img :src="items.pc_img" alt="" class="edu-couse-item-img">
              <div class="edu-course-str">
                <p class="ci-title">时间：{{items.start_time}}</p>
                <p class="ci-teacher-day"><span class="noml">CPE积分：{{items.cpe}}分</span></p>
              </div>
            </li>
          </ul>
        </div>
        <div class="edu-type-cont" v-for="(val, index) in firstPackageList" :key="index">
          <h1 class="edu-title"><p>{{val.type_name}}</p><span @click="goPackageList(val)">更多</span></h1>
          <ul class="edu-couse-list">
            <li class="edu-couse-item" v-for="(items, key) in val.package" :key="key" @click="goPackageDetail(val, items)">
              <img :src="items.pc_img" alt="" class="edu-couse-item-img">
              <div class="edu-course-str">
                <p class="ci-title">{{items.name}}</p>
                <p class="ci-teacher-day">讲师：{{items.teacher_name}}</p>
                <div class="ci-cpe">
                  <span class="cpe-fen">CPE积分：{{items.cpe_integral}}分</span>
                  <span class="ci-pay-free">{{ items.billing_status == 1 ? '¥' + items.price : items.billing_status == 2 ? '免费课' : items.billing_status == 3 ? '积分兑换' : '等级进入' }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="edu-right">
        <div class="cpe-tab">
          <span class="cpe-report" @click="aboutCpe(1)">CPE学分报告</span>
          <span class="cpe-record" @click="aboutCpe(2)">学习记录</span>
        </div>
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
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    this.deuShufflingBanner() // banner
    this.getPreviewCourseList() // 课程预告
    this.getFirstPackageList() // 课程包
  },
  methods: {
    // banner
    deuShufflingBanner () {
      this.showLoading(true)
      deuShuffling().then((data) => {
        this.showLoading(false)
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
      this.showLoading(true)
      previewCourse().then((data) => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.previewCourseList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 报名
    previewCourseClk ({ id }) {
      this.visible = true
      this.$router.push({ path: '/education-course-sign',
        query: {
          preview_id: id
        }
      })
    },
    // 课程包
    getFirstPackageList () {
      this.showLoading(true)
      firstPackage().then((data) => {
        this.showLoading(false)
        const res = data.data
        if (res.code === 200) {
          this.firstPackageList = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 更多 - 课程包列表
    goPackageList (val) {
      this.$router.push({ path: '/education-course-list',
        query: {
          type_id: val.type_id
        }
      })
    },
    // 课程包详情
    goPackageDetail (val, item) {
      this.$router.push({ path: '/education-course-detail',
        query: {
          type_id: val.type_id,
          package_id: item.package_id
        }
      })
    },
    aboutCpe (type) {
      if (!this.token) {
        this.$router.push({ path: '/login',
          query: {
            package_id: this.package_id,
            call_back: 'education'
          }
        })
        return
      }
      if (type === 1) {
        this.$router.push({ path: '/education-report' })
      }
      if (type === 2) {
        this.$router.push({ path: '/personal',
          query: {
            type: 'education',
            selIdx: 1
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .education-wrap{
    .w-wrap{
      width: 1198px;
      margin: 0 auto;
    }
  }
  .edu-content{
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    .edu-left{
      width: 880px;
    }
    .edu-right{
      width: 298px;
    }
  }
  .edu-couse-list{
    display: flex;
  }
  .edu-title{
    padding: 0 9px;
    line-height: 40px;
    border-radius: 4px;
    color: $col666;
    background: #ffffff;
    margin-bottom: 20px;
    display: flex;
    p{
      flex: 1;
      color: $blueColor;
    }
    span{
      cursor: pointer;
    }
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
    .ci-cpe{
      display: flex;
      justify-content: space-between;
      @include lh(23, 23);
      .cpe-fen{
        color: $blueColor;
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
  .cpe-tab{
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    span{
      color: #FFFFFF;
      font-weight: bold;
      padding-left: 14px;
      line-height: 32px;
      box-sizing: border-box;
      cursor: pointer;
      @include bg_img(143, 32, '../../assets/images/education/report.png');
      &:last-child{
        padding-left: 23px;
        @include bg_img(143, 32, '../../assets/images/education/record.png');
      }
    }
  }
</style>
