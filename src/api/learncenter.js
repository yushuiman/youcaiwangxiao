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
    url: '/apps/Plan/learnIndex',
    data,
    method: 'post'
  })
}
export const courseList = (data) => { // 学习计划课程列表
  return axios.request({
    url: '/apps/Plan/courseList',
    data,
    method: 'post'
  })
}
export const testTime = (data) => { // 学习计划考试时间列表
  return axios.request({
    url: '/apps/Plan/testTime',
    data,
    method: 'post'
  })
}
export const addStudy = (data) => { // 添加学习计划
  return axios.request({
    url: '/apps/Plan/addStudy',
    data,
    method: 'post'
  })
}
