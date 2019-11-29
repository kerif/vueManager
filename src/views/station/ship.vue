<template>
  <div class="ship-container">
    <div>
      <search-group placeholder="请输入关键字" v-model="page_params.keyword" @search="goSearch">
        </search-group>
      </div>
    <div class="select-box">
      <search-select placeholder="状态" :selectArr="statusList" @search="onShipStatus"
      v-model="page_params.status"></search-select>
      <add-btn @click.native="updateInvoice">创建发货单</add-btn>
    </div>
    <div class="changeTime">
      <!-- 提交 -->
        <el-date-picker
        class="timeStyle"
        v-model="timeList"
        type="daterange"
        @change="onTime"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="提交开始日期"
        end-placeholder="提交结束日期">
      </el-date-picker>
      <!-- 发货 -->
        <el-date-picker
        class="timeStyle"
        v-model="shipmentList"
        type="daterange"
        @change="onShipment"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="发货开始日期"
        end-placeholder="发货结束日期">
      </el-date-picker>
    </div>
  <el-table :data="tableShip" stripe
    border class="data-list"
    @expand-change="onExpand"
    v-loading="tableLoading">
    <!-- <el-table-column type="expand">
      <template slot-scope="props">
        <el-table :data="props.row.orders">
          <el-table-column label="客户ID" prop="user_id"></el-table-column>
          <el-table-column label="订单号">
            <template slot-scope="scope">
              <span @click="goOrder(scope.row.order_sn, scope.row.status)" class="chooseOrder">{{scope.row.order_sn}}</span>
            </template>
          </el-table-column>
          <el-table-column label="转运快递单号" prop="logistics_sn"></el-table-column>
          <el-table-column label="线路名称" prop="express_line.cn_name"></el-table-column>
          <el-table-column label="收货人" prop="address.receiver_name"></el-table-column>
          <el-table-column label="收货国家" prop="address.country_name"></el-table-column>
          <el-table-column label="包裹数" prop="package_count"></el-table-column>
          <el-table-column :label="'实际重量' + localization.weight_unit" prop="actual_weight"></el-table-column>
          <el-table-column :label="'实际费用' + localization.currency_unit" prop="actual_payment_fee"></el-table-column>
          <el-table-column :label="'申报价值' + localization.currency_unit" prop="declare_value"></el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column label="提交时间" prop="packed_at"></el-table-column>
          <el-table-column label="拣货时间" prop="updated_at"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="scope.row.id" class="btn-light-red">移除发货单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-table-column> -->
      <!-- 发货单号 -->
      <el-table-column label="发货单号" prop="sn"></el-table-column>
      <!-- 创建时间 -->
      <el-table-column label="提交时间" prop="created_at"></el-table-column>
      <!-- 发货时间 -->
      <el-table-column label="发货时间" prop="shipped_at"></el-table-column>
      <!-- 发出站点 -->
      <!-- <el-table-column label="发出站点" prop="source_station"></el-table-column> -->
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
      <el-table-column :label="'重量' + this.localization.weight_unit" prop="weight"></el-table-column>
      <!-- 价值 -->
      <el-table-column :label="'价值' + this.localization.currency_unit" prop="value"></el-table-column>
      <!-- 物品属性 -->
      <el-table-column label="物品属性" prop="props"></el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注" prop="remark"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="goInvoice(scope.row.id)" v-if="scope.row.status === 0">发货</el-button>
          <!-- 详情 -->
          <el-button class="btn-deep-purple" @click="goDetails(scope.row.id)">详情</el-button>
          <!-- 导出清单 -->
          <el-button class="btn-main" @click="unloadShip(scope.row.id)">导出清单</el-button>
          <!-- 删除 -->
          <el-button class="btn-light-red" v-if="scope.row.box_count === 0" @click="deleteShip(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
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
  name: 'shipList',
  data () {
    return {
      tableShip: [], // 表格数据
      localization: {},
      tableLoading: false,
      timeList: [],
      begin_date: '',
      end_date: '',
      shipped_begin_date: '',
      shipped_end_date: '',
      shipmentList: [],
      urlExcel: '',
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
    if (this.$route.query.shipment_sn) {
      this.page_params.keyword = this.$route.query.shipment_sn
    }
    if (this.$route.query.status) {
      this.page_params.status = Number(this.$route.query.status)
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        agent: this.agent_name,
        status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      // 发货时间
      this.shipped_begin_date && (params.shipped_begin_date = this.shipped_begin_date)
      this.shipped_end_date && (params.shipped_end_date = this.shipped_end_date)
      this.$request.getShip(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.tableShip = res.data.map(item => {
            return {
              ...item,
              orders: []
            }
          })
          this.localization = res.localization
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
    // 跳转至详情
    goDetails (id) {
      this.$router.push({ name: 'shipDetails', query: { id: id } })
    },
    // 导出清单
    unloadShip (id) {
      this.$request.uploadExcel(id).then(res => {
        if (res.ret) {
          this.urlExcel = res.data.url
          window.location.href = this.urlExcel
          this.$notify({
            title: '操作成功',
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 创建时间
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
    },
    // 发货时间
    // 创建时间
    onShipment (val) {
      this.shipped_begin_date = val ? val[0] : ''
      this.shipped_end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.shipped_begin_date} ${this.shipped_end_date}`)
      this.getList()
    },
    // 删除发货单
    deleteShip (id) {
      this.$confirm(`您真的要删除发货单吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteShip(id).then(res => {
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
    // 跳转至订单 运单
    goOrder (orderSn, status) {
      console.log(status, '我是传过去的ID')
      this.$router.push({ name: 'wayBillList', query: { order_sn: orderSn, activeName: status.toString() } })
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
    },
    // 发货状态选择
    onShipStatus () {
      this.page_params.handleQueryChange('status', this.page_params.status)
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.ship-container {
  .select-box {
    overflow: hidden;
  }
  .el-button {
    margin-bottom: 5px;
  }
  .changeTime {
     margin-top: 15px;
    .timeStyle {
      margin-right: 20px;
    }
  }
}
</style>
