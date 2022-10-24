<template>
  <el-dialog :visible.sync="show" :title="$t('请选择打包箱')" @close="clear" width="60%">
    <div class="manage">
      <el-button @click="goManage">{{ $t('管理') }}</el-button>
    </div>
    <el-table :data="tableData" border>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column prop="name" :label="$t('箱子名称')"></el-table-column>
      <el-table-column prop="length" :label="$t('长')"></el-table-column>
      <el-table-column prop="width" :label="$t('宽')"></el-table-column>
      <el-table-column prop="height" :label="$t('高')"></el-table-column>
      <el-table-column prop="weight" :label="$t('重量')"></el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-main" @click="onSelect(scope.row)">{{ $t('选择箱子') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      this.$request.presetPackList().then(res => {
        if (res.ret) {
          this.tableData = res.data
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    goManage() {
      this.show = false
      this.$router.push({
        name: 'configurationMore',
        query: {
          activeName: '1',
          secondTab1: '8'
        }
      })
    },
    onSelect(row) {
      this.show = false
      this.success(row)
    },
    clear() {}
  }
}
</script>

<style>
.manage {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>
