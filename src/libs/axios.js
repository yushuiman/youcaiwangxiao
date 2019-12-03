import axios from 'axios'
import store from '../store/'
import router from '../router/'

import {
// getToken
// clearLoginInfo
} from '@/libs/utils'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// import { Spin } from 'iview'
class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'token': store.state.user.token
        // 'token': getToken()
      }
    }
    return config
  }
  distroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.distroy(url)
      const { data, code } = res
      if (res.data.code === 401) {
        res.data.msg = '用户信息已过期，请登录~'
      }
      if (res.data.code === 401 || res.data.code === 403 || res.data.code === 406) {
        window.localStorage.removeItem('YCWXTOKEN')
        store.commit('setToken', '')
        store.commit('setAvator', '')
        store.commit('setUserId', '')
        store.commit('setUserName', '')
        store.commit('isLoad', false)
        router.replace({
          path: 'login',
          query: {
            ...router.currentRoute.query
          }
        })
      }
      return {
        data,
        code
      }
    }, error => {
      this.distroy(url)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
