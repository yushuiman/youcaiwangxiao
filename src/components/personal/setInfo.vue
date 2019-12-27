<template>
  <div class="u-user-wrap">
    <ul class="tab-list">
      <li class="tab-item" v-for="(v, index) in txtArr" :class="{'active': selIdx == index}" :key="index"
          @click="tabClk(v, index)">{{v}}
      </li>
    </ul>
    <div class="all-main">
      <div v-if="selIdx == 0">
        <!--个人信息页面展示-->
        <div v-if="!changeSetFlag">
          <!--修改页面头部-->
          <div class="header">
            <span class="change_info">基本信息</span>
            <button @click="btnChangeinfo('baseinfo')" class="pwd_save"><span>修改</span></button>
          </div>
          <!--昵称-->
          <div class="info_msg">
            <span>昵称</span>
            <span class="info_nickname">{{userInfo.username}}</span>
          </div>
          <!--性别-->
          <div class="info_msg">
            <span>性别</span>
            <span class="info_sex" v-if="userInfo.sex == 1">男</span>
            <span class="info_sex" v-if="userInfo.sex == 2">女</span>
            <span class="info_sex" v-if="userInfo.sex == 0">未填写</span>
          </div>
          <!--手机-->
          <div class="info_msg">
            <span>手机</span>
            <span class="info_phone">{{personalInfo.mobile}}</span>
          </div>
          <!--地址列表-->
          <div class="info_msg">
            <span>地址</span>
            <ul class="address-list" v-if="personalInfo.address && personalInfo.address.length">
              <li class="addres-item" v-for="(v, index) in personalInfo.address" :key="index">
                <p class="info_address"><span>{{v.consignee}}</span><span>{{v.telephone}}</span><span>{{v.address}}</span></p>
                <button class="btn_default" v-if="v.is_default == 1">默认</button>
              </li>
            </ul>
            <button v-else class="btn_address" @click="btnChangeinfo('address')">+ 添加新地址</button>
          </div>
        </div>
        <!--个人信息修改-->
       <div v-if="changeSetFlag">
         <!--头像-->
         <div style="position:relative;">
           <img class="avatar" :src="userInfo.head" alt="">
           <span class="change_avatar">修改头像</span>
           <Upload ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :on-error="onError"
              :on-format-error="onFormateError"
              :on-exceeded-size="onExceededSize"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              type="drag"
              :action="apiPath"
              name="image"
              class="set-head-iview">
          </Upload>
         </div>
         <!--保存按钮-->
         <button class="btn_save" @click="saveBaseInfo">保存</button>
         <!--基本信息-->
         <div class="basic">
           <h3 class="basic_info">基本信息</h3>
           <!--昵称-->
           <div class="nickname">
             <span class="nickname_text">昵称</span>
             <input type="text" v-model="userInfo.username" class="nickname_name">
           </div>
           <!--性别-->
           <div style="margin-top: 20px">
             <span class="sex">性别</span>
             <RadioGroup v-model="userInfo.sex" @on-change="onChangeSex">
               <Radio label="1" class="sex_male">
                 <span class="sex_text">男</span>
               </Radio>
               <Radio label="2" class="sex_female">
                 <span class="sex_text">女</span>
               </Radio>
             </RadioGroup>
           </div>
           <!--手机号-->
           <div style="margin-top: 30px">
             <span class="phone_text">手机</span>
             <span style="margin-left: 51px">{{personalInfo.mobile}}</span>
           </div>
           <!--添加新地址按钮-->
           <div class="address">
             <span class="address_text">地址</span>
             <button class="btn_address" @click="addNewAddres">+ 添加新地址</button>
           </div>
           <!--收货人，手机号输入框-->
           <div v-if="addAddresFlag" style="margin-bottom: 40px">
             <div class="goods">
               <input type="text" placeholder="收货人" v-model="addName">
               <input style="margin-left: 20px" type="text" maxlength="11" v-model="addMobile" placeholder="手机号码">
               <span class="default_address" style="margin-left: 20px" @click="saveNewAddres(1)">保存地址</span>
             </div>
             <!--详细地址输入框-->
             <div>
               <input class="detalis_address" type="text" maxlength="100" v-model="addAddres" placeholder="详细地址：省市区、道路、门牌号、小区、楼栋号、单元室等">
             </div>
           </div>
           <!--原有收获地址-->
           <div v-if="personalInfo.address && personalInfo.address.length">
             <div v-for="(v, index) in personalInfo.address" :key="index" :ref="'inputDisabled' + index" :id="'inputDisabled' + index">
               <div class="goods edixBtn">
                <span class="g-input">{{v.consignee}}</span>
                <span class="g-input" style="margin-left: 20px">{{v.telephone}}</span>
                <span class="default_address" @click="setDefaultAddress(v)">{{v.value}}</span>
                <span class="del_address" @click="delAddres(v, index)">删除地址</span>
                <span class="edit_address" @click="saveNewAddres(2, v)">修改</span>
              </div>
              <div>
                <input class="detalis_address" v-model="v.address" disabled>
              </div>
             </div>
           </div>
           <Modal
            title="编辑收货人信息"
            v-model="visibleAddress"
            footer-hide
            :width="795"
            class="iview-modal">
            <div class="edit-wrap">
              <div class="goods">
               <input type="text" placeholder="收货人" v-model="addName">
               <input style="margin-left: 20px" type="text" maxlength="11" v-model="addMobile" placeholder="手机号码">
              </div>
              <div>
                <input class="detalis_address" type="text" maxlength="100" v-model="addAddres" placeholder="详细地址：省市区、道路、门牌号、小区、楼栋号、单元室等">
              </div>
              <button class="btn-com btn-edit" @click="editAddress()">修改</button>
            </div>
          </Modal>
         </div>
       </div>
      </div>
      <!--修改密码页面-->
      <div v-if="selIdx == 1">
        <!--修改页面头部-->
        <div class="header">
          <span class="change_pwd">修改密码</span>
          <button @click="pwdsave" class="pwd_save"><span>保存</span></button>
        </div>
        <!--原密码-->
        <div class="pwd old_pwd">
          <span>原密码</span>
          <input v-model="oldpwd" type="password" placeholder="请输入原密码">
        </div>
        <!--新密码-->
        <div class="pwd new_pwd">
          <span>新密码</span>
          <input v-model="newpwd" type="password" placeholder="请输入新密码">
        </div>
        <!--确认密码-->
        <div class="pwd confirm_pwd">
          <span>确认密码</span>
          <input v-model="confimpwd" style="margin-left: 51px" type="password" placeholder="请再次输入新密码">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { savePersonal, defaultAddress, delAddress, addAddress, editAddress, resetPaw } from '@/api/personal'
