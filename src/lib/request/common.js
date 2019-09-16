import { $json } from '@/lib/axios'
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

export default exports
