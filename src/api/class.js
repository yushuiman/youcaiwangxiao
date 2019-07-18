import axios from '@/libs/api.request'
import WebSocket from '@/libs/web-socket'
export const initWS = (data) => {
  return new WebSocket(ws => {
    ws.send(data)
  })
}
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
