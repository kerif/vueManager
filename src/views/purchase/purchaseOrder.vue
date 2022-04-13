<template>
  <div class="purchase-list">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('全部')" name="first"></el-tab-pane>
      <el-tab-pane :label="$t('草稿')" name="second"></el-tab-pane>
      <el-tab-pane :label="$t('未发货')" name="third"></el-tab-pane>
      <el-tab-pane :label="$t('已发货')" name="fourth"></el-tab-pane>
      <el-tab-pane :label="$t('已入库')" name="five"></el-tab-pane>
      <el-tab-pane :label="$t('已分货')" name="six"></el-tab-pane>
      <el-tab-pane :label="$t('已转运')" name="seven"></el-tab-pane>
      <el-tab-pane :label="$t('作废')" name="eight"></el-tab-pane>
    </el-tabs>
    <div>
      <el-button @click="$router.push({ name: 'addPurchase' })">{{ $t('新增采购单') }}</el-button>
      <el-button>{{ $t('导出清单') }}</el-button>
      <el-button>{{ $t('提交采购') }}</el-button>
      <el-button>{{ $t('删除') }}</el-button>
      <el-button>{{ $t('作废') }}</el-button>
      <el-button>{{ $t('提交转运') }}</el-button>
    </div>
    <div style="margin-top: 20px">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="date" :label="$t('操作')">
          <template>
            <el-button
              @click="
                $router.push({
                  name: 'purchaseDetail'
                })
              "
              >{{ $t('详情') }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="date" label="PO单号"> </el-table-column>
        <el-table-column prop="status" label="状态"> </el-table-column>
        <el-table-column prop="address" label="PO单名称"> </el-table-column>
        <el-table-column prop="address" label="发货物流公司"> </el-table-column>
        <el-table-column prop="address" label="发货物流单号"></el-table-column>
        <el-table-column prop="address" label="采购总金额"></el-table-column>
        <el-tabel-column prop="address" label="采购总件/总箱数"></el-tabel-column>
        <el-table-column prop="address" label="创建时间"></el-table-column>
        <el-tabel-column prop="address" label="创建人"></el-tabel-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
      tableData: [
        {
          id: 1,
          status: 2
        }
      ]
    }
  },
  methods: {
    handleClick(tab) {
      console.log(tab)
    },
    handleSelectionChange(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss">
.purchase-list {
}
</style>
