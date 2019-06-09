/**
 * @method dispatchData 封装的发送commit 的函数
 */
import * as loadAction from 'store/actions/dialog.action'
import * as oneCardInfo from 'store/actions/oneCardInfo.action'
import * as userInfo from 'store/actions/userInfo.action'
import * as borrowInfo from 'store/actions/borrowInfo.action'
import * as udyInfo from 'store/actions/subsidiaryInformation.action'
import * as loading from 'store/actions/loading.action'
import * as billInfo from 'store/actions/billInfo.action'
import * as zhiZunBaoUserInfo from 'store/actions/zhiZunBaoUserInfo.action'
import * as withdrawInfo from 'store/actions/withdrawInfo.action'
import * as wagesStatus from 'store/actions/wagesStatus.action'
import * as loanRedInfo from 'store/actions/loanRedInfo.action'
import * as resetDealPwInfo from 'store/actions/resetDealPwInfo.action'
import * as sysConfig from 'store/actions/sysConfig.action'
import * as richBean from 'store/actions/richBean.action'
let actions = Object.assign({}, loadAction, oneCardInfo, userInfo, borrowInfo, udyInfo, loading, billInfo, zhiZunBaoUserInfo, withdrawInfo, wagesStatus, loanRedInfo, resetDealPwInfo, sysConfig, richBean)

export default actions
