import { Message } from 'element-ui'
import { setToken } from '@/plugins/utils'
import {
  SET_TOKEN,
  SET_USERNAME,
  SET_MOBILE,
  SET_USERID,
  SET_HEAD
} from './mutation-type'
import {couAnswerList} from '../api/Answer'
const actions={

 /* // 登录
  handleLogin ({ commit }, { mobile, password }) {
    couAnswerList().then(res => {
      let rep = res.data;
      if (rep.code === 200){
          commit(SET_TOKEN, data.data.token)
          Message.success('登录成功!')
          resolve()
        } else if (data.code === 403) {
          Message.error('账号已被冻结，请联系管理员!')
        } else {
          Message.error('账号或密码错误！')
        }
      }
    })

  },*/
  // 登录
  handleLogin ({ commit }, { mobile, password }) {
    return new Promise((resolve, reject) => {
      console.log('111111111111')
     /* this.$axios.post('/web/Login/accountLogin', { mobile, password }).then(res => {

        if (data.code === 200) {
          commit(SET_TOKEN, data.data.token)
          Message.success('登录成功!')
          resolve()
        } else if (data.code === 403) {
          Message.error('账号已被冻结，请联系管理员!')
        } else {
          Message.error('账号或密码错误！')
        }
      }).catch( const data = res.dataerr => {
        reject(err)
      })*/
    })
  },
  // 退出登录
  dropOut ({ state, commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/web/Login/outLogin').then(res => {
        const data = res.data
        if (data.code === 200) {
          commit(SET_MOBILE, '')
          commit(SET_USERNAME, '')
          commit(SET_USERID, '')
          commit(SET_HEAD, '')
          commit(SET_TOKEN, '')
          resolve(200)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取用户相关信息
  getUserInfo ({ state, commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/web/Login/getUserInfo').then(res => {
        const data = res.data
        if (data.code === 200) {
          commit(SET_MOBILE, data.data.mobile)
          commit(SET_USERNAME, data.data.username)
          commit(SET_USERID, data.data.id);
          commit(SET_HEAD, data.data.head);
          commit(SET_TOKEN, data.data.token);
          resolve(state)
        } else {
          commit(SET_MOBILE, '')
          commit(SET_USERNAME, '')
          commit(SET_USERID, '')
          commit(SET_HEAD, '')
          commit(SET_TOKEN, '')
          resolve(state)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
};
export default actions;
