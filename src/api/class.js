import axios from '@/libs/api.request'

export const courseList = (data) => { // 课程列表
  return axios.request({
    url: '/web/Course/courseList',
    data,
    method: 'post'
  })
}
export const guessLike = (data) => { // 猜你喜欢
  return axios.request({
    url: '/web/Course/guessLike',
    data,
    method: 'post'
  })
}
export const subjects = (data) => { // 筛选科目
  return axios.request({
    url: '/web/Course/subjects',
    data,
    method: 'post'
  })
}
export const courseIntroduction = (data) => { // 课程简介
  return axios.request({
    url: '/web/Course/courseIntroduction',
    data,
    method: 'post'
  })
}
export const secvCatalog = (data) => { // 课程大纲（目录，章节）
  return axios.request({
    url: '/web/Course/secvCatalog',
    data,
    method: 'post'
  })
}
export const courseCatalog = (data) => { // 课程大纲
  return axios.request({
    url: '/web/Course/courseCatalog',
    data,
    method: 'post'
  })
}
export const answerList = (data) => { // 问答列表
  return axios.request({
    url: '/web/Course/answerList',
    data,
    method: 'post'
  })
}
