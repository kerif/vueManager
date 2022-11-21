<template>
  <el-drawer
    :title="$t('导出订单详情')"
    :visible.sync="showTmpDrawer"
    class="exportTmp-container"
    :before-close="close"
  >
    <div style="margin: 20px 0">
      <el-button @click="addTmp('add')" size="small" class="btn-purple">{{
        $t('新增模板')
      }}</el-button>
      <el-button
        size="small"
        type="primary"
        :loading="$store.state.btnLoading"
        @click="updatePackages(uploadType)"
        >{{ $t('确定导出') }}</el-button
      >
    </div>
    <div
      v-for="item in tmpList"
      :key="item.id"
      :class="['template-item', { active: ind === item.id }]"
      @click="activeFun(item.id)"
    >
      <div class="template-top">
        <div class="template-name">{{ item.name }}</div>
        <div v-if="item.custom_code === ''">
          <el-button @click="editTmp('edit', item.id)" class="btn-blue-green">{{
            $t('编辑')
          }}</el-button>
          <el-button @click="deleteTmpDrawer(item.id)" class="btn-light-red">{{
            $t('删除')
          }}</el-button>
        </div>
        <div v-else-if="item.custom_code === 'pp_order'">
          <el-button @click="editPurchaseTmp(item.id)" class="btn-blue-green">{{
            $t('编辑')
          }}</el-button>
        </div>
        <div v-else-if="item.custom_code === 'order'">
          <el-button @click="editOrderTmp(item.id)" class="btn-blue-green">{{
            $t('编辑')
          }}</el-button>
        </div>
      </div>
      <div class="template-remark">{{ item.remark }}</div>
    </div>
    <div></div>
    <inner-drawer
      :editTmpDrawer="editTmpDrawer"
      :state="state"
      ref="inner"
      :ids="ids"
      v-if="state"
      @receiveInner="receiveInner"
      :tmpCode="tmpCode"
    ></inner-drawer>
    <purchase-drawer
      :tmpCode="tmpCode"
      :editPurchaseTmpDrawer="editPurchaseTmpDrawer"
      @purchaseInner="purchaseInner"
      ref="purchase"
      :ids="ids"
    ></purchase-drawer>
    <order-drawer
      :tmpCode="tmpCode"
      :editOrderTmpDrawer="editOrderTmpDrawer"
      @orderInner="orderInner"
      ref="order"
      :ids="ids"
    ></order-drawer>
  </el-drawer>
</template>

<script>
import InnerDrawer from './innerDrawer'
import PurchaseDrawer from './purchaseDrawer.vue'
import OrderDrawer from './orderDrawer.vue'
export default {
  components: {
    InnerDrawer,
    PurchaseDrawer,
    OrderDrawer
  },
  data() {
    return {
      editTmpDrawer: false,
      editPurchaseTmpDrawer: false,
      editOrderTmpDrawer: false,
      code: '',
      name: '',
      tmpName: '',
      tmpCode: '',
      state: 'add',
      id: '',
      ids: '',
      tmpList: [],
      ind: 0,
      activeId: '',
      template_id: '',
      tableLoading: false
    }
  },
  props: {
    showTmpDrawer: {
      type: Boolean,
      default: false
    },
    searchFieldData: {
      type: Object
    },
    activeName: {
      type: String
    },
    uploadType: {
      type: Number
    },
    uploadId: {
      type: Number
    },
    deleteNum: {
      type: Array
    }
  },
  created() {
    this.getCodeList()
    this.getTmpList()
  },
  activated() {
    this.getTmpList()
  },
  methods: {
    close() {
      this.$emit('receiveTmp', false)
    },
    addTmp() {
      this.state = 'add'
      this.editTmpDrawer = true
    },
    editTmp(state, ids) {
      this.state = 'edit'
      this.ids = ids
      this.editTmpDrawer = true
    },
    editPurchaseTmp(ids) {
      this.ids = ids
      this.editPurchaseTmpDrawer = true
    },
    editOrderTmp(ids) {
      this.ids = ids
      this.editOrderTmpDrawer = true
    },
    receiveInner() {
      this.editTmpDrawer = false
      this.$refs.inner.clear()
      this.getTmpList()
    },
    purchaseInner() {
      this.editPurchaseTmpDrawer = false
      this.$refs.purchase.clear()
      this.getTmpList()
    },
    orderInner() {
      this.editOrderTmpDrawer = false
      this.$refs.order.clear()
      this.getTmpList()
    },
    activeFun(id) {
      this.ind = id
      this.activeId = id
    },
    deleteTmpDrawer(id) {
      this.$confirm(this.$t('您真的要删除此模板？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteTemplate(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getTmpList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    getTmpList() {
      this.$request.listQuery({ code: this.tmpCode, size: 100 }).then(res => {
        this.tmpList = res.data
        // this.tmpCode = res.data[0].code
      })
    },
    getCodeList() {
      this.$request.getCodeList().then(res => {
        this.tmpCode = res.data[0].id
        console.log(this.tmpCode)
        this.name = res.data[0].name
      })
    },
    updatePackages(uploadType) {
      if (uploadType === 2) {
        const searchData = this.searchFieldData
        let param = {
          ...searchData,
          status: this.activeName,
          template_id: this.activeId,
          begin_date: searchData.date ? searchData.date[0] : '',
          end_date: searchData.date ? searchData.date[1] : '',
          order_sn: searchData.order_sn.split(/[(\r\n)\r\n]+/),
          country_id:
            searchData.countryArr.length > 1
              ? searchData.countryArr[0]
              : searchData.countryArr[searchData.countryArr.length - 1]
        }
        this.$request.ordersExport(param).then(res => {
          if (res.ret) {
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
      } else if (uploadType === 1) {
        let id = this.uploadId
        this.$request.uploadShipExcel(id, { template_id: this.activeId }).then(res => {
          if (res.ret) {
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
      } else {
        if (!this.deleteNum || !this.deleteNum.length) {
          return this.$message.error(this.$t('请选择发货单号'))
        }
        this.$request
          .uploadExcel({
            shipment_ids: this.deleteNum,
            template_id: this.activeId
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.exportTmp-container {
  font-size: 14px;
  ::v-deep .el-drawer__body {
    padding: 0 20px;
    overflow-y: auto;
  }
  ::v-deep .el-drawer__header {
    font-size: 16px;
    font-weight: bold;
  }
  .active {
    border: 1px solid #3540a5 !important;
  }
  /deep/.el-dialog__close {
    color: black !important;
  }
  /deep/.el-icon-close:before {
    color: black;
  }
  .template-item {
    cursor: pointer;
    padding: 20px;
    margin-bottom: 20px;
    transition: all 0.4s;
    border: 1px solid #eeeeee;
    border-radius: 5px;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.04);
    background: #fff;
    .template-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;
      .template-name {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .template-remark {
      line-height: 20px;
    }
  }
}
</style>
