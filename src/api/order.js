import axios from '@/libs/api.request'

export const showOrder = (data) => { // 订单展示
  return axios.request({
    url: '/web/Orders/showOrder',
    data,
    method: 'post'
  })
}

export const availableCoupon = (data) => { // 可用优惠券
  return axios.request({
    url: '/web/Orders/availableCoupon',
    data,
    method: 'post'
  })
}

export const addOrder = (data) => { // 订单入库
  return axios.request({
    url: '/web/Orders/addOrder',
    data,
    method: 'post'
  })
}
