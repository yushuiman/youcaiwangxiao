<template>

      <div id="box">
        <div id="left"></div>
        <div id="resize" class="course-drag">
          <div class="drag">
          </div>
        </div>
        <div id="right"></div>
    </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
    this.dragControllerDiv()
  },
  methods: {
    dragControllerDiv: function () {
      window.onload = function () {
        var resize = document.getElementById("resize")
        var left = document.getElementById("left")
        var right = document.getElementById("right")
        var box = document.getElementById("box")
        var drag = document.getElementById("drag")
        resize.onmousedown = function (e) {
          var startX = e.clientX;
          resize.left = resize.offsetLeft;
          document.onmousemove = function (e) {
            var endX = e.clientX;

            var moveLen = resize.left + (endX - startX);
            var maxT = box.clientWidth - resize.offsetWidth;
            if (moveLen < 150) moveLen = 150;
            if (moveLen > maxT - 150) moveLen = maxT - 150;

            resize.style.left = moveLen;
            left.style.width = moveLen + "px";
            right.style.width = (box.clientWidth - moveLen -10) + "px";
          }
          document.onmouseup = function (evt) {
            document.onmousemove = null;
            document.onmouseup = null;
            resize.releaseCapture && resize.releaseCapture();
          }
          resize.setCapture && resize.setCapture();
          return false;
        }
      }
    }
  }
}
</script>

<style scoped>
  body,html{
    margin:0;
    padding:0;
    height:100%;
  }
  #box{
    width:600px;
    height:500px;
    overflow:hidden;
    position: relative;
  }
  #left{
    width:calc(60% - 10px);
    height:100%;
    background:skyblue;
    float:left;
    margin-left: 2px;
  }

  #resize{
    width:8px;
    height:100%;
    cursor: w-resize;
    float:left;
  }

  #right{
    float:right;
    width:40%;
    height:100%;
    background:tomato;
  }
  .drag {
    position: absolute;
    top: 50%;
    margin-top: -20px;
    width: 4px;
    height: 40px;
    border: 1px solid #626972;
    border-width: 0 1px 0 1px;
  }
  .course-drag {
    cursor: col-resize;
    z-index: 2;
  }
</style>
