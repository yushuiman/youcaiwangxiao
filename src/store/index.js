import Vue from 'vue'
import Vuex from 'vuex'
import user from './module/user'
import nav from './module/nav'
import news from './module/news'
import loading from './module/loading'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // contons: '0'
  },
  mutations: {
    // putCont (state, html) {
    //   state.contons = html
    // }
  },
  actions: {

  },
  modules: {
    user,
    nav,
    news,
    loading
  }
})
