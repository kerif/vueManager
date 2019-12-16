<template>
    <div class="payment-container">
      <el-tabs v-model="activeName" class="tabLength" @tab-click="handleClick">
        <!-- 支付配置 -->
        <el-tab-pane label="支付配置" name="1">
          <!-- 微信支付 -->
          <h4>在线支付</h4>
          <el-table v-if="paymentData.length" :data="paymentData" v-loading="tableLoading" class="data-list"
          border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="类型" prop="type"></el-table-column>
            <el-table-column label="是否启用">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  @change="changeOnline($event)"
                  active-text="开"
                  inactive-text="关"
                  active-color="#13ce66"
                  inactive-color="gray">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="配置">
              <template slot-scope="scope">
                <el-button class="btn-main" @click="configuration(scope.row.id)">配置</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 其余支付 -->
          <h4>转账支付</h4>
          <div class="select-box">
          <add-btn @click.native="addTransfer">添加支付类型</add-btn>
        </div>
          <el-table :data="transferData" v-loading="tableLoading" class="data-list"
          border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="类型" prop="name"></el-table-column>
            <el-table-column label="是否启用">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  @change="changeTransfer($event, scope.row.enabled, scope.row.id)"
                  active-text="开"
                  inactive-text="关"
                  active-color="#13ce66"
                  inactive-color="gray">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button class="btn-dark-green" @click="editTransfer(scope.row.id)">编辑</el-button>
                <el-button class="btn-light-red" @click="deleteTransfer(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 物流跟踪配置 -->
      <el-tab-pane label="物流跟踪配置" name="2">
        <div class="logistics-container">
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
        </el-tab-pane>
        <!-- 基础配置 -->
        <el-tab-pane label="基础配置" name="3">
          <!-- 重量及货币配置 -->
          <div class="settings-container">
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
        </el-tab-pane>
        <!-- 增值服务 -->
        <el-tab-pane label="增值服务" name="4">
          <div class="select-box">
            <add-btn @click.native="addService">添加增值服务</add-btn>
          </div>
            <el-table :data="valueData" v-loading="tableLoading" class="data-list"
            border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" label="增值服务名称"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
              <el-table-column label="是否启用">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.enabled"
                    @change="changeService($event, scope.row.id)"
                    active-text="开"
                    inactive-text="关"
                    active-color="#13ce66"
                    inactive-color="gray">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button class="btn-dark-green" @click="editService(scope.row.id)">编辑</el-button>
                  <el-button class="btn-light-red" @click="deleteService(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
        </el-tab-pane>
        <!-- 其余配置 -->
      <el-tab-pane label="其余配置" name="5">
        <!-- 其余配置 -->
      <div class="setOthers">
      <el-form :model="setForm" ref="setForm" class="demo-ruleForm"
      label-position="top">
          <!-- 网站名称 -->
          <el-form-item label="*网站名称">
            <el-input v-model="setForm.website_name">
            </el-input>
          </el-form-item>
          <el-form-item label="小程序码" class="updateChe">
              <span class="img-item" v-for="(item, index) in baleImgList" :key="item.name">
              <img :src="$baseUrl.IMAGE_URL + item.url" alt="" class="goods-img">
              <span class="model-box"></span>
              <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item.url)"></i>
                  <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
              </span>
              </span>
            <el-upload
              v-show="baleImgList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadBaleImg"
              :show-file-list="false">
              <i class="el-icon-plus">
              </i>
          </el-upload>
          </el-form-item>
          </el-form>
          <el-button class="save-btn" @click="editOthers">保存</el-button>
        </div>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
