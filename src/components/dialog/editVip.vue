<template>
  <el-dialog :visible.sync="show" :title="state === 'edit' ? '修改客户组' : '添加客户组'" class="dialog-vip"
  size="small" @close="clear">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <!-- 员工组中文名 -->
        <el-form-item label="客户组中文名" prop="name_cn">
          <el-input v-model="ruleForm.name_cn"
          placeholder="请输入客户组中文名"></el-input>
          </el-form-item>
        <!-- 员工组英文名 -->
          <el-form-item label="客户组英文名" prop="name_en">
          <el-input v-model="ruleForm.name_en"
          placeholder="请输入客户组英文名"></el-input>
          </el-form-item>
        <!-- 用户组描述 -->
          <el-form-item label="客户组描述">
          <el-input type="textarea" v-model="ruleForm.description"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入客户组描述"></el-input>
          </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancelDialog('ruleForm')">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        name_cn: '',
        name_en: '',
        description: ''
      },
      state: '',
      rules: {
        name_cn: [
          { required: true, message: '请输入客户组中文名', trigger: 'blur' }
        ],
        name_en: [
          { required: true, message: '请输入客户组英文名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    confirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.id) { // 如果是编辑状态
            this.$request.editUserGroup(this.id, this.ruleForm).then(res => {
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
          } else { // 如果是添加状态
            this.$request.addUserGroup(this.ruleForm).then(res => {
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
          }
        } else {
          return false
        }
      })
    },
    clear () {
      this.ruleForm.name_cn = ''
      this.ruleForm.name_en = ''
      this.ruleForm.description = ''
      this.name_cn = ''
      this.name_en = ''
    },
    cancelDialog (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.show = false
    },
    init () {
      if (this.id) {
        this.ruleForm.name_cn = this.name_cn
        this.ruleForm.name_en = this.name_en
      }
    }
  }
}
</script>
<style lang="scss">
.dialog-vip {
  .el-input {
    width: 40% !important;
    margin-left: 50px;
  }
  .el-textarea {
    width: 40% !important;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 200px;
  }
  .el-form-item__error {
    margin-left: 250px !important;
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
