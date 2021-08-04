<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('新增价格表') : $t('编辑价格表')"
    class="dialog-sales-add-edit"
    @close="clear"
    width="65%"
  >
    <el-form ref="form" :model="ruleForm" class="commission-top">
      <el-form-item :label="$t('价格表名称')">
        <el-input class="input-sty" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('排序')">
        <el-input class="input-sty" v-model="ruleForm.reference_time"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px">
      {{ $t('适用渠道（可多选）') }}
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index"> </el-table-column>
      <el-table-column :label="$t('国家')" style="width: 100%">
        <template slot-scope="scope">
          <el-cascader
            style="width: 100%"
            @change="chooseAres(scope.row.areaData)"
            v-model="scope.row.areaData"
            :options="options"
            :props="props"
            collapse-tags
            clearable
          ></el-cascader>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import NlePagination from '@/components/pagination'
// import { pagination } from '@/mixin'
export default {
  // components: {
  //   NlePagination
  // },
  // mixins: [pagination],
  data() {
    return {
      ruleForm: {
        name: '',
        reference_time: ''
      },
      templateData: [],
      countryList: [], // 获取全部国家
      options: [],
      agentName: '',
      props: { multiple: true, checkStrictly: false },
      tableData: [
        {
          areaData: []
        }
      ],
      state: '',
      id: '',
      status: '',
      areaData: null,
      newWarehouseList: [],
      keyValue: 0,
      areaIds: [],
      areasData: []
    }
  },
  methods: {
    getList() {
      if (this.status === 'partition') {
        this.getPartition()
      } else {
        this.getRegions()
      }
    },
    getRegions() {
      this.$request.getRegionDetails(this.$route.params.id, this.id).then(res => {
        this.ruleForm.reference_time = res.data.reference_time
        this.ruleForm.name = res.data.name
        if (res.data.areas) {
          this.tableData[0].areaData = res.data.areas.map(item =>
            [item.country_id, item.area_id, item.sub_area_id].filter(item => item)
          )
        }
        console.log(this.tableData, 'this.areaData')
      })
    },
    getPartition() {
      this.$request.getRegionsTem(this.id).then(res => {
        this.ruleForm.reference_time = res.data.reference_time
        this.ruleForm.name = res.data.name
        if (res.data.areas) {
          this.tableData[0].areaData = res.data.areas.map(item =>
            [item.country_id, item.area_id, item.sub_area_id].filter(item => item)
          )
        }
      })
    },
    chooseAres(area) {
      this.areaIds = area.map(item => ({
        country_id: item[0],
        area_id: item[1],
        sub_area_id: item[2]
      }))
      console.log(this.areaIds, 'form.area_ids')
    },
    // 获取多级区域数据 编辑渠道时
    getAllCountries() {
      this.$request.regionCountry(this.$route.params.id).then(res => {
        if (res.ret) {
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
        }
      })
    },
    // 预设分区表 获取国家
    getCountry() {
      this.$request.countryLocation().then(res => {
        if (res.ret) {
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
        }
      })
    },
    // 切换国家
    changeCountry(item) {
      // this.areaData = []
      console.log(item, 'item')
      // ++this.keyValue
      // const selectList = this.countryList.find(item => item.value === this.form.country_id)
      // this.newWarehouseList = selectList ? selectList.children : []
    },
    handleChange() {
      // this.form.area_id = this.areaData[0]
      // this.form.sub_area_id = this.areaData[1]
    },
    editPartition(id) {
      console.log(id)
    },
    // 新增行
    addRow() {
      console.log(this.tableData, 'this.tableData')
      this.tableData.push({
        country_id: '',
        areaData: []
      })
    },
    deleteParition(index, rows) {
      rows.splice(index, 1)
    },
    confirm() {
      if (this.tableData[0].areaData.length) {
        this.areasData = this.tableData[0].areaData.map(item => ({
          country_id: item[0],
          area_id: item[1],
          sub_area_id: item[2]
        }))
      }
      if (this.status === 'channel') {
        if (this.id) {
          this.$request
            .updateRegionDetails(this.$route.params.id, this.id, {
              name: this.ruleForm.name,
              reference_time: this.ruleForm.reference_time,
              areas: this.areaIds.length === 0 ? this.areasData : this.areaIds
            })
            .then(res => {
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
              this.show = false
            })
        } else {
          this.$request
            .newRegions(this.$route.params.id, {
              name: this.ruleForm.name,
              reference_time: this.ruleForm.reference_time,
              areas: this.areaIds
            })
            .then(res => {
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
              this.show = false
            })
        }
      } else {
        if (this.id) {
          this.$request
            .updateRegionsTem(this.id, {
              name: this.ruleForm.name,
              reference_time: this.ruleForm.reference_time,
              areas: this.areaIds.length === 0 ? this.areasData : this.areaIds
            })
            .then(res => {
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
              this.show = false
            })
        } else {
          this.$request
            .newRegionsTem({
              name: this.ruleForm.name,
              reference_time: this.ruleForm.reference_time,
              areas: this.areaIds
            })
            .then(res => {
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
              this.show = false
            })
        }
      }
    },
    init() {
      console.log(this.status, 'status')
      if (this.status === 'partition') {
        this.getCountry()
      } else {
        this.getAllCountries()
      }
      if (this.id) {
        this.getList()
      }
    },
    clear() {
      this.id = ''
      this.areaIds = []
      this.state = ''
      this.status = ''
      this.ruleForm.reference_time = ''
      this.ruleForm.name = ''
      this.tableData[0].areaData = []
    }
  }
}
</script>
<style lang="scss">
.dialog-sales-add-edit {
  .pagination-box {
    margin-top: 10px;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .input-select {
    width: 30%;
    margin-right: 10px;
  }
  .el-dialog__close {
    color: #fff;
  }
  .commission-top {
    margin-left: 20px;
  }
  .input-sty {
    width: 35%;
  }
  .add-row {
    margin-bottom: 10px;
    text-align: right;
  }
}
</style>
