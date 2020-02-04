import axios from '@/libs/api.request'

export const complainSub = (data) => { // 答疑投诉提交
  return axios.request({
    url: '/web/Course/complainSub',
    data,
    method: 'post'
  })
}
export const complainType = (data) => { // 答疑投诉类别
  return axios.request({
    url: '/web/Course/complainType',
    data,
    method: 'post'
  })
}
export const answerClose = (data) => { // 答疑追问
  return axios.request({
    url: '/web/Course/answerClose',
    data,
    method: 'post'
  })
}
