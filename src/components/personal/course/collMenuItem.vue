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
                <MenuItem :name="(index+1)+ '-' + (key+1)" v-for="(val, key) in item.video" :key="key" style="padding-left: 40px;padding-right: 40px;">
                  <div class="menu-jie-title">
                    <div>
                      {{val.video_name}}
                      <span>（收藏<em style="color:#f00;">{{val.knobcoun}}</em>道题）</span>
                    </div>
                    <button class="btn-zsd" @click="getKnow(item, val, key)">去学习</button>
                  </div>
                </MenuItem>
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
import { mapState } from 'vuex'

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
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    })
  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../../assets/scss/app";
  @import "../../../assets/scss/modal.css";
</style>
