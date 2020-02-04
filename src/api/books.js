import axios from '@/libs/api.request'

export const booksList = (data) => { // 书籍列表
  return axios.request({
    url: '/web/Books/booksList',
    data,
    method: 'post'
  })
}
export const booksBanner = (data) => { // banner
  return axios.request({
    url: '/web/Books/booksBanner',
    data,
    method: 'post'
  })
}
export const booksDetails = (data) => { // banner
  return axios.request({
    url: '/web/Books/booksDetails',
    data,
    method: 'post'
  })
}
