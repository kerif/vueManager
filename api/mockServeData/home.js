import Mock from 'mockjs'

//图表数据
let List = []
export default {
    getStatisticalData: ()=>{
        //Mock.Random.float 产生随机数100到800之间，保留小数，最小0位 最大0位
        for(let i = 0;i<7;i++)
        List.push(Mock.mock(
            {
                    苹果:Mock.Random.float(100,8000,0,0),
                    vivo:Mock.Random.float(100,8000,0,0),
                    oppo:Mock.Random.float(100,8000,0,0),
                    魅族:Mock.Random.float(100,8000,0,0),
                    三星:Mock.Random.float(100,8000,0,0),
                    小米:Mock.Random.float(100,8000,0,0),
            })
        )

     /** console.log("数据类型为"+typeof(Mock.mock( {
          name: Phone[i],
          todayBuy: Mock.Random.float(200,2000,0,0),
          monthBuy: Mock.Random.float(2000,8000,0,0),
          totalBuy: Mock.Random.float(5000,18000,0,0)
      }))) */  
        return {
            code:20000,
            data: {
                //随机数据
                List,
                //饼图--展示库存量
                stockData: [
                    {
                        name:'小米',
                        value:'12990'
                    },
                    {
                        name:'苹果',
                        value:'16990'
                    },
                    {
                        name:'魅族',
                        value:'12690'
                    },
                    {
                        name:'华为',
                        value:'13990'
                    },
                    {
                        name:'vivo',
                        value:'11990'
                    },
                    {
                        name:'oppo',
                        value:'12590'
                    },
    
                ],
                //柱状图
                userData: [
                   {
                    date: '周一',
                    new: 1215,
                    active: 12040
                   },
                   {
                    date: '周二',
                    new: 1510,
                    active: 26400
                   },
                   {
                    date: '周三',
                    new: 1712,
                    active: 34200
                   },
                   {
                    date: '周四',
                    new: 2115,
                    active: 22200
                   },   
                   {
                    date: '周五',
                    new: 2080,
                    active: 30120
                   },


                ],
                //折线图
                orderData :{
                  date:['20221001','20221002','20221003','20221004','20221005','20221006','20221007'],
                  data:List
                },
                //表格 如果不使用随机数据就用此处
                tableData: [
                    {
                      name: '是oppo鸭',
                      todayBuy: 300,
                      monthBuy: 4300,
                      totalBuy: 10456
                    },
                    {
                      name: 'vivo',
                      todayBuy: 140,
                      monthBuy: 2400,
                      totalBuy: 7896
                    },
                    {
                      name: '华为',
                      todayBuy: 1404,
                      monthBuy: 14300,
                      totalBuy: 110456
                    },
                    {
                      name: '黑鲨',
                      todayBuy: 200,
                      monthBuy: 3300,
                      totalBuy: 6456
                    },
                    {
                      name: '锤子',
                      todayBuy: 600,
                      monthBuy: 7300,
                      totalBuy: 110456
                    },
                    {
                      name: '小米',
                      todayBuy: 1600,
                      monthBuy: 8300,
                      totalBuy: 99456
                    },
            
                  ],
            }
        }
    }

    
}