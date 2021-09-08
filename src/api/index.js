import axios from '@/libs/api.request'

export const consult = (data) => { // 悬浮窗
  return axios.request({
    url: '/web/consult/consult',
    data,
    method: 'post'
  })
}
export const newInformation = (data) => { // 最新资讯
  return axios.request({
    url: '/web/First/newInformation',
    data,
    method: 'post'
  })
}
export const footerNav = (data) => { // 底部导航
  return axios.request({
    url: '/web/First/footerNav',
    params: data,
    method: 'get'
  })
}
export const footerContent = (data) => { // 首页底部导航内容
  return axios.request({
    url: '/web/First/footerContent',
    params: data,
    method: 'get'
  })
}
