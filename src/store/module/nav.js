export default {
  state: {
    is_show: true,
    clkTit: 'course' // 个人中心 左侧导航
  },
  mutations: {
    setType (state, typeNum) {
      state.is_show = typeNum
    }
  },
  actions: {

  }
}
