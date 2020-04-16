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
export const myCourse = (data) => { // 课程-我的课程
  return axios.request({
    url: '/web/Personal/myCourse',
    data,
    method: 'post'
  })
}
export const watchRecords = (data) => { // 课程-播放记录
  return axios.request({
    url: '/web/Personal/watchRecords',
    data,
    method: 'post'
  })
}
export const myCollpackage = (data) => { // 课程-收藏-课程包
  return axios.request({
    url: '/web/Personal/myCollpackage',
    data,
    method: 'post'
  })
}
export const myCollcourse = (data) => { // 课程-收藏-课程章
  return axios.request({
    url: '/web/Personal/myCollcourse',
    data,
    method: 'post'
  })
}
export const myCollvideo = (data) => { // 课程-收藏-课程节知识点
  return axios.request({
    url: '/web/Personal/myCollvideo',
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
export const courseAnswer = (data) => { // 课程答疑
  return axios.request({
    url: '/web/Personal/courseAnswer',
    data,
    method: 'post'
  })
}
export const questionAnswer = (data) => { // 题库答疑
  return axios.request({
    url: '/web/Personal/questionAnswer',
    data,
    method: 'post'
  })
}
export const myOrder = (data) => { // 订单
  return axios.request({
    url: '/web/Personal/myOrder',
    data,
    method: 'post'
  })
}
export const cancelOrder = (data) => { // 订单取消
  return axios.request({
    url: '/web/Personal/cancelOrder',
    data,
    method: 'post'
  })
}
export const alreadyOrderlist = (data) => { // 订单详情
  return axios.request({
    url: '/web/Personal/alreadyOrderlist',
    data,
    method: 'post'
  })
}
export const consumptionRecord = (data) => { // 消费记录
  return axios.request({
    url: '/web/Personal/consumptionRecord',
    data,
    method: 'post'
  })
}
export const defaultAddress = (data) => { // 设置默认收货地址
  return axios.request({
    url: '/web/Personal/defaultAddress',
    data,
    method: 'post'
  })
}

export const addAddress = (data) => { // 添加收货地址
  return axios.request({
    url: '/web/Personal/addAddress',
    data,
    method: 'post'
  })
}
export const delAddress = (data) => { // 删除收货地址
  return axios.request({
    url: '/web/Personal/delAddress',
    data,
    method: 'post'
  })
}
export const savePersonal = (data) => { // 修改基本信息
  return axios.request({
    url: '/web/Personal/savePersonal',
    data,
    method: 'post'
  })
}
export const getPersonal = (data) => { // 基本信息
  return axios.request({
    url: '/web/Personal/getPersonal',
    data,
    method: 'post'
  })
}
export const editAddress = (data) => { // 修改收货地址
  return axios.request({
    url: '/web/Personal/editAddress',
    data,
    method: 'post'
  })
}
export const resetPaw = (data) => { // 修改密码
  return axios.request({
    url: '/web/Personal/resetPaw',
    data,
    method: 'post'
  })
}
export const learnClock = (data) => { // 签到打卡
  return axios.request({
    url: '/web/Plan/learnClock',
    data,
    method: 'post'
  })
}
export const coupons = (data) => { // 优惠券
  return axios.request({
    url: '/web/Personal/coupons',
    data,
    method: 'post'
  })
}
export const delcoupon = (data) => { // 删除过期优惠券
  return axios.request({
    url: '/web/Personal/delcoupon',
    data,
    method: 'post'
  })
}
export const userCourse = (data) => { // 获取科目
  return axios.request({
    url: '/web/Personal/userCourse',
    data,
    method: 'post'
  })
}
export const courseTime = (data) => { // 获取科目
  return axios.request({
    url: '/web/Personal/courseTime',
    data,
    method: 'post'
  })
}
export const ctimeSub = (data) => { // 设置科目考试时间
  return axios.request({
    url: '/web/Personal/ctimeSub',
    data,
    method: 'post'
  })
}
export const onlyQuestion = (data) => { // 答疑题干展示
  return axios.request({
    url: '/web/Personal/onlyQuestion',
    data,
    method: 'post'
  })
}
export const putOmoUser = (data) => { // 完善omo信息
  return axios.request({
    url: '/web/Personal/putOmoUser',
    data,
    method: 'post'
  })
}
export const getOmoUserInfo = (data) => { // OMO学员会员卡信息展示
  return axios.request({
    url: '/web/Personal/getOmoUserInfo',
    data,
    method: 'post'
  })
}
