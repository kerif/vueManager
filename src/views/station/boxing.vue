<template>
  <div class="boxing-container">
    <div class="apply-main">
      <p class="choose-sty">{{$t('您本次选择')}}
        <span class="apply-number">{{packageData.length}}</span>
        {{$t('个包裹')}}</p>
      <ul>
        <li class="main-sty" v-for="item in packageData" :key="item.id">
          <div class="apply-express">
            <div class="express-left">
              <p><strong>{{item.express_num}}</strong></p>
              <p v-for="val in item.props" :key="val.id">{{val.name}}</p>
            </div>
            <div class="express-left express-right">
              <p>{{item.destination_country && item.destination_country.name}}</p>
              <p><strong>{{item.package_weight}}{{localization.weight_unit}}</strong></p>
            </div>
          </div>
        </li>
      </ul>
      <div class="recipient-address apply-express">
        <h3>{{$t('收件地址')}}</h3>
        <div class="address-main">
          <div class="express-left">
            <p>{{$t('收件地址')}}</p>
              <div v-if="this.userData.id" class="choose-sty">
                <p>{{userData.receiver_name}}</p>
                <p>{{userData.phone}}</p>
                <p>{{userData.city}}&nbsp;
                </p>
            </div>
          </div>
            <!-- v-if="this.userData.id" -->
            <!-- <div class="express-left express-right">
              <p>{{userData.street}}&nbsp;{{userData.door_no}}&nbsp;{{userData.city}}&nbsp;
              </p>
            </div> -->
            <div class="express-left express-right">
              <p class="express-sty" @click="chooseUser">{{$t('请选择')}} ></p>
            </div>
            <div class="line-sty"></div>
            <div class="express-left">
                <p>{{$t('快递方式')}}</p>
            </div>
            <div class="express-left express-right radio-sty">
              <!-- <p>请选择快递方式</p> -->
                <el-select v-model="box.express_line_id" :placeholder="$t('请选择')"
                @change="changeExpress">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
            <div class="line-sty"></div>
            <div class="express-left">
              <p>{{$t('收货形式')}}</p>
            </div>
            <div class="express-left express-right radio-sty">
               <el-radio-group v-model="radio" @change="changeRadio">
                  <el-radio :label="1">{{$t('送货上门')}}</el-radio>
                  <el-radio :label="2" v-if="this.stationsData.length">{{$t('自提点提货')}}</el-radio>
              </el-radio-group>
            </div>
            <div class="line-sty"></div>
            <div class="express-left" v-if="this.stationsData.length && this.radio === 2">
              <p>{{$t('自提点地址')}}</p>
              <div class="choose-sty" v-if="this.selfData.id">
                 <p>{{selfData.address}}</p>
              </div>
            </div>
            <div class="express-left express-right" v-if="this.stationsData.length && this.radio === 2">
              <p class="express-sty" @click="selectStation">{{$t('请选择')}} ></p>
            </div>
            <div class="line-sty" v-if="this.stationsData.length"></div>
            <!-- 清关编码 -->
            <div class="express-left" v-if="this.needCode">
                <p>{{$t('清关编码')}}</p>
            </div>
            <div class="express-left express-right radio-sty" v-if="this.needCode">
                <el-input v-model="box.clearance_code" :placeholder="$t('请输入')"></el-input>
            </div>
            <div class="line-sty" v-if="this.needCode"></div>
            <!-- 身份证号码 -->
            <div class="express-left" v-if="this.idCode">
                <p>{{$t('身份证号码')}}</p>
            </div>
            <div class="express-left express-right radio-sty" v-if="this.idCode">
                <el-input v-model="box.id_card" :placeholder="$t('请输入')"></el-input>
            </div>
            <div class="line-sty" v-if="this.idCode"></div>
        </div>
      </div>
      <div class="recipient-address">
      <h3>{{$t('增值服务')}}</h3>
         <div class="express-left">
            <span>{{$t('保险服务')}}</span>
              <el-tooltip class="item" effect="dark" :content="explanation" placement="top">
                <span class="el-icon-warning-outline icon-info"></span>
            </el-tooltip><br/>
            <!-- <el-radio-group v-model="box.add_service" class="radio-select-sty">
              <el-radio :label="item.id" v-for="item in servicesData" :key="item.id" class="radio-main">{{item.name}}</el-radio>
            </el-radio-group> -->
            <el-checkbox-group v-model="box.add_service" class="radio-select-sty">
              <el-checkbox :label="item.id" v-for="item in servicesData" :key="item.id" class="radio-main">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="express-left express-right">
            <el-switch
              v-model="box.is_insurance"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray">
            </el-switch>
          </div>
      </div>
      <div class="recipient-address">
      <h3>{{$t('付款方式')}}</h3>
         <div class="express-left">
            <el-radio-group v-model="box.payment_mode" class="radio-select-sty">
              <el-radio :label="1" class="radio-main">{{$t('预付')}}</el-radio>
              <el-radio :label="2" class="radio-main">{{$t('货到付款')}}</el-radio>
            </el-radio-group>
          </div>
      </div>
      <div class="save-main">
        <el-button type="primary" class="sava-btn" :loading="$store.state. btnLoading" @click="saveBoxing">{{$t('提交')}}</el-button>
        <p v-if="this.box.payment_mode === 1" class="save-tips">{{$t('在仓库打包完成后再进行支付')}}</p>
        <p v-if="this.box.payment_mode === 2" class="save-tips">{{$t('到达目的地后再进行支付')}}</p>
      </div>
    </div>
    <!-- 收件地址弹窗 -->
  <el-dialog :visible.sync="boxDialog" :title="$t('收件地址列表')" @close="clear">
    <el-table
      :data="tableData"
      border
      @row-click="onRowChange"
      style="width: 100%">
      <el-table-column>
        <template slot-scope="scope">
          <el-radio v-model="chooseId" :label="scope.row.id"></el-radio>
        </template>
       </el-table-column>
      <!-- 国家 -->
      <el-table-column
        prop="country.cn_name"
        :label="$t('国家')">
      </el-table-column>
      <!-- 收件人 -->
        <el-table-column
        prop="receiver_name"
        :label="$t('收件人')">
      </el-table-column>
      <!-- 收件电话 -->
        <el-table-column
        :label="$t('收件电话')">
        <template slot-scope="scope">
          <span>{{scope.row.timezone}}-{{scope.row.phone}}</span>
        </template>
        </el-table-column>
        <!-- 详细地址 -->
        <el-table-column
        :label="$t('详细地址')">
        <template slot-scope="scope">
          <span>{{scope.row.street}}&nbsp;{{scope.row.door_no}}&nbsp;{{scope.row.city}}
            <span v-if="scope.row.address">({{scope.row.address}})</span>
          </span>
        </template>
        </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="boxDialog = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
  <!-- 自提点地址 -->
  <el-dialog :visible.sync="addressDialog" :title="$t('自提点地址')" @close="clearSelf">
    <el-table
      :data="stationsData"
      border
      @row-click="onRowAddress"
      style="width: 100%">
      <el-table-column>
        <template slot-scope="scope">
          <el-radio v-model="box.station_id" :label="scope.row.id"></el-radio>
        </template>
       </el-table-column>
      <!-- 国家 -->
      <el-table-column
        prop="name"
        :label="$t('自提点名称')">
      </el-table-column>
        <!-- 详细地址 -->
        <el-table-column
        :label="$t('详细地址')"
        prop="address">
        </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="addressDialog = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirmSelf">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '',
      options: [],
      boxDialog: false,
      addressDialog: false,
      tableData: [],
      chooseId: 0,
      user: {},
      packageId: [],
      packageData: [],
      userId: '',
      userData: {},
      optionsId: [],
      radio: '',
      servicesData: [],
      localization: {},
      insurance: {},
      stationsData: [],
      enabled: 0,
      explanation: '',
      chooseSelf: '',
      selfAddress: {},
      selfData: {},
      lineId: '',
      needCode: '',
      idCode: '',
      box: {
        package_ids: [],
        express_line_id: '',
        payment_mode: '',
        is_insurance: 0,
        add_service: [],
        station_id: '',
        id_card: '',
        clearance_code: '',
        address_id: ''
      }
    }
  },
  created () {
    if (this.$route.query.id) {
      this.packageId = this.$route.query.id
      console.log(this.packageId, 'this.packageId')
      this.getList()
      this.getRadio()
      this.getInsurance()
    }
  },
  methods: {
    getList () {
      this.$request.preview({
        package_ids: this.packageId
      }).then(res => {
        if (res.ret) {
          this.packageData = res.data.packages
          this.userId = res.data.packages[0].user_id
          this.optionsId = res.data.packages.map(item => item.id)
          console.log(this.optionsId, 'optionsId')
          this.localization = res.localization
          if (res.data.items.added_service.length) {
            this.box.add_service = res.data.items.added_service
          }
          this.box.is_insurance = res.data.items.insurance
          this.box.payment_mode = res.data.items.payment_mode
          this.getExpress()
        }
      })
    },
    // 获取快递方式
    getExpress () {
      this.$request.usableLines({
        package_ids: this.optionsId
      }).then(res => {
        if (res.ret) {
          this.options = res.data
        }
      })
    },
    // 更换快递方式
    changeExpress () {
      this.lineId = this.box.express_line_id
      console.log(this.lineId)
      // this.clearance_code = val.need_clearance_code
      // this.need_id_card = val.need_id_card
      this.lineStations()
      this.getId()
      this.selfData.id = ''
      this.radio = ''
      this.selfData.address = ''
      this.box.clearance_code = ''
      this.box.id_card = ''
    },
    // 获取身份证号码跟清关编码
    getId () {
      this.$request.idCards(this.lineId).then(res => {
        if (res.ret) {
          console.log(res.data, 'res')
          this.needCode = res.data.need_clearance_code
          this.idCode = res.data.need_id_card
        }
      })
    },
    changeRadio () {
      console.log(this.radio, 'radio')
    },
    // 获取自提点地址
    lineStations () {
      this.$request.lineStations(this.lineId).then(res => {
        if (res.ret) {
          this.stationsData = res.data
        }
      })
    },
    // 选择自提点地址
    selectStation () {
      this.addressDialog = true
    },
    // 获取增值服务
    getRadio () {
      this.$request.servicesPackage().then(res => {
        if (res.ret) {
          this.servicesData = res.data
        }
      })
    },
    // 获取保险服务
    getInsurance () {
      this.$request.packsConfig().then(res => {
        if (res.ret) {
          this.insurance = res.data
          this.box.is_insurance = res.data.is_insurance
          this.explanation = res.data.explanation
        }
      })
    },
    // 获取地址数据
    getAddressDialog () {
      this.$request.previewAddress({
        user_id: this.userId
      }).then(res => {
        if (res.ret) {
          this.tableData = res.data
        }
      })
    },
    chooseUser () {
      this.boxDialog = true
      if (this.userId) {
        this.getAddressDialog()
      }
    },
    saveBoxing () {
      console.log(this.box.add_service, 'box.add_service')
      this.$request.savePacks({
        ...this.box,
        package_ids: this.packageId
      }).then(res => {
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
    },
    confirm (val) {
      if (!this.chooseId) {
        return this.$message.error(this.$t('请选择'))
      }
      console.log(this.user, 'user')
      this.userData = this.user
      this.boxDialog = false
    },
    // 收件地址
    onRowChange (row) {
      this.chooseId = row.id
      this.box.address_id = this.chooseId
      this.user = row
    },
    // 自提点地址
    onRowAddress (row) {
      this.box.station_id = row.id
      this.selfAddress = row
    },
    // 确认自提地址
    confirmSelf (val) {
      if (!this.box.station_id) {
        return this.$message.error(this.$t('请选择'))
      }
      console.log(this.selfAddress, 'selfAddress')
      this.selfData = this.selfAddress
      console.log(this.selfData, 'selfData')
      this.addressDialog = false
    },
    clearSelf () {
      this.box.station_id = ''
      this.selfAddress = {}
    },
    clear () {
      this.chooseId = ''
      this.user = {}
    }
  }
}
</script>

<style lang="scss">
.boxing-container {
  .apply-main {
    background-color: #fff;
    padding: 20px;
  }
  ul {
    list-style:none;
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
    overflow: hidden;
  }
  .main-sty {
    border: 1px solid #f5f5f5;
    padding: 10px;
    margin-bottom: 10px;
  }
  .apply-number {
    color:#f5ab53;
    font-weight: 700;
  }
  .choose-sty {
    color: #b6b6b6;
  }
  .top-sty {
    padding-bottom: 20px;
  }
  .recipient-address {
    margin-top: 80px;
  }
  .address-main {
    padding-left: 10px;
  }
  .line-sty {
    border: 1px solid #fbfbfb;
  }
  .radio-sty {
    margin-top: 10px;
  }
  .express-sty {
    cursor: pointer;
  }
  .icon-info {
    color: #f4a323;
    padding-left: 10px;
  }
  .radio-select-sty {
    width: 200px;
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
    text-align: right;
  }
  .save-tips {
    color: #b6b6b6;
    font-size: 14px;
    margin-right: 40px;
  }
}
</style>
