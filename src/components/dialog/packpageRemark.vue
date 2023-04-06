<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('包裹标签备注')"
    class="dialog-claim"
    @close="clear"
  >
    <div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 10 }"
        :placeholder="$t('请输入包裹备注')"
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
    confirm(formName) {
      // this.$refs[formName].validate(valid => {
      // if (valid) {
      //     if (this.status === 'alone') {
      //       this.$request
      //         .claimPackage(this.id, {
      //           user_id: this.supplierId
      //         })
      //         .then(res => {
      //           if (res.ret) {
      //             this.$notify({
      //               type: 'success',
      //               title: this.$t('操作成功'),
      //               message: res.msg
      //             })
      //             this.show = false
      //             this.success()
      //           } else {
      //             this.$message({
      //               message: res.msg,
      //               type: 'error'
      //             })
      //           }
      //         })
      //     } else {
      //       this.$request.batchClaim({ ids: this.id, user_id: this.supplierId }).then(res => {
      //         if (res.ret) {
      //           this.$notify({
      //             type: 'success',
      //             title: this.$t('操作成功'),
      //             message: res.msg
      //           })
      //           this.show = false
      //           this.success()
      //         } else {
      //           this.$message({
      //             message: res.msg,
      //             type: 'error'
      //           })
      //         }
      //       })
      //     }
      //   } else {
      //     return false
      //   }
      // })
      this.show = false
      this.success()
    },
    clear() {
      this.user.user_id = ''
      this.status = ''
    },
    cancelDialog() {
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
