import axios from '@/libs/api.request'

export const courseListRes = (data) => {
  return axios.request({
    url: '/web/Course/courseList',
    data,
    method: 'post'
  })
}
