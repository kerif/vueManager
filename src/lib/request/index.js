import { $form, $json, $file } from '@/lib/axios'
let exports = {}

/**
 * 管理员登录
 * @param {Object} params
 *  username 用户名
 *  password 密码
 */
exports.login = params => {
  return $json.post('login', params)
}
// 退出登录
exports.logout = () => $form.post('logout')
// 关于我们
exports.aboutUs = () => $form.get('about-us')
// 公司信息
exports.aboutMe = () => $form.get('me')
// 下载管理 获取列表
exports.exportsDownloads = () => $form.get('export-downloads')
// 常见问题
exports.problemList = params => {
  return $form.get('problems', { params })
}
// 常见问题 详情
exports.problemDetail = id => {
  return $form.get(`problems/${id}`)
}
// 常见问题 分类列表
exports.categoryList = () => {
  return $form.get('problems/categories')
}
// 系统消息 列表
exports.messageList = params => {
  return $form.get('push-messages', { params })
}
// 系统消息 详情
exports.messageDetail = id => {
  return $form.get(`push-messages/${id}`)
}
// 系统消息 未读计数的
exports.countMessage = () => {
  return $form.get('push-messages/count')
}
// 配置 路线
exports.getLines = params => {
  return $form.get('express-lines', { params })
}
// 配置 路线 删除
exports.deleteLines = id => {
  return $form.delete(`express-lines/${id}`)
}
// 配置 路线 添加物品属性
exports.addPackageProps = params => {
  return $form.post('package-props', params)
}
// 配置 路线 更新物品属性
exports.updatePackageProps = (id, params) => {
  return $form.put(`package-props/${id}`, params)
}

// 配置 路线 渠道标签
exports.channelLabel = id => {
  return $form.get(`express-lines/${id}/basic-config`)
}

// 配置 路线 添加标签
exports.addChannelLabel = params => {
  return $form.post('express-lines/basic-config', params)
}

// 获取高级配置
// exports.getSorting = (id) => {
//   return $form.get(`orders/${id}/re-sorting`)
// }
// 配置 路线修改开启或关闭
exports.resetLines = (id, status) => {
  return $form.put(`express-lines/${id}/status/${status}`)
}
// 配置 路线 是否推荐 开启或关闭
exports.resetRecommend = (id, status) => {
  return $form.put(`express-lines/${id}/recommend/${status}`)
}
// 配置 路线 导出清单
exports.importLines = () => {
  return $form.get(`express-lines/excel-export-all`)
}

