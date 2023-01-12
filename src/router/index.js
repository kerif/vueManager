import Vue from 'vue'
import Router from 'vue-router'
import interception from './interception'

const loadonDemand = path => {
  return () => import(/* webpackChunkName: "chunk" */ `@/views/${path}`)
}

// 登录
const Login = loadonDemand('login')
const NotFound = loadonDemand('404')
const NoPermission = loadonDemand('NoPermission')
const Layout = loadonDemand('layout/layouttop')

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/pdf/orderDetailPdf/:id',
    name: 'orderDetailPdf',
    component: () => import('@/views/pdf/orderDetailPdf.vue')
  },
  {
    path: '/no_permission',
    name: 'noPermission',
    component: NoPermission
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new Router({
  routes: constantRouterMap
})
// const createRouter = () =>
//   new Router({
//     mode: 'history',
//     routes: []
//   })
// const createNewRouter = createRouter()
// export function resetRouter() {
//   const newRouter = createRouter()
//   createNewRouter.matcher = newRouter.matcher
// }

router.beforeEach(interception(router))

export default router
