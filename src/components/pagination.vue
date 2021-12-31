<template>
  <div class="pagination-container">
    <div class="left-sider">
      <div class="left-sider-container"><slot></slot></div>
    </div>
    <div class="right-sider">
      <div class="right-sider-container">
        <el-pagination
          background
          :prev-text="$t('上一页')"
          :next-text="$t('下一页')"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.page"
          :page-sizes="[10, 20, 30, 50, 100, 200, 300]"
          :page-size="pageParams.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        >
        </el-pagination>
      </div>
    </div>
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
    },
    saveSize: {
      type: String
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.notNeedInitQuery) return
      const { query } = this.$route
      const keys = Object.keys(query)
      keys.forEach(key => {
        // eslint-disable-next-line no-prototype-builtins
        if (this.pageParams.hasOwnProperty(key)) {
          if (key === 'page' || key === 'size') {
            this.pageParams[key] = Number(query[key])
          } else if (key === 'keyword') {
            this.pageParams[key] = query[key]
          }
        }
      })
    },
    handlePageSizeChange(key, value) {
      if (this.notNeedInitQuery) return
      this.pageParams.handleQueryChange(key, value)
    },
    handleSizeChange(size) {
      this.handlePageSizeChange('size', size)
      if (this.saveSize) {
        let key
        switch (this.saveSize) {
          case 'order':
            key = 'order_size'
            break
          case 'package':
            key = 'package_size'
            break
          case 'ship':
            key = 'ship_size'
            break
        }
        key && localStorage.setItem(key, size)
      }
      this.pageParams.handleSizeChange(size)
    },
    handleCurrentChange(page) {
      this.handlePageSizeChange('page', page)
      this.pageParams.handleCurrentChange(page)
    }
  }
}
</script>
<style lang="scss">
.pagination-container {
  text-align: right;
  .left-sider {
    float: left;
    width: 30%;
    min-width: 100px;
    .left-sider-container {
      text-align: left;
      font-size: 13px;
      padding-top: 5px;
    }
  }
  .right-sider {
    float: right;
    width: 70%;
    text-align: right;
    .right-sider-container {
      text-align: right;
    }
  }
  .btn-prev,
  .btn-next {
    padding: 0 10px !important;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #f5f5f5;
    color: black;
    border: 1px solid #3540a5;
  }
}
</style>
