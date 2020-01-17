import 'babel-polyfill'
// import 'swiper/dist/css/swiper.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'iview/dist/styles/iview.css'
import './assets/scss/ivu-menu.css'
import './assets/scss/modal.css'
import './assets/scss/common.css'
// import 'animate.css'
// import 'vue-fullpage/vue-fullpage.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import Iview from 'iview'
import ElementUI from 'element-ui'
import loading from './libs/loadingPlugin'
// import vueAwesomeSwiper from 'vue-awesome-swiper'
// import 'fullpage.js/vendors/scrolloverflow'
// import VueFullPage from 'vue-fullpage'

// Vue.use(VueFullPage)
Vue.use(Iview)
Vue.use(ElementUI)
Vue.use(loading)
// Vue.use(vueAwesomeSwiper)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
Vue.prototype.$Message = ElementUI.Message
Vue.prototype.$Notice = Iview.Notice
Vue.config.productionTip = false
