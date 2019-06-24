import { accountLogin, outLogin, getUserInfo } from '@/api/login'

import { setToken, getToken } from '@/libs/utils'

import { Message } from 'element-ui'

export default {
  state: {
    userName: '',
    userId: '',
    groupId: '',
    avatorImgPath: '',
    token: getToken(),
    access: ''
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setGroupId (state, id) {
      state.groupId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
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
          } else if (data.code === 406) {
            console.log(Message)
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
          commit('setToken', '')
          commit('setAccess', [])
          commit('setRoutersConfig', { newRouters: [], routersData: [] }) // 变为静态路由
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          const data = res.data
          commit('setAvator', data.data.head)
          commit('setUserName', data.data.username)
          commit('setUserId', data.data.id)
          commit('setGroupId', data.data.group_id)
          resolve(data.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
