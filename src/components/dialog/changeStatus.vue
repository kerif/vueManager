<template>
  <el-dialog :visible.sync="show" title="修改状态" class="change-status-dialog dialog-container" width="35%" @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
    <div class="status-box">
      <el-select v-model="ruleForm.status">
        <el-option label="未处理" :value="1"></el-option>
        <el-option label="已处理" :value="2"></el-option>
      </el-select>
    </div>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        status: ''
      }
    }
  },
  methods: {
    clear () {
      this.ruleForm.status = ''
    },
    confirm () {
      this.$request.submitSuggest(this.id, this.ruleForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
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
.change-status-dialog {
  .status-box {
    text-align: center;
    margin: 20 0;
  }
  .el-input {
    width: 70% !important;
  }
}
</style>
