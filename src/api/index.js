import axios from '@/libs/api.request'

export const couAnswerList = (data) => {
  return axios.request({
    url: '/web/Content/indexContent',
    data,
    method: 'post'
  })
}
export const consult = (data) => { // 悬浮窗
  return axios.request({
    url: '/web/consult/consult',
    data,
    method: 'post'
  })
}
