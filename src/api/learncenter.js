import axios from '@/libs/api.request'

export const isRegister = (data) => { // 是否注册过
  return axios.request({
    url: '/web/Register/isRegister',
    data,
    method: 'post'
  })
}
export const kRegister = (data) => { // 快捷注册
  return axios.request({
    url: '/web/Register/kRegister',
    data,
    method: 'post'
  })
}
export const learnIndex = (data) => { // 学习计划首页
  return axios.request({
    url: '/web/Plan/learnIndex',
    data,
    method: 'post'
  })
}
export const courseList = (data) => { // 学习计划课程列表
  return axios.request({
    url: '/web/Plan/courseList',
    data,
    method: 'post'
  })
}
export const testTime = (data) => { // 学习计划考试时间列表
  return axios.request({
    url: '/web/Plan/testTime',
    data,
    method: 'post'
  })
}
export const addStudy = (data) => { // 添加学习计划
  return axios.request({
    url: '/web/Plan/addStudy',
    data,
    method: 'post'
  })
}
export const everyday = (data) => { // 学习计划日期
  return axios.request({
    url: '/web/Plan/everyday',
    data,
    method: 'post'
  })
}
export const outPlan = (data) => { // 退出学习计划
  return axios.request({
    url: '/web/Plan/outPlan',
    data,
    method: 'post'
  })
}
export const hangAir = (data) => { // 未完成计划
  return axios.request({
    url: '/web/Plan/hangAir',
    data,
    method: 'post'
  })
}
export const getVideo = (data) => { // 学习视频
  return axios.request({
    url: '/web/Plan/getVideo',
    data,
    method: 'post'
  })
}
export const withTopic = (data) => { // 拿题
  return axios.request({
    url: '/web/Plan/withTopic',
    data,
    method: 'post'
  })
}
export const getPaper = (data) => { // 交卷
  return axios.request({
    url: '/web/Plan/getPaper',
    data,
    method: 'post'
  })
}
export const questionParsingLearn = (data) => { // 错题解析
  return axios.request({
    url: '/web/Plan/questionParsing',
    data,
    method: 'post'
  })
}
export const listNew = (data) => { // 学习公告
  return axios.request({
    url: '/web/Plan/listNew',
    data,
    method: 'post'
  })
}
export const listuser = (data) => { // 正在学习的学员
  return axios.request({
    url: '/web/Plan/listuser',
    data,
    method: 'post'
  })
}
export const userDynamic = (data) => { // 学习动态
  return axios.request({
    url: '/web/Plan/userDynamic',
    data,
    method: 'post'
  })
}
export const studyStatus = (data) => { // 学习状态中 学习中 已经结束
  return axios.request({
    url: '/web/Plan/studyStatus',
    data,
    method: 'post'
  })
}
