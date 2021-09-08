<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('选择客户')"
    width="80%"
    class="dialog-selectCustomer"
    @close="clear"
  >
    <div class="searchUser">
      <el-input :placeholder="$t('请输入关键字')" v-model="keyword" @keyup.enter.native="getList">
        <template slot="append">
          <span @click="getList" class="search-btn">{{ $t('搜索') }}</span>
        </template>
      </el-input>
    </div>
    <el-table :data="tableData" border @row-click="onRowChange" style="width: 100%">
      <el-table-column>
        <template slot-scope="scope">
          <el-radio v-model="chooseId" :label="scope.row.id"></el-radio>
        </template>
      </el-table-column>
      <!-- 客户组名 -->
      <el-table-column prop="id" :label="$t('客户ID')"> </el-table-column>
      <!-- 人数 -->
      <el-table-column prop="name" :label="$t('客户昵称')"> </el-table-column>
      <!-- 创建时间 -->
      <el-table-column prop="last_login_at" :label="$t('创建时间')"> </el-table-column>
    </el-table>
    <div class="pagination-box">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm" :loading="$store.state.btnLoading">{{
        $t('确定')
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
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
    getList() {
      this.$request
        .getUsers({
          keyword: this.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    confirm() {
      if (!this.chooseId) {
        return this.$message.error(this.$t('请选择客户'))
      }
      this.success(this.user)
      this.show = false
    },
    onRowChange(row) {
      this.chooseId = row.id
      this.user = row
    },
    clear() {
      this.page_params.page = 1
      this.keyword = ''
      this.chooseId = ''
    },
    init() {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.dialog-selectCustomer {
  .searchUser {
    width: 40%;
    float: right;
    margin: 10px 0;
  }
  .pagination-box {
    margin-top: 10px;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
  }
}
</style>
