//处理传进来的参数的url分离出username和password
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
let userList =[
    {
        username:"Admin",
        password:"123456a"
    },
    {
        username:"Admin1",
        password:"123456a"
    },
    {
        username:"Admin2",
        password:"123456a"
    }
]
export default {
    checkUser: config=>{
        const search = param2Obj(config.url)
        // console.log("账号"+search.username);
        // console.log("密码"+search.password);
        let trueUsername = false
        for(let i = 0;i < userList.length; i++)
        {
            if(userList[i].username === search.username)
            {
                if(userList[i].password === search.password)
                {
                return {
                    code:20000,
                    username:userList[i].username
                }
            }else {
                trueUsername = true
                return {
                    code:200,
                    message:"密码错误"
                }
            }
            }
        }
            if(trueUsername)
            {
                return {
                code:200,
                message:"请输入正确的密码"
                }
            }else{
                return {
                    code:200,
                    message:"用户名不存在"
                }
            }
    }
}