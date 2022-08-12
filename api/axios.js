 /**进行了axios的二次封装 */
import axios from "axios";
import config from '../config/index'

//对当前环境进行判断
const baseUrl = process.env.NODE_ENV === 'development'?config.baseUrl.dev:config.baseUrl.pro

class HttpRequest  //类是es6引进的,方法定义不能加function,方法之间不能用逗号隔开，同时有extends继承，get和set方法,super关键字
{
    constructor(baseUrl) //构造函数
    {
        this.baseUrl = baseUrl;
    }

    getInsideConfig()
    {
        const config = {
            baseUrl:this.baseUrl,
            header:{}
        }
        return config;
    }
    interceptors(instance) //自定义函数，封装了请求拦截器和响应拦截器，拦截器会在每次发起ajax请求时自动触发
    {
        //添加请求拦截器
       instance.interceptors.request.use(function (config){
        //在发送请求前做点什么
        console.log("发送请求前行为")
        return config;
       },function (error){
        //对请求错误做些什么
        console.log("请求错误");
        return Promise.reject(error);
       });

       //添加响应拦截器
       instance.interceptors.response.use(function (response){
        //对响应数据做点什么
        console.log("处理响应数据")
        //console.log(response.data);
         return response
       },function (error){
        //对响应错误做点什么
        console.log("响应错误");
        return Promise.reject(error); //返回一个带有拒绝原因的Promise对象
       });

    }

    request(options) {
          const instance = axios.create()
           options = {...this.getInsideConfig(),...options}
          this.interceptors(instance)
          return instance(options)
    }
}

export default new HttpRequest(baseUrl);