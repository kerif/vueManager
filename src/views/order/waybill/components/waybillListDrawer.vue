<template>
  <el-drawer
    :visible.sync="showDrawer"
    class="volume-echarts-container"
    :before-close="close"
    @opened="open()"
  >
    <div style="padding-left: 20px">
      <h3>{{ $t('货量统计') }}</h3>
      <el-row :gutter="20">
        <el-col :span="14" style="height: 100%">
          <div>{{ $t('(根据列表筛选条件)') }}</div>
          <div style="margin-top: 5px">
            <el-tag v-for="(item, index) in tag" :key="index">{{ item }}</el-tag>
          </div>
          <div style="margin-top: 60px">{{ $t('线路统计') }}</div>
          <el-table :data="lineData" border style="width: 100%">
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column prop="express_line_id_name" :label="$t('线路名称')" width="160">
            </el-table-column>
            <el-table-column prop="percent" :label="$t('渠道占比')"> </el-table-column>
            <el-table-column prop="package_count" :label="$t('包裹总数')"> </el-table-column>
            <el-table-column prop="order_count" :label="$t('订单总数')"> </el-table-column>
            <el-table-column prop="box_count" :label="$t('箱总数')"> </el-table-column>
            <el-table-column prop="payment_weight" :label="$t('计费重量')"> </el-table-column>
            <el-table-column prop="value" :label="$t('申报总值')"> </el-table-column>
            <el-table-column prop="actual_payment_fee" :label="$t('实付总计')"> </el-table-column>
          </el-table>
          <div class="total">
            <tr>
              <td></td>
              <td>{{ $t('总计') }}</td>
              <td></td>
              <td>{{ packageTotal }}</td>
              <td class="order-sty">{{ orderTotal }}</td>
              <td>{{ boxTotal }}</td>
              <td class="pay-sty">{{ parseInt(paymentWeight) }}</td>
              <td>{{ value.toFixed(2) }}</td>
              <td class="total-sty">{{ paymentTotal.toFixed(2) }}</td>
            </tr>
          </div>
        </el-col>
        <el-col :span="10" style="height: 100%" class="pie">
          <h3>{{ $t('支付方式') }}</h3>
          <div class="charts-top" id="chartsFirst"></div>
          <h3>{{ $t('目的地') }}</h3>
          <div class="charts-bottom" id="chartsSecond"></div>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
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
      lineData: [],
      pieOrderData: [],
      pieDestinationData: []
    }
  },
  props: {
    showDrawer: {
      type: Boolean,
      default: false
    },
    searchFieldData: {
      type: Object
    },
    activeName: {
      type: String
    },
    tag: {
      type: Array
    }
  },
  methods: {
    open() {
      this.myChart = echarts.init(document.getElementById('chartsFirst'))
      this.myDestinationChart = echarts.init(document.getElementById('chartsSecond'))
      this.getPie() // 支付方式饼图数据
      console.log(this.tag)
    },
    close() {
      this.$emit('receive', false)
    },
    getPie() {
      const searchData = this.searchFieldData
      let params = {
        ...this.searchFieldData,
        status: this.activeName,
        begin_date: searchData.date ? searchData.date[0] : '',
        end_date: searchData.date ? searchData.date[1] : '',
        country_id:
          searchData.countryArr.length > 1
            ? searchData.countryArr[0]
            : searchData.countryArr[searchData.countryArr.length - 1]
      }
      this.$request.volumeStatistics(params).then(res => {
        if (res.ret) {
          this.lineData = res.data.line
          this.pieOrderData = res.data.pay_method
          const arr = this.pieOrderData.map(item => {
            return {
              value: item.order_count,
              name: item.pay_name
            }
          })
          this.pieDestinationData = res.data.destination
          const arr1 = this.pieDestinationData.map(item => {
            return {
              value: item.order_count,
              name: item.country_name
            }
          })
          this.orderTop.series = [
            {
              name: '目的地',
              type: 'pie',
              minAngle: 5,
              avoidLabelOverlap: true,
              radius: ['30%', '70%'],
              center: ['65%', '50%'],
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
              data: arr1
            }
          ]
          this.orderRight.series = [
            {
              name: '支付方式',
              type: 'pie',
              minAngle: 5,
              avoidLabelOverlap: true,
              radius: ['30%', '70%'],
              center: ['65%', '60%'],
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
          this.myDestinationChart.setOption(this.orderTop)
        }
      })
    }
  },
  mounted() {
    // 支付方式饼图
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
  },
  computed: {
    packageTotal() {
      return this.lineData
        .map(item => item.package_count)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
    },
    orderTotal() {
      return this.lineData
        .map(item => item.order_count)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
    },
    boxTotal() {
      return this.lineData
        .map(item => item.box_count)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
    },
    paymentWeight() {
      return this.lineData
        .map(item => item.payment_weight)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
    },
    value() {
      return this.lineData.map(item => item.value).reduce((acc, cur) => parseFloat(cur) + acc, 0)
    },
    paymentTotal() {
      return this.lineData
        .map(item => item.actual_payment_fee)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
    }
  }
}
</script>

<style lang="scss">
.volume-echarts-container {
  padding: 0 0 0 10px;
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
  /deep/.el-drawer__open .el-drawer.rtl {
    width: 90% !important;
  }
  .el-drawer.rtl {
    overflow: scroll;
  }
  .el-drawer__header {
    margin-bottom: 0;
  }
  .pie {
    padding-left: 80px !important;
  }
  .total {
    height: 40px;
    line-height: 40px;
    tr {
      display: flex;
      td {
        flex: 1;
        text-align: center;
      }
    }
  }
  .order-sty {
    color: #006400;
  }
  .pay-sty {
    color: #3540a5;
  }
  .total-sty {
    color: #dc143c;
  }
}
</style>
