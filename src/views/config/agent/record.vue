<template>
  <div class="record-list-container">
    <el-table class="data-list" border stripe :data="suggestList"
    v-loading="tableLoading">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="下单人id" prop="user_id">
      </el-table-column>
      <el-table-column label="姓名" prop="user_name">
      </el-table-column>
      <el-table-column label="转运单号" prop="order_number">
      </el-table-column>
      <el-table-column label="订单金额" prop="order_amount">
      </el-table-column>
      <el-table-column label="佣金比例" prop="proportion">
      </el-table-column>
      <el-table-column label="佣金" prop=" commission_amount">
      </el-table-column>
      <el-table-column label="成交时间" prop="created_at">
      </el-table-column>
      <el-table-column label="是否结算">
        <template slot-scope="scope">s
          <el-button class="btn-dark-green" @click="settlement(scope.row.id)">结算</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.id === 0">未结算</span>
          <span v-if="scope.row.id === 1">已结算</span>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
      <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
    </el-dialog>
  </div>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      suggestList: [],
      tableLoading: false,
      imgVisible: false,
      imgSrc: ''
    }
  },
  mixins: [pagination],
  components: {
    NlePagination
  },
  created () {
    this.getList()
    console.log(this.$route.query.id, '我是id')
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getAgentOrders(this.$route.query.id, {
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.suggestList = res.data
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
    // 修改代理
    editAgent (id) {
      this.$router.push({
        name: 'editAgent',
        query: {
          id: id
        }
      })
    },
    onChangeStatus (id) {
      dialog({
        type: 'changestatus', id: id
      }, () => {
        this.getList()
      }
      )
    }
  }
}
</script>
<style lang="scss">
.img_box{
  text-align: center;
  .imgDialog{
    width: 50%;
  }
}
.el-button {
  margin: 3px;
}
</style>
