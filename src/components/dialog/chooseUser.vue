<template>
  <el-dialog :visible.sync="show" title="选择客户" class="user-container" @close="clear">
    <div class="searchUser">
      <el-input placeholder="请输入内容" v-model="keyword"
      @keyup.enter.native="getList">
        <template slot="append">
          <span @click="getList" class="search-btn">搜索</span>
        </template>
      </el-input>
    </div>
    <el-table
      :data="tableData"
      border
      @row-click="onRowChange"
      style="width: 100%">
      <el-table-column>
        <template slot-scope="scope">
          <el-radio v-model="chooseId" :label="scope.row.id"></el-radio>
        </template>
       </el-table-column>
      <!-- 客户ID -->
      <el-table-column
        prop="id"
        label="客户ID">
      </el-table-column>
      <!-- 客户昵称 -->
        <el-table-column
        prop="name"
        label="客户昵称">
      </el-table-column>
      <!-- 最后登录时间 -->
        <el-table-column
        prop="last_login_at"
        label="最后登录时间">
      </el-table-column>
    </el-table>
    <div class="pagination-box">
        <nle-pagination :pageParams="page_params"></nle-pagination>
      </div>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data () {
    return {
      tableData: [],
      keyword: '',
      chooseId: 0,
      user: {}
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getUsers({
        keyword: this.keyword,
        page: this.page_params.page,
        size: this.page_params.size
        // status: this.page_params.group
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.tableData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    confirm () {
      if (!this.chooseId) {
        return this.$message.error('请选择客户')
      }
      this.success(this.user)
      this.show = false
    },
    onRowChange (row) {
      this.chooseId = row.id
      this.user = row
    },
    clear () {
      this.keyword = ''
      this.chooseId = ''
    },
    init () {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.user-container {
  .searchUser {
    width: 40%;
    float: right;
    margin: 10px 0;
  }
  .search-btn {
    cursor: pointer;
  }
  .pagination-box {
    margin-top: 10px;
  }
}
</style>
