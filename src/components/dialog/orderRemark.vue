<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('订单标签备注')"
    class="dialog-claim"
    @close="clear"
  >
    <div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 10 }"
        :placeholder="$t('请输入订单备注')"
        v-model="remark"
      >
      </el-input>
    </div>
    <div slot="footer">
      <el-button @click="cancelDialog">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('user')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      remark: null,
      user: {
        user_id: ''
      },
      staff: '',
      status: '',
      supplierId: '',
      id: [],
      rules: {
        user_id: [{ required: true, message: this.$t('请输入认领用户'), trigger: 'change' }]
      }
    }
  },
  mounted() {
    console.log('this.code', this.id)
  },
  methods: {
    queryCNSearch(queryString, callback) {
      console.log(this.user.user_id)
      var list = [{}]
      this.$request
        .getClaimList({
          keyword: this.user.user_id.toString()
        })
        .then(res => {
          for (let i of res.data) {
            // i.value = i.id
            i.value = i.id + '---' + i.name
          }
          list = res.data
          callback(list)
        })
    },
    handleSelect(item) {
      this.supplierId = item.id
      this.supplierName = item.name
    },
    confirm() {
      this.$request
        .setOrderRemark(this.id, {
          remark: this.remark
        })
        .then(res => {
          this.$message.success(res.msg)
          this.remark = null
          this.show = false
          this.success()
        })
    },
    clear() {
      this.user.user_id = ''
      this.status = ''
      this.remark = null
    },
    cancelDialog() {
      this.remark = null
      this.show = false
    },
    init() {}
  }
}
</script>
<style lang="scss">
.dialog-claim {
  // .changeQuery {
  //   .el-autocomplete {
  //     width: 100%;
  //   }
  // }
  .el-form-item__label {
    width: 200px;
  }
  .el-form-item__error {
    margin-left: 200px !important;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }

  .el-dialog__close {
    color: #fff;
  }
}
</style>
