<template>
  <div class="order-echarts-container">
    <div class="echarts-main">
      <div class="echarts-top">
        <el-select v-model="days" @change="getDatas" :placeholder="$t('请选择')" class="select-sty">
          <el-option :value="1" :label="$t('今天')"></el-option>
          <el-option :value="7" :label="$t('近7天')"></el-option>
          <el-option :value="30" :label="$t('近30天')"></el-option>
        </el-select>
        <el-date-picker
          class="timeStyle"
          v-model="pickingList"
          type="daterange"
          @change="onPick"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
        >
        </el-date-picker>
        <el-checkbox v-model="checked" class="select-sty">{{ $t('对比') }}</el-checkbox>
        <el-date-picker
          v-if="checked"
          class="timeStyle"
          v-model="compareList"
          type="daterange"
          @change="onCompare"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
        >
        </el-date-picker>
        <el-button class="btn-main" size="small" @click="exportData">{{
          $t('导出产能')
        }}</el-button>
      </div>
      <h3>{{ $t('包裹概览') }}</h3>
      <div class="package-main">
        <ul>
          <li v-for="(item, index) in pieData" :key="index" class="main-first">
            <div v-if="item.name === 'all'">
              <p>{{ $t('全部') }}</p>
              <p>
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'wait_storage'">
              <p class="no-warehouse">{{ $t('未入库') }}</p>
              <p class="no-warehouse">
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'already_storage'">
              <p>{{ $t('已入库') }}</p>
              <p>
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'packed'">
              <p>{{ $t('已集包') }}</p>
              <p>
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'shipped'">
              <p>{{ $t('已发货') }}</p>
              <p>
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'received'">
              <p>{{ $t('已收货') }}</p>
              <p>
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'invalid'">
              <p class="no-warehouse">{{ $t('弃件包裹') }}</p>
              <p class="no-warehouse">
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="charts-content">
        <div class="charts-left" id="chartsFirst"></div>
        <div class="charts-right" id="chartsSecond"></div>
      </div>
    </div>
    <div class="echarts-main order-main">
      <h3>{{ $t('订单概览') }}</h3>
      <div class="package-main">
        <ul>
          <li v-for="(item, index) in pieOrderData" :key="index" class="main-first">
            <div v-if="item.name === 'all'">
              <p>{{ $t('全部') }}</p>
              <p>
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'wait_pack'">
              <p class="no-warehouse">{{ $t('待处理') }}</p>
              <p class="no-warehouse">
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'wait_payment'">
              <p>{{ $t('待支付') }}</p>
              <p>
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'wait_shipped'">
              <p class="no-warehouse">{{ $t('待发货') }}</p>
              <p class="no-warehouse">
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'shipped'">
              <p>{{ $t('已发货') }}</p>
              <p>
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'received'">
              <p>{{ $t('已签收') }}</p>
              <p>
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'invalid'">
              <p>{{ $t('作废订单') }}</p>
              <p>
                <strong>{{ item.counts }}</strong>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="charts-content">
        <div class="charts-left" id="chartsThird"></div>
        <div class="charts-right" id="chartsFourth"></div>
      </div>
    </div>
    <div class="echarts-bottom">
      <h3>{{ $t('包裹统计') }}</h3>
      <el-table
        class="data-list"
        border
        stripe
        v-loading="tableLoading"
        :data="packageData"
        show-summary
        :summary-method="getSummaries"
        min-height="100"
      >
        <el-table-column :label="$t('时间')" prop="days"></el-table-column>
        <el-table-column :label="$t('全部')" prop="total"></el-table-column>
        <el-table-column :label="$t('未入库')" prop="wait_storage"></el-table-column>
        <el-table-column :label="$t('已入库')" prop="already_storage"></el-table-column>
        <el-table-column :label="$t('已集包')" prop="packed"></el-table-column>
        <el-table-column :label="$t('已发货')" prop="shipped"></el-table-column>
        <el-table-column :label="$t('已收货')" prop="received"></el-table-column>
        <el-table-column :label="$t('弃件包裹')" prop="invalid"></el-table-column>
      </el-table>
    </div>
    <div class="echarts-bottom" v-if="unShow && checked">
      <!-- <h3>{{$t('包裹对比')}}</h3> -->
      <el-table
        class="data-list"
        border
        stripe
        v-loading="tableLoading"
        :data="packageCompare"
        min-height="100"
      >
        <!-- <el-table-column :label="$t('区间')" prop="days"></el-table-column>
       <el-table-column :label="$t('全部')" prop="total"></el-table-column>
        <el-table-column :label="$t('未入库')" prop="wait_storage"></el-table-column>
        <el-table-column :label="$t('已入库')" prop="already_storage"></el-table-column>
        <el-table-column :label="$t('已集包')" prop="packed"></el-table-column>
        <el-table-column :label="$t('已发货')" prop="shipped"></el-table-column>
        <el-table-column :label="$t('已收货')" prop="received"></el-table-column>
        <el-table-column :label="$t('弃件包裹')" prop="invalid"></el-table-column> -->
        <el-table-column :label="$t('合计')" prop="days"></el-table-column>
        <el-table-column prop="total"></el-table-column>
        <el-table-column prop="wait_storage"></el-table-column>
        <el-table-column prop="already_storage"></el-table-column>
        <el-table-column prop="packed"></el-table-column>
        <el-table-column prop="shipped"></el-table-column>
        <el-table-column prop="received"></el-table-column>
        <el-table-column prop="invalid"></el-table-column>
      </el-table>
    </div>
    <div class="echarts-bottom">
      <h3>{{ $t('订单统计') }}</h3>
      <el-table
        class="data-list"
        border
        stripe
        v-loading="tableLoading"
        :data="oderData"
        min-height="100"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column :label="$t('时间')" prop="days"></el-table-column>
        <el-table-column :label="$t('全部')" prop="total"></el-table-column>
        <el-table-column :label="$t('待处理')" prop="wait_pack"></el-table-column>
        <el-table-column :label="$t('待支付')" prop="wait_payment"></el-table-column>
        <el-table-column :label="$t('待发货')" prop="wait_shipped"></el-table-column>
        <el-table-column :label="$t('已发货')" prop="shipped"></el-table-column>
        <el-table-column :label="$t('已签收')" prop="received"></el-table-column>
        <el-table-column :label="$t('弃件包裹')" prop="invalid"></el-table-column>
      </el-table>
    </div>
    <div class="echarts-bottom" v-if="unShow && checked">
      <!-- <h3>{{$t('订单对比')}}</h3> -->
      <el-table
        class="data-list"
        border
        stripe
        v-loading="tableLoading"
        :data="orderCompare"
        min-height="100"
      >
        <!-- <el-table-column :label="$t('区间')" prop="days"></el-table-column>
        <el-table-column :label="$t('全部')" prop="total"></el-table-column>
        <el-table-column :label="$t('待处理')" prop="wait_pack"></el-table-column>
        <el-table-column :label="$t('待支付')" prop="wait_payment"></el-table-column>
        <el-table-column :label="$t('待发货')" prop="wait_shipped"></el-table-column>
        <el-table-column :label="$t('已发货')" prop="shipped"></el-table-column>
        <el-table-column :label="$t('已签收')" prop="received"></el-table-column>
        <el-table-column :label="$t('弃件包裹')" prop="invalid"></el-table-column> -->
        <el-table-column :label="$t('合计')" prop="days"></el-table-column>
        <el-table-column prop="total"></el-table-column>
        <el-table-column prop="wait_pack"></el-table-column>
        <el-table-column prop="wait_payment"></el-table-column>
        <el-table-column prop="wait_shipped"></el-table-column>
        <el-table-column prop="shipped"></el-table-column>
        <el-table-column prop="received"></el-table-column>
        <el-table-column prop="invalid"></el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="show" :title="$t('请选择导出范围')" @close="clear">
      <el-date-picker
        type="daterange"
        v-model="time"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :range-separator="$t('至')"
        :start-placeholder="$t('开始日期')"
        :end-placeholder="$t('结束日期')"
      >
      </el-date-picker>
      <div slot="footer">
        <el-button type="primary" @click="confirmExport">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'
