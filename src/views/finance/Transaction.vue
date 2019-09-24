<template>
  <div class="transaction-list-container">
    <div>
      <search-date-picker
          v-model="page_params.time"
          type="datetimerange"
          @change="getDate"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </search-date-picker>
      <search-group v-model="page_params.keyword" @search="goSearch"></search-group>
    </div>
    <el-table :data="transactionList" stripe border class="data-list">
      <el-table-column type="index" :index="1"></el-table-column>
      <!-- 客户ID -->
      <el-table-column label="客户ID" prop="user_id"></el-table-column>
      <!-- 类型 -->
      <el-table-column label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">消费</span>
        </template>
      </el-table-column>
      <!-- 支付金额¥ -->
      <el-table-column label="支付金额¥" prop="amount"></el-table-column>
      <!-- 相关订单 -->
      <el-table-column label="相关订单" prop="order_sn"></el-table-column>
      <!-- 支付时间 -->
      <el-table-column label="支付时间" prop="created_at"></el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
  </div>
</template>
<script>
import { SearchGroup, SearchDatePicker } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data () {
    return {
      transactionList: [],
      page_params: {
        keyword: '',
        time: []
      }
    }
  },
  mixins: [pagination],
  components: {
    SearchGroup,
    SearchDatePicker,
    NlePagination
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$request.getTransaction().then(res => {
        this.transactionList = res.data
      })
    },
    getDate (val) {
      this.page_params.page_no = 1
      this.page_params.time = val
      this.getList()
    }
  }
}
</script>
