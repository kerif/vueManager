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
// 配置 路线
exports.getLines = (params) => {
  return $form.get('express-lines', { params })
}
// 配置 路线修改开启或关闭
exports.resetLines = (id, status) => {
  return $form.put(`express-lines/${id}/status/${status}`)
}
// 配置 路线 导出清单
exports.importLines = () => {
  return $form.get(`express-lines/excel-export-all`)
}
// 配置 路线 获取全部仓库信息
exports.getAllWarehouse = () => {
  return $form.get('express-lines/warehouses')
}
// 配置 路线 获取某条其余费用
exports.getCosts = (id) => {
  return $form.get(`express-lines/${id}/costs`)
}
// 配置 路线 修改某条其余费用
exports.updateCosts = (id, params) => {
  return $form.put(`express-lines/${id}/costs`, params)
}
// 配置 路线 增加其余费用
exports.addLinesCost = (params) => {
  return $form.post('express-lines/costs', params)
}
// 配置 路线 获取支持国家/地区
exports.supportCountry = (ids) => {
  return $form.post('express-lines/warehouse-countries', ids)
}
// 配置 路线 获取路线icon
exports.iconLines = () => {
  return $form.get(`express-lines/icons`)
}
// 配置 路线icon 设置为默认
exports.asDefault = (id) => {
  return $form.put(`express-lines/icons/${id}/as-default`)
}
// 配置 路线icon 删除
exports.deleteIcon = (id) => {
  return $form.delete(`express-lines/icons/${id}`)
}
// 配置 路线icon  新建
exports.addIcon = (params) => {
  return $form.post('express-lines/icons', params)
}
// 配置 路线 获取全部路线icon
exports.getAllIcon = () => {
  return $form.get('express-lines/simple-icon-list')
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
// 获取员工组信息
exports.getGroup = (id) => {
  return $form.get(`admin-groups/${id}`)
}
exports.getVipMember = (id, params) => {
  return $form.get(`admin-groups/${id}/members`, { params })
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
exports.getUserMembers = (id, params) => {
  return $form.get(`user-groups/${id}/members`, { params })
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
// 客户 券包 删除优惠券
exports.deleteCoupons = (id, ids) => {
  return $form.put(`users/${id}/coupons/${ids}/disabled`)
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
exports.saveCountries = (id) => {
  return $form.post('countries', id)
}
// 财务 流水记录
exports.getTransaction = (params) => {
  return $form.get('transaction-records', { params })
}
// 流水记录 获取下拉框
exports.getPaymentType = () => {
  return $form.get('transaction-records/payment-types')
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
exports.getPick = (params) => {
  return $form.get('shipment-logs/picking', { params })
}
// 包裹快速入库 获取全部物品属性
exports.getProps = () => {
  return $form.get('package-props')
}
// 包裹快速入库 获取全部服务
exports.getAllService = () => {
  return $form.get('packages/package-services')
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
// 包裹快速入库
exports.getStorageList = (params) => {
  return $form.get('shipments/in-warehouse-info', { params })
}
// 包裹快速入库 获取仓库列表数据
exports.getSimpleWarehouse = () => {
  return $form.get('shipments/warehouse-simple-list')
}
// 包裹快速入库 获取商品清单
exports.getProductDetails = (id) => {
  return $form.get(`packages/${id}`)
}
// 完成已支付
exports.getPay = (id) => {
  return $form.put(`orders/${id}/paid`)
}
// 添加转运快递单号
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
// 发货单 批量加入发货单
exports.allOrderSn = (id, params) => {
  return $form.put('shipments/add-order-by-sn', id, params)
}
// 删除预报包裹列表
exports.deletePackages = (ids) => {
  return $form.put('packages/batch-delete', ids)
}
// 获取预报包裹列表筛选数据
exports.getAgent = () => {
  return $form.get('agents/simple-list')
}
// 无人认领包裹
exports.getNoOwner = (params) => {
  return $form.get('packages/no-owner', { params })
}
// 无人认领包裹 获取认领包裹的id
exports.getClaimList = (params) => {
  return $form.get('packages/user-search', { params })
}
// 预报包裹列表 获得仓库列表数据
exports.getSimpleList = () => {
  return $form.get('packages/warehouse-simple-list')
}
// 预报包裹列表 打印标签 查看
exports.checkPackageLabel = (id) => {
  return $form.get(`packages/${id}/label/html`)
}
// 预报包裹列表 打印标签 确认下载
exports.updatePackagePdf = (id) => {
  return $form.get(`packages/${id}/label/pdf`)
}
// 代理管理 获取单条详细
exports.getEditAgent = (id) => {
  return $form.get(`agents/${id}`)
}
// 代理管理 开关代理是否启用
exports.resetAgents = (id, status) => {
  return $form.put(`agents/${id}/status/${status}`)
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
exports.getAgentOrders = (id, params) => {
  return $form.get(`agents/${id}/deal-orders`, { params })
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
// 小程序配置 获取图片配置
exports.getProgramImg = () => {
  return $form.get('mini-program/images')
}
// 小程序配置 修改图片配置
exports.changeProgramImg = (params) => {
  return $form.put('mini-program/images', params)
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
// 配置 获取仓库地址配置
exports.getWarehouseAddress = (params) => {
  return $form.get('warehouse-address', { params })
}
// 配置 新建仓库地址配置
exports.addWarehouseAddress = (params) => {
  return $form.post('warehouse-address', params)
}
// 配置 获取单条仓库地址配置
exports.aloneWarehouseAddress = (id) => {
  return $form.get(`warehouse-address/${id}`)
}
// 配置 编辑保存单条仓库地址配置
exports.editWarehouseAddress = (id, params) => {
  return $form.put(`warehouse-address/${id}`, params)
}
// 配置 删除单条仓库地址配置
exports.deleteWarehouseAddress = (id) => {
  return $form.delete(`warehouse-address/${id}`)
}
// 配置 仓库地址配置 获取数据库全部国家
exports.AutoCountry = (params) => {
  return $form.get('countries/search', { params })
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
// 更多配置 获取微信配置是否启用
exports.getPaymentOnline = () => {
  return $form.get(`payments/wechat/status`)
}
// 更多配置 开启或关闭微信配置
exports.changePayment = (status) => {
  return $form.put(`payments/wechat/status/${status}`)
}
// 更多配置 获取转账支付
exports.getPayments = () => {
  return $form.get('payments')
}
// 添加转账支付方式
exports.addPayments = (params) => {
  return $form.post('payments', params)
}
// 更多配置 删除单条转账支付
exports.deleteTransfer = (id) => {
  return $form.delete(`payments/${id}`)
}
// 获取转账支付详情
exports.editPayments = (id) => {
  return $form.get(`payments/${id}`)
}
// 修改转账支付详情
exports.updatePayments = (id, params) => {
  return $form.put(`payments/${id}`, params)
}
// 修改转账支付的开关启用
exports.closePayments = (id, status) => {
  return $form.put(`payments/${id}/status/${status}`)
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
// 更多配置 订单获取增值服务
exports.getValue = (params) => {
  return $form.get('value-added-services', { params })
}
// 更多配置 订单添加增值服务
exports.addValue = (params) => {
  return $form.post(`value-added-services`, params)
}
// 更多配置 订单获取单条增值服务
exports.getService = (id) => {
  return $form.get(`value-added-services/${id}`)
}
// 更多配置 订单修改单条增值服务
exports.updateService = (id, params) => {
  return $form.put(`value-added-services/${id}`, params)
}
// 更多配置 订单删除单条增值服务
exports.deleteValue = (id) => {
  return $form.delete(`value-added-services/${id}`)
}
// 更多配置 订单增值服务 开关启用状态
exports.closeValue = (id, status) => {
  return $form.put(`value-added-services/${id}/status/${status}`)
}
// 更多配置 包裹获取增值服务
exports.getParcel = (params) => {
  return $form.get('package-services', { params })
}
// 更多配置 包裹添加增值服务
exports.addParcel = (params) => {
  return $form.post(`package-services`, params)
}
// 更多配置 包裹获取单条增值服务
exports.getPaVal = (id) => {
  return $form.get(`package-services/${id}`)
}
// 更多配置 包裹修改单条增值服务
exports.updateParcel = (id, params) => {
  return $form.put(`package-services/${id}`, params)
}
// 更多配置 包裹删除单条增值服务
exports.deleteParcel = (id) => {
  return $form.delete(`package-services/${id}`)
}
// 更多配置 包裹增值服务 开关启用状态
exports.closeParcel = (id, status) => {
  return $form.put(`package-services/${id}/status/${status}`)
}
// 更多配置 其余配置 获取
exports.getWebsite = () => {
  return $form.get('website-settings')
}
// 更多配置 其余配置 修改
exports.editWebsite = (params) => {
  return $form.put('website-settings', params)
}
// 更多配置 获取商品分类管理
exports.getCategories = (params) => {
  return $form.get('package-categories', { params })
}
// 更多配置 商品分类管理 开启或关闭 是否显示
exports.closeCategories = (id, status) => {
  return $form.put(`package-categories/${id}/status/${status}`)
}
// 更多配置 商品分类管理 开启或关闭 风险提示
exports.closeRisk = (id, status) => {
  return $form.put(`package-categories/${id}/risk-warning-status/${status}`)
}
// 更多配置 获取商品分类管理二级菜单
exports.getSecondCategories = (id) => {
  return $form.get(`package-categories/${id}/children`)
}
// 更多配置 删除商品分类管理
exports.deleteCategories = (id) => {
  return $form.delete(`package-categories/${id}`)
}
// 更多配置 获取商品分类风险提示
exports.getRiskDetails = (id) => {
  return $form.get(`package-categories/${id}`)
}
// 更多配置 修改商品分类风险提示
exports.updateRiskDetails = (id, params) => {
  return $form.put(`package-categories/${id}/risk-warning`, params)
}
// 更多配置 获取商品分类的全部分类
exports.getAllTree = () => {
  return $form.get('package-categories/tree')
}
// 更多配置 修改商品分类
exports.updateCategories = (id, params) => {
  return $form.put(`package-categories/${id}`, params)
}
// 更多配置 新建商品分类
exports.newCategories = (params) => {
  return $form.post(`package-categories`, params)
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
// 营销管理 获取视频列表
exports.getVideoList = () => {
  return $form.get('videos')
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
exports.userCoupons = (id, params) => {
  return $form.get(`coupons/${id}/user-coupons`, { params })
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

// 获取订单下的所有订单
exports.getOrdersByShipment = (id, params) => $form.get(`shipments/${id}/orders`, { params })
// 订单列表 获取增值服务
exports.getAdded = () => {
  return $form.get('orders/value-added-services')
}
// 订单列表 获取订单统计数据
exports.getCounts = () => {
  return $form.get('orders/order-counts')
}
// 订单 打包 获取线路详情
exports.getUsable = (id) => {
  return $form.get(`orders/${id}/usable-express-lines`)
}
// 订单 打印标签 查看
exports.checkOrderLabel = (id) => {
  return $form.get(`orders/${id}/label/html`)
}
// 订单 打印标签 确认下载
exports.updateOrderPdf = (id) => {
  return $form.get(`orders/${id}/label/pdf`)
}
// 订单 修改物流信息 获取转运快递公司
exports.getCompanies = (params) => {
  return $form.get(`orders/express-num/${params}/companies`)
}
// 移除发货单
exports.removeOrders = (id) => {
  return $form.put('orders/remove-from-shipment', id)
}
// 删除发货单
exports.deleteShip = (id) => {
  return $form.delete(`shipments/${id}`)
}
// 发货单 导出清单
exports.uploadExcel = (id) => {
  return $form.get(`shipments/${id}/order-export`)
}
// 运单 获取审核
exports.getTransfer = (id) => {
  return $form.get(`orders/${id}/transfer-pay-info`)
}
// 运单 从流水记录跳转过来
exports.getReview = (id) => {
  return $form.get(`transaction-records/order/${id}/transfer-pay-info`)
}
// 当支付方式为微信的时候，跳至财务流水详情
exports.getRecords = (id) => {
  return $form.get(`transaction-records/${id}`)
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

// 获取权限
exports.getCurrentUserPermissions = () => $form.get('menu-tree')
export default exports
