<template>
<el-dialog  :visible.sync="show" :title="$t('发货单详情')" width="70%"            class="ship-details-container" @close="clear">
  <div class="import-list">
    <el-button class="btn-deep-purple" @click="uploadList">{{$t('导出清单')}}</el-button>
  </div>
    <el-table :data="shipData" border  @selection-change="selectionChange">
       <el-table-column type="selection" width="55"></el-table-column>
       <!-- 客户ID -->
        <el-table-column :label="$t('客户ID')" prop="user_id"></el-table-column>
        <!-- 客户昵称 -->
        <el-table-column :label="$t('客户昵称')" prop="user_name"></el-table-column>
        <!-- 付款状态 -->
        <el-table-column :label="$t('付款状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.on_delivery_status === 0">{{$t('已付款')}}</span>
            <span v-if="scope.row.on_delivery_status === 1">{{$t('货到付款')}}</span>
            <span v-if="scope.row.on_delivery_status === 2">{{$t('货到付款（已付款）')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('订单号')">
            <template slot-scope="scope">
                <span @click="goOrder(scope.row.order_sn, scope.row.status)" class="chooseOrder">{{scope.row.order_sn}}</span>
            </template>
        </el-table-column>
        <el-table-column :label="$t('转运快递单号-二程')" prop="logistics_sn" width="120"></el-table-column>
        <!-- <el-table-column label="转运快递公司" prop="logistics_company"></el-table-column> -->
        <el-table-column :label="$t('线路名称')" prop="express_line.cn_name"></el-table-column>
        <el-table-column :label="$t('收货人')" prop="address.receiver_name"></el-table-column>
        <el-table-column :label="$t('收货国家/地区')" prop="address.country_name"></el-table-column>
        <el-table-column :label="$t('包裹数')" prop="package_count"></el-table-column>
        <el-table-column :label="$t('实际重量') + localization.weight_unit" prop="actual_weight"></el-table-column>
        <el-table-column :label="$t('实际费用') + localization.currency_unit" prop="actual_payment_fee"></el-table-column>
        <el-table-column :label="$t('申报价值') + localization.currency_unit" prop="declare_value"></el-table-column>
        <!-- <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="提交时间" prop="packed_at"></el-table-column>
        <el-table-column label="拣货时间" prop="updated_at"></el-table-column> -->
        <el-table-column :label="$t('操作')" width="130" v-if="status === 0" >
            <template slot-scope="scope">
                <el-button @click="removeShip(scope.row.id)" class="btn-light-red">{{$t('移除发货单')}}</el-button>
            </template>
        </el-table-column>
        <template slot="append">
        <div class="append-box">
          <el-button size="small" @click="deleteData">{{$t('导出发货单')}}</el-button>
          <el-button size="small" @click="removeBatch">{{$t('批量移除发货单')}}</el-button>
        </div>
      </template>
    </el-table>
    <!-- <div class="pagination-box">
    <nle-pagination :pageParams="page_params"></nle-pagination>
     </div> -->
  </el-dialog>
</template>
<script>
// import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    // NlePagination
  },
  mixins: [pagination],
  data () {
    return {
      shipData: [],
      localization: {},
      status: '',
      deleteNum: [],
      urlExcel: ''
    }
  },
  mounted () {
    console.log('router', this.$router)
  },
  methods: {
    getList () {
      this.$request.getOrdersByShipment(this.id, {
        size: 1000
      }).then(res => {
        if (res.ret) {
          this.shipData = res.data
          this.localization = res.localization
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
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 批量导出
    deleteData () {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$request.uploadShipmentLabel(this.id, {
        order_ids: this.deleteNum
      }).then(res => {
        if (res.ret) {
          this.urlExcel = res.data.url
          window.open(this.urlExcel)
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
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
      this.$confirm(this.$t('是否确认移除'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.removeOrders({
          id: [id]
        }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.show = false
            this.success()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
          this.show = false
        })
      })
    },
    // 批量移除发货单
    removeBatch () {
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$request.removeOrders({
        id: this.deleteNum
      }).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 导出清单
    uploadList () {
      this.$request.uploadAloneExcel(this.id).then(res => {
        if (res.ret) {
          this.urlExcel = res.data.url
          // window.location.href = this.urlExcel
          window.open(this.urlExcel)
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
  .import-list {
    margin-bottom: 10px;
    text-align: right;
  }
}
</style>
