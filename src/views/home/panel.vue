<template>
  <div class="panel-container">
   <el-row :gutter="0">
     <el-col :span="18">
       <el-row>
         <el-col :span="7">
          <div class="addCustomer" @click="goToOtherPage(301, 'viplist')">
            <div class="box-header">
              <div>{{$t('当月新增客户')}}</div>
              <div class="bold-box">{{ user.current_month }}</div>
            </div>
            <div class="box-footer">
              <span>{{$t('总用户')}}</span>
              <span class="count">{{ user.total }}</span>
            </div>
          </div>
         </el-col>
         <el-col :span="8" :offset="1">
          <div class="addCustomer" @click="goToOtherPage(401, 'orderlist')">
            <div class="box-header">
              <div>{{$t('当月新增订单')}}</div>
              <div class="bold-box">{{ order.current_month }}</div>
            </div>
            <div class="box-footer">
              <span>{{$t('总运单')}}</span>
              <span class="count">{{ order.total }}</span>
            </div>
          </div>
         </el-col>
         <el-col :span="7" :offset="1">
          <div class="addCustomer" @click="goToOtherPage(502, 'shipContainer')">
            <div class="box-header">
              <div>{{$t('当月新增发货单')}}</div>
              <div class="bold-box">{{ shipment.current_month }}</div>
            </div>
            <div class="box-footer">
              <span>{{$t('总发货单')}}</span>
              <span class="count">{{ shipment.total }}</span>
            </div>
          </div>
         </el-col>
       </el-row>
       <el-row class="main">
        <el-col :span="7">
          <div class="main-box" @click="goToOtherPage(501, 'storageContainer')">
            <img src="../../assets/storage.png" class="tip-img">
            <span>{{$t('包裹入库')}}</span>
          </div>
        </el-col>
        <!-- 拣货打包 -->
        <el-col :span="7" :offset="1">
          <div class="main-box" @click="goToOtherPage(402, 'wayBillList')">
            <img src="../../assets/bale.png" class="tip-img">
            <span>{{$t('拣货打包')}}</span>
          </div>
        </el-col>
        <!-- 运单发货 -->
        <el-col :span="7" :offset="1">
          <div class="main-box" @click="goToOtherPage(502, 'shipContainer')">
            <img src="../../assets/ship.png" class="tip-img">
            <span>{{$t('运单发货')}}</span>
          </div>
        </el-col>
       </el-row>
     </el-col>
     <el-col :span="6" class="panel-right">
       <div class="waitMsg">{{$t('待处理消息')}}</div>
       <ul>
         <li @click="goToOtherPage(401, 'orderlist')">
           {{$t('未入库包裹')}}
           <div class="msg-right">{{ waitInStorage }}</div>
           </li>
         <li @click="goToOtherPage(402, 'wayBillList')">
           {{$t('待拣货包裹')}}
           <div class="msg-right">{{ waitPack }}</div>
           </li>
         <li @click="goToOtherPage(402, 'wayBillList', {activeName: '2'})">
           {{$t('未支付包裹')}}
           <div class="msg-right">{{ upaid }}</div>
           </li>
       </ul>
     </el-col>
   </el-row>
   <!-- 面板数据 -->
   <div class="panel-box">
     <div class="waitMsg">{{$t('数据统计')}}</div>
     <div class="show-box">
        <div class="show-list">
         <span class="package-text">{{ status === 2 ? $t('已入库包裹') : (status === 3 ? $t('已拣货包裹') : $t('已发货包裹')) }}</span>
         <el-select v-model="scope" @change="getDatas">
           <el-option :value="1" :label="$t('近一周')"></el-option>
           <el-option :value="2" :label="$t('近一月')"></el-option>
           <el-option :value="3" :label="$t('近半年')"></el-option>
           <el-option :value="4" :label="$t('全年')"></el-option>
         </el-select>
        </div>
        <div class="echarts" id="echarts"></div>
        <div class="type-list">
          <div :class="['type-item', status === 2 ? 'select' : '']" @click="onStatus(2)">{{$t('已入库包裹')}}</div>
          <div :class="['type-item', status === 3 ? 'select' : '']" @click="onStatus(3)">{{$t('已拣货包裹')}}</div>
          <div :class="['type-item', status === 5 ? 'select' : '']" @click="onStatus(5)">{{$t('已发货包裹')}}</div>
        </div>
     </div>
   </div>
    <el-dialog :visible.sync="showTips" :title="$t('系统配置助手')" class="dialog-start-loading" width="45%">
      <div class="loading-top">
        <span>{{$t('亲爱的用户')}}</span><br/>
        <span>{{$t('首次系统使用需要完成以下配置才能正常上线运营')}}</span>
      </div>
      <div class="loading-bottom">
          <div v-for="item in updateProp" :key="item.type_id" class="service">
            <div class="serviceLeft">
            <el-checkbox v-model="item.is_finished">{{item.content}}</el-checkbox>
            </div>
            <div class="serviceRight" @click="goRouter(item.type_id, item.route)">
            <!-- <span>{{item.route}}</span> -->
            <!-- <router-link :to="`/${item.route}`" class="chooseOrder" @click="finishedGuides(item.type_id)">去配置</router-link> -->
            {{$t('去配置')}}
            </div>
          </div>
      </div>
      <div class="not-btn">
        <el-button @click="notMind" class="btn-light-red">{{$t('不再提示')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import echarts from 'echarts'
import { formatWeek, formatMonth } from '@/utils'
export default {
  name: 'panel',
  data () {
    return {
      user: {
        current_month: 0,
        total: 0
      },
      shipment: {
        current_month: 0,
        total: 0
      },
      order: {
        current_month: 0,
        total: 0
      },
      waitInStorage: 0,
      waitPack: 0,
      upaid: 0,
      scope: 1,
      myChart: '',
      status: 2,
      option: '',
      showTips: false,
      updateProp: [],
      types: [],
      moreTips: ''
    }
  },
  created () {
    this.getNumbers()
    this.getDatas()
    this.getStatus() // 获取是否显示弹窗
  },
  mounted () {
    this.myChart = echarts.init(document.getElementById('echarts'))
    window.onresize = this.myChart.resize
    this.option = {
      legend: {
        left: 0,
        width: '100%'
      },
      // 提示框
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      toolbox: {
        show: false
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: [
        {
          type: 'value',
          minInterval: 1
        }
      ],
      color: ['#E5E7FB'],
      textStyle: {
        fontWeight: 'bold'
      }
    }
  },
  computed: {
    isPermissionFilterArr () {
      return this.$store.state.isPermissionFilterArr
    }
  },
  methods: {
    // 获取上面的统计数据
    getNumbers () {
      this.$request.getIndexNumber().then(res => {
        if (res.ret) {
          this.user = res.data.user
          this.shipment = res.data.shipment
          this.order = res.data.order
          this.waitInStorage = res.data.package_wait_in_storage
          this.waitPack = res.data.order_wait_pick
          this.upaid = res.data.order_unpaid
        }
      })
    },
    // 选择包裹类型
    onStatus (status) {
      this.status = status
      this.getDatas()
    },
    // 获取图表数据
    getDatas () {
      this.$request.getIndexData({
        scope: this.scope,
        status: this.status
      }).then(res => {
        if (res.ret) {
          // 横坐标显示数据
          let xData = res.data.map(item => {
            if (this.scope === 1 || this.scope === 2) {
              return formatWeek(item.days)
            } else {
              return formatMonth(item.months)
            }
          })
          // 纵坐标显示数据
          let yData = res.data.map(item => item.count)
          this.option.xAxis = [
            {
              type: 'category',
              boundaryGap: false,
              data: xData
            }
          ]
          this.option.series = [
            {
              type: 'line',
              stack: '总量',
              areaStyle: {},
              smooth: true,
              data: yData,
              lineStyle: {
                normal: {
                  color: '#9FA4D5'
                }
              },
              itemStyle: {
                normal: {
                  borderColor: '#9FA4D5'
                }
              }
            }
          ]
          this.myChart.setOption(this.option)
        }
      })
    },
    goToOtherPage (permissionNumber, routerName, query = {}) {
      if (!this.isPermissionFilterArr.includes(permissionNumber)) {
        this.$message({
          type: 'error',
          message: '当前操作暂无权限！'
        })
      } else {
        this.$router.push({ name: routerName, query: query })
      }
    },
    // 获取是否显示弹窗
    getStatus () {
      this.$request.tipStatus().then(res => {
        if (res.ret) {
          this.moreTips = res.data.no_more_tips
          console.log(this.moreTips, 'moreTips')
          if (this.moreTips === 0) {
            this.showTips = true
            this.getGuides() // 获取弹窗数据
          }
        }
      })
    },
    // 获取弹窗数据
    getGuides () {
      this.$request.getGuides().then(res => {
        if (res.ret) {
          res.data.forEach(items => {
            items.is_finished = !!items.is_finished
          })
          this.updateProp = res.data
        }
      })
    },
    finishedGuides (id) {
      console.log(id, 'type_id')
    },
    goRouter (id, route) {
      this.$request.updateGuides(id)
      this.$router.push(`/${route}`)
    },
    // 弹窗 不再提示
    notMind () {
      this.$request.noTips().then(res => {
        if (res.ret) {
          this.$notify({
            title: '操作成功',
            message: res.msg,
            type: 'success'
          })
          this.showTips = false
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.panel-container {
  background-color: #fff !important;
  .addCustomer {
    background: #E5E7FB;
    border-radius: 4px;
    cursor: pointer;
  }
  .panel-right {
    box-sizing: border-box;
    padding-left: 20px;
  }
  .count {
    padding-left: 20px;
  }
  .waitMsg {
    background-color: #3540A5;
    color: #ccc;
    line-height: 35px;
    font-size: 14px;
    padding-left: 20px;
  }
  ul {
    padding: 0 10px 30px 10px;
    margin: 0;
    list-style-type: none;
    border: 1px solid #ccc;
    li {
      line-height: 40px;
      padding: 0 10px;
      border-bottom: 1px solid #ccc;
      &::before {
        content: '·';
        color: #3540A5;
        font-weight: bold;
        font-size: 22px;
      }
    }
  }
  .main-box {
    cursor: pointer;
  }
  .msg-right {
    float: right;
    color: red;
  }
  .main {
    border: 1px solid #ccc;
    margin-top: 15px;
    line-height: 70px;
    padding: 0 20px;
    text-align: center;
  }
  .box-header, .box-footer {
    padding: 0 10px;
    line-height: 35px;
  }
  .box-header {
    border-bottom: 1px solid #ccc;
  }
  .bold-box {
    font-weight: bold;
    font-size: 18px;
  }
  .tip-img {
    margin-right: 10px;
    position: relative;
    top: 12px;
  }
  .panel-box {
    border: 1px solid #E8E9EB;
    margin-top: 20px;
  }
  .show-box {
    padding: 30px 20px;
  }
  .show-list {
    width: 80%;
    text-align: right;
    line-height: 40px;
  }
  .package-text {
    float: left;
  }
  .echarts {
    width: 80%;
    height: 500px;
    display: inline-block;
  }
  .type-list {
    display: inline-block;
    margin-left: 30px;
    position: relative;
    bottom: 100px;
  }
  .type-item {
    padding: 5px 10px;
    border: 1px solid #E5E7FB;
    color: #3540A5;
    margin-bottom: 10px;
    cursor: pointer;
    &.select {
      background-color: #3540A5;
      color: #fff;
    }
  }
  li {
    cursor: pointer;
  }
  .dialog-start-loading {
    .el-input {
      width: 40% !important;
      margin-left: 50px;
    }
    .el-textarea {
      width: 40% !important;
      margin-left: 50px;
    }
    .el-form-item__label {
      width: 200px;
    }
    .el-form-item__error {
      margin-left: 250px !important;
    }
    .el-dialog__header {
      background-color: #0E102A;
    }
    .el-dialog__title {
      font-size: 14px;
      color: #FFF;
    }
    .el-dialog__close {
      color: #FFF;
    }
  }
  .loading-top {
    margin-bottom: 20px;
    font-size: 15px;
  }
  .service {
    overflow: hidden;
    line-height: 40px;
    .el-input__inner {
      line-height: 40px !important;
      margin-bottom: 10px;
    }
    .serviceLeft {
      display: inline-block;
      float: left;
    }
    .serviceRight {
      cursor: pointer;
      color: blue;
      display: inline-block;
      float: right;
    }
  }
  .not-btn {
    margin-top: 20px;
  }
}
</style>
