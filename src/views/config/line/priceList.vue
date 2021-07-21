<template>
  <div class="price-list">
    <div class="title">海运路线-渠道1价格表</div>
    <div class="func-btn">
      <el-button size="small">{{ $t('导出价格表') }}</el-button>
      <el-button size="small">{{ $t('导入价格表') }}</el-button>
      <span class="tips">{{ $t('可导出价格表批量批量修改后，再导入表格') }}</span>
    </div>
  </div>
</template>

<script>
export default {}
</script>
<style scoped lang="scss">
.price-list {
  padding: 30px;
  font-size: 14px;
  background-color: #fff;
  .title {
    padding-bottom: 30px;
  }
  .func-btn {
    display: flex;
    align-items: flex-end;
  }
  .tips {
    padding-left: 20px;
    color: #999;
  }
}
</style>
