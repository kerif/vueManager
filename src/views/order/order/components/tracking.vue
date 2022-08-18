<template>
  <el-dialog :visible.sync="showTracking" :title="$t('轨迹')" :before-close="close" @close="clear">
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
      trackData: []
    }
  },
  created() {
    if (this.trackId) {
      this.getList()
    }
  },
  props: {
    showTracking: {
      type: Boolean,
      default: false
    },
    trackId: {
      type: [Number, String]
    }
  },
  methods: {
    getList() {
      this.$request.getPackageDetails(this.trackId).then(res => {
        console.log(res)
        if (res.ret) {
          this.trackData = res.data.tracking_logs
          console.log(res)
        }
      })
    },
    close() {
      this.$emit('receiveVal', false)
    },
    clear() {}
  }
}
</script>

<style></style>
