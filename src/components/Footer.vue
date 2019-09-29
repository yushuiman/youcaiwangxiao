<template>
  <div>
    <!-- 尾部 -->
    <footer id="footer" v-if="$route.meta.showFooter">
      <div class="footer-wrap">
        <div class="footer-top w-wrap">
          <img src="@/assets/images/global/yc-logo-gray.png" alt="logo" class="yc-logo">
        </div>
        <div class="footer_center">
          <div class="w-wrap clearfix">
            <ul class="footer-instru">
              <li>
                <h1>新手指南</h1>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=5&footer_name=报考条件" target="_blank">报考条件</a>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=2&footer_name=考试时间" target="_blank">考试时间</a>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=3&footer_name=考试费用" target="_blank">考试费用</a>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=4&footer_name=报考流程" target="_blank">报考流程</a>
              </li>
            </ul>
            <ul class="footer-instru">
              <li>
                <h1>关于优财</h1>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=5&footer_name=关于我们" target="_blank">关于我们</a>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=6&footer_name=联系我们" target="_blank">联系我们</a>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=7&footer_name=师资招聘" target="_blank">师资招聘</a>
              </li>
            </ul>
            <ul class="footer-instru">
              <li>
                <h1>学习须知</h1>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=8&footer_name=支付方式" target="_blank">支付方式</a>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=9&footer_name=发票制度" target="_blank">发票制度</a>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=10&footer_name=课程下载" target="_blank">课程下载</a>
              </li>
            </ul>
            <ul class="footer-instru">
              <li>
                <h1>支付方式</h1>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=1&footer_name=报考条件" target="_blank">网上支付</a>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=1&footer_name=报考条件" target="_blank">开通支付</a>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=1&footer_name=报考条件" target="_blank">快捷支付</a>
              </li>
            </ul>
            <ul class="footer-instru">
              <li>
                <h1>售后服务</h1>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=1&footer_name=报考条件" target="_blank">发票制度</a>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=1&footer_name=报考条件" target="_blank">忘记密码</a>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=1&footer_name=报考条件" target="_blank">退换课说明</a>
              </li>
              <li>
                <a href="http://www.youcaiwx.com/html/help_center.html?id=1&footer_name=报考条件" target="_blank">问题反馈</a>
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
          <p>2014-{{curYear}} 优财智业（北京）科技发展有限公司-美国注册管理会计师CMA认证培训CMA培训专家版权所有 京IPC备10036536号-6</p>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
export default {
  data () {
    return {
      curYear: '2019'
    }
  },
  mounted () {
    var myDate = new Date()
    this.curYear = myDate.getFullYear()
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../assets/scss/app";
  #footer {
    height: 354px;
    background: #3B3B3B;
    .footer-wrap{
      padding: 0 3%;
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
