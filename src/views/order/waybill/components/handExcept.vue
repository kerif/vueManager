<template>
  <el-dialog
    :visible.sync="showHandExcept"
    :title="$t('处理异常')"
    :before-close="close"
    class="handExcept-container"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm">
      <el-form-item :label="$t('处理说明')">
        <el-input
          type="textarea"
          :rows="2"
          :placeholder="$t('请输入处理说明')"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="ruleForm.textarea"
          class="text"
        >
        </el-input>
      </el-form-item>
      <div class="remark">{{ $t('注：处理完成后，订单将恢复到异常前的状态，继续正常流转') }}</div>
    </el-form>
    <div slot="footer">
      <el-button @click="close">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('处理完成') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        textarea: ''
      }
    }
  },
  props: {
    showHandExcept: {
      type: Boolean,
      default: false
    },
    selectIDs: {
      type: Array,
      required: true
    }
  },
  created() {},
  methods: {
    close() {
      this.$emit('reserve', false)
    },
    confirm() {
      let params = {
        remark: this.ruleForm.textarea
      }
      this.$request.restoreOrder(params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('成功'),
            message: res.msg
          })
          this.$emit('reserve', false)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {
      this.ruleForm.textarea = ''
    }
  }
}
</script>

<style lang="scss">
.abnormal-container {
  font-size: 14px;
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
  .text {
    width: 80%;
  }
  .remark {
    font-size: 14px;
  }
}
</style>
