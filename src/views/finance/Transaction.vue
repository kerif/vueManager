<template>
  <div class="transaction-list-container">
    <div class="order-list-search" v-show="hasFilterCondition">
      <el-date-picker
        size="mini"
        class="timeStyle"
        v-model="timeList"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :range-separator="$t('至')"
        :start-placeholder="$t('开始日期')"
        :end-placeholder="$t('结束日期')"
      >
      </el-date-picker>
      <el-select v-model="line" size="mini" clearable :placeholder="$t('路线筛选')">
        <el-option v-for="item in linesChange" :key="item.id" :value="item.id" :label="item.name">
        </el-option>
      </el-select>
      <el-select
        v-model="type"
        size="mini"
        clearable
        class="changeVou"
        :placeholder="$t('支付类型')"
      >
        <el-option v-for="item in voucherChange" :key="item.id" :value="item.id" :label="item.name">
        </el-option>
      </el-select>
      <el-select
        v-model="record"
        size="mini"
        clearable
        class="changeVou"
        :placeholder="$t('交易类型')"
      >
        <el-option v-for="item in recordChange" :key="item.id" :value="item.id" :label="item.name">
        </el-option>
      </el-select>
      <div class="submit">
        <el-button type="primary" plain size="small" @click="submitForm">{{
          $t('搜索')
        }}</el-button>
        <el-button size="small" @click="resetForm">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div class="searchGroup">
      <el-button type="success" plain size="small" class="searchGroup-btn-r" @click="uploadList">{{
        $t('导出清单')
      }}</el-button>
      <div class="searcg-l">
        <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
        <div class="filter">
          <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
            >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
          ></el-button>
        </div>
      </div>
    </div>
    <div style="height: calc(100vh - 270px)">
      <el-table
        :data="transactionList"
        stripe
        border
        class="data-list"
        v-loading="tableLoading"
        height="calc(100vh - 270px)"
        ref="table"
      >
        <el-table-column type="index" :index="1"></el-table-column>
        <!-- 客户ID -->
        <el-table-column :label="$t('客户ID')" prop="user_id"></el-table-column>
        <!-- 用户名 -->
        <el-table-column :label="$t('用户名')" prop="user_name"></el-table-column>
        <!-- 类型 -->
        <el-table-column :label="$t('类型')">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">{{ $t('消费') }}</span>
            <span v-if="scope.row.type === 2">{{ $t('充值') }}</span>
            <span v-if="scope.row.type === 3">{{ $t('退款') }}</span>
            <span v-if="scope.row.type === 4">{{ $t('提现') }}</span>
            <span v-if="scope.row.type === 5">{{ $t('扣款') }}</span>
            <span v-if="scope.row.type === 6">{{ $t('充值赠送') }}</span>
            <span v-if="scope.row.type === 7">{{ $t('补款') }}</span>
          </template>
        </el-table-column>
        <!-- 支付类型 -->
        <el-table-column :label="$t('支付类型')" prop="payment_type_name"> </el-table-column>
        <!-- 应付金额¥ -->
        <el-table-column
          :label="$t('应付金额') + this.localization.currency_unit"
          prop="order_amount"
          width="105"
          align="right"
        ></el-table-column>
        <!-- 抵用券金额¥ -->
        <el-table-column
          :label="$t('抵用券金额') + this.localization.currency_unit"
          prop="coupon_amount"
          width="105"
          align="right"
        ></el-table-column>
        <!-- 积分抵扣金额 -->
        <el-table-column
          :label="$t('积分抵扣金额') + this.localization.currency_unit"
          prop="point_amount"
          width="115"
          align="right"
        ></el-table-column>
        <!-- 支付金额¥ -->
        <el-table-column
          :label="$t('支付金额') + this.localization.currency_unit"
          width="105"
          align="right"
        >
          <template slot-scope="scope">
            <span style="color: red">{{ scope.row.pay_amount }}</span>
            <span v-if="scope.row.show_rate == true">
              （{{ scope.row.currency_code }}&nbsp;{{ scope.row.currency_symbol }}&nbsp;{{
                scope.row.rate_amount
              }}）
            </span>
          </template>
        </el-table-column>
        <!-- 相关订单 -->
        <el-table-column :label="$t('相关订单')" prop="order_sn" width="205"></el-table-column>
        <!-- 流水号 -->
        <el-table-column :label="$t('流水号')" prop="serial_no" width="205"></el-table-column>
        <!-- 外部交易号 -->
        <el-table-column :label="$t('外部交易号')" prop="outer_sn" width="255"></el-table-column>
        <!-- 支付时间 -->
        <el-table-column :label="$t('支付时间')" prop="created_at" width="155"></el-table-column>
        <el-table-column :label="$t('操作')" fixed="right">
          <template slot-scope="scope">
            <el-button class="btn-deep-purple" @click="details(scope.row.id)">{{
              $t('详情')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <nle-pagination
      style="margin-top: 5px"
      :pageParams="page_params"
      :notNeedInitQuery="false"
    ></nle-pagination>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      transactionList: [],
      localization: {},
      tableLoading: false,
      timeList: [],
      begin_date: '',
      end_date: '',
      type: '',
      line: '',
      record: '',
      voucherChange: [],
      recordChange: [],
      linesChange: [],
      hasFilterCondition: false
    }
  },
  mixins: [pagination],
  name: 'transaction',
  components: {
    SearchGroup,
    NlePagination
  },
  created() {
    this.getList()
    this.getTypes()
    this.getRecord()
    this.getLines()
    if (this.$route.query.serial_number) {
      this.page_params.keyword = this.$route.query.serial_number
    }
    if (this.$route.query.times) {
      this.timeList = this.$route.query.times.split(' ')
      this.begin_date = this.timeList[0]
      this.end_date = this.timeList[1]
    }
  },
  mounted() {
    // this.getList()
    // this.getTypes()
    // this.getRecord()
    // this.getLines()
  },
  methods: {
    getList() {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        payment_type: this.type,
        express_line_id: this.line,
        type: this.record
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getTransaction(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.transactionList = res.data
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.$nextTick(() => {
            this.$refs.table.doLayout()
          })
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    onTime(val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      // this.getList()
    },
    // 详情
    details(id) {
      this.$router.push({ name: 'wechatPay', query: { id } })
    },
    // 选择不同类型优惠券
    onVocherTypeChange() {
      this.page_params.handleQueryChange('type', this.type)
      // this.getList()
    },
    // 选择不同类型优惠券
    onRecordTypeChange() {
      this.page_params.handleQueryChange('record', this.record)
      this.getList()
    },
    // 选择不同类型路线
    onLineTypeChange() {
      this.page_params.handleQueryChange('line', this.line)
      this.getList()
    },
    // 获取支付类型
    getTypes() {
      this.$request.getPaymentType().then(res => {
        if (res.ret) {
          this.voucherChange = res.data
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 获取交易类型
    getRecord() {
      this.$request.getRecordType().then(res => {
        if (res.ret) {
          this.recordChange = res.data
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 获取路线筛选
    getLines() {
      this.$request.getSimpleLines().then(res => {
        if (res.ret) {
          this.linesChange = res.data
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 导出Excel
    uploadList() {
      let params = {
        payment_type: this.type,
        express_line_id: this.line,
        type: this.record
      }
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.transactionExcel(params).then(res => {
        if (res.ret) {
          // this.urlExcel = res.data.url
          // window.open(this.urlExcel)
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 重置表单
    resetForm() {
      this.timeList = []
      this.line = ''
      this.type = ''
      this.record = ''
    },
    // 提交表单
    submitForm() {
      this.onTime(this.timeList)
      this.onLineTypeChange()
      this.onVocherTypeChange()
    }
  }
}
</script>
<style lang="scss">
.transaction-list-container {
  .changeVou {
    margin-left: 10px;
  }
  .timeStyle {
    margin-right: 10px;
    width: 276px !important;
  }
  .upload-sty {
    // margin-left: 10px;
  }
  .searchGroup {
    // padding: 10px 0;
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
    justify-content: space-between;
    .search-group {
      width: 22.5%;
    }
    .searcg-l {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .filter {
        margin-left: 10px;
      }
    }
    .searchGroup-btn-r {
      align-self: flex-start;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .order-list-search {
    font-size: 14px;
    background: #fff;
    margin: 10px 0;
    padding: 10px;
    overflow: hidden;
    .changeTime {
      display: inline-block;
      margin-right: 20px;
      .timeStyle {
        margin-right: 10px;
        width: 276px !important;
      }
      .shipments {
        display: inline-block;
      }
    }
    .chooseStatus {
      // width: 150px;
      display: inline-block;
    }
    .submit {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 10px;
    }
  }
}
</style>
