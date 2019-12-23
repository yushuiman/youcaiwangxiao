<template>
    <div class="bycourse" style="text-align:center;">
        <div ref="courseInfo" class="courseInfo">
            <img class="courseCover" src="../../assets/images/course/hot-top-icon.png" alt="">
            <div>
                <div class="coursenum">共<span>102222</span>节·<span>12211</span>人学习</div>
                <div class="courseTitle">测试下载</div>
            </div>
        </div>
        <div>好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>
        好多内通<br>好多内通<br>好多内通<br>好多内通<br>
        好多内通<br>好多内通<br>好多内通<br>好多内通<br>
        好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>
        好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>
        好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>
        好多内通<br>好多内通<br>好多内通<br>好多内通<br>
        好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>
        好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>好多内通<br>
        好多内通<br></div>

        <div @click="toImage">下载</div>
        <img :src="dataURL" alt="">
        <div @click="createPicture">好吧</div>
        <div>结束<br>结束<br></div>
        <!-- <a href="https://youcai2020.oss-cn-beijing.aliyuncs.com/style/images/20190826/225acde88799df9dbf37ef8bfac126e4.png" download>下载</a> -->
    </div>
</template>
<script>
import html2canvas from 'html2canvas'
export default {
  data () {
    return {
      dataURL: ''
    }
  },

  methods: {

    toImage () {
      html2canvas(this.$refs.courseInfo, {
        backgroundColor: null
      }).then((canvas) => {
        let dataURL = canvas.toDataURL('image/png')
        this.dataURL = dataURL
      })
    },
    createPicture () {
      html2canvas(document.body, {
        backgroundColor: null
      }).then(canvas => {
        var imgData = canvas.toDataURL('image/jpeg')
        this.fileDownload(imgData)
      })
    },
    // 下载图片
    fileDownload (downloadUrl) {
      let aLink = document.createElement('a')
      aLink.style.display = 'none'
      aLink.style.background = '#ffffff'
      aLink.style.margin = '0 auto'
      aLink.href = downloadUrl
      aLink.download = downloadUrl
      // 触发点击-然后移除
      document.body.appendChild(aLink)
      aLink.click()
      document.body.removeChild(aLink)
    }
  }
}
</script>
