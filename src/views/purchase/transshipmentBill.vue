<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('全部')" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('草稿')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('待拣货')" name="2"></el-tab-pane>
      <el-tab-pane :label="$t('待打包')" name="3"></el-tab-pane>
      <el-tab-pane :label="$t('已转运')" name="4"></el-tab-pane>
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
        <el-button class="btn-deep-purple" @click="onPick">{{ $t('开始拣货') }}</el-button>
        <el-button class="btn-light-green" @click="onPack">{{ $t('开始打包') }}</el-button>
      </div>
      <div class="header-search">
        <div class="searchGroup">
          <search-group :placeholder="$t('请输入关键字')" v-model="keyword" @search="goSearch">
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
        <el-table-column prop="address" :label="$t('分货号')"> </el-table-column>
        <el-table-column prop="date" :label="$t('状态')">
          <template>
            <span>{{ $t('草稿') }}</span>
            <span>{{ $t('待拣货') }}</span>
            <span>{{ $t('待打包') }}</span>
            <span>{{ $t('已转运') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('包含采购单')"> </el-table-column>
        <el-table-column prop="address" :label="$t('预计分货（商品数/订单）')"> </el-table-column>
        <el-table-column prop="date" :label="$t('实际拣货')"> </el-table-column>
        <el-table-column prop="name" :label="$t('创建时间')"> </el-table-column>
        <el-table-column prop="address" :label="$t('创建人')"> </el-table-column>
        <el-table-column :label="$t('操作')">
          <template>
            <el-button class="btn-main" v-if="['1'].includes(activeName)">{{
              $t('编辑')
            }}</el-button>
            <el-button class="btn-main" v-if="['1'].includes(activeName)">{{
              $t('提交')
            }}</el-button>
            <el-button class="btn-light-red" v-if="['1', '2', '3'].includes(activeName)">{{
              $t('删除')
            }}</el-button>
            <el-button class="btn-deep-purple" v-if="['2', '3', '4'].includes(activeName)">{{
              $t('详情')
            }}</el-button>
            <el-button class="btn-light-green" v-if="['2'].includes(activeName)" @click="onPick">{{
              $t('开始拣货')
            }}</el-button>
            <el-button class="btn-deep-blue" v-if="['3'].includes(activeName)" @click="onPack">{{
              $t('开始打包')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import purchaseSearch from './components/purchaseSearch.vue'
import { SearchGroup } from '@/components/searchs'
export default {
  data() {
    return {
      activeName: '1',
      hasFilterCondition: false,
      keyword: '',
      searchData: {
        sn: '',
        timeList: [],
        logistics_sn: '',
        begin_date: '',
        end_date: ''
      },
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  components: {
    purchaseSearch,
    SearchGroup
  },
  methods: {
    goSearch() {},
    addDistributeScheme() {
      this.$router.push({
        name: 'addScheme'
      })
    },
    handleClick(tab) {
      console.log(tab)
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
    }
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
