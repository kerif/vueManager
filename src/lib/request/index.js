import { $form, $json, $file } from '@/lib/axios'
let exports = {}

/**
 * 管理员登录
 * @param {Object} params
 *  username 用户名
 *  password 密码
 */
exports.login = (params) => {
  return $json.post('login', params)
}
// 退出登录
exports.logout = () => $form.post('logout')

exports.getLines = () => {
  return $form.get('express-lines')
}

exports.getStaff = (params) => {
  return $form.get('admins', { params })
}
exports.getVips = () => {
  return $form.get('admin-groups/simple-list')
}
exports.EditVip = (id) => {
  return $form.get(`admins/${id}`)
}
exports.getVipDetails = (id) => {
  return $form.get(`admins/${id}`)
}
exports.updateVip = (id, params) => {
  return $form.put(`agents/${id}`, params)
}
exports.saveVip = (params) => {
  return $json.post('admins', params)
}
exports.editVipPsd = (id, params) => {
  return $form.put(`admins/${id}/password`, params)
}
// 删除员工列表用户
exports.deleteVip = (params) => {
  return $form.put('admins/batch-delete', params)
}
exports.getVipGroup = (params) => {
  return $form.get('admin-groups', { params })
}
// 新建员工组
exports.addGroup = (params) => {
  return $json.post('admin-groups', params)
}
// 编辑员工组
exports.editGroup = (id, params) => {
  return $form.put(`admin-groups/${id}`, params)
}
exports.getVipMember = (id) => {
  return $form.get(`admin-groups/${id}/members`)
}
exports.getBill = () => {
  return $form.get('warehouse-address')
}
exports.saveWareHouse = (params) => {
  return $form.put('warehouse-address', params)
}
exports.getNotice = (params) => {
  return $form.get('order-notices', { params })
}
exports.saveNotice = (params) => {
  return $form.post(`order-notices`, params)
}
// 客户组删除
exports.userGroupDelete = (ids) => {
  return $form.put('user-groups/batch-delete', ids)
}
// 客户组成员
exports.getUserMembers = (id) => {
  return $form.get(`user-groups/${id}/members`)
}
// 员工列表禁止登录
exports.forbidUser = (ids) => {
  return $form.put('admins/forbid-login', ids)
}
// 客户禁止登录
exports.customerForbid = (ids) => {
  return $form.put('users/forbid-login', ids)
}
// 客户允许登录
exports.customerLogin = (ids) => {
  return $form.put('users/allow-login', ids)
}
// 客户 邀请记录
exports.invitations = (id, params) => {
  return $form.get(`users/${id}/invitations`, { params })
}
// 客户 券包
exports.voucherUser = (id, params) => {
  return $form.get(`users/${id}/coupons`, { params })
}
// 员工列表允许登录
exports.allowUser = (ids) => {
  return $form.put('admins/allow-login', ids)
}
// 编辑员工
exports.editAdmins = (id, params) => {
  return $form.put(`admins/${id}`, params)
}
// 员工组删除组
exports.deleteGroup = (ids) => {
  return $form.put('admin-groups/batch-delete', ids)
}
exports.getSuggest = (params) => {
  return $form.get('suggestions', { params })
}
exports.submitSuggest = (id, params) => {
  return $form.put(`suggestions/${id}/status`, params)
}
exports.getNoticeDetails = (id) => {
  return $form.get(`order-notices/${id}`)
}
exports.saveNoticeDetails = (id, params) => {
  return $form.put(`order-notices/${id}`, params)
}
exports.getShip = (params) => {
  return $form.get('shipments', { params })
}
exports.getCountry = () => {
  return $form.get('countries')
}
exports.saveCountries = (params) => {
  return $form.post('countries', params)
}
exports.getTransaction = (params) => {
  return $form.get('transaction-records', { params })
}
exports.saveShip = (params) => {
  return $form.post(`shipments`, params)
}
exports.getShipments = (id) => {
  return $form.put(`shipments/${id}/ship`)
}
exports.getStorage = (params) => {
  return $form.get('shipment-logs/in-storage', { params })
}
exports.getPick = () => {
  return $form.get('shipment-logs/picking')
}
exports.getProps = () => {
  return $form.get('package-props')
}
exports.getWarehouse = (params) => {
  return $form.get('packages', { params })
}
exports.submitPackage = (id, params) => {
  return $form.put(`packages/${id}`, params)
}
exports.getWarehouseList = (params) => {
  return $form.get('packages/in-warehouse-info', { params })
}
exports.getStorageList = (params) => {
  return $form.get('shipments/in-warehouse-info', { params })
}
// 完成已支付
exports.getPay = (id) => {
  return $form.put(`orders/${id}/paid`)
}
// 添加物流单号
exports.updateLogistics = (params) => {
  return $form.put('orders/update-logistics', params)
}
exports.getExpress = (params) => {
  return $form.post(`shipments/in-storage`, params)
}
// 入库 添加新包裹
exports.addShipment = (params) => {
  return $form.post('shipments/in-storage/add', params)
}
// 入库 自动匹配客户ID
exports.Automatic = (params) => {
  return $form.get('shipments/in-storage/user-search', { params })
}
exports.getExpressLine = (id) => {
  return $form.get(`express-lines/${id}`)
}
exports.saveEditLine = (id, params) => {
  return $form.put(`express-lines/${id}`, params)
}
exports.updateLines = (params) => {
  return $form.post('express-lines', params)
}
exports.getOrder = (params) => {
  return $form.get('orders', { params })
}
exports.getOrderDetails = (id) => {
  return $form.get(`orders/${id}`)
}
exports.saveOrderPack = (id, params) => {
  return $form.put(`orders/${id}/pack`, params)
}
// 客户地址
exports.getUserAddress = (params) => {
  return $form.get('user-addresses', { params })
}
// 获取客户列表
exports.getUsers = (params) => {
  return $form.get('users', { params })
}
// 获取客户组列表
exports.getUserGroup = (params) => {
  return $form.get('user-groups', { params })
}
// 获取用户组列表
exports.getSimple = () => {
  return $form.get('user-groups/simple-list')
}
// 修改客户组资料
exports.editUserGroup = (id, params) => {
  return $form.put(`user-groups/${id}`, params)
}
// 删除下单须知
exports.deleteNotice = (params) => {
  return $form.put('order-notices/batch-delete', params)
}
// 新建客户组资料
exports.addUserGroup = (params) => {
  return $form.post('user-groups', params)
}
// 获取管理员组权限设置
exports.getPermissions = (id) => {
  return $form.get(`admin-groups/${id}/permissions`)
}
// 修改员工组权限
exports.updatePermissions = (id, params) => {
  return $form.put(`admin-groups/${id}/permissions`, params)
}
// 获得发货单
exports.getInvoice = () => {
  return $form.get('orders/shipments')
}
// 删除国内订单
exports.deletePackages = (ids) => {
  return $form.put('packages/batch-delete', ids)
}
// 获取国内订单筛选数据
exports.getAgent = () => {
  return $form.get('agents/simple-list')
}
// 获取国内订单 无人认领包裹
exports.getNoOwner = () => {
  return $form.get('packages/no-owner')
}

