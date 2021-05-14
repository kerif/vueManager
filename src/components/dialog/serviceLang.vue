<template>
  <el-dialog
    :visible.sync="show"
    :title="line.name + '的翻译内容'"
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
      <!-- 增值服务名称 -->
      <el-form-item :label="$t('增值服务名称')" prop="name">
        <el-input v-model="ruleForm.name" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('备注')" prop="remark">
        <el-input
          type="textarea"
          v-model="ruleForm.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入')"
        ></el-input>
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
        remark: '',
        language: ''
      },
      state: '',
      rules: {
        name: [{ required: true, message: this.$t('请输入增值服务名称'), trigger: 'blur' }],
        remark: [{ required: true, message: this.$t('请输入备注'), trigger: 'blur' }]
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
    // 获取订单增值的语言
    getLang() {
      this.$request
        .serviceLang(this.line.id, {
          lang: this.ruleForm.language
        })
        .then(res => {
          this.ruleForm.name = res.data.name
          this.ruleForm.remark = res.data.remark
          console.log(this.ruleForm, 'this.ruleForm')
        })
    },
    // 获取包裹增值服务的语言
    getPackage() {
      this.$request
        .packageLang(this.line.id, {
          lang: this.ruleForm.language
        })
        .then(res => {
          this.ruleForm.name = res.data.name
          this.ruleForm.remark = res.data.remark
          console.log(this.ruleForm, 'this.ruleForm')
        })
    },
    confirm(formName) {
      console.log(this.state, 'state')
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.state === 'service') {
            this.$request.updateServiceLang(this.line.id, this.ruleForm).then(res => {
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
          } else if (this.state === 'package') {
            this.$request.updatePackageLang(this.line.id, this.ruleForm).then(res => {
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
          }
        } else {
          return false
        }
      })
    },
    clear() {
      this.ruleForm.name = ''
      this.ruleForm.remark = ''
      this.state = ''
    },
    cancelDialog(ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.show = false
    },
    init() {
      // this.line = this.line
      // this.lang = this.lang
      this.ruleForm.language = this.lang.language_code
      // this.transCode = this.transCode
      // this.state = this.state
      console.log(this.line, 'line')
      console.log(this.lang, 'lang')
      console.log(this.transCode, 'this.transCode')
      console.log(this.ruleForm.language, 'this.ruleForm.language')
      console.log(this.state, 'state')
      if (this.transCode === 1) {
        if (this.state === 'service') {
          this.getLang()
        } else if (this.state === 'package') {
          this.getPackage()
        }
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
