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

export default exports
