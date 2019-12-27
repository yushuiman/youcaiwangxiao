import axios from '@/libs/api.request'

export const deuShuffling = (data) => { // 首页banner
  return axios.request({
    url: '/web/Education/deuShuffling',
    data,
    method: 'post'
  })
}
export const deuType = (data) => { // 后续教育分类
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
export const activityUser = (data) => { // 首页课程预告报名
  return axios.request({
    url: '/web/Education/activityUser',
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
export const previewDetails = (data) => { // 课程预告简介
  return axios.request({
    url: '/web/Education/previewDetails',
    data,
    method: 'post'
  })
}
export const previewDetailsApp = (data) => { // 课程预告简介
  return axios.request({
    url: '/apps/Education/previewDetails',
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
export const secvCatalog = (data) => { // 课程目录 章节
  return axios.request({
    url: '/web/Education/secvCatalog',
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
export const record = (data) => { // 入库观看记录
  return axios.request({
    url: '/web/Education/record',
    data,
    method: 'post'
  })
}
export const watchRecords = (data) => { // 观看记录
  return axios.request({
    url: '/web/Education/watchRecords',
    data,
    method: 'post'
  })
}
export const signQuery = (data) => { // 签到查询
  return axios.request({
    url: '/web/Education/signQuery',
    data,
    method: 'post'
  })
}
export const sign = (data) => { // 签到
  return axios.request({
    url: '/web/Education/sign',
    data,
    method: 'post'
  })
}
export const myCPEcourse = (data) => { // 我的后续教育课程
  return axios.request({
    url: '/web/Education/myCPEcourse',
    data,
    method: 'post'
  })
}
export const userIntegral = (data) => { // cpe报告
  return axios.request({
    url: '/web/Education/userIntegral',
    data,
    method: 'post'
  })
}
export const generateImg = (data) => { // cpe报告生成
  return axios.request({
    url: '/upload/Edureport/generateImg',
    data,
    method: 'post'
  })
}

export const newInformation = (data) => { // 最新资讯
  return axios.request({
    url: '/web/Education/newInformation',
    data,
    method: 'post'
  })
}
export const announcement = (data) => { // 学习须知banner
  return axios.request({
    url: '/web/Education/announcement',
    data,
    method: 'post'
  })
}
export const tipsType = (data) => { // 学习须知类别
  return axios.request({
    url: '/web/Education/tipsType',
    data,
    method: 'post'
  })
}
export const tipsList = (data) => { // 学习须知列表
  return axios.request({
    url: '/web/Education/tipsList',
    data,
    method: 'post'
  })
}
