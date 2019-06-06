import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import './assets/scss/common.css'
import Iview from 'iview'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false

Vue.use(Iview)
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
