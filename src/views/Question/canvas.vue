<template>
  <div class="canvasArea" style="">
    <p><span id="perValue">0</span></p>
    <canvas width="400" height="400" id="mask" style="z-index:9"></canvas>
    <canvas width="400" height="400" id="bg"></canvas>
    <canvas width="400" height="400" id="circle" style="z-index:10"></canvas>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bgid: null,
      maskid: null,
      circleid: null,
      x: 0,
      y: 0,
      radius: 0,
      perV: 0,
      load: 0,
      bgctx: null,
      maskctx: null,
      circlectx: null,
      paramObj: {
        bgid: '#bg',
        maskid: '#mask',
        circleid: '#circle',
        x: 200,
        y: 200,
        radius: 180,
        perV: 80,
        initLoaded: 0
      }
    }
  },
  mounted () {
    this.init(this.paramObj)
    this.drawBgLayer()
    this.drawMaskLayer()
  },
  methods: {
    init (paramObj) {
      this.bgid = paramObj.bgid
      this.maskid = paramObj.maskid
      this.circleid = paramObj.circleid
      this.x = paramObj.x
      this.y = paramObj.y
      this.radius = paramObj.radius
      this.perV = paramObj.perV
      this.load = paramObj.initLoaded

      this.bgctx = document.querySelector(this.bgid).getContext('2d')
      this.circlectx = document.querySelector(this.circleid).getContext('2d')
      this.maskctx = document.querySelector(this.maskid).getContext('2d')
    },

    drawBgLayer () {
      this.bgctx.beginPath()
      this.bgctx.lineWidth = 8
      this.bgctx.strokeStyle = '#e5e5e5'
      this.bgctx.arc(this.x, this.y, this.radius, (5 / 6) * Math.PI, (1 / 6) * Math.PI, false)
      this.bgctx.stroke()
    },
    drawMaskLayer () {
      var draw = setInterval(() => {
        if (this.load <= this.perV) {
          this.drawCircle()
          this.load += 1
        } else {
          clearInterval(draw)
          draw = null
        }
      }, 10)
    },
    drawCircle () {
      document.querySelector('#perValue').innerHTML = this.load
      var vv = this.load / 100 * (4 / 3) + (5 / 6)
      if (vv > 2) {
        vv = vv - 2
      }
      var loaded = vv * Math.PI
      this.maskctx.clearRect(0, 0, 400, 400)
      this.maskctx.beginPath()
      this.maskctx.lineWidth = 8
      this.maskctx.strokeStyle = '#00acee'
      this.maskctx.arc(this.x, this.y, this.radius, (5 / 6) * Math.PI, loaded, false)
      this.maskctx.stroke()

      var para = vv * 3.14
      var px = this.x + this.radius * Math.cos(para - 0.03)
      var py = this.y + this.radius * Math.sin(para - 0.03)
      this.circlectx.clearRect(0, 0, 400, 400)
      this.circlectx.beginPath()
      this.circlectx.arc(px, py, 8, 0, 360, false)
      this.circlectx.fillStyle = '#00acee'
      this.circlectx.fill()
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
.canvasArea {
      height: 200px;
      width: 200px;
      position: relative;
      padding: 10px;
    }

    .canvasArea p {
      position: absolute;
      width: 100%;
      height: 100%;
      line-height: 200px;
      text-align: center;
      font-size: 24px;
    }

    canvas {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    #perValue {
      font-weight: bold;
      color: red;
      padding-right: 10px;
    }
</style>
