import { accountLogin, outLogin, getUserInfo } from '@/api/login'

import {
  setToken,
  getToken,
  removeToken
} from '@/libs/utils'
// import Cookies from 'js-cookie'
// import config from '@/config'
import { Message } from 'element-ui'
export default {
  state: {
    userName: '',
    user_id: '',
    avatorImgPath: '',
    token: getToken()
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.user_id = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { mobile, password }) {
      return new Promise((resolve, reject) => {
        accountLogin({
          mobile,
          password
        }).then(res => {
          const data = res.data
          if (data.code === 200) {
            commit('setToken', data.data.token)
            Message.success('登录成功!')
            resolve(data.data)
          } else if (data.code === 403) {
            Message.error('账号已被冻结，请联系管理员!')
          } else {
            Message.error(data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        outLogin().then(() => {
          removeToken() // cookie token
          commit('setToken', '')
          commit('setAvator', '')
          commit('setUserId', '')
          commit('setUserName', '')
          resolve()
          this.$route.push('/')
          window.location.reload()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          const data = res.data
          if (data.code === 200) {
            commit('setAvator', data.data.head)
            commit('setUserName', data.data.username)
            commit('setUserId', data.data.id)
          } else {
            Message.error(data.msg)
          }
          // Cookies.set('user_id', data.data.id, {
          //   expires: config.cookieExpires || 1
          // })
          resolve(data.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
