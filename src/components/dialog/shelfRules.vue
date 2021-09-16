<template>
  <el-dialog :visible.sync="show" :title="$t('上架规则')" class="dialog-shelfRules" @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" label-width="120px">
      <!--无人认领专区  -->
      <el-form-item :label="$t('无人认领专区')">
        <el-select placeholder="请选择">
          <el-option> </el-option>
        </el-select>
      </el-form-item>
      <div style="margin-left: 20px">
        *货区可多选，当包裹为无人认领时，强制放入专区，不受其他规则限制
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {},
      number: []
    }
  },
  methods: {
    submit() {
      this.$request.unclaimedArea().then(res => {
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
  }
}
</script>
<style lang="scss" scoped>
.dialog-shelfRules {
  /deep/ .el-dialog__header {
    background-color: #0e102a;
  }
  /deep/.el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  /deep/.el-dialog__close {
    color: #fff;
  }
}
</style>
