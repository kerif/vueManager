<template>
  <el-dialog :visible.sync="show" title="添加物品属性" class="change-status-dialog dialog-container" width="35%" @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="属性名称: ">
        <el-input v-model="ruleForm.cn_name"></el-input>
      </el-form-item>
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
        cn_name: '',
        en_name: 'bbb'
      }
    }
  },
  methods: {
    clear () {
      this.ruleForm.cn_name = ''
    },
    confirm () {
      if (!this.ruleForm.cn_name) return this.$message.error('请输入属性名称')
      console.log(this.ruleForm.cn_name, 'this.ruleForm.cn_name')
      this.$request.addPackage({
        cn_name: this.ruleForm.cn_name,
        en_name: this.ruleForm.en_name
      }).then(res => {
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
  .el-input {
    width: 40%;
  }
}
</style>
