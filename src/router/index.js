import Vue from 'vue'
import Router from 'vue-router'
import Route from './routes'
import store from '@/store'

const loadonDemand = (path) => {
  return () => import(/* webpackChunkName: "chunk" */ `@/views/${path}`)
}

const Layout = loadonDemand('layout')
// 登录
const Login = loadonDemand('login')

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [].concat(Route)
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  // to and from are Route Object,next() must be called to resolve the hook}
  if (to.name !== 'login') {
    console.log('to', to)
    let pagePath = `${to.meta.group},${to.meta.name}`
    store.commit('savePagePath', pagePath)
  }
  next()
})

export { router, routes }
