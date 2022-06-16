<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        :label="`${$t('全部')}(${countData[4] ? countData[4].counts : ''})`"
        name="all"
      ></el-tab-pane>
      <el-tab-pane
        :label="`${$t('草稿')}(${countData[0] ? countData[0].counts : ''})`"
        name="0"
      ></el-tab-pane>
      <el-tab-pane
        :label="`${$t('待拣货')}(${countData[1] ? countData[1].counts : ''})`"
        name="1"
      ></el-tab-pane>
      <el-tab-pane
        :label="`${$t('待打包')}(${countData[2] ? countData[2].counts : ''})`"
        name="2"
      ></el-tab-pane>
      <el-tab-pane
        :label="`${$t('已转运')}(${countData[3] ? countData[3].counts : ''})`"
        name="3"
      ></el-tab-pane>
    </el-tabs>
    <purchase-search
      v-show="hasFilterCondition"
      :searchData="searchData"
      v-on:submit="goSearch"
    ></purchase-search>
    <div class="header-range">
      <div>
        <el-button class="btn-main" @click="addDistributeScheme">{{
          $t('新建分货方案')
        }}</el-button>
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
    <div style="margin: 10px 0">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="sn" :label="$t('分货号')"> </el-table-column>
        <el-table-column prop="status" :label="$t('状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">{{ $t('草稿') }}</span>
            <span v-else-if="scope.row.status === 1">{{ $t('待拣货') }}</span>
            <span v-else-if="scope.row.status === 2">{{ $t('待打包') }}</span>
            <span v-else>{{ $t('已转运') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('包含采购单')"> </el-table-column>
        <el-table-column prop="quantity" :label="$t('预计分货（商品数/订单）')"> </el-table-column>
        <el-table-column prop="picking_quantity" :label="$t('实际拣货')"> </el-table-column>
        <el-table-column prop="created_at" :label="$t('创建时间')"> </el-table-column>
        <el-table-column prop="creator" :label="$t('创建人')"> </el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-main" v-if="['0'].includes(activeName)">{{
              $t('编辑')
            }}</el-button>
            <el-button
              class="btn-main"
              v-if="['0'].includes(activeName)"
              @click="onSubmit(scope.row.id)"
              >{{ $t('提交') }}</el-button
            >
            <el-button class="btn-light-red" v-if="['0', '1', '2'].includes(activeName)">{{
              $t('删除')
            }}</el-button>
            <el-button
              class="btn-deep-purple"
              v-if="['all', '1', '2', '3'].includes(activeName)"
              @click="onDetail(scope.row.id)"
              >{{ $t('详情') }}</el-button
            >
            <el-button class="btn-light-green" v-if="['1'].includes(activeName)" @click="onPick">{{
              $t('开始拣货')
            }}</el-button>
            <el-button class="btn-deep-blue" v-if="['2'].includes(activeName)" @click="onPack">{{
              $t('开始打包')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import purchaseSearch from './components/purchaseSearch.vue'
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      activeName: 'all',
      hasFilterCondition: false,
      searchData: {
        sn: '',
        timeList: [],
        logistics_sn: '',
        begin_date: '',
        end_date: ''
      },
      tableData: [],
      countData: []
    }
  },
  components: {
    purchaseSearch,
    SearchGroup,
    NlePagination
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
      // this.$request
      //   .transshipmentList({
      //     keyword: this.page_params.keyword,
      //     page: this.page_params.page,
      //     size: this.page_params.size,
      //     status: this.activeName === 'all' ? '' : this.activeName
      //   })
      //   .then(res => {
      //     if (res.ret) {
      //       this.tableLoading = false
      //       this.tableData = res.data
      //       this.page_params.page = res.meta.current_page
      //       this.page_params.total = res.meta.total
      //       this.onCount()
      //     }
      //   })
    },
    goSearch() {
      this.getList()
    },
    onCount() {
      // this.$request.pickOrderCount().then(res => {
      //   this.countData = res.data
      // })
    },
    addDistributeScheme() {
      this.$router.push({
        name: 'addScheme'
      })
    },
    handleClick() {
      this.page_params.page = 1
      this.page_params.handleQueryChange('page', 1)
      this.getList()
    },
    onPick() {
      this.$router.push({
        name: 'picking'
      })
    },
    onPack() {
      this.$router.push({
        name: 'purchasePack'
      })
    },
    onDetail(id) {
      this.$router.push({
        name: 'transshipmentDetail',
        params: { id }
      })
    },
    onSubmit() {}
  }
}
</script>

<style lang="scss">
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
</style>
