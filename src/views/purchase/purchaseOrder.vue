<template>
  <div class="purchase-list">
    <el-tabs v-model="activeName" stretch @tab-click="handleClick" class="tab-length">
      <el-tab-pane
        :label="`${$t('全部')}(${statusList[6] ? statusList[6].counts : 0})`"
        name="all"
      ></el-tab-pane>
      <el-tab-pane
        :label="`${$t('草稿')}(${statusList[0] ? statusList[0].counts : 0})`"
        name="0"
      ></el-tab-pane>
      <el-tab-pane
        :label="`${$t('未发货')}(${statusList[1] ? statusList[1].counts : 0})`"
        name="1"
      ></el-tab-pane>
      <el-tab-pane
        :label="`${$t('已发货')}(${statusList[2] ? statusList[2].counts : 0})`"
        name="2"
      ></el-tab-pane>
      <el-tab-pane
        :label="`${$t('已入库')}(${statusList[3] ? statusList[3].counts : 0})`"
        name="3"
      ></el-tab-pane>
      <el-tab-pane
        :label="`${$t('已完成')}(${statusList[4] ? statusList[4].counts : 0})`"
        name="4"
      ></el-tab-pane>
      <el-tab-pane
        :label="`${$t('作废')}(${statusList[5] ? statusList[5].counts : 0})`"
        name="10"
      ></el-tab-pane>
    </el-tabs>
    <purchase-search
      v-show="hasFilterCondition"
      :searchData="searchData"
      v-on:submit="goSearch"
    ></purchase-search>
    <div class="header-range">
      <div>
        <el-button class="btn-deep-blue" @click="$router.push({ name: 'addPurchase' })">{{
          $t('新增采购单')
        }}</el-button>
        <el-button class="btn-green" v-if="activeName !== '7'" @click="exportList(selectIDs)">{{
          $t('导出清单')
        }}</el-button>
        <el-button
          class="btn-deep-purple"
          v-if="activeName === '0'"
          @click="onPurchase(selectIDs)"
          >{{ $t('提交采购') }}</el-button
        >
        <!-- <el-button class="btn-main" @click="onReceive(selectIDs)">{{ $t('确认收货') }}</el-button> -->
        <el-button
          class="btn-light-red"
          v-if="['0', '1', '2'].includes(activeName)"
          @click="onDelete(selectIDs)"
          >{{ $t('删除') }}</el-button
        >
        <el-button
          class="btn-main"
          v-if="['3', '5'].includes(activeName)"
          @click="onInvild(selectIDs)"
          >{{ $t('作废') }}</el-button
        >
      </div>
      <div class="header-search">
        <div class="searchGroup">
          <search-group
            :placeholder="$t('请输入关键字')"
            v-model="page_params.keyword"
            @search="goSearch"
          >
          </search-group>
        </div>
        <div class="filter">
          <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
            >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
          ></el-button>
        </div>
      </div>
    </div>
    <div style="margin-top: 10px">
      <el-table
        :data="purchaseData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        @row-click="getRow"
        v-loading="tableLoading"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="sn" :label="$t('PO单号')"> </el-table-column>
        <el-table-column prop="status_name" :label="$t('状态')"> </el-table-column>
        <el-table-column prop="name" :label="$t('PO单名称')"> </el-table-column>
        <el-table-column prop="warehouse_name" :label="$t('采购仓库')"></el-table-column>
        <el-table-column prop="logistics_company" :label="$t('发货物流公司')"> </el-table-column>
        <el-table-column prop="logistics_sn" :label="$t('发货物流单号')"></el-table-column>
        <el-table-column prop="amount" :label="$t('采购总金额')"></el-table-column>
        <el-table-column :label="$t('采购总件/总箱数')" prop="quantity,box_count">
          <template slot-scope="scope">
            <span
              >{{ scope.row.quantity }}
              <span v-if="scope.row.quantity && scope.row.box_count">/</span>
              {{ scope.row.box_count }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="created_at" :label="$t('创建时间')">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creator" :label="$t('创建人')"> </el-table-column>
        <el-table-column :label="$t('操作')" width="300" fixed="right">
          <template slot-scope="scope">
            <el-button
              class="btn-purple"
              v-if="activeName !== '0'"
              @click="onDetail(scope.row.id)"
              >{{ $t('详情') }}</el-button
            >
            <el-button
              class="btn-main"
              @click="onExpress(scope.row.logistics_sn)"
              v-if="activeName === '2'"
              >{{ $t('单号追踪') }}</el-button
            >
            <el-button
              class="btn-blue-green"
              @click="onDistribution([scope.row.id])"
              v-if="['3'].includes(activeName)"
              >{{ $t('分货完成') }}</el-button
            >
            <el-button
              class="btn-light-red"
              v-if="['2', '3', '5'].includes(activeName)"
              @click="onInvild([scope.row.id])"
              >{{ $t('作废') }}</el-button
            >
            <el-button
              class="btn-deep-purple"
              v-if="['1'].includes(activeName)"
              @click="
                addShipInfo(
                  scope.row.id,
                  scope.row.logistics_company_code,
                  scope.row.logistics_sn,
                  scope.row.warehouse_name,
                  scope.row.warehouse_id
                )
              "
              >{{ $t('确认发货') }}</el-button
            >
            <el-button
              class="btn-deep-purple"
              v-if="activeName === '2'"
              @click="onReceive(scope.row.id)"
              >{{ $t('确认收货') }}</el-button
            >
            <el-button
              class="btn-deep-blue"
              v-if="['0', '1'].includes(activeName)"
              @click="editPurchase(scope.row.id)"
              >{{ $t('编辑') }}</el-button
            >
            <el-button
              class="btn-light-red"
              v-if="['0', '1'].includes(activeName)"
              @click="onDelete([scope.row.id])"
              >{{ $t('删除') }}</el-button
            >
            <el-button
              class="btn-deep-purple"
              v-if="activeName === '0'"
              @click="onPurchase([scope.row.id])"
              >{{ $t('提交采购') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import purchaseSearch from './components/purchaseSearch.vue'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  name: 'purchaseOrder',
  data() {
    return {
      activeName: 'all',
      hasFilterCondition: false,
      tableLoading: false,
      selectIDs: [],
      purchaseData: [],
      statusList: [],
      logistics_sn: '',
      logistics_company_code: '',
      searchData: {
        sn: '',
        timeList: [],
        logistics_sn: '',
        begin_date: '',
        end_date: ''
      }
    }
  },
  components: {
    NlePagination,
    purchaseSearch,
    SearchGroup
  },
  mixins: [pagination],
  created() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .purchaseList({
          begin_date: this.searchData.timeList ? this.searchData.timeList[0] : '',
          end_date: this.searchData.timeList ? this.searchData.timeList[1] : '',
          status: this.activeName === 'all' ? '' : this.activeName,
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size,
          ...this.searchData
        })
        .then(res => {
          if (res.ret) {
            this.tableLoading = false
            this.purchaseData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.getCounts()
          }
        })
    },
    initQuery() {
      if (this.$route.query.activeName) {
        console.log(this.$route.query.activeName)
      }
    },
    getCounts() {
      this.$request
        .purchaseCount({
          begin_date: this.searchData.timeList ? this.searchData.timeList[0] : '',
          end_date: this.searchData.timeList ? this.searchData.timeList[1] : '',
          status: this.activeName === 'all' ? '' : this.activeName,
          keyword: this.page_params.keyword,
          ...this.searchData
        })
        .then(res => {
          this.statusList = res.data
        })
    },
    goSearch() {
      this.getList()
    },
    onExpress(expressNum) {
      window.open(`https://m.kuaidi100.com/app/query/?coname=uc&nu=${expressNum}`)
    },
    goDistribution(id) {
      this.$router.push({
        name: 'distributionGoods',
        params: { id }
      })
    },
    onDistribution(id) {
      this.$confirm(this.$t('您真的确认吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.purchaseFinish({ ids: id }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
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
    exportList(ids) {
      if (!ids.length) return this.$message.error(this.$t('请选择'))
      this.$request.exportPurchase({ ids: ids }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    onDetail(id) {
      this.$router.push({
        name: 'purchaseDetail',
        params: { id }
      })
    },
    onPurchase(ids) {
      if (!ids.length) return this.$message.error(this.$t('请选择'))
      this.$request.submitPurchase(ids).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    onDelete(ids) {
      if (!ids.length) return this.$message.error(this.$t('请选择'))
      this.$request.deletPurchase(ids).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    getRow(row) {
      console.log(row)
    },
    onInvild(ids) {
      if (!ids.length) return this.$message.error(this.$t('请选择'))
      this.$confirm(this.$t('您真的要作废吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.invalidPurchase(ids).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
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
    addShipInfo(id, logistics_company_code, logistics_sn, warehouse_name, warehouseId) {
      dialog(
        {
          type: 'addShip',
          id,
          logistics_sn,
          logistics_company_code,
          warehouse_name,
          warehouseId
        },
        () => {
          this.getList()
        }
      )
    },
    onReceive(id) {
      dialog(
        {
          type: 'confirmReceive',
          id
        },
        () => {
          this.getList()
        }
      )
    },
    handleClick(tab) {
      this.page_params.page = 1
      this.page_params.handleQueryChange('page', 1)
      this.page_params.handleQueryChange('activeName', tab.name)
      this.getList()
    },
    handleSelectionChange(val) {
      this.selectIDs = val.map(item => item.id)
    },
    editPurchase(id) {
      this.$router.push({
        name: 'editPurchase',
        params: { id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.purchase-list {
  .tab-length {
    width: 950px !important;
  }
  .header-range {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-search {
      display: flex;
      align-items: center;
      margin: 0 0 0 auto;
      .header-keyword {
        max-width: 300px;
      }
      .filter {
        margin: 0 20px;
      }
    }
  }
}
</style>
