import { Message } from 'element-ui'
import store from '@/store'
import request from '@/lib/request'
import { clone, multiTree, matchRoute } from './utils'
// import dynamicRouters from './routes'
import dynamicRouters from './path'
const whiteList = ['login', 'NotFound'] // 不重定向白名单

const dynamicAddRouter = (router, next, to) => {
  let isPermissionFilterArr = [100, 102] // 102 为修改密码的页面
  let filteredRouterMap = clone['array'](dynamicRouters)
  request.getCurrentUserPermissions().then(res => {
    res.data.map(item => {
      item.child.map(childrenItem => {
        if (childrenItem.child.length >= 1 && childrenItem.child[0].enabled === true) {
          isPermissionFilterArr.push(childrenItem.tag, item.tag)
        }
      })
    })
    // 获取有权限和无权限路由
    const list = multiTree(filteredRouterMap[0], isPermissionFilterArr)
    filteredRouterMap[0] = list[0]
    router.addRoutes(filteredRouterMap)
    store.commit('saveFileterAfterRouterMap', {
      fileterAfterRouterMap: filteredRouterMap,
      isPermissionFilterArr,
      noPermmissionArr: list[1]
    })
    store.commit('savePermissionStatus', true) // 标记筛选完成
    console.log(filteredRouterMap[0])
    console.log('filteredRouterMap[0]', filteredRouterMap[0])
    console.log('isPermissionFilterArr', isPermissionFilterArr)
    if (to.path !== '/no_permission' && matchRoute(list[1], to.path)) {
      // 路由无权限
      next('/no_permission')
    } else {
      next({ path: to.path, query: to.query })
    }
  })
}

export default router => {
  return (to, from, next) => {
    console.log('to', to)
    console.log('from', from)
    console.log('next', next)
    console.log('store.state.isPermissionFilter', store.state.isPermissionFilter)
    if (store.state.token) {
      if (!store.state.isPermissionFilter) {
        console.log('我进来了噢')
        dynamicAddRouter(router, next, to)
      } else {
        console.log('我走下面了')
        if (to.path === '/home/panel') {
          if (!store.state.isPermissionFilterArr.includes(101)) {
            next({ path: '/home/reset-password' })
          }
        } else if (
          to.path !== '/no_permission' &&
          matchRoute(store.state.noPermmissionArr, to.path)
        ) {
          next('/no_permission')
        }
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
