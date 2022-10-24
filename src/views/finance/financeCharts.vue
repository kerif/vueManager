<template>
  <div class="finance-echarts-container">
    <div class="echarts-main">
      <div class="echarts-top">
        <el-select v-model="days" @change="getDatas" :placeholder="$t('请选择')" class="select-sty">
          <el-option :value="1" :label="$t('今天')"></el-option>
          <el-option :value="7" :label="$t('近7天')"></el-option>
          <el-option :value="30" :label="$t('近30天')"></el-option>
          <!-- <el-option :value="90" :label="$t('近三个月')"></el-option>
          <el-option :value="180" :label="$t('近半年')"></el-option> -->
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
      </div>
      <div class="package-main">
        <ul>
          <li v-for="(item, index) in pieData" :key="index" class="total-first">
            <div v-if="item.name === 'total'">
              <p>
                {{ $t('总收入') }}
                <span v-if="localization">{{ localization.currency_unit }}</span>
              </p>
              <p class="no-warehouse">
                <strong>{{ item.amount }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'payment'">
              <p>
                {{ $t('营业额') }}
                <span v-if="localization">{{ localization.currency_unit }}</span>
              </p>
              <p>
                <strong>{{ item.amount }}</strong>
              </p>
            </div>
            <div v-if="item.name === 'recharge'">
              <p>
                {{ $t('充值收入') }}
                <span v-if="localization">{{ localization.currency_unit }}</span>
              </p>
              <p>
                <strong>{{ item.amount }}</strong>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="charts-content">
        <div class="charts-right" id="chartsSecond"></div>
      </div>
    </div>
    <div class="echarts-bottom">
      <!-- <h3>{{$t('包裹列表')}}</h3> -->
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
        <el-table-column :label="$t('应付金额')" prop="order_amount"></el-table-column>
        <el-table-column :label="$t('抵用券优惠')" prop="coupon_amount"></el-table-column>
        <el-table-column :label="$t('支付金额')" prop="pay_amount"></el-table-column>
        <el-table-column :label="$t('充值金额')" prop="recharge_amount"></el-table-column>
      </el-table>
    </div>
    <div class="echarts-bottom" v-if="unShow && checked">
      <el-table
        class="data-list"
        border
        stripe
        v-loading="tableLoading"
        :data="packageCompare"
        min-height="100"
      >
        <el-table-column :label="$t('总计')" prop="days"></el-table-column>
        <!-- <el-table-column :label="$t('应付金额')" prop="order_amount"></el-table-column> -->
        <el-table-column prop="order_amount"></el-table-column>
        <!-- <el-table-column :label="$t('抵用券优惠')" prop="coupon_amount"></el-table-column> -->
        <el-table-column prop="coupon_amount"></el-table-column>
        <!-- <el-table-column :label="$t('支付金额')" prop="pay_amount"></el-table-column> -->
        <el-table-column prop="pay_amount"></el-table-column>
        <!-- <el-table-column :label="$t('充值金额')" prop="recharge_amount"></el-table-column> -->
        <el-table-column prop="recharge_amount"></el-table-column>
      </el-table>
    </div>
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
      compareList: [], // 对比日期
      packageCompare: [],
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
      unShow: false,
      localization: {}
    }
  },
  created() {
    this.getColumnar() // 包裹柱状数据
    this.packageList() // 包裹列表
    this.financeAmount() // 统计金额
  },
  mounted() {
    // 树状图
    this.packageChart = echarts.init(document.getElementById('chartsSecond'))
    window.onresize = this.packageChart.resize
    this.packageOption = {
      backgroundColor: '#ffffff',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        data: [this.$t('总收入'), this.$t('充值收入'), this.$t('营业额')],
        left: '200',
        top: 'bottom'
      }
    }
  },
  methods: {
    // 包裹树状图
    getColumnar() {
      let params = {
        // page: this.page_params.page,
        // size: this.page_params.size,
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.financeColumnar(params).then(res => {
        if (res.ret) {
          console.log(res.data.total)
          let xData = res.data.total.map(item => item.days)
          let paymentData = res.data.payment.map(item => item.amounts)
          let rechargeData = res.data.recharge.map(item => item.amounts)
          let totalData = res.data.total.map(item => item.amounts)
          this.packageOption.xAxis = [
            {
              type: 'category',
              boundaryGap: true,
              data: xData
            },
            {
              type: 'category',
              boundaryGap: true
            },
            {
              type: 'category',
              boundaryGap: true
            }
          ]
          this.packageOption.yAxis = [
            {
              type: 'value',
              scale: true,
              name: '总收入(元)',
              min: 0,
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
            },
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
            },
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
              name: this.$t('总收入'),
              type: 'bar',
              data: totalData,
              itemStyle: {
                normal: {
                  color: '#D0E5FF',
                  lineStyle: {
                    color: '#D0E5FF'
                  }
                }
              }
            },
            {
              name: this.$t('充值收入'),
              type: 'line',
              data: rechargeData,
              itemStyle: {
                normal: {
                  color: '#3499CC',
                  lineStyle: {
                    color: '#3499CC'
                  }
                }
              }
            },
            {
              name: this.$t('营业额'),
              type: 'line',
              data: paymentData,
              itemStyle: {
                normal: {
                  color: '#EC6B68',
                  lineStyle: {
                    color: '#EC6B68'
                  }
                }
              }
            }
          ]
          this.packageChart.setOption(this.packageOption)
        }
      })
    },
    fun_date(aa) {
      var date1 = new Date()
      date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() // time1表示当前时间
      var date2 = new Date(date1)
      date2.setDate(date1.getDate() + aa)
      var time2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()
      return time2
    },
    // 天数
    getDatas() {
      // if (this.days === 1) {
      //   this.pickingList[0] = this.fun_date(0)
      //   this.$set(this.pickingList, 0, this.pickingList[0])
      //   this.pickingList[1] = this.fun_date(0)
      //   this.$set(this.pickingList, 1, this.pickingList[1])
      // } else if (this.days === 7) {
      //   this.pickingList[0] = this.fun_date(-7)
      //   this.$set(this.pickingList, 0, this.pickingList[0])
      //   this.pickingList[1] = this.fun_date(0)
      //   this.$set(this.pickingList, 1, this.pickingList[1])
      // } else if (this.days === 30) {
      //   this.pickingList[0] = this.fun_date(-30)
      //   this.$set(this.pickingList, 0, this.pickingList[0])
      //   this.pickingList[1] = this.fun_date(0)
      //   this.$set(this.pickingList, 1, this.pickingList[1])
      // } else if (this.days === 90) {
      //   this.pickingList[0] = this.fun_date(-90)
      //   this.$set(this.pickingList, 0, this.pickingList[0])
      //   this.pickingList[1] = this.fun_date(0)
      //   this.$set(this.pickingList, 1, this.pickingList[1])
      // } else if (this.days === 180) {
      //   this.pickingList[0] = this.fun_date(-180)
      //   this.$set(this.pickingList, 0, this.pickingList[0])
      //   this.pickingList[1] = this.fun_date(0)
      //   this.$set(this.pickingList, 1, this.pickingList[1])
      // }
      this.page_params.handleQueryChange('days', this.days)
      this.getColumnar()
      this.packageList()
      this.financeAmount()
    },
    // 获取金额统计
    financeAmount() {
      let params = {
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.transactionAmount(params).then(res => {
        if (res.ret) {
          this.pieData = res.data
          this.localization = res.localization
        }
      })
    },
    // 总计
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
            return prev + curr
            // const value = Number(curr)
            // if (!isNaN(value)) {
            //   console.log(prev, 'prev')
            //   console.log(curr, 'curr')
            //   return prev + curr
            // } else {
            //   return prev
            // }
          }, 0)
          sums[index] = Number(sums[index]).toFixed(2)
          // sums[index] += '个'
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    },
    // 时间
    onPick(val) {
      this.begin = val ? val[0] : ''
      this.end = val ? val[1] : ''
      // this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin} ${this.end}`)
      this.getColumnar()
      this.packageList()
      this.financeAmount()
    },
    // 对比
    onCompare(val) {
      this.compare_begin = val ? val[0] : ''
      this.compare_end = val ? val[1] : ''
      // this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.compare_begin} ${this.compare_end}`)
      this.getCompare()
    },
    // 对比数据
    getCompare() {
      let params = {
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.compare_begin && (params.compare_begin = this.compare_begin)
      this.compare_end && (params.compare_end = this.compare_end)
      this.$request.financeCompare(params).then(res => {
        if (res.ret) {
          this.unShow = true
          this.packageCompare = res.data
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
      this.$request.financeData(params).then(res => {
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
    }
  }
}
</script>

<style lang="scss">
.finance-echarts-container {
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
  .total-first {
    display: inline-block;
    width: 240px;
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
    // display: inline-block;
    width: 100%;
    height: 400px;
  }
  .charts-content {
    text-align: center;
    margin-top: 60px;
  }
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
    }
  }
  .total-first:last-child {
    border-right: none !important;
  }
}
</style>
