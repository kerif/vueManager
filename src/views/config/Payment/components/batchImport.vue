<template>
  <el-dialog
    :visible.sync="showImport"
    :title="$t('批量导入')"
    :before-close="close"
    class="dialog-batchImport"
    @close="clear"
  >
    <div style="display: flex">
      <div style="height: 200px; display: flex">
        <el-steps direction="vertical" :active="1">
          <el-step title="步骤 1"></el-step>
          <el-step title="步骤 2"></el-step>
        </el-steps>
      </div>
      <div style="flex: 1; padding: 0 20px 0 20px">
        <div>
          <h3>{{ $t('下载模板') }}</h3>
          <div>
            {{
              $t('下载所需模板，按要求填写或修改表格信息后，请以excel形式保存，点击第二部上传模板')
            }}
          </div>
          <el-button size="mini">{{ $t('空白模板') }}</el-button>
        </div>
        <h3>{{ $t('上传模板') }}</h3>
        <el-button size="mini">{{ $t('点击上传') }}</el-button>
        <div slot="footer">
          <el-button type="primary" @click="submit">{{ $t('保存') }}</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    showImport: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  methods: {
    clear() {},
    close() {
      this.$emit('passVal', false)
    },
    submit() {}
  }
}
</script>

<style lang="scss">
.dialog-batchImport {
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
