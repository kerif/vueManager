//路由逻辑文件

//引入vue和vuerouter
import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

//数组里面有多个对象
const routes = [
    {
        path:'/login',
        name:'login',
        component: ()=>import('../views/login')
    },
    {
        path:'/',
        redirect:'/login', //设置路由重定向
        name:'Main',
        component: ()=>import('../views/Main.vue'),
        children: [
            {
               name: 'home',
               path: '/home',
               component :()=>import('../views/home')
            },
            {
                name:'mall',
                path:'/mall',
                component: ()=>import('../views/mall')
                
            },
            {
                name:'user',
                path:'/user',
                component :()=>import('../views/user')
            },
            {
                name:'page1',
                path:'/page1',
                component: () => import('../views/other/pageOne.vue')
            },
            {
                name:'page2',
                path:'/page2',
                component:() => import('../views/other/pageTwo.vue')
            }
        ]
    }
]

const router = new VueRouter({
    //路由匹配模式
    mode:"history",
    routes

})

export default router