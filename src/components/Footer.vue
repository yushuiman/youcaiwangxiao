<template>
  <div>
    <!-- 尾部 -->
    <footer id="footer">
      <div class="footer-wrap">
        <div class="footer-top w-wrap">
          <img src="@/assets/images/global/yc-logo.png" alt="logo" class="yc-logo">
        </div>
        <div class="footer_center">
          <div class="w-wrap clearfix">
            <ul class="footer-instru">
              <li>
                <h1>新手指南</h1>
              </li>
              <li>
                <a href="javascript:void(0)">报考条件</a>
              </li>
              <li>
                <a href="javascript:void(0)">考试时间</a>
              </li>
              <li>
                <a href="javascript:void(0)">考试费用</a>
              </li>
              <li>
                <a href="javascript:void(0)">报考流程</a>
              </li>
            </ul>
            <ul class="footer-instru">
              <li>
                <h1>关于优财</h1>
              </li>
              <li>
                <a href="javascript:void(0)">关于我们</a>
              </li>
              <li>
                <a href="javascript:void(0)">联系我们</a>
              </li>
              <li>
                <a href="javascript:void(0)">师资招聘</a>
              </li>
            </ul>
            <ul class="footer-instru">
              <li>
                <h1>学习须知</h1>
              </li>
              <li>
                <a href="javascript:void(0)">支付方式</a>
              </li>
              <li>
                <a href="javascript:void(0)">发票制度</a>
              </li>
              <li>
                <a href="javascript:void(0)">课程下载</a>
              </li>
            </ul>
            <ul class="footer-instru">
              <li>
                <h1>支付方式</h1>
              </li>
              <li>
                <a href="javascript:void(0)">网上支付</a>
              </li>
              <li>
                <a href="javascript:void(0)">开通支付</a>
              </li>
              <li>
                <a href="javascript:void(0)">快捷支付</a>
              </li>
            </ul>
            <ul class="footer-instru">
              <li>
                <h1>售后服务</h1>
              </li>
              <li>
                <a href="javascript:void(0)">发票制度</a>
              </li>
              <li>
                <a href="javascript:void(0)">忘记密码</a>
              </li>
              <li>
                <a href="javascript:void(0)">退换课说明</a>
              </li>
              <li>
                <a href="javascript:void(0)">问题反馈</a>
              </li>
            </ul>
            <div class="erweima">
              <img src="@/assets/images/global/ewm-icon.png" alt="">
              <p>优财网校APP</p>
            </div>
          </div>
        </div>
        <div class="footer-bottom w-wrap">
          <p>客服电话：400-666-5318</p>
          <p>2014-2018 优财智业（北京）科技发展有限公司-美国注册管理会计师CMA认证培训CMA培训专家版权所有 京IPC备10036536号-6</p>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
export default {

}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../assets/scss/app";
  #footer {
    min-width: 1200px;
    height: 354px;
    background: #3B3B3B;
    .footer-wrap{
      padding: 0 110px;
    }
   }
   .footer-top {
     height: 93px;
     .yc-logo{
       width: 144px;
       height: 38px;
       margin-top: 29px;
     }
   }
   .footer_center {
     padding: 19px 0 16px 0;
     height: 204px;
     border-top: 2px solid $col666;
     border-bottom: 2px solid $col666;
     box-sizing: border-box;
   }
   .footer-instru {
     margin-left: 146px;
     float: left;
     &:first-child{
       margin-left: 0px;
     }
     li {
       line-height: 30px;
       h1 {
         font-size: 18px;
         color: #EFEFEF;
         margin-bottom: 18px;
       }
       a{
         color: $col999;
       }
     }
   }
   .erweima{
     float: right;
     text-align: center;
     img {
       width: 119px;
       height: 119px;
       margin-bottom: 14px;
     }
     p {
       color: $col999;
     }
   }
  .footer-bottom {
    height: 55px;
    @include display_flex(flex);
    @extend %justify-content;
    @extend %alignitem_center;
    p{
      color: $col999;
    }
  }
</style>
