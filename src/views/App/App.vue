<template>
  <div class="app-down-wrap">
    <div class="page page-1" id="item-1" :style="{height: h + 'px'}">
      <div class="page-cont-1">
        <div class="page-cont-l-1">
          二维码
        </div>
        <div class="page-cont-r-1">
          <img src="../../assets/images/app/page-iphone-1.png" alt="">
        </div>
      </div>
    </div>
    <div class="page page-2" id="item-2" :style="{height: h + 'px'}">Prat 2</div>
    <div class="page page-3" id="item-3" :style="{height: h + 'px'}">Prat 3</div>
    <div class="page page-4" id="item-4" :style="{height: h + 'px'}">Prat 4</div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      h: 400
    }
  },
  mounted () {
    this.h = document.documentElement.clientHeight
  },
  methods: {}
}
</script>
<style scoped>
  .app-down-wrap{
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  .page{
    position: relative;
    /* position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0; */
  }
  /* <div class="page-cont-1">
        <div class="page-cont-l-1">
          二维码
        </div>
        <div class="page-cont-r-1">
          <img src="../../assets/images/app/page-iphone-1.png" alt="">
        </div>
      </div> */
  .page-1{
    height: 100%;
    background: url('../../assets/images/app/page-banner-1.png') no-repeat top center;
    background-size: cover;
  }
  .page-cont-1{
    width: 1092px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .page1-l{
    padding-left: 108px;
  }
</style>
