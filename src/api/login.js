import axios from '@/libs/api.request'

export const webReg = (data) => {
  return axios.request({
    url: '/web/Register/webReg',
    data,
    method: 'post'
  })
}
export const getSmsCode = (data) => {
  return axios.request({
    url: '/web/Register/getSmsCode',
    data,
    method: 'post'
  })
}
export const forgetPaw = (data) => {
  return axios.request({
    url: '/web/Login/forgetPaw',
    data,
    method: 'post'
  })
}
export const accountLogin = (data) => {
  return axios.request({
    url: '/web/Login/accountLogin',
    data,
    method: 'post'
  })
}
export const outLogin = (data) => {
  return axios.request({
    url: '/web/Login/outLogin',
    data,
    method: 'post'
  })
}
export const voice = (data) => {
  return axios.request({
    url: '/web/Register/voice',
    data,
    method: 'post'
  })
}
export const resetPaw = (data) => {
  return axios.request({
    url: '/web/Login/resetPaw',
    data,
    method: 'post'
  })
}
export const quickLogin = (data) => {
  return axios.request({
    url: '/web/Login/quickLogin',
    data,
    method: 'post'
  })
}
export const wxLogin = (data) => {
  return axios.request({
    url: '/web/Login/wxLogin',
    data,
    method: 'post'
  })
}
export const getUserInfo = (data) => {
  return axios.request({
    url: '/web/Login/getUserInfo ',
    data,
    method: 'post'
  })
}
