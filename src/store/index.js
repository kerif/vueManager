import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isPermissionFilter: false,
    fileterAfterRouterMap: {},
    token: '',
    userName: '', // 用户名
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
      state.userName = localStorage.getItem('NAME') || ''
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
    },
    saveName (state, data) {
      state.userName = data
      localStorage.setItem('NAME', data)
    },
    savePermissionStatus (state, data) {
      state.isPermissionFilter = data
    },
    saveFileterAfterRouterMap (state, data) {
      state.fileterAfterRouterMap = data
    }
  },
  actions: {

  }
})
