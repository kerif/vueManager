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
    noPermmissionArr: [],
    token: '',
    userName: '', // 用户名
    groupMe: '', // 是否显示拼团配置
    btnLoading: false,
    isCollapse: false,
    languageCode: 'zhCN', // 默认简体中文
    pagePath: '', // 路径列表
    unread: 0,
    refund: 0,
    orderListFieldData: [], // 订单列表显示字段
    siderBarImage: '',
    uid: 0
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
      localStorage.removeItem('language')
    },
    savePagePath(state, data) {
      state.pagePath = data
    },
    switchBtnLoading(state, data) {
      state.btnLoading = data.status
    },
    changeUnread(state, data) {
      state.unread = data
    },
    changeRefund(state, data) {
      state.refund = data.refund
      state.payment = data.payment
    },
    switchCollapse(state, isCollapse) {
      state.isCollapse = isCollapse
    },
    saveName(state, data) {
      state.userName = data
      localStorage.setItem('NAME', data)
    },
    saveSiderBarImage(state, data) {
      state.siderBarImage = data
    },
    saveMe(state, data) {
      state.groupMe = data
      localStorage.setItem('me', data)
    },
    savePermissionStatus(state, data) {
      state.isPermissionFilter = data
    },
    saveFileterAfterRouterMap(state, data) {
      state.fileterAfterRouterMap = data.fileterAfterRouterMap
      state.isPermissionFilterArr = data.isPermissionFilterArr
      state.noPermmissionArr = data.noPermmissionArr
    },
    saveLanguageCode(state, data) {
      state.languageCode = data.locale
      $i18n.locale = data.locale
      sessionStorage.setItem('language', data.locale)
      if (data.reload) {
        window.location.reload()
      }
    },
    initLanguageCode(state) {
      if (!sessionStorage.getItem('language')) {
        sessionStorage.setItem('language', 'zhCN')
      }
      state.languageCode = sessionStorage.getItem('language') || 'zhCN'
      $i18n.locale = sessionStorage.getItem('language') || 'zhCN'
      if (localStorage.getItem('language')) {
        localStorage.removeItem('language')
      }
    },
    saveUid(state, data) {
      state.uid = data
    }
  },
  actions: {}
})
