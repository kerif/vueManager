<template>
  <el-dialog :visible.sync="show" :title="state === 'invite' ? '邀请记录' : '卡券包'" class="dialog-invite">
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
      <el-table-column label="操作">
      <template slot-scope="scope">
        <!-- 作废 -->
        <el-button class="btn-light-red" v-if="scope.row.status === '进行中'" @click="failCoupon(scope.row.id)">作废</el-button>
      </template>
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
      state: '',
      id: ''
    }
  },
  methods: {
    getList () {
      let method = this.state === 'invite' ? 'invitations' : 'voucherUser'
      this.$request[method](this.id, {
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
    // 作废优惠券
    failCoupon (id) {
      this.show = false
      this.$confirm('确定要作废优惠券吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteCoupons(this.id, id).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.success()
          } else {
            this.$notify({
              title: '操作失败',
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    init () {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.dialog-invite{
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
