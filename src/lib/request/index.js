import { $form, $json } from '@/lib/axios'
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
exports.deleteVip = () => {
  return $form.put('admins/batch-delete')
}
exports.getVipGroup = (params) => {
  return $form.get('admin-groups', { params })
}
exports.addGroup = (params) => {
  return $json.post('admin-groups', params)
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
exports.getNotice = () => {
  return $form.get('order-notices')
}
exports.saveNotice = (params) => {
  return $form.post(`order-notices`, params)
}
exports.getSuggest = () => {
  return $form.get('suggestions')
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
exports.getWarehouseList = () => {
  return $form.get('packages/in-warehouse-info')
}
exports.getStorageList = () => {
  return $form.get('shipments/in-warehouse-info')
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
exports.editUserGroup = (id) => {
  return $form.put(`user-groups/${id}`)
}
// 修改客户组
exports.changeUserList = (id, groupId) => {
  return $form.put(`users/${id}/group/${groupId}`)
}

exports.forbidLogin = (ids) => $json.put('users/forbid-login', { forbid_id: ids })
export default exports
