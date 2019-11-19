import { Message } from 'element-ui'
import store from '@/store'
import request from '@/lib/request'
import { clone, multiTree } from './utils'
import dynamicRouters from './routes'
const whiteList = ['login', 'NotFound'] // 不重定向白名单

const dynamicAddRouter = (router, next, to) => {
  let isPermissionFilter = []
  let filteredRouterMap = clone['array'](dynamicRouters)
  request.getCurrentUserPermissions().then(res => {
    console.log('res', res)
    res.data.map((item) => {
      item.child.map(childrenItem => {
        if (childrenItem.child.length >= 1 && childrenItem.child[0].enabled === true) {
          isPermissionFilter.push(childrenItem.tag, item.tag)
        }
      })
    })
    console.log(isPermissionFilter)
    console.log(filteredRouterMap)
    filteredRouterMap[0] = multiTree(filteredRouterMap[0], isPermissionFilter)
    // 筛选有权限的路由
    router.addRoutes(filteredRouterMap)
    store.commit('saveFileterAfterRouterMap', filteredRouterMap)
    store.commit('savePermissionStatus', true) // 标记筛选完成
    next({ path: to.path, query: to.query })
  })
}

export default router => {
  return (to, from, next) => {
    if (store.state.token) {
      if (!store.state.isPermissionFilter) {
        dynamicAddRouter(router, next, to)
      } else {
        console.log(1)
        next()
      }
    } else {
      if (whiteList.includes(to.name)) {
        if (to.name === 'NotFound') {
          next('/login')
        }
        next()
      } else {
        Message({
          message: '请登录后再进行操作',
          type: 'error'
        })
        next('/login')
      }
    }
  }
}
