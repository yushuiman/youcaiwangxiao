<template>
  <div class="u-user-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdxSet == index}" :key="index"
          @click="tabClk(v, index)">{{v}}
      </li>
    </ul>
    <div class="all-main">

      <div v-if="selIdxSet == 0">
        <!--个人信息页面展示-->
        <div v-if="!changeSetFlag">
          <!--修改页面头部-->
          <div class="header">
            <span class="change_info">基本信息</span>
            <button @click="btnChangeinfo" class="pwd_save"><span>修改</span></button>
          </div>
          <!--昵称-->
          <div class="info_msg">
            <span>昵称</span>
            <span class="info_nickname">优财学院45</span>
          </div>
          <!--性别-->
          <div class="info_msg">
            <span>性别</span>
            <span class="info_sex">男</span>
          </div>
          <!--手机-->
          <div class="info_msg">
            <span>手机</span>
            <span class="info_phone">17777777777</span>
          </div>
          <!--地址列表-->
          <div class="info_msg">
            <span>地址</span>
           <div>
             <p class="info_address"><span>菜菜</span><span>17777777777</span><span>北京 北京市 海淀区 胜利街道 宝福大厦</span></p>
             <button class="btn_default">默认</button>
           </div>
          <!--  <div>
              <span style="display: none">地址</span>
              <p class="info_address"><span>菜菜</span><span>17777777777</span><span>北京 北京市 海淀区 胜利街道 宝福大厦</span></p>
              <button class="btn_default"><span>默认</span></button>
            </div>-->
          </div>
        </div>
        <!--个人信息修改-->
       <div v-if="changeSetFlag">
         <!--头像-->
         <div @click="changeAvatar">
           <img class="avatar" src="" alt="">
           <span class="change_avatar">修改头像</span>
         </div>
         <!--保存按钮-->
         <button class="btn_save" @click="saveChange">保存</button>
         <!--基本信息-->
         <div class="basic">
           <h3 class="basic_info">基本信息</h3>
           <!--昵称-->
           <div class="nickname">
             <span class="nickname_text">昵称</span>
             <span class="nickname_name">优财学院45号学员</span>
           </div>
           <!--性别-->
           <div style="margin-top: 21px">
             <span class="sex">性别</span>
             <!-- <label class="sex_male"><input type="radio" name="sex" value="男生"><span class="sex_text">男</span></label>
              <label class="sex_female"><input type="radio" name="sex" value="女生"><span class="sex_text">女</span></label>-->
             <RadioGroup style="margin-bottom: 3px">
               <Radio label="男" class="sex_male">
                 <span class="sex_text">男</span>
               </Radio>
               <Radio label="女" class="sex_female">
                 <span class="sex_text">女</span>
               </Radio>
             </RadioGroup>
           </div>
           <!--手机号-->
           <div style="margin-top: 30px">
             <span class="phone_text">手机</span>
             <span class="phone">16666666666</span>
           </div>
           <!--添加新地址按钮-->
           <div class="address">
             <span class="address_text">地址</span>
             <button class="btn_address"><span>+ 新添加地址</span></button>
           </div>
           <!--收货人，手机号输入框-->
           <div>
             <div class="goods">
               <input type="text" placeholder="收货人">
               <input style="margin-left: 20px" type="text" placeholder="手机号码">
               <span class="default_address">设置默认地址</span>
             </div>
             <!--详细地址输入框-->
             <div>
               <input class="detalis_address" type="text" placeholder="详细地址：省市区、道路、门牌号、小区、楼栋号、单元室等">
             </div>
           </div>
           <!--原有的收货人，手机号输入框-->
           <div style="margin-top: 40px">
             <div class="goods">
               <input type="text" placeholder="收货人">
               <input style="margin-left: 20px" type="text" placeholder="手机号码">
             </div>
             <!--原有的详细地址输入框-->
             <div>
               <input class="detalis_address" type="text" placeholder="详细地址：省市区、道路、门牌号、小区、楼栋号、单元室等">
               <span class="cancel_address">取消默认地址</span>
               <span class="del_address">删除地址</span>
             </div>
           </div>
         </div>
       </div>
      </div>
      <!--修改密码页面-->
      <div v-if="selIdxSet == 1">
        <!--修改页面头部-->
        <div class="header">
          <span class="change_pwd">修改密码</span>
          <button @click="pwdsave" class="pwd_save"><span>保存</span></button>
        </div>
        <!--原密码-->
        <div class="pwd old_pwd">
          <span>原密码</span>
          <input v-model="newpwd" type="text" placeholder="请输入原密码">
        </div>
        <!--新密码-->
        <div class="pwd new_pwd">
          <span>新密码</span>
          <input v-model="newpwd" type="text" placeholder="请输入新密码">
        </div>
        <!--确认密码-->
        <div class="pwd confirm_pwd">
          <span>确认密码</span>
          <input v-model="confimpwd" style="margin-left: 51px" type="text" placeholder="请再次输入新密码">
        </div>
      </div>
    </div>
    <!--裁剪头像的弹出框-->
    <Modal style="font-size: 28px" v-model="visible"
           width='695'
           title="上传头像">
      <div class="" style="height:377px">
        <!--左侧原图和预览-->
        <div class="content">
          <!--上传的图片-->
          <div class="content_left">
            <div class="cropper vue-cropper">
              <vueCropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.size"
                :outputType="option.outputType"
                :info="option.info"
                :full="option.full"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :original="option.original"
                :autoCrop="option.autoCrop"
                :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight"
                :fixedBox="option.fixedBox"
                @realTime="realTime"
              ></vueCropper>
            </div>
          </div>
          <!--预览图-->
          <div class="content_right">
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img">
            </div>
            <div class="content_r_text">头像预览</div>
          </div>
        </div>
        <div class="content_foot">
          <label class="btn" for="uploads">重新上传</label>
          <input type="file" id="uploads" :value="imgFile"
                 style="position:absolute; clip:rect(0 0 0 0);width: 1px;"
                 accept="image/png, image/jpeg, image/gif, image/jpg"
                 @change="uploadImg($event, 1)">
          <input type="button" class="operation-btn" value="-" title="缩小" @click="changeScale(-1)">
          <input type="button" class="operation-btn" value="+" title="放大" @click="changeScale(1)">
          <!--
                    <input type="button" class="operation-btn" value="↺" title="左旋转" @click="rotateLeft">
          -->
          <input type="button" class="operation-btn" value="↻" title="右旋转" @click="rotateRight">
          <!--  <div class="btn" @click="finish('blob')">上传头像</div>-->
        </div>

      </div>
    </Modal>
  </div>
