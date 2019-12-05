<template>
<el-dialog  :visible.sync="show" title="发货单详情" width="70%"                            class="ship-details-container" @close="clear">
    <el-table :data="shipData">
        <el-table-column label="客户ID" prop="user_id"></el-table-column>
        <el-table-column label="订单号">
        <template slot-scope="scope">
            <span @click="goOrder(scope.row.order_sn, scope.row.status)" class="chooseOrder">{{scope.row.order_sn}}</span>
        </template>
        </el-table-column>
        <el-table-column label="转运快递单号" prop="logistics_sn"></el-table-column>
        <el-table-column label="转运快递公司" prop="logistics_company"></el-table-column>
        <el-table-column label="线路名称" prop="express_line.cn_name"></el-table-column>
        <el-table-column label="收货人" prop="address.receiver_name"></el-table-column>
        <el-table-column label="收货国家" prop="address.country_name"></el-table-column>
        <el-table-column label="包裹数" prop="package_count"></el-table-column>
        <el-table-column :label="'实际重量' + localization.weight_unit" prop="actual_weight"></el-table-column>
        <el-table-column :label="'实际费用' + localization.currency_unit" prop="actual_payment_fee"></el-table-column>
        <el-table-column :label="'申报价值' + localization.currency_unit" prop="declare_value"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="提交时间" prop="packed_at"></el-table-column>
        <el-table-column label="拣货时间" prop="updated_at"></el-table-column>
        <el-table-column label="操作" width="130">
            <template slot-scope="scope">
                <el-button @click="removeShip(scope.row.id)" v-if="status === 0" class="btn-light-red">移除发货单</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-box">
    <nle-pagination :pageParams="page_params"></nle-pagination>
     </div>
  </el-dialog>
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
      shipData: [],
      localization: {},
      status: ''
    }
  },
  mounted () {
    console.log('router', this.$router)
  },
  methods: {
    getList () {
      this.$request.getOrdersByShipment(this.id, {
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.shipData = res.data
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
    // 跳转至订单 运单
    goOrder (orderSn, status) {
      console.log(111)
      console.log(this.$router)
      this.$router.push({ name: 'wayBillList', query: { order_sn: orderSn, activeName: status.toString() } })
      this.show = false
    },
    // 移除发货单
    removeShip (id) {
      this.$confirm(`您真的要移除发货单吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.removeOrders({
          id: [id]
        }).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.show = false
            this.success()
          } else {
            this.$notify({
              title: '操作失败',
              message: res.msg,
              type: 'warning'
            })
          }
          this.show = false
        })
      })
    },
    init () {
      console.log(this.id, '我是接收的id')
      console.log(this.status, '我是接收的status')
      if (this.id) {
        this.getList()
      }
    },
    clear () {
      this.page_params.page = 1
    }
  }
}
</script>

<style lang="scss">
.ship-details-container {
  .chooseOrder {
    cursor: pointer;
    color:blue;
    text-decoration: underline;
  }
  .pagination-box {
    margin-top: 10px;
  }
}
</style>
