<template>
  <el-dialog :title="$t('成员')" :visible.sync="show" @close="clear">
    <el-button class="btn-main">{{ $t('添加') }}</el-button>
    <el-table>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="" :label="$t('客户ID')"></el-table-column>
      <el-table-column prop="" :label="$t('客户昵称')"></el-table-column>
      <el-table-column prop="" :label="$t('最后登录时间')"></el-table-column>
      <el-table-column :label="$t('操作')">
        <template>
          <el-button class="btn-light-red">{{ $t('移除') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    clear() {}
  }
}
</script>

<style></style>
