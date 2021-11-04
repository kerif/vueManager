<template>
  <el-dialog :visible.sync="show" :title="$t('修改密码')" class="password-container" @close="clear">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-row :gutter="20">
        <!-- 用户名 -->
        <el-col :span="6" :offset="5">
          <p>{{ $t('用户名') }}</p>
          <p>&nbsp;&nbsp;{{ ruleForm.username }}</p>
        </el-col>
        <el-col :span="7" :offset="2">
          <p>{{ $t('邮箱') }}</p>
          <p>&nbsp;&nbsp;{{ ruleForm.email }}</p>
        </el-col>
        <!-- 备注 -->
        <el-row :gutter="20">
          <el-col :span="6" :offset="5">
            <el-form-item :label="$t('新密码')" prop="password">
              <el-input
                v-model="ruleForm.password"
                type="password"
                :placeholder="$t('请输入密码')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="2">
            <el-form-item :label="$t('确认密码')" prop="confirm_password">
              <el-input
                v-model="ruleForm.confirm_password"
                type="password"
                :placeholder="$t('请再次输入密码')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('请再次输入密码')))
      } else if (value !== this.ruleForm.password) {
        callback(new Error(this.$t('两次输入密码不一致!')))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        password: '',
        confirm_password: ''
      },
      rules: {
        password: [
          { required: true, message: this.$t('请输入密码'), trigger: 'blur' },
          { min: 8, max: 32, message: this.$t('长度在8到20个字符'), trigger: 'change' }
        ],
        confirm_password: [
          { required: true, validator: validatePass2, trigger: 'blur' },
          { min: 8, max: 20, message: this.$t('长度在8到20个字符'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    getList() {
      this.$request.EditVip(this.id).then(res => {
        this.ruleForm = res.data
      })
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.editVipPsd(this.id, this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('成功'),
                message: res.msg
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
      this.ruleForm.password = ''
      this.ruleForm.confirm_password = ''
    },
    init() {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.password-container {
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
