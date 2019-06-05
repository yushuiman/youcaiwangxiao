// 导入cookie
import Cookies from 'js-cookie'

// 设置token
export const setToken = (token) => {
  Cookies.set('TOKEN_KEY', token, { expires: 1 })
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
