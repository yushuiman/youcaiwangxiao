import axios from '@/libs/api.request'

export const newsList = (data) => { // 资讯
  return axios.request({
    url: '/web/news/newsList',
    data,
    method: 'post'
  })
}
export const newsDetails = (data) => { // 资讯详情
  return axios.request({
    url: '/web/news/newsDetails',
    data,
    method: 'post'
  })
}
export const bkznList = (data) => { // 报考指南
  return axios.request({
    url: '/web/news/bkznList',
    data,
    method: 'post'
  })
}
export const dataAsk = (data) => { // 获取资料
  return axios.request({
    url: '/web/news/dataAsk',
    data,
    method: 'post'
  })
}
export const zxbanner = (data) => { // 资讯banner
  return axios.request({
    url: '/web/First/zxbanner',
    data,
    method: 'post'
  })
}
