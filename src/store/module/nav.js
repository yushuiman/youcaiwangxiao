import Vue from 'vue'
export default {
  state: {
    is_change: 'shouye',
    is_show: true,
    clkTit: 'course' // 个人中心 左侧导航
  },
  mutations: {
    setChange (state, navName) {
      state.is_change = navName
    },
    setType (state, typeNum) {
      state.is_show = typeNum
    },
    centerType (state, type) {
      Vue.set(state, 'clkTit', type)
    }
  },
  actions: {

  }
}
