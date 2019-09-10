<template>
  <div class="pagination-container">
    <el-pagination
      background
      prev-text="上一页"
      next-text="下一页"
      @size-change="pageParams.handleSizeChange"
      @current-change="pageParams.handleCurrentChange"
      :current-page="pageParams.page"
      :page-sizes="[10, 20, 30]"
      :page-size="pageParams.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageParams.total">
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    pageParams: {
      type: Object
    }
  }
}
</script>
<style lang="scss">
.pagination-container {
  text-align: right;
  .btn-prev, .btn-next {
    padding: 0 10px !important;
  }
}
</style>
