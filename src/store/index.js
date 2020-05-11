import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isPermissionFilter: false,
    fileterAfterRouterMap: [],
    isPermissionFilterArr: [],
    token: '',
    userName: '', // 用户名
    btnLoading: false,
    isCollapse: false,
    languageCode: 'simple', // 默认简体中文
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
      state.fileterAfterRouterMap = data.fileterAfterRouterMap
      state.isPermissionFilterArr = data.isPermissionFilterArr
    },
    saveLanguageCode (state, data) {
      state.languageCode = data
      localStorage.setItem('language', data)
    },
    initLanguageCode (state) {
      state.languageCode = localStorage.getItem('language') || 'simple'
    }
  },
  actions: {

  }
})
