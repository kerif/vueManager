<template>
  <div class="pagination-container">
    <el-pagination
      background
      prev-text="上一页"
      next-text="下一页"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
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
    },
    notNeedInitQuery: {
      type: Boolean,
      default: true
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (this.notNeedInitQuery) return
      const { query } = this.$route
      const keys = Object.keys(query)
      keys.forEach(key => {
        if (this.pageParams.hasOwnProperty(key)) {
          if (key === 'page' || key === 'size') {
            this.pageParams[key] = Number(query[key])
          } else if (key === 'keyword') {
            this.pageParams[key] = query[key]
          }
        }
      })
    },
    handlePageSizeChange (key, value) {
      if (this.notNeedInitQuery) return
      this.pageParams.handleQueryChange(key, value)
    },
    handleSizeChange (size) {
      this.handlePageSizeChange('size', size)
      this.pageParams.handleSizeChange(size)
    },
    handleCurrentChange (page) {
      this.handlePageSizeChange('page', page)
      this.pageParams.handleCurrentChange(page)
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
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #f5f5f5;
    color: black;
    border: 1px solid #3540A5;
  }
}
</style>
