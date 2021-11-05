import store from '@/store'
import { ftPYStr, charPYStr, qqPYStr } from './languageCode'

// 默认是简体
export default function convert(str = '') {
  if (store.state.languageCode === 'simple') return str
  return traditionalized(str)
}

// 简转繁
export function traditionalized(cc = '') {
  let str = ''
  for (let i = 0; i < cc.length; i++) {
    // console.log(cc.charAt(i), charPYStr.indexOf(cc.charAt(i)))
    if (charPYStr.indexOf(cc.charAt(i)) !== -1) {
      str += ftPYStr.charAt(charPYStr.indexOf(cc.charAt(i)))
    } else if (qqPYStr.indexOf(cc.charAt(i)) !== -1) {
      str += ftPYStr.charAt(qqPYStr.indexOf(cc.charAt(i)) !== -1)
    } else {
      str += cc.charAt(i)
    }
  }
  return str
}
