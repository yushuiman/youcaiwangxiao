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
    <Modal
      title="课程预告报名"
      v-model="visible"
      footer-hide
      :width="495"
      class="iview-modal">
      <div class="preview-sign-modal">
        <input class="bm-name" type="text" maxlength="10" v-model="signName" placeholder="姓名">
        <input class="bm-phone" type="text" maxlength="11" v-model="signMobile" placeholder="电话">
        <button class="btn-com" @click="previewSign">确定</button>
      </div>
    </Modal>
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import learnTips from '@/components/education/learnTips.vue'
import news from '@/components/education/news.vue'
import { deuShuffling, previewCourse, firstPackage, activityUser } from '@/api/education'
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
      signMobile: '', // 课程预告报名手机号
      signName: '', // 课程预告报名名字
      previewCourseList: [], // 课程预告
      visible: false, // 课程预告报名
      previewId: '', // 课程预告id
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
    // 报名
    previewCourseClk ({ id }) {
      this.visible = true
      this.previewId = id
    },
    // 报名
    previewSign () {
      if (this.signName === '' || this.signMobile === '') {
        this.$Message.error('姓名，电话不能为空～')
        return
      }
      if (this.signName.length < 2 || this.signName.length > 10) {
        this.$Message.error('请输入2-10位字符～')
        return
      }
      const reg = /^[1]([3-9])[0-9]{9}$/
      if (!(reg.test(this.signMobile))) {
        this.$Message.error('该手机号不符合格式')
        return false
      }
      activityUser({
        preview_id: this.previewId,
        user_name: this.signName,
        mobile: this.signMobile
      }).then((data) => {
        const res = data.data
        if (res.code === 200) {
          if (res.data.status === 1) {
            this.$Message.success('报名成功~')
            this.visible = false
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
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
    border-radius: 4px;
    color: $col666;
    background: #ffffff;
    margin-bottom: 20px;
    display: flex;
    p{
      flex: 1;
      color: $blueColor;
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
  .preview-sign-modal{
    text-align: center;
    input{
      width: 80%;
      display: block;
      margin: 10px auto;
      height: 40px;
      padding-left: 14px;
      background: rgba(245, 245, 245, 1);
      border-radius: 4px;
      border: 1px solid rgba(220, 220, 220, 1);
    }
    button{
      width: 122px;
      height: 36px;
      background: #0267FF;
      color: #ffffff;
      // margin: 0 auto;
      margin: 20px auto;
    }
  }
</style>
