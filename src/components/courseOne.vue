<template>
  <section>
    <div class="course_main_horizontal_con">
      <div class="course_main_horizontal_img">
        <img :src="items.pc_img" alt="">
      </div>
      <div class="course_main_horizontal_right">
        <div class="course_name">{{ items.name }}</div>
        <div class="course-info">{{ items.name }}</div>
        <div class="course_teacher">讲师：{{ items.teacher_name }} <span class="course_type">{{ items.billing_status == 1 ? '免费课' : items.billing_status == 2 ? items.price : item.billing_status == 3 ? '积分兑换' : '等级进入' }}</span></div>
        <div class="course_time">有效期：<span> 720天</span> <p>查看详情</p> </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  props: {
    items: {
      type: Object
    }
  },
  data() {
    return {

    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {

  }
};
</script>

<style>
 .course_main_horizontal {
    width: 100%;
    margin-bottom: 30px;
    background: rgba(255,255,255,1);
    border-radius: 10px;
    margin-right: 20px;
}
 .course_main_horizontal_con {
     margin: 20px;
     padding-bottom: 20px;
     border-bottom: 1px solid #E5E5E5;
     display: flex;
 }
 .course_main_horizontal_con:last-child() {
     border-bottom: none;
 }
 .course_main_horizontal_img img {
     width: 211px;
     height: 112px;
 }
 .course_main_horizontal_right {
     margin-left: 16px;
 }
 .course_name {
    font-size:16px;
    font-weight:400;
    color:rgba(51,51,51,1);
    margin-bottom: 8px;
 }
 .course-info{
    font-size:12px;
    font-weight:400;
    color:rgba(153,153,153,1);
    margin-bottom: 13px;
 }
 .course_teacher {
    font-size:14px;
    font-weight:400;
    color:rgba(102,102,102,1);
    margin-bottom: 10px;
 }
 .course_teacher .course_type {
    display: inline-block;
    text-align: center;
    line-height: 20px;
    margin-left: 40px;
    width:50px;
    height:20px;
    background:rgba(255,232,210,1);
    border-radius:4px;
    color: #FF9B3A;
 }
 .course_time {
     color: #999999;
     font-size:12px;
     display: flex;
 }
 .course_time span {
     color: #FF9B3A;
 }
 .course_time p {
    margin-left: 480px;
 }
</style>
