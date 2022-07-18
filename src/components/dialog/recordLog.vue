<template>
  <el-dialog :visible.sync="show" :title="$t('邀请记录')" @close="clear">
    <el-table :data="tableData" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column :label="$t('客户ID')" prop="id"></el-table-column>
      <el-table-column :label="$t('客户昵称')" prop="name"></el-table-column>
      <el-table-column :label="$t('注册时间')" prop="created_at"></el-table-column>
      <el-table-column :label="$t('最后登录时间')" prop="last_login_at"></el-table-column>
    </el-table>
    <div style="padding: 20px 0">
      <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    </div>
  </el-dialog>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      id: '',
      tableData: []
    }
  },
  mixins: [pagination],
  components: {
    NlePagination
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      // this.$request.inviteRecord(this.id).then(res => {
      //   if (res.ret) {
      //     this.tableData = res.data
      //     this.page_params.page = res.meta.current_page
      //     this.page_params.total = res.meta.total
      //   }
      // })
    },
    clear() {}
  }
}
</script>

<style></style>
