<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('所属仓库')"
    class="dialog-warehouse-fo"
    @close="clear"
  >
    <div>{{ $t('*所属仓库') }}</div>
    <el-select v-model="warehouseId" multiple :placeholder="$t('请选择')">
      <el-option
        v-for="item in allHouse"
        :key="item.id"
        :value="item.id"
        :label="item.warehouse_name"
      >
      </el-option>
    </el-select>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      warehouseId: [],
      userList: [],
      allHouse: [],
      id: ''
    }
  },
  methods: {
    // 获取当前所属仓库
    getList() {
      this.$request.getAffiliation(this.id).then(res => {
        if (res.ret) {
          this.warehouseId = res.data.length ? res.data.map(item => item.id) : [this.allHouse[0].id]
        }
      })
    },
    // 获取全部仓库
    getAllWarehouse() {
      this.allHouse = [
        {
          id: 0,
          warehouse_name: this.$t('全部仓库')
        }
      ]
      this.$request.getAffiliationAll().then(res => {
        if (res.ret) {
          if (res.data.length) {
            this.allHouse = this.allHouse.concat(
              res.data.map(item => ({ id: item.id, warehouse_name: item.warehouse_name }))
            )
          }
        }
      })
    },
    confirm() {
      let allId = this.allHouse[0].id
      let ids = this.warehouseId.includes(allId) ? [] : this.warehouseId
      this.$request.editAffiliations(this.id, { ids }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
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
      })
    },
    clear() {
      this.warehouseId = ''
    },
    init() {
      this.getList()
      this.getAllWarehouse()
    }
  }
}
</script>
<style lang="scss">
.dialog-warehouse-fo {
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }

  .el-dialog__close {
    color: #fff;
  }
}
</style>
