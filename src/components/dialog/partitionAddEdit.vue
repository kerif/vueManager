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
        <el-checkbox v-if="ruleForm.radio === 1" v-model="check" @change="onCheck">{{
          $t('全选')
        }}</el-checkbox>
        <div v-if="ruleForm.radio === 1">
          <h4>{{ $t('国家/地区方案') }}</h4>
          {{ partitionData }}
          <el-table :data="partitionData">
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column prop="name" width="155" :label="$t('国家/地区')"> </el-table-column>
            <el-table-column :label="$t('省/州/市')">
              <template slot-scope="scope">
                <div v-if="scope.row.children.length > 0">
                  <el-card class="box-card" v-for="item in scope.row.children" :key="item.id">
                    <div slot="header" class="clearfix">
                      <span class="xianzhi">限:</span><span> {{ item.name }}</span>
                      <el-button-group style="float: right; padding: 3px 0">
                        <el-button size="mini">添加城市</el-button>
                        <el-button size="mini">移除城市</el-button>
                      </el-button-group>
                    </div>
                    <div v-if="item.children.length > 0">
                      <el-tag v-for="subitem in item.children" :key="subitem.id" closable>
                        {{ subitem.name }}
                      </el-tag>
                    </div>
                    <div v-else>
                      <el-alert
                        :title="`不设置默认为${item.name}全境范围`"
                        type="success"
                        :closable="false"
                      >
                      </el-alert>
                    </div>
                  </el-card>
                </div>
                <div v-else>
                  <el-card>
                    <el-alert title="不设置默认为全境范围" type="success" :closable="false">
                    </el-alert>
                  </el-card>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="155" :label="$t('操作')">
              <template slot="header">
                <el-button size="mini">添加国家/地区</el-button>
              </template>
              <template>
                <el-button size="mini">添加省/州</el-button><br />
                <el-button size="mini">移除省/州</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-cascader
          v-if="ruleForm.radio === 1"
          style="width: 30%; margin-left: 20px"
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
import { getIds } from '@/utils/index'
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
      end: '',
      check: false,
      checkLength: '',
      newArr: [],
      partitionData: [
        {
          id: 1,
          name: '美国',
          children: [
            {
              id: 10,
              name: '亚拉巴马州',
              children: [
                {
                  id: 100,
                  name: '伯明翰'
                },
                {
                  id: 101,
                  name: '蒙哥马利'
                },
                {
                  id: 102,
                  name: '莫比尔'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          name: '加拿大',
          children: []
        },
        {
          id: 3,
          name: '英国',
          children: [
            {
              id: 30,
              name: '大不列颠',
              children: []
            }
          ]
        }
      ]
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
      this.areaIds = area.map(item => ({
        country_id: item[0],
        area_id: item[1],
        sub_area_id: item[2]
      }))
      if (this.checkLength !== this.areaData.length) {
        this.check = false
      } else {
        this.check = true
      }
    },
    onCheck(v) {
      getIds(this.countryList, this.newArr)
      this.areaData = v ? this.newArr : []
      this.checkLength = this.newArr.length
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
  .xianzhi {
    padding: 5px;
    background-color: red;
    color: white;
    border-radius: 5px;
  }
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
