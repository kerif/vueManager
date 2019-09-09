import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pagePath: '' // 路径列表
  },
  mutations: {
    savePagePath (state, data) {
      state.pagePath = data
    }
  },
  actions: {

  }
})
