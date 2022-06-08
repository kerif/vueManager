<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('全部')" name="first"></el-tab-pane>
      <el-tab-pane :label="$t('草稿')" name="second"></el-tab-pane>
      <el-tab-pane :label="$t('待拣货')" name="third"></el-tab-pane>
      <el-tab-pane :label="$t('待打包')" name="fourth"></el-tab-pane>
      <el-tab-pane :label="$t('已转运')" name="fourth"></el-tab-pane>
    </el-tabs>
    <el-button class="btn-main">{{ $t('新建分货方案') }}</el-button>
    <div style="margin: 10px 0">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="name" :label="$t('操作')"> </el-table-column>
        <el-table-column prop="address" :label="$t('分货号')"> </el-table-column>
        <el-table-column prop="date" :label="$t('状态')"> </el-table-column>
        <el-table-column prop="name" :label="$t('包含采购单')"> </el-table-column>
        <el-table-column prop="address" :label="$t('预计分货')"> </el-table-column>
        <el-table-column prop="date" :label="$t('实际拣货')"> </el-table-column>
        <el-table-column prop="name" :label="$t('创建时间')"> </el-table-column>
        <el-table-column prop="address" :label="$t('创建人')"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'second',
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  methods: {
    handleClick(tab) {
      console.log(tab)
    }
  }
}
</script>

<style></style>
