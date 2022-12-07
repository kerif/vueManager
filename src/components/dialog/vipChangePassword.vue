<template>
  <el-dialog :title="$t('修改密码')" :visible.sync="show" width="30%" @close="clear">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      {{ id }}
      <el-form-item :label="$t('重置密码')" prop="passowrd">
        <el-input
          v-model="ruleForm.password"
          type="password"
          :placeholder="$t('请输入重置密码')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('再次输入重置密码')" prop="confirm_password">
        <el-input
          v-model="ruleForm.confirm_password"
          type="password"
          :placeholder="$t('请再次输入重置密码')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="pwdConfirm('ruleForm')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('请再次输入重置密码')))
      } else if (value !== this.ruleForm.password) {
        callback(new Error(this.$t('两次输入密码不一致!')))
      } else {
        callback()
      }
    }
    return {
      show: false,
      id: 0,
      ruleForm: {
        password: '',
        confirm_password: ''
      },
      rules: {
        password: [
          { required: true, message: this.$t('请输入重置密码'), trigger: 'blur' },
          { min: 6, max: 32, message: this.$t('长度在6到32个字符'), trigger: 'change' }
        ],
        confirm_password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { min: 6, max: 32, message: this.$t('长度在6到32个字符'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    pwdConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.editCustomPwd(this.id, { ...this.ruleForm }).then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.dialogPwd = false
              this.getList()
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
    clear() {
      this.id = ''
      this.ruleForm = {
        password: '',
        confirm_password: ''
      }
    }
  }
}
</script>
