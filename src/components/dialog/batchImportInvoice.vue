<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('批量导入发货单')"
    class="batch-import-invoice"
    @close="clear"
  >
    <el-form>
      <el-form-item :label="$t('第一步: 下载模板')">
        <el-button>{{ $t('下载模板') }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('第二步: 上传模板')">
        <el-button>{{ $t('点击上传') }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    clear() {}
  }
}
</script>

<style>
.batch-import-invoice {
}
</style>
