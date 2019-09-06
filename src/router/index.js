import Vue from 'vue'
import Router from 'vue-router'
import Route from './routes'

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

export { router, routes }
