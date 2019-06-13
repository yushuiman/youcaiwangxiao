import axios from '@/libs/api.request'

export const courseList = (data) => {
  return axios.request({
    url: '/web/Course/courseList',
    data,
    method: 'post'
  })
}
export const guessLike = (data) => {
  return axios.request({
    url: '/web/Course/guessLike',
    data,
    method: 'post'
  })
}
export const subjects = (data) => {
  return axios.request({
    url: '/web/Course/subjects',
    data,
    method: 'post'
  })
}
