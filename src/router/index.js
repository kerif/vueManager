import Vue from 'vue'
import Router from 'vue-router'
import interception from './interception'

const loadonDemand = (path) => {
  return () => import(/* webpackChunkName: "chunk" */ `@/views/${path}`)
}

// 登录
const Login = loadonDemand('login')
// const NotFound = loadonDemand('404')

Vue.use(Router)

const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '*',
    name: 'NotFound',
    redirect: '/login'
  }
  // {
  //   path: '*',
  //   name: 'NotFound',
  //   component: NotFound
  // }
]

const router = new Router({
  routes: constantRouterMap
})

router.beforeEach(interception(router))

export default router
