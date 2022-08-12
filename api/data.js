import axios from "./axios";

export const getMenu = (param)=>{
    return axios.request({
        url:'/permission/getMenu',
        // url:'/views/mall/index.vue',
        method:'post',
        data:param
    })
}

export const getData = ()=>{
    return axios.request({
        url:'/home/getData'
    })
}

export const getUser = (params)=>{
    return axios.request({
        url: '/user/getUser',
        method:'get',
        params
    })
}

export const delUser = (params)=>{
    return axios.request({
        url: '/user/delUser',
        method:'get',
        params
    })
}

export const checkUser = (params)=> {  //用户登录
    return axios.request({
        url:'/login/checkUser',
        mothod:'get',
        params
    })
}