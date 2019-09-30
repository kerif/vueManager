import $form from 'axios'
import qs from 'qs'
import { router } from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import nprogress from 'nprogress'
import baseApi from './baseApi'
// 表单格式提交
$form.defaults.timeout = 900000 // 响应时间
$form.defaults.responseType = 'json'
$form.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' // 配置请求头
$form.defaults.baseURL = baseApi.BASE_API_URL // 配置接口地址
$form.defaults.transformRequest = [function (params) {
  return qs.stringify(params)
}]

function interceptorsRequestSuccess (config) {
  nprogress.start()
  store.commit('switchBtnLoading', { status: true })
  store.state.token && (config.headers.Authorization = store.state.token)
  return config
}

function interceptorsRequestError (error) {
  return Promise.reject(error)
}

function interceptorsResponseSuccess (response) {
  nprogress.done()
  store.commit('switchBtnLoading', { status: false })
  return Promise.resolve(response.data)
}

function interceptorsResponseError (error) {
  let msg
  nprogress.done()
  store.commit('switchBtnLoading', { status: false })
  if (error.response && error.response.status === 401) {
    store.commit('removeToken')
    if (error.reponse && error.response.config.url.indexOf('/login') === -1) {
      router.push('/login')
    }
  } else {
    if (error.response && error.response.data && error.response.data.msg) {
      msg = error.response.data.msg
    } else {
      msg = '请求失败'
    }
    Message({
      message: msg,
      type: 'error'
    })
  }
  return Promise.reject((error.response && error.response.data) || msg)
}

$form.interceptors.request.use(interceptorsRequestSuccess, interceptorsRequestError)
$form.interceptors.response.use(interceptorsResponseSuccess, interceptorsResponseError)

// json格式提交
let $json = $form.create({
  baseURL: baseApi.BASE_API_URL, // 配置接口地址
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  transformRequest: [function (params) {
    return JSON.stringify(params)
  }]
})

let $file = $form.create({
  baseURL: baseApi.BASE_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data;'
  },
  transformRequest: [function (params) {
    return params
  }]
})

$file.interceptors.request.use(interceptorsRequestSuccess, interceptorsRequestError)
$file.interceptors.response.use(interceptorsResponseSuccess, interceptorsResponseError)

$json.interceptors.request.use(interceptorsRequestSuccess, interceptorsRequestError)
$json.interceptors.response.use(interceptorsResponseSuccess, interceptorsResponseError)

const axios = {}
axios.install = function (Vue, options = {}) {
  Vue.prototype.$http = $form
  Vue.prototype.$json = $json
  Vue.prototype.$baseUrl = baseApi
}

export default axios
export { $form, $json, $file }
