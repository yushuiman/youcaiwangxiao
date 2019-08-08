// 导入cookie
import Cookies from 'js-cookie'
import config from '@/config'
export const TOKEN_KEY = 'token'
// 设置token
export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: config.cookieExpires || 1 })
  if (!token || token === '') {
    localStorage.removeItem('routersConfig')
  }
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const removeToken = () => {
  return Cookies.remove(TOKEN_KEY)
}

// 获取服务端token
export const getcookiesInServer = function (req) {
  let serviceCookie = {}
  req && req.headers.cookie && req.headers.cookie.split(';').forEach(function (val) {
    let parts = val.split('=')
    serviceCookie[parts[0].trim()] = (parts[1] || '').trim()
  })
  return serviceCookie
}

// 获取客户端token
export const getcookiesInClient = function (token) {
  return Cookies.get(token) ? Cookies.get(token) : ''
}

// 获取验证码 传加密手机号
export const getCode = (mobile) => {

}
// 截取url 里面token的值
export const getQueryString = name => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let params = window.location.search.substr(1) || window.location.href.split('?')[1]
  let r = params && params.match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

// 清除登录信息， store状态重置
// export const clearLoginInfo = () => {
//   removeToken() // cookie token
//   store.commit('setToken', '')
//   store.commit('setAvator', '')
//   store.commit('setUserId', '')
//   store.commit('setUserName', '')
//   this.$route.push('/login')
// }
