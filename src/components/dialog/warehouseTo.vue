<template>
  <el-dialog :visible.sync="show" title="所属仓库" class="dialog-warehouse-fo" @close="clear">
    <div>*所属仓库</div>
    <el-select v-model="warehouseId">
      <el-option
      v-for="item in allHouse"
      :key="item.id"
      :value="item.id"
      :label="item.warehouse_name">
      </el-option>
    </el-select>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      warehouseId: 0,
      userList: [],
      allHouse: [],
      id: ''
    }
  },
  methods: {
    // 获取当前所属仓库
    getList () {
      this.$request.getAffiliation(this.id).then(res => {
        if (res.ret) {
          this.warehouseId = res.data.id || 0
        }
      })
    },
    // 获取全部仓库
    getAllWarehouse () {
      this.allHouse = [
        {
          id: 0,
          warehouse_name: '全部仓库'
        }
      ]
      this.$request.getAffiliationAll().then(res => {
        if (res.ret) {
          if (res.data.length) {
            this.allHouse = this.allHouse.concat(res.data.map(item => ({ id: item.id, warehouse_name: item.warehouse_name })))
          }
          // this.allHouse = res.data
        }
      })
    },
    confirm () {
      this.$request.editAffiliation(this.id, this.warehouseId).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.show = false
          this.success()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.show = false
      })
    },
    clear () {
      this.warehouseId = ''
    },
    init () {
      this.getList()
      this.getAllWarehouse()
    }
  }
}
</script>
<style lang="scss">
.dialog-warehouse-fo {
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }

  .el-dialog__close {
    color: #FFF;
  }
}
</style>