</template>

<script>
import { getProject } from '@/api/personal'
import { mapState } from 'vuex'
import { VueCropper } from 'vue-cropper'

export default {
  data () {
    return {
      txtArr: ['个人信息修改', '密码修改'],
      selIdxSet: window.sessionStorage.getItem('selIdxSet') || 0,
      courseList: [], // 课程列表
      oldpwd: '', // 原密码
      newpwd: '', // 新密码
      confimpwd: '', // 确认密码
      // 剪切图片上传
      visible: false, // 模态框默认不显示
      crap: false,
      previews: {}, // 实时图片预览对象
      background: false,
      changeSetFlag: false, // 修改展示div
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: true, // 输出原图比例截图 props名full
        outputType: 'png', // 裁剪生成额图片的格式
        canMove: true, // 能否拖动图片
        original: false, // 上传图片是否显示原始宽高
        canMoveBox: true, // 能否拖动截图框
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 112,
        autoCropHeight: 112,
        fixedBox: true // 截图框固定大小
      },
      fileName: '', // 本机文件地址
      downImg: '#',
      imgFile: '',
      uploadImgRelaPath: '' // 上传后的图片的地址（不带服务器域名）
    }
  },
  props: ['uploadType'],
  components: {
    VueCropper
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      user_id: state => state.user.user_id
    })
  },
  mounted () {
    this.getProjectList()
  },
  methods: {
    // tab
    tabClk (v, index) {
      if (!this.user_id) {

      }
      this.selIdxSet = index
      window.sessionStorage.setItem('selIdxSet', index)
    },
    btnChangeinfo () {
      this.changeSetFlag = true
    },
    saveChange () {
      this.changeSetFlag = false
    },
    getProjectList (type) {
      getProject({
        user_id: this.user_id
      }).then(data => {
        const res = data.data
        this.courseList = res.data
      })
    },
    /* 修改密码保存提交 */
    pwdsave () {

    },
    /* 点击修改头像时模态框显示 */
    changeAvatar () {
      this.visible = true
    },

    // 放大/缩小
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    /*  // 左旋转
        rotateLeft() {
          this.$refs.cropper.rotateLeft();
        }, */
    // 右旋转
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    // 实时预览函数
    realTime (data) {
      this.previews = data
    },
    // 选择本地图片
    uploadImg (e, num) {
      var _this = this
      // 上传图片
      var file = e.target.files[0]
      _this.fileName = file.name
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型只支持.gif,jpeg,jpg,png,bmp')
        return false
      }
      var reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        if (num === 1) {
          _this.option.img = data
        } else if (num === 2) {
          _this.example2.img = data
        }
      }
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file)
    }
    // 上传图片（点击保存按钮）
    /*     finish(type) {
             console.log('finish', type)
             let _this = this;
             let formData = new FormData();
             // 输出
             if (type === 'blob') {
               this.$refs.cropper.getCropBlob((data) => {
                 let img = window.URL.createObjectURL(data)
                 formData.append('multfile', data, _this.fileName)
                 formData.append('operaType', this.uploadType)
                 this.$store.dispatch('UPLOAD_HEAD', formData)
                   .then(res => {
                     let data = res.data.data;
                     this.$emit("upload", data);
                     this.$message.success('修改成功！')
                   }).catch(err => {
                   if (err.data) {
                     this.$message.error(err.data.msg)
                   } else {
                     this.$message.error('修改失败！')
                   }
                 })
               })
             } else {
               this.$refs.cropper.getCropData((data) => {
                 // this.model = true;
                 // this.modelSrc = data;
               })
             }
           }, */
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";

  .tab-item {
    font-size: 18px;
  }

  .all-main {
    position: relative;
    padding: 26px 30px 30px 30px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 20px 0px rgba(140, 196, 255, 0.3);
    border-radius: 8px;
    margin-bottom: 43px;
  }
  /*个人信息页面展示开始*/
  .info_msg{
    margin-top: 20px;
  }
  .info_msg div{
    display: inline-block;
  }

  .info_msg span{
    height:22px;
    font-size:16px;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:22px;
  }
  .info_address{
    display: inline-block;
  }
  .info_msg {
    .info_nickname,.info_phone,.info_address,.info_sex{
      margin-left: 50px;
    }
  }
  .info_msg{
    .info_nickname, .info_address,.info_sex{
      color:rgba(51,51,51,1);
    }

  }
  .info_msg .info_address span{
    color:rgba(51,51,51,1);
    margin-right: 9px;
  }
  .btn_default{
    width:45px;
    height:24px;
    color: #0267FF;
    border-radius:20px;
    background:rgba(2,103,255,.1);
    border-radius:20px;
  }
  /*个人信息页面展示结束*/
  .avatar {
    width: 92px;
    height: 92px;
    display: block;
    margin: 0 auto;
    border-radius: 50%;
    background-color: red;
    cursor: pointer;
  }

  .btn_save {
    width: 79px;
    height: 32px;
    position: absolute;
    top: 26px;
    right: 30px;
    color: white;
    background: rgba(24, 116, 253, 1);
    border-radius: 16px;
  }

  .change_avatar {
    width: 64px;
    height: 22px;
    display: block;
    margin: 10px auto 20px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(2, 103, 255, 1);
    line-height: 22px;
    cursor: pointer;
  }

  .basic_info {
    width: 72px;
    height: 25px;
    font-size: 18px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 25px;
  }

  .nickname {
    margin-top: 21px;
  }

  .nickname_text {
    width: 32px;
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    vertical-align: middle;
    display: inline-block;
    color: rgba(153, 153, 153, 1);
    line-height: 22px;
  }

  .nickname_name {
    width: 198px;
    height: 40px;
    font-size: 16px;
    display: inline-block;
    margin-left: 51px;
    background: rgba(245, 245, 245, 1);
    border-radius: 4px;
    line-height: 40px;
    padding-left: 9px;
    border: 1px solid rgba(220, 220, 220, 1)
  }

  .sex {
    width: 32px;
    height: 22px;
    font-size: 16px;
    vertical-align: middle;
    font-weight: 400;
    display: inline-block;
    color: rgba(153, 153, 153, 1);
    line-height: 22px;
  }

  .sex_male {
    margin-left: 51px;
  }

  .sex_female {
    margin-left: 26px;
  }

  .sex_text {
    width: 16px;
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 22px;
  }

  .phone_text {
    width: 32px;
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 22px;
  }

  .phone {
    width: 99px;
    height: 22px;
    font-size: 16px;
    margin-left: 51px;
    display: inline-block;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 22px;
  }

  .address {
    margin-top: 25px;
  }

  .address_text {
    width: 32px;
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 22px;
  }

  /*添加新地址的按钮*/
  .btn_address {
    width: 118px;
    height: 32px;
    margin-left: 51px;
    border-radius: 16px;
    background-color: white;
    border: 1px solid rgba(2, 103, 255, 1);
  }

  .btn_address span {
    width: 95px;
    height: 33px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(2, 103, 255, 1);
    line-height: 33px;
  }

  .goods {
    margin-left: 83px;
    margin-top: 20px;
  }

  /*收货人，手机号输入框的样式*/
  .goods input {
    width: 275px;
    height: 40px;
    padding-left: 14px;
    background: rgba(245, 245, 245, 1);
    border-radius: 4px;
    border: 1px solid rgba(220, 220, 220, 1);
  }

  /*默认地址按钮*/
  .default_address,.cancel_address{
    margin-left: 78px;
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(2, 103, 255, 1);
    line-height: 22px;
  }
 /* !*取消默认地址按钮*!
  .cancel_address{

  }*/
  /*删除地址按钮*/
  .del_address{
margin-left: 20px;
    height:22px;
    font-size:16px;
    font-weight:400;
    color:rgba(232,67,66,1);
    line-height:22px;
  }

  /*详细地址输入框*/
  .detalis_address {
    margin-top: 10px;
    margin-left: 83px;
    width: 570px;
    height: 40px;
    padding-left: 14px;
    background: rgba(245, 245, 245, 1);
    border-radius: 4px;
    border: 1px solid rgba(220, 220, 220, 1);
  }

  /*密码修改页面开始*/
  .header {
    margin-top: 4px;
    height: 32px;
    overflow: hidden;
  }

  .change_pwd,.change_info {
    width: 72px;
    height: 25px;
    margin-top: 3px;
    display: inline-block;
    font-size: 18px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 25px;
  }

  .pwd_save,.btn_changeinfo{
    width: 79px;
    height: 32px;
    background: rgba(24, 116, 253, 1);
    border-radius: 16px;
    float: right;
  }

  .pwd_save span {
    width: 32px;
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
  }

  .pwd span {
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 22px;
  }

  .pwd input {
    margin-top: 30px;
    width: 207px;
    height: 40px;
    padding-left: 10px;
    margin-left: 67px;
    background: rgba(245, 245, 245, 1);
    border-radius: 4px;
    border: 1px solid rgba(220, 220, 220, 1);
  }

  /*密码修改页面结束*/
  /*模态框*/
  .content {
    margin-top: 50px;
    overflow: hidden;
  }

  .content_left {
    width: 282px;
    float: left;
    margin-left: 103px;
    border: 1px solid #cccccc;
  }

  .cropper {
    width: 282px;
    height: 282px;
  }

  .content_right {
    float: left;
    margin-left: 66px;
    width: 112px;
    height: 112px;
    border-radius: 50%;
    background-color: red;
  }

  .preview {
    width: 112px;
    height: 112px;
    border-radius: 50%;
    border: 1px solid #ccc;
    overflow: hidden;
  }

  .content_r_text {
    margin-top: 120px;
    width: 112px;
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    text-align: center;
  }

  .vue-cropper {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    direction: ltr;
    touch-action: none;
    text-align: left;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCS…Jld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
  }

  .content_foot {
    margin-left: 122px;
    margin-top: 12px;
  }

  /*重新上传*/
  .btn {
    text-align: center;
    margin-right: 84px;
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
  }

  .operation-btn {
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 50%;
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    color: #333;
    padding: 0;
    margin: 0 10px;
  }

  /*模态框样式结束*/
</style>
