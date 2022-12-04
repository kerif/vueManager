<template>
  <div class="password">
    <div class="content-style">
      <el-form
        :model="params"
        :rules="rules"
        ref="passwordForm"
        label-width="100px"
        class="password-form"
      >
        <el-form-item prop="origin_password" class="input teshu" :label="this.$t('原密码')">
          <el-input
            type="password"
            v-model="params.origin_password"
            auto-complete="off"
            :placeholder="this.$t('请输入旧密码')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="new_password" class="input" :label="this.$t('新密码')">
          <el-input
            type="password"
            v-model="params.new_password"
            auto-complete="off"
            :placeholder="this.$t('请输入新密码')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="new_confirm_password" class="input" :label="$t('确认新密码')">
          <el-input
            type="password"
            v-model="params.new_confirm_password"
            auto-complete="off"
            :placeholder="this.$t('请再次输入新密码')"
          ></el-input>
        </el-form-item>
        <el-form-item class="submit" label-width="100px">
          <el-button @click="clear" :disabled="$store.state.btnLoading">{{ $t('重置') }}</el-button>
          <el-button
            type="primary"
            @click="submit('passwordForm')"
            :loading="$store.state.btnLoading"
            >{{ $t('确定') }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'password',
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('请再次输入密码')))
      } else if (value !== this.params.new_password) {
        callback(new Error(this.$t('两次输入密码不一致!')))
      } else {
        callback()
      }
    }
    return {
      params: {
        origin_password: '',
        new_password: '',
        new_confirm_password: ''
      },
      rules: {
        origin_password: [
          { required: true, message: this.$t('请输入原密码'), trigger: 'blur' },
          { min: 6, max: 32, message: this.$t('长度在6到32个字符'), trigger: 'change' }
        ],
        new_password: [
          { required: true, message: this.$t('请输入新密码'), trigger: 'blur' },
          { min: 6, max: 32, message: this.$t('长度在6到32个字符'), trigger: 'change' }
        ],
        new_confirm_password: [
          { required: true, validator: validatePass2, trigger: 'blur' },
          { min: 6, max: 32, message: this.$t('长度在6到32个字符'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.changePassword(this.params).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('成功'),
                message: res.msg
              })
              this.$store.commit('saveFileterAfterRouterMap', {
                fileterAfterRouterMap: [],
                isPermissionFilter: []
              })
              this.$store.commit('savePermissionStatus', false)
              this.$store.commit('removeToken')
              this.$router.replace({ name: 'login' })
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
      this.params = {
        old_password: '',
        new_password: '',
        new_password2: ''
      }
    }
  }
}
</script>
<style lang="scss">
.password {
  padding: 0 20px;
  .content-style {
    background-color: #fff !important;

    // min-height: calc(100vh - 170px);
    .password-form {
      background-color: #fff !important;
      // margin-left: 10%;
      padding: 5% 0 12%;
      max-width: 500px;
    }
  }
}
</style>