// 代理管理 获取单条详细
exports.getEditAgent = (id) => {
  return $form.get(`agents/${id}`)
}
// 加入发货单
exports.updateShipment = (ids, shipment) => {
  return $form.put(`orders/add-to-shipment`, {
    order_ids: ids,
    shipment_id: shipment
  })
}
// 修改客户组
exports.changeUserList = (id, groupId) => {
  return $form.put(`users/${id}/group/${groupId}`)
}
// 修改密码
exports.changePassword = (params) => {
  return $form.put('modify-password', params)
}
// 获取配置下的代理列表
exports.getAgents = (params) => {
  return $form.get('agents', { params })
}
// 获取代理列表的成交记录
exports.getAgentOrders = (id) => {
  return $form.get(`agents/${id}/deal-orders`)
}
// 完成成交记录
exports.finishOrders = (id) => {
  return $form.put(`agents/commission/${id}`)
}
// 代理管理的添加代理
exports.addAgents = (params) => {
  return $form.post('agents', params)
}
// 小程序配置
exports.getMini = () => {
  return $form.get('mini-program/settings')
}
// 编辑保存小程序配置
exports.updateMini = (params) => {
  return $form.put('mini-program/settings', params)
}
// 获取消息模版
exports.getTemplate = () => {
  return $form.get('mini-program/templates')
}
// 更新 消息模版
exports.updateTemplate = (params) => {
  return $form.put('mini-program/templates', params)
}
// 文件上传
exports.uploadFiles = (params) => {
  return $file.post('upload/files', params)
}
// 获取微信支付
exports.getWechat = () => {
  return $form.get('payments/wechat')
}
// 更改 微信支付
exports.updateWechat = (params) => {
  return $form.put('payments/wechat', params)
}
// 获取全部重量及货币配置
exports.getLocalization = () => {
  return $form.get('localization/configs')
}
// 获取当前选择的重量及货币配置
exports.chooseLocalization = () => {
  return $form.get('localization')
}
// 更改当前的重量及货币配置
exports.confirmLocalization = (params) => {
  return $form.put('localization', params)
}
// 获取物品属性
exports.getPackage = () => {
  return $form.get('package-props')
}
// 添加新属性
exports.addPackage = (params) => {
  return $form.post('package-props', params)
}
// 删除物品属性
exports.deleteProps = (ids) => {
  return $form.put('package-props/batch-delete', ids)
}
// 获取 物流跟踪配置
exports.getLogistics = () => {
  return $form.get('logistics')
}
// 更改 物流跟踪配置
exports.editLogistics = (params) => {
  return $form.put('logistics', params)
}
// 营销管理 新用户福利
exports.getCoupons = () => {
  return $form.get('new-user-coupons')
}
// 营销管理 修改新用户福利
exports.editCoupons = (params) => {
  return $form.put('new-user-coupons', params)
}
// 营销管理 抵用券管理
exports.getCouponList = (params) => {
  return $form.get('coupons', { params })
}
// 添加抵用券
exports.addCoupons = (params) => {
  return $form.post('coupons', params)
}
// 用户分发优惠券
exports.addLaunch = (id, ids) => {
  return $form.put(`coupons/${id}/launch/user`, ids)
}
// 用户组分发优惠券
exports.addLaunchGroup = (id, ids) => {
  return $form.put(`coupons/${id}/launch/group`, ids)
}
// 记录
exports.userCoupons = (id) => {
  return $form.get(`coupons/${id}/user-coupons`)
}
// 作废
exports.disableCoupons = (id) => {
  return $form.patch(`coupons/${id}/disable`)
}

