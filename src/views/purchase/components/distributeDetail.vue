<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('分货详细')"
    :before-close="close"
    @close="clear"
  ></el-dialog>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style></style>
