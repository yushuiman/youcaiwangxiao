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
