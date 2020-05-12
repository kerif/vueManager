<template>
  <el-dialog :visible.sync="show" :title="$t('添加物品属性')" class="props-dialog" width="35%" @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      <el-form-item :label="$t('属性名称: ')">
        <el-input v-model="ruleForm.cn_name" @keyup.native.enter="confirm"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        cn_name: ''
      }
    }
  },
  methods: {
    clear () {
      this.ruleForm.cn_name = ''
    },
    confirm () {
      if (!this.ruleForm.cn_name) return this.$message.error(this.$t('请输入属性名称'))
      console.log(this.ruleForm.cn_name, 'this.ruleForm.cn_name')
      this.$request.addPackage({
        cn_name: this.ruleForm.cn_name
      }).then(res => {
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
.props-dialog {
  .el-input {
    width: 40%;
  }
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }

  .el-dialog__close {
    color: #FFF;
  }
}
</style>
