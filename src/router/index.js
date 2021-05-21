import Vue from 'vue'
import Router from 'vue-router'
import interception from './interception'

const loadonDemand = path => {
  return () => import(/* webpackChunkName: "chunk" */ `@/views/${path}`)
}

// 登录
const Login = loadonDemand('login')
const NotFound = loadonDemand('404')

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
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new Router({
  routes: constantRouterMap
})

router.beforeEach(interception(router))

export default router
