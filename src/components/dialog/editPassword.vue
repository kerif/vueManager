<template>
  <el-dialog :visible.sync="show" title="修改客户组" class="dialog-container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
    <el-row :gutter="20">
        <!-- 用户名 -->
        <el-col :span="6" :offset="5">
            <p>用户名</p>
            <p>&nbsp;&nbsp;大大</p>
        </el-col>
        <!-- 邮箱 -->
        <el-col :span="7" :offset="2">
            <p>邮箱</p>
            <p>&nbsp;&nbsp;1270754175@qq.com</p>
        </el-col>
        <!-- 备注 -->
        <el-row :gutter="20">
            <el-col :span="6" :offset="5">
            <el-form-item label="新密码" prop="enName">
            <el-input v-model="ruleForm.enName"
            placeholder="请输入密码"></el-input>
            </el-form-item>
           </el-col>
           <el-col :span="7" :offset="2">
            <el-form-item label="确认密码" prop="enName">
            <el-input v-model="ruleForm.enName"
            placeholder="请再次输入密码"></el-input>
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
    getList () {
      this.$http.get(`admins/${this.id}`).then(res => {
        this.ruleForm = res.data
        console.log(this.ruleForm)
      })
    },
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
    },
    init () {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
</style>
