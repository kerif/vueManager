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
          <div class="select-box">
          <h4>转账支付</h4>
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
      <el-tab-pane label="服务配置" name="2">
        <div class="logistics-container">
          <div class="form-title">快递100配置</div>
          <el-form :model="logisticsData" :rules="rules" ref="ruleForm" class="demo-ruleForm"
            label-position="left" label-width="150px">
            <el-form-item label="Appkey" prop="app_key">
              <el-input v-model="logisticsData.app_key" placeholder="请输入Appkey"></el-input>
            </el-form-item>
            <el-form-item label="AppSecret" prop="app_secret">
              <el-input v-model="logisticsData.app_secret" placeholder="请输入AppSecret"></el-input>
            </el-form-item>
          </el-form>
          <div class="form-title">Tracking more配置</div>
          <el-form :model="logisticsData" :rules="rules" ref="ruleForm" class="demo-ruleForm"
            label-position="left" label-width="150px">
            <el-form-item label="Appkey" prop="trackingmore_key">
              <el-input v-model="logisticsData.trackingmore_key" placeholder="请输入AppSecret"></el-input>
            </el-form-item>
          </el-form>
          <div class="form-title">邮箱发件信息配置</div>
          <el-form :model="logisticsData" :rules="rules" ref="ruleForm" class="demo-ruleForm"
          label-position="left" label-width="150px">
            <el-form-item label="发件人邮件" prop="trackingmore_key">
              <el-input v-model="logisticsData.trackingmore_key" placeholder="请输入AppSecret"></el-input>
            </el-form-item>
            <el-form-item label="发件人名称" prop="trackingmore_key">
              <el-input v-model="logisticsData.trackingmore_key" placeholder="请输入AppSecret"></el-input>
            </el-form-item>
            <el-form-item label="发件人SMTP" prop="trackingmore_key">
              <el-input v-model="logisticsData.trackingmore_key" placeholder="请输入AppSecret"></el-input>
            </el-form-item>
            <el-form-item label="SMTP端口" prop="trackingmore_key">
              <el-input v-model="logisticsData.trackingmore_key" placeholder="请输入AppSecret"></el-input>
            </el-form-item>
          </el-form>
          <div class="form-title">短信配置——聚合</div>
          <el-form :model="logisticsData" :rules="rules" ref="ruleForm" class="demo-ruleForm"
           label-position="left" label-width="150px">
            <el-form-item label="Appkey" prop="trackingmore_key">
              <el-input v-model="logisticsData.trackingmore_key" placeholder="请输入AppSecret"></el-input>
            </el-form-item>
            <el-form-item label="发送验证码模板ID" prop="trackingmore_key">
              <el-input v-model="logisticsData.trackingmore_key" placeholder="请输入AppSecret"></el-input>
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
        <!-- 订单增值服务 -->
        <el-tab-pane label="订单增值服务" name="4">
          <div class="select-box">
            <add-btn @click.native="addService">添加订单增值服务</add-btn>
          </div>
            <el-table :data="valueData" v-loading="tableLoading" class="data-list"
            border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" label="增值服务名称"></el-table-column>
            <el-table-column prop="price" :label="'价格' + this.localization.currency_unit"></el-table-column>
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
        <!-- 包裹增值服务 -->
        <el-tab-pane label="包裹增值服务" name="5">
          <div class="select-box">
            <add-btn @click.native="addParcel">添加包裹增值服务</add-btn>
          </div>
            <el-table :data="parcelData" v-loading="tableLoading" class="data-list"
            border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" label="增值服务名称"></el-table-column>
            <el-table-column prop="price" :label="'价格' + this.localization.currency_unit"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
              <el-table-column label="是否启用">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.enabled"
                    @change="changeParcel($event, scope.row.id)"
                    active-text="开"
                    inactive-text="关"
                    active-color="#13ce66"
                    inactive-color="gray">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button class="btn-dark-green" @click="editParcel(scope.row.id)">编辑</el-button>
                  <el-button class="btn-light-red" @click="deleteParcel(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
        </el-tab-pane>
        <!-- 其余配置 -->
      <el-tab-pane label="PC端配置" name="6">
        <!-- 其余配置 -->
      <div class="setOthers">
        <el-form :model="setForm" ref="setForm" class="demo-ruleForm"
        label-width="150px" label-position="left">
            <!-- 网站名称 -->
            <el-form-item label="*网站名称">
              <el-input v-model="setForm.website_name">
              </el-input>
            </el-form-item>
            <el-form-item>
              <div slot="label">
                <span>*网站链接</span>
                <el-tooltip effect="dark" content="主要用于集运插件识别（非常重要）" placement="top">
                  <span class="el-icon-question icon-question"></span>
                </el-tooltip>
              </div>
              <el-input v-model="setForm.website_name">
              </el-input>
            </el-form-item>
            <el-form-item label="*小程序码" class="updateChe">
                <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
                <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
                <span class="model-box"></span>
                <span class="operat-box">
                    <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
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
            <!-- pc端客服二维码 -->
            <el-form-item label="*pc端客服二维码" class="updateChe">
                <span class="img-item" v-for="(item, index) in customerList" :key="index">
                <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
                <span class="model-box"></span>
                <span class="operat-box">
                    <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                    <i class="el-icon-delete" @click="onDeleteCus(index)"></i>
                </span>
                </span>
              <el-upload
                v-show="customerList.length < 1"
                class="avatar-uploader"
                action=""
                list-type="picture-card"
                :http-request="customerImg"
                :show-file-list="false">
                <i class="el-icon-plus">
                </i>
            </el-upload>
            </el-form-item>
            </el-form>
          <el-button class="save-btn" @click="editOthers">保存</el-button>
        </div>
        </el-tab-pane>
        <!-- 订单增值服务 -->
        <el-tab-pane label="商品分类管理" name="7">
          <div class="select-box">
            <add-btn @click.native="addClassify">添加商品分类</add-btn>
          </div>
        <el-table :data="CategoriesList" stripe
          border class="data-list"
          @expand-change="onExpand"
          v-loading="tableLoading">
          <!-- 二级分类列表 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.orders">
                <!-- 二级分类名称 -->
                <el-table-column label="二级分类名称" prop="name_cn"></el-table-column>
                <!-- 是否显示 -->
                <el-table-column label="是否显示">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.enabled"
                      @change="changeShow($event, scope.row.id)"
                      active-text="开"
                      inactive-text="关"
                      active-color="#13ce66"
                      inactive-color="gray">
                    </el-switch>
                </template>
                </el-table-column>
                <!-- 是否开启风险提示 -->
                <el-table-column label="是否开启风险提示">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.risk_warning_enabled"
                      @change="changeRisk($event, scope.row.id)"
                      active-text="开"
                      inactive-text="关"
                      active-color="#13ce66"
                      inactive-color="gray">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="300">
                  <template slot-scope="scope">
                    <!-- 编辑 -->
                    <el-button class="btn-dark-green btn-margin" @click="editClassify(scope.row.id)">编辑</el-button>
                    <!-- 风险提示 -->
                    <el-button class="btn-main" @click="goSick(scope.row.id)">风险提示</el-button>
                    <!-- 删除 -->
                    <el-button @click="deleteCategories(scope.row.id)" class="btn-light-red">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
            <!-- 一级分类列表 -->
            <el-table-column type="index" width="50"></el-table-column>
            <!-- 一级分类名称 -->
            <el-table-column label="一级分类名称" prop="name_cn"></el-table-column>
            <!-- 是否显示 -->
            <el-table-column label="是否显示">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.enabled"
                    @change="changeShow($event, scope.row.id)"
                    active-text="开"
                    inactive-text="关"
                    active-color="#13ce66"
                    inactive-color="gray">
                  </el-switch>
                </template>
            </el-table-column>
            <!-- 是否开启风险提示 -->
            <el-table-column label="是否开启风险提示">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.risk_warning_enabled"
                    @change="changeRisk($event, scope.row.id)"
                    active-text="开"
                    inactive-text="关"
                    active-color="#13ce66"
                    inactive-color="gray">
                  </el-switch>
                </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <!-- 编辑 -->
                <el-button class="btn-dark-green btn-margin" @click="editClassify(scope.row.id)">编辑</el-button>
                <!-- 风险提示 -->
                <el-button class="btn-main" @click="goSick(scope.row.id)">风险提示</el-button>
                <!-- 删除 -->
                <el-button class="btn-light-red btn-margin" @click="deleteCategories(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
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
      parcelData: [
        {
          enabled: true
        }
      ],
      tableLoading: false,
      localization: {},
      activeName: '',
      logisticsData: {
        app_key: '',
        app_secret: '',
        trackingmore_key: ''
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
        default_img: [],
        customer_qr_code: []
      },
      tranAmount: '',
      baleImgList: [],
      customerList: [],
      CategoriesList: [
        {
          enabled: true,
          risk_warning_enabled: true
        }
      ],
      orders: {
        enabled: true,
        risk_warning_enabled: true
      },
      id: 0,
      show: false,
      rules: {
        app_key: [
          { required: true, message: '请输入Appkey', trigger: 'change' }
        ],
        app_secret: [
          { required: true, message: '请输入AppSecret', trigger: 'change' }
        ],
        trackingmore_key: [
          { required: true, message: '请输入Tracking more 物流 key', trigger: 'change' }
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
    if (this.$route.query.activeName === '7') {
      this.activeName = '7'
      this.getList()
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
      this.$confirm(`您真的要删除转账支付吗？`, '提示', {
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
    // 订单 增加增值服务
    addService () {
      dialog({ type: 'addService', state: 'add', name: 'addService' }, () => {
        this.getList()
      })
    },
    // 订单 编辑增值服务
    editService (id) {
      dialog({ type: 'addService', state: 'edit', id: id, name: 'editService' }, () => {
        this.getList()
      })
    },
    // 包裹 增加增值服务
    addParcel () {
      dialog({ type: 'addService', state: 'add', name: 'addParcel' }, () => {
        this.getList()
      })
    },
    // 包裹 编辑增值服务
    editParcel (id) {
      dialog({ type: 'addService', state: 'edit', id: id, name: 'editParcel' }, () => {
        this.getList()
      })
    },
    // 订单 删除增值服务
    deleteService (id) {
      this.$confirm(`您真的要删除增值服务吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteValue(id).then(res => {
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
    // 包裹 删除增值服务
    deleteParcel (id) {
      this.$confirm(`您真的要删除增值服务吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteParcel(id).then(res => {
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
    // 订单增值服务 开关启用状态
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
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 包裹增值服务 开关启用状态
    changeParcel (event, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeParcel(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 删除单条商品分类
    deleteCategories (id) {
      this.$confirm(`您真的要删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteCategories(id).then(res => {
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
        res.data.default_img && (this.baleImgList[0] = res.data.default_img)
        res.data.customer_qr_code && (this.customerList[0] = res.data.customer_qr_code)
        // this.baleImgList[0] = { url: res.data.default_img }
        // this.customerList[0] = { url: res.data.customer_qr_code }
      })
    },
    // 修改其余配置
    editOthers () {
      // this.setForm.default_img = this.baleImgList[0].url
      // this.setForm.customer_qr_code = this.customerList[0].url
      if (this.baleImgList[0]) {
        this.setForm.default_img = this.baleImgList[0]
      } else {
        this.setForm.default_img = []
      }
      if (this.customerList[0]) {
        this.setForm.customer_qr_code = this.customerList[0]
      } else {
        this.setForm.customer_qr_code = []
      }
      if (!this.setForm.website_name) {
        return this.$message.error('请输入网站名称')
      } else if (!this.baleImgList[0]) {
        return this.$message.error('请上传小程序码')
      } else if (!this.customerList[0]) {
        return this.$message.error('请上传pc端客户二维码')
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
      this.tableLoading = true
      this.$request.getPaymentOnline().then(res => {
        this.tableLoading = false
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
      this.tableLoading = true
      this.$request.getPayments().then(res => {
        this.tableLoading = false
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
    // 商品分类管理 开启或关闭 是否显示
    changeShow (event, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeCategories(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 商品分类管理 开启或关闭 风险提示
    changeRisk (event, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeRisk(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 修改风险提示
    goSick (id) {
      this.$router.push({ name: 'sickTips',
        params: {
          id: id
        } })
    },
    // 添加商品分类
    addClassify () {
      console.log('进来了')
      dialog({ type: 'classifyGroup', state: 'add', id: '' }, () => {
        this.getList()
      })
    },
    // 编辑商品分类
    editClassify (id) {
      dialog({ type: 'classifyGroup', state: 'edit', id: id }, () => {
        this.getList()
      })
    },
    getList () {
      if (this.activeName === '4') {
        this.getValue()
      } else if (this.activeName === '5') {
        this.getParcel()
      } else if (this.activeName === '7') {
        this.getCategories()
      }
    },
    // 获取订单增值服务
    getValue () {
      this.tableLoading = true
      this.$request.getValue({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.valueData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.localization = res.localization
          console.log(this.valueData, 'valueData')
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取包裹增值服务
    getParcel () {
      this.tableLoading = true
      this.$request.getParcel({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.parcelData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.localization = res.localization
          console.log(this.parcelData, 'parcelData')
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
        this.page_params.page = 1
        this.getList()
      } else if (this.activeName === '6') {
        this.getOthers()
      } else if (this.activeName === '7') {
        this.page_params.page = 1
        this.getList()
      }
    },
    // 上传打包照片
    uploadBaleImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push(item.path)
          })
        }
      })
    },
    // pc端客服二维码
    customerImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.customerList.push(item.path)
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
    // 删除小程序码
    onDeleteImg (index) {
      this.baleImgList.splice(index, 1)
    },
    // 删除pc端二维码
    onDeleteCus (index) {
      this.customerList.splice(index, 1)
    },
    // 上传图片
    onUpload (file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 获取商品分类管理列表
    getCategories () {
      this.tableLoading = true
      this.$request.getCategories({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.CategoriesList = res.data.map(item => {
            return {
              ...item,
              enabled: Boolean(item.enabled),
              risk_warning_enabled: Boolean(item.risk_warning_enabled),
              orders: []
            }
          })
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 点开当前行，获取二级菜单数据
    onExpand (row) {
      // 如果当前货单已经获取了二级菜单数据，就不在获取
      if (row.orders.length) return
      let id = row.id
      this.$request.getSecondCategories(id).then(res => {
        if (res.ret) {
          row.orders = res.data.map(item => {
            return {
              ...item,
              enabled: Boolean(item.enabled),
              risk_warning_enabled: Boolean(item.risk_warning_enabled)
            }
          })
        }
      })
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
    background-color: #fff !important;
    padding: 20px;
    // width: 35%;
    .el-input__inner {
      width: 30%;
    }
  }
  .save-btn {
    color: #fff;
    background-color: #3540A5;
  }
  .settings-container {
     background-color: #fff !important;
     padding: 20px;
    .el-tag {
      margin-right: 8px;
    }
  }
  .select-box {
    overflow: hidden;
    h4 {
      display: inline-block;
    }
  }
  .setOthers {
    background-color: #fff !important;
    padding: 20px;
    .el-input {
      width: 50%;
    }
    .el-textarea__inner {
      width: 30%;
      background-color: #F5F5F5;
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
    // .el-form-item__label {
    //   width: 500px !important;
    // }
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
  .btn-margin {
    margin-bottom: 5px;
  }
  .icon-question {
    margin-left: 5px;
    font-size: 18px;
    color: #67C23A;
    position: relative;
    top: 3px;
  }
  .form-title {
    font-weight: bold;
    margin-bottom: 15px;
  }
}
</style>
