import axios from '@/libs/api.request'

export const getProject = (data) => { // 展示课程
  return axios.request({
    url: '/web/Question/getProject',
    data,
    method: 'post'
  })
}
export const questionIndex = (data) => { // 做题数。正确率，平均分
  return axios.request({
    url: '/web/Question/questionIndex',
    data,
    method: 'post'
  })
}
export const getPlate = (data) => { // 板块 没有用到 前端写死了
  return axios.request({
    url: '/web/Question/getPlate',
    data,
    method: 'post'
  })
}
export const studentsRanking = (data) => { // 学院排名
  return axios.request({
    url: '/web/Question/studentsRanking',
    data,
    method: 'post'
  })
}

export const getSection = (data) => { // 知识点练习章节
  return axios.request({
    url: '/web/Question/getSection',
    data,
    method: 'post'
  })
}

export const getKnow = (data) => { // 知识点练习\高频错题-知识点
  return axios.request({
    url: '/web/Question/getKnow',
    data,
    method: 'post'
  })
}
export const getCourse = (data) => { // 阶段测试、论述题自测章
  return axios.request({
    url: '/web/Question/getCourse',
    data,
    method: 'post'
  })
}
export const getErrorsection = (data) => { // 高频错题章节
  return axios.request({
    url: '/web/Question/getErrorsection',
    data,
    method: 'post'
  })
}
export const topicList = (data) => { // 6大板块拿题
  return axios.request({
    url: '/web/Question/topicList',
    data,
    method: 'post'
  })
}
export const videoPlayback = (data) => { // 视频播放
  return axios.request({
    url: '/web/Course/videoPlayback',
    data,
    method: 'post'
  })
}
export const videoCredentials = (data) => { // 获取视频凭证
  return axios.request({
    url: '/web/Course/videoCredentials',
    params: data,
    method: 'get'
  })
}
export const answerList = (data) => { // 问答列表
  return axios.request({
    url: '/web/Course/answerList',
    data,
    method: 'post'
  })
}
export const answerSub = (data) => { // 问题提交
  return axios.request({
    url: '/web/Course/answerSub',
    data,
    method: 'post'
  })
}
export const answerDetails = (data) => { // 问题详情
  return axios.request({
    url: '/web/Course/answerDetails',
    data,
    method: 'post'
  })
}