// import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    // NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      days: 7,
      pickingList: [],
      compareList: [], // 对比数据
      checked: '',
      myChart: '',
      packageChart: '',
      myOrder: '',
      orderChart: '',
      option: '',
      packageOption: '',
      begin: '',
      end: '',
      compare_begin: '',
      compare_end: '',
      orderLeft: '',
      orderRight: '',
      pieData: [],
      pieOrderData: [], // 订单数据
      tableLoading: false,
      packageData: [],
      oderData: [],
      unShow: false,
      packageCompare: [],
      orderCompare: [],
      show: false,
      time: []
    }
  },
  created() {
    this.getPie() // 包裹饼图数据
    this.getColumnar() // 包裹柱状数据
    this.getOrderPie() // 订单饼图数据
    this.getOrderColumnar() // 订单柱状数据
    this.packageList() // 包裹列表
    this.orderList() // 订单列表
  },
  mounted() {
    // 包裹饼图
    this.myChart = echarts.init(document.getElementById('chartsFirst'))
    window.onresize = this.myChart.resize
    this.option = {
      backgroundColor: '#ffffff',
      color: ['#9969BD', '#6495F9', '#E96C5B', '#62DAAB', '#F6C022', '#74CBED'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      }
    }
    // 包裹树状图
    this.packageChart = echarts.init(document.getElementById('chartsSecond'))
    window.onresize = this.packageChart.resize
    this.packageOption = {
      backgroundColor: '#ffffff',
      color: ['#cee5fe'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    }
    // 订单饼图
    this.myOrder = echarts.init(document.getElementById('chartsThird'))
    window.onresize = this.myOrder.resize
    this.orderLeft = {
      backgroundColor: '#ffffff',
      color: ['#9969BD', '#6495F9', '#E96C5B', '#62DAAB', '#F6C022', '#74CBED'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      }
    }
    // 订单树状图
    this.orderChart = echarts.init(document.getElementById('chartsFourth'))
    window.onresize = this.orderChart.resize
    this.orderRight = {
      backgroundColor: '#ffffff',
      color: ['#cee5fe'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    }
  },
  methods: {
    // 包裹饼图数据
    getPie() {
      let params = {
        // page: this.page_params.page,
        // size: this.page_params.size,
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.getPie(params).then(res => {
        if (res.ret) {
          this.pieData = res.data
          const obj = {
            wait_storage: this.$t('未入库'),
            already_storage: this.$t('已入库'),
            packed: this.$t('已集包'),
            shipped: this.$t('已发货'),
            received: this.$t('已收货'),
            invalid: this.$t('弃件包裹')
          }
          // let pieOrderList = res.data.map(item => {
          //   console.log(item, 'item')
          //   return {
          //     value: item.counts,
          //     name: obj[item.name]
          //   }
          // })
          let pieOrderList = res.data
            .filter(item => {
              return item.name !== 'all'
            })
            .map(item => {
              return {
                value: item.counts,
                name: obj[item.name]
              }
            })
          console.log(pieOrderList, 'pieOrderList')
          this.option.legend = {
            orient: 'vertical',
            left: 10,
            data: [
              this.$t('未入库'),
              this.$t('已入库'),
              this.$t('已集包'),
              this.$t('已发货'),
              this.$t('已收货'),
              this.$t('弃件包裹')
            ]
          }
          this.option.series = [
            {
              name: '包裹概览',
              type: 'pie',
              radius: ['50%', '70%'],
              label: {
                formatter: ' {d}% '
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true
              },
              data: pieOrderList
              // { value: 335, name: '自建', selected: true },
              // { value: 310, name: '店铺一' },
              // { value: 234, name: '店铺二' },
              // { value: 135, name: '店铺三' },
              // { value: 1548, name: '店铺四' }
            }
          ]
          this.myChart.setOption(this.option)
        }
      })
    },
    // 包裹树状图
    getColumnar() {
      let params = {
        // page: this.page_params.page,
        // size: this.page_params.size,
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.getColumnar(params).then(res => {
        if (res.ret) {
          let xData = res.data.map(item => item.days)
          let yData = res.data.map(item => item.counts)
          this.packageOption.xAxis = [
            {
              type: 'category',
              data: xData,
              axisTick: {
                alignWithLabel: true
              }
            }
          ]
          this.packageOption.yAxis = [
            {
              type: 'value',
              axisLine: {
                // y轴
                show: false
              },
              axisTick: {
                // y轴刻度线
                show: false
              },
              splitLine: {
                // 网格线
                show: true
              }
            }
          ]
          this.packageOption.series = [
            {
              name: '新增包裹数',
              type: 'bar',
              barWidth: '60%',
              data: yData
            }
          ]
          this.packageChart.setOption(this.packageOption)
        }
      })
    },
    // 订单饼图数据
    getOrderPie() {
      let params = {
        // page: this.page_params.page,
        // size: this.page_params.size,
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.getOrderPie(params).then(res => {
        if (res.ret) {
          this.pieOrderData = res.data
          const obj = {
            wait_pack: this.$t('待处理'),
            wait_payment: this.$t('待支付'),
            wait_shipped: this.$t('待发货'),
            shipped: this.$t('已发货'),
            received: this.$t('已签收'),
            invalid: this.$t('作废订单')
          }
          // let pieList = res.data.map(item => {
          //   console.log(item, 'item')
          //   return {
          //     value: item.counts,
          //     name: obj[item.name]
          //   }
          // })
          let pieList = res.data
            .filter(item => {
              return item.name !== 'all'
            })
            .map(item => {
              return {
                value: item.counts,
                name: obj[item.name]
              }
            })
          this.orderLeft.legend = {
            orient: 'vertical',
            left: 10,
            data: [
              this.$t('待处理'),
              this.$t('待支付'),
              this.$t('待发货'),
              this.$t('已发货'),
              this.$t('已签收'),
              this.$t('作废订单')
            ]
          }
          this.orderLeft.series = [
            {
              name: '包裹概览',
              type: 'pie',
              radius: ['50%', '70%'],
              label: {
                formatter: ' {d}% '
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true
              },
              data: pieList
              // { value: 335, name: '自建', selected: true },
              // { value: 310, name: '店铺一' },
              // { value: 234, name: '店铺二' },
              // { value: 135, name: '店铺三' },
              // { value: 1548, name: '店铺四' }
            }
          ]
          this.myOrder.setOption(this.orderLeft)
        }
      })
    },
    // 订单树状图
    getOrderColumnar() {
      let params = {
        // page: this.page_params.page,
        // size: this.page_params.size,
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.getOrderColumnar(params).then(res => {
        if (res.ret) {
          let xData = res.data.map(item => item.days)
          let yData = res.data.map(item => item.counts)
          this.orderRight.xAxis = [
            {
              type: 'category',
              data: xData,
              axisTick: {
                alignWithLabel: true
              }
            }
          ]
          this.orderRight.yAxis = [
            {
              type: 'value',
              axisLine: {
                // y轴
                show: false
              },
              axisTick: {
                // y轴刻度线
                show: false
              },
              splitLine: {
                // 网格线
                show: true
              }
            }
          ]
          this.orderRight.series = [
            {
              name: '新增订单数',
              type: 'bar',
              barWidth: '60%',
              data: yData
            }
          ]
          this.orderChart.setOption(this.orderRight)
        }
      })
    },
    // 天数
    getDatas() {
      this.page_params.handleQueryChange('days', this.days)
      this.getPie()
      this.getColumnar()
      this.getOrderPie()
      this.getOrderColumnar()
      this.packageList()
      this.orderList()
    },
    // 时间
    onPick(val) {
      this.begin = val ? val[0] : ''
      this.end = val ? val[1] : ''
      // this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin} ${this.end}`)
      this.getPie()
      this.getColumnar()
      this.getOrderPie()
      this.getOrderColumnar()
      this.packageList()
      this.orderList()
    },
    // 对比
    onCompare(val) {
      this.compare_begin = val ? val[0] : ''
      this.compare_end = val ? val[1] : ''
      // this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.compare_begin} ${this.compare_end}`)
      this.comparePackage()
      this.compareOrder()
    },
    // 包裹订单对比
    comparePackage() {
      let params = {
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.compare_begin && (params.compare_begin = this.compare_begin)
      this.compare_end && (params.compare_end = this.compare_end)
      this.$request.packageCompare(params).then(res => {
        if (res.ret) {
          this.packageCompare = res.data
          this.unShow = true
        }
      })
    },
    // 订单对比
    compareOrder() {
      let params = {
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.compare_begin && (params.compare_begin = this.compare_begin)
      this.compare_end && (params.compare_end = this.compare_end)
      this.$request.orderCompare(params).then(res => {
        if (res.ret) {
          this.orderCompare = res.data
          this.unShow = true
        }
      })
    },
    // 包裹列表
    packageList() {
      let params = {
        // page: this.page_params.page,
        // size: this.page_params.size,
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.packageDaily(params).then(res => {
        if (res.ret) {
          this.packageData = res.data
          // this.page_params.page = res.meta.current_page
          // this.page_params.total = res.meta.total
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          // sums[index] += '个'
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    },
    // 订单列表
    orderList() {
      let params = {
        // page: this.page_params.page,
        // size: this.page_params.size,
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.orderDaily(params).then(res => {
        if (res.ret) {
          this.oderData = res.data
          // this.page_params.page = res.meta.current_page
          // this.page_params.total = res.meta.total
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    exportData() {
      this.show = true
    },
    confirmExport() {
      this.$request
        .exportOrderData({
          begin_date: this.time[0],
          end_date: this.time[1]
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.show = false
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    clear() {
      this.time = []
    }
  }
}
</script>

<style lang="scss">
.order-echarts-container {
  .echarts-main {
    padding: 20px 40px;
    background-color: #fff !important;
  }
  .order-main {
    margin-top: 20px;
  }
  .select-sty {
    margin-right: 20px;
  }
  .timeStyle {
    margin-right: 20px;
    width: 276px !important;
  }
  .main-first {
    display: inline-block;
    width: 120px;
    text-align: center;
    border-right: 1px solid #e1e1e1;
  }
  .echarts-top {
    margin-bottom: 40px;
  }
  .package-main {
    margin-left: 30px;
  }
  .no-warehouse {
    color: #e1685a;
    font-weight: 700;
  }
  .charts-left {
    display: inline-block;
    width: 45%;
    height: 300px;
  }
  .charts-right {
    display: inline-block;
    width: 55%;
    height: 400px;
  }
  .charts-content {
    margin-top: 60px;
  }
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
    }
  }
  .main-first:last-child {
    border-right: none !important;
  }
}
</style>
