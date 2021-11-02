<template>
  <el-drawer
    :title="$t('导出订单详情')"
    :visible.sync="showTmpDrawer"
    class="exportTmp-container"
    :before-close="close"
    @opened="open()"
  >
    <el-button>{{ $t('新增模板') }}</el-button>
    <el-button>{{ $t('确定导出') }}</el-button>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    showTmpDrawer: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('receiveTmp', false)
    },
    open() {}
  }
}
</script>

<style lang="scss">
.exportTmp-container {
  /deep/.el-drawer__open .el-drawer.rtl {
    width: 90% !important;
  }
  .el-drawer.rtl {
    overflow: scroll;
  }
  .el-drawer__header {
    margin-bottom: 0;
  }
}
</style>
