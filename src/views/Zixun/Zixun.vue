<template>
  <div>这是资讯页面</div>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {
    window.open('http://www.youcaiwx.com/html/Article/Index/index.html', '_blank')
  },
  methods: {
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
