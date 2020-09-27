<template>
  <div class="customer-echarts-container">
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
          :end-placeholder="$t('结束日期')">
        </el-date-picker>
        </div>
      <div class="package-main">
        <h3>{{$t('新增客户概览')}}</h3>
        <ul>
          <li v-for="(item, index) in pieData" :key="index" class="total-first">
            <div v-if="item.name === 'new-user'">
              <p>{{$t('新增客户数')}}
              </p>
              <p><strong>{{item.amount}}</strong></p>
            </div>
              <div v-if="item.name === 'new-user-package'">
              <p>{{$t('新增客户预报量')}}
              </p>
              <p><strong>{{item.amount}}</strong></p>
            </div>
              <div v-if="item.name === 'turnover-rate'">
              <p class="no-warehouse">{{$t('转化率(%)')}}
              </p>
              <p class="no-warehouse"><strong>{{item.amount}}</strong></p>
            </div>
          </li>
        </ul>
      </div>
      <div class="charts-content">
        <div class="charts-right" id="chartsSecond"></div>
      </div>
    </div>
    <div class="echarts-main order-main">
      <div class="package-main">
        <h3>{{$t('代理概览')}}</h3>
        <ul>
          <li v-for="(item, index) in proxyData" :key="index" class="total-first">
            <div v-if="item.name === 'agent-count'">
              <p>{{$t('代理数')}}
              </p>
              <p><strong>{{item.amount}}</strong></p>
            </div>
              <div v-if="item.name === 'order-count'">
              <p>{{$t('下单成交数')}}
              </p>
              <p><strong>{{item.amount}}</strong></p>
            </div>
            <div v-if="item.name === 'order-amount'">
              <p class="no-warehouse">{{$t('成交金额')}}
              </p>
              <p class="no-warehouse"><strong>{{item.amount}}</strong></p>
            </div>
            <div v-if="item.name === 'commission'">
              <p class="no-warehouse">{{$t('佣金')}}
              </p>
              <p class="no-warehouse"><strong>{{item.amount}}</strong></p>
            </div>
          </li>
        </ul>
      </div>
      <div class="charts-content">
        <div class="charts-right" id="proxyCharts"></div>
      </div>
    </div>
    <div class="echarts-bottom">
      <h3>{{$t('新增客户下单排行榜')}}</h3>
      <el-table class="data-list" border stripe v-loading="tableLoading" :data="packageData">
        <el-table-column :label="$t('客户ID')" prop="user_id"></el-table-column>
        <el-table-column :label="$t('客户昵称')" prop="name"></el-table-column>
        <el-table-column :label="$t('成交订单数')" prop="order_count"></el-table-column>
        <el-table-column :label="$t('成交金额')" prop="order_amount"></el-table-column>
        <el-table-column :label="$t('注册日期')" prop="created_at"></el-table-column>
        <el-table-column :label="$t('最后登录日期')" prop="last_login_at"></el-table-column>
      </el-table>
      <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    </div>
    <div class="echarts-bottom">
      <h3>{{$t('代理邀请客户成交金额排行榜')}}</h3>
      <el-table class="data-list" border stripe v-loading="tableLoading" :data="packageCompare">
        <el-table-column :label="$t('代理名称')" prop="agent_name"></el-table-column>
        <el-table-column :label="$t('佣金分成%')" prop="rate"></el-table-column>
        <el-table-column :label="$t('成交订单数')" prop="order_count"></el-table-column>
        <el-table-column :label="$t('成交金额')" prop="order_amount"></el-table-column>
        <el-table-column :label="$t('提现金额')" prop="withdraw"></el-table-column>
      </el-table>
      <div class="proxy-sty">
        <el-pagination
          background
          :prev-text="$t('上一页')"
          :next-text="$t('下一页')"
          @size-change="page_proxy.handleSizeChange"
          @current-change="page_proxy.handleCurrentChange"
          :current-page="page_proxy.page"
          :page-sizes="[10, 20, 30]"
          :page-size="page_proxy.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page_proxy.total">
        </el-pagination>
      </div>
      <!-- <nle-pagination :pageParams="page_proxy" :notNeedInitQuery="false"></nle-pagination> -->
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  data () {
    return {
      days: 7,
      pickingList: [],
      compareList: [], // 对比日期
      packageCompare: [],
      checked: '',
      myChart: '',
      packageChart: '', // 客户柱状图
      proxyChart: '', // 代理柱状图
      myOrder: '',
      orderChart: '',
      option: '',
      packageOption: '', // 客户柱状图
      proxyOption: '', // 代理柱状图
      begin: '',
      end: '',
      orderLeft: '',
      orderRight: '',
      pieData: [],
      proxyData: [],
      pieOrderData: [], // 订单数据
      tableLoading: false,
      packageData: [],
      unShow: false,
      localization: {},
      maxValue: '',
      page_proxy: {
        page: 1,
        size: 10,
        total: 0,
        handleCurrentChange: this.proxyCurrentChange,
        handleSizeChange: this.proxySizeChange,
        handleQueryChange: this.proxyQueryChange
      }
    }
  },
  created () {
    this.getColumnar() // 客户柱状数据
    this.proxyColumnar() // 代理柱状数据
    this.packageList() // 客户列表
    this.getCompare() // 代理表格数据
    this.financeAmount() // 统计金额
    this.proxyAmount() // 代理统计
  },
  mounted () {
    // 新增客户树状图
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
        data: ['转化率', '新增客户数'],
        left: '200',
        top: 'bottom'
      }
    }
    // 代理概览树状图
    this.proxyChart = echarts.init(document.getElementById('proxyCharts'))
    window.onresize = this.proxyChart.resize
    this.proxyOption = {
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
        data: ['邀请客户成交订单数', '邀请客户成交金额'],
        left: '200',
        top: 'bottom'
      }
    }
  },
  methods: {
    // 客户树状图
    getColumnar () {
      let params = {
        // page: this.page_params.page,
        // size: this.page_params.size,
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.vipColumnar(params).then(res => {
        if (res.ret) {
          let xData = res.data.created.map(item => item.days)
          // let paymentData = res.data.created.map(item => item.counts)
          let createdData = res.data.created.map(item => item.counts)
          let changeData = res.data.rate.map(item => item.rate)
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
              name: '新增客户数(个)',
              min: 0,
              boundaryGap: true,
              max (value) {
                return Math.ceil(value.max / 5) * 5
              },
              'axisLine': { // y轴
                'show': false
              },
              'axisTick': { // y轴刻度线
                'show': false
              },
              'splitLine': { // 网格线
                'show': true
              }
            },
            {
              type: 'value',
              scale: true,
              name: '转化率(%)',
              min: 0,
              boundaryGap: true,
              'axisLine': { // y轴
                'show': false
              },
              'axisTick': { // y轴刻度线
                'show': false
              },
              'splitLine': { // 网格线
                'show': true
              }
            },
            {
              type: 'value',
              'axisLine': { // y轴
                'show': false
              },
              'axisTick': { // y轴刻度线
                'show': false
              },
              'splitLine': { // 网格线
                'show': true
              }
            },
            {
              type: 'value',
              'axisLine': { // y轴
                'show': false
              },
              'axisTick': { // y轴刻度线
                'show': false
              },
              'splitLine': { // 网格线
                'show': true
              }
            }
          ]
          this.packageOption.series = [
            {
              name: '新增客户数',
              type: 'bar',
              data: createdData,
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
              name: '转化率',
              type: 'line',
              data: changeData,
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  color: '#3499CC',
                  lineStyle: {
                    color: '#3499CC'
                  }
                }
              }
            }
          ]
          this.packageChart.setOption(this.packageOption)
        }
      })
    },
    // 代理树状图
    proxyColumnar () {
      let params = {
        // page: this.page_params.page,
        // size: this.page_params.size,
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.proxyColumnar(params).then(res => {
        if (res.ret) {
          let maxValue
          let xData = res.data.amounts.map(item => item.days)
          // let paymentData = res.data.created.map(item => item.counts)
          let countsData = res.data.counts.map(item => item.counts)
          let amountsData = res.data.amounts.map(item => item.amounts)
          this.proxyOption.xAxis = [
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
          this.proxyOption.yAxis = [
            {
              type: 'value',
              scale: true,
              name: '邀请客户成交订单数(个)',
              min: 0,
              max (value) {
                return Math.ceil(value.max / 5) * 5
              },
              boundaryGap: true,
              // splitNumber: 5,
              'axisLine': { // y轴
                'show': false
              },
              'axisTick': { // y轴刻度线
                'show': false
              },
              'splitLine': { // 网格线
                'show': true
              }
            },
            {
              type: 'value',
              scale: true,
              name: '成交金额(元)',
              // splitNumber: 5,
              min: 0,
              max (value) {
                maxValue = Math.ceil(value.max / 5) * 5
                console.log(maxValue, 'this.maxValue')
                return Math.ceil(value.max / 5) * 5
              },
              interval () {
                return maxValue / 5
              },
              boundaryGap: true,
              'axisLine': { // y轴
                'show': false
              },
              'axisTick': { // y轴刻度线
                'show': false
              },
              'splitLine': { // 网格线
                'show': true
              }
            },
            {
              type: 'value',
              'axisLine': { // y轴
                'show': false
              },
              'axisTick': { // y轴刻度线
                'show': false
              },
              'splitLine': { // 网格线
                'show': true
              }
            },
            {
              type: 'value',
              'axisLine': { // y轴
                'show': false
              },
              'axisTick': { // y轴刻度线
                'show': false
              },
              'splitLine': { // 网格线
                'show': true
              }
            }
          ]
          this.proxyOption.series = [
            {
              name: '邀请客户成交订单数',
              type: 'bar',
              data: countsData,
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
              name: '邀请客户成交金额',
              type: 'line',
              data: amountsData,
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  color: '#3499CC',
                  lineStyle: {
                    color: '#3499CC'
                  }
                }
              }
            }
          ]
          this.proxyChart.setOption(this.proxyOption)
        }
      })
    },
    // 天数
    getDatas () {
      this.page_params.handleQueryChange('days', this.days)
      this.page_proxy.handleQueryChange('days', this.days)
      this.getColumnar()
      this.proxyColumnar()
      this.packageList()
      this.getCompare()
      this.financeAmount()
      this.proxyAmount()
    },
    getList () {
      this.packageList()
    },
    // 获取新增客户统计
    financeAmount () {
      let params = {
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.vipCounts(params).then(res => {
        if (res.ret) {
          this.pieData = res.data
          this.localization = res.localization
        }
      })
    },
    proxyAmount () {
      let params = {
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.proxyCounts(params).then(res => {
        if (res.ret) {
          this.proxyData = res.data
          this.localization = res.localization
        }
      })
    },
    proxySizeChange (pageSize) {
      this.page_proxy.page = 1
      this.page_proxy.size = pageSize
      this.getCompare()
    },
    // 分页
    proxyCurrentChange (pageId) {
      this.page_proxy.page = pageId
      this.getCompare()
    },
    proxyQueryChange (key, value) {
      const { name, params, query } = this.$route
      this.$router.replace({
        name,
        params,
        query: {
          ...query,
          [key]: value
        }
      })
    },
    // 时间
    onPick (val) {
      console.log(val, 'val')
      this.begin = val ? val[0] : ''
      this.end = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin} ${this.end}`)
      this.page_proxy.page = 1
      this.page_proxy.handleQueryChange('times', `${this.begin} ${this.end}`)
      this.getColumnar()
      this.proxyColumnar()
      this.packageList()
      this.getCompare() // 代理表格数据
      this.financeAmount()
      this.proxyAmount()
    },
    // 代理数据
    getCompare () {
      let params = {
        page: this.page_proxy.page,
        size: this.page_proxy.size,
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.agentRank(params).then(res => {
        if (res.ret) {
          this.packageCompare = res.data
          this.page_proxy.page = res.meta.current_page
          this.page_proxy.total = res.meta.total
        }
      })
    },
    // 客户列表
    packageList () {
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.vipRank(params).then(res => {
        if (res.ret) {
          this.packageData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
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
.customer-echarts-container {
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
  ul{
    margin: 0;
    padding: 0;
    li{
      list-style:none;
    }
  }
   .total-first:last-child{
    border-right: none !important;
  }
  .proxy-sty {
    text-align: right;
    .btn-prev, .btn-next {
      padding: 0 10px !important;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #f5f5f5;
      color: black;
      border: 1px solid #3540A5;
    }
  }
}
</style>
