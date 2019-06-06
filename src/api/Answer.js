import axios from '@/libs/api.request'

export const couAnswerList = (data) => {
  return axios.request({
    url: '/web/Content/indexContent',
    data,
    method: 'post'
  })
}
