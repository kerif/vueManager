<template>

 <div>
  <el-row class = "home" :gutter = "20">
  <el-col :span="8" style = "margin-top: 20px;">
      <el-card class="box-card" shadow = "hover" v-show = "true">
        <div class = "admin" slot="header">
          <img class = "adminImg" :src = "userImg">
          <div style = "margin-left: 50px; margin-top: 30px;">
            <span style = "font-size: 25px; font-weight: bold;">Admin</span>
            <p>超级管理员</p>
          </div>
        </div>
        <div class = "login-info">
          <p>上次登录时间：   2022/9/3</p>
          <p>上次登录地点：   日本</p>
        </div>
      </el-card>
      <!--table数据不显示,解决方法：安装较低版本的element-ui如@2.9.2-->
      <el-card style = "margin-top: 20px; height :460px;">
        <el-table :data ="tableData">
              <el-table-column
               v-for="(val,key) in tableLabel"
               :key ="key"
               :prop = "key"
               :label = "val"
              >
              </el-table-column>
        </el-table>
      </el-card>
  </el-col>
  <el-col :span = "16" style = "margin-top:20px;">
       <div class = "num" style="display: flex; flex-wrap: wrap;">
        <el-card  shadow="hover"  class = "dataCard" v-for = "item in countData" :key = "item.name" :body-style = "{display:'flex',padding:0}">
           <i class = "icon" :class="`el-icon-${item.icon}`" :style = "{background:item.color}"></i>
           <div class = "detail">
             <p class = "num" style="font-size: 16px; font-weight: bold;">¥{{ item.value }}</p>
             <p class = "txt" style="font-size: 15px;">{{ item.name }}</p>
           </div>
        </el-card>
       </div>
       <div class = "graph">
          <el-card style = "height: 300px; width: 98%;"><!--折线图-->
              <div style = "height: 300px" ref = "echarts"></div>
          </el-card>
          <el-card style = "height:250px;width: 540px;display: inline-block; margin-top: 20px;">
            <div style = "height:250px" ref = 'userEcharts'></div>
          </el-card>
          <el-card style = "height:250px;width: 540px;display: inline-block; margin-left: 10px; margin-top: 20px;">
              <div style = "height: 250px;" ref = 'stockEcharts'></div>
          </el-card>
       </div>
  </el-col>
</el-row>
 </div>
 
</template>

