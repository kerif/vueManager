import Vue from 'vue'
import App from './App.vue'
import { router } from '@/router'
import store from '@/store'
import Element from 'element-ui'
import './styles/element-variable.scss'
import request from './lib/request'

Vue.use(Element)
Vue.config.productionTip = false
store.commit('initToken')

Vue.prototype.$request = request

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
