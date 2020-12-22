<template>
  <div class="since-add-container">
    <el-form label-position="top" :model="form" ref="form">
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>{{$t('*自提点名称')}}</div>
            <el-input :placeholder="$t('请输入内容')" v-model="form.name"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <div>{{$t('*所属国家/地区')}}</div>
            <el-select
              v-model="form.country_id"
              @change="changeCountry"
              filterable
              :disabled="!!this.$route.params.id && !hasStore"
              class="country-select"
              :placeholder="$t('请选择')">
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 详细地址 -->
      <el-form-item>
        <div>{{$t('*详细地址')}}</div>
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.address" :placeholder="$t('请输入')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 联系人 -->
      <el-form-item>
        <div>{{$t('*联系人')}}</div>
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.contactor" :placeholder="$t('请输入')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 联系电话 -->
      <el-form-item>
        <div>{{$t('*联系电话')}}</div>
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.contact_info" :placeholder="$t('请输入')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <div>
        <el-form-item>
          <div>{{$t('支持线路')}}</div>
          <el-col :span="16">
          <div class="add-row">
            <el-button @click="addRow" class="btn-deep-purple">{{$t('新增')}}</el-button>
          </div>
            <el-table :data="form.expressLines" style="width: 100%" border>
               <el-table-column :label="$t('线路名称')">
                  <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                  </template>
                  </el-table-column>
                  <el-table-column :label="$t('操作')">
                    <template slot-scope="scope">
                      <el-button @click.native.prevent="deleteRow(scope.$index, form.expressLines)" class="btn-light-red">{{$t('移除')}}</el-button>
                  </template>
                </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" class="sava-btn" :loading="$store.state.btnLoading" @click="saveLine">{{$t('保存')}}</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="lineVisible" size="small" @close="clear">
      <div class="line-sty">{{$t('支持线路')}}</div>
      <el-row>
        <el-col :span="16">
          <el-select
            v-model="lineIds"
            multiple
            filterable
            class="country-select"
            :placeholder="$t('请选择')">
            <el-option
              v-for="item in lineData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <div slot="footer">
      <el-button @click="lineVisible = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirmLines">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        name: '',
        country_id: '',
        address: '',
        contact_info: '',
        contactor: '',
        expressLines: []
      },
      referenceTime: {
        minTime: '',
        maxTime: '',
        symbol: '工作日'
      },
      warehouseList: [], // 获取全部仓库
      typeList: [],
      localization: {},
      warehouseIds: [], // 保存支持仓库的id
      imgVisible: false,
      imgSrc: '',
      icon: {},
      itemArr: {},
      lineVisible: false,
      lineData: [],
      lineIds: [],
      countryId: '',
      hasStore: false
    }
  },
  created () {
    this.getWarehouse()
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    // 编辑时拉取的数据
    getList () {
      this.$request.getOneSelf(this.$route.params.id).then(res => {
        // const warehouses = res.data.warehouses.map(item => item.id)
        this.form = res.data
        this.form.name = res.data.name
        this.form.country_id = res.data.country.id
        this.form.address = res.data.address
        this.form.contact_info = res.data.contactor
        this.form.contactor = res.data.contact_info
        this.form.expressLines = res.data.expressLines.map(item => {
          return {
            name: item.name,
            id: item.id
          }
        })
        console.log(this.form.expressLines, 'this.form.expressLines')
      })
    },
    // 切换国家
    changeCountry () {
      console.log(this.form.country_id, 'this.form.country_id')
      this.form.expressLines = []
    },
    // 获取所属国家地区
    getWarehouse () {
      this.$request.countryLocation().then(res => {
        this.warehouseList = res.data
      })
    },
    // 获取支持线路弹窗数据
    getLines () {
      this.$request.getStations({
        country_id: this.countryId
      }).then(res => {
        this.lineData = res.data
        console.log(this.lineData, 'lineData')
      })
    },
    confirmLines () {
      this.lineVisible = false
      console.log(this.lineIds, 'lineIds')
      this.form.expressLines = this.lineData.filter(item => {
        return this.lineIds.includes(item.id)
      })
    },
    clear () {
      this.lineIds = []
    },
    // 新增行
    addRow () {
      if (this.form.country_id) {
        this.lineVisible = true
        this.countryId = this.form.country_id
        this.getLines()
      } else {
        return this.$message.error(this.$t('请先选择所属国家地区'))
      }
      // console.log(this.form.expressLines, 'this.form.expressLines')
      // this.form.expressLines.push({
      //   id: ''
      // })
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    saveLine () {
      if (!this.form.name) {
        return this.$message.error(this.$t('请输入自提点名称'))
      } else if (!this.form.country_id) {
        return this.$message.error(this.$t('请选择所属国家地区'))
      } else if (!this.form.address) {
        return this.$message.error(this.$t('请输入详细地址'))
      } else if (!this.form.contact_info) {
        return this.$message.error(this.$t('请输入联系人'))
      } else if (!this.form.contactor) {
        return this.$message.error(this.$t('请输入联系电话'))
      }
      console.log(this.form.expressLines, 'form.expressLines')
      if (this.$route.params.id) { // 编辑状态
        this.$request.updateOneSelf(this.$route.params.id, {
          ...this.form
        }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.hasStore = true
            this.$router.go(-1)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else { // 新建状态
        this.$request.addSelf({
          ...this.form
        }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.hasStore = true
            this.$router.go(-1)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scope>
.since-add-container {
  background-color: #fff !important;
  .country-select {
    width: 100%;
  }
  .sava-btn {
    min-width: 100px;
  }
  .icon-info {
    color: #74B34F;
    font-size: 18px;
    margin-left: 5px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
  .max-time {
    position: relative;
    &::before {
      content: '—';
      position: absolute;
      left: -22px;
    }
  }
  .select-box {
    width: 100%;
  }
  .country-btn {
    margin-top: 40px;
    .el-button--primary {
      background-color: #EAECF5;
      border-color: #EAECF5;
      color: #3540A5;
    }
  }
  .el-tag.el-tag--info {
    border-color: #3540A5;
    color: #3540A5;
    background-color: #fff;
  }
  .el-tag.el-tag--info .el-tag__close {
    color: #3540A5;
    background-color: #fff;
  }
  .icon-img {
    width: 100px;
    img {
      width: 100%;
    }
  }
  .img_box{
    text-align: center;
    .imgDialog{
      width: 50%;
    }
  }
  .add-row {
    margin-bottom: 10px;
    text-align: right;
  }
  .line-sty {
    margin-bottom: 15px;
  }
}
</style>
