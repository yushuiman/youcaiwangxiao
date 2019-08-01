<template>
  <div class="answer-time">
    {{answer_times}}
  </div>

</template>
<script>

export default {

  data () {
    return {
      h: 0, // 定义时，分，秒，毫秒并初始化为0；
      m: 0,
      s: parseInt(window.sessionStorage.getItem('answer_times')) || 0,
      ms: 0,
      time: 0, // 初始化0
      answer_times: '00:00:00'
    }
  },
  computed: {
    userAnswerTime () {
      return this.h * 60 * 60 + this.m * 60 + this.s
    }
  },
  mounted () {
    console.log(this.s)
    this.start()
  },
  methods: {
    timer () { // 定义计时函数
      this.ms = this.ms + 1000 // 毫秒
      if (this.ms >= 1000) {
        this.ms = 0
        this.s = this.s + 1 // 秒
        console.log(this.s)
      }
      if (this.s >= 60) {
        this.s = 0
        this.m = this.m + 1 // 分钟
      }
      if (this.m >= 60) {
        this.m = 0
        this.h = this.h + 1 // 小时
      }
      this.answer_times = this.toDub(this.h) + ':' + this.toDub(this.m) + ':' + this.toDub(this.s) + ''/* +this.toDubms(this.ms)+"毫秒" */
    // document.getElementById('mytime').innerHTML=h+"时"+m+"分"+s+"秒"+ms+"毫秒";
    },

    start () { // 开始
      this.time = setInterval(this.timer, 1000)
    },

    stop () { // 暂停
      clearInterval(this.time)
    },

    toDub (n) { // 补0操作
      if (n < 10) {
        return '0' + n
      } else {
        return '' + n
      }
    },

    toDubms (n) { // 给毫秒补0操作
      if (n < 10) {
        return '00' + n
      } else {
        return '0' + n
      }
    },
    /**
 * 时间转为秒
 * @param time 时间(00:00:00)
 * @returns {string} 时间戳（单位：秒）
 */
    timetosecond (time) {
      let s = ''

      let hour = time.split(':')[0]
      let min = time.split(':')[1]
      let sec = time.split(':')[2]

      s = Number(hour * 3600) + Number(min * 60) + Number(sec)
      this.allsecond = s
    }
  },
  // 实例创建完成后调用，此阶段完成了数据的观测等，但尚未挂载，$el 还不可用。需要初始化处理一些数据时会比较有用
  created: function () {

  },
  beforeDestroy () {
    clearInterval(this.time)
  }

}
</script>
