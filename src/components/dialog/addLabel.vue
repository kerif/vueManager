<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('添加标签')"
    class="label-dialog"
    width="35%"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      <el-form-item :label="$t('标签名称: ')">
        <el-input v-model="ruleForm.name" @keyup.native.enter="confirm"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
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
      name: ''
    }
  },
  methods: {
    clear() {
      this.ruleForm.name = ''
    },
    init() {},
    confirm() {
      if (!this.ruleForm.name) return this.$message.error(this.$t('请输入标签名称'))
      console.log(this.ruleForm.name, 'this.ruleForm.name')
      this.$request.newLabel({ name: this.ruleForm.name }).then(res => {
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
  }
}
</script>

<style lang="scss">
.label-dialog {
  .el-input {
    width: 40%;
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
