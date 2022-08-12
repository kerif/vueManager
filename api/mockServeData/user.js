import Mock from 'mockjs'
//模拟一个后台接口，提供页面需要的数据和方法
function param2Obj(url) {   //将url中的参数解码,然后返回一个json对象
    const search = url.split('?')[1]  //split 将url按?进行分割,会返回一个数组，[1]表示的是数组的第二个元素
    if(!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search) //解码器，对应还有一个编码器
         .replace(/"/g,'\\"')
         .replace(/&/g,'","')
         .replace(/=/g,'":"') +
         '"}'
    )
}
let List = []
const count = 150
for(let i=0;i<count;i++)
{
    List.push(
        Mock.mock({
            id:Mock.Random.guid(),
            name:Mock.Random.cname(),
            addr:Mock.mock('@county(true)'),
            'age|18-60':1,
            birth:Mock.Random.date(),
            sex:Mock.Random.integer(0,1)
        })
    )
}

export default {

//获取用户列表
getUserList:config => {  //按根据页数返回List
    console.log(config.url);
    const {name,page =1 ,limit =13} = param2Obj(config.url)
    //console.log(param2Obj(config.url));
    //打印
    //console.log("name:"+name,"page"+page,"分页大小limit"+limit)
    //过滤流程
    const mockList = List.filter(user => {  //这里为何要filter得到mockList
        //要获取所有的用户时名字为空,输入特定的名字返回相应数据
        if(name === '' || name === page)return true;
        else if(name !=='' && (user.name.indexOf(name) === -1 && user.addr.indexOf(name) === -1)) return false
        else return true
    })
    const pageList = mockList.filter((item,index) => {
        //index为下标
        //console.log(index);
        if(index < limit*page && index >= limit * (page - 1))
        return true  
    })
    return {
        code: 20000,
        count:mockList.length,
        list:pageList
    }
},

//新增用户
createUser: config => {
    const {name,addr,age,birth,sex} = JSON.parse(config.body)
    const newUser = JSON.parse(config.body);
    //console.log("new"+typeof(newUser.name));
    if(newUser.name === ''|| newUser.addr === ''|| newUser.age === ''|| newUser.birth === '' 
    || newUser.sex === '')
    {
        return {
            code:200,
            message: '添加失败,请完整填写表单'
        }
    }
    List.unshift({    //在数组的前端添加数据并返回数组长度,作用与shfit函数相反
        id:Mock.Random.guid(),
        name:name,
        addr:addr,
        age:age,
        birth:birth,
        sex:sex
    })
    return {
        code:20000,
        message: '新增用户成功'
    }
},

//更新用户
updateUser: config =>{   //config形参,即是前端传入的数据,箭头函数本就是匿名函数
    const {id,name,addr,age,birth,sex} = JSON.parse(config.body)
    const sex_num = parseInt(sex)
    List.some(u => {
        if(u.id === id) {
            u.name = name
            u.addr = addr
            u.age = age
            u.birth = birth
            u.sex = sex_num
            return true
        }
    })
    return {
        code:20000,
        date: {
            message: '编辑成功'
        }
    }
},

//删除用户,通过传入id,然后进行过滤,bug:id参数不正确
deleteUser: config => { //会执行
    const {id} = param2Obj(config.url)
    if(!id) {
        console.log("参数不正确");
        return {
            code:-999,
            message:"参数不正确"
        }
    }else {
        console.log("过滤成功");
        List = List.filter(u => u.id !== id) //过滤操作
        return {
            code:20000,
            message:"删除成功"
        }
    }
}

}
