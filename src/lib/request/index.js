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

exports.getStaff = () => {
  return $form.get('admins')
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
exports.getVipGroup = () => {
  return $form.get('admin-groups')
}
exports.addGroup = (params) => {
  return $json.post('admin-groups', params)
}
exports.getVipMember = (id) => {
  return $form.get(`admin-groups/${id}/members`)
}
exports.getWarehouse = () => {
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
exports.getShip = () => {
  return $form.get('shipments')
}
exports.getCountry = () => {
  return $form.get('countries')
}
exports.getTransaction = () => {
  return $form.get('transaction-records')
}
exports.saveShip = (params) => {
  return $form.post(`shipments`, params)
}
exports.getShipments = (id) => {
  return $form.put(`shipments/${id}/ship`)
}
export default exports
