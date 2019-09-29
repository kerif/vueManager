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
    </div>
    <div style="overflow:hidden">
      <search-group v-model="page_params.keyword" @search="goSearch"></search-group>
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
      tableLoading: false,
      page_params: {
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
      this.tableLoading = true
      this.$request.getTransaction({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.transactionList = res.data
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
    getDate (val) {
      console.log(1)
      console.log(this.page_params.time)
      this.page_params.page_no = 1
      this.page_params.time = val
      this.getList()
    }
  }
}
</script>
