import axios from '@/libs/api.request'

export const couAnswerList = (data) => {
  return axios.request({
    url: '/web/Content/indexContent ',
    data,
    method: 'post'
  })
}
export const handleLoginRes = (data) => {
  return axios.request({
    url: '/web/Login/accountLogin',
    data,
    method: 'post'
  })
}
export const outLogin = (data) => {
  return axios.request({
    url: '/web/Login/accountLogin',
    data,
    method: 'post'
  })
}
