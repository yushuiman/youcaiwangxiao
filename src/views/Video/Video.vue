<template>
  <div class="video-wrap">
    <div class="video-header">
      <router-link :to="{ name: '/'}">返回</router-link>
      <span>内容财务报表分析 1-1（3）现金流量表（1）</span>
      <div class="login-r fr">
        <img src="../../assets/images/global/email-icon.png" alt="email" class="email-icon">
        <img src="../../assets/images/global/head-logo-moren.png" alt="头像" class="head-logo">
      </div>
    </div>
    <div class="video-main clearfix">
      <div class="video-info-l fl">
        <ul class="vinfo-ul">
          <li class="vinfo-item vinfo-item-kc">
            <div class="vi-kecheng">
              <i class="kcqh-icon"></i>
              <p class="txt">课程<br />切换</p>
            </div>
          </li>
          <li class="vinfo-item">
            <div class="vi-kecheng">
              <i class="answer-icon"></i>
              <p class="txt">答疑</p>
            </div>
          </li>
          <li class="vinfo-item">
            <div class="vi-kecheng">
              <i class="jiangyi-icon"></i>
              <p class="txt">讲义</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="video-info-c fl">
        视屏
      </div>
      <div class="video-info-r fr">
        <h1 class="vc-title">章节目录</h1>
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              background-color="#1D1F21"
              text-color="#E6E6E6"
              active-text-color="#F99111">
              <el-submenu index="1">
                <template slot="title">
                  <span>导航一</span>
                </template>
                <el-menu-item index="1-1">
                  <i class="el-video-icon"></i>
                  <span>P1期中测试-2018年11月-艾瑞</span>
                  <i class="el-dot-icon"></i>
                </el-menu-item>
                <el-menu-item index="1-2">
                  <i class="el-video-icon"></i>
                  <span>2019年4月考期P1成本管理1</span>
                  <i class="el-dot-icon el-dot-now"></i>
                </el-menu-item>
                <el-menu-item index="1-3">
                  <i class="el-video-icon play-icon"></i>
                  <span>2019年4月考期 规划、预算编制与预测</span>
                  <i class="el-dot-icon el-dot-see"></i>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <span>导航二</span>
                </template>
                <el-menu-item index="1-1">
                  <i class="el-video-icon"></i>
                  <span>P1期中测试-2018年11月-艾瑞</span>
                  <i class="el-dot-icon"></i>
                </el-menu-item>
                <el-menu-item index="1-2">
                  <i class="el-video-icon"></i>
                  <span>2019年4月考期P1成本管理1</span>
                  <i class="el-dot-icon el-dot-now"></i>
                </el-menu-item>
                <el-menu-item index="1-3">
                  <i class="el-video-icon play-icon"></i>
                  <span>2019年4月考期 规划、预算编制与预测</span>
                  <i class="el-dot-icon el-dot-see"></i>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
        <!-- 课程 答疑 讲义 -->
        <div class="three-main">
          <div class="video-course-wrap">
            <h1 class="vc-title">章节目录</h1>
            <div class="vc-list" v-for="(item, index) in courseList" :key="index">
              <img :src="item.pc_img" alt="">
              <div class="c-info">
                <h2>{{item.name}}</h2>
                <p>讲师: {{item.teacher_name}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      courseList: [
        {
          pc_img: '23232323',
          name: '史蒂夫可视电话反馈收到回复',
          teacher_name: '1wefwefefs'
        },
        {
          pc_img: '23232323',
          name: '说的话说的三闾大夫',
          teacher_name: '2wefwefefs'
        },
        {
          pc_img: '23232323',
          name: '23ewe3',
          teacher_name: '3wefwefefs'
        }
      ]
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/app";
  .video-header{
    @include lh(70, 70);
    padding: 0 31px;
    background: $colfff;
    span{
      font-size: 16px;
      margin-left: 17px;
      font-weight:500;
    }
  }
  .login-r{
    img{
      vertical-align: middle;
      &.email-icon{
        @include wh(18, 14);
        margin: 0 31px;
      }
      &.head-logo{
        @include wh(30, 30);
      }
    }
  }
  .video-main{
    background:rgba(29,31,33,1);
    display: flex;
    justify-content: space-between;
    position: relative;
    .video-info-l{
      width: 60px;
    }
    .video-info-c{
      flex: 1;
      height:849px;
      background:rgba(0,0,0,1);
      border-radius:10px;
    }
    .video-info-r{
      width: 495px;
      height: 890px;
    }
  }
  .vinfo-ul{
    padding-top: 156px;
  }
  .vinfo-item{
    padding: 30px 0;
    text-align: center;
  }
  .vinfo-item-kc:hover{
    .vinfo-kecheng-main{
      display: none;
    }
  }
  .vi-kecheng{
    i{
      display: inline-block;
      @extend %bg-img;
      background-size: contain;
      &.kcqh-icon{
        @include wh(22, 18);
        background-image: url('../../assets/images/video/class-icon.png');
      }
      &.answer-icon{
        @include wh(26, 24);
        background-image: url('../../assets/images/video/answer-icon.png');
      }
      &.jiangyi-icon{
        @include wh(26, 25);
        background-image: url('../../assets/images/video/jiangyi-icon.png');
      }
    }
    .txt{
      color: $col999;
      line-height: 18px;
      margin-top: 5px;
    }
  }

  .vc-title{
    padding: 30px 20px;
    font-size: 20px;
    color: #E6E6E6;
  }
  .el-video-icon{
    @include wh(14, 14);
    display: inline-block;
    margin-right: 10px;
    margin-top: -3px;
    vertical-align: middle;
    @extend %bg-img;
    background-image: url('../../assets/images/video/stop-icon.png');
    &.play-icon{
      background-image: url('../../assets/images/video/play-icon.png');
    }
  }
  .el-menu-item{
    padding-left: 35px!important;
    padding-right: 22px!important;
  }
  .el-dot-icon{
    @include wh(10, 10);
    display: inline-block;
    border-radius: 100%;
    margin-top: 20px;
    border:2px solid rgba(102,102,102,1);
    box-sizing: border-box;
    float: right;
    &.el-dot-see{
      border: 0;
      background: rgba(249,145,17,1);
    }
    &.el-dot-now{
      border: 0;
      border:2px solid rgba(249,145,17,1);
    }
  }
  // 目录 答疑 讲义
  .video-course-wrap{
    position: absolute;
    top: 0;
    left: 60px;
    width: 386px;
    height: 849px;
    background: #26292C;
    z-index: 10;
  }
  .vc-list{
    padding-bottom: 30px;
    padding-left: 30px;
    display: flex;
    align-items: center;
    img{
      @include wh(87, 48);
      margin-right: 20px;
      border-radius: 4px;
    }
    .c-info{
      h2{
        font-size: 16px;
        color: #E6E6E6;
      }
      p{
        font-size: 12px;
        color: $col999;
        margin-top: 8px;
      }
    }
  }
</style>
