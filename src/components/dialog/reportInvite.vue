<template>
  <el-dialog :visible.sync="show" :title="$t('邀请记录')" class="dialog-invite-report" width="70%" @close="clear">
    <el-table
      class="data-list"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <!-- 客户ID -->
      <el-table-column
        prop="id"
        :label="$t('客户ID')">
      </el-table-column>
      <!-- 客户昵称 -->
        <el-table-column
        prop="name"
        :label="$t('客户昵称')">
      </el-table-column>
        <el-table-column
        prop="created_at"
        :label="$t('注册时间')">
      </el-table-column>
      <!-- 最后登录时间 -->
        <el-table-column
        prop="last_login_at"
        :label="$t('最后登录时间')">
      </el-table-column>
    </el-table>
     <nle-pagination :pageParams="page_params"></nle-pagination>
  </el-dialog>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  data () {
    return {
      tableData: [],
      state: '',
      id: ''
    }
  },
  methods: {
    getList () {
      this.$request.reportInvite(this.id, {
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.tableData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        }
      })
    },
    init () {
      this.getList()
    },
    clear () {
      this.page_params.page = 1
    }
  }
}
</script>
<style lang="scss">
.dialog-invite-report{
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }

  .el-dialog__close {
    color: #FFF;
  }
}
</style>
