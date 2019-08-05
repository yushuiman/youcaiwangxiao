<template>
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
                <div class="coll-menu-er" v-for="(val, key) in item.video" :key="key">
                  <div class="menu-jie-title">
                    <div>
                      {{val.video_name}}
                    </div>
                    <button class="btn-com" @click="collectionLearnVideo(item, val)">去学习</button>
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
  @import "../../../assets/scss/modal.css";
  .coll-menu-er{
    padding: 5px 20px 5px 63px;
    .menu-jie-title{
      align-items: center;
    }
    .btn-com{
      width: 69px;
      height: 25px;
    }
  }
  .coll-menu-er:hover {
    background: #F3F6FF;
  }
</style>
