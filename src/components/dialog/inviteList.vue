<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'invite' ? $t('邀请记录') : $t('卡券包')"
    class="dialog-invite"
    width="70%"
    @close="clear"
  >
    <div v-if="state === 'invite'" class="flex-item">
      <el-button class="btn-main" @click="transferAgent">{{ $t('转为代理客户') }}</el-button>
      <div class="agent-text">
        {{ $t('提示: 成为代理之前邀请的客户一键转为代理客户') }}
      </div>
    </div>
    <div v-else>
      <el-button class="btn-light-red" @click="batchInvalid">{{ $t('批量作废') }}</el-button>
    </div>
    <el-table
      v-if="state === 'invite'"
      class="data-list"
      :data="tableData"
      border
      @selection-change="selectionChange"
      style="width: 100%"
    >
      <el-table-column type="index"> </el-table-column>
      <!-- 客户ID -->
      <el-table-column prop="id" :label="$t('客户ID')"> </el-table-column>
      <!-- 客户昵称 -->
      <el-table-column prop="name" :label="$t('客户昵称')"> </el-table-column>
      <el-table-column prop="created_at" :label="$t('注册时间')"> </el-table-column>
      <!-- 最后登录时间 -->
      <el-table-column prop="last_login_at" :label="$t('最后登录时间')"> </el-table-column>
      <el-table-column prop="is_agent_invite" :label="$t('是否代理邀请')">
        <template slot-scope="scope">
          <span v-if="scope.row.is_agent_invite === 0">{{ $t('否') }}</span>
          <span v-else>{{ $t('是') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 卡券包 -->
    <el-table v-else class="data-list" :data="tableData" border style="width: 100%">
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="name" :label="$t('券名称')"> </el-table-column>
      <el-table-column prop="code" :label="$t('券码')"> </el-table-column>
      <el-table-column prop="amount" :label="$t('金额')"> </el-table-column>
      <el-table-column prop="status" :label="$t('状态')"> </el-table-column>
      <el-table-column prop="created_at" :label="$t('发放时间')"> </el-table-column>
      <el-table-column prop="used_at" :label="$t('使用时间')"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 作废 -->
          <el-button
            class="btn-light-red"
            v-if="scope.row.usable === true"
            @click="failCoupon(scope.row.id)"
            >{{ $t('作废') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div style="padding: 20px 0">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
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
  data() {
    return {
      tableData: [],
      state: '',
      id: '',
      ids: []
    }
  },
  methods: {
    getList() {
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
    failCoupon(id) {
      this.show = false
      this.$confirm(this.$t('确定要作废优惠券吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCoupons(this.id, id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.success()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    init() {
      this.getList()
    },
    selectionChange(selection) {
      this.ids = selection.map(item => item.id)
    },
    batchInvalid() {
      if (!this.ids || !this.ids.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('确定要批量作废'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        let params = {}
        params.ids = this.ids
        this.$request.batchInvalidCard(params).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    clear() {
      this.page_params.page = 1
    },
    transferAgent() {
      this.$confirm(this.$t('确定要转为代理客户'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.agentCustomer(this.id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">
.dialog-invite {
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
  .flex-item {
    display: flex;
    align-items: center;
  }
  .agent-text {
    color: red;
    margin-left: 20px;
  }
}
</style>
