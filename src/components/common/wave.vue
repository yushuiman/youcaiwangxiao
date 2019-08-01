<template>
  <div class="box">
    <canvas id="c"></canvas>
  </div>
</template>

<script>
export default {
  props: {
    accuracy: {
      type: Number
    }
  },
  data () {
    return {
      nowRange: 30 // 用于做一个临时的range
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let canvas = document.getElementById('c')
      let ctx = canvas.getContext('2d')
      // 画布属性
      let mW = canvas.width = 135
      let mH = canvas.height = 135
      let lineWidth = 2
      let ran = 0
      ran = this.accuracy
      // 圆属性
      let r = mH / 2 // 圆心
      let cR = r // 圆半径
      // let cR = r - 16 * lineWidth; //圆半径

      // Sin 曲线属性
      let sX = 0
      // let sY = mH / 2
      let axisLength = mW // 轴长
      let waveWidth = 0.0456 // 波浪宽度,数越小越宽
      let waveHeight = 8 // 波浪高度,数越大越高
      let speed = 0.06 // 波浪速度，数越大速度越快
      let xOffset = 0.8 // 波浪x偏移量

      ctx.lineWidth = lineWidth

      // 画圈函数
      let IsdrawCircled = false
      let drawCircle = function () {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255,255,255,0)'
        ctx.arc(r, r, cR, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(r, r, cR, 0, 2 * Math.PI)
        ctx.clip()
        ctx.stroke()
      }

      // 画sin 曲线函数
      let drawSin = function (xOffset) {
        ctx.save()
        let points = [] // 用于存放绘制Sin曲线的点
        ctx.beginPath()
        // 在整个轴长上取点
        for (let x = sX; x < sX + axisLength; x += 10 / axisLength) {
          // 此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
          let y = -Math.sin((sX + x) * waveWidth + xOffset)
          let y1 = Math.sin((sX - x) * waveWidth + xOffset)

          let dY = mH * (1 - ran / 100) // 动态控制波浪的高度
          let dY1 = mH * (1 - ran / 100) // 变量加3控制波浪的高度

          points.push([x, dY + y * waveHeight])
          points.push([x, dY1 + y1 * waveHeight])
          ctx.lineTo(x, dY + y * waveHeight)
          ctx.lineTo(x, dY1 + y1 * waveHeight)
        }

        // 封闭路径
        ctx.lineTo(axisLength, mH)
        ctx.lineTo(sX, mH)
        ctx.lineTo(points[0][0], points[0][1])
        // 指定渐变区域

        var grad = ctx.createLinearGradient(14, 242, 150, 200)
        grad.addColorStop(0, 'rgba(14,242,159,1)') // 蓝

        grad.addColorStop(1, 'rgba(2,158,240,1)') // 绿

        // 将这个渐变设置为fillStyle

        ctx.fillStyle = grad

        ctx.fill()
        ctx.restore()
      }

      // 写百分比文本函数
      let drawText = function () {
        ctx.save()
        let size = 0.7 * cR // 字体大小
        ctx.font = size + 'px Microsoft Yahei'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#333333'
        ctx.fillText(ran, r, r + size / 2) // 控制文本

        ctx.restore()
      }

      let render = function () {
        ctx.clearRect(0, 0, mW, mH)
        if (IsdrawCircled === false) {
          drawCircle()
        }
        drawSin(xOffset)
        drawText()
        xOffset += speed
        requestAnimationFrame(render)
      }
      render()
    }
  }

}
</script>

<style scoped>
  .box{
    width: 136px;
    height: 136px;
    border-radius: 50%;
    border: 1px solid #47BF7F;
  }
</style>
