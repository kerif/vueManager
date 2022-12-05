<template>
  <el-drawer
    size="85%"
    :visible.sync="show"
    :title="state === 'add' ? $t('新增分区') : $t('编辑分区')"
    class="dialog-partition-add-edit"
    @close="clear"
  >
    <div class="pad">
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
            <el-radio :label="1">{{ $t('国家/地区方案') }}</el-radio>
            <el-radio :label="2">{{ $t('单国家/地区邮编方案') }}</el-radio>
          </el-radio-group>
          <br />
          <div v-if="ruleForm.radio === 1">
            <h4>{{ $t('国家/地区方案') }}</h4>
            <el-table :data="partitionAreaData">
              <el-table-column label="#" width="55" type="index"> </el-table-column>
              <el-table-column prop="name" width="155" :label="$t('国家/地区')"> </el-table-column>
              <el-table-column :label="$t('省/州/市')">
                <template slot-scope="scope">
                  <div v-if="scope.row.children.length > 0">
                    <el-card
                      style="float: left; width: 50%"
                      v-for="item in scope.row.children"
                      :key="item.id"
                    >
                      <div slot="header" class="clearfix">
                        <span class="xianzhi">限:</span><span> {{ item.name }}</span>
                        <el-button-group style="float: right; padding: 3px 0">
                          <el-button size="mini" @click="chooseCity(scope.row.id, item.id)"
                            >添加城市</el-button
                          >
                          <el-button size="mini" @click="removeProvince(scope.row.id, item.id)"
                            >移除此项</el-button
                          >
                        </el-button-group>
                      </div>
                      <div v-if="item.children.length > 0">
                        <el-tag
                          v-for="subitem in item.children"
                          :key="subitem.id"
                          closable
                          @close="removeCity(scope.row.id, item.id, subitem.id)"
                        >
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
                  <el-button size="mini" @click="chooseCountryOrArea">添加国家/地区</el-button>
                </template>
                <template slot-scope="scope">
                  <el-button size="mini" @click="chooseProvince(scope.row.id)">添加省/州</el-button
                  ><br />
                  <el-button size="mini" @click="removeCountryOrArea(scope.row.id)"
                    >移除此项</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div v-else-if="ruleForm.radio === 2">
            <h4>{{ $t('单国家/地区邮编方案') }}</h4>
            <el-table :data="partitionPostData">
              <el-table-column label="#" type="index" width="55"> </el-table-column>
              <el-table-column prop="name" width="155" :label="$t('国家/地区')"> </el-table-column>
              <el-table-column :label="$t('内容')">
                <template slot-scope="scope">
                  <el-card
                    class="post-box"
                    v-for="(item, index) in scope.row.children"
                    :key="item.id"
                  >
                    <div slot="header">
                      <span>{{ $t('请输入邮编范围') }}</span>
                      <el-button
                        style="float: right; padding: 3px 0"
                        type="text"
                        @click="removePost(scope.$index, index)"
                        >移除此项</el-button
                      >
                    </div>
                    <el-row>
                      <el-col :span="11">
                        <el-input
                          v-model="item.start"
                          size="mini"
                          :placeholder="$t('请输入起始邮编')"
                        ></el-input>
                      </el-col>
                      <el-col :span="2">-</el-col>
                      <el-col :span="11">
                        <el-input
                          v-model="item.end"
                          size="mini"
                          :placeholder="$t('请输入截止邮编')"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-card>
                </template>
              </el-table-column>
              <el-table-column width="155" :label="$t('操作')">
                <template slot="header">
                  <el-button
                    v-if="partitionPostData.length === 0"
                    size="mini"
                    @click="choosePostCountryOrArea"
                    >添加国家/地区</el-button
                  >
                </template>
                <template slot-scope="scope">
                  <el-button size="mini" @click="addPost(scope.$index)">添加邮编规则</el-button>
                  <el-button size="mini" @click="batchAddPost(scope.$index)"
                    >批量添加邮编规则</el-button
                  >
                  <!-- 移除 -->
                  <el-button size="mini" class="danger" @click="deletePostcode(scope.$index)">{{
                    $t('移除此项')
                  }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-drawer>
</template>
<script>
import dialog from '@/components/dialog'
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
      partitionAreaData: [],
      partitionPostData: []
    }
  },
  computed: {
    getSumbitData() {
      let resultArr = []
      console.log('getSumbitData')
      if (this.partitionAreaData.length === 0) return []
      for (let index = 0; index < this.partitionAreaData.length; index++) {
        let countryInfo = this.partitionAreaData[index]
        let countryInfoAllProinice = this.partitionAreaData[index].children
        // 如果没有省
        if (countryInfoAllProinice.length === 0) {
          resultArr.push({
            country_id: countryInfo.id,
            area_id: 0,
            sub_area_id: 0
          })
        } else {
          for (let index2 = 0; index2 < countryInfoAllProinice.length; index2++) {
            // 如果没有市
            let theProince = countryInfoAllProinice[index2]

            if (theProince.children.length === 0) {
              resultArr.push({
                country_id: countryInfo.id,
                area_id: theProince.id,
                sub_area_id: 0
              })
            } else {
              //有省有市
              for (let index3 = 0; index3 < theProince.children.length; index3++) {
                let theCity = theProince.children[index3]
                resultArr.push({
                  country_id: countryInfo.id,
                  area_id: theProince.id,
                  sub_area_id: theCity.id
                })
              }
            }
          }
        }
      }
      return resultArr
    }
  },
  methods: {
    //查看国家ID
    getCountryIndex(id) {
      var index = -1
      for (let index2 = 0; index2 < this.partitionAreaData.length; index2++) {
        if (this.partitionAreaData[index2].id === id) {
          index = index2
          break
        }
      }
      return index
    },
    //得到省ID
    getProvinceIndex(cid, pid) {
      var countryIndex = this.getCountryIndex(cid)
      var provinceIndex = -1
      for (
        let index2 = 0;
        index2 < this.partitionAreaData[countryIndex].children.length;
        index2++
      ) {
        if (this.partitionAreaData[countryIndex].children[index2].id === pid) {
          provinceIndex = index2
          break
        }
      }
      return [countryIndex, provinceIndex]
    },
    //得到市ID
    getCityIndex(cid, pid, aid) {
      var countryIndex = this.getCountryIndex(cid)
      var provinceIndex = -1
      var cityIndex = -1
      for (
        let index2 = 0;
        index2 < this.partitionAreaData[countryIndex].children.length;
        index2++
      ) {
        if (this.partitionAreaData[countryIndex].children[index2].id === pid) {
          provinceIndex = index2
          break
        }
      }
      for (
        let index3 = 0;
        index3 < this.partitionAreaData[countryIndex].children[provinceIndex].children.length;
        index3++
      ) {
        if (
          this.partitionAreaData[countryIndex].children[provinceIndex].children[index3].id === aid
        ) {
          cityIndex = index3
          break
        }
      }
      return [countryIndex, provinceIndex, cityIndex]
    },
    removeCountryOrArea(id) {
      this.$confirm(this.$t('确定要移除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.partitionAreaData.splice(this.getCountryIndex(id), 1)
      })
    },
    removePost(countryIndex, postIndex) {
      console.log(countryIndex, postIndex)
      this.$confirm(this.$t('确定要移除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.partitionPostData[countryIndex].children.splice(postIndex, 1)
      })
    },
    // 选择一个国家或地区
    choosePostCountryOrArea() {
      if (this.partitionPostData.length === 0) {
        dialog({ type: 'areaChooseCountry', multiple: false }, res => {
          this.partitionPostData = [
            {
              id: res.id,
              name: res.name,
              children: [[{ rule: '邮编规则', start: '', end: '', type: 1 }]]
            }
          ]
        })
      } else {
        this.$message.error(this.$t('最多只能添加一个国家/地区'))
      }
    },
    // 选择国家或地区
    chooseCountryOrArea() {
      dialog({ type: 'areaSelectCountry', multiple: true }, res => {
        if (res.length > 0) {
          for (let index = 0; index < res.length; index++) {
            const element = res[index]
            const resultIndex = this.getCountryIndex(element.id)
            if (resultIndex === -1) {
              this.partitionAreaData.push({
                id: element.id,
                name: element.name,
                children: []
              })
            }
          }
        }
      })
    },
    // 选择省
    chooseProvince(countryId) {
      const countryIndex = this.getCountryIndex(countryId)
      var caption = this.partitionAreaData[countryIndex].name
      dialog({ type: 'areaSelectProince', pId: countryId, caption: caption }, res => {
        if (res.length > 0) {
          for (let index = 0; index < res.length; index++) {
            const element = res[index]

            const resultIndexArr = this.getProvinceIndex(countryId, element.id)
            console.log('resultIndexArr', resultIndexArr)
            if (resultIndexArr[1] === -1) {
              this.partitionAreaData[resultIndexArr[0]].children.push({
                id: element.id,
                name: element.name,
                children: []
              })
            }
          }
        }
      })
    },
    // 选择市
    chooseCity(countryId, provinceId) {
      const resultIndexArr = this.getProvinceIndex(countryId, provinceId)
      var caption = this.partitionAreaData[resultIndexArr[0]].name
      caption += '>' + this.partitionAreaData[resultIndexArr[0]].children[resultIndexArr[1]].name
      dialog({ type: 'areaSelectCity', caption: caption, pId: provinceId }, res => {
        if (res.length > 0) {
          for (let index = 0; index < res.length; index++) {
            const element = res[index]
            console.log('chooseCity->res[index]', res[index])
            const resultIndexArr = this.getCityIndex(countryId, provinceId, element.id)
            console.log('chooseCity->resultIndexArr', resultIndexArr)
            if (resultIndexArr[2] === -1) {
              this.partitionAreaData[resultIndexArr[0]].children[resultIndexArr[1]].children.push({
                id: element.id,
                name: element.name
              })
            }
          }
        }
      })
    },
    removeCity(countryId, provinceId, cityId) {
      const resultIndexArr = this.getCityIndex(countryId, provinceId, cityId)
      if (resultIndexArr[2] !== -1) {
        this.partitionAreaData[resultIndexArr[0]].children[resultIndexArr[1]].children.splice(
          resultIndexArr[2],
          1
        )
      }
    },
    removeProvince(countryId, provinceId) {
      this.$confirm(this.$t('确定要移除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        const resultIndexArr = this.getProvinceIndex(countryId, provinceId)
        console.log('resultIndexArr', resultIndexArr)
        this.partitionAreaData[resultIndexArr[0]].children.splice(resultIndexArr[1], 1)
      })
    },
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
    // 切换国家
    changeCountry(item) {
      console.log(item, 'item')
    },
    editPartition(id) {
      console.log(id)
    },
    batchAddPost() {
      dialog({ type: 'batchAddPostCode' }, res => {
        if (res.length === 0) return
        this.partitionPostData[0].children = []
        for (let index2 = 0; index2 < res.length; index2++) {
          const element2 = res[index2]
          let exists = false
          for (let index = 0; index < this.partitionPostData[0].children.length; index++) {
            const element = this.partitionPostData[0].children[index]
            if (
              element2.start === element.start ||
              element2.start === element.end ||
              element2.end === element.end ||
              element2.end === element.start
            ) {
              exists = true
              break
            }
          }
          if (!exists) {
            this.partitionPostData[0].children.push(element2)
          }
        }
      })
    },
    addPost(index) {
      this.partitionPostData[index].children.push({
        rule: '邮编规则',
        start: '',
        end: '',
        type: 1
      })
    },
    deletePostcode(index) {
      this.partitionPostData.splice(index, 1)
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
  .pad {
    padding: 20px;
    .xianzhi {
      padding: 5px;
      background-color: red;
      color: white;
      border-radius: 5px;
      display: none;
    }
    .pagination-box {
      margin-top: 10px;
    }
    .post-box {
      width: 50%;
      text-align: center;
      float: left;
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
}
</style>
