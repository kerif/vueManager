<template>
  <el-dialog :visible.sync="show" title="修改客户组" class="dialog-container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
    <el-row :gutter="20">
        <!-- 员工组中文名 -->
        <el-col :span="6" :offset="5">
            <el-form-item label="客户组中文名" prop="name">
            <el-input v-model="ruleForm.name"
            placeholder="请输入客户组中文名"></el-input>
            </el-form-item>
        </el-col>
        <!-- 员工组英文名 -->
        <el-col :span="6" :offset="2">
            <el-form-item label="客户组英文名" prop="enName">
            <el-input v-model="ruleForm.enName"
            placeholder="请输入客户组英文名"></el-input>
            </el-form-item>
        </el-col>
        <!-- 备注 -->
        <el-row :gutter="20">
           <el-col :span="14" :offset="5">
                <el-form-item label="备注">
                <el-input type="textarea" v-model="ruleForm.desc"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入备注"></el-input>
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
        enName: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入客户组中文名', trigger: 'blur' }
        ],
        enName: [
          { required: true, message: '请输入客户组英文名', trigger: 'blur' }
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
// .dialog-container {
//   .el-dialog__header {
//     background-color: #0E102A;
//   }
//   .el-dialog__title {
//     font-size: 14px;
//     color: #FFF;
//   }
//   .el-dialog__close {
//     color: #FFF;
//   }
// }
</style>
