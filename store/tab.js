export default {
    state: {
         isCollapse:false,
         tabArr: [
            {
                name:'home',
                path:'/home',
                label:'首页',
                icon:'home'
            }
         ],
         currentMenu:null
    },
    mutations :{
        collapseMenu(state)
        {
            state.isCollapse = !state.isCollapse
        },
        setMenu(state,val) //如果当前页面不为home,就添加数据
        {
           if(val.name !== 'home') {
            // console.log(val.name);
               state.currentMenu = val
               const result = state.tabArr.findIndex(item => item.name === val.name)
               if(result === -1) {    /*==与===区别:基础类型==转化为相同类型进行比较而===则是类型不同则不同
               */
                state.tabArr.push(val)
               }else {
                state.currentMenu = null
               }
           } 
        },
        closeTag(state,val) {
            const currentIndex = state.tabArr.findIndex(item => item.name === val.name)
            state.tabArr.splice(currentIndex,1) /*一个参数，参数为index,删除之后所有元素
            两个参数，第一个参数index,第二个参数为删除元素的个数
            多个参数，第三个参数为删除后要添加的新item*/
        }
    }
}