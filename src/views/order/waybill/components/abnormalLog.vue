<template>
  <el-dialog
    :visible.sync="showExplain"
    :title="$t('异常说明')"
    :before-close="close"
    class="abnormalLog-container"
    @close="clear"
  >
    <div>
      <el-row :gutter="20">
        <el-col :span="6">{{ $t('操作记录') }}</el-col>
        <el-col :span="18"></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">{{ $t('操作说明') }}</el-col>
        <el-col :span="18"></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">{{ $t('操作人') }}</el-col>
        <el-col :span="18"></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">{{ $t('时间') }}</el-col>
        <el-col :span="18"></el-col>
      </el-row>
    </div>
    <div slot="footer">
      <el-button @click="close">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('去处理') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    showExplain: {
      type: Boolean,
      default: false
    }
    // logId: {
    //   type: Number,
    //   required: true
    // }
  },
  created() {},
  methods: {
    close() {
      this.$emit('getLog', false)
    },
    confirm() {},
    cancel() {},
    clear() {}
  }
}
</script>

<style lang="scss">
.abnormalLog-container {
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
}
</style>
