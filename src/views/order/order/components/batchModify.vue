<template>
  <el-dialog
    :visible.sync="showBatch"
    :title="$t('批量修改')"
    :before-close="close"
    class="batchModify-container"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      <el-form-item :label="$t('寄送国家')">
        <el-select v-model="ruleForm.country" :placeholder="$t('请选择国家')" filterable clearable>
          <el-option v-for="item in countryList" :key="item.id" :label="item.name" :value="item.id">
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
      <el-table :data="PackageData" border style="width: 100%">
        <el-table-column prop="date" :label="$t('快递单号')" width="180"> </el-table-column>
        <el-table-column prop="name" :label="$t('寄送国家')" width="180"> </el-table-column>
        <el-table-column prop="address" :label="$t('包裹属性')"> </el-table-column>
        <el-table-column prop="address" :label="$t('操作')">
          <i class="el-icon-delete"></i>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer">
      <el-button @click="showBatch = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      typeList: [],
      PackageData: [],
      countryList: [],
      ruleForm: {
        checkList: [],
        country: ''
      }
    }
  },
  created() {
    this.getProp()
    this.getCountry()
    this.getList()
  },
  props: {
    showBatch: {
      type: Boolean,
      default: false
    },
    deleteNum: {
      type: Array
    }
  },
  methods: {
    //获取国家
    getCountry() {
      this.$request.countryLocation().then(res => {
        if (res.ret) {
          this.countryList = res.data
          this.options = res.data.map(item => {
            return {
              value: item.id,
              label: item.name,
              children:
                item.areas < 1
                  ? undefined
                  : item.areas.map(item => {
                      return {
                        value: item.id,
                        label: item.name,
                        children:
                          item.areas < 1
                            ? undefined
                            : item.areas.map(item => {
                                return {
                                  value: item.id,
                                  label: item.name
                                }
                              })
                      }
                    })
            }
          })
          console.log(this.options)
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
    getList() {},
    clear() {
      this.ruleForm.checkList = []
      this.ruleForm.country = ''
    },
    close() {
      this.$emit('passVal', false)
    },
    submit() {
      this.$request.batchUpdate().then(res => {
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
}
</style>
