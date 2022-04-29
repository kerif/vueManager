<template>
  <el-dialog :visible.sync="show" :title="$t('自提点地址')" @close="onClose">
    <el-table :data="stationsData" border @row-click="onRowAddress" style="width: 100%">
      <el-table-column>
        <template slot-scope="scope">
          <el-radio v-model="box.station_id" :label="scope.row.id"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('自提点名称')"> </el-table-column>
      <el-table-column :label="$t('详细地址')" prop="address"> </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirmSelf">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      box: {
        station_id: ''
      },
      selfAddress: {},
      selfData: {},
      stationsData: []
    }
  },
  methods: {
    onRowAddress(row) {
      this.box.station_id = row.id
      this.selfAddress = row
    },
    confirmSelf() {
      if (!this.box.station_id) {
        return this.$message.error(this.$t('请选择'))
      }
      this.selfData = this.selfAddress
      this.show = false
    },
    onClose() {
      this.box.station_id = ''
      this.selfAddress = {}
    }
  }
}
</script>

<style></style>
