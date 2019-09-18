<template>
  <div class="fullpage-container">
    <div class="fullpage-wp" v-fullpage="opts">
      <div class="page-1 page">
        <p class="part-1" v-animate="{value: 'bounceInLeft'}">vue-fullpage</p>
      </div>
      <div class="page-2 page">
        <p class="part-2" v-animate="{value: 'bounceInRight'}">vue-fullpage</p>
      </div>
      <div class="page-3 page">
        <p class="part-3" v-animate="{value: 'bounceInLeft', delay: 0}">vue-fullpage</p>
        <p class="part-3" v-animate="{value: 'bounceInRight', delay: 600}">vue-fullpage</p>
        <p class="part-3" v-animate="{value: 'zoomInDown', delay: 1200}">vue-fullpage</p>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      opts: {
        start: 0,
        dir: 'v',
        duration: 500,
        beforeChange: function (prev, next) {
        },
        afterChange: function (prev, next) {
        }
      }
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .page-container,.fullpage-container {
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 199999;
  }
</style>
