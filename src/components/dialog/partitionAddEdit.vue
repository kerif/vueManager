<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('新增分区') : $t('编辑分区')"
    class="dialog-partition-add-edit"
    @close="clear"
    width="65%"
  >
    <div class="remark">
      {{
        $t(
          '注：新增分区后，该分区默认为未开启状态，同时会生成该分区对应的空白价格表，请先前往【价格表】配置价格后，再开启该分区投入使用。'
        )
      }}
    </div>
    <el-form ref="form" :model="ruleForm" class="commission-top">
      <el-form-item :label="$t('分区名称')">
        <el-input class="input-sty" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('参考时效')">
        <el-input class="input-sty" v-model="ruleForm.reference_time"></el-input>
      </el-form-item>
      <el-form-item :label="$t('分区方案')">
        <el-radio-group v-model="ruleForm.radio">
          <el-radio :label="1">{{ $t('国家地区') }}</el-radio>
          <el-radio :label="2">{{ $t('国家邮编') }}</el-radio>
        </el-radio-group>
        <br />
        <el-cascader
          v-if="ruleForm.radio === 1"
          style="width: 30%; margin-left: 70px"
          @change="chooseAres"
          v-model="areaData"
          :options="options"
          ref="country"
          :props="props"
          collapse-tags
          clearable
        ></el-cascader>
        <el-row v-else style="margin-left: 60px" :gutter="20">
          <el-col :span="5">
            <el-select
              v-model="ruleForm.country_id"
              filterable
              clearable
              class="country-select"
              :placeholder="$t('请选择国家')"
            >
              <el-option
                v-for="item in countryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="country-btn">
            <el-button @click="addPost">{{ $t('添加邮编规则') }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-table
        :data="postData"
        v-if="ruleForm.radio !== 1"
        border
        style="width: 80%; margin-left: 60px"
      >
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column :label="$t('规则')" prop="rule"> </el-table-column>
        <el-table-column :label="$t('内容')">
          <template slot-scope="scope">
            <el-col>
              <el-input
                v-model="scope.row.start"
                size="mini"
                :placeholder="$t('请输入起始邮编')"
              ></el-input>
              -
              <el-input
                v-model="scope.row.end"
                size="mini"
                :placeholder="$t('请输入截止邮编')"
              ></el-input>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <!-- 移除 -->
            <el-button class="danger" @click="deletePostcode(scope.$index, postData)">{{
              $t('移除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import { getIds } from '@/utils/index'
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        reference_time: '',
        country_id: '',
        radio: 1
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
      areaData: [],
      newWarehouseList: [],
      keyValue: 0,
      areaIds: [],
      areasData: [],
      postData: [{ rule: '邮编规则', start: '', end: '', type: 1 }],
      tmpId: '',
      areaNum: [],
      postcodes: [],
      start: '',
      end: ''
    }
  },
  created() {
    this.getCountry()
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
        console.log(res.data)
        this.ruleForm.reference_time = res.data.reference_time
        this.ruleForm.name = res.data.name
        console.log(res.data.areas)
        if (res.data.areas) {
          this.areaData = res.data.areas.map(item =>
            [item.country_id, item.area_id, item.sub_area_id].filter(item => item)
          )
        }
        console.log(this.areaData)
        this.ruleForm.country_id = res.data.country_id
        this.ruleForm.radio = res.data.type
        this.postData = res.data.postcode_areas
      })
    },
    getPartition() {
      this.$request.regionTmpDetails(this.tmpId, this.id).then(res => {
        console.log(res.data)
        this.ruleForm.reference_time = res.data.reference_time
        this.ruleForm.name = res.data.name
        console.log(res.data.areas)
        if (res.data.areas) {
          this.areaData = res.data.areas.map(item =>
            [item.country_id, item.area_id, item.sub_area_id].filter(item => item)
          )
        }
        console.log(this.areaData)
        this.ruleForm.country_id = res.data.country_id
        this.ruleForm.radio = res.data.type
        this.postData = res.data.postcode_areas
      })
    },
    chooseAres(area) {
      console.log(area)
      this.areaIds = area.map(item => ({
        country_id: item[0],
        area_id: item[1],
        sub_area_id: item[2]
      }))
      // for (var v = 0; v < area.length; v++) {
      //   if (area[v][0] === -1) {
      //     console.log(1)
      //     console.log(this.countryList)
      //     this.areaData = getIds(this.countryList)
      //     console.log(this.areaData)
      //   } else if (area[v][0] === -1 && area.length - 1 < this.countryList.length) {
      //     console.log(2)
      //   }
      // }
    },
    removeTag(tag) {
      if (tag === -1) {
        this.areaData = []
      }
    },
    // 获取多级区域数据 编辑渠道时
    getAllCountries() {
      this.$request.regionCountry(this.$route.params.id).then(res => {
        if (res.ret) {
          this.countryList = res.data
          console.log(this.countryList)
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
          this.countryList = res.data
          // res.data.unshift({
          //   id: -1,
          //   name: '全选',
          //   areas: []
          // })
          console.log(this.countryList)
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
    // 切换国家
    changeCountry(item) {
      console.log(item, 'item')
    },
    editPartition(id) {
      console.log(id)
    },
    // 新增行
    addRow() {
      this.tableData.push({
        country_id: '',
        areaData: []
      })
    },
    addPost() {
      this.postData.push({
        rule: '邮编规则',
        start: '',
        end: '',
        type: 1
      })
    },
    deleteParition(index, rows) {
      rows.splice(index, 1)
    },
    deletePostcode(index, rows) {
      rows.splice(index, 1)
    },
    confirm() {
      if (this.areaData.length) {
        this.areasData = this.areaData.map(item => ({
          country_id: item[0],
          area_id: item[1],
          sub_area_id: item[2]
        }))
      }
      if (this.status === 'channel') {
        let params = {}
        params = {
          name: this.ruleForm.name,
          reference_time: this.ruleForm.reference_time,
          type: this.ruleForm.radio
        }
        if (this.ruleForm.radio === 1) {
          params.areas = this.areaData.length ? this.areasData : this.areaIds
        } else {
          params.country_id = this.ruleForm.country_id
          params.postcodes = this.postData
        }
        if (this.id) {
          // 更新
          this.$request.updateRegions(this.$route.params.id, this.id, params).then(res => {
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
        } else {
          // 新建
          this.$request.newLineRegions(this.$route.params.id, params).then(res => {
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
        }
      } else {
        let params = {}
        params = {
          name: this.ruleForm.name,
          reference_time: this.ruleForm.reference_time,
          type: this.ruleForm.radio
        }
        if (this.ruleForm.radio === 1) {
          params.areas = this.areaData.length ? this.areasData : this.areaIds
        } else {
          params.country_id = this.ruleForm.country_id
          params.postcodes = this.postData
        }
        if (this.id) {
          // 模板
          this.$request.updateRegionTmpDetails(this.tmpId, this.id, params).then(res => {
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
        } else {
          this.$request.newRegionTmp(this.tmpId, params).then(res => {
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
        }
      }
    },
    init() {
      this.getCountry()
      // if (this.status === 'partition') {
      //   this.getCountry()
      // } else {
      //   this.getAllCountries()
      // }
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
      this.ruleForm.country_id = ''
      this.areaData = []
      this.postData = [{ rule: '邮编规则', start: '', end: '', type: 1 }]
    }
  }
}
</script>
<style lang="scss">
.dialog-partition-add-edit {
  .pagination-box {
    margin-top: 10px;
  }
  .remark {
    color: red;
    margin-bottom: 10px;
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
