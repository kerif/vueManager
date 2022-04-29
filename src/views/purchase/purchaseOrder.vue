<template>
  <div class="purchase-list">
    <el-tabs v-model="activeName" stretch @tab-click="handleClick" class="tab-length">
      <el-tab-pane :label="`${$t('全部')}(${statusList[7].counts})`" name="all"></el-tab-pane>
      <el-tab-pane :label="`${$t('草稿')}(${statusList[0].counts})`" name="0"></el-tab-pane>
      <el-tab-pane :label="`${$t('未发货')}(${statusList[1].counts})`" name="1"></el-tab-pane>
      <el-tab-pane :label="`${$t('已发货')}(${statusList[2].counts})`" name="2"></el-tab-pane>
      <el-tab-pane :label="`${$t('已入库')}(${statusList[3].counts})`" name="3"></el-tab-pane>
      <el-tab-pane :label="`${$t('已分货')}(${statusList[4].counts})`" name="4"></el-tab-pane>
      <el-tab-pane :label="`${$t('已转运')}(${statusList[5].counts})`" name="5"></el-tab-pane>
      <el-tab-pane :label="`${$t('作废')}(${statusList[6].counts})`" name="10"></el-tab-pane>
    </el-tabs>
    <purchase-search
      v-show="hasFilterCondition"
      :searchData="searchData"
      v-on:submit="goSearch"
    ></purchase-search>
    <div class="flex-btn">
      <div class="flex-1">
        <el-button class="btn-deep-blue" @click="$router.push({ name: 'addPurchase' })">{{
          $t('新增采购单')
        }}</el-button>
        <el-button class="btn-green" v-if="activeName !== '7'" @click="exportList(selectIDs)">{{
          $t('导出清单')
        }}</el-button>
        <el-button
          class="btn-deep-purple"
          v-if="activeName === '1'"
          @click="onPurchase(selectIDs)"
          >{{ $t('提交采购') }}</el-button
        >
        <el-button
          class="btn-light-red"
          v-if="['1', '2', '3'].includes(activeName)"
          @click="onDelete(selectIDs)"
          >{{ $t('删除') }}</el-button
        >
        <el-button
          class="btn-main"
          v-if="['4', '5'].includes(activeName)"
          @click="onInvild(selectIDs)"
          >{{ $t('作废') }}</el-button
        >
        <el-button class="btn-blue-green" v-if="activeName === '5'">{{ $t('提交转运') }}</el-button>
      </div>
      <div class="headr-r flex">
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
    <div style="margin-top: 20px">
      <el-table
        :data="purchaseData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        v-loading="tableLoading"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="sn" :label="$t('PO单号')"> </el-table-column>
        <el-table-column prop="status_name" :label="$t('状态')"> </el-table-column>
        <el-table-column prop="name" :label="$t('PO单名称')"> </el-table-column>
        <el-table-column prop="logistics_company" :label="$t('发货物流公司')"> </el-table-column>
        <el-table-column prop="logistics_sn" :label="$t('发货物流单号')"></el-table-column>
        <el-table-column prop="amount" :label="$t('采购总金额')"></el-table-column>
        <el-tabel-column :label="$t('采购总件/总箱数')">
          <template slot-scope="scope">
            <span>{{ scope.row.quantity }} / {{ scope.row.box_count }}</span>
          </template>
        </el-tabel-column>
        <el-table-column prop="created_at" :label="$t('创建时间')">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>
        <el-tabel-column prop="creator" :label="$t('创建人')">
          <template slot-scope="scope">
            <span>{{ scope.row.creator }}</span>
          </template>
        </el-tabel-column>
        <el-table-column :label="$t('操作')" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button class="btn-purple" @click="onDetail(scope.row.id)">{{
              $t('详情')
            }}</el-button>
            <el-button
              class="btn-blue-green"
              @click="goDistribution(scope.row.id)"
              v-if="['4', '5'].includes(activeName)"
              >{{ $t('分货') }}</el-button
            >
            <el-button class="btn-green" v-if="activeName === '4'">{{ $t('入库信息') }}</el-button>
            <el-button
              class="btn-light-red"
              v-if="activeName === '5'"
              @click="onInvild([scope.row.id])"
              >{{ $t('作废') }}</el-button
            >
            <el-button
              class="btn-deep-purple"
              v-if="['2', '3'].includes(activeName)"
              @click="addShipInfo(scope.row.id)"
              >{{ $t('确认发货') }}</el-button
            >
            <el-button
              class="btn-deep-blue"
              v-if="['1', '2'].includes(activeName)"
              @click="editPurchase(scope.row.id)"
              >{{ $t('编辑') }}</el-button
            >
            <el-button
              class="btn-light-red"
              v-if="['1', '2', '3'].includes(activeName)"
              @click="onDelete([scope.row.id])"
              >{{ $t('删除') }}</el-button
            >
            <el-button class="btn-main" v-if="activeName === '5'">{{ $t('提交转运') }}</el-button>
            <el-button
              class="btn-deep-purple"
              v-if="activeName === '1'"
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
import PurchaseSearch from './components/purchaseSearch.vue'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      activeName: 'all',
      hasFilterCondition: false,
      tableLoading: false,
      selectIDs: [],
      purchaseData: [],
      statusList: [],
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
    PurchaseSearch,
    SearchGroup
  },
  mixins: [pagination],
  created() {
    this.getList()
    this.getCounts()
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
          this.tableLoading = false
          this.purchaseData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        })
    },
    getCounts() {
      this.$request.purchaseCount().then(res => {
        this.statusList = res.data
      })
    },
    goSearch() {
      this.getList()
    },
    goDistribution(id) {
      this.$router.push({
        name: 'distributionGoods',
        params: { id }
      })
    },
    exportList(ids) {
      if (!ids.length) return this.$message.error(this.$t('请选择'))
      this.$request.exportPurchase(ids).then(res => {
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
    onInvild(ids) {
      if (!ids.length) return this.$message.error(this.$t('请选择'))
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
    },
    addShipInfo(id) {
      dialog({
        type: 'addShip',
        id
      })
    },
    handleClick() {
      this.page_params.page = 1
      this.page_params.handleQueryChange('page', 1)
      this.getList()
    },
    handleSelectionChange(val) {
      this.selectIDs = val.map(item => item.id)
    },
    editPurchase(id) {
      this.$router.push({
        name: 'addPurchase',
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
  .flex-btn {
    display: flex;
    margin-top: 10px;
    .flex-1 {
      flex: 1;
    }
    .flex {
      display: flex;
    }
  }
}
</style>
