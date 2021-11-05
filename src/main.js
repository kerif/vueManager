import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import i18n from '@/utils/i18n'
import ElementLocale from 'element-ui/lib/locale'
import Element from 'element-ui'
import './styles/element-variable.scss'
import request from './lib/request'
import baseUrl from './lib/axios/baseApi'
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
Vue.prototype.$request = request
Vue.prototype.$baseUrl = baseUrl

ElementLocale.i18n((key, value) => i18n.t(key, value))
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
