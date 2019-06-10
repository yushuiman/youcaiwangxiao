import { setToken } from '@/plugins/utils'
import {
  SET_CHANGE,
  SET_TOKEN,
  SET_USERNAME,
  SET_MOBILE,
  SET_USERID,
  SET_HEAD
} from './mutation-type'
const mutations = {
  [SET_CHANGE] (state, navName) {
    state.is_change = navName
  },
  [SET_TOKEN] (state, token) {
    state.token = token
    setToken(token)
  },
  [SET_USERNAME] (state, username) {
    state.username = username
  },
  [SET_MOBILE] (state, mobile) {
    state.mobile = mobile
  },
  [SET_USERID] (state, userId) {
    state.userId = userId
  },
  [SET_HEAD] (state, head) {
    state.head = head
  }
}
export default mutations
