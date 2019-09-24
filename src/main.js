import Vue from 'vue'
import App from './App.vue'
import { router } from '@/router'
import store from '@/store'
import Element from 'element-ui'
import './styles/element-variable.scss'
import request from './lib/request'
import baseUrl from './lib/axios/baseApi'

Vue.use(Element)
Vue.config.productionTip = false
store.commit('initToken')

Vue.prototype.$request = request
Vue.prototype.$baseUrl = baseUrl

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
