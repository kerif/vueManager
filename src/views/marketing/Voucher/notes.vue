<template>
  <div class="recording-container">
      <el-table class="data-list" border stripe
      v-loading="tableLoading"
      :data="recordingData">
      <el-table-column type="index" width="55"></el-table-column>
      <!-- 券名称 -->
      <el-table-column :label="$t('券名称')" prop="coupon"></el-table-column>
      <!-- 券码 -->
      <el-table-column :label="$t('券码')" prop="coupon_code"></el-table-column>
      <!-- 金额 -->
      <el-table-column :label="$t('金额')" prop="amount">
      </el-table-column>
      <!-- 投放对象 -->
      <el-table-column :label="$t('投放对象')" prop="user_id"></el-table-column>
      <!-- 使用时间 -->
      <el-table-column :label="$t('使用时间')" prop="used_at"></el-table-column>
      <!-- 订单编码 -->
      <el-table-column :label="$t('订单编码')" prop="order_number"></el-table-column>
      <!-- 订单金额 -->
      <el-table-column :label="$t('订单金额')" prop="order_amount"></el-table-column>
      <!-- 付款时间 -->
      <el-table-column :label="$t('付款时间')" prop="paid_at"></el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  data () {
    return {
      recordingData: [],
      tableLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.recordingData = []
      this.$request.userCoupons(this.$route.query.id, {
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.recordingData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
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
.recording-container {
  .tabLength {
    width: 400px !important;
  }
  .detailsBtn {
    margin: 3px 2px !important;
  }
}
</style>
