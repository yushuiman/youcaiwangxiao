import { getcookiesInServer, getcookiesInClient } from '@/plugins/utils'

export default function (app) {
  let axios = app.$axios
  // 基本配置
  axios.defaults.timeout = 10000
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  let isClient = process.client
  let isServer = process.server
  var token = ''
  // 请求回调
  axios.onRequest(config => {
    if (isServer) {
      let cookies = getcookiesInServer(app.req)
      token = cookies.TOKEN_KEY ? cookies.TOKEN_KEY : ''
    }
    if (isClient) {
      token = getcookiesInClient('TOKEN_KEY') ? getcookiesInClient('TOKEN_KEY') : ''
    }
    config.headers['token'] = token
    return config
  })

  // 返回回调
  axios.onResponse(res => {})

  // 错误回调
  axios.onError(Error => {})
}
