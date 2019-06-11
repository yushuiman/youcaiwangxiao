<template>
  <div class="course-main-con fl" @click="goClassDetail(items.id)">
    <img :src="items.pc_img" alt="" class="course-main-con-img">
    <div class="course-main-info">
      <p class="ci-title">{{items.name}}</p>
      <p class="ci-teacher-day"><span>讲师：{{items.teacher_name}}</span>有效期：730天</p>
      <span class="ci-pay-free">{{ items.billing_status == 1 ? '免费课' : items.billing_status == 2 ? items.price : item.billing_status == 3 ? '积分兑换' : '等级进入' }}</span>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    items: {
      type: Object
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    goClassDetail (id) {
      this.$router.push(`classDetail?courseid=${id}`)
    }
  }
}
</script>

<style>
</style>
