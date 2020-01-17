// 自定义表单校验插件
import store from '../store/'
const loading = {}
loading.install = function (Vue) {
  let forceFlag = false // 强制loading是否已经开启
  Object.defineProperties(Vue.prototype, {
    showLoading: { // 显示／隐藏loading
      get () {
        return (flag, force = false) => {
          if (force) { // 存在强制符号
            store.commit('SHOWLOADINGFLAG', flag)
            forceFlag = flag
          } else {
            if (!forceFlag) { // loading已被强制开启
              store.commit('SHOWLOADINGFLAG', flag)
            }
          }
        }
      }
    }
  })
}

export default loading
