<template>
  <div class="index">
    <h1>长按保存图片</h1>
      <div id="captureId" class="capture" v-show="firstFlag" >
        <ul>
          <li>优财网校</li>
          <li>CPE积分</li>
          <li>itemi</li>
          <li>itemi</li>
          <li>itemi</li>
          <li>itemi</li>
          <li>itemi</li>
          <li>itemi</li>
          <li>itemi</li>
          <li>itemi</li>
          <li>itemi</li>
          <li>itemi</li>
          <li>itemi</li>
          <li>粉丝都是粉丝地方</li>
          <li>CPE积分借宿</li>
          <li>CPE积分借宿</li>
          <li>CPE积分借宿</li>
          <li>CPE积分借宿</li>
          <li>CPE积分借宿</li>
          <li>CPE积分借宿</li>
          <li>CPE积分借宿</li>
          <li>CPE积分借宿</li>
          <li>CPE积分借宿</li>
          <li>CPE积分借宿</li>
          <li>CPE积分借宿</li>
          <li>CPE积分借宿</li>
          <li>很长的cpe积分</li>
          <li>很长的cpe积分</li>
          <li>很长的cpe积分</li>
          <li>移动端很长的cpe积分</li>
        </ul>
        <h2>helloworld</h2>
      </div>
    <img :src="dataURL" alt="" v-show="!firstFlag" style="widtn:100%">
    <div @click="fileDownload" style="width: 200px;height: 60px;line-height: 60px;text-align:center;background:#f00;border-radius:4px;color:#ffffff;">点击按钮保存图片</div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
export default {
  data () {
    return {
      dataURL: '',
      firstFlag: true
    }
  },

  mounted () {
    html2canvas(document.querySelector('#captureId')).then(canvas => {
      let imgUrl = canvas.toDataURL('image/png')
      this.dataURL = imgUrl
      this.firstFlag = false
    })
  },
  methods: {
    fileDownload (dataURL) {
      let aLink = document.createElement('a')
      aLink.style.display = 'none'
      aLink.style.background = '#ffffff'
      aLink.style.margin = '0 auto'
      aLink.href = this.dataURL
      aLink.download = this.dataURL
      // 触发点击-然后移除
      document.body.appendChild(aLink)
      aLink.click()
      document.body.removeChild(aLink)
    }
  }
}
</script>
<style lang='scss' scoped>
h1{
  font-size: 22px;
  font-weight: bold;
}
.capture{
  background: #eeeeee;
}
.capture li{
  line-height: 20px;
}
</style>