<style>
@media  screen and (min-width:360px) { /**刚好我手机竖屏是360px */
  
.admin {
  display: flex;
}
.adminImg {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
.icon {
  width: 80px;
  font-size: 40px;/**font-size调整图标大小 */
  padding-left: 16px;
  padding-top: 20px;
}
.dataCard {
  width:346px;
  height: 80px;
  margin-right: 20px;
  margin-bottom: 20px;
}
.detail {
  margin-top: 5px;
  margin-left: 30px;
  width: 200px;
  height: 80px;
}
.num {
  width: 1110px;
}
p{
  margin-block-start: 10px;
  margin-block-end: 10px;
}
}
</style>

<script>
import { getData } from '../../api/data'
import * as echarts from 'echarts' /**导入echarts */
export default {
  name:'myHome',
  data()
  {
    return{
      userImg: require("../../src/assets/images/kotori.png"),
      tableData: [
        // {
        //   name: 'oppo',
        //   todayBuy: 300,
        //   monthBuy: 4300,
        //   totalBuy: 10456
        // },
        // {
        //   name: 'vivo',
        //   todayBuy: 140,
        //   monthBuy: 2400,
        //   totalBuy: 7896
        // },
        // {
        //   name: '华为',
        //   todayBuy: 1404,
        //   monthBuy: 14300,
        //   totalBuy: 110456
        // },
        // {
        //   name: '黑鲨',
        //   todayBuy: 200,
        //   monthBuy: 3300,
        //   totalBuy: 6456
        // },
        // {
        //   name: '锤子',
        //   todayBuy: 600,
        //   monthBuy: 7300,
        //   totalBuy: 110456
        // },
        // {
        //   name: '小米',
        //   todayBuy: 600,
        //   monthBuy: 8300,
        //   totalBuy: 99456
        // },

      ],
      tableLabel: {
        name: '手机品牌',
        todayBuy: '今日购买',
        monthBuy: '本月购买',
        totalBuy: '总计购买'
      },
      countData:[
        {
          name:"今日支付订单",
          value:1234,
          icon:"success",
          color:"#21c7c9",
        },
        {
          name:"今日收藏订单",
          value:210,
          icon:"star-on",
          color:"#ffb980",
        },
        {
          name:"今日未支付订单",
          value:1234,
          icon:"s-goods",
          color:"#5ab1ef",
        },
        {
          name:"本月支付订单",
          value:12364,
          icon:"success",
          color:"#21c7c9",
        },
        {
          name:"本月收藏订单",
          value:1212,
          icon:"star-on",
          color:"#ffb980",
        },
        {
          name:"本月未支付订单",
          value:4,
          icon:"s-goods",
          color:"#5ab1ef",
        },
      ],
    }
  },

  mounted() {   //将自定义插件挂载到DOM树
     getData().then(res => {  // getData返回一个axios请求,拦截到了数据,then方法执行异步操作
          const {code,data} = res.data
          if(code === 20000)
          {
            console.log(data)
            this.tableData = data.tableData //设置表格数据
             //绘制折线图
             const order = data.orderData
             const xArray = order.date
             const keyArray = Object.keys(order.data[0])//此处处理对象，返回属性数组
             console.log(keyArray);
             const series = []
             keyArray.forEach(key => {
               series.push({
                name: key,
                data: order.data.map(item=>item[key]),
                type: 'line'
               })
             });
             const option = {
              title: {
                text:"销量"
              },
              tooltip: {
                trigger:'axis',
              },
              xAxis:{
                data:xArray
              },
              yAxis:{},
              
              legend:{
                data:keyArray
              },
              series
             }

             const E = echarts.init(this.$refs.echarts)
             E.setOption(option)

             //用户柱状图
          const userOption = {
            legend: {     //控制图形显隐
              textStyle: {
                color:"#333",
              },
            },
            grid: {
              left:"20%",
            },
            //提示框
            tooltip: { //鼠标悬停提示图像信息
              trigger: "axis", //通过坐标轴
            },
            xAxis: {
              type:"category",
              data:data.userData.map(item => item.date),
              axisLine:{
                lineStyle: {
                  color:"#17b3a3",
                },
              },
              axisLabel: {
                interval: 0,
                color: "#333",
              },
            },
            yAxis: [
              {
                type:"value",
                axisLine: {
                  lineStyle:{
                    color:"#17b3a3",
                  },
                },
              },
            ],
            color:["#2ec7c9","#b6a2de"],
            series:[
              {
              name:'新增用户',
              data:data.userData.map(item => item.new),
              type:'bar'
              },
              {
              name:'活跃用户',
              data:data.userData.map(item => item.active),
              type:'bar'
              },
              

            ],
          }
            const U = echarts.init(this.$refs.userEcharts)
            U.setOption(userOption)

            //品牌饼状图
            const stockData = data.stockData
            console.log(stockData)
            const stockOption = {
              title: {
                text:"库存量"
              },
              tooltip: {
                trigger:"item"
              },
              legend: {
                textStyle: {
                  color:"#333"
                },
                //color:["#b6a2de","#2ec7c9","#b6a2de","#2ec7c9","#b6a2de","#2ec7c9"],
              },
              series:[
                  {
                    type: "pie",
                    data: stockData,
                    // radius: ['70%','30%'], //设置环形饼状图，内圈大小,外圈大小
                    radius:'60%', //设置饼状图大小
                    itemStyle: {
                    normal: { 
                   label: {
                    position:'outer',
                    show:true,
                    formatter: '{d}%'
                  }
                  }
                },
                }
                ],
            }

            const V = echarts.init(this.$refs.stockEcharts)
            V.setOption(stockOption)
          }
     })
  }
}
</script>