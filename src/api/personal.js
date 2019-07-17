import axios from '@/libs/api.request'

export const getProject = (data) => { // 题库-目录列表
  return axios.request({
    url: '/web/Personal/getProject',
    data,
    method: 'post'
  })
}
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
export const continueQuestion = (data) => { // 题库-继续做题
  return axios.request({
    url: '/web/Question/continueQuestion',
    data,
    method: 'post'
  })
}
export const getdtPapers = (data) => { // 题库-继续做题交卷
  return axios.request({
    url: '/web/Question/getdtPapers',
    data,
    method: 'post'
  })
}
export const errorParsing = (data) => { // 题库-错题集查看解析-全部
  return axios.request({
    url: '/web/Question/errorParsing',
    data,
    method: 'post'
  })
}
export const error2Parsing = (data) => { // 题库-错题集查看解析-全部-错题
  return axios.request({
    url: '/web/Question/error2Parsing',
    data,
    method: 'post'
  })
}

export const wrongCheck = (data) => { // 题库-错题集-拿题
  return axios.request({
    url: '/web/Question/wrongCheck ',
    data,
    method: 'post'
  })
}

export const errorCenter = (data) => { // 题库-错题集交卷
  return axios.request({
    url: '/web/Question/errorCenter ',
    data,
    method: 'post'
  })
}

export const errorStati = (data) => { // 题库-错题集-成绩统计
  return axios.request({
    url: '/web/Question/errorStati ',
    data,
    method: 'post'
  })
}

export const myCollquestion = (data) => { // 题库-收藏夹-章节
  return axios.request({
    url: '/web/Personal/myCollquestion ',
    data,
    method: 'post'
  })
}
export const myCollquestionknob = (data) => { // 题库-收藏夹-知识点
  return axios.request({
    url: '/web/Personal/myCollquestionknob ',
    data,
    method: 'post'
  })
}
export const myCollcsee = (data) => { // 题库-收藏夹-查看解析
  return axios.request({
    url: '/web/Personal/myCollcsee ',
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
