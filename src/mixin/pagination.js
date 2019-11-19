export default {
  data () {
    return {
      page_params: {
        page: 1,
        size: 10,
        total: 0,
        keyword: '',
        handleCurrentChange: this.handleCurrentChange,
        handleSizeChange: this.handleSizeChange
      }
    }
  },
  created () {
    if (this.$store.state.search_flag) {
      this.page_params.keyword && (this.page_params.keyword = '')
    }
    this.getList && this.getList()
  },
  methods: {
    // 分页
    handleCurrentChange (pageId) {
      this.page_params.page = pageId
      this.getList()
    },
    // 分页size
    handleSizeChange (pageSize) {
      this.page_params.page = 1
      this.page_params.size = pageSize
      this.getList()
    },
    // 搜索
    goSearch (is) {
      this.page_params.page = 1
      this.page_params.size = 10
      this.getList(is)
    }
  }
}
