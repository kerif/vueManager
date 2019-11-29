<template>
  <el-dialog :visible.sync="show" title="加入发货单" class="invoice-container" @close="clear">
    <el-select v-model="invoice.sn">
      <el-option
      v-for="item in invoiceList"
      :key="item.id"
      :value="item.id"
      :label="`${item.sn} ${item.destination_country}`">
      </el-option>
    </el-select>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      invoiceList: [],
      invoice: {
        sn: ''
      }
    }
  },
  methods: {
    getUser () {
      this.$request.getInvoice().then(res => {
        this.invoiceList = res.data
      })
    },
    confirm () {
      this.show = false
      this.success(this.invoice.sn)
      // this.$request.updateShipment(this.id, this.invoice.sn).then(res => {
      //   if (res.ret) {
      //     this.$notify({
      //       type: 'success',
      //       title: '操作成功',
      //       message: res.msg
      //     })
      //     this.show = false
      //     this.success()
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: 'error'
      //     })
      //   }
      //   this.show = false
      // })
    },
    clear () {
      this.invoice.sn = ''
    },
    init () {
      this.getUser()
    }
  }
}
</script>
<style lang="scss">
.invoice-container{
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }

  .el-dialog__close {
    color: #FFF;
  }
}
</style>
