<template>
  <div class="ship-container">
    <div>
      <search-group placeholder="请输入关键字" v-model="page_params.keyword" @search="goSearch">
        </search-group>
      </div>
    <div class="select-box">
      <search-select placeholder="状态" :selectArr="statusList" @search="getList"
      v-model="page_params.status"></search-select>
      <add-btn @click.native="updateInvoice">创建发货单</add-btn>
    </div>
    <el-table :data="tableShip" stripe
    border class="data-list"
    @expand-change="onExpand"
    v-loading="tableLoading">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-table :data="props.row.orders">
          <el-table-column label="客户ID" prop="user_id"></el-table-column>
          <el-table-column label="转运单号" prop="order_sn"></el-table-column>
          <el-table-column label="物流单号" prop="logistics_sn"></el-table-column>
          <el-table-column label="线路名称" prop="express_line.cn_name"></el-table-column>
          <el-table-column label="收货人" prop="address.receiver_name"></el-table-column>
          <el-table-column label="收货国家" prop="address.country_name"></el-table-column>
          <el-table-column label="包裹数" prop="package_count"></el-table-column>
          <el-table-column label="实际重量kg" prop="actual_weight"></el-table-column>
          <el-table-column label="实际费用￥" prop="actual_payment_fee"></el-table-column>
          <el-table-column label="申报价值￥" prop="declare_value"></el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column label="提交时间" prop="packed_at"></el-table-column>
          <el-table-column label="拣货时间" prop="updated_at"></el-table-column>
        </el-table>
      </template>
    </el-table-column>
      <!-- 发货单号 -->
      <el-table-column label="发货单号" prop="sn"></el-table-column>
      <!-- 创建时间 -->
      <el-table-column label="创建时间" prop="created_at"></el-table-column>
      <!-- 发出站点 -->
      <el-table-column label="发出站点" prop="source_station"></el-table-column>
      <!-- 目的国 -->
      <el-table-column label="目的国" prop="destination_country"></el-table-column>
      <!-- 状态 -->
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">未发货</span>
          <span v-else>已发货</span>
        </template>
      </el-table-column>
      <!-- 箱数 -->
      <el-table-column label="箱数" prop="box_count"></el-table-column>
      <!-- 重量 -->
      <el-table-column label="重量kg" prop="weight"></el-table-column>
      <!-- 价值 -->
      <el-table-column label="价值¥" prop="value"></el-table-column>
      <!-- 物品属性 -->
      <el-table-column label="物品属性" prop="props"></el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注" prop="remark"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="goInvoice(scope.row.id)" v-show="scope.row.status === 0">发货</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
  </div>
</template>
<script>
import { SearchSelect, SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    SearchSelect,
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data () {
    return {
      tableShip: [], // 表格数据
      tableLoading: false,
      page_params: {
        status: ''
      },
      statusList: [
        {
          value: 0,
          label: '未发货'
        },
        {
          value: 1,
          label: '已发货'
        }
      ]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getShip({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.page_params.status
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.tableShip = res.data.map(item => {
            return {
              ...item,
              orders: []
            }
          })
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
    updateInvoice () {
      dialog({ type: 'invoice' }, () => {
        this.getList()
      })
    },
    goInvoice (id) {
      this.$confirm(`您真的要发货吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.getShipments(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getList()
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
    // 点开当前行，获取二级菜单数据
    onExpand (row) {
      // 如果当前货单已经获取了二级菜单数据，就不在获取
      if (row.orders.length) return
      let id = row.id
      this.$request.getOrdersByShipment(id).then(res => {
        if (res.ret) {
          row.orders = res.data
        }
      })
    }
  }
}
</script>
<style lang="scss">
.ship-container {
  .select-box {
    overflow: hidden;
  }
}
</style>
