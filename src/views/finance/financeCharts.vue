<template>
  <div class="finance-echarts-container">
    <div class="echarts-main">
      <div class="echarts-top">
        <el-select
          v-model="country_id"
          @change="changeCountry"
          :placeholder="$t('请选择市场')"
          class="select-sty"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select v-model="days" @change="getDatas" :placeholder="$t('请选择')" class="select-sty">
          <el-option :value="1" :label="$t('今天')"></el-option>
          <el-option :value="7" :label="$t('近7天')"></el-option>
          <el-option :value="30" :label="$t('近一个月')"></el-option>
          <el-option :value="90" :label="$t('近三个月')"></el-option>
          <el-option :value="180" :label="$t('近半年')"></el-option>
          <el-option :value="360" :label="$t('近一年')"></el-option>
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
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="charts-content">
            <div class="charts-left" id="chartsSecond"></div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="charts-content">
            <div
              class="charts-right"
              ref="pieCharts"
              v-show="country_id == 0"
              id="pieCharts"
              style="width: 100%; height: 400px"
            ></div>
          </div>
        </el-col>
      </el-row>
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
      localization: {},
      country_id: 0,
      growthData: [0],
      countryChart: '',
      countryOption: {},
      options: [],
      paymentList: []
    }
  },
  created() {
    this.packageList() // 包裹列表
    this.financeAmount() // 统计金额
    this.getCountry()
    if (this.days === 7) {
      this.pickingList[0] = this.fun_date(-7)
      this.$set(this.pickingList, 0, this.pickingList[0])
      this.pickingList[1] = this.fun_date(0)
      this.$set(this.pickingList, 1, this.pickingList[1])
      this.getCountryData(this.pickingList[0], this.pickingList[1])
      this.getColumnar(this.pickingList[0], this.pickingList[1]) // 包裹柱状数据
    }
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
        },
        formatter: function (params) {
          let tmp = ''
          for (let i = 0; i < params.length; i++) {
            tmp += `${i == 0 ? params[0].name : ''}<br/> ${params[i].seriesName}:${
              i !== params.length - 1 ? params[i].value : params[i].value + '%'
            }`
          }
          return tmp
        }
      },
      legend: {
        data: [this.$t('总收入'), this.$t('充值收入'), this.$t('营业额')],
        left: '200',
        top: 'bottom'
      }
    }

    // 饼图
    let pie = this.$refs.pieCharts
    if (pie) {
      this.countryChart = echarts.init(pie)
      window.addEventListener('resize', () => {
        this.countryChart.resize()
      })
      this.countryOption = {
        backgroundColor: '#ffffff',
        color: ['#9969BD', '#6495F9', '#E96C5B', '#62DAAB', '#F6C022', '#74CBED'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        }
      }
    }
  },
  methods: {
    // 包裹树状图
    getColumnar() {
      let params = {
        days: this.days,
        begin: this.pickingList[0],
        end: this.pickingList[1]
      }
      if (this.country_id !== 0) {
        params.country_id = this.country_id
      }
      this.growthData = [0]
      this.$request.financeColumnar(params).then(res => {
        if (res.ret) {
          this.paymentList = res.data.payment
          for (let i = 1; i < this.paymentList.length; i++) {
            let number = 0
            let count =
              (Number(this.paymentList[i] && this.paymentList[i].amounts) -
                Number(this.paymentList[i - 1] && this.paymentList[i - 1].amounts)) *
              100

            let beforeCount = Number(this.paymentList[i - 1] && this.paymentList[i - 1].amounts)

            if (count == 0 && beforeCount !== 0) {
              number = 0
            } else if (beforeCount == 0 && count !== 0) {
              number = 100
            } else if (count == 0 && beforeCount == 0) {
              number = 0
            } else if (beforeCount !== 0) {
              number = count / beforeCount
            }
            this.growthData.push(number)
          }
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
            },
            {
              name: this.$t('营业额增长率'),
              type: 'line',
              data: this.growthData,
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
    changeCountry(val) {
      this.financeAmount()
      this.getColumnar()
      if (val === 0) {
        this.getCountryData()
      }
      this.$nextTick(function () {
        var myEvent = new Event('resize') // 创建一个支持冒泡且不能被取消的resize事件
        window.dispatchEvent(myEvent) // 事件可以在任何元素触发
      })
    },
    getCountryData() {
      let params = {
        begin: this.pickingList[0],
        end: this.pickingList[1]
      }
      this.$request.pieCountStatistisc(params).then(res => {
        let pieData = res.data.map(item => {
          return {
            value: item.amount,
            name: item.country ? item.country.name : ''
          }
        })
        this.countryOption.legend = {
          orient: 'vertical',
          left: 10
        }
        this.countryOption.series = [
          {
            name: this.$t('营业额'),
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
            data: pieData
          }
        ]
        this.countryChart && this.countryChart.setOption(this.countryOption)
      })
    },
    getCountry() {
      this.$request.getEnabledCountry().then(res => {
        this.options = res.data
        this.options.unshift({ id: 0, name: this.$t('全部市场') })
      })
    },
    fun_date(data) {
      var date1 = new Date()
      date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() // time1表示当前时间
      var date2 = new Date(date1)
      date2.setDate(date1.getDate() + data)
      var time2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()
      return time2
    },
    // 天数
    getDatas() {
      if (this.days === 1) {
        this.pickingList[0] = this.fun_date(0) || ''
        this.$set(this.pickingList, 0, this.pickingList[0])
        this.pickingList[1] = this.fun_date(0) || ''
        this.$set(this.pickingList, 1, this.pickingList[1])
      } else if (this.days === 7) {
        this.pickingList[0] = this.fun_date(-7)
        this.$set(this.pickingList, 0, this.pickingList[0])
        this.pickingList[1] = this.fun_date(0)
        this.$set(this.pickingList, 1, this.pickingList[1])
      } else if (this.days === 30) {
        this.pickingList[0] = this.fun_date(-30)
        this.$set(this.pickingList, 0, this.pickingList[0])
        this.pickingList[1] = this.fun_date(0)
        this.$set(this.pickingList, 1, this.pickingList[1])
      } else if (this.days === 90) {
        this.pickingList[0] = this.fun_date(-90)
        this.$set(this.pickingList, 0, this.pickingList[0])
        this.pickingList[1] = this.fun_date(0)
        this.$set(this.pickingList, 1, this.pickingList[1])
      } else if (this.days === 180) {
        this.pickingList[0] = this.fun_date(-180)
        this.$set(this.pickingList, 0, this.pickingList[0])
        this.pickingList[1] = this.fun_date(0)
        this.$set(this.pickingList, 1, this.pickingList[1])
      } else if (this.days === 360) {
        this.pickingList[0] = this.fun_date(-360)
        this.$set(this.pickingList, 0, this.pickingList[0])
        this.pickingList[1] = this.fun_date(0)
        this.$set(this.pickingList, 1, this.pickingList[1])
      }
      this.page_params.handleQueryChange('days', this.days)
      this.getColumnar()
      this.packageList()
      this.financeAmount()
      this.getCountryData()
    },
    // 获取金额统计
    financeAmount() {
      let params = {
        days: this.days
      }
      if (this.country_id !== 0) {
        params.country_id = this.country_id
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
      this.getCountryData()
    },
    // 对比
    onCompare(val) {
      this.compare_begin = val ? val[0] : ''
      this.compare_end = val ? val[1] : ''
      // this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.compare_begin} ${this.compare_end}`)
      this.getCompare()
      this.getCountryData()
    },
    // 对比数据
    getCompare() {
      let params = {
        days: this.days
      }
      if (this.country_id !== 0) {
        params.country_id = this.country_id
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
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.financeData(params).then(res => {
        if (res.ret) {
          this.packageData = res.data
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
    width: 100%;
    height: 400px;
  }
  .charts-right {
    width: 100%;
    height: 400px;
  }
  .hide {
    display: none;
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
  .total-first:last-child {
    border-right: none !important;
  }
}
</style>
