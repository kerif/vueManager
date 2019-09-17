import Vue from 'vue'
import App from './App.vue'
import { router } from '@/router'
import store from '@/store'
import Element from 'element-ui'
import axios from './lib/axios'
import './styles/element-variable.scss'

Vue.use(axios)
Vue.use(Element)
Vue.config.productionTip = false
store.commit('initToken')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
