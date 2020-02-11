<template>
  <el-dialog :visible.sync="show" :title="staff === 'add' ? '添加员工组': '编辑员工组'" class="dialog-addStaff"
  @close="clear">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <!-- 员工组中文名 -->
        <el-form-item label="员工组中文名" prop="name_cn">
          <el-input v-model="ruleForm.name_cn"
          placeholder="请输入员工组中文名"></el-input>
          </el-form-item>
        <!-- 员工组英文名 -->
          <el-form-item label="员工组英文名" prop="name_en">
          <el-input v-model="ruleForm.name_en"
          placeholder="请输入员工组英文名"></el-input>
          </el-form-item>
        <!-- 用户组描述 -->
          <el-form-item label="用户组描述">
          <el-input type="textarea" v-model="ruleForm.description"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入用户组描述"></el-input>
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
      staff: '',
      id: '',
      rules: {
        name_cn: [
          { required: true, message: '请输入员工组中文名', trigger: 'blur' }
        ],
        name_en: [
          { required: true, message: '请输入员工组英文名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getList () {
      console.log(this.id, 'id')
      this.$request.getGroup(this.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
        } else {
          this.$notify({
            message: res.msg,
            type: 'error',
            title: '操作失败'
          })
        }
      })
    },
    confirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.id) { // 如果是编辑状态
            this.$request.editGroup(this.id, this.ruleForm).then(res => {
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
            this.$request.addGroup(this.ruleForm).then(res => {
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
    },
    cancelDialog (ruleForm) {
      this.$refs[ruleForm].resetFields()
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
.dialog-addStaff {
  .el-input {
    width: 40%;
    margin-left: 50px;
  }
  .el-textarea {
    width: 40%;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 200px;
  }
  .el-form-item__error {
    margin-left: 300px !important;
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
