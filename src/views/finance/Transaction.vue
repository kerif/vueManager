<template>
  <div class="transaction-list-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
        <el-date-picker
        v-model="timeList"
        type="daterange"
        @change="onTime"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      </search-group>
    </div>
    <el-table :data="transactionList" stripe border class="data-list"
    v-loading="tableLoading">
      <el-table-column type="index" :index="1"></el-table-column>
      <!-- 客户ID -->
      <el-table-column label="客户ID" prop="user_id"></el-table-column>
      <!-- 类型 -->
      <el-table-column label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">消费</span>
        </template>
      </el-table-column>
      <!-- 总金额¥ -->
      <el-table-column :label="'总金额' + this.localization.currency_unit" prop="order_amount"></el-table-column>
      <!-- 抵用券金额¥ -->
      <el-table-column :label="'抵用券金额' + this.localization.currency_unit" prop="coupon_amount"></el-table-column>
      <!-- 支付金额¥ -->
      <el-table-column :label="'支付金额' + this.localization.currency_unit" prop="pay_amount"></el-table-column>
      <!-- 相关订单 -->
      <el-table-column label="相关订单" prop="order_sn"></el-table-column>
      <!-- 第三方流水号 -->
      <el-table-column label="第三方流水号" prop="outer_sn"></el-table-column>
      <!-- 支付时间 -->
      <el-table-column label="支付时间" prop="created_at"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-deep-purple" @click="details(scope.row.order_id)">详情</el-button>
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
      end_date: ''
    }
  },
  mixins: [pagination],
  name: 'transactionList',
  components: {
    SearchGroup,
    NlePagination
  },
  created () {
    if (this.$route.query.serial_number) {
      this.page_params.keyword = this.$route.query.serial_number
      // this.goSearch()
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size
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
      this.getList()
    },
    // 跳转到审核
    details (id) {
      this.$router.push({ name: 'review', query: { id: id, state: 'transaction' } })
    }
  }
}
</script>
