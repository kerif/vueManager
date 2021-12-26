<template>
  <el-dialog
    :visible.sync="showHandExcept"
    :title="$t('处理异常')"
    :before-close="close"
    class="handExcept-container"
    @close="clear"
  >
    <el-form>
      <el-form-item :label="$t('处理说明')">
        <el-input
          type="textarea"
          :rows="2"
          :placeholder="$t('请输入处理说明')"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="textarea"
          class="text"
        >
        </el-input>
      </el-form-item>
      <div class="remark">{{ $t('注：处理完成后，订单将恢复到异常前的状态，继续正常流转') }}</div>
    </el-form>
    <div slot="footer">
      <el-button @click="closeHandExcept">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('处理完成') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      textarea: ''
    }
  },
  props: {
    showHandExcept: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  methods: {
    close() {},
    closeHandExcept() {
      this.$emit('passval', false)
    },
    confirm() {},
    clear() {
      this.textarea = ''
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
