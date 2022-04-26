<template>
  <el-dialog
    :visible.sync="showSelectGoods"
    :title="$t('选择商品清单')"
    :before-close="close"
    @close="clear"
  >
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column :label="$t('物品中文名称')" prop="name" width="120"> </el-table-column>
      <el-table-column prop="name" :label="$t('品牌')" width="120"> </el-table-column>
      <el-table-column prop="address" :label="$t('剩余明细数量')"> </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  methods: {
    handleSelectionChange() {},
    clear() {}
  }
}
</script>

<style></style>
