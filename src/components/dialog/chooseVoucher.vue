<template>
  <el-dialog :visible.sync="show" title="请选择" class="change-status-dialog dialog-container" width="35%" @close="clear">
    <div class="status-box">
        <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">客户组投放</el-radio>
            <el-radio :label="2">单个客户投放</el-radio>
        </el-radio-group>
    </div>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      ruleForm: {
        status: []
      }
    }
  },
  methods: {
    clear () {
      this.ruleForm.status = []
    },
    confirm () {
      console.log(this.ruleForm.status)
      if (!this.ruleForm.status) {
        return this.$message.info('请选择客户或客户组')
      }
      this.show = false
      dialog({ type: 'selectCus', id: this.ruleForm.status })
      console.log(this.ruleForm.status, '我是id')
    //   this.$request.submitSuggest(this.id, this.ruleForm).then(res => {
    //     if (res.ret) {
    //       this.$notify({
    //         type: 'success',
    //         title: '操作成功',
    //         message: res.msg
    //       })
    //       this.show = false
    //       this.success()
    //     } else {
    //       this.$message({
    //         message: res.msg,
    //         type: 'error'
    //       })
    //     }
    //     this.show = false
    //   })
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
}
</style>
