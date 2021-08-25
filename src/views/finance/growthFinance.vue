<template>
  <div>
    <el-table :data="tableData" border style="width: 100%; margin-bottom: 10px">
      <el-table-column type="index" width="40"> </el-table-column>
      <el-table-column prop="user_id" :label="$t('客户ID')"> </el-table-column>
      <el-table-column prop="status" :label="$t('状态')">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">{{ $t('待审核') }}</span>
          <span v-if="scope.row.status === 1">{{ $t('审核通过') }}</span>
          <span v-if="scope.row.status === 2">{{ $t('审核拒绝') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payment_type_name" :label="$t('支付类型')" width="100">
      </el-table-column>
      <el-table-column prop="serial_no" :label="$t('流水号')" width="200"> </el-table-column>
      <el-table-column prop="transfer_account" :label="$t('转账账号')" width="150">
      </el-table-column>
      <el-table-column prop="tran_amount" :label="$t('转账金额')"> </el-table-column>
      <el-table-column prop="growth_value" :label="$t('成长值')"> </el-table-column>
      <el-table-column prop="order_number" :label="$t('相关订单')" width="150"> </el-table-column>
      <el-table-column prop="remark" :label="$t('备注')" width="150"> </el-table-column>
      <el-table-column prop="operator" :label="$t('操作人')"> </el-table-column>
      <el-table-column prop="created_at" :label="$t('创建时间')" width="170"> </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :class="[
              'btn-sty',
              { ' btn-purple': scope.row.status !== 0 },
              { ' btn-green': scope.row.status === 0 }
            ]"
            @click="goDetails(scope.row.id)"
          >
            {{ scope.row.status === 0 ? $t('审核') : $t('详情') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      tableData: []
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request
        .getGrowthFinance({
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          console.log(res)
          if (res.ret) {
            this.tableData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          }
        })
    },
    goDetails(id) {
      this.$router.push({ name: 'growthFinanceDetails', params: { id } })
    }
  }
}
</script>
<style scoped lang="scss"></style>
