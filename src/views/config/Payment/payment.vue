<template>
    <div class="payment-container">
      <el-tabs v-model="activeName" class="tabLength" @tab-click="handleClick">
        <!-- 支付配置 -->
        <el-tab-pane label="支付配置" name="1"></el-tab-pane>
        <!-- 物流跟踪配置 -->
        <el-tab-pane label="物流跟踪配置" name="2"></el-tab-pane>
        <!-- 重量及货币配置 -->
        <el-tab-pane label="基础配置" name="3"></el-tab-pane>
      </el-tabs>
      <!-- 支付配置 -->
      <div v-if="activeName === '1'">
        <el-table  :data="paymentData" v-loading="tableLoading" class="data-list"
        border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="类型" prop="type"></el-table-column>
          <el-table-column label="配置">
            <template slot-scope="scope">
              <el-button class="btn-green" @click="configuration(scope.row.id)">配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 物流跟踪配置 -->
      <div v-if="activeName === '2'" class="logistics-container">
        <el-form :model="logisticsData" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-position="top">
          <el-form-item label="Appkey" prop="app_key">
            <el-input v-model="logisticsData.app_key" placeholder="请输入Appkey"></el-input>
          </el-form-item>
          <el-form-item label="AppSecret" prop="app_secret">
            <el-input v-model="logisticsData.app_secret" placeholder="请输入AppSecret"></el-input>
          </el-form-item>
        </el-form>
         <div>
          <el-button class="save-btn" @click="confirmLogistic('ruleForm')">保存</el-button>
         </div>
      </div>
      <!-- 重量及货币配置 -->
      <div v-if="activeName === '3'" class="settings-container">
        <el-form>
          <!-- 重量单位： -->
          <el-form-item label="重量单位：">
              <el-select v-model="weightName">
                <el-option
                v-for="item in weightList"
                :key="item.id"
                :value="item.name"
                :label="item.name">
                </el-option>
              </el-select>
          </el-form-item>
          <!-- 货币单位： -->
          <el-form-item label="货币单位：">
              <el-select v-model="currencyName">
                <el-option
                v-for="item in currencyList"
                :key="item.id"
                :value="item.name"
                :label="item.name">
                </el-option>
              </el-select>
          </el-form-item>
          <!-- 长度单位 -->
          <el-form-item label="长度单位：">
              <el-select v-model="lengthName">
                <el-option
                v-for="(item, index) in lengthList"
                :key="index"
                :value="item.name"
                :label="item.name">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="物品属性：">
            <el-tag
              :key="item.id"
              v-for="item in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(item.id)">
              {{item.cn_name}}
            </el-tag>
        <el-button class="btn-light-red" @click="addProps">添加属性</el-button>
        </el-form-item>
        </el-form>
          <el-button class="save-btn" @click="saveSetting">保存</el-button>
        </div>
      </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      paymentData: [
        {
          type: '微信支付'
        }
      ],
      tableLoading: false,
      activeName: '',
      logisticsData: {
        app_key: '',
        app_secret: ''
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      weightName: '',
      lengthName: '',
      currencyName: '',
      weightList: [],
      currencyList: [],
      lengthList: [],
      rules: {
        app_key: [
          { required: true, message: '请输入Appkey', trigger: 'change' }
        ],
        app_secret: [
          { required: true, message: '请输入AppSecret', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.activeName = '1'
  },
  methods: {
    handleClose (id) {
      console.log(id, 'id')
      this.dynamicTags.splice(this.dynamicTags.indexOf(id), 1)
      this.$request.deleteProps({
        DELETE: [id]
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '成功',
            message: res.msg
          })
          this.getProps()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 支付配置
    configuration (id) {
      dialog({ type: 'configuration', id: id
      }, () => {
        this.getList()
      })
    },
    // 获取物流跟踪配置
    getLogisticsData () {
      this.$request.getLogistics().then(res => {
        if (res.ret && res.data) {
          this.logisticsData = res.data
        } else {
          return false
        }
      })
    },
    // 物流跟踪配置确认
    confirmLogistic (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.editLogistics(this.logisticsData).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '成功',
                message: res.msg
              })
              this.activeName = '1'
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 获取全部重量及货币配置
    confirmSetting () {
      this.$request.getLocalization().then(res => {
        this.weightList = res.data.weight
        this.currencyList = res.data.currency
        this.lengthList = res.data.length
      })
    },
    // 获取当前选择的重量及货币配置
    getSetting () {
      this.$request.chooseLocalization().then(res => {
        if (res.ret) {
          this.currencyName = res.data.currency_name
          this.weightName = res.data.weight_name
          this.lengthName = res.data.length_name
        }
      })
    },
    // 保存当前选择的重量及货币配置
    saveSetting () {
      let weight = this.weightList.filter(item => item.name === this.weightName)
      let currency = this.currencyList.filter(item => item.name === this.currencyName)
      let length = this.lengthList.filter(item => item.name === this.lengthName)
      this.$request.confirmLocalization({
        weight_name: weight[0].name,
        weight_symbol: weight[0].symbol,
        currency_name: currency[0].name,
        currency_symbol: currency[0].symbol,
        length_name: length[0].name,
        length_symbol: length[0].symbol
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '成功',
            message: res.msg
          })
          this.activeName = '1'
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取物品属性
    getProps () {
      this.$request.getPackage().then(res => {
        if (res.ret) {
          this.dynamicTags = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 添加属性
    addProps () {
      dialog({ type: 'addPackage' }, () => {
        this.getProps()
      })
    },
    handleClick () {
      if (this.activeName === '2') {
        this.getLogisticsData()
      } else if (this.activeName === '3') {
        this.confirmSetting()
        this.getSetting()
        this.getProps()
      }
    }
  }
}
</script>

<style lang="scss">
.tabLength {
  width: 350px !important;
}
.logistics-container {
  width: 30%;
}
.save-btn {
  color: #fff;
  background-color: #3540A5;
}
.settings-container {
  // width: 60%;
.el-tag {
  margin-right: 8px;
}
}
</style>
