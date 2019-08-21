export default {
  state: {
    is_change: 'shouye',
    is_show: true,
    clkTit: 'course', // 个人中心 左侧导航
    is_news: 0 // 是否有新消息
  },
  mutations: {
    setChange (state, navName) {
      state.is_change = navName
    },
    setType (state, typeNum) {
      state.is_show = typeNum
    },
    setIsNews (state, type) {
      state.is_news = type
    }
  },
  actions: {

  }
}
