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
