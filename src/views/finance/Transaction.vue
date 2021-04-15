<template>
  <div class="transaction-list-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
        <el-date-picker
          class="timeStyle"
          v-model="timeList"
          type="daterange"
          @change="onTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')">
       </el-date-picker>
      <el-select v-model="line" @change="onLineTypeChange" clearable :placeholder="$t('路线筛选')">
        <el-option
          v-for="item in linesChange"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </el-option>
       </el-select>
      <el-select v-model="type" @change="onVocherTypeChange" clearable class="changeVou" :placeholder="$t('支付类型')">
        <el-option
          v-for="item in voucherChange"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </el-option>
       </el-select>
      <el-select v-model="record" @change="onRecordTypeChange" clearable class="changeVou" :placeholder="$t('交易类型')">
        <el-option
          v-for="item in recordChange"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </el-option>
       </el-select>
        <el-button class="upload-sty" @click="uploadList">{{$t('导出Excel')}}</el-button>
      </search-group>
    </div>
    <el-table :data="transactionList" stripe border class="data-list"
    v-loading="tableLoading" height="650">
      <el-table-column type="index" :index="1"></el-table-column>
      <!-- 客户ID -->
      <el-table-column :label="$t('客户ID')" prop="user_id"></el-table-column>
      <!-- 类型 -->
      <el-table-column :label="$t('类型')">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">{{$t('消费')}}</span>
          <span v-if="scope.row.type === 2">{{$t('充值')}}</span>
          <span v-if="scope.row.type === 3">{{$t('退款')}}</span>
          <span v-if="scope.row.type === 4">{{$t('提现')}}</span>
          <span v-if="scope.row.type === 5">{{$t('扣款')}}</span>
        </template>
      </el-table-column>
      <!-- 支付类型 -->
      <el-table-column :label="$t('支付类型')" prop="payment_type_name"> </el-table-column>
      <!-- 支付方式 -->
      <!-- <el-table-column label="支付方式">
      </el-table-column> -->
      <!-- 应付金额¥ -->
      <el-table-column :label="$t('应付金额') + this.localization.currency_unit" prop="order_amount"></el-table-column>
      <!-- 抵用券金额¥ -->
      <el-table-column :label="$t('抵用券金额') + this.localization.currency_unit" prop="coupon_amount"></el-table-column>
      <!-- 支付金额¥ -->
      <el-table-column :label="$t('支付金额') + this.localization.currency_unit">
        <template slot-scope="scope">
          <span>{{scope.row.pay_amount}}</span>
          <span v-if="scope.row.show_rate == true">
            （{{scope.row.currency_code}}&nbsp;{{scope.row.currency_symbol}}&nbsp;{{scope.row.rate_amount}}）
          </span>
        </template>
      </el-table-column>
      <!-- 相关订单 -->
      <el-table-column :label="$t('相关订单')" prop="order_sn"></el-table-column>
      <!-- 流水号 -->
      <el-table-column :label="$t('流水号')" prop="serial_no"></el-table-column>
      <!-- 外部交易号 -->
      <el-table-column :label="$t('外部交易号')" prop="outer_sn"></el-table-column>
      <!-- 支付时间 -->
      <el-table-column :label="$t('支付时间')" prop="created_at"></el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-deep-purple" @click="details(scope.row.type, scope.row.id,scope.row.order_id, scope.row.payment_type)">{{$t('详情')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data () {
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
      linesChange: []
    }
  },
  mixins: [pagination],
  name: 'transaction',
  components: {
    SearchGroup,
    NlePagination
  },
  created () {
    if (this.$route.query.serial_number) {
      this.page_params.keyword = this.$route.query.serial_number
    }
    if (this.$route.query.times) {
      this.timeList = this.$route.query.times.split(' ')
      this.begin_date = this.timeList[0]
      this.end_date = this.timeList[1]
    }
  },
  mounted () {
    this.getList()
    this.getTypes()
    this.getRecord()
    this.getLines()
  },
  methods: {
    getList () {
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
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
    },
    // 详情
    details (type, id, orderId, paymentType) {
      console.log(type, 'paymentType')
      // type等于消费的时候 就要判断消费类型
      if (type === 1) {
        if (paymentType === 0 || paymentType === 1 || paymentType === 6 || paymentType === 4 || paymentType === 7) {
          console.log('我是微信')
          this.$router.push({ name: 'wechatPay', query: { id: id } })
        } else {
          console.log('我是转账')
          this.$router.push({ name: 'TransactionDetails', query: { order_id: orderId } })
        }
      } else {
        this.$router.push({ name: 'wechatPay', query: { id: id } })
      }
    },
    // 选择不同类型优惠券
    onVocherTypeChange () {
      this.page_params.handleQueryChange('type', this.type)
      this.getList()
    },
    // 选择不同类型优惠券
    onRecordTypeChange () {
      this.page_params.handleQueryChange('record', this.record)
      this.getList()
    },
    // 选择不同类型路线
    onLineTypeChange () {
      this.page_params.handleQueryChange('line', this.line)
      this.getList()
    },
    // 获取支付类型
    getTypes () {
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
    getRecord () {
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
    getLines () {
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
    uploadList (val) {
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
    margin-left: 10px;
  }
}
</style>