export default {
  components: {
    AddBtn,
    NlePagination
  },
  mixins: [pagination],
  data () {
    return {
      paymentData: [
        {
          type: '微信支付',
          enabled: ''
        }
      ],
      transferData: [
        {
          enabled: true
        }
      ],
      valueData: [
        {
          enabled: true
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
      setForm: {
        website_name: '',
        default_img: []
      },
      tranAmount: '',
      baleImgList: [],
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
    if (this.activeName === '1') {
      this.getWechat()
      this.getPayment()
    }
  },
  methods: {
    // 修改在线支付的开关
    changeOnline (event) {
      console.log(event, 'event')
      console.log(typeof event, 'event')
      this.$request.changePayment(Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.getWechat()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 修改转账支付的开关
    changeTransfer (event, enabled, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closePayments(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.getPayment()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 删除单条转账支付
    deleteTransfer (id) {
      this.$confirm(`您真的要删除发货单吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteTransfer(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getPayment()
          } else {
            this.$notify({
              title: '操作失败',
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 增加转账支付配置
    addTransfer () {
      dialog({ type: 'addTransfer', state: 'add' }, () => {
        this.getPayment()
      })
    },
    // 编辑转账支付配置
    editTransfer (id) {
      console.log(id, 'id')
      dialog({ type: 'addTransfer', state: 'edit', id: id }, () => {
        this.getPayment()
      })
    },
    // 增加增值服务
    addService () {
      console.log('我是传过去的增加')
      dialog({ type: 'addService', state: 'add' }, () => {
        this.getList()
      })
    },
    // 编辑增值服务
    editService (id) {
      console.log('我是编辑传ID', id)
      dialog({ type: 'addService', state: 'edit', id: id }, () => {
        this.getList()
      })
    },
    // 删除增值服务
    deleteService (id) {
      this.$confirm(`您真的要删除转账支付吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteVaule(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: '操作失败',
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 增值服务 开关启用状态
    changeService (event, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeValue(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.getPayment()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
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
        this.getWechat()
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
    // 获取其余配置
    getOthers () {
      this.$request.getWebsite().then(res => {
        this.setForm = res.data
        this.baleImgList[0] = { url: res.data.default_img }
      })
    },
    // 修改其余配置
    editOthers () {
      this.setForm.default_img = this.baleImgList[0].url
      if (!this.setForm.website_name) {
        return this.$message.error('请输入支付类型名称')
      }
      this.$request.editWebsite(this.setForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '成功',
            message: res.msg
          })
          this.getOthers()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
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
    // 获取在线支付
    getWechat () {
      this.$request.getPaymentOnline().then(res => {
        if (res.ret) {
          this.paymentData[0].enabled = Boolean(res.data.enabled)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取转账支付
    getPayment () {
      this.$request.getPayments().then(res => {
        if (res.ret) {
          this.transferData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取增值服务
    getList () {
      this.$request.getValue({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.valueData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          console.log(this.valueData, 'valueData')
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    handleClick () {
      if (this.activeName === '1') {
        this.getWechat()
        this.getPayment()
      } else if (this.activeName === '2') {
        this.getLogisticsData()
      } else if (this.activeName === '3') {
        this.confirmSetting()
        this.getSetting()
        this.getProps()
      } else if (this.activeName === '4') {
        this.page_params.page = 1
        this.getList()
      } else if (this.activeName === '5') {
        this.getOthers()
      }
    },
    // 上传打包照片
    uploadBaleImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push({
              name: item.name,
              url: item.path
            })
          })
        }
      })
    },
    // 预览图片
    onPreview (image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg (index) {
      this.baleImgList.splice(index, 1)
    },
    // 上传图片
    onUpload (file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    }
  }
}
</script>

<style lang="scss">
.payment-container {
  .tabLength {
    //  width: 520px !important;
  }
  .logistics-container {
     width: 30%;
  }
  .save-btn {
    color: #fff;
    background-color: #3540A5;
  }
  .settings-container {
    .el-tag {
      margin-right: 8px;
    }
  }
  .select-box {
    overflow: hidden;
  }
  .setOthers {
    .el-input {
      width: 30%;
    }
    .el-textarea__inner {
    width: 30%;
    }
    .goods-img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
    .updateChe {
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-form-item__label {
      width: 500px !important;
    }
  }
    .avatar-uploader {
      display: inline-block;
      vertical-align: top;
      // margin-left: 50px;
    }
    .img-item {
      display: inline-block;
      border: 1px dashed #d9d9d9;
      width: 148px;
      height: 148px;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 6px;
      text-align: center;
      position: relative;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        .model-box, .operat-box {
          opacity: 1;
          transition: all .5s ease-in;
        }
      }
    }
    .model-box {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      opacity: 0;
      background-color: rgba(0, 0, 0, .3);
    }
    .operat-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
      i {
        font-size: 20px;
        color: #fff;
        margin-right: 10px;
      }
    }
  }
}
</style>
