<template>
  <div class="Features-container">
    <el-form>
      <!-- 开启短信邮件验证 -->
      <el-form-item :label="$t('开启邮箱登录验证：')">
        <el-switch
          v-model="validateList.validate_email"
          :active-text="$t('开')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关')"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
      </el-form-item>
      <!-- 开启短信邮件验证 -->
      <el-form-item :label="$t('开启短信登录验证：')">
        <el-switch
          v-model="validateList.validate_phone"
          :active-text="$t('开')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关')"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <el-button class="save-btn" @click="saveValidate">{{ $t('保存') }}</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      validateList: {
        // 功能配置
        validate_phone: '',
        validate_email: ''
      }
    }
  },
  created() {
    this.getValidate()
  },
  methods: {
    // 获取功能配置
    getValidate() {
      this.$request.getValidate().then(res => {
        if (res.ret) {
          this.validateList = res.data
        }
      })
    },
    // 更新功能配置
    saveValidate() {
      this.$request.updateValidate(this.validateList).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getValidate()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style scoped></style>
