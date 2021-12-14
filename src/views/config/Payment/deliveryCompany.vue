<template>
  <div class="delivery-container">
    <div>
      <div></div>
      <div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <el-button>{{ $t('新增') }}</el-button>
    <el-table :data="ruleData" border style="width: 100%">
      <el-table-column type="index" width="180"> </el-table-column>
      <el-table-column prop="name" :label="$t('操作')"> </el-table-column>
      <el-table-column prop="address" :label="$t('规则名称')"> </el-table-column>
      <el-table-column prop="date" :label="$t('关键词')"> </el-table-column>
      <el-table-column prop="name" :label="$t('行为')"> </el-table-column>
      <el-table-column prop="address" :label="$t('结果')"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleData: []
    }
  }
}
</script>

<style lang="scss">
.delivery-container {
}
</style>
