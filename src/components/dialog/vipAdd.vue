<template>
  <el-dialog :visible.sync="show" :title="$t('新增用户')" class="dialog-vip-add" @close="clear">
    <div class="top-font">
      <p class="title">{{ $t('用户手机号和邮箱需要是唯一') }}</p>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <!-- 用户手机号 -->
      <el-form-item :label="$t('用户手机号')" prop="phone">
        <el-input v-model="ruleForm.phone" :placeholder="$t('请输入用户手机号')"></el-input>
      </el-form-item>
      <!-- 用户邮箱 -->
      <el-form-item :label="$t('用户邮箱')" prop="email">
        <el-input v-model="ruleForm.email" :placeholder="$t('请输入用户邮箱')"></el-input>
      </el-form-item>
      <!-- 用户密码 -->
      <el-form-item :label="$t('用户密码')" prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"
          :placeholder="$t('请输入用户密码')"
        ></el-input>
      </el-form-item>
      <!-- 用户昵称 -->
      <el-form-item :label="$t('用户昵称')" prop="name">
        <el-input v-model="ruleForm.name" :placeholder="$t('请输入用户昵称')"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancelDialog('ruleForm')">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        email: '',
        phone: '',
        name: '',
        password: ''
      },
      state: '',
      rules: {
        email: [
          { required: true, message: this.$t('请输入用户邮箱'), trigger: 'blur' },
          { type: 'email', message: this.$t('请输入正确的邮箱地址'), trigger: ['blur', 'change'] }
        ],
        phone: [{ required: true, message: this.$t('请输入用户手机号'), trigger: 'blur' }],
        name: [{ required: true, message: this.$t('请输入用户昵称'), trigger: 'blur' }],
        password: [{ required: true, message: this.$t('请输入用户密码'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.addVip(this.ruleForm).then(res => {
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
      this.ruleForm.email = ''
      this.ruleForm.phone = ''
      this.ruleForm.name = ''
      this.ruleForm.password = ''
    },
    cancelDialog(ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.show = false
    },
    init() {}
  }
}
</script>
<style lang="scss">
.dialog-vip-add {
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
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
  }
  .top-font {
    margin-left: 15%;
    margin-bottom: 20px;
    background-color: #ccc;
    line-height: 30px;
    .title {
      margin-left: 20px;
    }
  }
}
</style>
