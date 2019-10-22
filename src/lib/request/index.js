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
  return $form.put(`admins/${id}`, params)
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
// 员工列表允许登录
exports.allowUser = (ids) => {
  return $form.put('admins/allow-login', ids)
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
export default exports
