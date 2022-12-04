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
      <!-- 名称 -->
      <el-form-item :label="$t('名称')" prop="name">
        <el-input v-model="ruleForm.name" :placeholder="$t('请输入')"></el-input>
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
        name: '',
        language: ''
      },
      state: '',
      rules: {
        name: [{ required: true, message: this.$t('请输入名称'), trigger: 'blur' }]
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
        .voucherLang(this.line.id, {
          lang: this.ruleForm.language
        })
        .then(res => {
          this.ruleForm.name = res.data.name
        })
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.updateVoucherLang(this.line.id, this.ruleForm).then(res => {
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
        } else {
          return false
        }
      })
    },
    clear() {
      this.ruleForm.name = ''
    },
    cancelDialog(ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.show = false
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
<style lang="scss">
.dialog-pay-lang {
  .el-input {
    width: 40% !important;
    margin-left: 50px;
  }
  .el-textarea {
    width: 40% !important;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 150px;
  }
  .el-form-item__error {
    margin-left: 210px !important;
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
  .lang-sty {
    line-height: 40px;
    color: #e6a344;
    margin-left: 80px;
    width: 66%;
    p {
      background-color: #fdf6ed;
    }
  }
  .icon-info {
    color: #e6a344;
    font-size: 18px;
    margin-left: 15px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
}
</style>
