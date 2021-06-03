import axios from '@/libs/api.request'

export const systeMessage = (data) => { // 公告列表
  return axios.request({
    url: '/web/Message/systeMessage',
    data,
    method: 'post'
  })
}
export const read = (data) => { // 已读
  return axios.request({
    url: '/web/Message/read',
    data,
    method: 'post'
  })
}
export const listMessage = (data) => { // 系统公告详情
  return axios.request({
    url: '/web/Message/listMessage',
    data,
    method: 'post'
  })
}
export const indexMessage = (data) => { // 是否有未读公告 新的
  return axios.request({
    url: '/web/Message/indexMessage',
    data,
    method: 'post'
  })
}
export const menuList = (data) => { // 菜单未读状态
  return axios.request({
    url: '/web/Message/menuList',
    data,
    method: 'post'
  })
}
