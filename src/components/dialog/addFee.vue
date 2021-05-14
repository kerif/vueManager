<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('额外收录信息')"
    class="dialog-fee"
    width="35%"
    @close="clear"
  >
    <el-form :model="feeList" ref="ruleForm" class="demo-ruleForm" label-position="top">
      <!-- 显示名称 -->
      <el-form-item :label="$t('显示名称')">
        <el-input v-model="feeList.extra_remark_name"> </el-input>
      </el-form-item>
      <!-- 说明 -->
      <el-form-item :label="$t('说明')">
        <el-input
          type="textarea"
          v-model="feeList.extra_remark_instruction"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入备注')"
        ></el-input>
      </el-form-item>
      <!-- 是否显示 -->
      <el-form-item :label="$t('*是否启用')">
        <el-switch
          v-model="feeList.extra_remark_enabled"
          :active-text="$t('开')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关')"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      feeList: {
        extra_remark_name: '', // 名称
        extra_remark_instruction: '', // 说明
        extra_remark_enabled: 0 // 是否可用
      }
    }
  },
  methods: {
    getList() {
      this.$request.getFee(this.id).then(res => {
        this.feeList = res.data
      })
    },
    confirm() {
      console.log(Number(this.feeList.extra_remark_enabled), 'extra_remark_enabled')
      this.$request.updateFee(this.id, this.feeList).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
          this.success()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    clear() {
      this.feeList.extra_remark_name = ''
      this.feeList.extra_remark_instruction = ''
      this.feeList.extra_remark_enabled = ''
    },
    init() {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.dialog-fee {
  .el-dialog__body {
    margin-left: 20px !important;
  }
  .el-input {
    width: 70%;
  }
  .el-textarea__inner {
    width: 70%;
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
