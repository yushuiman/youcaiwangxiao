<template>
  <section>
    <div class="course_main_con">
      <div class="course_main_con_img">
        <img :src="items.pc_img" alt="">
      </div>
      <div class="course_main_info">
        <p>{{items.name}}</p>
        <p>讲师：{{items.teacher_name}}<span class="fire">{{ items.billing_status == 1 ? '免费课' : items.billing_status == 2 ? items.price : item.billing_status == 3 ? '积分兑换' : '等级进入' }}</span></p>
        <p>有效期： <span>720天</span></p>
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

</style>
