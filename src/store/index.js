import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    btnLoading: false,
    isCollapse: false,
    pagePath: '' // 路径列表
  },
  mutations: {
    saveToken (state, data) {
      state.token = data
      localStorage.setItem('TOKEN', data)
    },
    initToken (state) {
      state.token = localStorage.getItem('TOKEN') || ''
    },
    removeToken (state) {
      state.token = ''
      localStorage.removeItem('TOKEN')
    },
    savePagePath (state, data) {
      state.pagePath = data
    },
    switchBtnLoading (state, data) {
      state.btnLoading = data.status
    },
    switchCollapse (state, isCollapse) {
      state.isCollapse = isCollapse
    }
  },
  actions: {

  }
})
