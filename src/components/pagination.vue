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
        if (key === 'page' || key === 'size') {
          this.pageParams[key] = Number(query[key])
        }
      })
    },
    handerPageSizeChange (key, value) {
      if (this.notNeedInitQuery) return
      const { name, params, query } = this.$route
      this.$router.replace({
        name,
        params,
        query: {
          ...query,
          [key]: value
        }
      })
    },
    handleSizeChange (size) {
      this.handerPageSizeChange('size', size)
      this.pageParams.handleSizeChange(size)
    },
    handleCurrentChange (page) {
      this.handerPageSizeChange('page', page)
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
}
</style>
