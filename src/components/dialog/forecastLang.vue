<template>
  <el-dialog
    :visible.sync="show"
    :title="line.name + $t('的翻译内容')"
    class="dialog-pay-lang"
    @close="clear"
  >
    <div class="lang-sty">
      <p>
        <span class="el-icon-warning icon-info"></span>
        {{ $t('请注意以下内容请输入对应的') + '【' + this.lang.name + '】' + $t('信息') }}
      </p>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item :label="$t('描述')" prop="name">
        <el-input
          type="textarea"
          v-model="ruleForm.name"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancelDialog('ruleForm')">{{ $t('取消') }}</el-button>
      <el-button :loading="$store.state.btnLoading" type="primary" @click="confirm('ruleForm')">{{
        $t('确定')
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        language: ''
      },
      state: '',
      rules: {
        name: [{ required: true, message: this.$t('请输入描述'), trigger: 'blur' }]
      },
      line: {
        id: '',
        name: ''
      },
      lang: {
        name: '',
        language_code: ''
      },
      transCode: ''
    }
  },
  methods: {
    getLang() {
      this.$request
        .forecastLangDetails(this.line.id, {
          lang: this.ruleForm.language
        })
        .then(res => {
          this.ruleForm.name = res.data.name
        })
    },
    clear() {
      this.ruleForm.name = ''
    },
    cancelDialog(ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.show = false
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.forecastLang(this.line.id, this.ruleForm).then(res => {
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
          })
        }
      })
    },
    init() {
      this.ruleForm.language = this.lang.language_code
      if (this.transCode === 1) {
        this.getLang()
      }
    }
  }
}
</script>
