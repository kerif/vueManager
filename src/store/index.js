import Vue from 'vue'
import Vuex from 'vuex'

import $i18n from '../utils/i18n'
import tagsView from './module/tagsView'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { tagsView },
  state: {
    isPermissionFilter: false,
    fileterAfterRouterMap: [],
    isPermissionFilterArr: [],
    token: '',
    userName: '', // 用户名
    groupMe: '', // 是否显示拼团配置
    btnLoading: false,
    isCollapse: false,
    languageCode: 'zhCN', // 默认简体中文
    pagePath: '', // 路径列表
    orderListFieldData: [] // 订单列表显示字段
  },
  mutations: {
    updateOrderListFieldData(state, data) {
      state.orderListFieldData = data
    },
    saveToken(state, data) {
      state.token = data
      localStorage.setItem('TOKEN', data)
    },
    initToken(state) {
      state.token = localStorage.getItem('TOKEN') || ''
      state.userName = localStorage.getItem('NAME') || ''
      state.groupMe = localStorage.getItem('me') || ''
    },
    removeToken(state) {
      state.token = ''
      localStorage.removeItem('TOKEN')
    },
    savePagePath(state, data) {
      state.pagePath = data
    },
    switchBtnLoading(state, data) {
      state.btnLoading = data.status
    },
    switchCollapse(state, isCollapse) {
      state.isCollapse = isCollapse
    },
    saveName(state, data) {
      state.userName = data
      localStorage.setItem('NAME', data)
    },
    saveMe(state, data) {
      state.groupMe = data
      localStorage.setItem('me', data)
      console.log(localStorage.setItem, 'localStorage.setItem')
    },
    savePermissionStatus(state, data) {
      state.isPermissionFilter = data
    },
    saveFileterAfterRouterMap(state, data) {
      state.fileterAfterRouterMap = data.fileterAfterRouterMap
      state.isPermissionFilterArr = data.isPermissionFilterArr
    },
    saveLanguageCode(state, data) {
      state.languageCode = data
      $i18n.locale = data
      localStorage.setItem('language', data)
    },
    initLanguageCode(state) {
      state.languageCode = localStorage.getItem('language') || 'zhCN'
      $i18n.locale = localStorage.getItem('language') || 'zhCN'
    }
  },
  actions: {}
})
