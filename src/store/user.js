// import Vue from 'vue'
// import axios from 'axios'
import { Message } from 'element-ui'
import { setToken } from '@/plugins/utils'

export const state = () => ({
  token: '',
  username: '',
  userId: '',
  head: '',
  mobile: ''
})

export const mutations = {
  setToken (state, token) {
    state.token = token
    setToken(token)
  },
  setUsername (state, username) {
    state.username = username
  },
  setMobile (state, mobile) {
    state.mobile = mobile
  },
  setUserid (state, userId) {
    state.userId = userId
  },
  setHead (state, head) {
    state.head = head
  }
}
export const actions = {
  // 登录
  handleLogin ({ commit }, { mobile, password }) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/web/Login/accountLogin', { mobile, password }).then(res => {
        const data = res.data
        if (data.code === 200) {
          commit('setToken', data.data.token)
          Message.success('登录成功!')
          resolve()
        } else if (data.code === 403) {
          Message.error('账号已被冻结，请联系管理员!')
        } else {
          Message.error('账号或密码错误！')
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 退出登录
  dropOut ({ state, commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/web/Login/outLogin').then(res => {
        const data = res.data
        if (data.code === 200) {
          commit('setMobile', '')
          commit('setUsername', '')
          commit('setUserid', '')
          commit('setHead', '')
          commit('setToken', '')
          resolve(200)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取用户相关信息
  getUserInfo ({ state, commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/web/Login/getUserInfo').then(res => {
        const data = res.data
        if (data.code === 200) {
          commit('setMobile', data.data.mobile)
          commit('setUsername', data.data.username)
          commit('setUserid', data.data.id)
          commit('setHead', data.data.head)
          commit('setToken', data.data.token)
          resolve(state)
        } else {
          commit('setMobile', '')
          commit('setUsername', '')
          commit('setUserid', '')
          commit('setHead', '')
          commit('setToken', '')
          resolve(state)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
}
