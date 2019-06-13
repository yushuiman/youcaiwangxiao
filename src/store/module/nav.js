export default {
  state: {
    is_change: 'shouye',
    is_show: true
  },
  mutations: {
    setChange (state, navName) {
      state.is_change = navName
    },
    setType (state, typeNum) {
      state.is_show = typeNum
    }
  },
  actions: {

  }
}
