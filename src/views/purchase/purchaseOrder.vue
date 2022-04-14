<template>
  <div class="purchase-list">
    <el-tabs v-model="activeName" stretch @tab-click="handleClick" class="tab-length">
      <el-tab-pane :label="$t('全部')" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('草稿')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('未发货')" name="2"></el-tab-pane>
      <el-tab-pane :label="$t('已发货')" name="3"></el-tab-pane>
      <el-tab-pane :label="$t('已入库')" name="4"></el-tab-pane>
      <el-tab-pane :label="$t('已分货')" name="5"></el-tab-pane>
      <el-tab-pane :label="$t('已转运')" name="6"></el-tab-pane>
      <el-tab-pane :label="$t('作废')" name="7"></el-tab-pane>
    </el-tabs>
    <div>
      <el-button class="btn-deep-blue" @click="$router.push({ name: 'addPurchase' })">{{
        $t('新增采购单')
      }}</el-button>
      <el-button class="btn-green" v-if="activeName !== '7'">{{ $t('导出清单') }}</el-button>
      <el-button class="btn-deep-purple" v-if="activeName === '1'">{{ $t('提交采购') }}</el-button>
      <el-button class="btn-light-red" v-if="['1', '2', '3'].includes(activeName)">{{
        $t('删除')
      }}</el-button>
      <el-button class="btn-main" v-if="['4', '5'].includes(activeName)">{{
        $t('作废')
      }}</el-button>
      <el-button class="btn-blue-green" v-if="activeName === '5'">{{ $t('提交转运') }}</el-button>
    </div>
    <div style="margin-top: 20px">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="date" :label="$t('PO单号')"> </el-table-column>
        <el-table-column prop="status" :label="$t('状态')"> </el-table-column>
        <el-table-column :label="$t('PO单名称')"> </el-table-column>
        <el-table-column :label="$t('发货物流公司')"> </el-table-column>
        <el-table-column :label="$t('发货物流单号')"></el-table-column>
        <el-table-column :label="$t('采购总金额')"></el-table-column>
        <el-tabel-column :label="$t('采购总件/总箱数')"></el-tabel-column>
        <el-table-column :label="$t('创建时间')"></el-table-column>
        <el-tabel-column :label="$t('创建人')"></el-tabel-column>
        <el-table-column :label="$t('操作')" fixed="right">
          <template>
            <el-button
              class="btn-purple"
              @click="
                $router.push({
                  name: 'purchaseDetail'
                })
              "
              >{{ $t('详情') }}</el-button
            >
            <el-button class="btn-blue-green" v-if="['4', '5'].includes(activeName)">{{
              $t('分货')
            }}</el-button>
            <el-button class="btn-green" v-if="activeName === '4'">{{ $t('入库信息') }}</el-button>
            <el-button class="btn-light-red" v-if="activeName === '5'">{{ $t('作废') }}</el-button>
            <el-button class="btn-deep-purple" v-if="['2', '3'].includes(activeName)">{{
              $t('发货信息')
            }}</el-button>
            <el-button
              class="btn-deep-blue"
              v-if="['1', '2'].includes(activeName)"
              @click="editPurchase"
              >{{ $t('编辑') }}</el-button
            >
            <el-button class="btn-light-red" v-if="['1', '2', '3'].includes(activeName)">{{
              $t('删除')
            }}</el-button>
            <el-button class="btn-main" v-if="activeName === '5'">{{ $t('提交转运') }}</el-button>
            <el-button class="btn-deep-purple" v-if="activeName === '1'">{{
              $t('提交采购')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      activeName: '0',
      tableData: [
        {
          id: 1,
          status: 2
        }
      ]
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    handleClick(tab) {
      console.log(tab)
    },
    handleSelectionChange(val) {
      console.log(val)
    },
    editPurchase() {
      this.$router.push({
        name: 'addPurchase'
      })
    }
  }
}
</script>

<style lang="scss">
.purchase-list {
  .tab-length {
    width: 950px !important;
  }
}
</style>
