<template>
  <div class="configuration-container">
    <el-tabs v-model="activeName" class="tabLength" @tab-click="onTabChange">
      <el-tab-pane :label="$t('基础配置')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('系统服务配置')" name="2"></el-tab-pane>
      <el-tab-pane :label="$t('增值服务')" name="3"></el-tab-pane>
      <el-tab-pane :label="$t('自定义配置')" name="4"></el-tab-pane>
    </el-tabs>
    <div class="main-sty">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
         @select="handleSelect">
         <el-menu-item-group>
            <el-menu-item index="1">
              {{$t('单位配置')}}
            </el-menu-item>
            <el-menu-item index="2">
              {{$t('预报与入库')}}
            </el-menu-item>
            <el-menu-item index="3">
              {{$t('支付配置')}}
            </el-menu-item>
            <el-menu-item index="4">
              {{$t('汇率配置')}}
            </el-menu-item>
            <el-menu-item index="5">
              {{$t('国家地区')}}
            </el-menu-item>
            <el-menu-item index="6">
              {{$t('转运规则')}}
            </el-menu-item>
         </el-menu-item-group>
      </el-menu>
      </el-col>
      <el-col :span="13" v-if="secondTab === '1'">
        <div class="settings-container">
          <el-form>
          <!-- 重量单位： -->
          <el-form-item :label="$t('重量单位：')">
              <el-select v-model="weightName" :placeholder="$t('请选择')">
                <el-option
                v-for="item in weightList"
                :key="item.id"
                :value="item.name"
                :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 货币单位： -->
            <el-form-item :label="$t('货币单位：')">
                <el-select v-model="currencyName" :placeholder="$t('请选择')">
                  <el-option
                  v-for="item in currencyList"
                  :key="item.id"
                  :value="item.name"
                  :label="item.name">
                  </el-option>
                </el-select>
            </el-form-item>
            <!-- 长度单位 -->
            <el-form-item :label="$t('长度单位：')">
                <el-select v-model="lengthName" :placeholder="$t('请选择')">
                  <el-option
                  v-for="(item, index) in lengthList"
                  :key="index"
                  :value="item.name"
                  :label="item.name">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('结算货币：')">
              <el-select v-model="currency" :placeholder="$t('请选择')">
                <el-option
                v-for="item in rateList"
                :key="item.id"
                :value="item.code"
                :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 未入库丢包预警 -->
            <el-form-item>
              <span class="no-warehouse">{{$t('未入库丢包预警')}}</span>
              <el-tooltip class="item" effect="dark" :content="$t('开启后，若预报包裹超过设定时间未入库，将会在包裹列表进行提示，表示包裹有丢失风险')" placement="top">
              <span class="el-icon-question icon-question"></span>
              </el-tooltip>
              <el-radio-group v-model="basic.package_warning" @change="changeBasic" class="radio-sty">
                <el-radio :label="5">{{$t('5天')}}</el-radio>
                <el-radio :label="7">{{$t('7天')}}</el-radio>
                <el-radio :label="10">{{$t('10天')}}</el-radio>
                <el-radio :label="0">{{$t('不开启')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('物品属性：')">
              <el-tag
                :key="item.id"
                v-for="item in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(item.id)">
                {{item.cn_name}}
              </el-tag>
            <el-button class="btn-light-red" @click="addProps">{{$t('添加属性')}}</el-button>
            <el-button class="btn-deep-purple others-btn" v-for="item in formatLangData" :key="item.id" @click="onProps(item)">{{item.name}}</el-button>
            </el-form-item>
            <!-- 预报选择线路 -->
          <!-- <el-form-item :label="$t('预报选择线路')">
                <el-switch
                  v-model="package_express_line"
                  :active-text="$t('开')"
                  :active-value="1"
                  :inactive-value="0"
                  :inactive-text="$t('关')"
                  active-color="#13ce66"
                  inactive-color="gray">
                </el-switch>
            </el-form-item> -->
            <el-form-item :label="$t('入库是否必填尺寸')">
              <el-switch
                v-model="basic.size"
                @change="changeBasic($event)"
                :active-text="$t('开')"
                :inactive-text="$t('关')"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="gray">
              </el-switch>
            </el-form-item>
            <el-form-item :label="$t('入库是否必填货位')">
              <el-switch
                v-model="basic.location"
                @change="changeBasic($event)"
                :active-text="$t('开')"
                :inactive-text="$t('关')"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="gray">
              </el-switch>
            </el-form-item>
          <el-button :loading="$store.state.btnLoading" class="save-btn" @click="saveSetting">{{$t('保存')}}</el-button>
          </el-form>
          </div>
      </el-col>
    </el-row>
    </div>
  </div>
</template>
<script>
import Sortable from 'sortablejs'
// import NlePagination from '@/components/pagination'
// import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
// import AddBtn from '@/components/addBtn'
export default {
  components: {
    // AddBtn,
    // NlePagination
  },
  // mixins: [pagination],
  data () {
    return {
      activeIndex: '1',
      secondTab: '1',
      countrySendData: [],
      typeSendData: [],
      paymentData: [
        {
          enabled: true
        }
      ],
      emailData: [
        {
          enabled: true
        }
      ],
      transferData: [
        {
          enabled: true
        }
      ],
      systemData: [],
      logisticsTypeData: [],
      TypeData: [],
      typeForm: {
        context: ''
      },
      rechargeAmount: [],
      amount: '',
      valueData: [
        {
          enabled: true
        }
      ],
      ratesData: [],
      oauthData: {
        google_id: '',
        google_secret: '',
        line_id: '',
        line_secret: '',
        facebook_id: '',
        facebook_secret: ''
      },
      visibleOauth: false,
      configurationData: [], // 拼团配置数据
      rate: '',
      currencyData: {},
      insuranceEnabled: 0, // 保险服务
      tariffEnabled: 0, // 关税服务
      insuranceData: [],
      tariffData: [], // 关税数据
      parcelData: [
        {
          enabled: true
        }
      ],
      expressData: [
        {
          status: true
        }
      ],
      ids: '',
      rulesData: [],
      countryData: [],
      tableLoading: false,
      imgVisible: false,
      imgSrc: '',
      localization: {},
      activeName: '1',
      logisticsData: {
        trackingmore_key: '',
        kd100_app_id: '',
        kd100_app_key: '',
        juhe_key: '',
        juhe_tpl_id: '',
        host: '',
        port: '',
        encryption: '',
        validate_email: '',
        validate_phone: '',
        username: '',
        password: '',
        from_address: '',
        from_name: ''
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      weightName: '',
      package_express_line: '',
      lengthName: '',
      currency: '',
      currencyName: '',
      weightList: [],
      currencyList: [],
      lengthList: [],
      rateList: [],
      noWarehouse: [
        {
          id: 5,
          name: this.$t('5天')
        },
        {
          id: 7,
          name: this.$t('7天')
        },
        {
          id: 10,
          name: this.$t('10天')
        },
        {
          id: 0,
          name: this.$t('不开启')
        }
      ],
      setForm: {
        website_name: '',
        default_img: [],
        customer_qr_code: [],
        pc_website_url: '',
        secret: '',
        app_id: '',
        icp: '',
        token: '',
        aes_key: ''
      },
      tranAmount: '',
      baleImgList: [],
      LogoImgList: [],
      customerList: [],
      bgList: [],
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
      languageData: [],
      emailType: [],
      transCode: '',
      serviceCode: '',
      packageCode: '',
      emailCode: '',
      rechargeDialog: false,
      expressDialog: false,
      typeId: '',
      trackingDialog: false,
      trackingId: '',
      context: '',
      categoriesCode: '',
      page_params: {
        type: ''
      },
      basic: {
        size: '',
        location: '',
        package_warning: 0
      },
      unShow: '', // 保存是否显示拼团配置
      rules: {
        kd100_app_id: [
          { required: true, message: this.$t('请输入Customer ID'), trigger: 'change' }
        ],
        kd100_app_key: [
          { required: true, message: this.$t('请输入授权key ID'), trigger: 'change' }
        ],
        trackingmore_key: [
          { required: true, message: this.$t('请输入Appkey'), trigger: 'change' }
        ],
        juhe_key: [
          { required: true, message: this.$t('请输入Appkey'), trigger: 'change' }
        ],
        juhe_tpl_id: [
          { required: true, message: this.$t('请输入发送验证码模板ID'), trigger: 'change' }
        ],
        host: [
          { required: true, message: this.$t('请输入SMTP域名'), trigger: 'change' }
        ],
        port: [
          { required: true, message: this.$t('请输入SMTP端口'), trigger: 'change' }
        ],
        // encryption: [
        //   { required: true, message: '请选择加密方式', trigger: 'change' }
        // ],
        username: [
          { required: true, message: this.$t('请输入发件人用户名'), trigger: 'change' }
        ],
        password: [
          { required: true, message: this.$t('请输入发件人密码'), trigger: 'change' }
        ],
        from_address: [
          { required: true, message: this.$t('请输入发件人邮件'), trigger: 'change' }
        ],
        from_name: [
          { required: true, message: this.$t('请输入发件人名称'), trigger: 'change' }
        ]
      }
    }
  },
  created () {
    console.log(this.secondTab, 'secondTab')
    this.getLanguageList()
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
    if (this.activeName === '1') {
      this.getWechat()
      this.getPayment()
      this.getRecharge()
      // this.getLanguageList()
    } else if (this.activeName === '2') {
      this.getLogisticsData()
    } else if (this.activeName === '3') {
      this.confirmSetting()
      this.getAllCurrency()
      this.getSetting()
      this.getProps()
      this.getBasic()
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
    } else if (this.activeName === '8') {
      this.getEmail()
      this.getType()
    } else if (this.activeName === '9') {
      this.getExpress()
    } else if (this.activeName === '10') {
      this.getRules()
    } else if (this.activeName === '11') {
      this.getCountryList()
    } else if (this.activeName === '12') {
      this.getSystem()
      this.getTypeData()
    } else if (this.activeName === '13') {
      this.getRate()
      this.getCurrency()
    } else if (this.activeName === '14') {
      this.getConfiguration()
    }
  },
  mounted () {
    this.unShow = localStorage.getItem('me') ? Number(localStorage.getItem('me')) : 0
  },
  computed: {
    formatLangData () {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    handleSelect (key) {
      this.secondTab = key
      console.log(this.secondTab, 'key')
      console.log(typeof (this.secondTab), 'key')
    },
    handleEdit (val) {
      console.log(val)
      this.id = val.id // 这里就是当前拖动行的值，把需要的值赋值给你之前定义好的就可以了
    },
    // 国家地区 行拖拽
    rowDrop () {
      const tbody = document.querySelector('.country tbody')
      console.log(tbody, 'tbody')
      Sortable.create(tbody, {
        onEnd: ({ newIndex, oldIndex }) => {
          if (oldIndex === newIndex) return false
          console.log(oldIndex, newIndex)
          const oldItem = this.countrySendData.splice(oldIndex, 1)[0]
          this.countrySendData.splice(newIndex, 0, oldItem)
        }
      })
    },
    // 确定拖拽 国家地区
    rowUpdate () {
      // eslint-disable-next-line camelcase
      const ids = this.countrySendData.map(({ id, name }, index) => ({ id, index, name }))
      console.log(ids)
      this.countryData = []
      this.$request.countryLocationIndex(ids).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getCountryList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 自定义物流 行拖拽
    typeRowDrop () {
      const tbody = document.querySelector('.logistics-type tbody')
      console.log(tbody, 'tbody')
      Sortable.create(tbody, {
        onEnd: ({ newIndex, oldIndex }) => {
          if (oldIndex === newIndex) return false
          console.log(oldIndex, newIndex)
          const oldItem = this.typeSendData.splice(oldIndex, 1)[0]
          this.typeSendData.splice(newIndex, 0, oldItem)
        }
      })
    },
    // 确定拖拽 自定义物流
    typeRowUpdate () {
      const ids = this.typeSendData.map(({ id, context }, index) => ({ id, index, context }))
      console.log(ids)
      this.TypeData = []
      this.$request.typeLocationIndex(ids).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getTypeData()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 修改在线支付的开关
    changeOnline (event, name) {
      console.log(name, 'name')
      this.$request.changePayment(Number(event), name).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
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
            title: this.$t('操作成功'),
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
    // 系统物流类型 开启或关闭
    changeSystem (event, enabled, id) {
      this.$request.closeSystem(id, event).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getSystem()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 基础配置 修改语言
    onProps (item) {
      console.log(item, 'item')
      dialog({ type: 'propsLang', lang: item, dynamicTags: this.dynamicTags }, () => {
        this.getProps()
      })
    },
    // 保险服务 保险说明
    goInsurance (val) {
      console.log(val, 'val')
      dialog({ type: 'explanationAdd', value: val }, () => {
        if (val === 'insurance') {
          this.getInsurance()
        } else if (val === 'tariff') {
          this.getTariffData()
        }
      })
    },
    // 保险服务 开启线路
    openLines (val) {
      console.log(val, 'val')
      dialog({ type: 'openLine', state: val })
    },
    // pc端配置 修改语言
    onPc (item) {
      // console.log(line, lang)
      // this.transCode = line['trans_' + lang.language_code]
      // line, lang: lang, transCode: this.transCode
      console.log(item, 'item')
      dialog({ type: 'pcLang', lang: item }, () => {
        this.getOthers()
      })
    },
    // 发货快递公司 修改语言
    onExpress (line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'expressLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getExpress()
      })
    },
    // 转账 修改语言
    onLang (line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      dialog({ type: 'payLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getPayment()
      })
    },
    // 订单增值服务 修改语言
    onService (line, lang) {
      console.log(line, lang)
      this.serviceCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'serviceLang', line: line, lang: lang, transCode: this.serviceCode, state: 'service' }, () => {
        this.getValue()
      })
    },
    // 包裹增值服务 修改语言
    onPackage (line, lang) {
      console.log(line, lang)
      this.packageCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'serviceLang', line: line, lang: lang, transCode: this.packageCode, state: 'package' }, () => {
        this.getValue()
      })
    },
    // 邮件模版 修改语言
    onEmail (line, lang) {
      this.emailCode = line['trans_' + lang.language_code]
      this.$router.push({ name: 'emailLangAdd',
        params: {
          line: JSON.stringify(line),
          lang: JSON.stringify(lang),
          transCode: this.emailCode
        } })
    },
    // 商品分类管理 修改语言
    onCategories (line, lang) {
      this.categoriesCode = line['trans_' + lang.language_code]
      this.$router.push({ name: 'categoriesLangAdd',
        params: {
          line: JSON.stringify(line),
          lang: JSON.stringify(lang),
          transCode: this.categoriesCode
        } })
    },
    // 邮件模版 开启或关闭
    changeEmail (event, enabled, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeEmail(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getEmail()
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
      this.$confirm(this.$t('您真的要删除转账支付吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteTransfer(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getPayment()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
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
    clear () {
      this.amount = ''
    },
    clearType () {
      this.typeForm.context = ''
    },
    submitRecharge () {
      if (!this.amount) {
        return this.$message.error(this.$t('请输入预设充值金额'))
      }
      this.$request.updateRechargeAmount(this.amount).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.rechargeDialog = false
          this.getRecharge()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 新增 预设充值金额
    addRecharge () {
      this.rechargeDialog = true
    },
    deleteRecharge (id) {
      this.$request.deleteRechargeAmount(id).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getRecharge()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 编辑邮件模版
    editEmail (id) {
      this.$router.push({
        name: 'emailEdit',
        params: {
          id: id
        }
      })
    },
    // 删除单条邮件模版
    deleteEmail (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteAloneEmail(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getEmail()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 删除国家地区
    deleteCountry (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCountryLocation(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getCountryList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    regenerate () {
      this.$confirm(this.$t('确定要重新生成会员编号吗？原来的编号将会被重置，可能会部分影响到包裹订单出入库'), this.$t('重新生成'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.goResetId().then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getRules()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 编辑转账支付配置
    editTransfer (id) {
      console.log(id, 'id')
      dialog({ type: 'addTransfer', state: 'edit', id: id }, () => {
        this.getPayment()
      })
    },
    // 编辑保险服务
    editInsurance (id, start) {
      dialog({ type: 'insuranceEdit', id: id, start: start }, () => {
        this.getInsurance()
      })
    },
    // 关税服务 新增
    addTariff (id) {
      dialog({ type: 'tariffEditAdd', state: 'add', currencyUnit: this.localization.currency_unit }, () => {
        this.getTariffData()
      })
    },
    // 关税服务 编辑
    editTariff (id) {
      dialog({ type: 'tariffEditAdd', id: id, state: 'edit', currencyUnit: this.localization.currency_unit }, () => {
        this.getTariffData()
      })
    },
    // 关税服务 删除
    deleteTariff (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.tariffDelete(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getTariffData()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 订单 增加增值服务
    addService () {
      dialog({ type: 'addService', state: 'add', name: 'addService' }, () => {
        this.getList()
      })
    },
    // 添加发货快递公司
    addExpress () {
      dialog({ type: 'expressEditAdd', state: 'add' }, () => {
        this.getExpress()
      })
    },
    editExpress (id) {
      dialog({ type: 'expressEditAdd', state: 'edit', id: id }, () => {
        this.getExpress()
      })
    },
    // 订单 编辑增值服务
    editService (id) {
      dialog({ type: 'addService', state: 'edit', id: id, name: 'editService' }, () => {
        this.getList()
      })
    },
    // 订单 删除 增值服务
    deleteService (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteValue(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
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
    // 订单 删除 快递公司
    deleteExpress (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteExpress(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getExpress()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 包裹 删除增值服务
    deleteParcel (id) {
      this.$confirm(this.$t('您真的要删除增值服务吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteParcel(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
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
            title: this.$t('操作成功'),
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
    // 发货快递公司 开关启用状态
    changeExpress (event, id) {
      this.$request.closeExpress(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getExpress()
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
            title: this.$t('操作成功'),
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
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCategories(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作成功'),
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
            title: this.$t('操作成功'),
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
    configuration (type, name) {
      if (type === 1) {
        dialog({ type: 'paypalSet' }, () => {
          this.getWechat()
        })
      } else if (type === 2) {
        dialog({ type: 'configuration' }, () => {
          this.getWechat()
        })
      } else if (type === 4) {
        dialog({ type: 'alipay' }, () => {
          this.getWechat()
        })
      } else if (type === 5) {
        dialog({ type: 'ottPay' }, () => {
          this.getWechat()
        })
      }
    },
    // 获取物流跟踪配置
    getLogisticsData () {
      this.$request.getLogistics().then(res => {
        if (res.ret && res.data) {
          this.logisticsData = res.data
          // this.logisticsData.encryption = Boolean(res.data.encryption)
        } else {
          return false
        }
      })
    },
    // 获取pc端配置
    getOthers () {
      this.$request.getWebsite().then(res => {
        this.setForm = res.data
        this.setForm.pc_website_url = res.data.pc_website_url.map(item => item.url).toString()
        res.data.default_img && (this.baleImgList[0] = res.data.default_img)
        res.data.customer_qr_code && (this.customerList[0] = res.data.customer_qr_code)
        res.data.logo_image && (this.LogoImgList[0] = res.data.logo_image)
        res.data.background_image && (this.bgList[0] = res.data.background_image)
      })
    },
    // 修改pc端配置
    editOthers () {
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
      if (this.LogoImgList[0]) {
        this.setForm.logo_image = this.LogoImgList[0]
      } else {
        this.setForm.logo_image = []
      }
      if (this.bgList[0]) {
        this.setForm.background_image = this.bgList[0]
      } else {
        this.setForm.background_image = []
      }
      if (!this.setForm.website_name) {
        return this.$message.error(this.$t('请输入网站名称'))
      }
      console.log(this.setForm.pc_website_url.split(','))
      this.$request.editWebsite({ ...this.setForm, pc_website_url: this.setForm.pc_website_url.split(',') }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
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
    // pc端配置 第三方登录 获取数据
    goOauth () {
      // this.visibleOauth = true
      this.$request.getOauth().then(res => {
        if (res.ret) {
          this.oauthData = res.data
        }
      })
    },
    // 更新第三方登录配置数据
    saveOauth () {
      this.$request.updateOauth(this.oauthData).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.visibleOauth = false
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
      console.log(this.logisticsData.encryption, 'this.logisticsData.encryption')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.editLogistics({
            ...this.logisticsData
            // encryption: Number(this.logisticsData.encryption)
          }).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
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
    // 获取全部结算货币
    getAllCurrency () {
      this.$request.getAllRate().then(res => {
        if (res.ret) {
          this.rateList = res.data
        }
      })
    },
    // 获取当前选择的重量及货币配置
    getSetting () {
      this.$request.chooseLocalization().then(res => {
        if (res.ret) {
          this.currencyName = res.data.currency_name
          this.weightName = res.data.weight_name
          this.lengthName = res.data.length_name
          this.package_express_line = res.data.package_express_line
          this.currency = res.data.currency
        }
      })
    },
    // 获取入库是否必填
    getBasic () {
      this.$request.getBasic().then(res => {
        if (res.ret) {
          this.basic.size = res.data.size
          this.basic.location = res.data.location
          this.basic.package_warning = res.data.package_warning
        }
      })
    },
    changeBasic (val) {
      this.$request.updateBasic({
        size: this.basic.size,
        location: this.basic.location,
        package_warning: this.basic.package_warning
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getBasic()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
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
        length_symbol: length[0].symbol,
        package_express_line: this.package_express_line,
        currency: this.currency
      }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
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
    //  支付配置 获取在线支付
    getWechat () {
      this.tableLoading = true
      this.$request.getPaymentOnline().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.paymentData = res.data.map(item => ({ ...item,
            enabled: Boolean(item
              .enabled) }))
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
    // 系统物流类型数据
    getSystem () {
      this.$request.getSetSystem().then(res => {
        if (res.ret) {
          this.systemData = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 系统物流类型 修改语言
    trackingLang (line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      dialog({ type: 'trackingLang', line: line, lang: lang, transCode: this.transCode, state: 'tracking' }, () => {
        this.getSystem()
      })
    },
    // 自定义物流类型 修改语言
    TypeLang (line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      dialog({ type: 'trackingLang', line: line, lang: lang, transCode: this.transCode, state: 'type' }, () => {
        this.getTypeData()
      })
    },
    // 获取预设充值金额
    getRecharge () {
      this.tableLoading = true
      this.$request.getRechargeAmount().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.rechargeAmount = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取邮件模版
    getEmail () {
      this.tableLoading = true
      this.$request.getEmail({
        type: this.page_params.type
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.emailData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取模版类型数据
    getType () {
      this.$request.emailType().then(res => {
        if (res.ret) {
          this.emailType = res.data
        }
        // res.data.forEach(item => {
        //   this.emailType.push({
        //     value: item.id,
        //     label: item.name
        //   })
        // })
      })
    },
    onGroupChange () {
      this.page_params.handleQueryChange('type', this.page_params.type)
      this.getEmail()
    },
    // 商品分类管理 开启或关闭 是否显示
    changeShow (event, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeCategories(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
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
            title: this.$t('操作成功'),
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
        this.getInsurance()
        this.getTariffEnabled() // 获取关税服务开关
      } else if (this.activeName === '5') {
        this.getParcel()
      } else if (this.activeName === '7') {
        this.getCategories()
      } else if (this.activeName === '9') {
        this.getExpress()
      } else if (this.activeName === '10') {
        this.getRules()
      } else if (this.activeName === '13') {
        this.getRate()
        this.getCurrency()
      } else if (this.activeName === '14') {
        this.getConfiguration()
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
    // 获取汇率配置
    getRate () {
      this.$request.getRates({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.ratesData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.localization = res.localization
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取拼团配置数据
    getConfiguration () {
      this.$request.getConfiguration({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.configurationData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.localization = res.localization
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    groupAdd () {
      dialog({ type: 'groupAdd' }, () => {
        this.getConfiguration()
      })
    },
    // 拼团配置 删除
    deleteGroup (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteConfiguration(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getConfiguration()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 获取当前结算货币
    getCurrency () {
      this.$request.getCurrency().then(res => {
        if (res.ret) {
          this.currencyData = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 自动获取
    autoGet () {
      this.$request.autoGet().then(res => {
        if (res.ret) {
          this.rate = res.data.rate
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 汇率 删除
    deleteRate (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteRate(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getRate()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 汇率 开启或关闭
    changeRate (id) {
      this.$request.closeRate(id).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getRate()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 新建汇率
    saveRate () {
      if (!this.rate) {
        return this.$message.error(this.$t('请输入汇率'))
      } else {
        this.$request.saveRate({
          rate: this.rate
        }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getRate()
            this.rate = ''
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    // 更改保险服务的开关
    changeInsurance (val) {
      console.log(val, 'val')
      this.$request.changeInsurance(val).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getInsurance()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取保险服务
    getInsurance () {
      this.tableLoading = true
      this.$request.getInsurance().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.insuranceEnabled = res.data.enabled
          this.insuranceData = res.data.data
        }
      })
    },
    // 获取关税服务开关状态
    getTariffEnabled () {
      this.$request.tariffEnabled().then(res => {
        if (res.ret) {
          this.tariffEnabled = res.data.status
          if (this.tariffEnabled === 1) {
            this.getTariffData()
          }
        }
      })
    },
    // 获取关税服务
    getTariffData () {
      this.tableLoading = true
      this.$request.getTariff().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.tariffData = res.data
        }
      })
    },
    // 更改关税服务的开关
    changeTariff (val) {
      console.log(val, 'val')
      this.$request.changeTariff(val).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getTariffData()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取发货快递公司
    getExpress () {
      this.tableLoading = true
      this.$request.getExpressValue({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.expressData = res.data.map(item => ({ ...item, status: Boolean(item.status) }))
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
    // 获取单号规则数据
    getRules () {
      this.tableLoading = true
      this.$request.getRules({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.rulesData = res.data
        }
      })
    },
    // 单号规则 开启或关闭
    changeRules (event, enabled, id) {
      this.$request.changeRules(id, event).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getRules()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 添加国家/地区
    addCountry () {
      dialog({ type: 'setCountry' }, () => {
        this.getCountryList()
      })
    },
    // 国家地区 开启或关闭
    changeCountry (event, enabled, id) {
      console.log(event, 'event')
      if (event === 0) {
        this.$confirm(this.$t('停止支持该国家后，再次开启时需重新添加支持仓库与路线'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.$request.closeCountryLocation(id, event).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.getCountryList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        })
      } else {
        this.$request.closeCountryLocation(id, event).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getCountryList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    // 系统物流类型 开启或关闭
    changeType (event, enabled, id) {
      this.$request.closeType(id, event).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getTypeData()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 自定义物流系统列表
    getTypeData () {
      this.$request.TypeData().then(res => {
        if (res.ret) {
          this.TypeData = res.data
          this.typeSendData = [...res.data]
          console.log('typeSendData')
          this.$nextTick(() => {
            this.typeRowDrop()
          })
        }
      })
    },
    // 删除 自定义物流
    deleteLogisticsType (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteTypeData(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getTypeData()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 新增 自定义物流类型
    addLogisticsType () {
      this.expressDialog = true
    },
    // 编辑 自定义物流类型
    editLogisticsType (id) {
      this.typeId = id
      this.expressDialog = true
      this.getTypeDialog()
    },
    // 获取 单条自定义物流信息
    getTypeDialog () {
      this.$request.getAloneType(this.typeId).then(res => {
        if (res.ret) {
          this.typeForm.context = res.data.context
        }
      })
    },
    // 确定提交 自定义物流类型
    submitExpress () {
      if (this.typeId) {
        this.$request.updateTypeData(this.typeId, this.typeForm).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.expressDialog = false
            this.getTypeData()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      } else {
        this.$request.addTypeData(this.typeForm).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.expressDialog = false
            this.getTypeData()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      }
    },
    // 编辑系统物流系统
    editTracking (id) {
      this.trackingId = id
      this.trackingDialog = true
      this.getTackingType()
    },
    clearTracking () {
      this.trackingId = ''
      this.context = ''
    },
    // 获取单条物流类型
    getTackingType () {
      this.$request.getAloneTracking(this.trackingId).then(res => {
        if (res.ret) {
          this.context = res.data.context
        }
      })
    },
    // 更新 单条物流系统
    saveTackingType () {
      this.$request.updateAloneTracking(this.trackingId, {
        context: this.context
      }).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.trackingDialog = false
          this.getSystem()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 获取国家/地区数据
    getCountryList () {
      this.tableLoading = true
      this.$request.countryLocation().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.countryData = res.data
          this.countrySendData = [...res.data]
          console.log('countryData')
          this.$nextTick(() => {
            this.rowDrop()
          })
        }
      })
    },
    editRules (id, name) {
      dialog({ type: 'rulesEdit', id: id, name: name }, () => {
        this.getRules()
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
    onTabChange () {
      if (this.activeName === '1') {
        this.getWechat()
        this.getPayment()
        this.getRecharge()
        this.getLanguageList()
      } else if (this.activeName === '2') {
        this.getLogisticsData()
      } else if (this.activeName === '3') {
        this.confirmSetting()
        this.getAllCurrency()
        this.getSetting()
        this.getProps()
        this.getBasic()
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
      } else if (this.activeName === '8') {
        this.getEmail()
        this.getType()
      } else if (this.activeName === '9') {
        this.page_params.page = 1
        this.getExpress()
      } else if (this.activeName === '10') {
        this.page_params.page = 1
        this.getRules()
      } else if (this.activeName === '11') {
        this.getCountryList()
      } else if (this.activeName === '12') {
        this.getSystem()
        this.getTypeData()
      } else if (this.activeName === '13') {
        this.getRate()
        this.getCurrency() // 获取当前结算货币
      } else if (this.activeName === '14') {
        this.getConfiguration()
      }
      this.page_params.handleQueryChange('activeName', this.activeName)
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
    uploadLogo (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.LogoImgList.push(item.path)
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
    // 登录页背景图
    bgImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.bgList.push(item.path)
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
    // 删除logo
    onDeleteLogo (index) {
      this.LogoImgList.splice(index, 1)
    },
    // 删除pc端二维码
    onDeleteCus (index) {
      this.customerList.splice(index, 1)
    },
    // 删除登录页背景图
    onDeleteBg (index) {
      this.bgList.splice(index, 1)
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
            title: this.$t('操作失败'),
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
    },
    // 检测快递100
    testExpress () {
      if (this.logisticsData.kd100_app_id === '') {
        return this.$message.error('请输入Customer ID')
      } else if (this.logisticsData.kd100_app_key === '') {
        return this.$message.error(this.$t('请输入授权KEY'))
      }
      this.$request.verifyKd100({
        kd100_app_id: this.logisticsData.kd100_app_id,
        kd100_app_key: this.logisticsData.kd100_app_key
      }).then(res => {
        if (res.ret) {
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
    },
    // 检测Tracking more
    testTracking () {
      if (this.logisticsData.trackingmore_key === '') {
        return this.$message.error('请输入Customer ID')
      }
      this.$request.verifyTrackingMore({
        trackingmore_key: this.logisticsData.trackingmore_key
      }).then(res => {
        if (res.ret) {
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
    },
    // 检测邮件配置
    testSmtp () {
      if (this.logisticsData.from_address === '') {
        return this.$message.error(this.$t('请输入发件人邮件'))
      } else if (this.logisticsData.from_name === '') {
        return this.$message.error(this.$t('请输入发件人名称'))
      } else if (this.logisticsData.host === '') {
        return this.$message.error(this.$t('请输入SMTP域名'))
      } else if (this.logisticsData.port === '') {
        return this.$message.error(this.$t('请输入SMTP端口'))
      } else if (this.logisticsData.username === '') {
        return this.$message.error(this.$t('请输入发件人用户名'))
      } else if (this.logisticsData.password === '') {
        return this.$message.error(this.$t('请输入发件人密码'))
      }
      this.$request.verifySmtp({
        host: this.logisticsData.host,
        port: this.logisticsData.port,
        encryption: this.logisticsData.encryption,
        username: this.logisticsData.username,
        validate_phone: this.logisticsData.validate_phone,
        validate_email: this.logisticsData.validate_email,
        password: this.logisticsData.password,
        from_address: this.logisticsData.from_address,
        from_name: this.logisticsData.from_name
      }).then(res => {
        if (res.ret) {
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
    },
    // 检测Juhe
    testJuhe () {
      if (this.logisticsData.juhe_key === '') {
        return this.$message.error('请输入Appkey')
      } else if (this.logisticsData.juhe_tpl_id === '') {
        return this.$message.error('请输入发送验证码模板ID')
      }
      this.$request.verifyJuhe({
        juhe_key: this.logisticsData.juhe_key,
        juhe_tpl_id: this.logisticsData.juhe_tpl_id
      }).then(res => {
        if (res.ret) {
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
    },
    // 获取全部语言
    getLanguageList () {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss">
.configuration-container {
  .tabLength {
    width: 500px;
  }
  .main-sty {
    background-color: #fff;
  }
  .settings-container {
     padding: 20px;
    .el-tag {
      margin-right: 8px;
    }
  .no-warehouse {
    color: #606266;
   }
  }
}
</style>
