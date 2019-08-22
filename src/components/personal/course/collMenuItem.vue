<template>
  <!-- 没有用到 -->
  <div class="coll-section-wrap">
    <!-- 知识点 -->
    <Modal v-model="visible"
      :width="795"
      footer-hide
      title="收藏章节">
      <div class="height-com">
        <div class="com-bg">请选择需要学习的视频</div>
        <Row>
          <Col span="24">
            <Menu accordion width="100%">
              <Submenu :name="index+1" v-for="(item, index) in myCollvideoList" :key="index">
                <template slot="title">
                  <div class="menu-section-title">
                    {{item.section_name}}
                  </div>
                </template>
                <div class="error-menu-er" v-for="(val, key) in item.video" :key="key" style="padding: 10px 30px 10px 60px;">
                  <div class="menu-jie-title">
                    <div>
                      {{val.video_name}}
                    </div>
                    <div class="error-btn">
                      <button class="btn-com" @click="collectionLearnVideo(item, val)">去学习</button>
                    </div>
                  </div>
                </div>
              </Submenu>
            </Menu>
          </Col>
        </Row>
      </div>
    </Modal>
  </div>
</template>
<script>
// import { personalWrongtopic, getKnow } from '@/api/personal'
// import { mapState } from 'vuex'

export default {
  props: {
    myCollvideoList: {
      type: Array
    }
  },
  data () {
    return {
      visible: true
    }
  },
  components: {
  },
  // computed: {
  //   ...mapState({
  //     token: state => state.user.token,
  //     user_id: state => state.user.user_id
  //   })
  // },
  mounted () {
  },
  methods: {
    collectionLearnVideo (item, val) {
      this.$emit('collectionLearnVideo', item, val)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../../assets/scss/app";
</style>
