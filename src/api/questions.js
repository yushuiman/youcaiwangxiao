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
export const geterrorKnow = (data) => { // 高频错题章节
  return axios.request({
    url: '/web/Question/geterrorKnow',
    data,
    method: 'post'
  })
}
export const volumeList = (data) => { // 组卷列表
  return axios.request({
    url: '/web/Question/volumeList',
    data,
    method: 'post'
  })
}
export const sprintCourse = (data) => { // 冲刺训练营
  return axios.request({
    url: '/web/Question/sprintCourse',
    data,
    method: 'post'
  })
}
export const tips = (data) => { // 冲刺训练营 提示
  return axios.request({
    url: '/apps/Question/tips',
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
export const questionCollection = (data) => { // 收藏
  return axios.request({
    url: '/web/Question/questionCollection',
    data,
    method: 'post'
  })
}
export const getPapers = (data) => { // 交卷
  return axios.request({
    url: '/web/Question/getPapers',
    data,
    method: 'post'
  })
}
export const resultsStati = (data) => { // 成绩统计
  return axios.request({
    url: '/web/Question/resultsStati ',
    data,
    method: 'post'
  })
}
export const questionParsing = (data) => { // 解析（全部，错题）
  return axios.request({
    url: '/web/Question/questionParsing',
    data,
    method: 'post'
  })
}
export const checkItem = (data) => { // 答题记录论述题解析
  return axios.request({
    url: '/web/Question/checkItem',
    data,
    method: 'post'
  })
}
export const abiAssess = (data) => { // 能力评估
  return axios.request({
    url: '/web/Question/abiAssess',
    data,
    method: 'post'
  })
}

export const questionSub = (data) => { // 答疑提交
  return axios.request({
    url: '/web/Question/questionSub',
    data,
    method: 'post'
  })
}
export const questionDetails = (data) => { // 答疑list
  return axios.request({
    url: '/web/Question/questionDetails',
    data,
    method: 'post'
  })
}
export const getAnswerknow = (data) => { // 答疑知识点
  return axios.request({
    url: '/web/Question/getAnswerknow',
    data,
    method: 'post'
  })
}
export const questionallAnswer = (data) => { // 答疑知识点
  return axios.request({
    url: '/web/Question/questionallAnswer',
    data,
    method: 'post'
  })
}
export const errorCorrection = (data) => { // 纠错
  return axios.request({
    url: '/web/Question/errorCorrection',
    data,
    method: 'post'
  })
}
export const zExperience = (data) => { // 0元体验拿题
  return axios.request({
    url: '/web/Question/zExperience',
    data,
    method: 'post'
  })
}

export const experienceStati = (data) => { // 0元体验成绩统计
  return axios.request({
    url: '/web/Question/experienceStati',
    data,
    method: 'post'
  })
}
export const experienceParsing = (data) => { // 0元体验错题解析
  return axios.request({
    url: '/web/Question/experienceParsing',
    data,
    method: 'post'
  })
}
export const whetherBullet = (data) => { // 是否弹出入学测试框
  return axios.request({
    url: '/web/Question/whetherBullet',
    data,
    method: 'post'
  })
}
export const addEntrance = (data) => { // 入库入学测试表
  return axios.request({
    url: '/web/Question/addEntrance',
    data,
    method: 'post'
  })
}
export const getEntrance = (data) => { // 去入学测试卷子
  return axios.request({
    url: '/web/Question/getEntrance',
    data,
    method: 'post'
  })
}
