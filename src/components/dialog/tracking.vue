<template>
  <el-dialog :visible.sync="show" :title="$t('轨迹')" @close="clear">
    <el-table :data="trackData" border stripe>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column prop="status_name" :label="$t('物流轨迹')"></el-table-column>
      <el-table-column prop="created_at" :label="$t('时间')"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      trackData: []
    }
  },
  methods: {
    init() {
      if (this.id) {
        this.getList()
      }
    },
    getList() {
      this.$request.getPackageDetails(this.id).then(res => {
        if (res.ret) {
          this.trackData = res.data.tracking_logs
        }
      })
    },
    clear() {}
  }
}
</script>

<style></style>
