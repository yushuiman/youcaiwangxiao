<template>
  <div class="learntips-wrap">
    <img :src="announcementBaner[0].image_href" alt="" width="100%" v-if="announcementBaner.length==1">
    <swiper :options="swiperOptionRec" v-if="announcementBaner.length>1">
      <swiper-slide v-for="(item, index) in announcementBaner" :key="index">
        <img :src="item.image_href" alt="" width="100%">
      </swiper-slide>
    </swiper>
    <div class="learntips-info w-wrap">
      <div class="learntips-menu l-fl">
        <ul class="learntips-ul">
          <li class="learntips-item" :class="['learntips-item-' + v.class_name, {'curren': type_id == v.type_id}]" v-for="(v, index) in listTips" :key="index" @click="switchInfo(v, index)">
            <i class="learntips-icon"></i>{{v.type_name}}
          </li>
        </ul>
      </div>
      <div class="learntips-cont l-fr">
        <h2>{{listTipsInfo.title}}</h2>
        <div class="l-detail" v-html="listTipsInfo.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { tipsType, tipsList, announcement } from '@/api/education'
export default {
  data () {
    return {
      announcementBaner: [],
      listTips: [],
      swiperOptionRec: {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        }
      },
      type_id: this.$route.query.type_id,
      parent_id: this.$route.query.parent_id,
      listTipsInfo: {}
    }
  },
  computed: {

  },
  mounted () {
    this.announcementBanner() // banner
    this.getTipsType() // 类别
    this.getTipsList() // 详情
  },
  methods: {
    announcementBanner () {
      announcement().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.announcementBaner = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    getTipsType () {
      tipsType().then(data => {
        const res = data.data
        if (res.code === 200) {
          this.listTips = res.data
          this.listTips.forEach((v, index) => {
            if (v.type_name === '学习要求') {
              v.class_name = '01'
            }
            if (v.type_name === '学习流程') {
              v.class_name = '02'
            }
            if (v.type_name === '上传CPE积分') {
              v.class_name = '03'
            }
            if (v.type_name === '常见问题') {
              v.class_name = '04'
            }
          })
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 选择menu
    switchInfo (v) {
      this.type_id = v.type_id
      this.parent_id = v.parent_id
      this.getTipsList()
    },
    // 详情
    getTipsList () {
      tipsList({
        type_id: this.type_id,
        parent_id: this.parent_id
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.listTipsInfo = res.data
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .learntips-wrap{
    .right-com{
      padding: 0 10px;
      background: #ffffff;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .com-title{
      padding-left: 27px;
      height: 39px;
      line-height: 39px;
      border-bottom: 1px solid #E6E6E6;
      background: url('../../assets/images/course/like.png') no-repeat left center;
      background-size: 20px 20px;
    }
    .com-list{
      padding: 10px 0;
      .com-item{
        height: 26px;
        line-height: 26px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        color: $col666;
        .c-black{
          width: 65%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .c-gray{
          font-size: 12px;
          color: $col999;
        }
      }
    }
  }
  .learntips-info{
    @include flexJustify;
    padding: 30px 0;
    .learntips-menu{
      width: 127px;
    }
    .learntips-cont{
      width: 971px;
    }
  }
  .learntips-item{
    padding-left: 10px;
    margin-bottom: 18px;
    height: 36px;
    line-height: 36px;
    color: $col666;
    cursor: pointer;
    box-sizing: border-box;
    &.curren, &:hover{
      color: $colfff;
      background: $blueColor;
      border-radius: 8px 0px 0px 8px;
      position: relative;
      &:before{
        position: absolute;
        content: "";
        right: -30px;
        top: 0px;
        width: 0;
        height: 0;
        border: 18px solid transparent;
        border-right-width: 15px;
        border-left-color: $blueColor;
        border-left-width: 15px;
      }
    }
  }
  .learntips-cont{
    h2{
      padding-left: 20px;
      padding-bottom: 13px;
      font-size: 20px;
    }
    .l-detail{
      padding: 20px;
      background:rgba(255,255,255,1);
      box-shadow: 0px 2px 20px 0px rgba(140,196,255,0.3);
      border-radius: 8px;
      color: #4A4A4A;
      font-size: 16px;
      line-height: 24px;
    }
    img{
      width: 100%;
    }
  }
  .learntips-icon{
    width: 20px;
    height: 18px;
    margin-right: 10px;
    margin-top: -5px;
    vertical-align: middle;
    @extend %bg-img;
    .learntips-item-01 &{
      background-image: url('../../assets/images/user/user-icon01.png');
    }
    .learntips-item-01.curren &, .learntips-item-01:hover &{
      background-image: url('../../assets/images/user/user-active-icon01.png');
    }
    .learntips-item-02 &{
      background-image: url('../../assets/images/user/user-icon02.png');
    }
    .learntips-item-02.curren &, .learntips-item-02:hover &{
      background-image: url('../../assets/images/user/user-active-icon02.png');
    }
    .learntips-item-03 &{
      background-image: url('../../assets/images/user/user-icon03.png');
    }
    .learntips-item-03.curren &, .learntips-item-03:hover &{
      background-image: url('../../assets/images/user/user-active-icon03.png');
    }
    .learntips-item-04 &{
      background-image: url('../../assets/images/user/user-icon04.png');
    }
    .learntips-item-04.curren &, .learntips-item-04:hover &{
      background-image: url('../../assets/images/user/user-active-icon04.png');
    }
  }
</style>
