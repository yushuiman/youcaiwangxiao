// 导入cookie
import Cookies from 'js-cookie'
// import config from '@/config'
// 设置token
export const setToken = (token) => {
  window.sessionStorage.setItem('ycwxToken', token)
  // Cookies.set('ycwxToken', token, {
  //   expires: config.cookieExpires || 1
  // })
  if (!token || token === '') {
    localStorage.removeItem('routersConfig')
  }
}

export const getToken = () => {
  const token = Cookies.get('ycwxToken')
  if (token) return token
  else return false
}

export const removeToken = () => {
  window.sessionStorage.removeItem('ycwxToken')
  // return Cookies.remove('ycwxToken')
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
//   window.sessionStorage.removeItem('ycwxToken', '')
//   store.commit('setToken', '')
//   store.commit('setAvator', '')
//   store.commit('setUserId', '')
//   store.commit('setUserName', '')
//   this.$route.push('/login')
// }
