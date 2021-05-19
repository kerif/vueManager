<template>
  <div class="boxing-container">
    <div class="apply-main">
      <div class="poster-left">
        <div class="choose-sty">
          <p>
            {{ $t('您本次选择') }}
            <span class="apply-number">{{ packageData.length }}</span>
            {{ $t('个包裹') }}
          </p>
        </div>
        <div class="left-top">
          <ul>
            <li class="main-sty" v-for="item in packageData" :key="item.id">
              <div class="apply-express">
                <div class="express-left">
                  <p>
                    <strong>{{ item.express_num }}</strong>
                  </p>
                  <p v-for="val in item.props" :key="val.id">{{ val.name }}</p>
                  <p v-if="item.has_insurance === 1" class="apply-number">
                    {{ $t('要求购买保险') }}
                  </p>
                  <p v-else class="apply-number">{{ $t('不要求购买保险') }}</p>
                </div>
                <div class="express-left express-right">
                  <p>{{ item.destination_country && item.destination_country.name }}</p>
                  <p>
                    <strong>{{ item.package_weight }}{{ localization.weight_unit }}</strong>
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="poster-right">
        <div class="recipient-address apply-express">
          <h3>{{ $t('收件地址') }}</h3>
          <div class="address-main">
            <!-- 收货形式 -->
            <div class="express-left">
              <p>{{ $t('收货形式') }}</p>
            </div>
            <div class="express-left right-margin">
              <el-radio-group v-model="radio" @change="changeRadio">
                <el-radio :label="1">{{ $t('送货上门') }}</el-radio>
                <el-radio :label="2">{{ $t('自提点提货') }}</el-radio>
              </el-radio-group>
            </div>
            <div class="line-sty"></div>
            <!-- 收件地址 -->
            <div>
              <div class="express-left">
                <p>{{ $t('收件地址') }}</p>
              </div>
              <el-table
                :data="addressList"
                stripe
                border
                class="data-list"
                v-loading="tableLoading"
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
                <el-table-column :label="$t('操作')">
                  <template slot-scope="scope">
                    <!-- 更改地址 -->
                    <el-button
                      class="btn-green"
                      @click="changeAddress(scope.row.user_id, scope.row, addressList)"
                      >{{ $t('更改地址') }}</el-button
                    >
                    <!-- 删除 -->
                    <el-button
                      class="btn-light-red"
                      @click="deleteAddress(scope.$index, addressList, scope.row.user_id)"
                      >{{ $t('删除') }}</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <!-- <div v-if="this.userData && this.userData.user_id">
                  <p>{{userData.receiver_name}}</p>
                  <p>{{userData.phone}}</p>
                  <p>{{userData.country && userData.country.cn_name}}&nbsp;{{userData.city}}
                  </p>
                </div>
                <div v-if="this.userData">
                  <p>{{userData.contactor}}</p>
                  <p>{{userData.contact_info}}</p>
                  <p>{{userData.country && userData.country.cn_name}}&nbsp;{{userData.address}}
                  </p>
                </div> -->
              <!-- <div class="express-left express-right">
                <p class="express-sty" @click="chooseUser">{{$t('请选择')}} ></p>
              </div> -->
            </div>
            <div class="line-sty"></div>
            <div class="express-left">
              <p>{{ $t('快递方式') }}</p>
            </div>
            <div class="express-left right-margin">
              <!-- <p>请选择快递方式</p> -->
              <el-select
                v-model="box.express_line_id"
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
            <div v-if="this.radio === 2">
              <div class="express-left">
                <p>{{ $t('自提点地址') }}</p>
                <div class="choose-sty" v-if="this.selfData.id">
                  <p>{{ selfData.address }}</p>
                </div>
              </div>
              <div class="express-left express-right">
                <p class="express-sty" @click="selectStation">{{ $t('请选择') }} ></p>
              </div>
            </div>
            <!-- <div class="line-sty" v-if="this.stationsData.length"></div> -->
            <!-- 清关编码 -->
            <div class="express-left" v-if="this.needCode">
              <p>{{ $t('清关编码') }}&nbsp;&nbsp;&nbsp;</p>
            </div>
            <div class="express-left right-margin" v-if="this.needCode">
              <el-input v-model="box.clearance_code" :placeholder="$t('请输入')"></el-input>
            </div>
            <div class="line-sty" v-if="this.needCode"></div>
            <!-- 身份证号码 -->
            <div class="express-left" v-if="this.idCode">
              <p>{{ $t('身份证号码') }}</p>
            </div>
            <div class="express-left right-margin" v-if="this.idCode">
              <el-input v-model="box.id_card" :placeholder="$t('请输入')"></el-input>
            </div>
            <div class="line-sty" v-if="this.idCode"></div>
            <!-- 个人通关码 -->
            <div class="express-left" v-if="this.personalCode">
              <p>{{ $t('个人通关码') }}</p>
            </div>
            <div class="express-left right-margin" v-if="this.personalCode">
              <el-input v-model="box.personal_code" :placeholder="$t('请输入')"></el-input>
            </div>
            <div class="line-sty" v-if="this.personalCode"></div>
          </div>
        </div>
        <div class="recipient-address">
          <h3>{{ $t('增值服务') }}</h3>
          <!-- 保险服务 -->
          <div class="express-left">
            <span>{{ $t('保险服务') }}</span>
            <el-tooltip class="item" effect="dark" :content="explanation" placement="top">
              <span class="el-icon-warning-outline icon-info"></span> </el-tooltip
            ><br />
            <!-- <el-radio-group v-model="box.add_service" class="radio-select-sty">
                <el-radio :label="item.id" v-for="item in servicesData" :key="item.id" class="radio-main">{{item.name}}</el-radio>
              </el-radio-group> -->
            <el-radio-group v-model="box.is_insurance">
              <el-radio :label="1">{{ $t('启用保险') }}</el-radio>
              <el-radio :label="0">{{ $t('不启用保险') }}</el-radio>
              <el-radio :label="2">{{ $t('仅强制要求购买保险的订单启用') }}</el-radio>
            </el-radio-group>
          </div>
          <!-- <div class="express-left express-right">
              <el-switch
                v-model="box.is_insurance"
                :active-text="$t('开')"
                :active-value="1"
                :inactive-value="0"
                :inactive-text="$t('关')"
                active-color="#13ce66"
                inactive-color="gray">
              </el-switch>
            </div> -->
        </div>
        <div class="line-sty"></div>
        <!-- 增值服务 -->
        <span>{{ $t('增值服务') }}</span>
        <el-checkbox-group v-model="box.add_service" class="radio-select-sty">
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
            <!-- 增值服务 -->
            <!-- <el-radio-group v-model="box.add_service" class="radio-select-sty">
                <el-radio :label="item.id" v-for="item in servicesData" :key="item.id" class="radio-main">{{item.name}}</el-radio>
              </el-radio-group> -->
            <el-radio-group v-model="box.is_tariff">
              <el-radio :label="1">{{ $t('启用关税') }}</el-radio>
              <el-radio :label="0">{{ $t('不启用关税') }}</el-radio>
              <el-radio :label="2">{{ $t('仅强制要求购买关税的订单启用') }}</el-radio>
            </el-radio-group>
          </div>
          <!-- <div class="express-left express-right">
              <el-switch
                v-model="box.is_insurance"
                :active-text="$t('开')"
                :active-value="1"
                :inactive-value="0"
                :inactive-text="$t('关')"
                active-color="#13ce66"
                inactive-color="gray">
              </el-switch>
            </div> -->
        </div>
        <div class="line-sty"></div>
        <div class="recipient-address">
          <h3>{{ $t('付款方式') }}</h3>
          <div class="express-left">
            <el-radio-group v-model="box.payment_mode" class="radio-select-sty">
              <el-radio :label="1" class="radio-main">{{ $t('预付') }}</el-radio>
              <el-radio :label="2" class="radio-main">{{ $t('货到付款') }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="line-sty"></div>
        <div class="recipient-address">
          <h3>{{ $t('批量集包方式') }}</h3>
          <div class="express-left">
            <el-radio-group v-model="changeUpdate" class="radio-select-sty">
              <el-radio :label="1" class="radio-main">{{ $t('按客户ID集包') }}</el-radio>
              <el-radio :label="2" class="radio-main">{{ $t('快速下单') }}</el-radio>
            </el-radio-group>
          </div>
          <div class="tips-sty" v-if="multiBoxes === 1 && changeUpdate == 2">
            {{
              $t(
                '注：当前线路多箱出库结算方式为 ：每个包裹单独计费后，价格相加汇总。（如需修改，请在路线配置中进行设置）'
              )
            }}
          </div>
          <div class="tips-sty" v-if="multiBoxes === 0 && changeUpdate == 2">
            {{
              $t(
                '注：当前线路多箱出库结算方式为 ：多个包裹重量相加后，按照总重量计算价格。（如需修改，请在路线配置中进行设置）'
              )
            }}
          </div>
        </div>
        <div class="line-sty"></div>
        <div class="save-main">
          <el-button
            type="primary"
            class="sava-btn"
            :loading="$store.state.btnLoading"
            @click="saveBoxing"
            >{{ $t('提交') }}</el-button
          >
          <p v-if="this.box.payment_mode === 1" class="save-tips">
            {{ $t('在仓库打包完成后再进行支付') }}
          </p>
          <p v-if="this.box.payment_mode === 2" class="save-tips">
            {{ $t('到达目的地后再进行支付') }}
          </p>
        </div>
      </div>
    </div>
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
        <!-- 国家 -->
        <el-table-column prop="country.cn_name" :label="$t('国家')"> </el-table-column>
        <!-- 邮编 -->
        <el-table-column prop="postcode" :label="$t('邮编')"> </el-table-column>
        <el-table-column prop="timezone" :label="$t('区号')"> </el-table-column>
        <!-- 收件人 -->
        <el-table-column prop="receiver_name" :label="$t('收件人')"> </el-table-column>
        <!-- 收件电话 -->
        <el-table-column :label="$t('收件电话')">
          <template slot-scope="scope">
            <span>{{ scope.row.timezone }}-{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <!-- 详细地址 -->
        <el-table-column :label="$t('详细地址')">
          <template slot-scope="scope">
            <span
              >{{ scope.row.street }}&nbsp;{{ scope.row.door_no }}&nbsp;{{ scope.row.city }}
              <span v-if="scope.row.address">({{ scope.row.address }})</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="choose-self">
      <el-button @click="pickPoint">{{$t('选择自提点')}}</el-button>
    </div> -->
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
            <!-- 员工组中文名 -->
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
            <!-- 收件电话 -->
            <el-form-item :label="$t('收件电话')">
              <el-input
                v-model="ruleForm.phone"
                class="inner-textarea"
                :placeholder="$t('请输入收件电话')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <!-- 城市 -->
            <el-form-item :label="$t('城市')">
              <el-input
                v-model="ruleForm.city"
                class="inner-textarea"
                :placeholder="$t('请输入城市')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <!-- 收件人 -->
            <el-form-item :label="$t('收件人')">
              <el-input
                v-model="ruleForm.receiver_name"
                class="inner-textarea"
                :placeholder="$t('请输入收件人')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <!-- 门牌号 -->
            <el-form-item :label="$t('门牌号')">
              <el-input
                v-model="ruleForm.door_no"
                class="inner-textarea"
                :placeholder="$t('请输入门牌号')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <!-- 员工组中文名 -->
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
            <!-- 街道 -->
            <el-form-item :label="$t('邮编')">
              <el-input
                v-model="ruleForm.postcode"
                class="inner-textarea"
                :placeholder="$t('请输入邮编')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <!-- 附加地址 -->
            <el-form-item :label="$t('附加地址')">
              <el-input
                v-model="ruleForm.address"
                class="inner-textarea"
                :placeholder="$t('请输入附加地址')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <!-- 街道 -->
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
        <!-- 国家 -->
        <el-table-column prop="name" :label="$t('自提点名称')"> </el-table-column>
        <!-- 详细地址 -->
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
        <!-- 国家 -->
        <el-table-column prop="country.cn_name" :label="$t('国家')"> </el-table-column>
        <!-- 收件人 -->
        <el-table-column prop="contactor" :label="$t('收件人')"> </el-table-column>
        <!-- 联系电话 -->
        <el-table-column :label="$t('联系电话')" prop="contact_info"> </el-table-column>
        <!-- 详细地址 -->
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
export default {
  data() {
    return {
      value: '',
      options: [],
      boxDialog: false,
      selfDialog: false,
      selfForm: [],
      innerVisible: false,
      addressDialog: false,
      tableData: [],
      chooseId: 0,
      user: {},
      packageId: [],
      packageData: [],
      userId: '',
      userData: {},
      optionsId: [],
      radio: 1,
      servicesData: [],
      localization: {},
      insurance: {},
      stationsData: [],
      enabled: 0,
      explanation: '',
      tariffExplanation: '',
      chooseSelf: '',
      selfAddress: {},
      selfData: {},
      lineId: '',
      needCode: '',
      personalCode: '',
      idCode: '',
      isDelivery: '',
      multiBoxes: '',
      box: {
        package_ids: [],
        express_line_id: '',
        payment_mode: '',
        is_insurance: 0,
        is_tariff: 0,
        add_service: [],
        station_id: '',
        id_card: '',
        personal_code: '',
        clearance_code: '',
        address_id: ''
      },
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
      countryData: [],
      rules: {
        country_id: [{ required: true, message: this.$t('请选择国家'), trigger: 'blur' }],
        phone: [{ required: true, message: this.$t('请输入电话'), trigger: 'blur' }],
        receiver_name: [{ required: true, message: this.$t('请输入收件人'), trigger: 'blur' }],
        city: [{ required: true, message: this.$t('请输入城市'), trigger: 'blur' }]
      },
      addressList: [],
      tableLoading: false,
      counts: '',
      clientId: '',
      addressData: [],
      changeUpdate: 1
    }
  },
  created() {
    this.getRadio()
    if (this.$route.query.id) {
      this.packageId = this.$route.query.id
      this.getList()
      this.getRadio()
      this.getInsurance()
      this.getRecipeAddress()
    } else if (this.$route.query.packageId) {
      console.log(this.$route.query.packageId, 'packageId')
      this.getBatch()
      this.radio = 2
      this.packageId = this.$route.query.packageId
      this.getRecipeAddress()
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
            this.packageData = res.data.packages
            this.userId = res.data.packages[0].user_id
            console.log(this.userId, 'this.userId')
            if (this.userId) {
              this.getAddressDialog() // 获取收件地址
              this.getCountry() // 获取新建收件地址的国家
            }
            this.optionsId = res.data.packages.map(item => item.id)
            console.log(this.optionsId, 'optionsId')
            this.localization = res.localization
            if (res.data.items.added_service.length) {
              this.box.add_service = res.data.items.added_service
            }
            this.box.is_insurance = res.data.items.insurance
            this.box.is_tariff = res.data.items.is_tariff
            this.box.payment_mode = res.data.items.payment_mode
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
    // 批量集包
    getBatch() {
      this.$request
        .batchPreview({
          package_ids: this.$route.query.packageId
        })
        .then(res => {
          if (res.ret) {
            this.packageData = res.data.packages
            this.userId = res.data.packages[0].user_id
            console.log(this.userId, 'this.userId')
            if (this.userId) {
              this.getAddressDialog() // 获取收件地址
              this.getCountry() // 获取新建收件地址的国家
            }
            this.optionsId = res.data.packages.map(item => item.id)
            console.log(this.optionsId, 'optionsId')
            this.localization = res.localization
            if (res.data.items.added_service.length) {
              this.box.add_service = res.data.items.added_service
            }
            this.box.is_insurance = res.data.items.insurance
            this.box.is_tariff = res.data.items.is_tariff
            this.box.payment_mode = res.data.items.payment_mode
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
            console.log(this.addressList, 'this.addressList')
          } else {
            this.$notify({
              title: this.$t('获取失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 表格删除
    deleteAddress(index, rows, userId) {
      this.addressList = this.addressList.filter(item => item.user_id !== userId)
      this.packageData = this.packageData.filter(item => item.user_id !== userId)
      this.packageId = this.packageData.map(item => item.id)
      console.log(this.packageId, 'this.packageId')
    },
    // 更改地址
    changeAddress(userId, counts, addressList) {
      console.log(addressList, 'addressList')
      this.clientId = userId // 客户ID
      this.counts = counts // 选择包果数
      this.addressData = addressList // 收件地址数据
      this.boxDialog = true
      this.getAddressDialog()
    },
    // 确定 更改地址
    selectAddress() {
      if (!this.chooseId) {
        return this.$message.error(this.$t('请选择'))
      }
      // chooseId
      // let params = [
      //   {
      //     address_id: this.chooseId,
      //     package_count: this.counts,
      //     user_id: this.clientId
      //   }
      // ]
      let params = this.addressList.map(item => {
        // const { userId, packageCount, addressId } = item
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
      console.log(params, 'params')
      this.$request.confirmChangeAddress(params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('成功'),
            message: res.msg
          })
          this.boxDialog = false
          this.addressList = res.data
          // this.getRecipeAddress() // 重新拉取收件地址
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
        this.boxDialog = false
      })
      // this.userData = this.user
      this.boxDialog = false
    },
    // 获取快递方式
    getExpress() {
      this.$request
        .usableLines({
          package_ids: this.optionsId,
          type: this.radio
        })
        .then(res => {
          if (res.ret) {
            this.options = res.data
            this.box.express_line_id = res.data[0].id
            this.lineId = this.box.express_line_id
            this.lineStations()
            this.getId()
            console.log(this.box.express_line_id, 'this.box.express_line_id')
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 更换快递方式
    changeExpress() {
      // this.options = []
      this.selfData = {}
      this.lineId = this.box.express_line_id
      console.log(this.lineId, 'this.lineId')
      // this.clearance_code = val.need_clearance_code
      // this.need_id_card = val.need_id_card
      this.lineStations()
      this.getId() // 获取身份证号码跟清关编码
      // this.selfData.id = ''
      // this.selfData.address = ''
      this.box.clearance_code = ''
      this.box.id_card = ''
      this.personal_code = ''
      // this.isDelivery = ''
    },
    // 获取身份证号码跟清关编码
    getId() {
      this.$request.idCards(this.lineId).then(res => {
        if (res.ret) {
          console.log(res.data, 'res')
          this.needCode = res.data.need_clearance_code
          this.idCode = res.data.need_id_card
          this.personalCode = res.data.need_personal_code
          this.isDelivery = res.data.is_delivery
          this.multiBoxes = res.data.multi_boxes
          console.log(this.isDelivery, 'this.isDelivery')
        }
      })
    },
    changeRadio() {
      console.log(this.radio, 'radio')
      this.box.express_line_id = ''
      this.options = []
      this.getExpress()
    },
    // 获取自提点地址
    lineStations() {
      this.$request.lineStations(this.lineId).then(res => {
        if (res.ret) {
          this.stationsData = res.data
          this.selfData = res.data[0]
          console.log(this.selfData, 'this.selfData.id')
          if (this.selfData) {
            this.box.address_id = this.selfData.id
            console.log(this.box.address_id, 'box.address_id')
          }
        }
      })
    },
    // 选择自提点地址
    selectStation() {
      this.addressDialog = true
    },
    // 获取增值服务
    getRadio() {
      this.$request.servicesPackage().then(res => {
        if (res.ret) {
          this.servicesData = res.data
        }
      })
    },
    // 获取保险服务
    getInsurance() {
      this.$request.packsConfig().then(res => {
        if (res.ret) {
          this.insurance = res.data
          this.box.is_insurance = res.data.is_insurance
          this.box.is_tariff = res.data.is_tariff
          this.explanation = res.data.explanation
          this.tariffExplanation = res.data.tariffExplanation
        }
      })
    },
    // 获取地址数据
    getAddressDialog() {
      this.$request
        .previewAddress({
          user_id: this.clientId
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.userData = this.tableData[0]
            if (this.userData) {
              this.box.address_id = this.userData.id
              console.log(this.box.address_id, 'this.address_id')
            }
          }
        })
    },
    // 获取所有可选择的国家
    getCountry() {
      this.$request.getCountry().then(res => {
        this.countryData = res.data
      })
    },
    chooseUser() {
      this.boxDialog = true
      if (this.userId) {
        // this.getAddressDialog()
      }
    },
    // 确认新建地址
    confirmCreated(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request
            .addAddress({
              ...this.ruleForm,
              user_id: this.clientId
            })
            .then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: this.$t('成功'),
                  message: res.msg
                })
                this.innerVisible = false
                this.boxDialog = true
                // this.clientId
                this.getAddressDialog()
                // this.success()
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
              // this.innerVisible = false
            })
        } else {
          return false
        }
      })
    },
    // 新建收货地址
    goCreated() {
      this.innerVisible = true
      this.boxDialog = false
    },
    // 创建发货单 取消
    returnShip() {
      this.innerVisible = false
      this.boxDialog = true
    },
    // 选择自提点
    pickPoint() {
      this.innerVisible = false
      this.boxDialog = false
      this.selfDialog = true
      this.getSelfAddress()
    },
    // 收件地址 取消自提点
    returnPick() {
      this.selfDialog = false
      this.boxDialog = true
    },
    // 收件地址 获取自提点数据
    getSelfAddress() {
      this.$request.selfData().then(res => {
        if (res.ret) {
          this.selfForm = res.data
        }
      })
    },
    // 提交
    saveBoxing() {
      // if (this.radio === 1 && !this.userData) {
      //   return this.$message.error('请选择收件地址')
      // }
      let params = this.addressList.map(item => {
        console.log(item.address, 'item111')
        return {
          user_id: item.user_id,
          address_id: item.address ? item.address.id : ''
        }
      })
      console.log(params, 'params111')
      // console.log(this.box.address_id, 'address_id')
      // console.log(this.box.add_service, 'box.add_service')
      if (this.changeUpdate === 1) {
        this.$request
          .savePacksUser({
            ...this.box,
            station_id: this.radio === 2 ? this.box.address_id : '',
            address: params,
            package_ids: this.packageId,
            address_type: this.radio === 2 ? 2 : 1,
            batch_mode: this.$route.query.packageId ? 1 : '',
            // address_type: (this.userData && this.userData.contact_info === '') ? '' : 2,
            type: this.radio === 2 ? 2 : ''
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('保存成功'),
                message: res.msg,
                type: 'success'
              })
              this.$router.push({ name: 'wayBillList' })
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      } else if (this.changeUpdate === 2) {
        this.$request
          .savePacksAlone({
            ...this.box,
            station_id: this.radio === 2 ? this.box.address_id : '',
            address: params,
            package_ids: this.packageId,
            address_type: this.radio === 2 ? 2 : 1,
            batch_mode: this.$route.query.packageId ? 1 : '',
            // address_type: (this.userData && this.userData.contact_info === '') ? '' : 2,
            type: this.radio === 2 ? 2 : ''
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('保存成功'),
                message: res.msg,
                type: 'success'
              })
              this.$router.push({ name: 'wayBillList' })
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
    // 收件地址 自提确认
    realPick() {
      if (!this.chooseId) {
        return this.$message.error(this.$t('请选择'))
      }
      console.log(this.user, 'user')
      this.userData = this.user
      console.log(this.userData, 'this.userData1111')
      this.boxDialog = false
      this.selfDialog = false
    },
    // 收件地址
    onRowChange(row) {
      this.chooseId = row.id
      this.box.address_id = this.chooseId
      this.user = row
    },
    //  收件地址 选择自提点弹窗
    onPickChange(row) {
      this.chooseId = row.id
      this.user = row
      this.box.address_id = this.chooseId
    },
    // 自提点地址
    onRowAddress(row) {
      this.box.station_id = row.id
      this.selfAddress = row
    },
    // 确认自提地址
    confirmSelf() {
      if (!this.box.station_id) {
        return this.$message.error(this.$t('请选择'))
      }
      console.log(this.selfAddress, 'selfAddress')
      this.selfData = this.selfAddress
      this.box.address_id = this.selfData.id
      console.log(this.selfData, 'selfData')
      this.addressDialog = false
    },
    clearSelf() {
      this.box.station_id = ''
      this.selfAddress = {}
    },
    clear() {
      this.chooseId = ''
      this.user = {}
    },
    // 收件地址弹窗
    clearAddress() {
      // this.clientId = ''
      this.chooseId = ''
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
    }
  }
}
</script>

<style lang="scss" scope>
.boxing-container {
  .apply-main {
    padding: 20px;
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
  .recipient-address {
    // margin-top: 80px;
  }
  .address-main {
    padding-left: 10px;
  }
  .line-sty {
    margin-top: 10px;
    border: 1px solid #fbfbfb;
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
    // width: 200px;
    margin-top: 20px;
    .radio-main {
      margin-bottom: 10px;
    }
  }
  .sava-btn {
    min-width: 300px;
    margin-top: 20px;
  }
  .save-main {
    text-align: left;
  }
  .save-tips {
    color: #b6b6b6;
    font-size: 14px;
    margin-right: 40px;
  }
  .add-box {
    text-align: right;
    margin-bottom: 10px;
  }
}
.inner-textarea {
  .el-input__inner {
    // width: 40% !important;
  }
}
.choose-self {
  margin-top: 20px;
}
.poster-left {
  width: 300px;
  height: 580px;
  overflow: auto;
  // overflow: hidden;
  vertical-align: top;
  display: inline-block;
  text-align: center;
  background-color: #fff;
  padding-left: 10px;
  padding-right: 10px;
  position: relative;
  margin-right: 20px;
}
.poster-right {
  width: calc(100%-340px);
  width: -moz-calc(100% - 340px);
  width: -webkit-calc(100% - 340px);
  vertical-align: top;
  display: inline-block;
  background-color: #fff;
  padding: 15px;
  height: 880px;
  overflow: auto;
  box-sizing: border-box;
}
.tips-sty {
  font-size: 13px;
  color: red;
}
</style>
