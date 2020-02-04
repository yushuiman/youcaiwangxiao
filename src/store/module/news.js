import {
  indexMessage
} from '@/api/message'
export default {
  state: {
    is_news: 0 // 是否有新消息
  },
  mutations: {
    setIsNews (state, type) {
      state.is_news = type
    }
  },
  actions: {
    // 是否有新信息
    getIndexMessage ({
      commit
    }) {
      return new Promise((resolve, reject) => {
        indexMessage({
          user_id: this.state.user.user_id
        }).then(data => {
          const res = data.data
          if (res.code === 200) {
            commit('setIsNews', res.data)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
