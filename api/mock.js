//对接口请求进行拦截
import Mock from 'mockjs'
import homeApi from './mockServeData/home'
import userApi from './mockServeData/user'
import loginAip from './mockServeData/login'

Mock.mock('/home/getData',homeApi.getStatisticalData) 
Mock.mock(/user\/add/,'post',userApi.createUser)
Mock.mock(/user\/edit/,'post',userApi.updateUser)
/*Mock.mock函数参数解析: rurl需要拦截的url rtype表示拦截的ajax请求类型,
function:在拦截到请求之后该函数会对数据进行处理并返回处理后的数据*/

Mock.mock(/user\/getUser/,'get',userApi.getUserList)
Mock.mock(/user\/del/,'get',userApi.deleteUser)

Mock.mock(/login\/checkUser/,'get',loginAip.checkUser)