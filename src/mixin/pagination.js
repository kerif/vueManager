export default {
  data () {
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
  // created () {
  //   if (this.$store.state.search_flag) {
  //     this.page_params.keyword && (this.page_params.keyword = '')
  //   }
  //   this.getList && this.getList()
  // },
  methods: {
    // 分页
    handleCurrentChange (pageId) {
      this.page_params.page = pageId
      this.getList()
    },
    // 分页size
    handleSizeChange (pageSize) {
      this.page_params.page = 1
      this.handleQueryChange('page', this.page_params.page)
      this.page_params.size = pageSize
      this.getList()
    },
    // 搜索
    goSearch (is) {
      this.page_params.page = 1
      this.page_params.size = 10
      this.handleQueryChange('page', this.page_params.page)
      this.handleQueryChange('size', this.page_params.size)
      this.handleQueryChange('keyword', this.page_params.keyword)
      this.getList(is)
    },
    handleQueryChange (key, value) {
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
