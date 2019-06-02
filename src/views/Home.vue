<template>
  <div class="home">
    这是首页页面
  </div>
</template>

<script>
// @ is an alias to /src
import { couAnswerList } from '@/api/Answer.js'
export default {
  name: 'home',
  mounted() {
    couAnswerList().then(res => {
      let rep = res.data
      if (rep.code === 200) {
        console.log(rep.data)
      }
    })
  }
}
</script>
