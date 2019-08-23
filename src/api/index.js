import axios from '@/libs/api.request'

export const consult = (data) => { // 悬浮窗
  return axios.request({
    url: '/web/consult/consult',
    data,
    method: 'post'
  })
}
export const thickness = (data) => { // 活动弹窗
  return axios.request({
    url: '/web/Register/thickness',
    data,
    method: 'post'
  })
}