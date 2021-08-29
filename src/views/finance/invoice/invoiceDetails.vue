<template>
  <div class="invoiceDetails-container">
    <div class="leftSide">
      <h3>{{ $t('客户信息') }}</h3>
      <div class="box-card">
        <div class="leftInfo">
          <el-row :gutter="20">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('客户ID') }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp;
              <span
                ><i class="idNum">{{ invoiceStatus.user_id }}</i
                >&nbsp;&nbsp;&nbsp;{{ invoiceStatus.user_name }}</span
              >
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('订单号') }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp;
              <span>{{ invoiceStatus.order_id }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('订单状态') }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp;
              <span>{{ invoiceStatus.order_status }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="rightInfo">
          <template>
            <h1 class="review_color">
              <template>
                <span v-if="invoiceStatus.state === 1">{{ $t('待处理') }}</span>
                <span v-if="invoiceStatus.state === 2">{{ $t('申请通过') }}</span>
                <span v-if="invoiceStatus.state === 3">{{ $t('作废发票') }}</span>
              </template>
            </h1>
          </template>
        </div>
      </div>
      <h3>{{ $t('开票信息') }}</h3>
      <div class="info-card">
        <el-row :gutter="20">
          <!-- 发票类型 -->
          <el-col :span="8">
            <span class="withdrawal">{{ $t('发票类型') }}</span>
            <span class="bank">
              <template>
                <span v-if="invoiceStatus.type === 1">{{ $t('普通纸质发票') }}</span>
              </template>
            </span>
          </el-col>
          <!-- 抬头类型 -->
          <el-col :span="8" :offset="4">
            <span class="withdrawal">{{ $t('抬头类型') }}</span>
            <span>
              <template>
                <span v-if="invoiceStatus.invoice_type === 1">{{ $t('个人') }}</span>
                <span v-if="invoiceStatus.invoice_type === 2">{{ $t('企业') }}</span>
              </template>
            </span>
          </el-col>
        </el-row>
        <div class="main">
          <div class="leftBank">
            <el-row :gutter="20">
              <!-- 发票抬头 -->
              <el-col :span="24">
                <span class="withdrawal">{{ $t('发票抬头') }}</span>
                <span>{{ invoiceStatus.title }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- 税号 -->
              <el-col :span="24">
                <span class="withdrawal">{{ $t('税号') }}</span>
                <span>{{ invoiceStatus.duty_paragraph }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- 开户银行 -->
              <el-col :span="24">
                <span class="withdrawal">{{ $t('开户银行') }}</span>
                <span>{{ invoiceStatus.bank_name }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- 银行账号 -->
              <el-col :span="24">
                <span class="withdrawal">{{ $t('银行账号') }}</span>
                <span>{{ invoiceStatus.bank_account }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- 企业地址 -->
              <el-col :span="24">
                <span class="withdrawal">{{ $t('企业地址') }}</span>
                <span>{{ invoiceStatus.company_address }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- 企业电话 -->
              <el-col :span="24">
                <span class="withdrawal">{{ $t('企业电话') }}</span>
                <span>{{ invoiceStatus.company_tel }}</span>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="rightSide">
      <h3>{{ $t('日志') }}</h3>
      <div class="daily-card">
        <div class="text">2021-08-01&nbsp; 12:00:00&nbsp; 提交申请&nbsp; 100392</div>
      </div>
      <h3>{{ $t('审核备注') }}</h3>
      <div class="remarks-card">
        <div class="condition">{{ invoiceStatus.remarks }}</div>
      </div>
    </div>
    <div class="clearfix">
      <h3>{{ $t('开票明细') }}</h3>
      <el-card class="detail-card" shadow="never">
        <el-row :gutter="20">
          <!-- 订单金额¥ -->
          <el-col :span="5">
            <span class="withdrawal">{{ $t('订单金额¥') }}</span>
            <span class="withdrawal_amount"></span>
          </el-col>
          <!-- 添加明细 -->
          <el-col :span="2" :offset="17">
            <el-button type="success" size="small" plain>{{ $t('添加明细') }}</el-button>
          </el-col>
        </el-row>
        <div class="text">
          <!-- 表格 -->
          <el-table
            border
            show-summary
            :data="costData"
            style="width: 100%"
            :summary-method="getSummaries"
          >
            <el-table-column type="index" :label="$t('#')" width="100"> </el-table-column>
            <el-table-column prop="service_name" :label="$t('服务名称')" width="180">
            </el-table-column>
            <el-table-column prop="quantity" :label="$t('数量')"> </el-table-column>
            <el-table-column prop="unit_price" :label="$t('单价（¥）')" width="180">
            </el-table-column>
            <el-table-column prop="money" :label="$t('金额（¥）')" width="180"> </el-table-column>
            <el-table-column prop="tax_rate" :label="$t('税率（%）')"> </el-table-column>
            <el-table-column prop="taxes" :label="$t('税款（¥）')"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="success" plain size="mini" @click="editDetail(scope.row.id)">{{
                  $t('删除')
                }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-row class="auditStatus" v-if="invoiceStatus.state === 1">
        <el-button type="danger">{{ $t('作废申请') }}</el-button>
        <el-button type="primary" @click="invoiceComplete">{{ $t('开票完成') }}</el-button>
      </el-row>
      <el-row class="auditStatus" v-if="invoiceStatus.state === 2">
        <el-button type="primary">{{ $t('重开发票') }}</el-button>
      </el-row>
      <el-row class="auditStatus" v-if="invoiceStatus.state === 3">
        <el-button type="primary">{{ $t('恢复申请') }}</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      invoiceStatus: {},
      costData: [],
      imgVisible: false,
      imgSrc: ''
    }
  },
  created() {
    this.getInvoiceDetail()
  },
  methods: {
    getInvoiceDetail() {
      this.$request.invoiceDetail(this.$route.params.id).then(res => {
        console.log(res)
        if (res.ret) {
          this.invoiceStatus = res.data
          this.costData = res.data.orderCostDetailed
        }
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      var amount, tax
      columns.forEach((column, index) => {
        if (index === 2 || index === 3 || index === 5) {
          sums[index] = ''
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
          if (index === 4) {
            sums[index] = '合计金额:' + '￥' + sums[index]
            return amount
          }
          if (index === 6) {
            sums[index] = '合计税款:' + '￥' + sums[index]
            return tax
          }
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    invoiceComplete() {
      dialog(
        {
          type: 'toAddInvoicing',
          state: 'pass'
        },
        () => {
          this.$router.go(-1)
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.invoiceDetails-container {
  .leftSide {
    float: left;
    width: 75%;
    .box-card {
      display: flex;
      font-size: 14px;
      padding: 15px 40px;
      background-color: #fff;
      .leftInfo {
        flex: 1;
        .el-row {
          margin-bottom: 20px;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .leftWidth {
          width: 100px;
        }
        .idNum {
          color: blue;
          font-style: normal;
        }
      }
      .rightInfo {
        display: flex;
        width: 150px;
        justify-content: center;
        align-items: center;
        .review_color {
          color: red;
        }
        .reject_color {
          color: red;
        }
        .pass_color {
          color: green;
        }
      }
    }
    .info-card {
      font-size: 14px;
      padding: 15px 40px;
      background-color: #fff;
      .el-row {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .withdrawal {
        display: inline-block;
        width: 100px;
      }
      .bank {
        color: blue;
      }
      .main {
        display: flex;
        padding: 5px;
        border: 2px dashed #ccc;
        .leftBank {
          flex: 1;
        }
      }
    }
  }
  .rightSide {
    float: right;
    width: 23%;
    .daily-card {
      height: 126px;
      font-size: 14px;
      overflow: auto;
      background-color: #fff;
      .text {
        padding: 15px 40px;
      }
    }
    .remarks-card {
      height: 257px;
      font-size: 14px;
      overflow: auto;
      background-color: #fff;
      padding: 20px 0px;
      .condition {
        text-align: center;
      }
      .text {
        padding: 5px 40px;
      }
      .screenshot {
        width: 260px;
        height: 180px;
        margin: 0 auto;
        background-color: #ccc;
      }
    }
  }
  .clearfix {
    clear: both;
    h3 {
      padding-top: 15px;
    }
    .detail-card {
      font-size: 14px;
      padding: 15px;
      .el-table tr th.is-leaf {
        border-bottom: 1px #ecedf0 solid;
        background-color: #fff;
      }
      .withdrawal {
        display: inline-block;
        width: 100px;
      }
      .withdrawal_amount {
        color: red;
        font-size: 24px;
        font-weight: bold;
      }
      .text {
        margin-top: 10px;
      }
      .confirm_amount {
        color: blue;
        font-size: 24px;
        font-weight: bold;
      }
      .el-table th > .cell {
        text-align: center;
      }
      .el-table .cell {
        text-align: center;
      }
    }
    .auditStatus {
      margin-top: 40px;
      text-align: center;
    }
  }
}
</style>
