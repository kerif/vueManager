<template>
  <div class="person-info">
    <div class="content-style">
      <el-form
        :model="params"
        :rules="rules"
        ref="passwordForm"
        label-width="100px"
        class="password-form"
        label-position="left"
      >
        <div class="title">{{ $t('基本资料') }}</div>
        <el-form-item prop="user_name" class="input teshu" :label="this.$t('姓名')">
          <el-input
            v-model="params.user_name"
            auto-complete="off"
            :placeholder="this.$t('请输入姓名')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone" class="input" :label="this.$t('手机号')">
          <el-input
            v-model="params.phone"
            auto-complete="off"
            :placeholder="this.$t('请输入手机号')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" class="input" :label="$t('邮箱')">
          <el-input
            v-model="params.email"
            auto-complete="off"
            :placeholder="this.$t('请输入邮箱')"
          ></el-input>
        </el-form-item>
        <div class="title">{{ $t('企业微信') }}</div>
        <el-form-item prop="company_wx" class="input teshu" :label="this.$t('微信号')">
          <el-input
            v-model="params.company_wx"
            auto-complete="off"
            :placeholder="this.$t('请输入微信号')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="wx_name" class="input" :label="this.$t('微信昵称')">
          <el-input
            v-model="params.wx_name"
            auto-complete="off"
            :placeholder="this.$t('请输入微信昵称')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="wx_phone" class="input" :label="$t('手机号')">
          <el-input
            v-model="params.wx_phone"
            auto-complete="off"
            :placeholder="this.$t('请输入手机号')"
          ></el-input>
        </el-form-item>
        <el-form-item class="submit" label-width="100px">
<!--          <el-button @click="clear" :disabled="$store.state.btnLoading">{{ $t('重置') }}</el-button>-->
          <el-button
            type="primary"
            @click="submit('passwordForm')"
            :loading="$store.state.btnLoading"
            >{{ $t('保存') }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'personInfo',
  data() {
    return {
      params: {
        user_name: '',
        phone: '',
        email: '',
        company_wx: '',
        wx_name: '',
        wx_phone: ''
      },
      rules: {
        user_name: [
          { required: true, message: this.$t('请输入姓名'), trigger: 'blur' },
          { min: 6, max: 32, message: this.$t('长度在6到32个字符'), trigger: 'change' }
        ],
        phone: [
          { required: true, message: this.$t('请输入手机号'), trigger: 'blur' },
          { min: 11, max: 11, message: this.$t('请输入正确的手机号'), trigger: 'change' }
        ],
        email: [
          { required: true, message: this.$t('请输入邮箱'), trigger: 'blur' },
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
              // this.$notify({
              //   type: 'success',
              //   title: this.$t('成功'),
              //   message: res.msg
              // })
              // this.$store.commit('saveFileterAfterRouterMap', {
              //   fileterAfterRouterMap: [],
              //   isPermissionFilter: []
              // })
              // this.$store.commit('savePermissionStatus', false)
              // this.$store.commit('removeToken')
              // this.$router.replace({ name: 'login' })
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        } else {
          this.$notify({
            type: 'warning',
            title: this.$t('保存失败'),
            message: '请输入正确的信息'
          })
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
.person-info {
  padding: 10px 16px;
  height: calc(100% - 20px);
  background-color: #fff !important;
  overflow-y: auto;
  .password-form {
    .title {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 16px;
    }
  }
  .content-style {
    max-width: 500px;
  }
}
</style>
