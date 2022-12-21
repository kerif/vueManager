<template>
  <div class="pickup-list-container">
    <div class="search-bar">
      <div class="search-date-picker">
        创建时间
        <el-date-picker
          v-model="searchFormData.created_at"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
        >
        </el-date-picker>
        预约时间
        <el-date-picker
          v-model="searchFormData.pickup_at"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
        >
        </el-date-picker>
      </div>
      <div class="search-keyword">
        <div class="keyword-container">
          <el-input v-model="searchFormData.keyword"></el-input>
        </div>
        <div class="btn-container">
          <el-button type="primary" plain @click="onSearch">{{ $t('搜索') }}</el-button>
        </div>
      </div>
    </div>
    <div>
      <el-tabs v-model="activeName" @tab-click="onTabChange" class="tab-length" stretch>
        <el-tab-pane :label="`${$t('全部')} (${countData.all || 0})`" name="0"></el-tab-pane>
        <el-tab-pane
          :label="`${$t('待审核')} (${countData.wait_in_storage || 0})`"
          name="1"
        ></el-tab-pane>
        <el-tab-pane
          :label="`${$t('待取件')} (${countData.in_storage || 0})`"
          name="2"
        ></el-tab-pane>
        <el-tab-pane :label="`${$t('转运中')} (${countData.packed || 0})`" name="3"></el-tab-pane>
        <el-tab-pane :label="`${$t('已入库')} (${countData.shipped || 0})`" name="4"></el-tab-pane>
        <el-tab-pane :label="`${$t('已收货')} (${countData.received || 0})`" name="5"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="tools-bar">
      <el-button type="danger" size="mini" plain @click="onDelete">删除</el-button>
      <el-button type="success" size="mini" plain @click="onSetCheck">设为审核</el-button>
      <el-button type="success" size="mini" plain @click="onSetTrackingNumber"
        >设置转运单号</el-button
      >
      <el-button type="info" size="mini" plain @click="onExport">导出</el-button>
    </div>
    <div>
      <el-table
        border
        stripe
        ref="table"
        :data="orderData"
        @selection-change="onSelectionChange"
        v-loading="tableLoading"
        height="calc(100vh - 370px)"
        class="order-data-list"
      >
        <el-table-column
          :type="['1', '2', '6'].includes(activeName) ? 'selection' : 'index'"
          :key="['1', '2', '6'].includes(activeName) ? 'selection' : 'index'"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('预约单号')"
          prop="package_name"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          :label="$t('会员ID')"
          prop="package_name"
          width="150"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          :label="$t('状态')"
          prop="package_name"
          key="package_name"
          width="150"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          :label="$t('转运公司')"
          prop="package_name"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('转运单号')"
          prop="package_name"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('取件姓名')"
          prop="package_name"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('取件城市')"
          prop="package_name"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('取件电话')"
          prop="package_name"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column :label="$t('创建时间')" prop="package_name"></el-table-column>

        <el-table-column :label="$t('操作')" fixed="right">
          <template slot-scope="scope">
            <el-button @click="onViewDetail(scope.row.id)" size="mini">查看详细</el-button>
            <el-button @click="onSetCheck([scope.row.id])" size="mini">设为审核</el-button>
            <el-button @click="onSetTrackingNumber([scope.row])" size="mini"
              >设置转运单号</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <tx-pagination :pageParams="page_params"></tx-pagination>
    </div>
  </div>
</template>
<script>
import TxPagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    TxPagination
  },
  name: 'pickuplist',
  mixins: [pagination],
  data() {
    return {
      activeName: 0,
      orderData: [],
      tableLoading: false,
      countData: {},
      sumData: {},
      searchFormData: {
        created_at: '',
        pickup_at: '',
        keyword: ''
      },
      selectedRows: []
    }
  },
  created() {
    this.getList()
    this.getCounts()
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  mounted() {},
  methods: {
    onSearch() {
      this.page_params.page = 1
      this.getList()
    },
    onTabChange() {},
    onExport() {},
    onDelete() {
      if (!this.selectedRows || !this.selectedRows.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        console.error('delete')
      })
    },
    onSelectionChange(selection) {
      this.selectedRows = selection
    },
    onSetCheck() {
      if (!this.selectedRows || !this.selectedRows.length) {
        return this.$message.error(this.$t('请选择'))
      }
    },
    onSetTrackingNumber() {
      dialog({
        type: 'pickupSetTrackingInfo',
        dataList: []
      })
    },
    onViewDetail(id) {
      dialog({
        type: 'pickupDetail',
        id: id
      })
    },
    // 获取订单统计数据
    getCounts() {
      const params = this.computedParams()
      this.$request.getOrderCounts(params).then(res => {
        if (res.ret) {
          this.countData = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    computedParams() {
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.activeName === '6' ? 19 : this.activeName,
        keyword: this.searchFormData.keyword
      }
      const searchData = this.searchFormData
      params = {
        ...params,
        ...searchData,
        begin_date: searchData.date ? searchData.date[0] : '',
        end_date: searchData.date ? searchData.date[1] : ''
      }
      return params
    },
    getList() {
      this.tableLoading = true
      const params = this.computedParams()
      this.$request
        .getWarehouse(params)
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.sumData = res.sum
            this.localization = res.localization
            this.page_params.page = res.meta.current_page
            if (this.orderData.length) {
              this.page_params.total = res.meta.total
            } else {
              this.page_params.total = 0
            }
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(() => (this.tableLoading = false))
    }
  }
}
</script>

<style lang="scss" scoped>
.pickup-list-container {
  .search-bar {
    display: flex;
    background-color: white;
    padding: 20px;
    font-size: 13px;
    .search-date-picker {
      flex: 2;
    }
    .search-keyword {
      flex: 1;
      display: flex;
      .keyword-container {
        flex: 3;
      }
      .btn-contianer {
        flex: 1;
      }
    }
  }
  .tools-bar {
    margin-bottom: 20px;
  }
}
</style>
