<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('客户组成员')"
    class="dialog-vip-list"
    @close="clear"
    width="80%"
  >
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index"> </el-table-column>
      <!-- 客户ID -->
      <el-table-column prop="id" :label="$t('客户ID')"> </el-table-column>
      <!-- 客户昵称 -->
      <el-table-column prop="name" :label="$t('客户昵称')"> </el-table-column>
      <!-- 最后登录时间 -->
      <el-table-column prop="last_login_at" :label="$t('最后登录时间')"> </el-table-column>
    </el-table>
    <!-- <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div> -->
    <div class="pagination-box">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
  </el-dialog>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      tableData: []
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    getList() {
      this.$request
        .getUserMembers(this.id, {
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            console.log(this.tableData, 'tableData')
          }
        })
    },
    init() {
      this.getList()
    },
    clear() {
      this.page_params.page = 1
    }
  }
}
</script>
<style lang="scss">
.dialog-vip-list {
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
