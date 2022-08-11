<template>
  <el-dialog
    :visible.sync="show"
    :title="value == 'insurance' ? $t('保险说明') : $t('关税说明')"
    class="dialog-addCost"
    @close="clear"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item :label="$t('中文')" prop="cn">
        <el-input
          v-model="ruleForm.cn"
          type="textarea"
          :placeholder="$t('请输入')"
          :autosize="{ minRows: 2, maxRows: 4 }"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('英文')" prop="en">
        <el-input
          type="textarea"
          v-model="ruleForm.en"
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
        name: ''
      },
      staff: '',
      id: '',
      value: '',
      rules: {
        cn: [{ required: true, message: this.$t('请输入中文'), trigger: 'blur' }],
        en: [{ required: true, message: this.$t('请输入英文'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    getList() {
      if (this.value === 'insurance') {
        this.$request.getExplanation().then(res => {
          if (res.ret) {
            this.ruleForm = res.data
          } else {
            this.$notify({
              message: res.msg,
              type: 'error',
              title: this.$t('操作失败')
            })
          }
        })
      } else if (this.value === 'tariff') {
        this.$request.tariffExplanation().then(res => {
          if (res.ret) {
            this.ruleForm = res.data
          } else {
            this.$notify({
              message: res.msg,
              type: 'error',
              title: this.$t('操作失败')
            })
          }
        })
      }
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.value === 'insurance') {
            this.$request.updateExplanation(this.ruleForm).then(res => {
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
          } else if (this.value === 'tariff') {
            this.$request.uploadTariffExplanation(this.ruleForm).then(res => {
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
        } else {
          return false
        }
      })
    },
    clear() {
      this.ruleForm.cn = ''
      this.ruleForm.en = ''
    },
    cancelDialog(ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.show = false
    },
    init() {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.dialog-addCost {
  .el-input {
    width: 40%;
    margin-left: 50px;
  }
  .el-textarea {
    width: 40%;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 200px;
  }
  .el-form-item__error {
    margin-left: 300px !important;
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
}
</style>
