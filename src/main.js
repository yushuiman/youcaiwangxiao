import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import init from '@/components/common/init.vue'
import './assets/scss/common.css'
import Iview from 'iview'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueAliplayer from 'vue-aliplayer'
Vue.config.productionTip = false

Vue.use(Iview)
Vue.use(ElementUI)
Vue.use(VueAliplayer)
new Vue({
  router,
  store,
  // ...init,
  render: h => h(App)
}).$mount('#app')
Vue.prototype.$Message = ElementUI.Message
