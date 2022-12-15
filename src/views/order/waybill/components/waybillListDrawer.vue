<template>
  <el-drawer
    :visible.sync="showDrawer"
    class="volume-echarts-container"
    :size="size"
    :before-close="close"
    @opened="open()"
  >
    <div style="padding-left: 20px">
      <h3>{{ $t('货量统计') }}</h3>
      <el-row :gutter="20">
        <el-col :span="14" style="height: 100%">
          <div>{{ $t('根据列表筛选条件') }}</div>
          <div style="margin-top: 5px">
            <el-tag v-for="(item, index) in arr" :key="index">
              <span>{{ item }}</span>
            </el-tag>
          </div>
          <div style="margin-top: 60px">{{ $t('线路统计') }}</div>
          <el-table :data="linesData" border style="width: 100%">
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column prop="express_line_id_name" :label="$t('线路名称')" width="160">
            </el-table-column>
            <el-table-column prop="percent" :label="$t('渠道占比')"> </el-table-column>
            <el-table-column prop="package_count" :label="$t('包裹总数')"> </el-table-column>
            <el-table-column prop="order_count" :label="$t('订单总数')"> </el-table-column>
            <el-table-column prop="box_count" :label="$t('箱总数')"> </el-table-column>
            <el-table-column prop="payment_weight" :label="$t('计费重量')"> </el-table-column>
            <el-table-column prop="value" :label="$t('申报总值')"> </el-table-column>
            <el-table-column
              prop="actual_payment_fee"
              :label="$t('应付费用总计')"
            ></el-table-column>
          </el-table>
          <div class="total">
            <tr>
              <td></td>
              <td>{{ $t('总计') }}</td>
              <td></td>
              <td>{{ packageTotal }}</td>
              <td class="order-sty">{{ orderTotal }}</td>
              <td>{{ boxTotal }}</td>
              <td class="pay-sty">{{ paymentWeight.toFixed(2) }}</td>
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
      linesData: [],
      pieOrderData: [],
      pieDestinationData: [],
      time: '',
      price: '',
      startDate: '',
      endDate: '',
      payStatus: '',
      arr: [],
      line: '',
      payMethods: '',
      warehouse: '',
      agent: '',
      receiveType: '',
      begin: '',
      end: '',
      size: '90%',
      timeOptions: [
        { value: 'created_at', name: this.$t('订单提交时间') },
        { value: 'packed_at', name: this.$t('打包称重时间') },
        { value: 'paid_at', name: this.$t('支付时间') },
        { value: 'shipped_at', name: this.$t('发货时间') },
        { value: 'signed_at', name: this.$t('签收时间') }
      ],
      priceRangeOptions: [
        { value: 'actual_payment_fee', name: this.$t('应付总费用') },
        { value: 'actual_pay', name: this.$t('实际支付') },
        { value: 'declare_value', name: this.$t('申报价值') }
      ],
      receiverOptions: [
        { value: 1, name: this.$t('自提') },
        { value: 2, name: this.$t('非自提') }
      ],
      paymentStatusData: [
        {
          id: 1,
          name: this.$t('全部货到付款')
        },
        {
          id: 2,
          name: this.$t('未支付')
        },
        {
          id: 3,
          name: this.$t('已支付')
        },
        {
          id: 11,
          name: this.$t('待审核')
        },
        {
          id: 12,
          name: this.$t('审核拒绝')
        }
      ]
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
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    open() {
      this.myChart = echarts.init(document.getElementById('chartsFirst'))
      this.myDestinationChart = echarts.init(document.getElementById('chartsSecond'))
      this.getPie() // 支付方式饼图数据
    },
    close() {
      this.$emit('receive', false)
    },
    getPie() {
      this.arr = []
      const searchData = this.searchFieldData
      // 时间
      this.time = this.timeOptions
        .filter(item => item.value === this.searchFieldData.date_type)
        .map(item => item.name)[0]
      if (this.searchFieldData.date) {
        this.startDate = this.searchFieldData.date[0]
        this.endDate = this.searchFieldData.date[1]
      }
      if (this.time && this.startDate && this.endDate) {
        this.arr.push(
          this.time +
            ':' +
            this.startDate.split('-').join('') +
            '-' +
            this.endDate.split('-').join('')
        )
      }
      // 价格区间 起使价格 结束价格
      this.price = this.priceRangeOptions
        .filter(item => item.value === this.searchFieldData.value_type)
        .map(item => item.name)
      this.begin = this.searchFieldData.value_begin
      this.end = this.searchFieldData.value_end
      if (this.price && this.begin && this.end) {
        this.arr.push(this.price + ':' + this.begin + '-' + this.end)
      }
      // 收获方式
      this.receiveType = this.receiverOptions
        .filter(item => item.value === this.searchFieldData.receive_type)
        .map(item => item.name)[0]
      if (this.receiveType) {
        let receiveName = '收获方式'
        this.arr.push(receiveName + ':' + this.receiveType)
      }
      // 支付状态
      this.payStatus = this.paymentStatusData
        .filter(item => item.id === this.searchFieldData.pay_delivery)
        .map(item => item.name)[0]
      if (this.payStatus) {
        this.arr.push(this.payStatus)
      }
      //线路
      if (this.tag.lineData) {
        this.line = this.tag.lineData
          .filter(item => item.id === this.searchFieldData.express_line_id)
          .map(item => item.name)[0]
        if (this.line) {
          let lineName = '线路名称'
          this.arr.push(lineName + ':' + this.line)
        }
      }
      // 支付方式
      if (this.tag.paymentData) {
        this.payMethods = this.tag.paymentData
          .filter(item => item.id === this.searchFieldData.payment_type)
          .map(item => item.name)[0]
        if (this.payMethods) {
          let payName = '支付方式'
          this.arr.push(payName + ':' + this.payMethods)
        }
      }
      //仓库
      if (this.tag.wareHouseList) {
        this.warehouse = this.tag.wareHouseList
          .filter(item => item.id === this.searchFieldData.warehouse)
          .map(item => item.warehouse_name)[0]
        if (this.warehouse) {
          this.arr.push(this.warehouse)
        }
      }
      // 代理
      if (this.tag.agentData) {
        this.agent = this.tag.agentData
          .filter(item => item.user_id.toString() === this.searchFieldData.agent)
          .map(item => item.agent_name)[0]
        if (this.agent) {
          this.arr.push(this.agent)
        }
      }
      if (this.tag.countryName) {
        if (this.tag.countryName.length === 3) {
          this.arr.push(this.tag.countryName[2])
        }
        if (this.tag.countryName.length === 1) {
          this.arr.push(this.tag.countryName[0])
        }
      }
      let params = {
        ...this.searchFieldData,
        status: this.activeName,
        begin_date: searchData.date ? searchData.date[0] : '',
        end_date: searchData.date ? searchData.date[1] : '',
        order_sn: searchData.order_sn.split(/[(\r\n)\r\n]+/),
        country_id:
          searchData.countryArr.length > 1
            ? searchData.countryArr[0]
            : searchData.countryArr[searchData.countryArr.length - 1]
      }
      this.$request.volumeStatistics(params).then(res => {
        if (res.ret) {
          this.linesData = res.data.line
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
      return this.linesData
        .map(item => item.package_count)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
    },
    orderTotal() {
      return this.linesData
        .map(item => item.order_count)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
    },
    boxTotal() {
      return this.linesData
        .map(item => item.box_count)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
    },
    paymentWeight() {
      return this.linesData
        .map(item => item.payment_weight)
        .reduce((acc, cur) => parseFloat(cur) + acc, 0)
    },
    value() {
      return this.linesData.map(item => item.value).reduce((acc, cur) => parseFloat(cur) + acc, 0)
    },
    paymentTotal() {
      return this.linesData
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
  ::v-deep.el-drawer__open .el-drawer.rtl {
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
  .el-tag {
    margin-right: 10px;
    margin-top: 10px;
  }
}
</style>
