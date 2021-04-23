<template>
  <div class="ship-details-container">
    <el-table :data="shipData">
      <el-table-column :label="$t('客户ID')" prop="user_id"></el-table-column>
      <el-table-column :label="$t('订单号')">
        <template slot-scope="scope">
          <span @click="goOrder(scope.row.order_sn, scope.row.status)" class="chooseOrder">{{
            scope.row.order_sn
          }}</span>
        </template>
      </el-table-column>
      <!-- 转运快递单号 -->
      <el-table-column :label="$t('转运快递单号')" prop="logistics_sn"></el-table-column>
      <!-- 转运快递公司 -->
      <el-table-column :label="$t('转运快递公司')" prop="logistics_company"></el-table-column>
      <!-- 线路名称 -->
      <el-table-column :label="$t('线路名称')" prop="express_line.cn_name"></el-table-column>
      <!-- 收货人 -->
      <el-table-column :label="$t('收货人')" prop="address.receiver_name"></el-table-column>
      <!-- 收货国家/地区 -->
      <el-table-column :label="$t('收货国家/地区')" prop="address.country_name"></el-table-column>
      <!-- 包裹数 -->
      <el-table-column :label="$t('包裹数')" prop="package_count"></el-table-column>
      <!-- 实际重量 -->
      <el-table-column
        :label="$t('实际重量') + localization.weight_unit"
        prop="actual_weight"
      ></el-table-column>
      <!-- 实际费用 -->
      <el-table-column
        :label="$t('实际费用') + localization.currency_unit"
        prop="actual_payment_fee"
      ></el-table-column>
      <!-- 申报价值 -->
      <el-table-column
        :label="$t('申报价值') + localization.currency_unit"
        prop="declare_value"
      ></el-table-column>
      <!-- 备注 -->
      <el-table-column :label="$t('备注')" prop="remark"></el-table-column>
      <!-- 提交时间 -->
      <el-table-column :label="$t('提交时间')" prop="packed_at"></el-table-column>
      <!-- 拣货时间 -->
      <el-table-column :label="$t('拣货时间')" prop="updated_at"></el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            @click="removeShip(scope.row.id)"
            v-if="$route.query.status === 0"
            class="btn-light-red"
            >{{ $t('移除发货单') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      shipData: [],
      localization: {}
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request.getOrdersByShipment(this.$route.query.id).then(res => {
        if (res.ret) {
          this.shipData = res.data
          this.localization = res.localization
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 跳转至订单 运单
    goOrder(orderSn, status) {
      this.$router.push({
        name: 'wayBillList',
        query: { order_sn: orderSn, activeName: status.toString() }
      })
    },
    // 移除发货单
    removeShip(id) {
      this.$confirm(this.$t('您真的要移除发货单吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .removeOrders({
            id: [id]
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      })
    }
  }
}
</script>

<style lang="scss">
.ship-details-container {
  .chooseOrder {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }
}
</style>