import { mapActions } from 'vuex'
import config from '@/config'
export default {
  props: {
    personalInfo: {
      type: Object
    },
    user_id: {
      type: Number
    }
  },
  data () {
    return {
      txtArr: ['个人信息修改', '密码修改'],
      selIdx: this.$route.query.selIdx || 0,
      userInfo: JSON.parse(window.sessionStorage.getItem('personalInfo')), // 用户信息
      addName: '',
      addAddres: '',
      addMobile: '',
      address_id: '',
      is_default: 2,
      visibleAddress: false, // 修改地址
      oldpwd: '', // 原密码
      newpwd: '', // 新密码
      confimpwd: '', // 确认密码
      changeSetFlag: false, // 修改展示div
      addAddresFlag: false, // 添加收货地址
      apiPath: '/upload/Index/uploadImage'
    }
  },
  mounted () {
    if (process.env.NODE_ENV === 'production') {
      this.apiPath = config.baseUrl.pro + '/upload/Index/uploadImage'
    }
  },

  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleSuccess (res, file) {
      // this.option.img = res.data.image_url // 暂时不做裁剪功能
      this.userInfo.head = res.data.image_url
    },
    onError (eror, file, fileList) {
      this.$Message.error('上传失败')
    },
    onFormateError (file, fileList) {
      this.$Message.error('文件格式错误')
    },
    onExceededSize (file, fileList) {
      this.$Message.error('最大上传2M')
    },
    // tab
    tabClk (v, index) {
      this.selIdx = index
      this.$router.replace({ path: '/personal',
        query: {
          ...this.$route.query,
          selIdx: index
        }
      })
    },
    // 修改div展示
    btnChangeinfo (type) {
      this.changeSetFlag = true
      if (type === 'address') {
        this.addAddresFlag = true
      }
      this.userInfo.sex = this.userInfo.sex + ''
    },
    // 添加收货地址div
    addNewAddres () {
      if (this.personalInfo.address.length === 5) {
        this.$Message.error('最多可创建5个收货地址')
        return
      }
      this.addAddresFlag = !this.addAddresFlag
    },
    // 添加新地址
    checkForm () {
      // 新增收货地址name
      if (this.addName === '') {
        this.$Message.error('请输入昵称')
        return false
      }
      if (/^\s+$/gi.test(this.addName) || this.addName.trim() === '') {
        this.$Message.error('不能全为空格')
        return false
      }
      if (this.addName.length > 20) {
        this.$Message.error('昵称最多20个字符')
        return false
      }
      // 新增收货地址mobile
      if (this.addMobile === '') {
        this.$Message.error('请输入手机号')
        return false
      }
      const reg = /^[1]([3-9])[0-9]{9}$/
      if (!(reg.test(this.addMobile))) {
        this.$Message.error('该手机号不符合格式')
        return false
      }
      if (this.addAddres === '') {
        this.$Message.error('请输入地址')
        return false
      }
      this.addAddresFlag = false
      this.visibleAddress = false
      return true
    },
    // 保存地址
    saveNewAddres (type, v) {
      if (type === 1) {
        if (!this.checkForm()) {
          return
        }
        addAddress({
          user_id: this.user_id,
          consignee: this.addName,
          telephone: this.addMobile,
          address: this.addAddres,
          is_default: 2 // 新增地址为2 修改地址取已有状态
        }).then(data => {
          const res = data.data
          if (res.code === 200) {
            this.addName = ''
            this.addMobile = ''
            this.addAddres = ''
            this.$emit('getPersonalInfo')
          }
        })
      }
      if (type === 2) {
        this.visibleAddress = true
        this.address_id = v.address_id
        this.addName = v.consignee
        this.addAddres = v.address
        this.addMobile = v.telephone
        this.is_default = v.is_default
      }
    },
    // 修改收货地址
    editAddress () {
      if (!this.checkForm()) {
        return
      }
      editAddress({
        user_id: this.user_id,
        address_id: this.address_id,
        consignee: this.addName,
        telephone: this.addMobile,
        address: this.addAddres,
        is_default: this.is_default
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.$emit('getPersonalInfo')
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 设置默认地址
    setDefaultAddress (v, type) {
      if (v.is_default === 1) {
        this.personalInfo.address.forEach(v => {
          v.value = '设置默认地址'
          v.is_default = 2
        })
        this.$forceUpdate()
      } else {
        this.personalInfo.address.forEach(v => {
          v.value = '设置默认地址'
          v.is_default = 2
        })
        v.is_default = 1
        v.value = '取消默认地址'
        this.$forceUpdate()
      }
      // this.changeSetFlag = false
      defaultAddress({
        user_id: this.user_id,
        address_id: v.address_id,
        is_default: v.is_default
      }).then(data => {
      })
    },
    // 删除收货地址
    delAddres (v, index) {
      delAddress({
        user_id: this.user_id,
        address_id: v.address_id
      }).then(data => {
        this.personalInfo.address.splice(index, 1)
        // const res = data.data
        // if (res.code === 200) {
        //   this.$emit('getPersonalInfo')
        // }
      })
    },
    // 男女
    onChangeSex (label) {
      this.userInfo.sex = label
    },
    // 修改基本信息
    saveBaseInfo () {
      // 昵称
      if (this.userInfo.username === '') {
        this.$Message.error('请输入昵称')
        return false
      }
      if (/^\s+$/gi.test(this.userInfo.username) || this.userInfo.username.trim() === '') {
        this.$Message.error('不能全为空格')
        return false
      }
      if (this.userInfo.username.length > 20) {
        this.$Message.error('昵称最多20个字符')
        return false
      }
      let { head, username, sex } = this.userInfo
      this.changeSetFlag = false // 修改div
      this.addAddresFlag = false // 添加地址div
      savePersonal({
        user_id: this.user_id,
        head: head,
        username: username,
        sex: sex
      }).then(data => {
        const res = data.data
        if (res.code === 200) {
          this.$emit('getPersonalInfo')
        } else {
          this.$Message.error(res.msg)
        }
      })
    },

    /* 修改密码保存提交 */
    pwdsave () {
      if (this.oldpwd === '') {
        this.$Message.error('原密码不能为空')
        return false
      }
      if (this.newpwd === '') {
        this.$Message.error('新密码不能为空')
        return false
      }
      if (this.confimpwd === '') {
        this.$Message.error('确认密码不能为空')
        return false
      }
      if (this.oldpwd.length < 6 || this.newpwd.length < 6 || this.confimpwd.length < 6) {
        this.$Message.error('密码长度不能小于6位')
        return false
      }
      if (this.newpwd !== this.confimpwd) {
        this.$Message.error('新密码与确认密码不一致')
        return false
      }
      resetPaw({
        user_id: this.user_id,
        password: this.oldpwd,
        pwd: this.newpwd,
        repwd: this.confimpwd
      }).then(data => {
        const res = data.data
        if (res.code === 405) {
          this.$Message.error('原密码错误')
        }
        if (res.code === 200) {
          if (res.data.state === 1) {
            this.handleLogOut()
            this.$Message.success('密码修改成功')
            this.$router.push('/')
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
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
    display: flex;
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
    .info_nickname,.info_phone,.info_sex,.address-list{
      margin-left: 50px;
    }
    .address-list{
      flex: 1;
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
  .address-list{
    .address-item{
      margin-bottom: 14px;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
  /*个人信息页面展示结束*/
  .avatar {
    width: 92px;
    height: 92px;
    display: block;
    margin: 0 auto;
    border-radius: 50%;
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
    margin-top: 20px;
  }

  .nickname_text {
    width: 32px;
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    display: inline-block;
    color: rgba(153, 153, 153, 1);
    line-height: 22px;
  }

  .nickname_name, .phone {
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
    font-size: 16px;
    font-weight: 500;
    border-radius: 16px;
    color: rgba(2, 103, 255, 1);
    border: 1px solid rgba(2, 103, 255, 1);
  }

  .goods {
    margin-left: 83px;
    margin-top: 20px;
  }

  /*收货人，手机号输入框的样式*/
  .goods input, .goods .g-input {
    display: inline-block;
    width: 275px;
    height: 40px;
    padding-left: 14px;
    background: rgba(245, 245, 245, 1);
    border-radius: 4px;
    border: 1px solid rgba(220, 220, 220, 1);
  }
  .goods .g-input {
    line-height: 40px;
  }
  .edixBtn{
    .default_address,.del_address,.edit_address{
      margin-left: 22px;
      cursor: pointer;
    }
  }

  /*默认地址按钮*/
  .default_address,.cancel_address{
    // margin-left: 78px;
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(2, 103, 255, 1);
    line-height: 22px;
    cursor: pointer;
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
    cursor: pointer;
  }

  /*详细地址输入框*/
  .detalis_address {
    display: inline-block;
    margin-top: 10px;
    margin-left: 83px;
    width: 570px;
    height: 40px;
    line-height: 40px;
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
    text-align: center;
  }

  .preview {
    width: 112px;
    height: 112px;
    border-radius: 50%;
    border: 4px solid #ffffff;
    box-sizing: border-box;
    overflow: hidden;
  }

  .content_r_text {
    line-height: 22px;
    font-size: 16px;
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

  // 修改地址modal
  .edit-wrap{
    padding-bottom: 20px;
  }
  .btn-edit{
    width: 122px;
    height: 36px;
    background: $blueColor;
    color: #ffffff;
    margin: 0 auto;
    margin-top: 20px;
    display: block;
  }
  .set-head-iview{
    position: absolute;
    width: 112px;
    height: 112px;
    top: 50%;
    left: 50%;
    margin-left: -56px;
    margin-top: -56px;
  }
</style>
