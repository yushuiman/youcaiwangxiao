import axios from '@/libs/api.request'

export const deuShuffling = (data) => { // 首页banner
  return axios.request({
    url: '/web/Education/deuShuffling',
    data,
    method: 'post'
  })
}
export const deuType = (data) => { // 分类
  return axios.request({
    url: '/web/Education/deuType',
    data,
    method: 'post'
  })
}
export const previewCourse = (data) => { // 首页课程预告
  return axios.request({
    url: '/web/Education/previewCourse',
    data,
    method: 'post'
  })
}
export const firstPackage = (data) => { // 课程包
  return axios.request({
    url: '/web/Education/firstPackage',
    data,
    method: 'post'
  })
}

export const listPackage = (data) => { // 课程包列表
  return axios.request({
    url: '/web/Education/listPackage',
    data,
    method: 'post'
  })
}
export const listCourse = (data) => { // 课程列表
  return axios.request({
    url: '/web/Education/listCourse',
    data,
    method: 'post'
  })
}
export const courseIntroduction = (data) => { // 课程列表简介
  return axios.request({
    url: '/web/Education/courseIntroduction',
    data,
    method: 'post'
  })
}
export const courseCatalog = (data) => { // 课程目录
  return axios.request({
    url: '/web/Education/courseCatalog',
    data,
    method: 'post'
  })
}
export const videoCredentials = (data) => { // 视频凭证
  return axios.request({
    url: '/web/Education/videoCredentials',
    data,
    method: 'post'
  })
}
