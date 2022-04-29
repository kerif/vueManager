<template>
  <div class="goods-container">
    <h3>{{ $t('采购单详细') }}</h3>
    <purchase-info :form="form"></purchase-info>
    <h3>{{ $t('采购清单') }}</h3>
    <el-table :data="form.goods" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column :label="$t('操作')">
        <template>
          <el-button class="btn-main">{{ $t('详情') }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="cn_name" :label="$t('物品中文名称')"> </el-table-column>
      <el-table-column prop="en_name" :label="$t('物品英文名称')"> </el-table-column>
      <el-table-column prop="brand" :label="$t('品牌')"></el-table-column>
      <el-table-column prop="category_id" :label="$t('商品分类')"></el-table-column>
      <el-table-column prop="purchase_price" :label="$t('物品单价')"></el-table-column>
      <el-table-column prop="quantity" :label="$t('物品明细数量')"></el-table-column>
      <el-table-column prop="quantity" :label="$t('剩余可拆数量')"></el-table-column>
      <el-table-column prop="box_count" :label="$t('物品总箱数')"></el-table-column>
      <el-table-column prop="box_spec" :label="$t('物品箱规')"></el-table-column>
      <el-table-column prop="barcode" :label="$t('条码')"></el-table-column>
      <el-table-column prop="image" :label="$t('物品照片')"></el-table-column>
    </el-table>
    <div style="width: 70%; margin: 20px auto">
      <el-steps :active="1" finish-status="success">
        <el-step
          :title="$t('分拆订单')"
          :description="$t('根据要拆分的生成的订单选择商品')"
        ></el-step>
        <el-step
          :title="$t('填写收件及渠道信息')"
          :description="$t('根据分拆订单选择收件地址和下单渠道')"
        >
        </el-step>
        <el-step :title="$t('仓库打包操作')" :description="$t('等待仓库打包操作')"></el-step>
      </el-steps>
    </div>
    <h3>{{ $t('分货') }}</h3>
    <div class="distribution">
      <el-row :gutter="20">
        <el-col :span="9" :offset="3">
          <el-form :inline="true" size="small">
            <el-form-item :label="$t('拆单数量')">
              <el-input v-model="number" type="number" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="onConfirm" type="primary">{{ $t('确定') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <div class="flex">
            <div class="circle"></div>
            <div>{{ $t('商品总数量') }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="flex">
            <div class="circle"></div>
            <div>{{ $t('未分货数量') }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-if="nextStep">
      <div class="goods" v-for="(item, index) in goodData" :key="index">
        <div class="left-box">
          <div class="key"># {{ index + 1 }}</div>
          <div style="margin-top: 80px">
            <el-button type="text" @click="delbox(index)">{{ $t('删除') }}</el-button>
          </div>
        </div>
        <div class="right-box">
          <div class="right-select">
            <div>{{ $t('选择商品') }}</div>
            <div>
              <el-button size="small" @click="onSelect(index)">{{ $t('选择...') }}</el-button>
            </div>
          </div>
          <div v-if="!item.tableData.length">
            <div style="margin-top: 10px">
              <el-input v-model="item.code" size="small" style="width: 45%"></el-input>
              <el-button type="primary" size="small" style="margin-left: 5px">{{
                $t('确定')
              }}</el-button>
            </div>
          </div>
          <div v-else style="margin-top: 10px">
            <el-table :data="item.tableData" border style="width: 100%">
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column prop="date" :label="$t('操作')">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleterow(scope.$index, item.tableData)">{{
                    $t('移除')
                  }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="cn_name" :label="$t('物品中文名称')"> </el-table-column>
              <el-table-column prop="brand" :label="$t('品牌')"> </el-table-column>
              <el-table-column prop="quantity" :label="$t('装箱数量')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.quantity"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align: center; margin-top: 10px">
      <el-button v-if="nextStep" type="primary" size="small" @click="goNext">{{
        $t('下一步')
      }}</el-button>
    </div>
    <div v-if="prevStep">
      <div style="width: 80%; margin: 0 auto">
        <div class="express-left">
          <p>{{ $t('收货形式') }}</p>
        </div>
        <div class="express-left right-margin">
          <el-radio-group v-model="radio" @change="changeRadio">
            <el-radio :label="1">{{ $t('送货上门') }}</el-radio>
            <el-radio :label="2" :disabled="address_type === 2">{{ $t('自提点提货') }}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="boxing-container" v-for="(item, index) in divides" :key="index">
        <div class="apply-main">
          <div class="poster-left">
            <div class="choose-sty key"># {{ index + 1 }}</div>
            <div class="left-top">
              <ul>
                <li class="main-sty" v-for="ele in item.packageData" :key="ele.id">
                  <div class="apply-express">
                    <div class="express-left">
                      <p>
                        <strong>{{ ele.express_num }}</strong>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="poster-right">
            <div class="recipient-address apply-express">
              <div class="address-main">
                <div class="express-left">
                  <p>{{ $t('收件地址') }}</p>
                </div>
                <div class="express-left right-margin">
                  <el-radio-group v-model="item.address_type" @change="changeAdd">
                    <el-radio :label="1">{{ $t('使用客户地址') }}</el-radio>
                    <el-radio :label="2" :disabled="radio === 1">{{
                      $t('使用自提点地址')
                    }}</el-radio>
                  </el-radio-group>
                </div>
                <div class="line-sty"></div>
                <el-table
                  :data="item.addressList"
                  stripe
                  border
                  class="data-list"
                  v-loading="tableLoading"
                  v-if="item.address_type === 1"
                >
                  <el-table-column :label="$t('客户ID')" prop="user_id"></el-table-column>
                  <el-table-column :label="$t('选择包裹数与件数')">
                    <template slot-scope="scope">
                      <span>{{ scope.row.package_count }}（{{ scope.row.number }}）</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('默认收货信息')">
                    <template slot-scope="scope">
                      <span>{{ scope.row.address && scope.row.address.receiver_name }}</span
                      >&nbsp;
                      <span>{{ scope.row.address && scope.row.address.timezone }}</span>
                      <span v-if="scope.row.address && scope.row.address.timezone">-</span>
                      <span>{{ scope.row.address && scope.row.address.phone }}</span
                      >&nbsp; <span>{{ scope.row.address && scope.row.address.country_name }}</span
                      >&nbsp; <span>{{ scope.row.address && scope.row.address.postcode }}</span
                      >&nbsp; <span>{{ scope.row.address && scope.row.address.city }}</span
                      >&nbsp; <span>{{ scope.row.address && scope.row.address.street }}</span
                      >&nbsp;
                      <span>{{ scope.row.address && scope.row.address.door_no }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('清关编码')" prop="clearance_code">
                    <template slot-scope="scope">
                      <span>{{ scope.row.address && scope.row.address.clearance_code }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('操作')">
                    <template slot-scope="scope">
                      <el-button
                        class="btn-green"
                        @click="changeAddress(scope.row.user_id, scope.row, item.addressList)"
                        >{{ $t('更改地址') }}</el-button
                      >
                      <el-button
                        class="btn-light-red"
                        @click="deleteAddress(scope.$index, item.addressList, scope.row.user_id)"
                        >{{ $t('删除') }}</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <div class="line-sty"></div>
                <div class="express-left">
                  <p>{{ $t('快递方式') }}</p>
                </div>
                <div class="express-left right-margin">
                  <el-select
                    v-model="item.express_line_id"
                    :placeholder="$t('请选择')"
                    @change="changeExpress"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="line-sty"></div>
                <div v-if="radio === 2">
                  <div class="express-left">
                    <p>{{ $t('自提点地址') }}</p>
                    <div class="choose-sty" v-if="item.selfData && item.selfData.id">
                      <p>{{ item.selfData.address }}</p>
                    </div>
                  </div>
                  <div class="express-left express-right">
                    <p class="express-sty" @click="selectStation">{{ $t('请选择') }} ></p>
                  </div>
                </div>
                <div class="express-left" v-if="needCode">
                  <p>{{ $t('清关编码') }}&nbsp;&nbsp;&nbsp;</p>
                </div>
                <div class="express-left right-margin" v-if="needCode">
                  <el-input v-model="item.clearance_code" :placeholder="$t('请输入')"></el-input>
                </div>
                <div class="line-sty" v-if="needCode"></div>
                <div class="express-left" v-if="idCode">
                  <p>{{ $t('身份证号码') }}</p>
                </div>
                <div class="express-left right-margin" v-if="idCode">
                  <el-input v-model="item.id_card" :placeholder="$t('请输入')"></el-input>
                </div>
                <div class="line-sty" v-if="idCode"></div>
                <div class="express-left" v-if="personalCode">
                  <p>{{ $t('个人通关码') }}</p>
                </div>
                <div class="express-left right-margin" v-if="personalCode">
                  <el-input v-model="item.personal_code" :placeholder="$t('请输入')"></el-input>
                </div>
                <div class="line-sty" v-if="personalCode"></div>
              </div>
            </div>
            <div class="recipient-address">
              <h3>{{ $t('增值服务') }}</h3>
              <div class="express-left">
                <span>{{ $t('保险服务') }}</span>
                <el-tooltip class="item" effect="dark" :content="explanation" placement="top">
                  <span class="el-icon-warning-outline icon-info"></span> </el-tooltip
                ><br />
                <el-radio-group v-model="item.is_insurance">
                  <el-radio :label="1">{{ $t('启用保险') }}</el-radio>
                  <el-radio :label="0">{{ $t('不启用保险') }}</el-radio>
                  <el-radio :label="2">{{ $t('仅强制要求购买保险的订单启用') }}</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="line-sty"></div>
            <span>{{ $t('增值服务') }}</span>
            <el-checkbox-group v-model="item.add_service" class="radio-select-sty">
              <el-checkbox
                :label="item.id"
                v-for="item in servicesData"
                :key="item.id"
                class="radio-main"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
            <div class="line-sty"></div>
            <div class="recipient-address">
              <div class="express-left">
                <span>{{ $t('关税服务') }}</span>
                <el-tooltip class="item" effect="dark" :content="tariffExplanation" placement="top">
                  <span class="el-icon-warning-outline icon-info"></span> </el-tooltip
                ><br />
                <el-radio-group v-model="item.is_tariff">
                  <el-radio :label="1">{{ $t('启用关税') }}</el-radio>
                  <el-radio :label="0">{{ $t('不启用关税') }}</el-radio>
                  <el-radio :label="2">{{ $t('仅强制要求购买关税的订单启用') }}</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="line-sty"></div>
            <div class="recipient-address">
              <h3>{{ $t('付款方式') }}</h3>
              <div class="express-left">
                <el-radio-group v-model="item.payment_mode" class="radio-select-sty">
                  <el-radio :label="1" class="radio-main">{{ $t('预付') }}</el-radio>
                  <el-radio :label="2" class="radio-main">{{ $t('货到付款') }}</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 80%; margin: 10px auto; text-align: center" v-if="prevStep">
      <el-button size="small" @click="prev">{{ $t('上一步') }}</el-button>
      <el-button type="primary" size="small">{{ $t('提交') }}</el-button>
    </div>
    <select-goods
      :goodsData="form.goods"
      @passVal="passVal"
      @getVal="getVal"
      :showSelectGoods="showSelectGoods"
    ></select-goods>
    <!-- 收件地址弹窗 -->
    <el-dialog :visible.sync="boxDialog" :title="$t('收件地址列表')" @close="clearAddress">
      <div class="add-box" width="80%">
        <el-button @click="goCreated">{{ $t('新增') }}</el-button>
      </div>
      <el-table :data="tableData" border @row-click="onRowChange" style="width: 100%">
        <el-table-column>
          <template slot-scope="scope">
            <el-radio v-model="chooseId" :label="scope.row.id"></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="country.name" :label="$t('国家')"> </el-table-column>
        <el-table-column prop="postcode" :label="$t('邮编')"> </el-table-column>
        <el-table-column prop="timezone" :label="$t('区号')"> </el-table-column>
        <el-table-column prop="receiver_name" :label="$t('收件人')"> </el-table-column>
        <el-table-column :label="$t('收件电话')">
          <template slot-scope="scope">
            <span>{{ scope.row.timezone }}-{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('详细地址')">
          <template slot-scope="scope">
            <span
              >{{ scope.row.street }}&nbsp;{{ scope.row.door_no }}&nbsp;{{ scope.row.city }}
              <span v-if="scope.row.address">({{ scope.row.address }})</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="boxDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="selectAddress">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <!-- 新建收货地址 -->
    <el-dialog
      :visible.sync="innerVisible"
      :title="$t('新建收货地址')"
      width="45%"
      @close="clearNewAddress"
      append-to-body
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-form-inline"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item :label="$t('国家')">
              <el-select v-model="ruleForm.country_id" :placeholder="$t('请选择国家')" filterable>
                <el-option
                  v-for="item in countryData"
                  :key="item.id"
                  :label="item.cn_name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('收件电话')">
              <el-input
                v-model="ruleForm.phone"
                class="inner-textarea"
                :placeholder="$t('请输入收件电话')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('城市')">
              <el-input
                v-model="ruleForm.city"
                class="inner-textarea"
                :placeholder="$t('请输入城市')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('收件人')">
              <el-input
                v-model="ruleForm.receiver_name"
                class="inner-textarea"
                :placeholder="$t('请输入收件人')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('门牌号')">
              <el-input
                v-model="ruleForm.door_no"
                class="inner-textarea"
                :placeholder="$t('请输入门牌号')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('区号')">
              <el-select v-model="ruleForm.timezone" :placeholder="$t('请选择区号')" filterable>
                <el-option
                  v-for="item in countryData"
                  :key="item.id"
                  :label="item.timezone"
                  :value="item.timezone"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('邮编')">
              <el-input
                v-model="ruleForm.postcode"
                class="inner-textarea"
                :placeholder="$t('请输入邮编')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('附加地址')">
              <el-input
                v-model="ruleForm.address"
                class="inner-textarea"
                :placeholder="$t('请输入附加地址')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('街道')">
              <el-input
                v-model="ruleForm.street"
                class="inner-textarea"
                :placeholder="$t('请输入街道')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="returnShip">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirmCreated('ruleForm')">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <!-- 自提点地址 -->
    <el-dialog :visible.sync="addressDialog" :title="$t('自提点地址')" @close="clearSelf">
      <el-table :data="stationsData" border @row-click="onRowAddress" style="width: 100%">
        <el-table-column>
          <template slot-scope="scope">
            <el-radio v-model="box.station_id" :label="scope.row.id"></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('自提点名称')"> </el-table-column>
        <el-table-column :label="$t('详细地址')" prop="address"> </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="addressDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirmSelf">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <!-- 选择自提点地址 -->
    <el-dialog :visible.sync="selfDialog" :title="$t('收件地址列表')" @close="clear">
      <el-table :data="selfForm" border @row-click="onPickChange" style="width: 100%">
        <el-table-column>
          <template slot-scope="scope">
            <el-radio v-model="chooseId" :label="scope.row.id"></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="country.cn_name" :label="$t('国家')"> </el-table-column>
        <el-table-column prop="contactor" :label="$t('收件人')"> </el-table-column>
        <el-table-column :label="$t('联系电话')" prop="contact_info"> </el-table-column>
        <el-table-column :label="$t('详细地址')">
          <template slot-scope="scope">
            <span
              >{{ scope.row.street }}&nbsp;{{ scope.row.door_no }}&nbsp;{{ scope.row.city }}
              <span v-if="scope.row.address">({{ scope.row.address }})</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="returnPick">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="realPick">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import purchaseInfo from './components/purchaseInfo.vue'
import selectGoods from './components/selectGoods.vue'
export default {
  data() {
    return {
      form: {},
      number: '',
      code: '',
      nextStep: false,
      prevStep: false,
      showSelectGoods: false,
      goodData: [
        {
          tableData: [],
          code: ''
        }
      ],
      ind: '',
      i: '',
      user_id: '',
      needCode: '',
      options: [],
      explanation: '',
      tariffExplanation: '',
      user: {},
      packageId: [],
      userId: '',
      userData: {},
      optionsId: [],
      boxDialog: false,
      selfDialog: false,
      selfForm: [],
      innerVisible: false,
      addressDialog: false,
      tableData: [],
      chooseId: 0,
      packageData: [],
      radio: 1,
      address_type: 1,
      servicesData: [],
      localization: {},
      insurance: {},
      stationsData: [],
      enabled: 0,
      chooseSelf: '',
      selfAddress: {},
      lineId: '',
      personalCode: '',
      idCode: '',
      isDelivery: '',
      multiBoxes: '',
      divides: [
        {
          addressList: [],
          address_type: 1,
          location: '',
          user_id: '',
          address: [],
          express_line_id: '',
          clearance_code: '',
          personal_code: '',
          id_card: '',
          coupon_id: '',
          is_insurance: '',
          is_tariff: 0,
          add_service: [],
          payment_mode: '',
          station_id: '',
          batch_mode: '',
          single_mode: '',
          packageData: [],
          selfData: {}
        }
      ],
      ruleForm: {
        receiver_name: '',
        phone: '',
        timezone: '',
        country_id: '',
        door_no: '',
        city: '',
        postcode: '',
        street: '',
        address: ''
      },
      box: {
        package_ids: [],
        express_line_id: '',
        station_id: '',
        address_id: ''
      },
      countryData: [],
      rules: {
        country_id: [{ required: true, message: this.$t('请选择国家'), trigger: 'blur' }],
        phone: [{ required: true, message: this.$t('请输入电话'), trigger: 'blur' }],
        receiver_name: [{ required: true, message: this.$t('请输入收件人'), trigger: 'blur' }],
        city: [{ required: true, message: this.$t('请输入城市'), trigger: 'blur' }]
      },
      tableLoading: false
    }
  },
  components: {
    purchaseInfo,
    selectGoods
  },
  created() {
    this.getRadio()
    this.getRecipeAddress()
    if (this.$route.params.id) {
      this.getDetail()
    }
  },
  methods: {
    getList() {
      this.$request
        .preview({
          package_ids: this.packageId
        })
        .then(res => {
          if (res.ret) {
            this.divides.forEach(item => {
              if (item.packageData) {
                return (item.packageData = res.data.packages)
              }
            })
            this.userId = res.data.packages[0].user_id
            this.clientId = res.data.packages[0].user_id
            if (this.userId) {
              this.getAddressDialog() // 获取收件地址
              this.getCountry() // 获取新建收件地址的国家
            }
            this.optionsId = res.data.packages.map(item => item.id)
            this.localization = res.localization
            if (res.data.items.added_service.length) {
              this.divides.forEach(item => {
                return (item.add_service = res.data.items.added_service)
              })
            }
            this.divides.forEach(item => {
              return (item.is_insurance = res.data.items.insurance)
            })
            this.divides.forEach(item => {
              return (item.is_tariff = res.data.items.is_tariff)
            })
            this.divides.forEach(item => {
              return (item.payment_mode = res.data.items.payment_mode)
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
    },
    // 获取快递方式
    getExpress() {
      this.address_ids = this.divides.forEach(item => {
        if (item.addressList) {
          item.addressList.map(item => {
            if (item.address) {
              return item.address.id
            }
          })
        }
      })
      let params = {
        package_ids: this.optionsId,
        type: this.radio
      }
      if (
        this.divides.forEach(item => {
          if (item.address_type === 1) {
            params.address_ids = this.address_ids
          }
        })
      )
        if (this.radio === 1) {
          params.is_delivery = 0
        }
      this.$request.usableLines(params).then(res => {
        if (res.ret) {
          this.options = res.data
          this.divides.forEach(item => {
            if (item.express_line_id) {
              item.express_line_id = res.data[0].id
            }
          })
          this.lineId = res.data[0].id
          this.lineStations()
          this.getId()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 获取身份证号码跟清关编码
    getId() {
      this.$request.idCards(this.lineId).then(res => {
        if (res.ret) {
          this.needCode = res.data.need_clearance_code
          this.idCode = res.data.need_id_card
          this.personalCode = res.data.need_personal_code
          this.isDelivery = res.data.is_delivery
          this.multiBoxes = res.data.multi_boxes
        }
      })
    },
    //  收件地址 选择自提点弹窗
    onPickChange(row) {
      this.chooseId = row.id
      this.user = row
      this.box.address_id = this.chooseId
    },
    // 收件地址 取消自提点
    returnPick() {
      this.selfDialog = false
      this.boxDialog = true
    },
    // 自提点地址
    onRowAddress(row) {
      this.box.station_id = row.id
      this.selfAddress = row
    },
    // 收件地址 自提确认
    realPick() {
      if (!this.chooseId) {
        return this.$message.error(this.$t('请选择'))
      }
      this.userData = this.user
      this.boxDialog = false
      this.selfDialog = false
    },
    // 获取自提点地址
    lineStations() {
      this.$request.lineStations(this.lineId).then(res => {
        if (res.ret) {
          this.stationsData = res.data
          this.divides.forEach(item => {
            if (item.selfData) {
              return (item.selfData = res.data[0])
            }
            if (item.selfData) {
              return (this.box.address_id = item.selfData.id)
            }
          })
        }
      })
    },
    // 新建收货地址
    goCreated() {
      this.innerVisible = true
      this.boxDialog = false
    },
    // 获取收件地址列表数据
    getRecipeAddress() {
      this.tableLoading = true
      this.$request
        .recipeAddress({
          package_ids: this.packageId
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.addressList = res.data
            this.divides.forEach(item => {
              if (item.addressList) {
                return (item.addressList = res.data)
              }
            })
            res.data.map(item => {
              if (item.address) {
                this.addressIds = item.address.sub_area_id
                  ? [item.address.sub_area_id]
                  : [item.address.area_id]
              }
            })
          }
        })
    },
    deleteAddress(index, rows, userId) {
      this.divides.forEach(item => {
        if (item.addressList) {
          item.addressList = item.addressList.filter(ele => ele.user_id !== userId)
        }
      })
      this.divides.forEach(item => {
        if (item.packageData) {
          item.packageData = item.packageData.filter(ele => ele.user_id !== userId)
        }
      })
      this.packageId = this.divides.forEach(item => {
        if (item.packageData) {
          item.packageData.map(ele => ele.id)
        }
      })
    },
    // 获取所有可选择的国家
    getCountry() {
      this.$request.getCountry().then(res => {
        this.countryData = res.data
      })
    },
    changeRadio() {
      this.divides.forEach(item => {
        if (item.express_line_id) {
          item.express_line_id = ''
        }
      })
      this.options = []
      this.getExpress()
    },
    getDetail() {
      this.$request.purchaseDetail(this.$route.params.id).then(res => {
        console.log(res)
        this.form = res.data
      })
    },
    onConfirm() {
      this.nextStep = true
      this.goodData = []
      for (let i = 1; i <= this.number; i++) {
        this.goodData.push({
          tableData: [],
          code: ''
        })
      }
    },
    delbox(index) {
      this.goodData.splice(index, 1)
    },
    goNext() {
      this.nextStep = false
      this.prevStep = true
      if (this.packageId) {
        this.getList()
      }
      this.divides = []
      for (let i = 1; i <= this.number; i++) {
        this.divides.push({
          address_type: 1,
          location: '',
          user_id: '',
          address: [],
          express_line_id: '',
          clearance_code: '',
          personal_code: '',
          id_card: '',
          coupon_id: '',
          is_insurance: '',
          is_tariff: 0,
          add_service: [],
          payment_mode: '',
          station_id: '',
          batch_mode: '',
          single_mode: '',
          packageData: []
        })
      }
    },
    prev() {
      this.nextStep = true
      this.prevStep = false
    },
    getRadio() {
      this.$request.servicesPackage().then(res => {
        if (res.ret) {
          this.servicesData = res.data
        }
      })
    },
    passVal() {
      this.showSelectGoods = false
    },
    onSelect(ind) {
      this.ind = ind
      this.showSelectGoods = true
    },
    getVal(selection) {
      this.packageId = selection.map(item => item.id)
      console.log(this.packageId)
      this.goodData[this.ind].tableData = selection
      console.log(this.goodData)
    },
    deleterow(index, rows) {
      rows.splice(index, 1)
    },
    getInsurance() {
      this.$request.packsConfig().then(res => {
        if (res.ret) {
          this.insurance = res.data
          this.divides.forEach(item => {
            if (item.is_insurance) {
              return (item.is_insurance = res.data.is_insurance)
            }
          })
          this.divides.is_tariff.forEach(item => {
            if (item.is_tariff) {
              return (item.is_tariff = res.data.is_tariff)
            }
          })
          this.explanation = res.data.explanation
          this.tariffExplanation = res.data.tariffExplanation
        }
      })
    },
    clearSelf() {
      this.box.station_id = ''
      this.selfAddress = {}
    },
    // 清除新建收货地址
    clearNewAddress() {
      this.ruleForm.country_id = ''
      this.ruleForm.phone = ''
      this.ruleForm.city = ''
      this.ruleForm.receiver_name = ''
      this.ruleForm.door_no = ''
      this.ruleForm.timezone = ''
      this.ruleForm.postcode = ''
      this.ruleForm.address = ''
      this.ruleForm.street = ''
    },
    // 确定 更改地址
    selectAddress() {
      if (!this.chooseId) {
        return this.$message.error(this.$t('请选择'))
      }
      let params = this.addressList.map(item => {
        if (item.user_id === this.counts.user_id) {
          return {
            address_id: this.chooseId,
            package_count: item.package_count,
            user_id: item.user_id
          }
        }
        return {
          user_id: item.user_id,
          package_count: item.package_count,
          address_id: item.address.id
        }
      })
      this.$request.confirmChangeAddress(params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('成功'),
            message: res.msg
          })
          this.getExpress()
          this.boxDialog = false
          this.divides.forEach(item => {
            if (item.addressList) {
              return (item.addressList = res.data)
            }
          })
          res.data.map(item => {
            if (item.address) {
              this.addressIds = item.address.sub_area_id
                ? [item.address.sub_area_id]
                : [item.address.area_id]
            }
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
    selectStation() {},
    changeExpress() {},
    changeAdd() {}
  }
}
</script>

<style lang="scss" scoped>
.goods-container {
  background: #fff !important;
}
.flex {
  display: flex;
}
.circle {
  width: 28px;
  height: 28px;
  border: 1px solid #333;
  box-sizing: border-box;
  border-radius: 50%;
  margin-right: 15px;
}
.key {
  font-size: 24px;
  font-weight: bold;
}
.goods {
  display: flex;
  border: 1px solid #eee;
  padding: 10px 20px 20px;
  width: 1200px;
  margin: 10px auto;
  .left-box {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-right: 1px solid #eee;
    padding: 0 20px;
  }
  .right-box {
    padding: 10px;
    flex: 1;
    .right-select {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
.boxing-container {
  width: 80%;
  margin: 0 auto;
  border: 1px solid #eee;
  .apply-main {
    padding: 20px 0 0 0;
  }
  ul {
    list-style: none;
    padding: 0;
    margin-top: 0;
  }
  .express-left {
    display: inline-block;
  }
  .express-right {
    float: right;
  }
  .apply-express {
    text-align: left;
    overflow: hidden;
  }
  .main-sty {
    border: 1px solid #f5f5f5;
    padding: 10px;
    margin-bottom: 10px;
  }
  .apply-number {
    color: #f5ab53;
    font-weight: 700;
  }
  .choose-sty {
    text-align: left;
    color: #b6b6b6;
  }
  .top-sty {
    padding-bottom: 20px;
  }
  .address-main {
    padding-left: 10px;
  }
  .line-sty {
    margin-top: 10px;
  }
  .radio-sty {
    margin-top: 10px;
  }
  .right-margin {
    margin-left: 20px;
  }
  .express-sty {
    cursor: pointer;
  }
  .icon-info {
    color: #f4a323;
    padding-left: 10px;
  }
  .radio-select-sty {
    margin-top: 20px;
    .radio-main {
      margin-bottom: 10px;
    }
  }
  .add-box {
    text-align: right;
    margin-bottom: 10px;
  }
}
.choose-self {
  margin-top: 20px;
}
.poster-left,
.poster-right {
  vertical-align: top;
  display: inline-block;
  background-color: #fff;
}
.poster-left {
  width: 300px;
  height: 580px;
  overflow: auto;
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
  position: relative;
  margin-right: 20px;
  border-right: 2px solid #eee;
}
.poster-right {
  width: calc(100%-342px);
  width: -moz-calc(100% - 342px);
  width: -webkit-calc(100% - 342px);
  padding: 15px;
  height: 750px;
  box-sizing: border-box;
}
</style>
