<template>
  <div class="pagination_and_buttons">
    <div class="buttons">
      <el-button
        v-for="(item, index) in lists"
        :key="index"
        @click="item.method"
        :loading="item.loading"
        :disabled="item.disabled ? item.disabled : false"
      >
        <!-- {{item.name ? item.name : item.CName}} -->
        {{ item.name }}
      </el-button>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="pageParams.handleSizeChange"
        @current-change="pageParams.handleCurrentChange"
        :current-page="pageParams.page"
        :page-sizes="sizesList"
        :page-size="pageParams.size"
        layout="sizes, prev, pager, next, jumper, slot, ->, total"
        :total="+pageParams.total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    sizesList: {
      type: Array,
      default: function () {
        return [10, 20, 50, 100, 200]
      }
    },
    pageParams: {
      type: Object
    },
    lists: {
      type: Array
    }
  }
}
</script>
<style lang="scss" scoped>
.pagination_and_buttons {
  padding: 20px 5px;
  background: #fff;
  .pagination,
  .buttons {
    text-align: right;
  }
  .pagination {
    margin-top: 10px;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
  .el-button {
    color: #636f7a;
    border-color: #bfbfbf;
    padding: 8px 13px;
    font-size: 14px;
    text-align: center;
    margin-right: 5px;
    &:hover {
      background-color: #d4d4d4;
      border: 1px solid #c4c4c4;
    }
    &:focus {
      border-color: #bfbfbf;
    }
    &:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
    &:last-child {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
  .is-disabled {
    &:focus,
    &:hover {
      color: #888;
    }
  }
  .el-pagination {
    .el-pagination__sizes {
      margin: 0 0 0 10px;
    }
    .el-pagination__total {
      margin: 0 0 0 10px;
    }
  }
  /deep/.way-list-container .el-icon {
    display: inline-block !important;
  }
}
</style>
