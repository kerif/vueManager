<template>
  <el-drawer size="85%" :visible.sync="show" :title="$t('抵用券详细')" class="coupon-container">
    <div class="pad" v-if="couponInfo">
      <el-descriptions :title="couponInfo.name" :column="4" border>
        <el-descriptions-item :label="$t('类型')">
          {{ couponInfo.type }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('最低消费')">{{
          couponInfo.threshold
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('金额') + this.localization.currency_unit">{{
          couponInfo.amount
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('状态')"
          ><span v-if="couponInfo.status === 1">{{ $t('未开始') }}</span>
          <span v-if="couponInfo.status === 2">{{ $t('进行中') }}</span>
          <span v-if="couponInfo.status === 3">{{ $t('已失效') }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('使用范围')">
          <span v-for="item in couponInfo.usable_lines" :key="item.id">
            {{ item.name }}&nbsp;
          </span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('最低消费金额') + this.localization.currency_unit">{{
          couponInfo.threshold
        }}</el-descriptions-item>

        <el-descriptions-item :label="$t('最低消费金额')">{{
          couponInfo.threshold
        }}</el-descriptions-item>

        <el-descriptions-item :label="$t('失效时间')">{{
          couponInfo.expired_at
        }}</el-descriptions-item>

        <el-descriptions-item :label="$t('投放数量')">{{
          couponInfo.total_count
        }}</el-descriptions-item>

        <el-descriptions-item :label="$t('使用数量')"
          ><span v-bind:style="{ color: couponInfo.used_count > 0 ? 'blue' : '' }">{{
            couponInfo.used_count
          }}</span></el-descriptions-item
        >

        <el-descriptions-item :label="$t('待使用数量')">{{
          couponInfo.unused_count
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('过期数量')">{{
          couponInfo.expired_count
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('作废数量')">{{
          couponInfo.invalid_count
        }}</el-descriptions-item>
      </el-descriptions>
      <br />
      <el-table class="data-list" border stripe v-loading="tableLoading" :data="recordingData">
        <el-table-column type="index" width="55"></el-table-column>
        <!-- 券名称 -->
        <el-table-column :label="$t('券名称')" prop="coupon"></el-table-column>
        <!-- 券码 -->
        <el-table-column :label="$t('券码')" prop="coupon_code"></el-table-column>
        <!-- 金额 -->
        <el-table-column :label="$t('金额')" prop="amount"> </el-table-column>
        <!-- 投放对象 -->
        <el-table-column :label="$t('投放对象')" prop="user_id"></el-table-column>
        <!-- 使用时间 -->
        <el-table-column :label="$t('使用时间')" prop="used_at"></el-table-column>
        <el-table-column :label="$t('状态')" prop="status"></el-table-column>
        <!-- 订单编码 -->
        <el-table-column :label="$t('订单编码')" prop="order_number"></el-table-column>
        <!-- 订单金额 -->
        <el-table-column :label="$t('订单金额')" prop="order_amount"></el-table-column>
        <!-- 付款时间 -->
        <el-table-column :label="$t('付款时间')" prop="paid_at"></el-table-column>
      </el-table>
      <tx-pagination :pageParams="pageParams"></tx-pagination>
    </div>
  </el-drawer>
</template>

<script>
import TxPagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    TxPagination
  },
  mixins: [pagination],
  data() {
    return {
      couponInfo: {},
      localization: {},
      ruleForm: {},
      pageParams: {},
      recordingData: [],
      tableLoading: false
    }
  },
  methods: {
    init() {
      this.show = true
      this.getLanguageList()
      // this.$request.getRebateDetails(this.id).then(res => {
      //   this.ruleForm = res.data
      // })
      this.getList()
    },
    // 获取全部语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
          this.localization = res.localization
        }
      })
    },
    getList() {
      this.tableLoading = true
      this.recordingData = []
      this.$request
        .userCoupons(this.couponInfo.id, {
          page: this.pageParams.page,
          size: this.pageParams.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.recordingData = res.data
            this.pageParams.page = res.meta.current_page
            this.pageParams.total = res.meta.total
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
.coupon-container {
  font-size: 14px;
  .pad {
    padding: 20px;
  }
}
</style>
