<template>
  <div ref="Image">
    <Row style="margin-left:10px">
      <Col :span="12">
          <div class="course_img">
            <div class="demo-upload-list" v-for="(item, index) in uploadList3" :key="index">
              <template>
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove3(item)"></Icon>
                </div>
              </template>
            </div>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess3"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              type="drag"
              action="/upload/Index/uploadImage"
              name="image"
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <p style="padding-top: 8px; font-size: 12px; color: #999; line-height: normal;">提示：图片比例暂未定义</p>
          </div>
      </Col>
    </Row>
    <Modal title="图片预览" v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<style scoped>
.course_img .demo-upload-list{
  display: inline-block;
  width: 180px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
}
.course_img .demo-upload-list img{
  width: 100%;
}
.course_img .demo-upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.course_img .demo-upload-list:hover .demo-upload-list-cover{
  display: block;
}
.course_img .demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>

<script>
// import Fomat from '../../libs/fomat.js'
export default {
  props: ['text'],
  data () {
    return {
      imageUrl: '',
      visible: false,
      imgUrl: '',
      uploadList3: [{ name: '', url: '' }],
      wx_img: [
        {
          required: true,
          // validator: Fomat.Rules.Verifiy().Required,
          trigger: 'change'
        }
      ]
    }
  },
  methods: {
    handleView (url) {
      this.imgUrl = url
      this.visible = true
    },
    handleBeforeUpload () {
      console.log('准备上传')
    },
    handleRemove3 (file) {
      let fileList = this.uploadList3
      this.uploadList3.splice(fileList.indexOf(file), 1)
    },
    handleSuccess3 (res, file) {
      if (res.code === 200) {
        // this.uploadList3 = []
        let obj = {
          name: file.name,
          url: res.data.image_url
        }
        this.uploadList3.push(obj)
        this.imageUrl = res.data.image_url
      }
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式验证',
        desc: '文件 “' + file.name + '” 格式错误, 请上传 jpg 或 png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '文件大小验证',
        desc: '文件 “' + file.name + '” 太大, 不要超过 2m'
      })
    }

  },
  mounted () {
    this.uploadList3[0].url = this.text
  }
}
</script>
