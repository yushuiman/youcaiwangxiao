<script>
const MILLISECONDS_SECOND = 1000
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND
const MILLISECONDS_HOUR = 60 * MILLISECONDS_MINUTE
const MILLISECONDS_DAY = 24 * MILLISECONDS_HOUR

export default {
  data () {
    return {
      count: 0,
      counting: false,
      endTime: 0
    }
  },
  props: {
    autoStart: {
      type: Boolean,
      default: true
    },
    emitEvents: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 1000
    },
    leadingZero: {
      type: Boolean,
      default: true
    },
    now: {
      type: Function,
      default: () => Date.now()
    },
    time: {
      type: Number,
      default: 0,
      required: true,
      validator: value => value >= 0
    },
    tag: {
      type: String,
      default: 'span'
    }
  },

  computed: {
    days () {
      return Math.floor(this.count / MILLISECONDS_DAY)
    },
    hours () {
      return Math.floor((this.count % MILLISECONDS_DAY) / MILLISECONDS_HOUR)
    },
    minutes () {
      return Math.floor((this.count % MILLISECONDS_HOUR) / MILLISECONDS_MINUTE)
    },
    seconds () {
      const { interval } = this
      const seconds = (this.count % MILLISECONDS_MINUTE) / MILLISECONDS_SECOND

      if (interval < 10) {
        return seconds.toFixed(3)
      } else if (interval >= 10 && interval < 100) {
        return seconds.toFixed(2)
      } else if (interval >= 100 && interval < 1000) {
        return seconds.toFixed(1)
      }

      return Math.floor(seconds)
    },
    totalDays () {
      return this.days
    },
    totalHours () {
      return Math.floor(this.count / MILLISECONDS_HOUR)
    },
    totalMinutes () {
      return Math.floor(this.count / MILLISECONDS_MINUTE)
    },
    totalSeconds () {
      return Math.floor(this.count / MILLISECONDS_SECOND)
    }
  },

  render (createElement) {
    const preprocess = value => (this.leadingZero && value < 10 ? `0${value}` : value)

    return createElement(this.tag, this.$scopedSlots.default ? [
      this.$scopedSlots.default({
        days: preprocess(this.days),
        hours: preprocess(this.hours),
        minutes: preprocess(this.minutes),
        seconds: preprocess(this.seconds),
        totalDays: this.totalDays,
        totalHours: this.totalHours,
        totalMinutes: this.totalMinutes,
        totalSeconds: this.totalSeconds
      })
    ] : this.$slots.default)
  },

  created () {
    this.init()
  },

  mounted () {
    window.addEventListener('focus', (this.onFocus = this.update.bind(this)))
  },

  beforeDestroy () {
    window.removeEventListener('focus', this.onFocus)
    clearTimeout(this.timeout)
  },

  watch: {
    time () {
      this.init()
    }
  },

  methods: {
    init () {
      const { time } = this

      if (time > 0) {
        this.count = time
        this.endTime = this.now() + time

        if (this.autoStart) {
          this.$nextTick(() => {
            this.start()
          })
        }
      }
    },
    start () {
      if (this.counting) {
        return
      }

      if (this.emitEvents) {
        this.$emit('countdownstart')
      }

      this.counting = true
      this.step()
    },
    pause () {
      if (!this.counting) {
        return
      }
      if (this.emitEvents) {
        this.$emit('countdownpause')
      }

      this.counting = false
    },
    step () {
      if (!this.counting) {
        return
      }

      if (this.emitEvents) {
        this.$emit('countdownprogress', {
          days: this.days,
          hours: this.hours,
          minutes: this.minutes,
          seconds: this.seconds
        })
      }

      if (this.count > 0) {
        const { interval } = this

        this.timeout = setTimeout(() => {
          this.count -= interval
          this.step()
        }, interval)
      } else {
        this.count = 0
        this.stop()
      }
    },
    stop () {
      this.counting = false
      this.timeout = undefined
      if (this.emitEvents) {
        this.$emit('countdownend')
      }
    },
    update () {
      if (this.counting) {
        this.count = Math.max(0, this.endTime - this.now())
      }
    }
  }
}
</script>
