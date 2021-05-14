<template>
  <div class="record-list-container">
    <div class="batch-settlement">
      <el-button class="btn-green" @click="batchSettlement">{{ $t('批量结算') }}</el-button>
    </div>
    <el-table class="data-list" border stripe :data="suggestList" v-loading="tableLoading">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column :label="$t('下单人id')" prop="user_id"> </el-table-column>
      <el-table-column :label="$t('姓名')" prop="user_name"> </el-table-column>
      <el-table-column :label="$t('订单号')" prop="order_number"> </el-table-column>
      <el-table-column
        :label="$t('计佣金额') + this.localization.currency_unit"
        prop="order_amount"
      >
      </el-table-column>
      <el-table-column
        :label="`${$t('比例%/金额')}${localization.currency_unit}/${$t('单位金额')}${
          localization.currency_unit
        }`"
        prop="proportion"
      >
      </el-table-column>
      <el-table-column :label="$t('佣金') + localization.currency_unit" prop="commission_amount">
      </el-table-column>
      <el-table-column :label="$t('成交时间')" prop="created_at"> </el-table-column>
      <el-table-column :label="$t('状态')">
        <template slot-scope="scope">
          <span v-if="scope.row.settled === 0">{{ $t('未结算') }}</span>
          <span v-if="scope.row.settled === 1">{{ $t('已结算') }}</span>
          <span v-if="scope.row.settled === 2">{{ $t('提现申请中') }}</span>
          <span v-if="scope.row.settled === 3">{{ $t('已提现') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('是否结算')">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.settled === 0"
            class="btn-dark-green"
            @click="settlement(scope.row.id)"
            >{{ $t('结算') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      suggestList: [],
      tableLoading: false,
      imgVisible: false,
      imgSrc: '',
      localization: {}
    }
  },
  mixins: [pagination],
  components: {
    NlePagination
  },
  created() {
    this.getList()
    console.log(this.$route.query.id, '我是id')
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getAgentOrders(this.$route.query.id, {
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.suggestList = res.data
            this.localization = res.localization
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
    // 修改代理
    editAgent(id) {
      this.$router.push({
        name: 'editAgent',
        query: {
          id: id
        }
      })
    },
    onChangeStatus(id) {
      dialog(
        {
          type: 'changestatus',
          id: id
        },
        () => {
          this.getList()
        }
      )
    },
    // 批量结算
    batchSettlement() {
      this.$confirm(this.$t('您真的确认批量结算吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.batchOrders(this.$route.query.userId).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    // 成交记录
    settlement(id) {
      console.log(id, 'id')
      this.$request.finishOrders(id).then(res => {
        if (res.ret) {
          this.$notify({
            message: res.msg,
            type: 'success',
            title: this.$t('操作成功')
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
    }
  }
}
</script>
<style lang="scss">
.img_box {
  text-align: center;
  .imgDialog {
    width: 50%;
  }
}
.el-button {
  margin: 3px;
}
.batch-settlement {
  text-align: right;
}
</style>
