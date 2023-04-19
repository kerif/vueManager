import { Message } from 'element-ui'
import store from '@/store'
import request from '@/lib/request'
import { clone, multiTree, matchRoute } from './utils'
// import dynamicRouters from './routes'
import dynamicRouters from './path'
const whiteList = ['login', 'NotFound'] // 不重定向白名单

const dynamicAddRouter = (router, next, to) => {
  let isPermissionFilterArr = [1000, 102] // 102 为修改密码的页面
  let filteredRouterMap = clone['array'](dynamicRouters)
  request.getCurrentUserPermissions().then(res => {
    res.data.map(item => {
      console.log('item.tag', item.tag)
      item.children.map(childrenItem => {
        if (childrenItem.children.length >= 1 && childrenItem.children[0].enabled === 1) {
          isPermissionFilterArr.push(childrenItem.tag, item.tag)
          console.log('item.tag', childrenItem.tag, item.tag)
        }
        childrenItem.children.map(grandsonItem => {
          if (grandsonItem.children.length >= 1 && grandsonItem.children[0].enabled === 1) {
            isPermissionFilterArr.push(grandsonItem.tag)
          }
        })
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
    console.log('filteredRouterMap[0]', filteredRouterMap)
    console.log('isPermissionFilterArr', isPermissionFilterArr)
    if (to.path !== '/no_permission' && matchRoute(list[1], to.path)) {
      // 路由无权限
      next('/home/reset-password')
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
    console.log('store.state.noPermmissionArr', store.state.noPermmissionArr)
    console.log('判断是不是没权限', matchRoute(store.state.noPermmissionArr, to.path))
    if (store.state.token) {
      if (!store.state.isPermissionFilter) {
        console.log('我进来了噢')
        dynamicAddRouter(router, next, to)
      } else {
        console.log('我走下面了')
        if (to.path === '/home/panel') {
          console.log('??????home/panel')
          if (!store.state.isPermissionFilterArr.includes(1100)) {
            next({ path: '/home/reset-password' })
            console.log('??????home/panel22222', to.path)
          }
        } else if (
          to.path !== '/no_permission' &&
          to.path !== '/station/tracking' &&
          matchRoute(store.state.noPermmissionArr, to.path)
        ) {
          console.log('????????')
          next('/no_permission')
        } else if (to.path === '/') {
          next({ path: '/home/panel' })
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
