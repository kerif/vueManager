import { $form } from '@/lib/axios'
let exports = {}

exports.getLines = () => {
  return $form.get('express-lines')
}
exports.getStaff = () => {
  return $form.get('admins')
}

export default exports
