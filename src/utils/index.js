import $t from './language'

export const formatWeek = (value) => {
  if (!value) return
  let date = new Date(value)
  let week = ''
  switch (date.getDay()) {
    case 0:
      week = '周日'
      break
    case 1:
      week = '周一'
      break
    case 2:
      week = '周二'
      break
    case 3:
      week = '周三'
      break
    case 4:
      week = '周四'
      break
    case 5:
      week = '周五'
      break
    case 6:
      week = '周六'
      break
  }
  value = value.split('-')
  return `${value[1]}-${value[2]}${week}`
}

export const formatMonth = (value) => {
  if (!value) return
  let month = value.split('-')[1]
  return `${month.replace(/^0/, '')}月`
}

export const getCheckedChild = (arr) => {
  let ret = []
  recArr(arr, ret)
  console.log('arr', ret)
  return ret
}

function recArr (arr, ret) {
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i]
    if (element.child) {
      recArr(element.child.map(item => ({ ...item, name: $t(item.name) })), ret)
    } else if (element.enabled) {
      ret.push(element.id)
    }
  }
}
