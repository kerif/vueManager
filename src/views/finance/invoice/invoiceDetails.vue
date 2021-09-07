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
                <span v-if="invoiceStatus.state === 1" class="col_red">{{ $t('待处理') }}</span>
                <span v-if="invoiceStatus.state === 2" class="col_green">{{ $t('已开票') }}</span>
                <span v-if="invoiceStatus.state === 3">{{ $t('已作废') }}</span>
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
        <div class="text" v-for="item in log" :key="item.id">
          {{ item.created_at }}&nbsp; {{ item.content }}&nbsp; {{ item.handler }}
        </div>
      </div>
      <h3>{{ $t('开票备注') }}</h3>
      <div class="remarks-card">
        <div class="condition" v-if="invoiceStatus.state === 1">{{ $t('该申请还未开票') }}</div>
        <div class="invoice-remark" v-if="invoiceStatus.state === 2">
          <div class="text">{{ $t('开票金额:') }}{{ invoiceStatus.money }}</div>
          <div class="text">{{ $t('发票号码:') }}{{ invoiceStatus.invoices_number }}</div>
          <div class="text">{{ $t('备注:') }}{{ invoiceStatus.remarks }}</div>
          <div class="screenshot">
            <span
              style="cursor: pointer"
              @click.stop="
                ;(imgSrc = `${$baseUrl.IMAGE_URL}${invoiceStatus.enclosure}`), (imgVisible = true)
              "
            >
              <img :src="`${$baseUrl.IMAGE_URL}${invoiceStatus.enclosure}`" style="width: 100px" />
            </span>
          </div>
        </div>
        <div class="invoice-remark" v-if="invoiceStatus.state === 3">
          <div class="text">{{ $t('备注:') }}</div>
          <div class="screenshot">
            <span
              style="cursor: pointer"
              @click.stop="
                ;(imgSrc = `${$baseUrl.IMAGE_URL}${invoiceStatus.enclosure}`), (imgVisible = true)
              "
            >
              <img :src="`${$baseUrl.IMAGE_URL}${invoiceStatus.enclosure}`" style="width: 100px" />
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="clearfix">
      <h3>{{ $t('开票明细') }}</h3>
      <el-card class="detail-card" shadow="never">
        <el-row :gutter="20">
          <!-- 订单金额¥ -->
          <el-col :span="5">
            <span class="withdrawal">{{ $t('订单金额¥') }}</span>
            <span class="withdrawal_amount">{{ invoiceStatus.money }}</span>
          </el-col>
          <!-- 添加明细 -->
          <el-col :span="2" :offset="17">
            <el-button
              type="success"
              v-if="invoiceStatus.state === 1 || invoiceStatus.state === 2"
              size="small"
              @click="addTable"
              plain
              >{{ $t('添加明细') }}</el-button
            >
          </el-col>
        </el-row>
        <div class="text">
          <!-- 表格 -->
          <el-table border :data="costData" style="width: 100%">
            <el-table-column type="index" :label="$t('#')" width="100"> </el-table-column>
            <el-table-column prop="service_name" :label="$t('服务名称')" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.service_name"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" :label="$t('数量')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.quantity"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="unit_price" :label="$t('单价（¥）')" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.unit_price"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="money" :label="$t('金额（¥）')" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.money"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="tax_rate" :label="$t('税率（%）')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.tax_rate"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="taxes" :label="$t('税款（¥）')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.taxes"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('操作')">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  plain
                  size="mini"
                  @click="deleteTrack(scope.$index, costData)"
                  >{{ $t('删除') }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="total">
            <tr>
              <td>合计金额:¥{{ sumAmount.toFixed(2) }}</td>
              <td></td>
              <td>合计税款:¥{{ sumTaxes.toFixed(2) }}</td>
              <td>小计:¥{{ (sumAmount + sumTaxes).toFixed(2) }}</td>
            </tr>
          </div>
        </div>
      </el-card>
      <el-row class="auditStatus" v-if="invoiceStatus.state === 1">
        <el-button type="danger" @click="invoiceToVoid('void')">{{ $t('作废申请') }}</el-button>
        <el-button type="primary" @click="invoiceToComplete('complete')">{{
          $t('开票完成')
        }}</el-button>
      </el-row>
      <el-row class="auditStatus" v-else-if="invoiceStatus.state === 2">
        <el-button type="primary" @click="invoiceToReopen('reopen')">{{
          $t('重开发票')
        }}</el-button>
      </el-row>
      <el-row class="auditStatus" v-else>
        <el-button type="primary" @click="recovery">{{ $t('恢复申请') }}</el-button>
      </el-row>
    </div>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      invoiceStatus: {},
      costData: [],
      log: [],
      imgVisible: false,
      imgSrc: '',
      detailed: '',
      taxes: '',
      amount: '',
      subtotal: '',
      total: '',
      order_id: '',
      invoices_id: ''
    }
  },
  created() {
    this.getInvoiceDetail()
  },
  computed: {
    sumAmount() {
      return this.costData.map(item => item.money).reduce((acc, cur) => parseFloat(cur) + acc, 0)
    },
    sumTaxes() {
      return this.costData.map(item => item.taxes).reduce((acc, cur) => parseFloat(cur) + acc, 0)
    }
  },
  methods: {
    getInvoiceDetail() {
      this.$request.invoiceDetail(this.$route.params.id).then(res => {
        console.log(res)
        if (res.ret) {
          this.invoiceStatus = res.data
          this.costData = res.data.orderCostDetailed
          this.log = res.data.log
        }
      })
    },
    invoiceToComplete(state) {
      dialog(
        {
          type: 'toAddInvoicing',
          id: this.$route.params.id,
          state: state,
          detailed: this.costData,
          taxes: this.sumTaxes,
          amount: this.sumAmount,
          subtotal: this.sumTaxes + this.sumAmount,
          total: this.sumTaxes + this.sumAmount,
          order_id: this.invoiceStatus.order_id,
          invoices_id: this.$route.params.id
        },
        () => {
          this.getInvoiceDetail()
          this.$router.go(-1)
        }
      )
    },
    invoiceToVoid(state) {
      dialog(
        {
          type: 'toAddInvoicing',
          id: this.$route.params.id,
          state: state,
          detailed: this.costData,
          taxes: this.sumTaxes,
          amount: this.sumAmount,
          subtotal: this.sumTaxes + this.sumAmount,
          total: this.sumTaxes + this.sumAmount,
          order_id: this.invoiceStatus.order_id,
          invoices_id: this.$route.params.id
        },
        () => {
          this.getInvoiceDetail()
          this.$router.go(-1)
        }
      )
    },
    invoiceToReopen(state) {
      dialog(
        {
          type: 'toAddInvoicing',
          id: this.$route.params.id,
          state: state,
          detailed: this.costData,
          taxes: this.sumTaxes,
          amount: this.sumAmount,
          subtotal: this.sumTaxes + this.sumAmount,
          total: this.sumTaxes + this.sumAmount,
          order_id: this.invoiceStatus.order_id,
          invoices_id: this.$route.params.id
        },
        () => {
          this.getInvoiceDetail()
          this.$router.go(-1)
        }
      )
    },
    addTable() {
      this.costData.push({ money: 0, taxes: 0 })
    },
    deleteTrack(index, rows) {
      rows.splice(index, 1)
    },
    recovery() {
      this.$confirm(this.$t('您确认要恢复该开票申请吗？'), this.$t('恢复申请'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .invoiceRecovery(this.$route.params.id, {
            detailed: this.costData,
            taxes: this.sumTaxes,
            amount: this.sumAmount,
            subtotal: this.sumTaxes + this.sumAmount,
            total: this.sumTaxes + this.sumAmount,
            order_id: this.invoiceStatus.order_id,
            invoices_id: this.$route.params.id
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.$router.go(-1)
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      })
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
        padding: 15px 20px;
        overflow: auto;
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
      .invoice-remark {
        overflow: auto;
      }
      .text {
        padding: 5px 20px;
      }
      .screenshot {
        width: 100px;
        height: 80px;
        margin: 10px 20px;
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
        /deep/.el-input__inner {
          border: 1px solid #fff;
        }
        .total {
          float: right;
          width: 906px;
          height: 40px;
          line-height: 40px;
          border: 1px solid #ecedf0;
          border-top: none;
          box-sizing: border-box;
          tr {
            display: flex;
            td {
              flex: 1;
            }
          }
        }
      }
      .confirm_amount {
        color: blue;
        font-size: 24px;
        font-weight: bold;
      }
      /deep/.el-table th > .cell {
        text-align: center;
      }
      /deep/.el-table .cell {
        text-align: center;
      }
    }
    .auditStatus {
      margin-top: 40px;
      text-align: center;
    }
  }
  .col_red {
    color: red;
  }
  .col_green {
    color: green;
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
}
</style>