// 路线 获取拼团配置
exports.getGroupLine = id => {
  return $form.get(`express-lines/${id}/group-config`)
}
// 路线 更新 拼团配置
exports.updateGroupLine = (id, params) => {
  return $form.put(`express-lines/${id}/group-config`, params)
}
// 路线 获取额外收录信息
exports.getFee = id => {
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
exports.getCosts = id => {
  return $form.get(`express-lines/${id}/costs`)
}
// 配置 路线 修改某条其余费用
exports.updateCosts = (id, params) => {
  return $form.put(`express-lines/${id}/costs`, params)
}
// 配置 路线 增加其余费用
exports.addLinesCost = params => {
  return $form.post('express-lines/costs', params)
}
// 配置 路线 复制 线路
exports.copyLine = (id, params) => {
  return $form.post(`express-lines/${id}/copy`, params)
}
// 配置 路线 获取支持国家/地区
exports.supportCountry = ids => {
  return $form.post('express-lines/warehouse-countries', ids)
}
// 配置 路线 获取路线icon
exports.iconLines = params => {
  return $form.get(`express-lines/icons`, { params })
}
// 配置 路线icon 设置为默认
exports.asDefault = id => {
  return $form.put(`express-lines/icons/${id}/as-default`)
}
// 配置 路线icon 删除
exports.deleteIcon = id => {
  return $form.delete(`express-lines/icons/${id}`)
}
// 配置 路线icon  新建
exports.addIcon = params => {
  return $form.post('express-lines/icons', params)
}
// 配置 路线icon  获取单条
exports.getIcon = id => {
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
// 新路线 新建分区表
exports.newRegionsTem = params => {
  return $form.post('express-lines/region-templates', params)
}
// 新路线 新建分区表 更新
exports.updateRegionsTem = (id, params) => {
  return $form.put(`express-lines/region-templates/${id}`, params)
}
// 新路线 新建分区表 获取单条详情
exports.getRegionsTem = id => {
  return $form.get(`express-lines/region-templates/${id}`)
}
// 新路线 新建分区表 删除
exports.deleteRegionsTem = id => {
  return $form.delete(`express-lines/region-templates/${id}`)
}
// 新路线 销售价格 列表
exports.getSales = params => {
  return $form.get('express-lines/sale-prices', { params })
}
// 新路线 销售价格 新增
exports.addSales = params => {
  return $form.post('express-lines/sale-prices', params)
}
// 新路线 销售价格 详情
exports.getSalesDetails = id => {
  return $form.get(`express-lines/sale-prices/${id}`)
}
// 新路线 销售价格 修改
exports.updateSales = (id, params) => {
  return $form.put(`express-lines/sale-prices/${id}`, params)
}
// 新路线 销售价格 修改状态
exports.updateStatus = (id, status) => {
  return $form.put(`express-lines/sale-prices/${id}/status/${status}`)
}
// 新路线 销售价格 复制路线
exports.copySalesLine = (id, params) => {
  return $form.post(`express-lines/sale-prices/${id}/copy`, params)
}
// 新路线 销售价格 删除
exports.deleteSales = id => {
  return $form.delete(`express-lines/sale-prices/${id}`)
}
// 新路线 销售价格 获取适用渠道
exports.groupWith = () => {
  return $form.get(`express-lines/group-with-line-list`)
}
// 配置 新路线 获取数据
exports.getLineGroup = params => {
  return $form.get('express-lines/groups', { params })
}
// 配置 新路线 编辑路线名称
exports.editLineGroup = (id, params) => {
  return $form.put(`express-lines/groups/${id}`, params)
}
// 配置 新路线 新建
exports.newGroupLang = params => {
  return $form.post('express-lines/groups', params)
}
// 配置 新路线 面单对接
exports.updateDocking = (id, params) => {
  return $form.put(`express-lines/${id}/docking-config`, params)
}
// 配置 新路线 面单对接 获取渠道代码数据
exports.channelCode = id => {
  return $form.get(`express-lines/channel-code-list/${id}`)
}
// 配置 新路线 开启或关闭
exports.lineGroupEnabled = (id, status) => {
  return $form.put(`express-lines/groups/${id}/status/${status}`)
}
// 配置 新路线 获取语言单条详细
exports.lineGroupLang = (id, params) => {
  return $form.get(`express-lines/groups/${id}`, { params })
}
// 配置 新路线 更新语言配置
exports.updateLineGroupLang = (id, params) => {
  return $form.put(`express-lines/groups/${id}/translate-data`, params)
}
// 配置 新路线 复制路线
exports.copyGroupLine = (id, params) => {
  return $form.post(`express-lines/groups/${id}/copy`, params)
}
// 配置 新路线 删除路线
exports.deleteLineGroup = id => {
  return $form.delete(`express-lines/groups/${id}`)
}
// 配置 新路线 分区列表
exports.getRegions = (id, params) => {
  return $form.get(`express-lines/${id}/regions`, { params })
}
// 新路线 分区列表 获取语言详细
exports.regionLangDetails = (id, regionId, params) => {
  return $form.get(`express-lines/${id}/regions/${regionId}`, { params })
}
// 新路线 分区列表 更改语言详情
exports.updateRegionsLang = (id, regionId, params) => {
  return $form.put(`express-lines/${id}/regions/${regionId}/translate-data`, params)
}
// 配置 新路线 分区列表 开启或关闭
exports.regionsEnabled = (id, regionsId, status) => {
  return $form.put(`express-lines/${id}/regions/${regionsId}/status/${status}`)
}
// 配置 新路线 分区列表 详细
exports.getRegionDetails = (id, regionId) => {
  return $form.get(`express-lines/${id}/regions/${regionId}`)
}
// 配置 新路线 分区列表 更新
exports.updateRegionDetails = (id, regionId, params) => {
  return $form.put(`express-lines/${id}/regions/${regionId}`, params)
}
// 配置 新路线 分区列表 删除
exports.regionsDelete = (id, regionId) => {
  return $form.delete(`express-lines/${id}/regions/${regionId}`)
}
// 配置 新路线 新增
exports.newRegions = (id, params) => {
  return $form.post(`express-lines/${id}/regions`, params)
}
// 配置 分区 线路分区详情
exports.lineRegionsDetail = (id, regionId) => {
  return $form.get(`express-lines/${id}/regions/${regionId}`)
}
// 配置 分区 新建线路分区
exports.newLineRegions = (id, params) => {
  return $json.post(`express-lines/${id}/regions`, params)
}
// 配置 分区 更新线路分区信息
exports.updateRegions = (id, regionId, params) => {
  return $json.put(`express-lines/${id}/regions/${regionId}`, params)
}
// 配置 分区 复制分区模板
exports.copyPartitionTmp = (id, tmpId) => {
  return $form.put(`express-lines/${id}/regions/copy/${tmpId}`)
}
// 配置 路线 保存
exports.saveName = (id, params) => {
  return $form.put(`express-lines/region-templates/${id}`, params)
}
// 新路线 基础信息 获取
exports.configBasic = id => {
  return $form.get(`express-lines/${id}/basic-config`)
}
// 新路线 基础信息 新建
exports.newConfigBasic = params => {
  return $form.post('express-lines/basic-config', params)
}
// 新路线 基础信息 更新
exports.updateConfigBasic = (id, params) => {
  return $form.put(`express-lines/${id}/basic-config`, params)
}
// 新路线 渠道规则 获取参数
exports.getConditions = id => {
  return $form.get(`express-lines/${id}/rules/conditions`)
}
// 新路线 渠道规则 分区数据
exports.regionsAll = id => {
  return $form.get(`express-lines/${id}/regions/all`)
}
// 新路线 渠道规则 更新规则数据
exports.updateBaseRules = (id, params) => {
  return $form.put(`express-lines/${id}/rules/base-config`, params)
}
// 渠道规则 获取规则
exports.getNewRules = id => {
  return $form.get(`express-lines/${id}/rules`)
}
// 渠道规则 新建规则
exports.newRules = (id, params) => {
  return $form.post(`express-lines/${id}/rules`, params)
}
// 渠道规则 更新规则
exports.updateNewRules = (id, ruleId, params) => {
  return $form.put(`express-lines/${id}/rules/${ruleId}`, params)
}
// 渠道规则 删除规则
exports.deleteNewRules = (id, ruleId) => {
  return $form.delete(`express-lines/${id}/rules/${ruleId}`)
}
// 新路线 计费设置 获取
exports.getBillingConfig = id => {
  return $form.get(`express-lines/${id}/billing-config`)
}
// 新路线 计费设置 更新
exports.updateBillingConfig = (id, params) => {
  return $form.put(`express-lines/${id}/billing-config`, params)
}
// 新路线 分区 获取国家
exports.regionCountry = id => {
  return $form.get(`countries/express-lines/${id}`)
}
//  分区 获取预设分区表
exports.getRegionTemplate = id => {
  return $form.get(`express-lines/region-templates/${id}`)
}
// 分区 选择模版
exports.submitTmp = (id, tmpId) => {
  return $form.put(`express-lines/${id}/regions/copy/${tmpId}`)
}
// 模版列表
exports.regionTemplates = id => {
  return $form.get(`express-lines/region-templates/${id}/regions`)
}
// 模版 开启或关闭
exports.presetRegionsEnabled = (id, regionsId, status) => {
  return $form.put(`express-lines/region-templates/${id}/regions/${regionsId}/status/${status}`)
}
// 模版 获取详情
exports.regionTmpDetails = (tmpId, id) => {
  return $form.get(`express-lines/region-templates/${tmpId}/regions/${id}`)
}
// 模版 更新
exports.updateRegionTmpDetails = (tmpId, id, params) => {
  return $json.put(`express-lines/region-templates/${tmpId}/regions/${id}`, params)
}
// 模版 删除
exports.deleteRegionTmp = (tmpId, id) => {
  return $form.delete(`express-lines/region-templates/${tmpId}/regions/${id}`)
}
// 模版 新建
exports.newRegionTmp = (id, params) => {
  return $json.post(`express-lines/region-templates/${id}/regions`, params)
}
// 分区 模版列表
exports.lineRegion = params => {
  return $form.get('express-lines/region-templates', { params })
}
// 新建模版
exports.newTmp = params => {
  return $form.post('express-lines/region-templates', params)
}
// 模版 删除
exports.deleteTmp = id => {
  return $form.delete(`express-lines/region-templates/${id}`)
}
// 配置 新路线 价格表 运费试算
exports.priceTableCal = params => {
  return $form.post(`express-lines/price-test`, params)
}
// 配置 新路线 获取价格表
exports.getPriceTable = (id, params) => {
  return $form.get(`express-lines/${id}/prices`, params)
}
// 配置 新路线 保存价格表
exports.editPrice = (id, params) => {
  return $form.put(`express-lines/${id}/prices`, params)
}
// 配置 新路线 导出价格表
exports.exportPrice = id => {
  return $form.get(`express-lines/${id}/prices/export`)
}
// 配置 新路线 导入价格表
exports.importPrice = (id, params) => {
  return $file.post(`express-lines/${id}/prices/import`, params)
}
// 配置 新路线 增值服务 获取列表
exports.getServicesList = (id, params) => {
  return $form.get(`express-lines/${id}/services`, { params })
}
// 配置 新路线 增值服务 获取详细
exports.getServicesDetails = (id, serviceId, params) => {
  return $form.get(`express-lines/${id}/services/${serviceId}`, { params })
}
// 配置 新路线 增值服务 修改
exports.updateServices = (id, serviceId, params) => {
  return $form.put(`express-lines/${id}/services/${serviceId}`, params)
}
// 配置 新路线 增值服务 新增
exports.addServices = (id, params) => {
  return $form.post(`express-lines/${id}/services`, params)
}
// 配置 新路线 增值服务 删除
exports.deleteServices = (id, serviceId, params) => {
  return $form.delete(`express-lines/${id}/services/${serviceId}`, params)
}
// 配置 新路线 导出增值服务
exports.exportServices = id => {
  return $form.get(`express-lines/${id}/services/export`)
}
// 配置 新路线 导入增值服务
exports.importServices = (id, params) => {
  return $file.post(`express-lines/${id}/services/import`, params)
}
exports.getStaff = params => {
  return $form.get('admins', { params })
}
exports.getVips = () => {
  return $form.get('admin-groups/simple-list')
}
exports.EditVip = id => {
  return $form.get(`admins/${id}`)
}
exports.getVipDetails = id => {
  return $form.get(`admins/${id}`)
}
exports.updateVip = (id, params) => {
  return $form.put(`agents/${id}`, params)
}
exports.saveVip = params => {
  return $json.post('admins', params)
}
exports.editVipPsd = (id, params) => {
  return $form.put(`admins/${id}/password`, params)
}
// 删除员工列表用户
exports.deleteVip = params => {
  return $form.put('admins/batch-delete', params)
}
exports.getVipGroup = params => {
  return $form.get('admin-groups', { params })
}
// 新建员工组
exports.addGroup = params => {
  return $json.post('admin-groups', params)
}
// 编辑员工组
exports.editGroup = (id, params) => {
  return $form.put(`admin-groups/${id}`, params)
}
// 获取员工组信息
exports.getGroup = id => {
  return $form.get(`admin-groups/${id}`)
}
// 获取员工组自提点权限数据
exports.getPickPoint = (id, params) => {
  return $form.get(`admin-groups/${id}/members`, { params })
}
// 员工组自提点权限 获取自提点列表
exports.stationList = () => {
  return $form.get(`admin-groups/station-list`)
}
// 员工组自提点权限 更新自提点列表
exports.updateStation = params => {
  return $json.put(`admin-groups/admins/station-permissions`, params)
}
exports.getVipMember = (id, params) => {
  return $form.get(`admin-groups/${id}/members`, { params })
}
exports.getBill = () => {
  return $form.get('warehouse-address')
}
exports.saveWareHouse = params => {
  return $form.put('warehouse-address', params)
}
exports.getNotice = params => {
  return $form.get('articles', { params })
}
exports.saveNotice = params => {
  return $form.post(`articles`, params)
}
// 客户组删除
exports.userGroupDelete = ids => {
  return $form.put('user-groups/batch-delete', ids)
}
// 客户组成员
exports.getUserMembers = (id, params) => {
  return $form.get(`user-groups/${id}/members`, { params })
}
// 员工列表禁止登录
exports.forbidUser = ids => {
  return $form.put('admins/forbid-login', ids)
}
// 客户禁止登录
exports.customerForbid = ids => {
  return $form.put('users/forbid-login', ids)
}
// 客户 个人信息 获取客户数据
exports.noUsers = params => {
  return $form.get(`users/agent-search`, { params })
}
// 客户 个人详细信息
exports.infoCount = id => {
  return $form.get(`users/${id}/info-counts`)
}
// 客户 合并客户
exports.mergeCustomer = (id, targetId) => {
  return $form.put(`users/merge/${id}/target/${targetId}`)
}
// 客户 分配客服
exports.assignCustomer = params => {
  return $form.put('users/assign-customer', params)
}
// 客户 分配销售
exports.assignSale = params => {
  return $form.put('users/assign-sale', params)
}
// 客户 客户模板导出
exports.customerTmp = () => {
  return $form.get(`users/user-template`)
}
// 客户 批量分配
exports.batchAllocate = file => {
  return $file.post('users/template-assign', file)
}
// 客户允许登录
exports.customerLogin = ids => {
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
// 客户 客户地址 导出清单
exports.exportList = params => {
  return $form.get('user-addresses/export', { params })
}
// 客户 客户包裹列表
exports.packageList = id => {
  return $form.get(`users/${id}/packages`)
}
// 客户 客户订单列表
exports.orderList = id => {
  return $form.get(`users/${id}/orders`)
}
// 客户 客户地址列表
exports.addressList = id => {
  return $form.get(`users/${id}/addresses`)
}
// 员工列表允许登录
exports.allowUser = ids => {
  return $form.put('admins/allow-login', ids)
}
// 编辑员工
exports.editAdmins = (id, params) => {
  return $form.put(`admins/${id}`, params)
}
// 员工组删除组
exports.deleteGroup = ids => {
  return $form.put('admin-groups/batch-delete', ids)
}
// 客服中心 投诉建议
exports.getSuggest = params => {
  return $form.get('suggestions', { params })
}
// 投诉建议 获取单条详细
exports.getSuggests = id => {
  return $form.get(`suggestions/${id}`)
}
exports.submitSuggest = (id, params) => {
  return $form.put(`suggestions/${id}/status`, params)
}
// 客服中心 获取评价管理列表
exports.getComments = params => {
  return $form.get('order-comments', { params })
}
// 客服中心 获取评价管理列表详情
exports.getCommentDetails = id => {
  return $form.get(`order-comments/${id}`)
}
// 客服中心 回复评论
exports.addReply = (id, params) => {
  return $form.post(`order-comments/${id}/reply`, params)
}
// 客服中心 回复评论
exports.addTime = (id, params) => {
  return $form.put(`order-comments/${id}`, params)
}
// 客服中心 评价管理 新增评价
exports.getAddEvaluate = params => {
  return $form.post('order-comments', params)
}
// 客服中心 评价管理 删除
exports.deleteComment = id => {
  return $form.delete(`order-comments/${id}`)
}
// 客服中心 评价管理  获取功能配置
exports.getFunConfig = () => {
  return $form.get('function-config')
}
// 客服中心 取消或设置精选
exports.updateRecommend = (id, status) => {
  return $form.put(`order-comments/${id}/recommend/${status}`)
}
// 客服中心 公告管理
exports.getAnnouncements = params => {
  return $form.get('announcements', { params })
}
// 客户 客户概览 柱状图
exports.vipColumnar = params => {
  return $form.get('user-overviews/daily-count', { params })
}
// 客户 代理概览 柱状图
exports.proxyColumnar = params => {
  return $form.get('user-overviews/agent-daily-count', { params })
}
// 客户概览 客户统计数量
exports.vipCounts = params => {
  return $form.get('user-overviews/user-count', { params })
}
// 客户概览 代理统计数量
exports.proxyCounts = params => {
  return $form.get('user-overviews/agent-count', { params })
}
// 客户概览 用户表格数据
exports.vipRank = params => {
  return $form.get('user-overviews/order-rank', { params })
}
// 客户概览 代理表格数据
exports.agentRank = params => {
  return $form.get('user-overviews/agent-order-rank', { params })
}
// 获取单条公告详细
exports.getSingleAnnouncements = id => {
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
exports.announcementsDelete = ids => {
  return $form.put('announcements/batch-delete', ids)
}
// 新建公告
exports.addAnnouncements = params => {
  return $form.post('announcements', params)
}
// 文章管理 获取单条详情
exports.getNoticeDetails = id => {
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
exports.getShip = params => {
  return $form.get('shipments', { params })
}
exports.getCountry = () => {
  return $form.get('countries')
}
exports.saveCountries = id => {
  return $form.post('countries', id)
}
// 财务 流水记录
exports.getTransaction = params => {
  return $form.get('transaction-records', { params })
}
// 财务 订单财务审核 退款审核
exports.financesData = params => {
  return $form.get('order-finances/refunds', { params })
}
// 财务 订单财务审核 退款详情
exports.refundsData = id => {
  return $form.get(`order-finances/refunds/${id}`)
}
// 财务 订单财务审核 支付审核
exports.financesPayments = params => {
  return $form.get('order-finances/payments', { params })
}
// 财务 订单财务审核 支付详情
exports.payData = id => {
  return $form.get(`order-finances/payments/${id}`)
}
// 财务 订单财务审核 支付审核 通过
exports.approvedPay = (id, params) => {
  return $form.put(`order-finances/payments/${id}/approved`, params)
}
// 财务 订单财务审核 支付审核 拒绝
exports.refundPay = (id, params) => {
  return $form.put(`order-finances/payments/${id}/refused`, params)
}
// 财务 订单财务审核 退款审核 通过
exports.approvedRefunds = (id, params) => {
  return $form.put(`order-finances/refunds/${id}/approved`, params)
}
// 财务 订单财务审核 退款审核 拒绝
exports.refundRefunds = (id, params) => {
  return $form.put(`order-finances/refunds/${id}/refused`, params)
}
// 财务 订单财务审核 获取支付方式数据
exports.financesPaymentsType = () => {
  return $form.get('order-finances/payments/payment-types')
}
// 流水记录 获取充值方式下拉框
exports.getPaymentType = () => {
  return $form.get('transaction-records/payment-types')
}
// 流水记录 获取路线筛选数据
exports.getSimpleLines = () => {
  return $form.get('simple-express-lines')
}
// 流水记录 获取交易类型数据
exports.getRecordType = () => {
  return $form.get('transaction-records/types')
}
// 财务 充值记录
exports.getRecharge = params => {
  return $form.get('recharge-records', { params })
}
// 财务 充值记录 导出
exports.uploadRecharge = params => {
  return $form.get('recharge-records/export', { params })
}
// 财务 充值记录 获取成长值财务列表
exports.getGrowthFinance = params => {
  return $form.get('growth-finances/payments', { params })
}
// 财务 充值记录 获取成长值财务列表
exports.getGrowthFinanceDetails = id => {
  return $form.get(`growth-finances/payments/${id}`)
}
// 财务 充值记录 通过成长值财务
exports.approvedGrowthValue = (id, params) => {
  return $form.put(`growth-finances/payments/${id}/approved`, params)
}
// 财务 充值记录 拒绝成长值财务
exports.refusedGrowthValue = (id, params) => {
  return $form.put(`growth-finances/payments/${id}/refused`, params)
}
// 财务 自提点佣金结算
exports.commissionsPick = params => {
  return $form.get('station-commissions', { params })
}
// 财务 自提点佣金结算 导出
exports.uploadCommissions = params => {
  return $form.get('station-commissions/export', { params })
}
// 财务 自提点佣金结算 导出 结算记录
exports.uploadRecordsCommissions = (id, params) => {
  return $form.get(`station-commissions/${id}/records/export`, { params })
}
// 财务 自提点佣金结算 结算记录
exports.commissionsRecords = (id, params) => {
  return $form.get(`station-commissions/${id}/records`, { params })
}
// 财务 预约结算
exports.reserveSettle = params => {
  return $form.put('agents/auto-settled-days', params)
}
// 财务 预约结算数据
exports.getReserve = () => {
  return $form.get('agents/auto-settled-days')
}
// 自提点佣金结算 结算明细
exports.recordsDetails = (id, params) => {
  return $form.get(`station-commissions/records/${id}/commissions`, { params })
}
// 自提点佣金结算 审核并支付 获取当条数据
exports.aloneRecordsDetails = (id, params) => {
  return $form.get(`station-commissions/records/${id}`, { params })
}
// 自提点佣金结算 审核并支付 确认
exports.verifyRecords = (id, params) => {
  return $form.put(`station-commissions/records/${id}/verify`, params)
}
// 充值记录 详细
exports.getRechargeDetails = id => {
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
exports.AutoRecords = params => {
  return $form.get('recharge-records/user-search', { params })
}
// 充值记录 新增
exports.addRecords = params => {
  return $form.post('recharge-records', params)
}
// 余额扣款处理 新建
exports.addDeductions = params => {
  return $form.post('money-deductions', params)
}
// 余额扣款处理 自动匹配客户ID
exports.AutoDeductions = params => {
  return $form.get('money-deductions/user-search', { params })
}
// 代理佣金计算 全部
exports.pendingReview = params => {
  return $form.get('agents/withdraws', { params })
}
// 代理佣金计算 待审核
exports.unReviewed = params => {
  return $form.get('agents/withdraws', { params })
}
// 代理佣金计算 已审核
exports.Reviewed = params => {
  return $form.get('agents/withdraws', { params })
}
// 代理佣金计算 详情
exports.Review = id => {
  return $form.get(`agents/withdraws/${id}`)
}
// 代理佣金计算 待结算
exports.noSettled = params => {
  return $form.get('agents/deal-orders', { params })
}
// 代理佣金计算 待结算数量
exports.settleAccounts = () => {
  return $form.get('agents/commissions/settled-count')
}
// 代理佣金计算 待结算初始化信息
exports.initSettle = params => {
  return $form.get('agents/deal-order-init', { params })
}
// 代理佣金计算 提现方式
exports.withdrawalMethod = () => {
  return $form.get('agents/withdraws/index-init')
}
// 代理佣金计算 一键结算id
exports.clickSettlement = params => {
  return $form.put('agents/commissions/settled-all', params)
}
// 代理佣金结算 代理结算统计
exports.settleStatistics = () => {
  return $form.get('agents/deal-orders-total')
}
// 代理佣金计算 审核通过提现申请
exports.approveWithdraw = (id, withdrawsId, params) => {
  return $form.put(`agents/${id}/withdraws/${withdrawsId}/approved`, params)
}
// 代理佣金计算 审核拒绝提现申请
exports.refusedWithdraw = (id, withdrawsId, params) => {
  return $form.put(`agents/${id}/withdraws/${withdrawsId}/refused`, params)
}
// 代理佣金结算 提现
exports.withdrawThird = (id, applyId) => {
  return $form.put(`agents/${id}/withdraws/${applyId}/withdraw-third`)
}
// 代理管理 审核拒绝
exports.rechargeReject = (id, params) => {
  return $form.put(`recharge-records/${id}/refused`, params)
}
// 代理管理 获取提现说明
exports.withdrawData = params => {
  return $form.get('agents/withdraw-rule', { params })
}
// 代理管理 确定 更新代理二维码
exports.updateAgentCode = () => {
  return $form.put('agents/qrcode-regenerate')
}
// 代理管理 代理二维码 下载二维码
exports.uploadAgentCode = (id, config) => {
  return $form.get(`agents/${id}/mp-code`, config)
}
// 代理管理 确定 提现说明
exports.updateWithdrawData = params => {
  return $form.put('agents/withdraw-rule', params)
}
// 代理管理 计佣模版配置列表
exports.agentTemplate = params => {
  return $form.get('agents/commission-templates', { params })
}
// 代理管理 代理删除
exports.deleteAgent = id => {
  return $form.delete(`agents/${id}`)
}
// 发票管理 全部
exports.manageInvoice = params => {
  return $form.get('invoice', { params })
}
// 发票管理 详情
exports.invoiceDetail = id => {
  return $json.get(`invoice/${id}`)
}
// 发票管理 搜索
exports.searchMode = params => {
  return $form.get('invoice', { params })
}
// 发票管理 统计数量
exports.invoiceCount = () => {
  return $form.get('invoice/count')
}
// 发票管理 开票完成
exports.invoiceComplete = (id, params) => {
  return $json.put(`invoice/complete/${id}`, params)
}
// 发票管理 开票作废
exports.invoiceVoid = (id, params) => {
  return $json.put(`invoice/to-void/${id}`, params)
}
// 发票管理 重新开票
exports.invoiceReopen = (id, params) => {
  return $json.put(`invoice/reopen/${id}`, params)
}
// 发票管理 开票作废
exports.invoiceRecovery = (id, params) => {
  return $json.put(`invoice/recovery/${id}`, params)
}
// 计佣模版配置 获取form表单详情
exports.commissionSet = id => {
  return $form.get(`agents/commission-templates/${id}`)
}
// 计佣模版配置 获取表格详情
exports.commissionData = (id, params) => {
  return $form.get(`agents/commission-templates/${id}/lines`, { params })
}

// 计佣模版配置 更新单条数据
exports.commissionUpdate = (id, params) => {
  return $form.put(`agents/commission-templates/${id}`, params)
}
// 计佣模版配置 新建单条数据
exports.commissionAdd = params => {
  return $form.post(`agents/commission-templates`, params)
}
// 计佣模版配置 删除单条数据
exports.commissionDelete = id => {
  return $form.delete(`agents/commission-templates/${id}`)
}
exports.saveShip = params => {
  return $form.post(`shipments`, params)
}
// 获取 单条发货单数据
exports.getAloneShipDetails = id => {
  return $form.get(`shipments/update-details/${id}`)
}
// 更新 单条发货单数据
exports.editShip = (id, params) => {
  return $form.put(`shipments/${id}`, params)
}
exports.getShipments = id => {
  return $form.put(`shipments/${id}/ship`)
}
exports.getStorage = params => {
  return $form.get('shipment-logs/in-storage', { params })
}
exports.getPick = params => {
  return $form.get('shipment-logs/picking', { params })
}
// 获取自提点数据
exports.autoPick = id => {
  return $form.get(`express-lines/${id}/self-pickup-stations`)
}
// 获取落地配配置数据
exports.dockingPick = () => {
  return $form.get(`express-lines/docking-types`)
}
// 更新自提点
exports.updateAutoPick = (id, params) => {
  return $form.put(`express-lines/${id}/advance-settings`, params)
}
// 包裹快速合箱 获取自提点数据
exports.selfData = () => {
  return $form.get(`package-packs/stations`)
}
// 包裹快速合箱 获取收件地址列表
exports.recipeAddress = params => {
  return $form.post('package-packs/user-first-address', params)
}
// 包裹快速合箱 确认更改 收件地址
exports.confirmChangeAddress = params => {
  return $json.post('package-packs/user-specific-address', params)
}
// 包裹快速合箱 提示
exports.getNotify = params => {
  return $form.get(`area-notifications`, { params })
}
// 包裹快速合箱 按预报批次集包
exports.groupBy = params => {
  return $form.get('package-packs/packages-group-by-batch', { params })
}
// 包裹快速入库 获取全部物品属性
exports.getProps = () => {
  return $form.get('package-props')
}
// 包裹快速入库 获取推荐货位
exports.getAreaLocation = (warehouseid, id) => {
  return $form.get(`packages/${warehouseid}/user-location/${id}`)
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
exports.getArea = id => {
  return $form.get(`shipments/warehouse/${id}/countries`)
}
// 包裹快速入库 新增商品清单
exports.updatePackagesDetails = (id, params) => {
  return $form.post(`packages/${id}/details`, params)
}
// 包裹快速入库 获取商品清单列表
exports.getPackageList = id => {
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
exports.getShipmentNum = id => {
  return $form.get(`shipments/package-num/${id}/id`)
}
// 包裹快速入库 删除单条商品清单数据
exports.deleteSingleDetails = (id, ele) => {
  return $form.delete(`packages/${id}/details/${ele}`)
}
exports.getWarehouse = params => {
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
exports.getWarehouseList = params => {
  return $form.get('packages/in-warehouse-info', { params })
}
// 包裹快速入库
exports.getStorageList = params => {
  return $form.get('shipments/in-warehouse-info', { params })
}
// 包裹快速入库 获取仓库列表数据
exports.getSimpleWarehouse = () => {
  return $form.get('shipments/warehouse-simple-list')
}
// 包裹快速入库 获取商品清单
exports.getProductDetails = id => {
  return $form.get(`packages/${id}`)
}
// 完成已支付
exports.getPay = id => {
  return $form.put(`orders/${id}/paid`)
}
// 添加转运快递单号
exports.updateLogistics = params => {
  return $form.put('orders/update-logistics', params)
}
exports.getExpress = params => {
  return $form.post(`shipments/in-storage`, params)
}
// 入库 添加未预报的新包裹
exports.addShipment = params => {
  return $form.post('shipments/in-storage/add', params)
}
// 入库 自动匹配客户ID
exports.Automatic = params => {
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
  return $form.put(
    `warehouse-address/${id}/goods-allocation-areas/location/${areaId}/status/${status}`
  )
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
exports.getExpressLine = id => {
  return $form.get(`express-lines/${id}`)
}
// 货站 拣货日志 列表查询
exports.getPackageLog = params => {
  return $form.get('package-process-logs', { params })
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
  return $json.put(`express-lines/${id}`, params)
}
exports.updateLines = params => {
  return $form.post('express-lines', params)
}
exports.getOrder = params => {
  return $form.get('orders', { params })
}
exports.getOrderDetails = id => {
  return $form.get(`orders/${id}`)
}
exports.packageDetails = id => {
  return $form.get(`orders/${id}/package-details `)
}
exports.saveOrderPack = (id, params) => {
  return $form.put(`orders/${id}/pack`, params)
}
// 客户地址
exports.getUserAddress = params => {
  return $form.get('user-addresses', { params })
}
// 客户地址 获取单条地址信息
exports.singleAddress = id => {
  return $form.get(`user-addresses/${id}`)
}
// 客户地址 更新单条地址信息
exports.updateSingleAddress = (id, params) => {
  return $form.put(`user-addresses/${id}`, params)
}
// 沉睡提醒
exports.getAsleep = params => {
  return $form.get('asleep-users', { params })
}
// 获取沉睡设置
exports.getSleepRules = params => {
  return $form.get('asleep-users/rule', params)
}
// 更新沉睡设置
exports.updateSleepRules = params => {
  return $form.put('asleep-users/rule', params)
}
// 唤醒 批量
exports.batchWake = params => {
  return $form.post('asleep-users/notify', params)
}
// 客户 删除
exports.deleteUser = ids => {
  return $form.put('users/batch-delete', ids)
}
// 客户 查看个人信息
exports.checkVipInfo = id => {
  return $form.get(`users/${id}`)
}
// 客户 更新 个人信息
exports.updateVipInfo = (id, params) => {
  return $form.put(`users/${id}`, params)
}
// 客户 操作日志
exports.getVipLogs = id => {
  return $form.get(`users/${id}/logs`)
}
// 获取客户列表
exports.getUsers = params => {
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
exports.getUserGroup = params => {
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
exports.deleteNotice = params => {
  return $form.put('articles/batch-delete', params)
}
// 新建客户组资料
exports.addUserGroup = params => {
  return $form.post('user-groups', params)
}
// 客户 代理申请列表
exports.getApplication = params => {
  return $form.get(`agent-applications`, { params })
}
// 客户 代理申请列表 审核通过
exports.agentApproved = (id, params) => {
  return $form.put(`agent-applications/${id}/approved`, params)
}
// 客户 代理申请列表 审核拒绝
exports.refusedApproved = id => {
  return $form.put(`agent-applications/${id}/refused`)
}
// 新增 客户
exports.addVip = params => {
  return $form.post('users/add-user', params)
}
// 代理申请列表 删除
exports.deleteApproved = id => {
  return $form.delete(`agent-applications/${id}`)
}
// 获取管理员组权限设置
exports.getPermissions = id => {
  return $form.get(`admin-groups/${id}/permissions`)
}
// 修改员工组权限
exports.updatePermissions = (id, params) => {
  return $form.put(`admin-groups/${id}/permissions`, params)
}
// 员工组 获取单条所属仓库
exports.getAffiliation = id => {
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
// 获取全部发货单支持的仓库数据
exports.getShipWarehouse = () => {
  return $form.get('warehouse-address/all')
}
// 发货单 获取添加物流信息详情
exports.aloneShipmentsDetails = id => {
  return $form.get(`shipments/${id}/logistics-info`)
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
exports.updateBatch = params => {
  return $form.post('shipments/logistics-import', params)
}
// 删除预报包裹列表
exports.deletePackages = ids => {
  return $form.put('packages/batch-delete', ids)
}
// 预报包裹列表 获取订单统计数据
exports.getOrderCounts = params => {
  return $form.get('packages/counts', { params })
}
// 批量发送通知
exports.sendingNotify = params => {
  return $form.post('re-notify', params)
}
// 退回未入库
exports.returnBack = id => {
  return $form.put(`packages/${id}/rollback`)
}
// 彻底删除 预报包裹
exports.deleteDiscard = ids => {
  return $form.put('packages/batch-complete-delete', ids)
}
// 预报包裹列表 批量恢复被弃件包裹
exports.restoreDiscard = ids => {
  return $form.put('packages/batch-restore', ids)
}
// 预报包裹入库 批量弃件
exports.deleteInvalid = ids => {
  return $form.put('packages/batch-invalid', ids)
}
// 预报包裹列表 弃件日志
exports.getInvalidLog = id => {
  return $form.get(`packages/${id}/operate-logs`)
}
// 获取预报包裹列表筛选数据
exports.getAgent = () => {
  return $form.get('agents/simple-list')
}
// 预报包裹列表 批量入库
exports.importOrder = () => {
  return $form.get('packages/import-template')
}
// 预报包裹列表 批量入库 上传数据
exports.importData = name => {
  return $form.post('packages/import-data', name)
}
// 预报包裹列表 确定批量入库
exports.updateImport = params => {
  return $json.post('packages/import', params)
}
// 预报包裹列表 批量更新包裹属性
exports.batchUpdate = params => {
  return $form.put(`packages/batch-update`, params)
}
// 无人认领包裹
exports.getNoOwner = params => {
  return $form.get('packages/no-owner', { params })
}
// 无人认领记录  无人认领导出
exports.uploadOwner = params => {
  return $form.get('packages/no-owner/claim-logs/export', { params })
}
// 认领记录
exports.claimLogs = params => {
  return $form.get('packages/no-owner/claim-logs', { params })
}
// 无人认领包裹 导出
exports.uploadNoOwner = params => {
  return $form.get('packages/no-owner/export', { params })
}
// 无人认领包裹 获取认领包裹的id
exports.getClaimList = params => {
  return $form.get('packages/user-search', { params })
}
// 无人认领 认领包裹
exports.claimPackage = (id, users) => {
  return $form.put(`packages/no-owner/${id}/owner`, users)
}
// 无人认领包裹 删除
exports.deleteNoOwner = ids => {
  return $form.put('packages/no-owner/batch-delete', ids)
}
// 预报包裹列表 导出
exports.uploadPackage = params => {
  return $form.get('packages/export', { params })
}
// 预报包裹列表 详情
exports.getPackageDetails = id => {
  return $form.get(`packages/${id}`)
}
// 预报包裹列表 获得仓库列表数据
exports.getSimpleList = () => {
  return $form.get('packages/warehouse-simple-list')
}
// 预报包裹列表 打印标签 查看
exports.checkPackageLabel = id => {
  return $form.get(`packages/${id}/label/html`)
}
// 预报包裹列表 打印标签 确认下载
exports.updatePackagePdf = id => {
  return $form.get(`packages/${id}/label/pdf`)
}
// 代理管理 获取单条详细
exports.getEditAgent = id => {
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
exports.changePassword = params => {
  return $form.put('modify-password', params)
}
// 获取配置下的代理列表
exports.getAgents = params => {
  return $form.get('agents', { params })
}
// 获取代理列表的成交记录
exports.getAgentOrders = (id, params) => {
  return $form.get(`agents/${id}/deal-orders`, { params })
}
// 完成成交记录
exports.finishOrders = id => {
  return $form.put(`agents/commission/${id}`)
}
// 成交记录 批量结算
exports.batchOrders = id => {
  return $form.put(`agents/${id}/commissions/settled`)
}
// 代理管理的添加代理
exports.addAgents = params => {
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
// 代理管理 佣金管理 导出清单
exports.uploadWithdraws = (id, params) => {
  return $form.get(`agents/${id}/withdraws/export`, { params })
}
// 小程序配置
exports.getMini = () => {
  return $form.get('mini-program/settings')
}
// 小程序配置 获取转运规则
exports.getTranshipment = params => {
  return $form.get('mini-program/transhipment-rule', { params })
}
// 小程序配置 更新 转运规则
exports.updateTranshipment = params => {
  return $form.put('mini-program/transhipment-rule', params)
}
// 编辑保存小程序配置
exports.updateMini = params => {
  return $form.put('mini-program/settings', params)
}
// 小程序配置 获取图片配置
exports.getProgramImg = () => {
  return $form.get('mini-program/images')
}
// 小程序配置 修改图片配置
exports.changeProgramImg = params => {
  return $form.put('mini-program/images', params)
}
// 小程序配置 获取海报配置
exports.getProgramShare = () => {
  return $form.get('mini-program/share-page-info')
}
// 公众号配置 获取
exports.getWechatOa = () => {
  return $form.get('wechat-oa-config')
}
// 公众号配置 更新
exports.updateWechatOa = params => {
  return $form.put('wechat-oa-config', params)
}
// 更新海报配置
exports.updateProgramShare = params => {
  return $form.put('mini-program/share-page-info', params)
}
// 获取功能配置
exports.getValidate = params => {
  return $form.get(`mini-program/configs`, params)
}
// 更新 功能配置
exports.updateValidate = params => {
  return $form.put(`mini-program/configs`, params)
}
// 获取消息模版
exports.getTemplate = () => {
  return $form.get('mini-program/templates')
}
// 更新 消息模版
exports.updateTemplates = params => {
  return $form.put('mini-program/templates', params)
}
// 获取公众号消息模版
exports.getPubTemplate = () => {
  return $form.get('wechat-oa-config/templates')
}
// 更新公众号消息模版
exports.updatePubTemplate = params => {
  return $form.put('wechat-oa-config/templates', params)
}
// 文件上传
exports.uploadFiles = params => {
  return $file.post('upload/files', params)
}
// 获取微信支付
exports.getWechat = () => {
  return $form.get('payments/wechat')
}
exports.updateWechat = params => {
  return $form.put('payments/wechat', params)
}
// 获取paypal支付
exports.getPaypal = () => {
  return $form.get('payments/paypal')
}
// 获取支付宝支付
exports.getAlipay = () => {
  return $form.get('payments/alipay')
}
// 更新支付宝支付
exports.updateAlipay = params => {
  return $form.put('payments/alipay', params)
}
// 获取ottpay支付
exports.getOttPay = () => {
  return $form.get('payments/ottpay')
}
// 更新ottpay支付
exports.updateOttPay = params => {
  return $form.put('payments/ottpay', params)
}
// 更改 微信支付
exports.updatePaypal = params => {
  return $form.put('payments/paypal', params)
}
// 配置 获取仓库地址配置
exports.getWarehouseAddress = params => {
  return $form.get('warehouse-address', { params })
}
// 配置 仓库地址配置 开启或关闭
exports.warehouseEnabled = (id, status) => {
  return $form.put(`warehouse-address/${id}/status/${status}`)
}
exports.warehouseLocationIndex = params => {
  return $form.put('warehouse-address/sort', params)
}
//设置无人认领包裹专区
exports.unclaimedArea = (id, params) => {
  return $form.put(`warehouse-address/${id}/goods-allocation-areas/set-nps-area`, params)
}
exports.offShelfStatus = (warehouseId, params) => {
  return $form.put(`warehouse-address/${warehouseId}/goods-allocation-areas/config`, params)
}
// 仓位管理 锁定或开锁
exports.updateLocks = (id, status) => {
  return $form.put(`warehouse-address/area-Unlock/${id}/status/${status}`)
}
// 仓位管理 查看货位状态
exports.checkedFinish = id => {
  return $form.get(`warehouse-address/whole-package-number/${id}`)
}
// 配置 新建仓库地址配置
exports.addWarehouseAddress = params => {
  return $form.post('warehouse-address', params)
}
// 配置 获取单条仓库地址配置
exports.aloneWarehouseAddress = id => {
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
// 仓库地址 仓位管理 拖拽排序
exports.positionsSort = (id, params) => {
  return $form.put(`warehouse-address/${id}/goods-allocation-areas/sort-index`, params)
}
// 仓库地址配置 仓位管理 按区域编号自动排序
exports.resetIndex = id => {
  return $form.put(`warehouse-address/${id}/goods-allocation-areas/reset-index`)
}
// 配置 编辑保存单条仓库地址配置
exports.editWarehouseAddress = (id, params) => {
  return $form.put(`warehouse-address/${id}`, params)
}
// 配置 删除单条仓库地址配置
exports.deleteWarehouseAddress = id => {
  return $form.delete(`warehouse-address/${id}`)
}
// 配置 仓库地址配置 获取数据库全部国家
exports.AutoCountry = params => {
  return $form.get('countries/search', { params })
}
// 配置 批量导入国家 获取模板类型列表
exports.getTmpTypeList = () => {
  return $form.get('countries/import-template-types')
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
exports.updateExplanation = params => {
  return $form.put('payments/insurance/explanation', params)
}
// 保险服务 获取开启路线
exports.getInsuranceLine = params => {
  return $form.get('payments/insurance/lines', { params })
}
// 保险服务 更新开启路线
exports.updateInsuranceLine = params => {
  return $form.put('payments/insurance/lines', params)
}
// 关税服务 获取开启路线
exports.getTariffLine = params => {
  return $form.get('order-tariff-configs/lines', { params })
}
// 关税服务 更新开启路线
exports.updateTariffLine = params => {
  return $form.put('order-tariff-configs/lines', params)
}
// 更改当前的重量及货币配置
exports.confirmLocalization = params => {
  return $form.put('localization', params)
}
// 小程序配置 获取如何下单
exports.getInstructions = () => {
  return $form.get('mini-program/instructions')
}
// 小程序配置 更新如何下单
exports.updateInstructions = params => {
  return $form.put('mini-program/instructions', params)
}
// 更多配置 获取API与服务
exports.getApiService = () => {
  return $form.get('api-services')
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
exports.updateBasic = params => {
  return $form.put('basic-settings', params)
}
// 更多配置  获取汇率配置
exports.getRates = params => {
  return $form.get('exchange-rates', { params })
}
// 更多配置 删除汇率
exports.deleteRate = id => {
  return $form.delete(`exchange-rates/${id}`)
}
// 更多配置 获取拼团配置
exports.getConfiguration = params => {
  return $form.get('group-buying/user-config', { params })
}
// 更多配置 新增 拼团配置
exports.addConfiguration = params => {
  return $form.post('group-buying-user', params)
}
// 更多配置 拼团配置 删除
exports.deleteConfiguration = id => {
  return $form.delete(`group-buying-user/${id}`)
}
// 更多配置 拼团配置 获取单条客户信息
exports.getUserDetails = id => {
  return $form.get(`users/${id}`)
}
// 更多配置 自动获取
exports.autoGet = () => {
  return $form.get('exchange-rates/rate')
}
// 更多配置 新建汇率
exports.saveRate = params => {
  return $form.post('exchange-rates', params)
}
// 更多配置 新建汇率 开关启用状态
exports.closeRate = id => {
  return $form.put(`exchange-rates/${id}/enabled`)
}
// 更多配置 获取当前结算货币
exports.getCurrency = () => {
  return $form.get('exchange-rates/currency')
}
// 更多配置 获取短信服务数据
exports.getSms = () => {
  return $form.get('api-services/sms')
}
// 更多配置 获取物流查询服务数据
exports.getTrackingData = () => {
  return $form.get('api-services/tracking')
}
// 更多配置 获取购买记录数据
exports.getHistory = (id, params) => {
  return $form.get(`api-services/${id}/orders`, { params })
}
// 更多配置 短信服务 获取详情
exports.smsRecord = params => {
  return $form.get(`api-services/sms/records`, { params })
}
// 更多配置 短信服务 测试第三方短信服务
exports.verifyConfigs = params => {
  return $form.post('configs/verify-juhe', params)
}
// 更多配置 API与服务
exports.moreService = () => {
  return $form.get('api-services')
}
// 更多配置 获取短信模版
exports.getSmsSystem = () => {
  return $form.get('api-services/sms/templates/system')
}
// 更多配置 更新短信服务
exports.updateSmsSystem = params => {
  return $json.put('api-services/sms', params)
}
// 更多配置 更新物流查询服务
exports.updateTrackingSystem = params => {
  return $form.put('api-services/tracking', params)
}
// 更多配置 获取第三方短信服务数据
exports.getCustomSystem = () => {
  return $form.get('api-services/sms/templates/custom')
}
// 更多配置 购买短信服务 获取数据
exports.serviceType = id => {
  return $form.get(`api-services/${id}/products`)
}
// 更多配置 发货快递公司 列表
exports.deliveryCompanyList = id => {
  return $form.get(`company-expresses/${id}/replacements`)
}
// 更多配置 发货快递公司 详情
exports.deliveryCompanyDetail = id => {
  return $form.get(`company-expresses/replacements/${id}`)
}
// 更多配置 发货快递公司 删除
exports.deliveryCompanyDel = id => {
  return $form.delete(`company-expresses/replacements/${id}`)
}
// 更多配置 发货快递公司 新建
exports.deliveryCompanyNew = (id, params) => {
  return $form.post(`company-expresses/${id}/replacements`, params)
}
// 更多配置 发货快递公司 更新
exports.deliveryCompanyUpdate = (id, params) => {
  return $form.put(`company-expresses/replacements/${id}`, params)
}
// 获取支付二维码
exports.productsImg = (id, params) => {
  return $form.post(`api-services/${id}/ordering`, params)
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
exports.getAloneTracking = id => {
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
exports.typeLocationIndex = params => {
  return $form.put('logistics-types/custom/sort-indexes', params)
}
// 新增 自定义物流系统
exports.addTypeData = params => {
  return $form.post('logistics-types/custom', params)
}
// 删除 自定义物流系统
exports.deleteTypeData = id => {
  return $form.delete(`logistics-types/custom/${id}`)
}
// 修改 自定义物流系统
exports.updateTypeData = (id, params) => {
  return $form.put(`logistics-types/custom/${id}`, params)
}
// 获取 单条自定义物流系统
exports.getAloneType = id => {
  return $form.get(`logistics-types/custom/${id}`)
}
// 更多配置 获取转账支付
exports.getPayments = () => {
  return $form.get('payments')
}
// 更多配置 获取模版配置
exports.getEmail = params => {
  return $form.get('email-templates', { params })
}
// 添加转账支付方式
exports.addPayments = params => {
  return $form.post('payments', params)
}
// 更多配置 删除单条转账支付
exports.deleteTransfer = id => {
  return $form.delete(`payments/${id}`)
}
// 获取转账支付详情
exports.editPayments = id => {
  return $form.get(`payments/${id}`)
}
// 获取当前结算货币
exports.currencyPayment = () => {
  return $form.get('payments/currency')
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
// 添加支付配置自定义选项
exports.addPay = params => {
  return $form.post(`payments/account`, params)
}
// 支付配置自定义列表
exports.getPayLang = (id, params) => {
  return $form.get(`payments/account/index/${id}`, params)
}
// 支付配置自定义详情
exports.getPayDetails = (id, params) => {
  return $form.get(`payments/account/${id}`, { params })
}
// 删除支付配置自定义选项
exports.deletePay = (id, params) => {
  return $form.delete(`payments/account/${id}`, params)
}
// 编辑支付配置自定义选项
exports.editPay = (id, params) => {
  return $form.put(`payments/account/${id}`, params)
}
// 修改支付配置自定义选项翻译
exports.editPayLang = (id, params) => {
  return $form.put(`payments/account/${id}/translate-data`, params)
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
exports.updateRechargeAmount = params => {
  return $form.post(`payments/payment/default-amount`, params)
}
// 更多配置 删除 预设充值金额
exports.deleteRechargeAmount = id => {
  return $form.delete(`payments/payment/default-amount/${id}`)
}
// 获取物品属性
exports.getPackage = () => {
  return $form.get('package-props')
}
// 物品属性 语言详情
exports.propsLang = params => {
  return $form.get(`package-props`, { params })
}
// 物品属性 获取单条语言详情
exports.propsAloneLang = (id, params) => {
  return $form.get(`package-props/${id}`, { params })
}
// 物品属性 添加或修改语言
exports.updatePropsLang = (id, params) => {
  return $form.put(`package-props/${id}/translate-data`, params)
}
// 物品属性 确认拖拽
exports.sortProps = params => {
  return $form.put('package-props/sort', params)
}
// 添加新属性
exports.addPackage = params => {
  return $form.post('package-props', params)
}
// 删除物品属性
exports.deleteProps = ids => {
  return $form.put('package-props/batch-delete', ids)
}
// 获取 物流跟踪配置
exports.getLogistics = () => {
  return $form.get('configs')
}
// 更改 物流跟踪配置
exports.editLogistics = params => {
  return $form.put('configs', params)
}
// 更多配置 服务配置 检测快递100
exports.verifyKd100 = params => {
  return $form.post(`configs/verify-kd100`, params)
}
// 更多配置 服务配置 检测trackingmore 配置
exports.verifyTrackingMore = params => {
  return $form.post(`configs/verify-trackingmore`, params)
}
// 更多配置 服务配置 检测trackmore 配置
exports.verifyTrackMore = params => {
  return $form.post(`/api-services/tracking/verify/17-track`, params)
}
// 更多配置 服务配置 检测邮件发件信息配置
exports.verifySmtp = params => {
  return $form.post(`configs/verify-smtp`, params)
}
// 更多配置 服务配置 检测Juhe
exports.verifyJuhe = params => {
  return $form.post(`configs/verify-juhe`, params)
}
// 配置 下载国际导入模板
exports.getImportTemplate = params => {
  return $form.get(`countries/import-template`, params)
}
// 配置 批量导入
exports.batchImport = file => {
  return $file.post('countries/import', file)
}
// 配置 更新国家背景颜色
exports.updateColor = (id, params) => {
  return $form.put(`countries/${id}/rgb-color`, params)
}
// 配置 设置功能状态
exports.setFunctionStatus = (func, status) => {
  return $form.put(`wechat-oa-config/${func}/status/${status}`)
}
// 配置 更多配置 系统服务配置 公众号配置 列表
exports.customMenuList = () => {
  return $form.get('wechat-oa-config/menus')
}
// 配置 更多配置 系统服务配置 公众号配置 详情
exports.getMenuDetail = id => {
  return $form.get(`wechat-oa-config/menus/${id}`)
}
// 配置 更多配置 系统服务配置 公众号配置 新建
exports.getNewMenu = params => {
  return $form.post('wechat-oa-config/menus', params)
}
// 配置 更多配置 系统服务配置 公众号配置 更新
exports.updateMenu = (id, params) => {
  return $form.put(`wechat-oa-config/menus/${id}`, params)
}
// 配置 更多配置 系统服务配置 公众号配置 删除
exports.deleteMenu = id => {
  return $form.delete(`wechat-oa-config/menus/${id}`)
}
// 配置 更多配置 系统服务配置 公众号配置 发布菜单
exports.publishMenu = () => {
  return $form.post('wechat-oa-config/menus/publish')
}
// 配置 更多配置 系统服务配置 公众号配置 回复消息 列表
exports.replyMessageList = params => {
  return $form.get('wechat-oa-config/messages', { params })
}
// 配置 更多配置 系统服务配置 公众号配置 回复消息 详情
exports.replyMessageDetail = id => {
  return $form.get(`wechat-oa-config/messages/${id}`)
}
// 配置 更多配置 系统服务配置 公众号配置 回复消息 新建
exports.addReplyMessage = params => {
  return $form.post('wechat-oa-config/messages', params)
}
// 配置 更多配置 系统服务配置 公众号配置 回复消息 更新
exports.updateReplyMessage = (id, params) => {
  return $form.put(`wechat-oa-config/messages/${id}`, params)
}
// 配置 更多配置 系统服务配置 公众号配置 回复消息 删除
exports.deleteReplyMessage = id => {
  return $form.delete(`wechat-oa-config/messages/${id}`)
}
// 配置 更多配置 系统服务配置 公众号配置 获取被关注回复或收到消息回复
exports.getMsgReply = params => {
  return $form.get('wechat-oa-config/messages/replies', { params })
}
// 配置 更多配置 系统服务配置 公众号配置 更新关注回复和收到消息回复
exports.updateMsgReply = params => {
  return $form.put('wechat-oa-config/messages/replies', params)
}
// 新增 邮件模版
exports.addEmail = params => {
  return $form.post('email-templates', params)
}
// 邮件模版 获取单条编辑 详细
exports.getAloneEmail = id => {
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
exports.deleteAloneEmail = id => {
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
exports.deleteLG = id => {
  return $form.delete(`languages/${id}`)
}
// 语言包 删除字符串
exports.deleteLg = id => {
  return $form.delete(`string-translations/${id}`)
}
// 语言包 设为默认
exports.defaultLg = id => {
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
exports.addLg = params => {
  return $form.post('languages', params)
}
// 语言包 获取单条详细
exports.singleLg = id => {
  return $form.get(`languages/${id}`)
}
// 字符串翻译
exports.stringTranslate = params => {
  return $form.get('string-translations', { params })
}
// 字符串翻译 获取支持的字符串
exports.getString = () => {
  return $form.get('string-translations/enabled-languages')
}
// 字符串翻译 新建
exports.addString = params => {
  return $form.post('string-translations', params)
}
// 字符串翻译 更新
exports.updateString = (id, params) => {
  return $form.put(`string-translations/${id}`, params)
}
// 字符串翻译 获取单条详细
exports.detailsString = id => {
  return $form.get(`string-translations/${id}`)
}
// 更新单条详细
exports.updateLg = (id, params) => {
  return $form.put(`languages/${id}`, params)
}
// 更多配置 订单获取增值服务
exports.getValue = params => {
  return $form.get('value-added-services', { params })
}
// 更多配置 订单添加增值服务
exports.addValue = params => {
  return $form.post(`value-added-services`, params)
}
// 更多配置 订单获取单条增值服务
exports.getService = id => {
  return $form.get(`value-added-services/${id}`)
}
// 更多配置 获取保险服务列表
exports.getInsurance = () => {
  return $form.get('payments/insurance')
}
// 更多配置 获取关税服务列表
exports.getTariff = () => {
  return $form.get('order-tariff-configs')
}
// 更多配置 获取关税说明
exports.tariffExplanation = () => {
  return $form.get('order-tariff-configs/explanation')
}
// 更多配置 获取关税说明
exports.uploadTariffExplanation = params => {
  return $form.put('order-tariff-configs/explanation', params)
}
// 更多配置 获取单条关税
exports.getAloneTariff = id => {
  return $form.get(`order-tariff-configs/${id}`)
}
// 更多配置 新增 关税服务
exports.tariffAdd = params => {
  return $form.post(`order-tariff-configs`, params)
}
// 更多配置 更新 关税服务
exports.tariffEdit = (id, params) => {
  return $form.put(`order-tariff-configs/${id}`, params)
}
// 更多配置 删除 关税服务
exports.tariffDelete = id => {
  return $form.delete(`order-tariff-configs/${id}`)
}
// 更多配置 获取关税配置开关
exports.tariffEnabled = () => {
  return $form.get('order-tariff-configs/status')
}
// 更多配置 获取单条 保险服务
exports.getSingleInsurance = id => {
  return $form.get(`payments/insurance/${id}`)
}
// 更多配置 更新 保险服务
exports.updateInsurance = (id, params) => {
  return $form.post(`payments/insurance/${id}`, params)
}
// 更多配置 保险服务的开关
exports.changeInsurance = status => {
  return $form.put(`payments/insurance/switch/${status}`)
}
// 更多配置 关税服务的开关
exports.changeTariff = status => {
  return $form.put(`order-tariff-configs/status/${status}`)
}
// 更多配置 获取国家/地区 列表
exports.countryLocation = () => {
  return $form.get('countries')
}
// 仓库地址配置 获取支持国家地区数据
exports.getEnabledCountry = () => {
  return $form.get('countries/enabled')
}
// 更多配置 删除国家/地区
exports.deleteCountryLocation = id => {
  return $form.delete(`countries/${id}`)
}
// 更多配置 开启或关闭 国家/地区
exports.closeCountryLocation = (id, status) => {
  return $form.put(`countries/${id}/status/${status}`)
}

// 更多配置 国家地区 排序
exports.countryLocationIndex = params => {
  return $form.put('countries/sort-indexes', params)
}
// 更多配置 国家地区 获取二三级区域数据
exports.superiorArea = id => {
  return $form.get(`countries/${id}/areas`)
}
// 国家地区 删除 二三级国家区域
exports.deleteLOwLevel = params => {
  return $form.put('countries/areas/batch-delete', params)
}
// 国家地区 开启或关闭 二三级国家
exports.changeLowLeverCountry = (id, status) => {
  return $form.put(`countries/areas/${id}/status/${status}`)
}
// 国家地区 新建二三级区域
exports.newAreas = params => {
  return $form.post('countries/areas', params)
}
// 国家地区 获取 二三级区域 详情
exports.detailsAreas = id => {
  return $form.get(`countries/areas/${id}`)
}
// 国家地区 更新 二三级区域 详情
exports.updateDetailsAreas = (id, params) => {
  return $form.put(`countries/areas/${id}`, params)
}
// 国家地区 获取地域通知列表数据
exports.getRegional = params => {
  return $form.get('countries/area-notifications', { params })
}
// 国家地区 地域通知管理 新增
exports.newNotifi = params => {
  return $form.post('countries/area-notifications', params)
}
// 国家地区 地域通知管理 新增
exports.getNotifi = id => {
  return $form.get(`countries/area-notifications/${id}`)
}
// 国家地区 地域通知管理 新增
exports.deleteNotifi = id => {
  return $form.delete(`countries/area-notifications/${id}`)
}
// 国家地区 地域通知管理 更新
exports.updateNotifi = (id, params) => {
  return $form.put(`countries/area-notifications/${id}`, params)
}
// 订单增值服务 语言详情
exports.serviceLang = (id, params) => {
  return $form.get(`value-added-services/${id}`, { params })
}
// 更多配置 获取发货快递公司
exports.getExpressValue = params => {
  return $form.get('company-expresses', { params })
}
// 更多配置 获取详情 发货快递公司
exports.getExpressDetails = id => {
  return $form.get(`company-expresses/${id}`)
}
// 新增 发货快递公司
exports.addExpress = params => {
  return $form.post('company-expresses', params)
}
// 更新 发货快递公司
exports.updateExpress = (id, params) => {
  return $form.put(`company-expresses/${id}`, params)
}
// 删除 发货快递公司
exports.deleteExpress = id => {
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
exports.queryExpress = params => {
  return $json.post('express-fee-query', params)
}
// 订单 运费查询 单条详情
exports.getLineDetail = id => {
  return $form.get(`express-fee-query/express-line/${id}`)
}
// 运费查询 获取寄往仓库
exports.getExpressFee = params => {
  return $form.get('express-fee-query/warehouses', { params })
}
// 渠道增值服务
exports.getExpressServes = (id, lineId) => {
  return $form.get(`orders/${id}/express/${lineId}/vas`)
}
// 订单 包裹订单概览 饼图
exports.getPie = params => {
  return $form.get('order-overviews/package/status-count', { params })
}
// 订单 包裹订单概览 柱状图
exports.getColumnar = params => {
  return $form.get('order-overviews/package/created-count', { params })
}
// 订单 订单订单概览 饼图
exports.getOrderPie = params => {
  return $form.get('order-overviews/order/status-count', { params })
}
// 订单 订单订单概览 柱状图
exports.getOrderColumnar = params => {
  return $form.get('order-overviews/order/created-count', { params })
}
// 订单概览 订单对比数据
exports.orderCompare = params => {
  return $form.get('order-overviews/order/compare-data', { params })
}
// 订单概览 包裹对比数据
exports.packageCompare = params => {
  return $form.get('order-overviews/package/compare-data', { params })
}
// 订单 申报信息 列表查询
exports.declareList = params => {
  return $form.get('declare', { params })
}
// 订单 申报信息 获取详情
exports.declareDetail = id => {
  return $form.get(`declare/${id}`)
}
// 订单 申报信息 编辑
exports.editDeclare = (id, params) => {
  return $form.put(`declare/${id}`, params)
}
// 订单 申报信息 提交
exports.submitDecalre = ids => {
  return $form.put('declare/commit', ids)
}
// 订单 申报信息 获取编辑初始化信息
exports.initDeclare = () => {
  return $form.get('declare/init')
}
// 订单 异常件 异常说明
exports.exceptDescription = id => {
  return $form.get(`orders/${id}/exception`)
}
// 订单 申报信息 对接日志
exports.dockingLog = id => {
  return $form.get(`declare/${id}/third-logs`)
}
// 订单 申报信息 申报单填充
exports.fillDeclare = (id, params) => {
  return $form.put(`declare/${id}/update-party`, params)
}
// 订单 申报信息 申报多箱填充
exports.fillDeclareBox = (id, params) => {
  return $form.put(`declare/${id}/update-boxes-party`, params)
}
// 订单 申报信息 设置默认值
exports.setDefaultValue = params => {
  return $form.put(`declare-settings`, params)
}
//订单 申报信息 获取默认值详情
exports.getDefaultValue = () => {
  return $form.get('declare-settings')
}
// 财务 财务概览 柱状图
exports.financeColumnar = params => {
  return $form.get('transaction-overviews/trade-count', { params })
}
// 财务概览 对比数据
exports.financeCompare = params => {
  return $form.get('transaction-overviews/compare-data', { params })
}
// 财务概览 获取金额统计
exports.transactionAmount = params => {
  return $form.get('transaction-overviews/amount-count', { params })
}
// 财务 财务概览 表格
exports.financeData = params => {
  return $form.get('transaction-overviews/daily-count', { params })
}
// 订单概览 包裹列表
exports.packageDaily = params => {
  return $form.get('order-overviews/package/daily-count', { params })
}
// 订单概览 包裹列表
exports.orderDaily = params => {
  return $form.get('order-overviews/order/daily-count', { params })
}
// 更多配置 订单修改单条增值服务
exports.updateService = (id, params) => {
  return $form.put(`value-added-services/${id}`, params)
}
// 更多配置 订单删除单条增值服务
exports.deleteValue = id => {
  return $form.delete(`value-added-services/${id}`)
}
// 更多配置 订单增值服务 开关启用状态
exports.closeValue = (id, status) => {
  return $form.put(`value-added-services/${id}/status/${status}`)
}
// 更多配置 包裹获取增值服务
exports.getParcel = params => {
  return $form.get('package-services', { params })
}
// 更多配置 包裹添加增值服务
exports.addParcel = params => {
  return $form.post(`package-services`, params)
}
// 更多配置 包裹获取单条增值服务
exports.getPaVal = id => {
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
exports.deleteParcel = id => {
  return $form.delete(`package-services/${id}`)
}
// 更多配置 包裹增值服务 开关启用状态
exports.closeParcel = (id, status) => {
  return $form.put(`package-services/${id}/status/${status}`)
}
// 更多配置 单号规则
exports.getRules = params => {
  return $form.get('serial-numbers', { params })
}
// 更多配置 单号规则
exports.changeRules = (id, status) => {
  return $form.put(`serial-numbers/${id}/status/${status}`)
}
// 更多配置 单号规则 重新生成
exports.goResetId = () => {
  return $form.put(`serial-numbers/re-generate-uid`)
}
// 获取单号规则 详细
exports.getRulesDetails = id => {
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
exports.pcLang = params => {
  return $form.get(`website-settings`, { params })
}
// 其余配置 添加或修改语言
exports.updatePcLang = params => {
  return $form.put(`website-settings/translate-data`, params)
}
// 更多配置 其余配置 修改
exports.editWebsite = params => {
  return $form.put('website-settings', params)
}
// 更多配置 PC端配置 获取第三方登录配置数据
exports.getOauth = () => {
  return $form.get('website-settings/oauth-config')
}
// 更多配置 PC端配置 获取第三方登录配置数据
exports.updateOauth = params => {
  return $form.put('website-settings/oauth-config', params)
}
// 更多配置 获取商品分类管理
exports.getCategories = params => {
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
exports.getSecondCategories = id => {
  return $form.get(`package-categories/${id}/children`)
}
// 更多配置 删除商品分类管理
exports.deleteCategories = id => {
  return $form.delete(`package-categories/${id}`)
}
// 更多配置 获取商品分类风险提示
exports.getRiskDetails = id => {
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
exports.newCategories = params => {
  return $form.post(`package-categories`, params)
}
// 更多配置 自提点配置
exports.getSelf = params => {
  return $form.get('self-pickup-stations', { params })
}
// 自提点配置 是否支持货到付款
exports.resetSelf = (id, status) => {
  return $form.put(`self-pickup-stations/${id}/status/${status}`)
}
// 自提点配置 修改开启或关闭
exports.resetEnabled = (id, status) => {
  return $form.put(`self-pickup-stations/${id}/enabled/${status}`)
}
// 自提点配置 查看单条支持线路
exports.getPointLines = id => {
  return $form.get(`self-pickup-stations/${id}/express-lines`)
}
// 获取支持线路
exports.getStations = params => {
  return $form.get(`self-pickup-stations/express-line-list`, { params })
}
// 新建 自提点
exports.addSelf = params => {
  return $form.post('self-pickup-stations', params)
}
// 删除 自提点
exports.deleteSelf = id => {
  return $form.delete(`self-pickup-stations/${id}`)
}
// 自提点 批量通知
exports.batchNotify = ids => {
  return $form.post('stations/notify', ids)
}
//自定义标签 列表查询
exports.lineLabel = () => {
  return $form.get('express-line-labels')
}
//自定义标签 获取详情
exports.detailLabel = id => {
  return $form.get(`express-line-labels/${id}`)
}
//自定义标签 新增
exports.newLabel = params => {
  return $form.post('express-line-labels', params)
}
//自定义标签 修改
exports.modifyLabel = (id, params) => {
  return $form.put(`express-line-labels/${id}`, params)
}
//自定义标签 排序
exports.sortLabel = params => {
  return $form.put('express-line-labels/sort', params)
}
//自定义标签 翻译
exports.getTranslate = (id, params) => {
  return $form.put(`express-line-labels/${id}/translate-data`, params)
}
//自定义标签 批量删除
exports.deleteLabel = ids => {
  return $form.put('express-line-labels/batch-delete', ids)
}
// 自提点 获取详细
exports.getOneSelf = id => {
  return $form.get(`self-pickup-stations/${id}`)
}
// 自提点 更新
exports.updateOneSelf = (id, params) => {
  return $form.put(`self-pickup-stations/${id}`, params)
}
// 自提点 获取树状数据
exports.treeIndex = () => {
  return $form.get('self-pickup-stations/tree-index')
}
// 自提点 计佣方式列表
exports.pickRules = params => {
  return $form.get('self-pickup-stations/rules', { params })
}
// 自提点 计佣方式列表 新增
exports.addPickRules = params => {
  return $form.post('self-pickup-stations/rules', params)
}
// 自提点 计佣方式列表 单条详情
exports.getPickDetails = id => {
  return $form.get(`self-pickup-stations/rules/${id}`)
}
// 自提点 计佣方式列表 更新
exports.updatePickRules = (id, params) => {
  return $form.put(`self-pickup-stations/rules/${id}`, params)
}
// 自提点 计佣方式列表 删除
exports.deletePickRules = id => {
  return $form.delete(`self-pickup-stations/rules/${id}`)
}
// 营销管理 会员体系 等级配置 启用成长值、积分
exports.updateGradeBtn = params => {
  return $form.post(`member-config`, params)
}
// 营销管理 会员体系 等级配置 获取成长值、积分开关状态
exports.getGradeBtn = () => {
  return $form.get(`member-config/show`)
}
// 营销管理 会员体系 等级配置 列表
exports.getGradeList = params => {
  return $form.get(`member-level`, { params })
}
// 营销管理 会员体系 等级配置 详情
exports.getGradeDetails = (id, params) => {
  return $form.get(`member-level/${id}`, { params })
}
// 营销管理 会员体系 等级配置 编辑保存
exports.editGrade = (id, params) => {
  return $form.put(`member-level/${id}`, params)
}
// 营销管理 会员体系 等级配置 新增保存
exports.addGrade = params => {
  return $form.post(`member-level`, params)
}
// 营销管理 会员体系 等级配置 删除
exports.deleteGrade = id => {
  return $form.delete(`member-level/${id}`)
}
// 营销管理 会员体系 等级配置 删除
exports.translateGrade = (id, params) => {
  return $form.put(`member-level/${id}/translate-data`, params)
}
// 营销管理 会员体系 等级配置 等级说明
exports.getGradeTips = () => {
  return $form.get(`member-level-illustrate/show`)
}
// 营销管理 会员体系 等级配置 修改等级说明
exports.editGradeTips = params => {
  return $form.post(`member-level-illustrate`, params)
}
// 营销管理 会员体系 收支规则
exports.getInOutRule = () => {
  return $form.get(`in-out-rule`)
}
// 营销管理 会员体系 收支规则 启用禁用
exports.changeRuleEnabled = (id, params) => {
  return $form.put(`in-out-rule/${id}/enabled`, params)
}
// 营销管理 会员体系 收支规则 消费转换成长值 选项数据
exports.getGrowthValue = () => {
  return $form.get(`in-out-rule/growth-value-increase/init`)
}
// 营销管理 会员体系 收支规则 消费转换成长值详情
exports.getGrowthValueDetails = () => {
  return $form.get(`in-out-rule/growth-value-increase/show`)
}
// 营销管理 会员体系 收支规则 消费积累积分 选项数据
exports.getPointIncrease = () => {
  return $form.get(`in-out-rule/point-increase/init`)
}
// 营销管理 会员体系 收支规则 消费积累积分详情
exports.getPointIncreaseDetails = () => {
  return $form.get(`in-out-rule/point-increase/show`)
}
// 营销管理 会员体系 收支规则 更新消费积累积分
exports.updatePointIncrease = params => {
  return $form.post(`in-out-rule/point-increase`, params)
}
// 营销管理 会员体系 收支规则 消费转换成长值更新
exports.updateGrowthDetails = params => {
  return $json.post('in-out-rule/growth-value-increase', params)
}
// 营销管理 会员体系 收支规则 评论奖励积分 选项数据
exports.getPointCommentConfig = () => {
  return $form.get('in-out-rule/point-comment-config/init')
}
// 营销管理 会员体系 收支规则 评论奖励积分详情
exports.getPointCommentDetails = () => {
  return $form.get('in-out-rule/point-comment-config/show')
}
// 营销管理 会员体系 收支规则 更新评论奖励积分
exports.updatePointComment = params => {
  return $form.post('in-out-rule/point-comment-config', params)
}
// 营销管理 会员体系 收支规则 评论奖励积分 获取表格数据
exports.getPointCommentTable = () => {
  return $form.get('in-out-rule/point-comment')
}
// 营销管理 会员体系 收支规则 评论奖励积分 获取表格数据详情
exports.getTableDetails = id => {
  return $form.get(`in-out-rule/point-comment/${id}`)
}
// 营销管理 会员体系 收支规则 评论奖励积分 修改表格数据详情
exports.editTableDetails = (id, params) => {
  return $form.put(`in-out-rule/point-comment/${id}`, params)
}
// 营销管理 会员体系 收支规则 评论奖励积分 新增表格数据详情
exports.addTable = params => {
  return $form.post(`in-out-rule/point-comment`, params)
}
// 营销管理 会员体系 收支规则 评论奖励积分 删除表格数据详情
exports.deleteTable = id => {
  return $form.delete(`in-out-rule/point-comment/${id}`)
}
// 营销管理 会员体系 收支规则 积分抵扣消费初始化信息
exports.getDecrease = () => {
  return $form.get(`in-out-rule/point-decrease/init`)
}
// 营销管理 会员体系 收支规则 积分抵扣消费详情
exports.getDecreaseDetails = () => {
  return $form.get(`in-out-rule/point-decrease/show`)
}
// 营销管理 会员体系 收支规则 修改积分抵扣消费
exports.updateDecrease = params => {
  return $form.post(`in-out-rule/point-decrease`, params)
}
// 营销管理 会员体系 收支规则 成长值购买初始化信息
exports.getGrowthValueBuy = () => {
  return $form.get(`in-out-rule/growth-value-price-config/init`)
}
// 营销管理 会员体系 收支规则 成长值购买详情
exports.getGrowthValueBuyDetails = () => {
  return $form.get(`in-out-rule/growth-value-price-config/show`)
}
// 营销管理 会员体系 收支规则 修改成长值购买
exports.updateGrowthValueBuy = params => {
  return $form.post(`in-out-rule/growth-value-price-config`, params)
}
// 营销管理 会员体系 收支规则 成长值购买 获取基础价格表
exports.getBaseTable = params => {
  return $form.get(`in-out-rule/growth-value-base-price`, { params })
}
// 营销管理 会员体系 收支规则 成长值购买 获取基础价格表详情
exports.getBaseTableDetails = (id, params) => {
  return $form.get(`in-out-rule/growth-value-base-price/${id}`, { params })
}
// 营销管理 会员体系 收支规则 成长值购买 修改基础价格表翻译
exports.editBaseTableTrans = (id, params) => {
  return $form.put(`in-out-rule/growth-value-base-price/${id}/translate-data`, params)
}
// 营销管理 会员体系 收支规则 成长值购买 新增基础价格表
exports.addBaseTable = params => {
  return $form.post(`in-out-rule/growth-value-base-price`, params)
}
// 营销管理 会员体系 收支规则 成长值购买 修改基础价格表
exports.editBaseTable = (id, params) => {
  return $form.put(`in-out-rule/growth-value-base-price/${id}`, params)
}
// 营销管理 会员体系 收支规则 成长值购买 删除基础价格表
exports.deleteBaseTable = id => {
  return $form.delete(`in-out-rule/growth-value-base-price/${id}`)
}
// 营销管理 会员体系 收支规则 成长值购买 获取优惠价格表
exports.getDiscountTable = params => {
  return $form.get(`in-out-rule/growth-value-discount-price`, { params })
}
// 营销管理 会员体系 收支规则 成长值购买 获取优惠价格表初始化
exports.getDiscount = () => {
  return $form.get(`in-out-rule/growth-value-discount-price/init`)
}
// 营销管理 会员体系 收支规则 成长值购买 获取优惠价格表详情
exports.getDiscountDetails = id => {
  return $form.get(`in-out-rule/growth-value-discount-price/${id}`)
}
// 营销管理 会员体系 收支规则 成长值购买 优惠价格表启用禁用
exports.updateDiscountEnabled = (id, params) => {
  return $form.put(`in-out-rule/growth-value-discount-price/${id}/enabled`, params)
}
// 营销管理 会员体系 收支规则 成长值购买 新增优惠价格表
exports.addDiscountTable = params => {
  return $form.post(`in-out-rule/growth-value-discount-price`, params)
}
// 营销管理 会员体系 收支规则 成长值购买 修改优惠价格表
exports.editDiscountTable = (id, params) => {
  return $form.put(`in-out-rule/growth-value-discount-price/${id}`, params)
}
// 营销管理 会员体系 收支规则 成长值购买 删除优惠价格表
exports.deleteDiscountTable = id => {
  return $form.delete(`in-out-rule/growth-value-discount-price/${id}`)
}
// 营销管理 会员体系 获取收支记录
exports.getInOutRecord = params => {
  return $form.get(`in-out-record`, { params })
}
// 营销管理 会员体系 获取收支记录初始化
exports.getRecordDefault = () => {
  return $form.get(`in-out-record/init`)
}
// 营销管理 会员体系 添加收支记录
exports.addInOutRecord = params => {
  return $form.post(`in-out-record`, params)
}
// 营销管理 会员体系 收支记录 详情
exports.getRecordDetails = id => {
  return $form.get(`in-out-record/${id}`)
}
// 营销管理 新用户福利
exports.getCoupons = () => {
  return $form.get('new-user-coupons')
}
// 营销管理 新用户福利 开启或关闭
exports.closeCoupons = (type, status) => {
  return $form.put(`new-user-coupons/type/${type}/status/${status}`)
}
// 营销管理 用户福利 开启或关闭 两券共享
exports.closeUnique = (type, status) => {
  return $form.put(`new-user-coupons/type/${type}/unique/${status}`)
}
// 营销管理 修改新用户福利
exports.editCoupons = params => {
  return $form.put('new-user-coupons', params)
}
// 营销管理 新用户福利 管理 删除
exports.newDelete = ids => {
  return $form.put('new-user-coupons/template/batch-delete', ids)
}
// 营销管理 新增 新用户福利
exports.addNew = (id, params) => {
  return $form.post(`new-user-coupons/type/${id}`, params)
}
// 营销管理 新用户福利 管理
exports.newManaList = (id, params) => {
  return $form.get(`new-user-coupons/type/${id}`, { params })
}
// 转账支付 新用户福利 管理 语言详情
exports.newLang = (id, params) => {
  return $form.get(`new-user-coupons/${id}`, { params })
}
// 转账支付 新用户福利 管理 添加或修改语言
exports.updateNewLang = (id, params) => {
  return $form.put(`new-user-coupons/${id}/translate-data`, params)
}
// 转账支付 新用户福利 管理 获取语言
exports.getNewLang = (id, params) => {
  return $form.get(`new-user-coupons/${id}/translate-data`, { params })
}
// 营销管理 抵用券管理
exports.getCouponList = params => {
  return $form.get('coupons', { params })
}
// 营销管理 抵用券管理 详情
exports.getCouponDetails = id => {
  return $form.get(`coupons/${id}`)
}
// 营销管理 下单返券
exports.rebateList = () => {
  return $form.get(`ordering-coupon`)
}
// 营销管理 更新 下单返券
exports.updateRebate = params => {
  return $form.put(`ordering-coupon`, params)
}
// 营销管理 下单返券 获取详细
exports.getRebateDetails = id => {
  return $form.get(`new-user-coupons/type/show/${id}`)
}
// 营销管理 下单返券 语言详情
exports.rebateLang = params => {
  return $form.get(`ordering-coupon`, { params })
}
// 营销管理 下单返券 添加或修改语言
exports.updateRebateLang = params => {
  return $form.put(`ordering-coupon/translate-data`, params)
}
// 营销管理 用户福利 用户福利券各类型统计
exports.typeStatistics = id => {
  return $form.get(`new-user-coupons/type/${id}/total`)
}
// 抵用券管理 路线列表
exports.getLineList = params => {
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
// 拼团管理 列表
exports.groupList = params => {
  return $form.get('group-buying', { params })
}
// 拼团管理 参团详情
exports.groupDetails = id => {
  return $form.get(`group-buying/${id}`)
}
// 拼团管理 更新团单信息
exports.updateGroupDetails = (id, params) => {
  return $form.put(`group-buying/${id}`, params)
}
// 拼团 可用地址
exports.buyingAddress = id => {
  return $form.get(`group-buying/user-addresses/${id}`)
}
// 拼团管理 移除拼团
exports.removeGroup = (id, userId) => {
  return $form.put(`group-buying/${id}/remove-member/${userId}`)
}
// 拼团管理 延长拼团时间
exports.proLong = (id, params) => {
  return $form.put(`group-buying/${id}/prolong`, params)
}
// 拼团管理 提交拼团
exports.submitGroup = id => {
  return $form.put(`group-buying/${id}/end`)
}
// 拼团管理 取消拼团
exports.cancelGroup = id => {
  return $form.put(`group-buying/${id}/cancel`)
}
// 拼团管理 团长管理列表
exports.getLeader = params => {
  return $form.get('group-buying-user', { params })
}
// 拼团管理 获取自提点地址
exports.buyingStation = id => {
  return $form.get(`group-buying/stations/${id}`)
}
// 拼团配置 获取数据
exports.getBuying = params => {
  return $form.get('group-buying-config/express-line', { params })
}
// 拼团配置 获取数据 开启或关闭
exports.closeBuying = (id, status) => {
  return $form.put(`group-buying-config/express-line/${id}/status/${status}`)
}
// 拼团配置 获取拼团配置
exports.lineBuying = id => {
  return $form.get(`group-buying-config/express-line/${id}`)
}
// 拼团配置 更新拼团配置
exports.updateLineBuying = (id, params) => {
  return $form.put(`group-buying-config/express-line/${id}`, params)
}
// 拼团配置 其他配置
exports.getGlobal = () => {
  return $form.get('group-buying-config/global')
}
// 拼团配置 更新 其他配置
exports.updateGlobal = params => {
  return $form.put('group-buying-config/global', params)
}
// 拼团配置 获取内容管理
exports.getContent = params => {
  return $form.get(`group-buying-content`, { params })
}
// 拼团配置 获取 内容管理数据详情
exports.getContentDetails = id => {
  return $form.get(`group-buying-content/${id}`)
}
// 拼团配置 获取 多语言 内容管理数据详情
exports.getContentTranslate = (id, params) => {
  return $form.get(`group-buying-content/${id}`, { params })
}
// 拼团配置 更新 内容管理数据
exports.updateContentDetails = (id, params) => {
  return $form.put(`group-buying-content/${id}`, params)
}
// 拼团配置 更新 内容管理多语言
exports.updateContentTranslate = (id, params) => {
  return $form.put(`group-buying-content/${id}/translate-data`, params)
}
// 视频管理 获取单条视频详细
exports.getSingleVideo = id => {
  return $form.get(`videos/${id}`)
}
// 视频管理 删除视频
exports.videoDelete = ids => {
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
exports.addCoupons = params => {
  return $form.post('coupons', params)
}
// 营销管理 渠道管理列表
exports.getChannel = params => {
  return $form.get('channels', { params })
}
// 新增 渠道管理
exports.addChannel = params => {
  return $form.post('channels', params)
}
// 获取 单条渠道管理数据
exports.getAloneChannel = id => {
  return $form.get(`channels/${id}`)
}
// 更新 单条渠道管理
exports.updateChannel = (id, params) => {
  return $form.put(`channels/${id}`, params)
}
// 删除 单条渠道
exports.deleteChannel = id => {
  return $form.delete(`channels/${id}`)
}
// 渠道管理 获取引流列表数据
exports.getChannelsData = (id, params) => {
  return $form.get(`channels/${id}/data`, { params })
}
// 营销管理  渠道管理 引流列表 下载二维码
exports.getCodeImg = (id, config) => {
  return $form.get(`channels/${id}/hd-wxa-code`, config)
}

// 获取结算方式
exports.getSettlement = () => {
  return $form.get('channels/settlement-methods')
}
// 营销管理 统计报表 邀请排行榜
exports.getStatistics = params => {
  return $form.get('statistics/user-invite-data', { params })
}
// 营销管理 统计报表 注册统计
exports.getUserRegister = params => {
  return $form.get('statistics/user-register-data', { params })
}
// 营销管理 统计报表 订单统计
exports.getOrderData = params => {
  return $form.get('statistics/order-data', { params })
}
// 营销管理 统计报表 财务统计
exports.getTransactionData = params => {
  return $form.get('statistics/transaction-data', { params })
}
// 流水记录 导出excel
exports.transactionExcel = params => {
  return $form.get('transaction-records/export', { params })
}
// 营销管理 统计报表 下单排行榜
exports.getUserOrder = params => {
  return $form.get('statistics/user-order-data', { params })
}
// 营销管理 统计报表 导出清单
exports.uploadStatistics = params => {
  return $form.get('statistics/export', { params })
}
// 营销管理 广告图管理 列表
exports.getBanner = params => {
  return $form.get('ads-picture', { params })
}
// 添加广告图 获取全部下拉框数据
exports.getLeftData = () => {
  return $form.get('ads-picture/selects')
}
// 广告图 新增
exports.addBanner = params => {
  return $form.post('ads-picture', params)
}
// 广告图 获取单条详情
exports.aloneBanner = id => {
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
exports.deleteBanner = id => {
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
exports.disableCoupons = id => {
  return $form.patch(`coupons/${id}/disable`)
}

/**
 * 上传图片
 * @param {Array} images 图片对象数组
 *  iamges[*].file 文件
 */
// 上传图片
exports.uploadImg = images => $file.post('upload/images', images)
// 上传文件
exports.uploadFiles = files => $file.post('upload/files', files)
// 上传证书
exports.uploadCerts = files => $file.post('upload/certs', files)

exports.forbidLogin = ids => $json.put('users/forbid-login', { forbid_id: ids })

// 获取首页统计数据
exports.getIndexNumber = () => $form.get('statistics/index-data')
// 获取首页图表数据
exports.getIndexData = params => $form.get('statistics/index-log', { params })

// 首页 控制面板 弹窗数据
exports.getGuides = () => {
  return $form.get('user-guides')
}
// 首页 控制面板 获取操作手册数据
exports.optionsManual = () => {
  return $form.get('app/documents')
}
// 查询物流弹窗
exports.goTracking = params => {
  return $form.get('tracking', { params })
}
// 控制面板 弹窗 设置成完成状态
exports.updateGuides = id => {
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
exports.getSystemNotice = id => {
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
// 订单列表 获取团购数据
exports.orderSecond = id => {
  return $form.get(`orders/${id}/sub-orders`)
}
// 订单列表 获取日志
exports.getInvalid = id => {
  return $form.get(`orders/${id}/invalid-log`)
}
// 订单列表 详情 获取可更改的地址信息
exports.detailsAddress = params => {
  return $form.get(`orders/user-address`, { params })
}
// 订单列表 详情 修改收货人信息
exports.modifyReceive = (id, params) => {
  return $form.put(`orders/${id}/address`, params)
}
// 详情 更换收货地址
exports.confirmChange = (id, addId) => {
  return $form.put(`orders/${id}/address/${addId}`)
}
// 订单列表 详情 添加包裹 获取可添加的包裹
exports.getAddable = (id, params) => {
  return $form.get(`orders/${id}/addable-packages`, { params })
}
// 订单列表 详情 添加包裹 确认添加
exports.updateAddable = (id, params) => {
  return $form.put(`orders/${id}/add-packages`, params)
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
exports.getCounts = params => {
  return $form.get('orders/order-counts', { params })
}
// 订单列表 打包处理 订单价格计算
exports.calOrderPrice = (id, params) => {
  return $form.post(`orders/${id}/price-counter`, params)
}
// 订单列表 打包处理 订单数据保存
exports.saveOrderData = (id, params) => {
  return $form.put(`orders/${id}/save`, params)
}
//订单列表 待支付 改为已付款
exports.paid = (id, params) => {
  return $form.put(`orders/${id}/paid`, params)
}
//订单列表 待支付 获取支付方式
exports.payMethod = () => {
  return $form.get('orders/pay-method')
}
// 订单列表 将异常订单恢复
exports.restoreOrder = params => {
  return $form.put('orders/exceptional/restore', params)
}
// 订单列表 订单设置成异常件
exports.AbnormalPiece = params => {
  return $form.put('orders/exceptional', params)
}
// 发货单 获取弹窗里可使用的物流状态
exports.getOrderStatus = () => {
  return $form.get('orders/logistics-types')
}
// 发货单 更改当前物流状态
exports.changeOrderStatus = params => {
  return $form.put(`orders/logistics`, params)
}
// 发货单 删除轨迹
exports.deleteOrderTable = (shipId, id) => {
  return $form.delete(`orders/${shipId}/logistics/${id}`)
}
// 发货单 获取单条轨迹
exports.getAloneOrder = id => {
  return $form.get(`orders/${id}/logistics`)
}
// 订单 打包 获取线路详情
exports.getUsable = (id, params) => {
  return $form.get(`orders/${id}/usable-express-lines`, { params })
}
// 订单 打包 获取仓库详情
exports.getUsableWarehouse = () => {
  return $form.get(`orders/warehouse-simple-list`)
}
// 订单 更新多箱物流
exports.updateMultiLogistics = params => {
  return $form.put(`orders/update-box-logistics`, params)
}
// 订单列表 获取一键打包数据
exports.getOrderBatch = params => {
  return $form.get(`orders`, { params })
}
//订单 订单列表 货量统计
exports.volumeStatistics = params => {
  return $form.get(`orders/statistics`, { params })
}
// 订单 订单列表 导出清单 列表查询
exports.listQuery = params => {
  return $form.get(`export-templates`, { params })
}
// 订单 订单列表 导出清单 获取详情
exports.listDetail = id => {
  return $form.get(`export-templates/${id}`)
}
// 订单 订单列表 导出清单 获取编码列表
exports.getCodeList = () => {
  return $form.get('export-templates/codes')
}
// 订单 订单列表 导出清单 获取模板
exports.getListTemplate = code => {
  return $form.get(`export-templates/template/${code}`)
}
// 订单 订单列表 导出清单 新增
exports.addTemplate = params => {
  return $form.post('export-templates', params)
}
// 订单 订单列表 导出清单 删除
exports.deleteTemplate = id => {
  return $form.delete(`export-templates/${id}`)
}
// 订单 订单列表 导出清单 修改
exports.editTemplate = (id, params) => {
  return $form.put(`export-templates/${id}`, params)
}
// 一键更改支付方式
exports.changePayMode = params => {
  return $form.put('orders/payment-mode', params)
}
// 确定一键打包
exports.confirmBatch = params => {
  return $form.put('orders/batch-pack', params)
}
// 订单 打包 获取线路详情
exports.getExpressLines = id => {
  return $form.get(`packages/${id}/express-lines`)
}
// 订单 设置改价金额
exports.changeOrderPrice = (id, params) => {
  return $form.put(`orders/${id}/payment-fee`, params)
}
// 订单 修改为已付款
exports.payedOrders = params => {
  return $form.put(`orders/on-delivery-paid`, params)
}
// 订单 修改为已签收
exports.signedOrders = params => {
  return $form.put(`orders/signed`, params)
}
// 订单 打印标签 查看
exports.checkOrderLabel = id => {
  return $form.get(`orders/${id}/label/html`)
}
// 订单 打印标签 确认下载
exports.updateOrderPdf = id => {
  return $form.get(`orders/${id}/label/pdf`)
}
// 订单 修改物流信息 获取转运快递公司
exports.getCompanies = () => {
  return $form.get(`orders/company-expresses`)
}
// 订单 编辑物流信息 获取单条信息
exports.getInfo = id => {
  return $form.get(`orders/${id}/logistics-info`)
}
// 订单 获取单条拣货日志
exports.getOperate = id => {
  return $form.get(`orders/${id}/operate-logs`)
}
// 订单 作废 获取作废列表数据
exports.getVoidList = id => {
  return $form.get(`orders/${id}/packages`)
}
// 订单 作废
exports.ordersInvalid = (id, params) => {
  return $form.put(`orders/${id}/invalid`, params)
}
// 移除发货单
exports.removeOrders = id => {
  return $form.put('orders/remove-from-shipment', id)
}
// 删除发货单
exports.deleteShip = id => {
  return $form.delete(`shipments/${id}`)
}
// 取消发货
exports.cancelShip = id => {
  return $form.put(`shipments/${id}/un-ship`)
}
// 货站 自定义物流
exports.getCustomLogistics = params => {
  return $form.get('custom-logistics', { params })
}
// 货站 上传数据
exports.getCustomerData = name => {
  return $form.post('custom-logistics/import', name)
}
// 货站 导入数据 更新
exports.saveLgExcel = params => {
  return $json.post('custom-logistics/import-insert', params)
}
// 货站 导入数据 下载excel模版
exports.uploadLgExcel = type => {
  return $form.get('custom-logistics/template', { type })
}
// 货站 获取轨迹
exports.getTracking = id => {
  return $form.get(`custom-logistics/${id}/details`)
}
// 货站 更新轨迹
exports.updateTracking = (id, params) => {
  return $form.put(`custom-logistics/${id}`, params)
}
// 货站 删除
exports.deleteCustomLogistics = id => {
  return $form.delete(`custom-logistics/${id}`)
}
// 货站 仓库自提数据
exports.getWarehouseSelf = params => {
  return $form.get('self-pickup-orders', { params })
}
// 仓库自提 设为自提
exports.setSelf = (id, params) => {
  return $form.put(`self-pickup-orders/${id}`, params)
}
// 仓库自提 获取单条数据
exports.getAloneSelf = id => {
  return $form.get(`self-pickup-orders/${id}`)
}
// 货站 申请集包
exports.packs = params => {
  return $form.get('package-packs/packages', { params })
}
// 货站 发货单 发货单详情
exports.dispatchList = (id, params) => {
  return $form.get(`shipments/${id}/order-export`, { params })
}
// 集包 新增收货地址
exports.addAddress = params => {
  return $form.post(`package-packs/user-address`, params)
}
// 申请集包 发起集包
exports.preview = params => {
  return $form.post('package-packs/preview', params)
}
// 申请集包 发起 批量集包
exports.batchPreview = params => {
  return $form.post('package-packs/batch-preview', params)
}
// 发起集包 获取地址数据
exports.previewAddress = params => {
  return $form.get('package-packs/user-address', { params })
}
// 发起集包 获取快递数据
exports.usableLines = params => {
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
// 发起集包 保存 按客户ID集包
exports.savePacksUser = params => {
  return $form.post('package-packs/packing', params)
}
// 发起集包 保存 按包裹单独集包
exports.savePacksAlone = params => {
  return $form.post('package-packs/single-package-order', params)
}
// 获取自提点地址
exports.lineStations = id => {
  return $form.get(`package-packs/express-line/${id}/stations`)
}
// 获取支持的id跟清关编码
exports.idCards = id => {
  return $form.get(`package-packs/express-line/${id}`)
}
// 发货单 获取物流信息模版
exports.uploadBatch = params => {
  return $form.post('shipments/logistics-export', params)
}
// 发货单 修改物流信息 获取转运快递公司
exports.shipmentCompanies = () => {
  return $form.get(`shipments/company-expresses`)
}
// 发货单 导出清单
exports.uploadExcel = (ids, params) => {
  return $form.post(`shipments/order-export-batch`, ids, params)
}
// 订单列表 导出发票
exports.uploadOrder = ids => {
  return $form.post('orders/invoices', ids)
}
// 订单列表 导出清单
exports.orderExport = params => {
  return $form.get('orders/export', { params })
}
// 订单列表 导出清单
exports.ordersExport = params => {
  return $form.get(`orders/export`, { params })
}
// 订单列表 详情 移除包裹清单
exports.removePackage = (orderId, packageId) => {
  return $form.put(`orders/${orderId}/packages/${packageId}/remove`)
}
//预报包裹列表 批量上架 获取包裹货位导入模板
exports.getPackageTemplate = () => {
  return $form.get('packages/location-template')
}
//预报包裹列表 批量上架 上传模板获取解析后的数据
exports.importPackageData = file => {
  return $file.post('packages/location-import-data', file)
}
//预报包裹列表 批量上架 导入包裹货位数据
exports.savePackageData = params => {
  return $form.post('packages/location-import', params)
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
exports.changeShipStatus = params => {
  return $form.put(`shipments/logistics`, params)
}
// 发货单 删除轨迹
exports.deleteShipTable = (shipId, id) => {
  return $form.delete(`shipments/${shipId}/logistics/${id}`)
}
// 发货单 获取单条轨迹
exports.getAloneShip = id => {
  return $form.get(`shipments/${id}/logistics`)
}
// 详情里的导出
exports.uploadAloneExcel = id => {
  return $form.get(`shipments/${id}/order-export`)
}
// 发货单 发货单详情 导出清单
exports.uploadShipExcel = (id, params) => {
  return $form.get(`shipments/${id}/order-export`, { params })
}
// 运单 获取审核
exports.getTransfer = id => {
  return $form.get(`orders/${id}/transfer-pay-info`)
}
// 运单 从流水记录跳转过来
exports.getReview = id => {
  return $form.get(`transaction-records/order/${id}/transfer-pay-info`)
}
// 当支付方式为微信的时候，跳至财务流水详情
exports.getRecords = id => {
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
exports.finishOrder = id => {
  return $form.put(`orders/${id}/paid`)
}
// 官网管理 栏目管理 列表
exports.getWebsites = params => {
  return $form.get('website-sections', { params })
}
// 栏目管理 开启或关闭
exports.changeWebsites = (id, status) => {
  return $form.put(`website-sections/${id}/status/${status}`)
}
// 官网管理 栏目管理 获取单条详情
exports.getAloneWebsites = id => {
  return $form.get(`website-sections/${id}`)
}
// 栏目管理 语言详情
exports.websiteLang = (id, params) => {
  return $form.get(`website-sections/${id}`, { params })
}
// 栏目管理 添加或修改语言
exports.updateWebsiteLang = (id, params) => {
  return $form.put(`website-sections/${id}/translate-data`, params)
}
// 官网管理 栏目管理 删除
exports.deleteWebsites = ids => {
  return $form.put('website-sections/batch-delete', ids)
}
// 官网管理 栏目管理 获取栏目分类管理二级菜单
exports.getSecondWebsites = id => {
  return $form.get(`website-sections/${id}/children`)
}
// 官网管理 栏目管理 获取文章类型
exports.articleData = () => {
  return $form.get('website-sections/article-types')
}
// 管理管理 栏目管理 获取上级栏目数据
exports.parentData = () => {
  return $form.get('website-sections/parent-list')
}
// 官网管理 栏目管理 文章 获取标题数据
exports.titleData = (id, params) => {
  return $form.get(`website-sections/articles/type/${id}`, { params })
}
// 官网管理 栏目管理 单页 获取标题数据
exports.titlePageData = params => {
  return $form.get('website-sections/pages', { params })
}
// 新增 栏目
exports.addArticle = params => {
  return $form.post('website-sections', params)
}
// 栏目 当存在子栏目时
exports.editArticle = (id, params) => {
  return $form.put(`website-sections/${id}`, params)
}
// 单页管理 列表
exports.singlePage = params => {
  return $form.get('website-pages', { params })
}
// 单页管理 删除
exports.deletePage = ids => {
  return $form.put('website-pages/batch-delete', ids)
}
// 单页管理 新增
exports.singlePageAdd = params => {
  return $form.post('website-pages', params)
}
// 单页管理 编辑
exports.singlePageEdit = (id, params) => {
  return $form.put(`website-pages/${id}`, params)
}
// 单页管理 获取单条详情
exports.singlePageData = id => {
  return $form.get(`website-pages/${id}`)
}
// 单页管理 获取语言单条详细
exports.pageLang = (id, params) => {
  return $form.get(`website-pages/${id}`, { params })
}
// 单页管理 更新语言配置
exports.updatePageLang = (id, params) => {
  return $form.put(`website-pages/${id}/translate-data`, params)
}
// 官网管理 区块管理 列表
exports.getBlocks = params => {
  return $form.get('website-blocks', { params })
}
// 官网管理 区块管理 获取详细
exports.getBlocksDetails = id => {
  return $form.get(`website-blocks/${id}`)
}
// 官网管理 区块管理 更新
exports.updateBlocksDetails = (id, params) => {
  return $json.put(`website-blocks/${id}`, params)
}
// 官网管理 区块管理 更新编辑
exports.updateBlocks = (id, params) => {
  return $form.put(`website-blocks/${id}`, params)
}
// 区块管理 更新语言配置
exports.updateBlockLang = (id, params) => {
  return $form.put(`website-blocks/${id}/translate-data`, params)
}
// 区块管理 获取 编辑链接数据
exports.websiteLink = id => {
  return $form.get(`website-blocks/${id}/links`)
}
// 区块管理 获取 编辑链接详细
exports.linkDetails = id => {
  return $form.get(`website-blocks/links/${id}`)
}
// 区块管理 获取 更新 链接详细
exports.updateLinkDetails = (id, params) => {
  return $form.put(`website-blocks/links/${id}`, params)
}
// 区块管理 链接 删除
exports.deleteLink = id => {
  return $form.delete(`website-blocks/links/${id}`)
}
// 区块管理 获取 新建 链接
exports.newLinkDetails = (id, params) => {
  return $form.post(`website-blocks/${id}/links`, params)
}
// 区块管理 获取语言单条详细
exports.blockLang = (id, params) => {
  return $form.get(`website-blocks/${id}`, { params })
}

// 注册验证码
exports.getRegisterCode = phone => $form.post('register/apply', { phone })

// 注册
exports.register = params => $json.post('register', params)

// 获取图片验证码
exports.getCaptcha = () => $form.get('captcha')

// 重置密码验证码
exports.getResetCode = phone => $form.post('reset-password/apply', { phone })

// 重置密码
exports.resetPassword = params => $json.put('reset-password', params)

// 获取权限
exports.getCurrentUserPermissions = () => $form.get('menu-tree')

// 获取是否显示拼团配置
exports.getMe = () => $form.get('me')
// 获取视频上传临时 token
exports.getVideoUploadToken = () => $form.get('videos/upload-token')

// 获取获取临时密钥
exports.getTempKeys = () => $form.get('upload/temp-keys')

// 新建视频
exports.addVideo = params => $json.post('videos', params)
// 修改视频
exports.editVideo = (id, params) => $json.put(`videos/${id}`, params)

// 获取线路筛选条件某一列列表
exports.getLineColumnList = column => $form.get(`express-lines/column/${column}/data`)
export default exports

// 自提点 转运包裹管理 获取自提点信息筛选
exports.packagePick = () => {
  return $form.get('stations')
}
// 自提点 转运包裹管理 获取自提点信息筛选
exports.getPackagePick = params => {
  return $form.get('stations', { params })
}
// 自提点 转运订单
exports.transformOrder = params => {
  return $form.put('stations/transport', params)
}
// 自提点 自提点概览 获取佣金报表
exports.commissionRecords = params => {
  return $form.get('station-statistics/commission-records', { params })
}
// 自提点 自提点概览 佣金报表 导出
exports.uploadCommission = (id, params) => {
  return $form.get(`station-statistics/commission-records/${id}/export`, { params })
}
// 自提点 自提点概览 佣金报表 确认提交
exports.updateSettlement = (id, params) => {
  return $form.put(`station-statistics/commission-records/${id}/confirm`, params)
}
// 自提点 自提点概览 佣金报表 查看明细
exports.recordDetails = (id, params) => {
  return $form.get(`station-statistics/commission-records/${id}/commissions`, { params })
}
// 自提点 自提点概览 支付详情
exports.pickRecordDetails = (id, params) => {
  return $form.get(`station-statistics/commission-records/${id}`, { params })
}
// 转运包裹管理 获取tab数量
exports.stationsCounts = params => {
  return $form.get('stations/orders/count', { params })
}
// 转运包裹管理 获取列表数据
exports.stationsData = params => {
  return $form.get('stations/orders', { params })
}
// 转运包裹管理 获取自提点信息
exports.pickData = id => {
  return $form.get(`stations/${id}`)
}
// 转运包裹管理 更新 公告设置
exports.updatePickData = (id, params) => {
  return $form.put(`stations/${id}`, params)
}
// 转运包裹管理 获取 快速收货
exports.getReceive = params => {
  return $json.get(`stations/receive/search`, { params })
}
// 转运包裹管理 快速收货
exports.updateReceive = params => {
  return $form.put(`stations/receive`, params)
}
// 转运包裹管理 出库
exports.updateShip = params => {
  return $form.put(`stations/ship`, params)
}
// 转运包裹管理 导出
exports.stationsUpload = params => {
  return $form.get(`stations/export`, { params })
}
// 快速签收 获取查询数据
exports.signData = params => {
  return $form.get('stations/sign/search', { params })
}
// 快速签收 获取单条签收照片数据
exports.photosData = (id, params) => {
  return $form.get(`stations/sign/${id}`, { params })
}
// 快速签收 更新 单条签收照片数据
exports.updatePhotosData = (id, params) => {
  return $form.put(`stations/sign/${id}`, params)
}
// 快速签收 确定签收
exports.batchSign = params => {
  return $form.put(`stations/sign/batch`, params)
}
// 快速出库 获取查询数据
exports.shipData = params => {
  return $form.get('stations/ship/search', { params })
}
// 快速出库 确定出库
exports.shipBatch = params => {
  return $form.put('stations/ship', params)
}
// 自提点 仓位管理列表
exports.locationData = params => {
  return $form.get('stations/locations/areas', { params })
}
// 自提点 仓位管理列表 添加
exports.locationAdd = params => {
  return $form.post('stations/locations/areas', params)
}
// 自提点 仓位管理列表 编辑
exports.locationEdit = (id, params) => {
  return $form.put(`stations/locations/areas/${id}`, params)
}
// 自提点 仓位管理列表 编辑
exports.getAlongLocation = (id, params) => {
  return $form.get(`stations/locations/areas/${id}`, { params })
}
// 自提点 仓位管理列表 货位列表
exports.locationList = (id, params) => {
  return $form.get(`stations/locations/${id}`, { params })
}
// 自提点 仓位管理列表 货位列表 解锁 或锁定
exports.locationLocked = (id, status, params) => {
  return $form.put(`stations/locations/location/${id}/status/${status}`, { params })
}
// 自提点 仓位管理列表 货位列表
exports.locationDelete = (id, params) => {
  return $form.delete(`stations/locations/areas/${id}`, { params })
}
// 自提点 自提点概览
exports.getPickEcharts = params => {
  return $form.get('station-statistics', { params })
}
// 订单列表 获取国家地区（一级）
exports.getCountriesList = () => {
  return $form.get('countries/list')
}
// 订单列表 获取国家地区（剩余级）
exports.getCountriesSecondList = params => {
  return $form.get('countries/list', { params })
}
// 订单列表 获取表格字段
exports.getOrderFieldList = () => {
  return $form.get('/custom-columns')
}

// 地址解析
exports.onGeocoder = params => {
  return $form.get('ws/geocoder/v1', {
    params,
    baseURL: 'https://apis.map.qq.com'
  })
}
// 自定义显示列 获取模板code
exports.getTemplateCode = () => {
  return $form.get('list-templates/codes')
}
// 自定义显示列字段
exports.getTemplateColumn = code => {
  return $form.get(`list-templates/template/${code}`)
}
// 修改自定义显示列字段模板
exports.updateTemplate = (code, params) => {
  return $form.put(`list-templates/template/${code}`, params)
}

// 弹窗广告图管理 列表
exports.advertiseList = params => {
  return $form.get('ads-picture/alert-ads', { params })
}

// 弹窗广告图管理 选择数据
exports.getDropData = () => {
  return $form.get('ads-picture/alert-ads/selects')
}

// 弹窗广告图管理 新增
exports.newAdvertise = params => {
  return $form.post('ads-picture/alert-ads', params)
}

// 弹窗广告图管理 更新
exports.updateAdvertise = (id, params) => {
  return $form.put(`ads-picture/alert-ads/${id}`, params)
}

// 弹窗广告图管理 删除
exports.deleteAdvertise = id => {
  return $form.delete(`ads-picture/alert-ads/${id}`)
}

// 弹窗广告图管理 更新翻译数据
exports.updateTranslateData = (id, params) => {
  return $form.put(`ads-picture/alert-ads/${id}/translate-data`, params)
}

// 弹窗广告图管理 详情
exports.advertiseDetail = id => {
  return $form.get(`ads-picture/alert-ads/${id}`)
}

// 员工 导出员工数据
exports.exportEmployData = params => {
  return $form.post(`admins/work-count-export`, params)
}

// 客户  修改密码
exports.editCustomPwd = (id, params) => {
  return $form.put(`users/${id}/password`, params)
}

// 下载发货单模板
exports.downLoadInvoiceTmp = () => {
  return $form.get('shipments/import/template')
}

// 批量加入发货单
exports.importInvoiceTmp = params => {
  return $file.post('shipments/import', params)
}

// 货位参数配置
exports.allocationConfig = (id, params) => {
  return $form.put(`warehouse-address/${id}/goods-allocation-areas/config`, params)
}

// 预报包裹 批量预报 获取模板
exports.getForecastTemplate = () => {
  return $form.get('packages/forecast-template')
}

// 预报包裹 批量预报 解析数据
exports.parseData = params => {
  return $file.post('packages/forecast-parse', params)
}

// 预报包裹 批量预报
exports.importForecast = params => {
  return $json.post('packages/forecast-import', params)
}

// 导出产能
exports.exportOrderData = params => {
  return $form.post(`orders/work-count-export`, params)
}

// 获取
exports.getCountryDetail = id => {
  return $form.get(`countries/${id}`)
}

// 更新
exports.updateCountryLang = (id, params) => {
  return $form.put(`countries/${id}/translation`, params)
}

// 客服中心 问答管理 列表
exports.qaList = params => {
  return $form.get('qa', { params })
}

// 客服中心 问答管理 删除问题
exports.deleteQuestion = id => {
  return $form.delete(`qa/${id}`)
}

// 客服中心 问答管理 删除回答
exports.deleteAnswer = id => {
  return $form.delete(`qa/answers/${id}`)
}

// 客服中心 问答管理 设置推荐
exports.setFeatured = (id, status) => {
  return $form.put(`qa/${id}/featured/${status}`)
}

// 更新渠道规则备注
exports.updateRuleRemark = (id, params) => {
  return $form.put(`express-lines/${id}/rule-remark`, params)
}

// 获取渠道规则备注
exports.getRuleRemark = id => {
  return $form.get(`express-lines/${id}/rule-remark`)
}

// 财务 订单补款 列表
exports.replenishmentList = params => {
  return $form.get('order-additional-fees', { params })
}

// 财务 订单补款 获取支付类型
exports.paymentData = () => {
  return $form.get('order-additional-fees/payment-types')
}

// 财务 订单补款 创建
exports.createReplenish = params => {
  return $form.post('order-additional-fees', params)
}

// 财务 订单补款 详情
exports.getReplenishDeatil = id => {
  return $form.get(`order-additional-fees/${id}`)
}

// 财务 订单补款 更新
exports.updateReplenish = (id, params) => {
  return $form.put(`order-additional-fees/${id}`, params)
}

// 财务 订单补款 更新支付类型
exports.updatePaymentType = ids => {
  return $form.put('order-additional-fees/payment-types', ids)
}

// 财务 订单补款  审核通过
exports.orderApproved = (id, params) => {
  return $form.put(`order-additional-fees/${id}/accepted`, params)
}

// 财务 订单补款 审核拒绝
exports.orderRefused = (id, params) => {
  return $form.put(`order-additional-fees/${id}/refused`, params)
}

// 财务 订单补款 详情
exports.replenishDetail = id => {
  return $form.get(`order-additional-fees/${id}`)
}

// 财务 订单补款 作废
exports.invalidOrder = id => {
  return $form.put(`order-additional-fees/${id}/invalid`)
}

// 申报信息 获取自定义数据
exports.customData = id => {
  return $form.get(`declare/${id}/custom-configs`)
}

// 申报信息 更新自定义数据
exports.updateCustomData = (id, params) => {
  return $form.put(`declare/${id}/custom-configs`, params)
}

// 申报信息 更新自定义选择数据
exports.updateSelectData = id => {
  return $form.get(`declare/${id}/custom-configs/data`)
}

// 统计 订单补款
exports.getReplenishCount = () => {
  return $form.get(`order-additional-fees/counts`)
}

// 问答管理 回复
exports.answerInfo = (id, params) => {
  return $form.post(`qa/${id}/answers`, params)
}

// 问答积累积分 详情
exports.getqaDetail = () => {
  return $form.get('in-out-rule/point-qa-config/show')
}

// 问答积累积分 获取初始化信息
exports.qaInitConfig = () => {
  return $form.get('in-out-rule/point-qa-config/init')
}

// 问答积累积分 更新
exports.updateQa = params => {
  return $form.post('in-out-rule/point-qa-config', params)
}

// 问答积累积分 获取详情
exports.getQaCumulativeDetail = id => {
  return $form.get(`in-out-rule/point-qa/${id}`)
}

// 问答积累积分 新增
exports.addQa = params => {
  return $form.post('in-out-rule/point-qa', params)
}

// 问答积累积分 删除
exports.deleteQa = id => {
  return $form.delete(`in-out-rule/point-qa/${id}`)
}

// 问答积累积分 列表查询
exports.QaListSearch = params => {
  return $form.get('in-out-rule/point-qa', { params })
}

// 问答积累积分 修改
exports.editQa = (id, params) => {
  return $form.put(`in-out-rule/point-qa/${id}`, params)
}

// 采购 采购列表
exports.purchaseList = params => {
  return $form.get('purchase-orders', { params })
}

// 采购 获取详情
exports.purchaseDetail = id => {
  return $form.get(`purchase-orders/${id}`)
}

// 采购 新增
exports.addPurchase = params => {
  return $form.post('purchase-orders', params)
}

// 采购 修改
exports.editPurchase = (id, params) => {
  return $form.put(`purchase-orders/${id}`, params)
}

// 采购 更新商品列表
exports.updateGoodsList = (id, params) => {
  return $form.put(`purchase-orders/${id}/update-goods`, params)
}

// 采购 提交采购单
exports.submitPurchase = id => {
  return $form.put(`purchase-orders/${id}/approved`)
}

// 采购 发货
exports.deliverGoods = (id, params) => {
  return $form.put(`purchase-orders/${id}/delivery`, params)
}
// 采购 发货
exports.addGoods = (id, params) => {
  return $form.post(`purchase-orders/${id}/delivery`, params)
}
// 采购 删除
exports.deletPurchase = id => {
  return $form.delete(`purchase-orders/${id}`)
}

// 采购 作废
exports.invalidPurchase = id => {
  return $form.put(`purchase-orders/${id}/quit`)
}

// 采购 分货
exports.dividePurchase = (id, params) => {
  return $form.put(`purchase-orders/${id}/divide`, params)
}

// 采购 导出清单
exports.exportPurchase = ids => {
  return $form.post(`purchase-orders/export`, ids)
}

// 采购 统计
exports.purchaseCount = params => {
  return $form.get('purchase-orders/status-counts', { params })
}

// 采购 获取地址
exports.getAddress = params => {
  return $form.post('package-packs/user-first-address-by-id', params)
}

// 渠道优化 获取授权详情
exports.authDetail = id => {
  return $form.get(`express-lines/${id}/show-auth`)
}

// 用户授权
exports.userAuth = (id, params) => {
  return $form.put(`express-lines/${id}/update-auth`, params)
}

// 同行货授权
exports.sameTradeAuth = (id, stgAuth) => {
  return $form.put(`user-groups/${id}/set-stg-auth/${stgAuth}`)
}

// 批量认领
exports.batchClaim = params => {
  return $form.put(`packages/no-owner/owner`, params)
}

// 批量导入地址 下载模板
exports.downloadAddressTmp = () => {
  return $form.get('user-addresses/template')
}

// 上传模板
exports.uploadAddressTmp = file => {
  return $file.post('user-addresses/parse', file)
}

// 批量导入
exports.batchImportAddress = params => {
  return $json.post('user-addresses/import', params)
}

// 新增收货地址
exports.addReceiveAddress = params => {
  return $form.post('user-addresses', params)
}

// 订单财务审核 统计
exports.financeCount = () => {
  return $form.get('order-finances/counts')
}

// 批量更新自定义数据
exports.batchUpdateCustom = params => {
  return $form.put('declare/custom-configs', params)
}
