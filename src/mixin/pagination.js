export default {
  data() {
    return {
      page_params: {
        page: 1,
        size: 10,
        total: 0,
        keyword: '',
        handleCurrentChange: this.handleCurrentChange,
        handleSizeChange: this.handleSizeChange,
        handleQueryChange: this.handleQueryChange
      }
    }
  },
  methods: {
    // 分页
    handleCurrentChange(pageId) {
      this.page_params.page = pageId
      this.getList()
    },
    // 分页size
    handleSizeChange(pageSize) {
      this.page_params.page = 1
      this.handleQueryChange('page', this.page_params.page)
      // localStorage.setItem('size', this.page_params.size)
      this.page_params.size = pageSize
      this.getList()
    },
    // 搜索
    goSearch(is) {
      this.page_params.page = 1
      this.page_params.size = 10
      this.handleQueryChange('page', this.page_params.page)
      this.handleQueryChange('size', this.page_params.size)
      this.handleQueryChange('keyword', this.page_params.keyword)
      this.getList(is)
    },
    handleQueryChange(key, value) {
      const { name, params, query } = this.$route
      this.$router.replace({
        name,
        params,
        query: {
          ...query,
          [key]: value
        }
      })
    }
  }
}
