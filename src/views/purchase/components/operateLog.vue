<template>
  <div style="margin-top: 20px">
    <h4>{{ $t('操作日志') }}</h4>
    <el-table :data="logs" border style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="action_name" :label="$t('行为')"> </el-table-column>
      <el-table-column prop="created_at" :label="$t('日期')"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    logs: {
      type: Array
    }
  }
}
</script>

<style></style>
