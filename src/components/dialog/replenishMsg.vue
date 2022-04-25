<template>
  <el-dialog :visible.sync="show" :title="$t('审核')" width="35%" @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" label-position="top">
      <el-form-item :label="$t('金额')" prop="confirm_amount" v-if="this.state === 'pass'">
        <el-input v-model="ruleForm.confirm_amount" :placeholder="$t('请输入')">
          <template slot="append">{{ this.currencyUnit }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('备注')" prop="confirm_remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入备注')"
          v-model="ruleForm.confirm_remark"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" :loading="$store.state.btnLoading" @click="submit">{{
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
        confirm_amount: '',
        confirm_remark: ''
      },
      id: '',
      state: '',
      currencyUnit: ''
    }
  },
  methods: {
    submit() {
      if (this.state === 'pass') {
        this.$request.orderApproved(this.id, this.ruleForm).then(res => {
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
        this.$request.orderRefused(this.id, this.ruleForm).then(res => {
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
    },
    clear() {
      this.ruleForm.confirm_amount = ''
      this.ruleForm.confirm_remark = ''
    }
  }
}
</script>

<style></style>
