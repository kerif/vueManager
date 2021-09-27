<template>
  <div class="volume-echarts-container">
    <h3>货量统计</h3>
    <div>(根据列表筛选条件)</div>
    <div style="margin-top: 40px; float: left; width: 60%">
      <div>线路统计</div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="#" width="100"> </el-table-column>
        <el-table-column prop="name" label="线路名称" width="100"> </el-table-column>
        <el-table-column prop="address" label="渠道占比"> </el-table-column>
        <el-table-column prop="date" label="包裹总数" width="100"> </el-table-column>
        <el-table-column prop="name" label="订单总数" width="100"> </el-table-column>
        <el-table-column prop="address" label="箱总数"> </el-table-column>
        <el-table-column prop="date" label="计费重量" width="100"> </el-table-column>
        <el-table-column prop="name" label="申报总值" width="100"> </el-table-column>
        <el-table-column prop="address" label="实付总计"> </el-table-column>
      </el-table>
    </div>
    <div style="float: right; width: 40%">
      <h3>{{ $t('支付方式') }}</h3>
      <div>
        <div class="charts-right" id="charts"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      myChart: '',
      orderRight: '',
      tableData: []
    }
  },
  created() {
    this.getPie() // 支付饼图数据
  },
  methods: {
    getPie() {
      this.$request.volumeStatistics().then(res => {
        if (res.ret) {
          this.pieOrderData = res.data.pay_method
          this.orderRight.legend = {
            orient: 'vertical',
            left: 10,
            data: [
              this.$t('待支付'),
              this.$t('余额支付'),
              this.$t('支付宝转账'),
              this.$t('微信支付'),
              this.$t('30105'),
              this.$t('银行卡转账')
            ]
          }
          this.orderRight.series = [
            {
              name: '支付方式',
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
              }
            }
          ]
          this.myChart.setOption(this.orderRight)
        }
      })
    }
  },
  mounted() {
    // 订单饼图
    this.myChart = echarts.init(document.getElementById('charts'))
    window.onresize = this.myChart.resize
    this.orderRight = {
      backgroundColor: '#ffffff',
      color: ['#9969BD', '#6495F9', '#E96C5B', '#62DAAB', '#F6C022', '#74CBED'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      }
    }
  }
}
</script>

<style lang="scss">
.volume-echarts-container {
  .charts-right {
    display: inline-block;
    width: 45%;
    height: 300px;
  }
}
</style>
