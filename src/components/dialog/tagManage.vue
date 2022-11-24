<template>
  <el-dialog :visible.sync="show" :title="$t('标签管理')" @close="clear">
    <el-button class="btn-main" @click="addRow">{{ $t('新增行') }}</el-button>
    <div style="margin-top: 20px">
      <el-table border :data="tableData">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" :label="$t('标签名字')">
          <template slot-scope="scope">
            <el-input v-if="scope.row.editState" v-model="scope.row.name"></el-input>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="addresses_count" :label="$t('引用次数')"></el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-main" v-if="scope.row.editState" @click="onSave(scope.row)">{{
              $t('保存')
            }}</el-button>
            <el-button class="btn-main" v-if="!scope.row.editState" @click="onEdit(scope.row)">{{
              $t('修改')
            }}</el-button>
            <el-button
              class="btn-light-red"
              v-if="!scope.row.editState && scope.row.addresses_count <= 1"
              @click="onDelete(scope.row)"
              >{{ $t('删除') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
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
      this.$request.addressTagList().then(res => {
        if (res.ret) {
          this.tableData = res.data.map(item => {
            return {
              ...item,
              editState: false
            }
          })
        }
      })
    },
    addRow() {
      this.tableData.push({
        name: '',
        editState: true
      })
    },
    onEdit(row) {
      row.editState = true
    },
    onDelete(row) {
      let id = row.id
      if (row.addresses_count > 1) {
        return this.$message.error(this.$t('不能删除引用次数大于1的标签'))
      }
      this.$request.delAddressTag(id).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    onSave(row) {
      if (!row.id) {
        this.$request.addAddressTag({ name: row.name }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getList()
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        row.editState = true
        this.$request.editAddressTag(row.id, { name: row.name }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getList()
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    clear() {}
  }
}
</script>

<style></style>
