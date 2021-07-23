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

Vue.use(VXETable)
Vue.use(Element)
Vue.config.productionTip = false
store.commit('initToken')
store.commit('initLanguageCode')

Vue.prototype.$request = request
Vue.prototype.$baseUrl = baseUrl
Vue.prototype.$t = convert

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
