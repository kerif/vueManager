import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import Element from 'element-ui'
import './styles/element-variable.scss'
import request from './lib/request'
import baseUrl from './lib/axios/baseApi'
import convert from './utils/language'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
// import { JSEncrypt } from 'jsencrypt'

Vue.use(VXETable)
Vue.use(Element)
Vue.config.productionTip = false
store.commit('initToken')
store.commit('initLanguageCode')
Element.Dialog.props.closeOnClickModal.default = false
// console.log = () => {}
Vue.prototype.$request = request
Vue.prototype.$baseUrl = baseUrl
Vue.prototype.$t = convert

// Vue.prototype.$encryptedData = function (data) {
//   let encrypt = new JSEncrypt()
//   encrypt.setPublicKey(`-----BEGIN PUBLIC KEY-----
//   MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwfxIAFQxipEEKJMc4RhD
//   LJQ7WxMGWLpinEEbJbMoXfSqlDjhxfVx5//itbwWmIKM1A8n0MTerudTvjdDmG9k
//   37+EDS/dcYmxZ7KCqEp4teBsRmg8v9EgnblgkEVpwTA7M5zgldMFJnearrBx2IwL
//   hWqK3IKADSiLcvrO25crz89bkPq2jgmi2QOsKEIATOErrkyFTxRVYqw8/UB0q5Za
//   /KWAE9xTgU7+oteoRnI7ZdXlJZ1ENyMPN+DAT4WZoR+nWmKCVPFNgwdN2b3D8Rum
//   6L1bQcOMbK2wS9Ooc1uu6+AfT8/HTODNmMnBf4/LBWpwjOLUhz1YLaeNnYqgpUzS
//   HwIDAQAB
//   -----END PUBLIC KEY-----`)
//   let result = encrypt.encrypt(password)
//   return result
// }
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
