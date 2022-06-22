import $t from './language'

export const formatWeek = value => {
  if (!value) return
  let date = new Date(value)
  let week = ''
  switch (date.getDay()) {
    case 0:
      week = $t('周日')
      break
    case 1:
      week = $t('周一')
      break
    case 2:
      week = $t('周二')
      break
    case 3:
      week = $t('周三')
      break
    case 4:
      week = $t('周四')
      break
    case 5:
      week = $t('周五')
      break
    case 6:
      week = $t('周六')
      break
  }
  value = value.split('-')
  return `${value[1]}-${value[2]}${week}`
}

export const formatMonth = value => {
  if (!value) return
  let month = value.split('-')[1]
  return `${month.replace(/^0/, '')}${$t('月')}`
}

export const getCheckedChild = arr => {
  let ret = []
  recArr(arr, ret)
  return ret
}

function recArr(arr, ret) {
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i]
    if (element.child) {
      recArr(
        element.child.map(item => ({ ...item, name: $t(item.name) })),
        ret
      )
    } else if (element.enabled) {
      ret.push(element.id)
    }
  }
}

export const countryCallback = list => {
  return list.map(item => ({
    id: item.id,
    name: item.name,
    children: item.areas.length ? countryCallback(item.areas) : [],
    leaf: item.areas.length ? '' : 'leaf'
  }))
}
export const downloadStreamFile = (data, name = 'file', type = 'xlsx') => {
  if (data && data.code && data.code === 5000) return
  let url = window.URL.createObjectURL(new Blob([data]))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', `${name}.${type}`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const getIds = (arr, result = [], newResult = []) => {
  for (let i = 0; i < arr.length; i++) {
    let ids = newResult.concat([arr[i].id])
    if (arr[i].areas && arr[i].areas.length > 0) {
      getIds(arr[i].areas, result, ids)
    } else {
      result.push(ids)
    }
  }
}

export const getId = (arr, result = []) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].areas && arr[i].areas.length > 0) {
      getId(arr[i].areas, result)
    }
  }
}

export const changeFavicon = link => {
  let $favicon = document.querySelector('link[rel="icon"]')
  if ($favicon !== null) {
    $favicon.href = link
  } else {
    $favicon = document.createElement('link')
    $favicon.rel = 'icon'
    $favicon.href = link
    document.head.appendChild($favicon)
  }
}
