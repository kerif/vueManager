<template>
  <el-dialog :visible.sync="show" title="客户组成员" class="dialog-container">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <!-- 客户ID -->
      <el-table-column
        prop="phone_number"
        label="客户ID">
      </el-table-column>
      <!-- 客户昵称 -->
        <el-table-column
        prop="phone_number"
        label="客户昵称">
      </el-table-column>
      <!-- 最后登录时间 -->
        <el-table-column
        prop="phone_number"
        label="最后登录时间">
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      rules: {
        name: [
          { required: true, message: '请输入员工组中文名', trigger: 'blur' }
        ],
        enName: [
          { required: true, message: '请输入员工组英文名', trigger: 'blur' }
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
</style>
