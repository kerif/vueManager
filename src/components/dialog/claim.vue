<template>
  <el-dialog :visible.sync="show" :title="$t('认领用户')" class="dialog-claim" @close="clear">
    <el-form :model="user" :rules="rules" ref="user" class="demo-ruleForm">
      <!-- 员工组中文名 -->
      <el-form-item :label="$t('认领用户')" prop="user_id">
        <!-- <el-input v-model="ruleForm.name_cn"
          placeholder="请输入用户id"></el-input> -->
        <el-autocomplete
          :fetch-suggestions="queryCNSearch"
          @select="handleSelect"
          :placeholder="$t('请输入客户ID')"
          v-model="user.user_id"
        >
        </el-autocomplete>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancelDialog('user')">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('user')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      user: {
        user_id: ''
      },
      staff: '',
      supplierId: '',
      id: '',
      rules: {
        user_id: [{ required: true, message: this.$t('请输入认领用户'), trigger: 'change' }]
      }
    }
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
      console.log('supplierId', this.supplierId)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request
            .claimPackage(this.id, {
              user_id: this.supplierId
            })
            .then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: this.$t('操作成功'),
                  message: res.msg
                })
                this.show = false
                this.success()
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
              this.show = false
            })
        } else {
          return false
        }
      })
    },
    clear() {
      this.user.user_id = ''
    },
    cancelDialog(user) {
      this.$refs[user].resetFields()
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
