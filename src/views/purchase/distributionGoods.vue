<template>
  <div class="goods-container">
    <h3>{{ $t('采购单详细') }}</h3>
    <purchase-info :form="form"></purchase-info>
    <h3>{{ $t('采购清单') }}</h3>
    <el-table :data="form.goods" border style="width: 100%" :cell-style="editColor">
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
      <el-table-column prop="remain" :label="$t('剩余可拆数量')"></el-table-column>
      <el-table-column prop="box_count" :label="$t('物品总箱数')"></el-table-column>
      <el-table-column prop="box_spec" :label="$t('物品箱规')"></el-table-column>
      <el-table-column prop="barcode" :label="$t('条码')"></el-table-column>
      <el-table-column prop="image" :label="$t('物品照片')">
        <template slot-scope="scope">
          <img
            :src="$baseUrl.IMAGE_URL + scope.row.image"
            @click="checkImg(scope.row.image)"
            class="img"
          />
        </template>
      </el-table-column>
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
              <el-button @click="onConfirm" :disabled="prevStep" type="primary">{{
                $t('确定')
              }}</el-button>
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
              <el-input
                v-model="item.code"
                :placeholder="$t('请扫商品条码')"
                size="small"
                clearable
                style="width: 45%"
              ></el-input>
              <el-button type="primary" @click="onSearch" size="small" style="margin-left: 5px">{{
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
              <el-table-column prop="remain" :label="$t('装箱数量')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remain" @blur="getNumber(scope.row.id)"></el-input>
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
      <div style="width: 70%; margin: 0 auto">
        <div class="address-main">
          <div class="express-left">
            <p>{{ $t('收货形式') }}</p>
          </div>
          <div class="express-left right-margin">
            <el-radio-group v-model="radio" @change="changeRadio">
              <el-radio :label="1">{{ $t('送货上门') }}</el-radio>
              <el-radio :label="2">{{ $t('自提点提货') }}</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="boxing-container" v-for="(item, index) in divides" :key="index">
        <div class="apply-main">
          <div class="poster-left">
            <div class="choose-sty key"># {{ index + 1 }}</div>
            <div class="left-top">
              <ul>
                <li class="main-sty" v-for="ele in item.goods" :key="ele.id">
                  <div class="apply-express">
                    <div class="express-left">
                      <p>
                        <strong>{{ ele.cn_name }}</strong>
                      </p>
                    </div>
                  </div>
                  <div class="apply-express">
                    <div class="express-left">
                      <p>
                        <strong>{{ ele.quantity }}</strong>
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
                <div class="express-left">{{ $t('客户ID') }}</div>
                <div class="express-left right-margin">
                  <el-autocomplete
                    :fetch-suggestions="queryCNSearch"
                    @select="data => handleSelect(index, data)"
                    :placeholder="$t('请输入客户ID')"
                    v-model="item.user_id"
                  >
                  </el-autocomplete>
                </div>
              </div>
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
                  :data="item.address"
                  stripe
                  border
                  class="data-list"
                  v-loading="tableLoading"
                  v-if="item.address_type === 1"
                >
                  <el-table-column :label="$t('客户ID')" prop="user_id"></el-table-column>
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
                        @click="
                          changeAddress(scope.$index, scope.row.user_id, scope.row, item.address)
                        "
                        >{{ $t('更改地址') }}</el-button
                      >
                      <el-button
                        class="btn-light-red"
                        @click="deleteAddress(scope.$index, item.address, scope.row.user_id)"
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
                    <div class="choose-sty" v-if="selfData && selfData.id">
                      <p>{{ selfData.address }}</p>
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
      <el-button type="primary" size="small" @click="onSubmit">{{ $t('提交') }}</el-button>
    </div>
    <select-goods
      :goodsData="form.goods"
      @passVal="passVal"
      @getVal="getVal"
      :showSelectGoods="showSelectGoods"
    ></select-goods>
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
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import purchaseInfo from './components/purchaseInfo.vue'
import selectGoods from './components/selectGoods.vue'
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      form: {},
      goods: [],
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
      packageId: [],
      userData: {},
      addressDialog: false,
      radio: 1,
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
      location: '',
      coupon_id: '',
      payment_mode: '',
      station_id: '',
      selfData: {},
      clientId: '',
      imgVisible: false,
      imgSrc: '',
      country_id: '',
      divides: [
        {
          address_type: 1,
          location: '',
          user_id: '',
          address: [],
          express_line_id: '',
          clearance_code: '',
          personal_code: '',
          id_card: '',
          coupon_id: '',
          is_insurance: 0,
          is_tariff: 0,
          add_service: [],
          payment_mode: '',
          station_id: '',
          batch_mode: '',
          single_mode: '',
          goods: [],
          selfData: {}
        }
      ],
      box: {
        station_id: ''
      },
      ids: '',
      tableLoading: false
    }
  },
  components: {
    purchaseInfo,
    selectGoods
  },
  created() {
    this.getRadio()
    this.getInsurance()
    if (this.$route.params.id) {
      this.getDetail()
    }
  },
  methods: {
    editColor({ row, columnIndex }) {
      if (row.remain && columnIndex === 8) {
        return { color: 'red' }
      }
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
    // 获取收件地址列表数据
    getRecipeAddress(index) {
      this.tableLoading = true
      let params = {
        country_id: this.country_id
      }
      params.user_id = this.user_id
      this.$request.getAddress(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          let addressData = JSON.parse(JSON.stringify(res.data[0]))
          this.divides[index].address = [addressData]
        }
      })
    },
    changeAdd() {
      this.divides.forEach(item => {
        if (item.express_line_id) {
          item.express_line_id = ''
        }
      })
      this.options = []
      this.getExpress()
    },
    getExpress() {
      this.address_ids = this.divides.forEach(item => {
        if (item.address) {
          item.address.map(ele => {
            if (ele.address) {
              return ele.address.id
            }
          })
        }
      })
      let params = {
        package_ids: [this.packageId],
        type: this.radio
      }
      this.divides.forEach(item => {
        if (item.address_type === 1) {
          params.address_ids = this.address_ids
        }
      })
      if (this.radio === 1) {
        params.is_delivery = 0
      }
      this.$request.usableLines(params).then(res => {
        if (res.ret) {
          console.log(res.data)
          this.options = res.data
          this.divides.forEach(item => {
            item.express_line_id = res.data[0].id
            this.lineId = item.express_line_id
          })
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
    // 更改地址
    changeAddress(userId, counts, addressList) {
      this.clientId = userId
      dialog(
        {
          type: 'addEditAddress',
          clientId: this.clientId,
          addressList,
          counts
        },
        data => {
          console.log(data)
          this.divides.forEach(item => {
            item.address = JSON.parse(JSON.stringify(data))
          })
          this.getExpress()
        }
      )
    },
    // 自提点地址
    onRowAddress(row) {
      this.box.station_id = row.id
      this.selfAddress = row
    },
    queryCNSearch(queryString, callback) {
      var list = [{}]
      this.$request.Automatic().then(res => {
        for (let i of res.data) {
          i.value = i.id + '---' + i.name
        }
        list = res.data
        callback && callback(list)
      })
    },
    // 客户id
    handleSelect(index, item) {
      console.log(index, item)
      if (item.id) {
        this.user_id = item.id
        this.getRecipeAddress(index)
      }
    },
    getDetail() {
      this.$request.purchaseDetail(this.$route.params.id).then(res => {
        res.data.goods.forEach(item => {
          item.remain = item.quantity
        })
        this.form = res.data
        this.user_id = res.data.package.user_id
        this.location = res.data.package.location
        this.packageId = res.data.package.id
        this.country_id = res.data.package.country_id
      })
    },
    getNumber(id) {
      let number = 0
      this.goodData.forEach(item => {
        console.log(item)
        if (item.tableData) {
          item.tableData.forEach(ele => {
            if (ele.id === id) {
              console.log(ele.remain, ele.id, id)
              number = Number(ele.remain) + number
              console.log(number)
            }
          })
        }
      })
      this.form.goods.forEach((val, i) => {
        if (val.id === id) {
          if (number < 0 || number > val.quantity) {
            return this.$message.error(this.$t('装箱数量不能为负值'))
          }
          val.remain = val.quantity - number
          this.$set(this.form.goods[i], 'remain', val.remain)
        }
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
          goods: []
        })
      }
      this.divides.forEach(ele => {
        this.goodData.forEach(item => {
          ele.goods = item.tableData.map(val => {
            return {
              goods_id: val.id,
              cn_name: val.cn_name,
              quantity: val.remain
            }
          })
          console.log(ele.goods)
        })
      })
    },
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
      let selections = JSON.parse(JSON.stringify(selection))
      let selectionId = selections.map(item => item.id)
      this.goodData.forEach(item => {
        if (item.tableData.length) {
          let result = item.tableData.filter(ele => ele.id !== selectionId)
          this.$set(this.goodData[this.ind].tableData, 'tableData', result)
        } else {
          this.$set(this.goodData[this.ind], 'tableData', selections)
          selections.forEach(item => {
            this.getNumber(item.id)
          })
        }
      })
      // this.goodData.forEach(item => {
      //   if (item.tableData.length) {
      //     item.tableData.forEach(ele => {
      //       selections.forEach(val => {
      //         if (val.id !== ele.id) {
      //           this.getNumber(val.id)
      //           item.tableData = [...item.tableData, val]
      //         }
      //       })
      //     })
      //   } else {
      //     this.$set(this.goodData[this.ind], 'tableData', selections)
      //     selections.forEach(item => {
      //       this.getNumber(item.id)
      //     })
      //   }
      // })
    },
    deleterow(index, rows) {
      rows.splice(index, 1)
    },
    getInsurance() {
      this.$request.packsConfig().then(res => {
        if (res.ret) {
          this.insurance = res.data
          this.divides.forEach(item => {
            item.is_insurance = res.data.is_insurance
            item.is_tariff = res.data.is_tariff
          })
          this.explanation = res.data.explanation
          this.tariffExplanation = res.data.tariffExplanation
        }
      })
    },
    // 确认自提地址
    confirmSelf() {
      if (!this.box.station_id) {
        return this.$message.error(this.$t('请选择'))
      }
      this.selfData = this.selfAddress
      if (this.selfData) {
        this.box.address_id = this.selfData.id
      }
      this.addressDialog = false
    },
    clearSelf() {
      this.box.station_id = ''
      this.selfAddress = {}
    },
    onSearch() {
      this.goodData.forEach(item => {
        if (item.code) {
          item.tableData = JSON.parse(
            JSON.stringify(this.form.goods.filter(ele => ele.barcode === item.code))
          )
          item.tableData.forEach(val => {
            this.getNumber(val.id)
          })
        }
      })
    },
    selectStation() {
      this.addressDialog = true
    },
    checkImg(url) {
      this.imgVisible = true
      this.imgSrc = this.$baseUrl.IMAGE_URL + url
    },
    deleteAddress(index, rows, userId) {
      console.log(userId)
      rows.splice(index, 1)
    },
    changeExpress() {
      this.selfData = {}
      this.divides.forEach(item => {
        this.lineId = item.express_line_id
      })
      this.lineStations()
      this.getId() // 获取身份证号码跟清关编码
      this.divides.forEach(item => {
        item.clearance_code = ''
        item.id_card = ''
        item.personal_code = ''
      })
    },
    // 获取自提点地址
    lineStations() {
      this.$request.lineStations(this.lineId).then(res => {
        if (res.ret) {
          this.stationsData = res.data
          this.selfData = res.data[0]
          if (this.selfData) {
            this.divides.forEach(item => {
              if (item.address) {
                item.address.forEach(ele => {
                  ele.address_id = this.selfData.id
                })
              }
            })
          }
        }
      })
    },
    onSubmit() {
      let params = {
        divides: []
      }
      params.divides = this.divides
      params.divides.forEach(item => {
        item.user_id = this.user_id
        item.location = this.location
      })
      params.divides.forEach(item => {
        item.address = item.address.map(ele => {
          return {
            user_id: ele.user_id,
            address_id: ele.id
          }
        })
      })
      this.$request.dividePurchase(this.$route.params.id, params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
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
  color: black;
}
.goods {
  display: flex;
  border: 1px solid #eee;
  padding: 10px 20px 20px;
  width: 70%;
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
  width: 70%;
  margin: 10px auto;
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
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
  }
  .apply-number {
    color: #f5ab53;
    font-weight: 700;
  }
  .choose-sty {
    text-align: left;
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
  box-sizing: border-box;
}
.img {
  width: 30px;
}
.img_box {
  text-align: center;
  .imgDialog {
    width: 50%;
  }
}
</style>
