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
// 获取高级配置
// exports.getSorting = (id) => {
//   return $form.get(`orders/${id}/re-sorting`)
// }
// 配置 路线修改开启或关闭
exports.resetLines = (id, status) => {
  return $form.put(`express-lines/${id}/status/${status}`)
}
// 配置 路线 导出清单
exports.importLines = () => {
  return $form.get(`express-lines/excel-export-all`)
}
// 路线 获取额外收录信息
exports.getFee = (id) => {
  return $form.get(`express-lines/${id}/extra-remark`)
}
// 更改额外收录信息
exports.updateFee = (id, params) => {
  return $form.put(`express-lines/${id}/extra-remark`, params)
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
// 配置 路线 复制 线路
exports.copyLine = (id, params) => {
  return $form.post(`express-lines/${id}/copy`, params)
}
// 配置 路线 获取支持国家/地区
exports.supportCountry = (ids) => {
  return $form.post('express-lines/warehouse-countries', ids)
}
// 配置 路线 获取路线icon
exports.iconLines = (params) => {
  return $form.get(`express-lines/icons`, { params })
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
// 配置 路线icon  获取单条
exports.getIcon = (id) => {
  return $form.get(`express-lines/icons/${id}`)
}
// 配置 路线icon 更新某条
exports.updateIcon = (id, params) => {
  return $form.put(`express-lines/icons/${id}`, params)
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
  return $form.get('articles', { params })
}
exports.saveNotice = (params) => {
  return $form.post(`articles`, params)
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
// 客服中心 投诉建议
exports.getSuggest = (params) => {
  return $form.get('suggestions', { params })
}
// 投诉建议 获取单条详细
exports.getSuggests = (id) => {
  return $form.get(`suggestions/${id}`)
}
exports.submitSuggest = (id, params) => {
  return $form.put(`suggestions/${id}/status`, params)
}
// 客服中心 获取评价管理列表
exports.getComments = (params) => {
  return $form.get('order-comments', { params })
}
// 客服中心 取消或设置精选
exports.updateRecommend = (id, status) => {
  return $form.put(`order-comments/${id}/recommend/${status}`)
}
// 客服中心 公告管理
exports.getAnnouncements = (params) => {
  return $form.get('announcements', { params })
}
// 获取单条公告详细
exports.getSingleAnnouncements = (id) => {
  return $form.get(`announcements/${id}`)
}
// 下单需知 获取语言单条详细
exports.publicLang = (id, params) => {
  return $form.get(`announcements/${id}`, { params })
}
// 下单需知 更新语言配置
exports.updatePublicLang = (id, params) => {
  return $form.put(`announcements/${id}/translate-data`, params)
}
// 更新单条公告详情
exports.updateAnnouncements = (id, params) => {
  return $form.put(`announcements/${id}`, params)
}
// 删除公告
exports.announcementsDelete = (ids) => {
  return $form.put('announcements/batch-delete', ids)
}
// 新建公告
exports.addAnnouncements = (params) => {
  return $form.post('announcements', params)
}
// 文章管理 获取单条详情
exports.getNoticeDetails = (id) => {
  return $form.get(`articles/${id}`)
}
// 文章管理 获取语言单条详细
exports.noticeLang = (id, params) => {
  return $form.get(`articles/${id}`, { params })
}
// 文章管理 更新语言配置
exports.updateNoticeLang = (id, params) => {
  return $form.put(`articles/${id}/translate-data`, params)
}
// 文章管理 获取所有文章分类
exports.getArticlesType = () => {
  return $form.get(`articles/types`)
}
exports.saveNoticeDetails = (id, params) => {
  return $form.put(`articles/${id}`, params)
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
// 流水记录 获取充值方式下拉框
exports.getPaymentType = () => {
  return $form.get('transaction-records/payment-types')
}
// 财务 充值记录
exports.getRecharge = (params) => {
  return $form.get('recharge-records', { params })
}
// 充值记录 详细
exports.getRechargeDetails = (id) => {
  return $form.get(`recharge-records/${id}`)
}
// 充值记录 获取充值方式下拉框
exports.getRechargeType = () => {
  return $form.get('recharge-records/payment-types')
}
// 充值记录 审核通过
exports.rechargePassed = (id, params) => {
  return $form.put(`recharge-records/${id}/approved`, params)
}
// 充值记录 新增 获取可用充值方式
exports.getRechargePaymentType = () => {
  return $form.get('recharge-records/enabled-payment-types')
}
// 充值记录 新增 获取客户id
exports.AutoRecords = (params) => {
  return $form.get('recharge-records/user-search', { params })
}
// 充值记录 新增
exports.addRecords = (params) => {
  return $form.post('recharge-records', params)
}
// 余额扣款处理 新建
exports.addDeductions = (params) => {
  return $form.post('money-deductions', params)
}
// 余额扣款处理 自动匹配客户ID
exports.AutoDeductions = (params) => {
  return $form.get('money-deductions/user-search', { params })
}
// 代理管理 审核拒绝
exports.rechargeReject = (id, params) => {
  return $form.put(`recharge-records/${id}/refused`, params)
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
// 获取自提点数据
exports.autoPick = (id) => {
  return $form.get(`express-lines/${id}/self-pickup-stations`)
}
// 更新自提点
exports.updateAutoPick = (id, params) => {
  return $form.put(`express-lines/${id}/advance-settings`, params)
}
// 包裹快速合箱 获取自提点数据
exports.selfData = () => {
  return $form.get(`package-packs/stations`)
}
// 包裹快速合箱 按预报批次集包
exports.groupBy = (params) => {
  return $form.get('package-packs/packages-group-by-batch', { params })
}
// 包裹快速入库 获取全部物品属性
exports.getProps = () => {
  return $form.get('package-props')
}
// 包裹快速入库 获取全部服务
exports.getAllService = () => {
  return $form.get('packages/package-services')
}
// 包裹快速入库 获取全部快递公司
exports.getExpressData = () => {
  return $form.get('express-companies')
}
// 包裹快速入库 获取全部寄往地区
exports.getArea = (id) => {
  return $form.get(`shipments/warehouse/${id}/countries`)
}
// 包裹快速入库 新增商品清单
exports.updatePackagesDetails = (id, params) => {
  return $form.post(`packages/${id}/details`, params)
}
// 包裹快速入库 获取商品清单列表
exports.getPackageList = (id) => {
  return $form.get(`packages/${id}/details`)
}
// 包裹快速入库 获取单条商品清单数据
exports.getSingleDetails = (id, ele) => {
  return $form.get(`packages/${id}/details/${ele}`)
}
// 包裹快速入库 编辑保存单条商品清单数据
exports.saveSingleDetails = (id, ele, params) => {
  return $form.put(`packages/${id}/details/${ele}`, params)
}
// 包裹快速入库 通过快递单号拉取详情接口
exports.getShipmentNum = (id) => {
  return $form.get(`shipments/package-num/${id}/id`)
}
// 包裹快速入库 删除单条商品清单数据
exports.deleteSingleDetails = (id, ele) => {
  return $form.delete(`packages/${id}/details/${ele}`)
}
exports.getWarehouse = (params) => {
  return $form.get('packages', { params })
}
// 包裹快速入库 保存从未入库快速入库
exports.submitPackage = (id, params) => {
  return $form.put(`packages/${id}`, params)
}
// 包裹快速入库 保存已入库的资料修改
exports.submitEditPackage = (id, params) => {
  return $form.put(`packages/${id}/info`, params)
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
// 入库 添加未预报的新包裹
exports.addShipment = (params) => {
  return $form.post('shipments/in-storage/add', params)
}
// 入库 自动匹配客户ID
exports.Automatic = (params) => {
  return $form.get('shipments/in-storage/user-search', { params })
}
// 入库 货位匹配
exports.AutoLocation = (id, params) => {
  return $form.get(`shipments/warehouse/${id}/goods-allocation-like`, { params })
}
// 新增货位
exports.addLocation = (id, params) => {
  return $form.post(`warehouse-address/${id}/goods-allocation-areas`, params)
}
// 获取单条货位详情
exports.getAllLocation = (id, areaId) => {
  return $form.get(`warehouse-address/${id}/goods-allocation-areas/${areaId}`)
}
// 货位 锁定 或 解锁
exports.lockLocation = (id, areaId, status) => {
  return $form.put(`warehouse-address/${id}/goods-allocation-areas/location/${areaId}/status/${status}`)
}
// 删除货位
exports.deleteLocation = (id, areaId) => {
  return $form.delete(`warehouse-address/${id}/goods-allocation-areas/${areaId}`)
}
// 编辑保存单条货位详情
exports.updateAllLocation = (id, areaId, params) => {
  return $form.put(`warehouse-address/${id}/goods-allocation-areas/${areaId}`, params)
}
// 获取单条货位列表
exports.getLocationList = (id, areaId, params) => {
  return $form.get(`warehouse-address/${id}/goods-allocation-areas/${areaId}/details`, { params })
}
// 获取路线 详情
exports.getExpressLine = (id) => {
  return $form.get(`express-lines/${id}`)
}
// 路线 获取语言详情
exports.lineLang = (id, params) => {
  return $form.get(`express-lines/${id}`, { params })
}
// 路线 更改语言详情
exports.updateLineLang = (id, params) => {
  return $form.put(`express-lines/${id}/translate-data`, params)
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
// 客户 代理管理 单条提现申请
exports.agentsWithdraws = (id, params) => {
  return $form.get(`agents/${id}/withdraws`, { params })
}
// 代理管理 佣金详情
exports.withdrawsIds = (paramsId, id) => {
  return $form.get(`agents/${paramsId}/withdraws/${id}`)
}
// 代理管理 审核通过
exports.agentPassed = (userId, id, params) => {
  return $form.put(`agents/${userId}/withdraws/${id}/approved`, params)
}
// 代理管理 审核拒绝
exports.agentReject = (userId, id, params) => {
  return $form.put(`agents/${userId}/withdraws/${id}/refused`, params)
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
// 删除文章管理
exports.deleteNotice = (params) => {
  return $form.put('articles/batch-delete', params)
}
// 新建客户组资料
exports.addUserGroup = (params) => {
  return $form.post('user-groups', params)
}
// 客户 代理申请列表
exports.getApplication = (params) => {
  return $form.get(`agent-applications`, { params })
}
// 客户 代理申请列表 审核通过
exports.agentApproved = (id, params) => {
  return $form.put(`agent-applications/${id}/approved`, params)
}
// 客户 代理申请列表 审核拒绝
exports.refusedApproved = (id) => {
  return $form.put(`agent-applications/${id}/refused`)
}
// 新增 客户
exports.addVip = (params) => {
  return $form.post('users/add-user', params)
}
// 代理申请列表 删除
exports.deleteApproved = (id) => {
  return $form.delete(`agent-applications/${id}`)
}
// 获取管理员组权限设置
exports.getPermissions = (id) => {
  return $form.get(`admin-groups/${id}/permissions`)
}
// 修改员工组权限
exports.updatePermissions = (id, params) => {
  return $form.put(`admin-groups/${id}/permissions`, params)
}
// 员工组 获取单条所属仓库
exports.getAffiliation = (id) => {
  return $form.get(`admin-groups/${id}/warehouse-affiliation`)
}
// 员工组 获取全部所属仓库
exports.getAffiliationAll = () => {
  return $form.get(`admin-groups/warehouse-simple-list`)
}
// 修改所属仓库
exports.editAffiliation = (id, warehouseId) => {
  return $form.put(`admin-groups/${id}/warehouse-affiliation/${warehouseId}`)
}
// 获得发货单
exports.getInvoice = () => {
  return $form.get('orders/shipments')
}
// 发货单 批量加入发货单
exports.allOrderSn = (id, params) => {
  return $form.put('shipments/add-order-by-sn', id, params)
}
// 发货单 确认添加物流信息
exports.confirmExpress = (id, params) => {
  return $form.put(`shipments/${id}/logistics-sn`, params)
}
// 发货单 确认批量上传单号
exports.updateBatch = (id, params) => {
  return $form.put(`shipments/${id}/logistics-import`, params)
}
// 删除预报包裹列表
exports.deletePackages = (ids) => {
  return $form.put('packages/batch-delete', ids)
}
// 预报包裹列表 获取订单统计数据
exports.getOrderCounts = (params) => {
  return $form.get('packages/counts', { params })
}
// 批量发送通知
exports.sendingNotify = (params) => {
  return $form.post('re-notify', params)
}
// 彻底删除 预报包裹
exports.deleteDiscard = (ids) => {
  return $form.put('packages/batch-complete-delete', ids)
}
// 预报包裹列表 批量恢复被弃件包裹
exports.restoreDiscard = (ids) => {
  return $form.put('packages/batch-restore', ids)
}
// 预报包裹入库 批量弃件
exports.deleteInvalid = (ids) => {
  return $form.put('packages/batch-invalid', ids)
}
// 预报包裹列表 弃件日志
exports.getInvalidLog = (id) => {
  return $form.get(`packages/${id}/operate-logs`)
}
// 获取预报包裹列表筛选数据
exports.getAgent = () => {
  return $form.get('agents/simple-list')
}
// 无人认领包裹
exports.getNoOwner = (params) => {
  return $form.get('packages/no-owner', { params })
}
// 无人认领包裹 导出
exports.uploadNoOwner = () => {
  return $form.get('packages/no-owner/export')
}
// 无人认领包裹 获取认领包裹的id
exports.getClaimList = (params) => {
  return $form.get('packages/user-search', { params })
}
// 无人认领 认领包裹
exports.claimPackage = (id, users) => {
  return $form.put(`packages/no-owner/${id}/owner`, users)
}
// 无人认领包裹 删除
exports.deleteNoOwner = (ids) => {
  return $form.put('packages/no-owner/batch-delete', ids)
}
// 预报包裹列表 导出
exports.uploadPackage = () => {
  return $form.get('packages/export')
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
// 代理管理 获取设置佣金
exports.getCommissions = (id, params) => {
  return $form.get(`agents/${id}/line-commissions`, { params })
}
// 代理管理 更新佣金
exports.updateCommissions = (id, params) => {
  return $json.put(`agents/${id}/line-commissions`, params)
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
// 小程序配置 获取海报配置
exports.getProgramShare = () => {
  return $form.get('mini-program/share-page-info')
}
// 更新海报配置
exports.updateProgramShare = (params) => {
  return $form.put('mini-program/share-page-info', params)
}
// 获取功能配置
exports.getValidate = () => {
  return $form.get(`mini-program/configs`)
}
// 更新 功能配置
exports.updateValidate = (params) => {
  return $form.put(`mini-program/configs`, params)
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
exports.updateWechat = (params) => {
  return $form.put('payments/wechat', params)
}
// 获取paypal支付
exports.getPaypal = () => {
  return $form.get('payments/paypal')
}
// 更改 微信支付
exports.updatePaypal = (params) => {
  return $form.put('payments/paypal', params)
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
// 获取仓库地址配置语言
exports.warehouseLang = (id, params) => {
  return $form.get(`warehouse-address/${id}`, { params })
}
// 仓库地址配置 更改语言详情
exports.updateWarehouseLang = (id, params) => {
  return $form.put(`warehouse-address/${id}/translate-data`, params)
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
// 仓库地址 获取单条仓库管理
exports.locationArea = (id, params) => {
  return $form.get(`warehouse-address/${id}/goods-allocation-areas`, { params })
}
// 获取全部重量及货币配置
exports.getLocalization = () => {
  return $form.get('localization/configs')
}
// 获取全部结算货币
exports.getAllRate = () => {
  return $form.get('localization/currency-list')
}
// 获取当前选择的重量及货币配置
exports.chooseLocalization = () => {
  return $form.get('localization')
}
// 保险服务 获取保险说明
exports.getExplanation = () => {
  return $form.get('payments/insurance/explanation')
}
// 保险服务 更新保险说明
exports.updateExplanation = (params) => {
  return $form.put('payments/insurance/explanation', params)
}
// 更改当前的重量及货币配置
exports.confirmLocalization = (params) => {
  return $form.put('localization', params)
}
// 小程序配置 获取如何下单
exports.getInstructions = () => {
  return $form.get('mini-program/instructions')
}
// 小程序配置 更新如何下单
exports.updateInstructions = (params) => {
  return $form.put('mini-program/instructions', params)
}
// 更多配置 获取微信配置是否启用
exports.getPaymentOnline = () => {
  return $form.get(`payments/payment/status`)
}
// 更多配置 开启或关闭微信配置
exports.changePayment = (status, type) => {
  return $form.put(`payments/payment/status/${status}/${type}`)
}
// 更多配置 获取系统物流类型
exports.getSetSystem = () => {
  return $form.get('logistics-types/system')
}
// 更多配置 基础配置
exports.getBasic = () => {
  return $form.get('basic-settings')
}
// 更多配置 修改基础配置
exports.updateBasic = (params) => {
  return $form.put('basic-settings', params)
}
// 更多配置  获取汇率配置
exports.getRates = (params) => {
  return $form.get('exchange-rates', { params })
}
// 更多配置 删除汇率
exports.deleteRate = (id) => {
  return $form.delete(`exchange-rates/${id}`)
}
// 更多配置 自动获取
exports.autoGet = () => {
  return $form.get('exchange-rates/rate')
}
// 更多配置 新建汇率
exports.saveRate = (params) => {
  return $form.post('exchange-rates', params)
}
// 更多配置 新建汇率 开关启用状态
exports.closeRate = (id) => {
  return $form.put(`exchange-rates/${id}/enabled`)
}
// 更多配置 获取当前结算货币
exports.getCurrency = () => {
  return $form.get('exchange-rates/currency')
}
// 系统物流类型 修改开关启用
exports.closeSystem = (id, status) => {
  return $form.put(`logistics-types/system/${id}/status/${status}`)
}
// 系统物流类型 添加或修改语言
exports.updateTrackingLang = (id, params) => {
  return $form.put(`logistics-types/system/${id}/translate-data`, params)
}
// 系统物流类型 语言详情
exports.systemLang = (id, params) => {
  return $form.get(`logistics-types/system/${id}`, { params })
}
// 获取单条系统物流系统
exports.getAloneTracking = (id) => {
  return $form.get(`logistics-types/system/${id}`)
}
// 更新 单条系统物流系统
exports.updateAloneTracking = (id, params) => {
  return $form.put(`logistics-types/system/${id}`, params)
}
// 自定义物流系统列表
exports.TypeData = () => {
  return $form.get('logistics-types/custom')
}
// 自定义物流类型 修改开关启用
exports.closeType = (id, status) => {
  return $form.put(`logistics-types/custom/${id}/status/${status}`)
}
// 自定义物流类型 语言详情
exports.typeLang = (id, params) => {
  return $form.get(`logistics-types/custom/${id}`, { params })
}
// 自定义物流类型 添加或修改语言
exports.updateTypeLang = (id, params) => {
  return $form.put(`logistics-types/custom/${id}/translate-data`, params)
}
// 自定义物流类型 排序
exports.typeLocationIndex = (params) => {
  return $form.put('logistics-types/custom/sort-indexes', params)
}
// 新增 自定义物流系统
exports.addTypeData = (params) => {
  return $form.post('logistics-types/custom', params)
}
// 删除 自定义物流系统
exports.deleteTypeData = (id) => {
  return $form.delete(`logistics-types/custom/${id}`)
}
// 修改 自定义物流系统
exports.updateTypeData = (id, params) => {
  return $form.put(`logistics-types/custom/${id}`, params)
}
// 获取 单条自定义物流系统
exports.getAloneType = (id) => {
  return $form.get(`logistics-types/custom/${id}`)
}
// 更多配置 获取转账支付
exports.getPayments = () => {
  return $form.get('payments')
}
// 更多配置 获取模版配置
exports.getEmail = (params) => {
  return $form.get('email-templates', { params })
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
// 转账支付 语言详情
exports.paymentLang = (id, params) => {
  return $form.get(`payments/${id}`, { params })
}
// 转账支付 添加或修改语言
exports.updatePaymentLang = (id, params) => {
  return $form.put(`payments/${id}/translate-data`, params)
}
// 修改转账支付详情
exports.updatePayments = (id, params) => {
  return $form.put(`payments/${id}`, params)
}
// 修改转账支付的开关启用
exports.closePayments = (id, status) => {
  return $form.put(`payments/${id}/status/${status}`)
}
// 更多配置 获取预设充值金额
exports.getRechargeAmount = () => {
  return $form.get('payments/payment/default-amount')
}
// 更多配置 新增 预设充值金额
exports.updateRechargeAmount = (val) => {
  return $form.post(`payments/payment/default-amount/${val}`)
}
// 更多配置 删除 预设充值金额
exports.deleteRechargeAmount = (id) => {
  return $form.delete(`payments/payment/default-amount/${id}`)
}
// 获取物品属性
exports.getPackage = () => {
  return $form.get('package-props')
}
// 物品属性 语言详情
exports.propsLang = (params) => {
  return $form.get(`package-props`, { params })
}
// 物品属性 添加或修改语言
exports.updatePropsLang = (params) => {
  return $form.put(`package-props/translate-data`, params)
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
  return $form.get('configs')
}
// 更改 物流跟踪配置
exports.editLogistics = (params) => {
  return $form.put('configs', params)
}
// 更多配置 服务配置 检测快递100
exports.verifyKd100 = (params) => {
  return $form.post(`configs/verify-kd100`, params)
}
// 更多配置 服务配置 检测trackingmore 配置
exports.verifyTrackingMore = (params) => {
  return $form.post(`configs/verify-trackingmore`, params)
}
// 更多配置 服务配置 检测邮件发件信息配置
exports.verifySmtp = (params) => {
  return $form.post(`configs/verify-smtp`, params)
}
// 更多配置 服务配置 检测Juhe
exports.verifyJuhe = (params) => {
  return $form.post(`configs/verify-juhe`, params)
}
// 新增 邮件模版
exports.addEmail = (params) => {
  return $form.post('email-templates', params)
}
// 邮件模版 获取单条编辑 详细
exports.getAloneEmail = (id) => {
  return $form.get(`email-templates/${id}`)
}
// 邮件模版 获取邮件模版类型列表
exports.emailType = () => {
  return $form.get('email-templates/type-list')
}
// 下单需知 获取语言单条详细
exports.emailLang = (id, params) => {
  return $form.get(`email-templates/${id}`, { params })
}
// 下单需知 更新语言配置
exports.updateEmailLang = (id, params) => {
  return $form.put(`email-templates/${id}/translate-data`, params)
}
// 邮件模版 删除单条
exports.deleteAloneEmail = (id) => {
  return $form.delete(`email-templates/${id}`)
}
// 邮件模版 获取单条编辑 更新
exports.updateAloneEmail = (id, params) => {
  return $form.put(`email-templates/${id}`, params)
}
// 邮件模版 开发或关闭
exports.closeEmail = (id, status) => {
  return $form.put(`email-templates/${id}/status/${status}`)
}
// 获取支持语言列表
exports.languageList = () => {
  return $form.get('languages/enabled')
}
// 语言包 获取列表
exports.getLanguageList = () => {
  return $form.get('languages')
}
// 语言包 删除
exports.deleteLG = (id) => {
  return $form.delete(`languages/${id}`)
}
// 语言包 设为默认
exports.defaultLg = (id) => {
  return $form.put(`languages/${id}/set-default`)
}
// 语言包 开启或关闭
exports.changeLg = (id, status) => {
  return $form.put(`languages/${id}/set-status/${status}`)
}
// 语言包 获取全部支持语言
exports.getLanguageCan = () => {
  return $form.get(`languages/language-can-add`)
}
// 语言包 新增
exports.addLg = (params) => {
  return $form.post('languages', params)
}
// 语言包 获取单条详细
exports.singleLg = (id) => {
  return $form.get(`languages/${id}`)
}
// 更新单条详细
exports.updateLg = (id, params) => {
  return $form.put(`languages/${id}`, params)
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
// 更多配置 获取保险服务列表
exports.getInsurance = () => {
  return $form.get('payments/insurance')
}
// 更多配置 获取单条 保险服务
exports.getSingleInsurance = (id) => {
  return $form.get(`payments/insurance/${id}`)
}
// 更多配置 更新 保险服务
exports.updateInsurance = (id, params) => {
  return $form.post(`payments/insurance/${id}`, params)
}
// 更多配置 保险服务的开关
exports.changeInsurance = (status) => {
  return $form.put(`payments/insurance/switch/${status}`)
}
// 更多配置 获取国家/地区 列表
exports.countryLocation = () => {
  return $form.get('countries')
}
// 更多配置 删除国家/地区
exports.deleteCountryLocation = (id) => {
  return $form.delete(`countries/${id}`)
}
// 更多配置 国家地区 排序
exports.countryLocationIndex = (params) => {
  return $form.put('countries/sort-indexes', params)
}
// 订单增值服务 语言详情
exports.serviceLang = (id, params) => {
  return $form.get(`value-added-services/${id}`, { params })
}
// 更多配置 获取发货快递公司
exports.getExpressValue = (params) => {
  return $form.get('company-expresses', { params })
}
// 更多配置 获取详情 发货快递公司
exports.getExpressDetails = (id) => {
  return $form.get(`company-expresses/${id}`)
}
// 新增 发货快递公司
exports.addExpress = (params) => {
  return $form.post('company-expresses', params)
}
// 更新 发货快递公司
exports.updateExpress = (id, params) => {
  return $form.put(`company-expresses/${id}`, params)
}
// 删除 发货快递公司
exports.deleteExpress = (id) => {
  return $form.delete(`company-expresses/${id}`)
}
// 发货快递公司 启用或关闭
exports.closeExpress = (id, status) => {
  return $form.put(`company-expresses/${id}/status/${status}`)
}
// 发货快递公司 语言详情
exports.expressLang = (id, params) => {
  return $form.get(`company-expresses/${id}`, { params })
}
// 发货快递公司 添加或修改语言
exports.updateExpressLang = (id, params) => {
  return $form.put(`company-expresses/${id}/translate-data`, params)
}
// 订单增值服务 添加或修改语言
exports.updateServiceLang = (id, params) => {
  return $form.put(`value-added-services/${id}/translate-data`, params)
}
// 订单 运费查询
exports.queryExpress = (params) => {
  return $json.post('express-fee-query', params)
}
// 订单 运费查询 单条详情
exports.getLineDetail = (id) => {
  return $form.get(`express-fee-query/express-line/${id}`)
}
// 运费查询 获取寄往仓库
exports.getExpressFee = (params) => {
  return $form.get('express-fee-query/warehouses', { params })
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
// 包裹增值服务 语言详情
exports.packageLang = (id, params) => {
  return $form.get(`package-services/${id}`, { params })
}
// 包裹增值服务 添加或修改语言
exports.updatePackageLang = (id, params) => {
  return $form.put(`package-services/${id}/translate-data`, params)
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
// 更多配置 单号规则
exports.getRules = (params) => {
  return $form.get('serial-numbers', { params })
}
// 更多配置 单号规则 重新生成
exports.goResetId = () => {
  return $form.put(`serial-numbers/re-generate-uid`)
}
// 获取单号规则 详细
exports.getRulesDetails = (id) => {
  return $form.get(`serial-numbers/${id}`)
}
// 单号规则 更新详细
exports.updateRules = (id, params) => {
  return $form.put(`serial-numbers/${id}`, params)
}
// 更多配置 其余配置 获取
exports.getWebsite = () => {
  return $form.get('website-settings')
}
// 其余配置 语言详情
exports.pcLang = (params) => {
  return $form.get(`website-settings`, { params })
}
// 其余配置 添加或修改语言
exports.updatePcLang = (params) => {
  return $form.put(`website-settings/translate-data`, params)
}
// 更多配置 其余配置 修改
exports.editWebsite = (params) => {
  return $form.put('website-settings', params)
}
// 更多配置 获取商品分类管理
exports.getCategories = (params) => {
  return $form.get('package-categories', { params })
}
// 商品分类管理 获取语言单条详细
exports.categoriesLang = (id, params) => {
  return $form.get(`package-categories/${id}`, { params })
}
// 商品分类管理 更新语言配置
exports.updateCategoriesLang = (id, params) => {
  return $form.put(`package-categories/${id}/translate-data`, params)
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
// 更多配置 自提点配置
exports.getSelf = (params) => {
  return $form.get('self-pickup-stations', { params })
}
// 自提点配置 查看单条支持线路
exports.getPointLines = (id) => {
  return $form.get(`self-pickup-stations/${id}/express-lines`)
}
// 获取支持线路
exports.getStations = (params) => {
  return $form.get(`self-pickup-stations/express-line-list`, { params })
}
// 新建 自提点
exports.addSelf = (params) => {
  return $form.post('self-pickup-stations', params)
}
// 删除 自提点
exports.deleteSelf = (id) => {
  return $form.delete(`self-pickup-stations/${id}`)
}
// 自提点 获取详细
exports.getOneSelf = (id) => {
  return $form.get(`self-pickup-stations/${id}`)
}
// 自提点 更新
exports.updateOneSelf = (id, params) => {
  return $form.put(`self-pickup-stations/${id}`, params)
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
// 营销管理 下单返券
exports.rebateList = () => {
  return $form.get(`ordering-coupon`)
}
// 营销管理 更新 下单返券
exports.updateRebate = (params) => {
  return $form.put(`ordering-coupon`, params)
}
// 营销管理 下单返券 语言详情
exports.rebateLang = (params) => {
  return $form.get(`ordering-coupon`, { params })
}
// 营销管理 下单返券 添加或修改语言
exports.updateRebateLang = (params) => {
  return $form.put(`ordering-coupon/translate-data`, params)
}
// 抵用券管理 路线列表
exports.getLineList = (params) => {
  return $form.get('coupons/express-line-list', { params })
}
// 转账支付 语言详情
exports.voucherLang = (id, params) => {
  return $form.get(`coupons/${id}`, { params })
}
// 转账支付 添加或修改语言
exports.updateVoucherLang = (id, params) => {
  return $form.put(`coupons/${id}/translate-data`, params)
}
// 营销管理 获取视频列表
exports.getVideoList = () => {
  return $form.get('videos')
}
// 视频管理 获取单条视频详细
exports.getSingleVideo = (id) => {
  return $form.get(`videos/${id}`)
}
// 视频管理 删除视频
exports.videoDelete = (ids) => {
  return $form.put('videos/batch-delete', ids)
}
// 视频管理 视频开启或显示
exports.closeVideo = (id, status) => {
  return $form.put(`videos/${id}/status/${status}`)
}
// 视频管理 语言详情
exports.videoLang = (id, params) => {
  return $form.get(`videos/${id}`, { params })
}
// 视频管理 添加或修改语言
exports.updateVideoLang = (id, params) => {
  return $form.put(`videos/${id}/translate-data`, params)
}
// 添加抵用券
exports.addCoupons = (params) => {
  return $form.post('coupons', params)
}
// 营销管理 渠道管理列表
exports.getChannel = () => {
  return $form.get('channels')
}
// 新增 渠道管理
exports.addChannel = (params) => {
  return $form.post('channels', params)
}
// 获取 单条渠道管理数据
exports.getAloneChannel = (id) => {
  return $form.get(`channels/${id}`)
}
// 更新 单条渠道管理
exports.updateChannel = (id, params) => {
  return $form.put(`channels/${id}`, params)
}
// 删除 单条渠道
exports.deleteChannel = (id) => {
  return $form.delete(`channels/${id}`)
}
// 渠道管理 获取引流列表数据
exports.getChannelsData = (id, params) => {
  return $form.get(`channels/${id}/data`, { params })
}
// 获取结算方式
exports.getSettlement = () => {
  return $form.get('channels/settlement-methods')
}
// 营销管理 统计报表 邀请排行榜
exports.getStatistics = (params) => {
  return $form.get('statistics/user-invite-data', { params })
}
// 营销管理 统计报表 注册统计
exports.getUserRegister = (params) => {
  return $form.get('statistics/user-register-data', { params })
}
// 营销管理 统计报表 订单统计
exports.getOrderData = (params) => {
  return $form.get('statistics/order-data', { params })
}
// 营销管理 统计报表 财务统计
exports.getTransactionData = (params) => {
  return $form.get('statistics/transaction-data', { params })
}
// 营销管理 统计报表 下单排行榜
exports.getUserOrder = (params) => {
  return $form.get('statistics/user-order-data', { params })
}
// 营销管理 广告图管理 列表
exports.getBanner = (params) => {
  return $form.get('ads-picture', { params })
}
// 添加广告图 获取全部下拉框数据
exports.getLeftData = () => {
  return $form.get('ads-picture/selects')
}
// 广告图 新增
exports.addBanner = (params) => {
  return $form.post('ads-picture', params)
}
// 广告图 获取单条详情
exports.aloneBanner = (id) => {
  return $form.get(`ads-picture/${id}`)
}
// 广告图 语言详情
exports.bannerLang = (id, params) => {
  return $form.get(`ads-picture/${id}`, { params })
}
// 广告图 添加或修改语言
exports.updateBannerLang = (id, params) => {
  return $form.put(`ads-picture/${id}/translate-data`, params)
}
// 广告图 更新
exports.updateBanner = (id, params) => {
  return $form.put(`ads-picture/${id}`, params)
}
// 广告图 删除
exports.deleteBanner = (id) => {
  return $form.delete(`ads-picture/${id}`)
}
// 统计报表 邀请记录
exports.reportInvite = (id, params) => {
  return $form.get(`statistics/user-invite-data/${id}/invitations`, { params })
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
// 上传图片
exports.uploadImg = (images) => $file.post('upload/images', images)
// 上传文件
exports.uploadFiles = (files) => $file.post('upload/files', files)
// 上传证书
exports.uploadCerts = (files) => $file.post('upload/certs', files)

exports.forbidLogin = (ids) => $json.put('users/forbid-login', { forbid_id: ids })

// 获取首页统计数据
exports.getIndexNumber = () => $form.get('statistics/index-data')
// 获取首页图表数据
exports.getIndexData = (params) => $form.get('statistics/index-log', { params })

// 首页 控制面板 弹窗数据
exports.getGuides = () => {
  return $form.get('user-guides')
}
// 查询物流弹窗
exports.goTracking = (params) => {
  return $form.get('tracking', { params })
}
// 控制面板 弹窗 设置成完成状态
exports.updateGuides = (id) => {
  return $form.put(`user-guides/${id}`)
}
// 控制面板 弹窗 不再提示
exports.noTips = () => {
  return $form.put('user-guides/no-more-tips')
}
// 控制面板 系统通知
exports.getSystem = () => {
  return $form.get('system-notifications')
}
// 控制面板 系统通知 获取单条内容
exports.getSystemNotice = (id) => {
  return $form.get(`system-notifications/${id}`)
}
// 控制面板 弹窗 判断是否显示弹窗
exports.tipStatus = () => {
  return $form.get('user-guides/tip-status')
}
// 获取订单下的所有订单
exports.getOrdersByShipment = (id, params) => $form.get(`shipments/${id}/orders`, { params })
// 订单列表 获取增值服务
exports.getAdded = () => {
  return $form.get('orders/value-added-services')
}
// 订单列表 获取日志
exports.getInvalid = (id) => {
  return $form.get(`orders/${id}/invalid-log`)
}
// 订单列表 详情 获取可更改的地址信息
exports.detailsAddress = (params) => {
  return $form.get(`orders/user-address`, { params })
}
// 详情 更换收货地址
exports.confirmChange = (id, addId) => {
  return $form.put(`orders/${id}/address/${addId}`)
}
// 订单列表 获取支付方式列表
exports.paymentType = () => {
  return $form.get('orders/payment-types')
}
// 订单列表 获取线路筛选列表
exports.lineType = () => {
  return $form.get('orders/express-line-list')
}
// 订单列表 导出excel
exports.uploadUserExcel = () => {
  return $form.get('users/user-export')
}
// 订单列表 获取订单统计数据
exports.getCounts = (params) => {
  return $form.get('orders/order-counts', { params })
}
// 发货单 获取弹窗里可使用的物流状态
exports.getOrderStatus = () => {
  return $form.get('orders/logistics-types')
}
// 发货单 更改当前物流状态
exports.changeOrderStatus = (params) => {
  return $form.put(`orders/logistics`, params)
}
// 发货单 删除轨迹
exports.deleteOrderTable = (shipId, id) => {
  return $form.delete(`orders/${shipId}/logistics/${id}`)
}
// 发货单 获取单条轨迹
exports.getAloneOrder = (id) => {
  return $form.get(`orders/${id}/logistics`)
}
// 订单 打包 获取线路详情
exports.getUsable = (id) => {
  return $form.get(`orders/${id}/usable-express-lines`)
}
// 订单列表 获取一键打包数据
exports.getOrderBatch = (params) => {
  return $form.get(`orders`, { params })
}
// 一键更改支付方式
exports.changePayMode = (params) => {
  return $form.put('orders/payment-mode', params)
}
// 确定一键打包
exports.confirmBatch = (params) => {
  return $form.put('orders/batch-pack', params)
}
// 订单 打包 获取线路详情
exports.getExpressLines = (id) => {
  return $form.get(`packages/${id}/express-lines`)
}
// 订单 设置改价金额
exports.changeOrderPrice = (id, params) => {
  return $form.put(`orders/${id}/payment-fee`, params)
}
// 订单 修改为已付款
exports.payedOrders = (id) => {
  return $form.put(`orders/${id}/payment/on-delivery-payed`)
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
exports.getCompanies = () => {
  return $form.get(`orders/company-expresses`)
}
// 订单 编辑物流信息 获取单条信息
exports.getInfo = (id) => {
  return $form.get(`orders/${id}/logistics-info`)
}
// 订单 获取单条拣货日志
exports.getOperate = (id) => {
  return $form.get(`orders/${id}/operate-logs`)
}
// 订单 作废 获取作废列表数据
exports.getVoidList = (id) => {
  return $form.get(`orders/${id}/packages`)
}
// 订单 作废
exports.ordersInvalid = (id, params) => {
  return $form.put(`orders/${id}/invalid`, params)
}
// 移除发货单
exports.removeOrders = (id) => {
  return $form.put('orders/remove-from-shipment', id)
}
// 删除发货单
exports.deleteShip = (id) => {
  return $form.delete(`shipments/${id}`)
}
// 取消发货
exports.cancelShip = (id) => {
  return $form.put(`shipments/${id}/un-ship`)
}
// 货站 自定义物流
exports.getCustomLogistics = (params) => {
  return $form.get('custom-logistics', { params })
}
// 货站 上传数据
exports.getCustomerData = (name) => {
  return $form.post('custom-logistics/import', name)
}
// 货站 导入数据 更新
exports.saveLgExcel = (params) => {
  return $json.post('custom-logistics/import-insert', params)
}
// 货站 导入数据 下载excel模版
exports.uploadLgExcel = (type) => {
  return $form.get('custom-logistics/template', { type })
}
// 货站 获取轨迹
exports.getTracking = (id) => {
  return $form.get(`custom-logistics/${id}/details`)
}
// 货站 更新轨迹
exports.updateTracking = (id, params) => {
  return $form.put(`custom-logistics/${id}`, params)
}
// 货站 删除
exports.deleteCustomLogistics = (id) => {
  return $form.delete(`custom-logistics/${id}`)
}
// 货站 仓库自提数据
exports.getWarehouseSelf = (params) => {
  return $form.get('self-pickup-orders', { params })
}
// 仓库自提 设为自提
exports.setSelf = (id, params) => {
  return $form.put(`self-pickup-orders/${id}`, params)
}
// 仓库自提 获取单条数据
exports.getAloneSelf = (id) => {
  return $form.get(`self-pickup-orders/${id}`)
}
// 货站 申请集包
exports.packs = (params) => {
  return $form.get('package-packs/packages', { params })
}
// 集包 新增收货地址
exports.addAddress = (params) => {
  return $form.post(`package-packs/user-address`, params)
}
// 申请集包 发起集包
exports.preview = (params) => {
  return $form.post('package-packs/preview', params)
}
// 发起集包 获取地址数据
exports.previewAddress = (params) => {
  return $form.get('package-packs/user-address', { params })
}
// 发起集包 获取快递数据
exports.usableLines = (params) => {
  return $form.post('package-packs/usable-express-lines', params)
}
// 发起集包 获取增值服务
exports.servicesPackage = () => {
  return $form.get('package-packs/value-added-services')
}
// 发起集包 获取付款方式
exports.packsConfig = () => {
  return $form.get('package-packs/insurance-config')
}
// 发起集包 保存
exports.savePacks = (params) => {
  return $form.post('package-packs/packing', params)
}
// 获取自提点地址
exports.lineStations = (id) => {
  return $form.get(`package-packs/express-line/${id}/stations`)
}
// 获取支持的id跟清关编码
exports.idCards = (id) => {
  return $form.get(`package-packs/express-line/${id}`)
}
// 发货单 获取物流信息模版
exports.uploadBatch = (id) => {
  return $form.get(`shipments/${id}/logistics-export`)
}
// 发货单 修改物流信息 获取转运快递公司
exports.shipmentCompanies = () => {
  return $form.get(`shipments/company-expresses`)
}
// 发货单 导出清单
exports.uploadExcel = (ids) => {
  return $form.post(`shipments/order-export-batch`, ids)
}
// 发货单 详情批量导出发货单
exports.uploadShipmentLabel = (id, ids) => {
  return $form.post(`shipments/${id}/order-shipment-label`, ids)
}
// 发货单 获取弹窗里可使用的物流状态
exports.getShipStatus = () => {
  return $form.get('shipments/logistics-types')
}
// 发货单 更改当前物流状态
exports.changeShipStatus = (params) => {
  return $form.put(`shipments/logistics`, params)
}
// 发货单 删除轨迹
exports.deleteShipTable = (shipId, id) => {
  return $form.delete(`shipments/${shipId}/logistics/${id}`)
}
// 发货单 获取单条轨迹
exports.getAloneShip = (id) => {
  return $form.get(`shipments/${id}/logistics`)
}
// 详情里的导出
exports.uploadAloneExcel = (id) => {
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

// 获取视频上传临时 token
exports.getVideoUploadToken = () => $form.get('videos/upload-token')

// 新建视频
exports.addVideo = (params) => $json.post('videos', params)
// 修改视频
exports.editVideo = (id, params) => $json.put(`videos/${id}`, params)

// 获取线路筛选条件某一列列表
exports.getLineColumnList = (column) => $form.get(`express-lines/column/${column}/data`)
export default exports
