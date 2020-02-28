import Vue from 'vue'
import 'babel-polyfill'
// import 'swiper/dist/css/swiper.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'iview/dist/styles/iview.css'
import './assets/scss/ivu-menu.css'
import './assets/scss/modal.css'
import './assets/scss/common.css'
// import 'animate.css'
// import 'vue-fullpage/vue-fullpage.css'

import App from './App.vue'
import router from './router/'
import store from './store/'
import Iview from 'iview'
import ElementUI from 'element-ui'
// import VueSocketIO from 'vue-socket.io'
import loading from './libs/loadingPlugin'
// import VueFullPage from 'vue-fullpage'
// import vueAwesomeSwiper from 'vue-awesome-swiper'
// import 'fullpage.js/vendors/scrollovergflow'
// import '../node_modules/fullpage.js/vendors/scrolloverflow'
// import io from 'socket.io-client'

Vue.use(Iview)
Vue.use(ElementUI)
// Vue.prototype.$io = io
// Vue.use(
//   new VueSocketIO({
//     debug: true,
//     connection: 'https://dest.youcaiwx.cn',
//     vuex: {}
//   })
// )
Vue.use(loading)
// Vue.use(VueFullPage)
// Vue.use(vueAwesomeSwiper)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
Vue.prototype.$Message = ElementUI.Message
Vue.prototype.$Notice = Iview.Notice
Vue.config.productionTip = false
