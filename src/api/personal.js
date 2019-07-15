import axios from '@/libs/api.request'

export const questionRecord = (data) => { // 题库-做题记录
  return axios.request({
    url: '/web/Personal/questionRecord',
    data,
    method: 'post'
  })
}
export const personalWrongtopic = (data) => { // 题库-错题集
  return axios.request({
    url: '/web/Personal/personalWrongtopic',
    data,
    method: 'post'
  })
}
export const getKnow = (data) => { // 题库-错题集知识点
  return axios.request({
    url: '/web/Personal/getKnow',
    data,
    method: 'post'
  })
}
export const ContinueTopic = (data) => { // 题库-继续做题
  return axios.request({
    url: '/web/Personal/ContinueTopic ',
    data,
    method: 'post'
  })
}
export const continueLearn = (data) => { // 课程-继续学习
  return axios.request({
    url: '/web/Personal/continueLearn',
    data,
    method: 'post'
  })
}
