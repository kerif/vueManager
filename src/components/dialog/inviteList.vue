<template>
  <el-dialog :visible.sync="show" :title="state === 'invite' ? '邀请记录' : '卡券包'" class="dialog-container">
    <el-table v-if="state === 'invite'"
      class="data-list"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="index">
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
        <el-table-column
        prop="created_at"
        label="注册时间">
      </el-table-column>
      <!-- 最后登录时间 -->
        <el-table-column
        prop="last_login_at"
        label="最后登录时间">
      </el-table-column>
    </el-table>
    <!-- 卡券包 -->
    <el-table v-else class="data-list" :data="tableData" border style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column
        prop="name"
        label="券名称">
      </el-table-column>
        <el-table-column
        prop="code"
        label="券码">
      </el-table-column>
        <el-table-column
        prop="amount"
        label="金额">
      </el-table-column>
        <el-table-column
        prop="status"
        label="状态">
        </el-table-column>
        <el-table-column
        prop="created_at"
        label="发放时间">
      </el-table-column>
      <el-table-column
        prop="used_at"
        label="使用时间">
      </el-table-column>
    </el-table>
    <!-- <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div> -->
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
      state: ''
    }
  },
  methods: {
    getList () {
      let method = this.state === 'invite' ? 'invitations' : 'voucherUser'
      this.$request[method](this.query.id, {
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
    }
  }
}
</script>
<style lang="scss">
</style>
