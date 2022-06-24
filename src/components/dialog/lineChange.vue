<template>
  <el-dialog
    :visible.sync="show"
    :title="this.state === 'line' ? $t('更改线路') : $t('更改仓库')"
    class="dialog-change-line"
    width="35%"
    @close="clear"
  >
    <el-form :model="user" ref="user" class="demo-ruleForm" label-position="top">
      <!-- 更改线路 -->
      <el-form-item v-if="state === 'line'">
        <el-select v-model="user.express_line_id" clearable :placeholder="$t('请选择')">
          <el-option
            v-for="item in expressData"
            :key="item.id"
            :value="item.id"
            :label="`${item.name}---${$t('限重')}${item.max_weight}` + localization.weight_unit"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 更改仓库 -->
      <el-form-item v-if="state === 'warehouse'">
        <el-select v-model="user.warehouse_id" clearable :placeholder="$t('请选择')">
          <el-option
            v-for="item in warehouseData"
            :key="item.id"
            :value="item.id"
            :label="item.warehouse_name"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('user')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      user: {
        express_line_id: '',
        name: '',
        max_weight: '',
        warehouse_id: '',
        warehouse_name: ''
      },
      expressData: [],
      warehouseData: [],
      localization: {},
      state: '',
      id: ''
    }
  },
  methods: {
    getList() {
      if (this.state === 'line') {
        this.getExpress()
      } else if (this.state === 'warehouse') {
        this.getWarehouse()
      }
    },
    // 获取全部线路详情
    getExpress() {
      this.$request
        .getUsable(this.$route.params.id, {
          warehouse_id: this.id
        })
        .then(res => {
          if (res.ret) {
            this.expressData = res.data
            this.localization = res.localization
          }
        })
    },
    // 获取全部仓库详情
    getWarehouse() {
      this.$request.getUsableWarehouse().then(res => {
        if (res.ret) {
          this.warehouseData = res.data
        }
      })
    },
    confirm() {
      if (this.state === 'line' && this.user.express_line_id === '') {
        return this.$message.error(this.$t('请选择线路'))
      }
      if (this.state === 'warehouse' && this.user.warehouse_id === '') {
        return this.$message.error(this.$t('请选择仓库'))
      }
      if (this.state === 'line') {
        let user = this.expressData.filter(item => item.id === this.user.express_line_id)[0]
        console.log(user)
        this.success(user)
        this.show = false
      } else if (this.state === 'warehouse') {
        let warehouse = this.warehouseData.filter(item => item.id === this.user.warehouse_id)[0]
        console.log(warehouse)
        this.success(warehouse)
        this.show = false
      }
    },
    clear() {
      this.user.express_line_id = ''
      this.user.warehouse_id = ''
    },
    init() {
      console.log(this.state, 'state')
      console.log(this.id, 'id')
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.dialog-change-line {
  .el-input {
    // width: 300px !important;
    margin-left: 50px;
  }
  .el-textarea {
    width: 250px !important;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 100px;
  }
  .el-form-item__error {
    margin-left: 100px !important;
  }
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
