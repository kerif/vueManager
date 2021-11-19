<template>
  <el-dialog
    :visible.sync="showBatch"
    :title="$t('批量修改')"
    :before-close="close"
    class="batchModify-container"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      <el-form-item :label="$t('申报价值')">
        <el-input v-model="ruleForm.package_value" :placeholder="$t('请申报价值')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('寄送仓库')">
        <el-select
          v-model="ruleForm.warehouse_id"
          @change="getAreaData"
          :placeholder="$t('请选择')"
          filterable
          clearable
        >
          <el-option
            v-for="item in agentData"
            :key="item.id"
            :value="item.id"
            :label="item.warehouse_name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('寄送国家')">
        <el-select
          v-model="ruleForm.country"
          :placeholder="$t('请选择')"
          :disabled="this.ruleForm.warehouse_id === ''"
          filterable
          clearable
        >
          <el-option v-for="item in shipData" :key="item.id" :value="item.id" :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('属性')">
        <el-checkbox-group v-model="ruleForm.checkList">
          <el-checkbox v-for="item in typeList" :key="item.id" :label="item.id">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="remark">{{ $t('修改数据将应用于以下全部包裹') }}</div>
      <el-table :data="packageData" border style="width: 100%">
        <el-table-column :label="$t('快递单号')" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.express_num }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="destination_country.cn_name" :label="$t('寄送国家')" width="180">
        </el-table-column>
        <el-table-column :label="$t('包裹属性')">
          <template slot-scope="scope">
            <span v-for="item in scope.row.props" :key="item.id">
              {{ item.cn_name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('申报价值')" prop="package_value"> </el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <i
              class="el-icon-delete delete-icon"
              @click="deleteExpressNum(scope.$index, orderData)"
            ></i>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer">
      <el-button @click="close">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      typeList: [],
      countryList: [],
      agentData: [],
      shipData: [],
      areaId: '',
      ruleForm: {
        checkList: [],
        warehouse_id: '',
        country: '',
        package_value: ''
      }
    }
  },
  created() {
    this.getProp()
    this.getAgentData()
  },
  props: {
    showBatch: {
      type: Boolean,
      default: false
    },
    deleteNum: {
      type: Array
    },
    packageData: {
      type: Array
    }
  },
  methods: {
    // 获取仓库
    getAgentData() {
      this.$request.getSimpleWarehouse().then(res => {
        this.agentData = res.data
      })
    },
    // 通过仓库id拉取相对应的地区
    getAreaData(id) {
      this.$request.getArea(id).then(res => {
        if (res.ret) {
          this.shipData = res.data
          console.log(this.shipData)
        }
      })
    },

    // 获取渠道属性
    getProp() {
      this.$request.getProps().then(res => {
        if (res.ret) {
          this.typeList = res.data
          this.localization = res.localization
          console.log(this.typeList)
        }
      })
    },
    clear() {
      this.ruleForm.checkList = []
      this.ruleForm.country = ''
      this.ruleForm.warehouse_id = ''
      this.ruleForm.package_value = ''
    },
    close() {
      this.$emit('passVal', false)
    },
    deleteExpressNum(index, rows) {
      rows.splice(index, 1)
    },
    submit() {
      let param = {
        ids: this.deleteNum,
        country_id: this.ruleForm.country,
        prop_ids: this.ruleForm.checkList
      }
      this.$confirm(this.$t('确定进行批量修改操作吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.batchUpdate(param).then(res => {
          if (res.ret) {
            console.log(res)
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.batchModify-container {
  font-size: 14px;
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
  .remark {
    color: red;
  }
  .el-form-item__content {
    margin-left: 100px;
  }
  .delete-icon {
    color: red;
  }
}
</style>
