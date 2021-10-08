<template>
  <div class="volume-echarts-container">
    <h3>货量统计</h3>
    <el-row :gutter="20">
      <el-col :span="14" style="height: 100%">
        <div>(根据列表筛选条件)</div>
        <div style="margin-top: 60px">线路统计</div>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="#" type="index"> </el-table-column>
          <el-table-column prop="express_line_id_name" label="线路名称"> </el-table-column>
          <el-table-column prop="percent" label="渠道占比"> </el-table-column>
          <el-table-column prop="package_count" label="包裹总数"> </el-table-column>
          <el-table-column prop="order_count" label="订单总数"> </el-table-column>
          <el-table-column prop="box_count" label="箱总数"> </el-table-column>
          <el-table-column prop="payment_weight" label="计费重量"> </el-table-column>
          <el-table-column prop="value" label="申报总值"> </el-table-column>
          <el-table-column prop="actual_payment_fee" label="实付总计"> </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="10" style="height: 100%">
        <h3>{{ $t('支付方式') }}</h3>
        <div class="charts-top" id="chartsFirst"></div>
        <h3>{{ $t('目的地') }}</h3>
        <div class="charts-bottom" id="chartsFourth"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      myChart: '',
      myDestinationChart: '',
      orderRight: {},
      orderTop: {},
      tableData: [],
      pieOrderData: []
    }
  },
  created() {
    this.getPie() // 支付方式饼图数据
    this.getDestinationPie()
  },
  methods: {
    getPie() {
      this.$request.volumeStatistics().then(res => {
        if (res.ret) {
          this.pieOrderData = res.data.pay_method
          const arr = this.pieOrderData.map(item => {
            return {
              value: item.order_count,
              name: item.pay_name
            }
          })
          this.tableData = res.data.line
          this.orderRight.series = [
            {
              name: '支付方式',
              type: 'pie',
              radius: ['30%', '70%'],
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
              data: arr
            }
          ]
          this.myChart.setOption(this.orderRight)
        }
      })
    },
    getDestinationPie() {
      this.$request.volumeStatistics().then(res => {
        if (res.ret) {
          this.pieDestinationData = res.data.destination
          const arr = this.pieDestinationData.map(item => {
            return {
              value: item.order_count,
              name: item.country_name
            }
          })
          this.orderTop.series = [
            {
              name: '目的地',
              type: 'pie',
              radius: ['30%', '70%'],
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
              data: arr
            }
          ]
          this.myDestinationChart.setOption(this.orderTop)
        }
      })
    }
  },
  mounted() {
    // 支付方式饼图
    this.myChart = echarts.init(document.getElementById('chartsFirst'))
    window.onresize = this.myChart.resize
    this.orderRight = {
      backgroundColor: '#ffffff',
      color: ['#9969BD', '#6495F9', '#E96C5B', '#62DAAB', '#F6C022', '#74CBED'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      }
    }
    //目的地饼图
    this.myDestinationChart = echarts.init(document.getElementById('chartsFourth'))
    window.onresize = this.myDestinationChart.resize
    this.orderTop = {
      backgroundColor: '#ffffff',
      color: ['#9969BD', '#6495F9', '#E96C5B', '#62DAAB', '#F6C022', '#74CBED'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      }
    }
  }
}
</script>

<style lang="scss">
.volume-echarts-container {
  background: #fff !important;
  .charts-top {
    display: inline-block;
    width: 100%;
    height: 300px;
  }
  .charts-bottom {
    display: inline-block;
    width: 100%;
    height: 300px;
  }
}
</style>
