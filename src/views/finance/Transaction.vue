<template>
  <div class="transaction-list-container">
    <div>
      <search-date-picker></search-date-picker>
      <search-group></search-group>
    </div>
    <el-table :data="transactionList" stripe border class="data-list">
      <el-table-column type="index" :index="1"></el-table-column>
      <el-table-column label="客户ID" prop="user"></el-table-column>
      <el-table-column label="类型" prop="type"></el-table-column>
      <el-table-column label="支付金额¥" prop="price"></el-table-column>
      <el-table-column label="相关订单" prop="order_sn"></el-table-column>
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
      transactionList: [
        {
          id: 1,
          user: '904412',
          type: '消费',
          price: '62.10',
          order_sn: 'NL12345678',
          created_at: '2019-08-23 12:12:45'
        }
      ]
    }
  },
  mixins: [pagination],
  components: {
    SearchGroup,
    SearchDatePicker,
    NlePagination
  }
}
</script>
