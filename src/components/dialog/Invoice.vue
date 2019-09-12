<template>
  <el-dialog :visible.sync="show" title="添加员工组" class="dialog-container" width="35%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
    <el-row :gutter="20">
        <!-- 员工组中文名 -->
        <el-col :span="8" :offset="5">
            <el-form-item label="员工组中文名" prop="name">
                <el-select v-model="ruleForm.name" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <!-- 用户组描述 -->
        <el-row :gutter="20">
           <el-col :span="8" :offset="5">
                <el-form-item label="用户组描述">
                <el-input type="textarea" v-model="ruleForm.desc"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入用户组描述"></el-input>
                </el-form-item>
           </el-col>
        </el-row>
    </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm(ruleForm)">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        name: '',
        desc: ''
      },
      options: [],
      rules: {
        name: [
          { required: true, message: '请输入员工组中文名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    confirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('user/changePSD', {
            password: this.params.old_password,
            newpassword: this.params.new_password,
            secondpassword: this.params.new_password2
          }).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '成功',
                message: res.msg
              })
              // this.$store.commit('token/removeToken')
              // this.$router.push('/login')
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.dialog-container {
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
