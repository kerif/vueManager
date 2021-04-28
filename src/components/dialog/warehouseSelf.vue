<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('设为自提签收')"
    class="dialog-warehouse-self"
    width="35%"
    @close="clear"
  >
    <el-form ref="ruleForm" class="demo-ruleForm" label-position="top">
      <!-- 转运单号 -->
      <el-form-item :label="$t('转运单号')">
        <span>{{ this.order }}</span>
        <p v-if="status === 3" class="red-text">{{ $t('该订单还未发货，是否确认自提签收') }}</p>
      </el-form-item>
      <!-- 签收备注 -->
      <el-form-item :label="$t('签收备注')">
        <el-input
          type="textarea"
          v-model="remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入备注')"
        ></el-input>
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
      id: '',
      remark: '',
      order: '',
      status: ''
    }
  },
  methods: {
    confirm() {
      this.$request
        .setSelf(this.id, {
          remark: this.remark
        })
        .then(res => {
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
      this.remark = ''
      this.order = ''
      this.status = ''
    },
    init() {
      console.log(this.id, 'id')
    }
  }
}
</script>
<style lang="scss">
.dialog-warehouse-self {
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
  .red-text {
    color: #f00;
  }
}
</style>
