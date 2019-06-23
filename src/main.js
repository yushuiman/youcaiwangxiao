import './assets/scss/common.css'
// import 'swiper/dist/css/swiper.css'
import 'element-ui/lib/theme-chalk/index.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import Iview from 'iview'
import ElementUI from 'element-ui'
import VueAwesomeSwiper from 'vue-awesome-swiper' // swiper
import 'iview/dist/styles/iview.css'
Vue.config.productionTip = false

Vue.use(Iview)
Vue.use(ElementUI)
Vue.use(VueAwesomeSwiper)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
Vue.prototype.$Message = ElementUI.Message
Vue.prototype.$Notice = Iview.Notice
