<template>
  <div class="do-potic-wrap w-wrap clearfix">
    <div class="dptic-wrap-l fl">
      <div v-if="topicList && topicList.length">
      {{topicList}}
      </div>
      <div v-else style="height: 300px; line-height: 300px;">
        没有题
      </div>
    </div>
    <div class="dptic-wrap-r fr">
      右边
    </div>
  </div>
</template>

<script>
import { topicList } from '@/api/questions'
export default {
  data () {
    return {
      topicList: [],
      answer_time: '',
      total: '',
      title: '',
      getQuestion: {
        course_id: this.$route.query.course_id,
        paper_id: this.$route.query.paper_id,
        section_id: this.$route.query.section_id,
        knob_id: this.$route.query.knob_id,
        know_id: this.$route.query.know_id,
        mock_id: this.$route.query.mock_id,
        user_id: this.$route.query.user_id,
        plate_id: this.$route.query.plate_id,
        num: this.$route.query.num,
        paper_mode: this.$route.query.paper_mode,
        paper_type: this.$route.query.paper_type
      }
    }
  },
  components: {

  },
  mounted () {
    this.getTopicList()
  },
  methods: {
    // 题
    getTopicList () {
      topicList(this.getQuestion).then(data => {
        const res = data.data
        this.topicList = res.data.topics
        this.answer_time = res.data.answer_time
        this.total = res.data.total
        this.title = res.data.title
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .do-potic-wrap{
    padding: 20px 0;
    .dptic-wrap-l{
      width: 895px;
    }
    .dptic-wrap-r{
      width: 285px;
    }
  }
</style>