/**
 * 上传图片
 * @param {Array} images 图片对象数组
 *  iamges[*].file 文件
 */
exports.uploadImg = (images) => $file.post('upload/images', images)

exports.forbidLogin = (ids) => $json.put('users/forbid-login', { forbid_id: ids })

// 获取首页统计数据
exports.getIndexNumber = () => $form.get('statistics/index-data')
// 获取首页图表数据
exports.getIndexData = (params) => $form.get('statistics/index-log', { params })

// 获取运单下的所有订单
exports.getOrdersByShipment = (id) => $form.get(`shipments/${id}/orders`)
// 移除发货单
exports.removeOrders = (id) => {
  return $form.put('orders/remove-from-shipment', id)
}
// 运单 获取审核
exports.getTransfer = (id) => {
  return $form.get(`orders/${id}/transfer-pay-info`)
}
// 审核通过
exports.acceptPayment = (id, params) => {
  return $form.put(`orders/${id}/payment/accept`, params)
}
//  审核拒绝
exports.acceptReject = (id, params) => {
  return $form.put(`orders/${id}/payment/refuse`, params)
}
// 完成支付
exports.finishOrder = (id) => {
  return $form.put(`orders/${id}/paid`)
}

// 注册验证码
exports.getRegisterCode = (phone) => $form.post('register/apply', { phone })

// 注册
exports.register = (params) => $json.post('register', params)

// 获取图片验证码
exports.getCaptcha = () => $form.get('captcha')

// 重置密码验证码
exports.getResetCode = (phone) => $form.post('reset-password/apply', { phone })

// 重置密码
exports.resetPassword = (params) => $json.put('reset-password', params)
export default exports
