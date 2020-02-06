<template>
  <el-dialog :visible.sync="show" title="认领用户" class="dialog-claim"
  size="small" @close="clear">
    <el-form :model="user" :rules="rules" ref="user" class="demo-ruleForm">
        <!-- 员工组中文名 -->
        <el-form-item label="认领用户" prop="name_cn">
          <!-- <el-input v-model="ruleForm.name_cn"
          placeholder="请输入用户id"></el-input> -->
              <el-autocomplete
              :fetch-suggestions="queryCNSearch"
              @select="handleSelect"
              placeholder="请输入客户ID"
              v-model="user.user_id">
            </el-autocomplete>
          </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancelDialog('user')">取消</el-button>
      <el-button type="primary" @click="confirm('user')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      user: {
        user_id: ''
      },
      staff: '',
      id: '',
      rules: {
        name_cn: [
          { required: true, message: '请输入认领用户', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getList () {
    },
    queryCNSearch (queryString, callback) {
      console.log(this.user.user_id)
      var list = [{}]
      this.$request.getClaimList({
        keyword: this.user.user_id.toString()
      }).then(res => {
        for (let i of res.data) {
          // i.value = i.id
          i.value = i.id + '---' + i.name
        }
        list = res.data
        callback(list)
      })
    },
    handleSelect (item) {
      // this.ruleForm.en_name = item.name
      console.log(item)
      this.supplierId = item.id
      this.supplierName = item.name
    },
    confirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.editGroup(this.id, this.user).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '操作成功',
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
    clear () {
      this.user.name_cn = ''
    },
    cancelDialog (user) {
      this.$refs[user].resetFields()
      this.show = false
    },
    init () {
      if (this.id) {
        this.getList()
      }
    }
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
