import { $form } from '@/lib/axios'
let exports = {}

exports.getLines = () => {
  return $form.get('express-lines')
}

export default exports
