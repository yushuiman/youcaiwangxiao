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

export const payOrder = (data) => { // 订单支付
  return axios.request({
    url: '/web/Pay/payOrder',
    data,
    method: 'post'
  })
}

export const zfbpay = (data) => { // 支付宝
  return axios.request({
    url: '/alipay/Pagepay/zfbpay',
    data,
    method: 'post'
  })
}
export const setCode = (data) => { // 订单支付微信二维码pc
  return axios.request({
    url: '/web/Pay/setCode',
    data,
    method: 'post'
  })
}
export const getGoods = (data) => { // 支付回调
  return axios.request({
    url: '/web/Pay/getGoods',
    data,
    method: 'post'
  })
}
export const setCode2 = (data) => { // 创建每个用户的唯一二维码h5
  return axios.request({
    url: '/web/Quickpay/setCode',
    data,
    method: 'post'
  })
}
export const addQuickOrder = (data) => { // 快捷支付
  return axios.request({
    url: '/web/Quickpay/addQuickOrder',
    data,
    method: 'post'
  })
}
export const getQrcode = (data) => { // 新银联zhifu
  return axios.request({
    url: '/unionpay/Cbpay/getQrcode',
    data,
    method: 'post'
  })
}
export const queryQuickOrder = (data) => { // 快捷支付订单查询
  return axios.request({
    url: '/web/Quickpay/queryQuickOrder',
    data,
    method: 'post'
  })
}
export const getGoodsQucik = (data) => { // 快捷支付微信回调
  return axios.request({
    url: '/web/Quickpay/getGoods',
    data,
    method: 'post'
  })
}
