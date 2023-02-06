<template>
  <el-drawer
    size="85%"
    :visible.sync="show"
    :title="id ? $t('编辑发货单') : $t('创建发货单')"
    class="invoice-container"
    @close="clear('form')"
  >
    <el-form :model="form" ref="form" :rules="rules" class="form-box" label-width="180px">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('目的地')" prop="country_id">
            <el-select v-model="form.country_id" placeholder="请选择目的地" filterable>
              <el-option
                v-for="item in country"
                :key="item.id"
                :label="item.cn_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('仓库')" prop="warehouse_id">
            <el-select v-model="form.warehouse_id" placeholder="请选择仓库" filterable>
              <el-option
                v-for="item in warehouseData"
                :key="item.id"
                :label="item.warehouse_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('发货单名称')">
            <el-input v-model="form.name" placeholder="请输入发货单名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="MAWB">
            <el-input v-model="form.mawb" placeholder="请输入MAWB"> </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('备注')">
            <el-input type="textarea" v-model="form.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        {{ $t('高级选项') }}
        <i
          :class="showOption ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
          @click="onDisplay"
          style="cursor: pointer"
        >
        </i>
      </div>
      <div v-if="showOption">
        <el-row :gutter="20">
          <el-form-item>
            <el-radio-group v-model="form.type">
              <el-radio :label="1">{{ $t('空运发货单') }}</el-radio>
              <el-radio :label="2">{{ $t('海运发货单') }}</el-radio>
              <el-radio :label="3">{{ $t('其他发货单') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <div v-if="form.type === 1" class="invoice-title">{{ $t('航班信息') }}</div>
        <div v-if="form.type === 1">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item :label="$t('航班')">
                <el-input v-model="form.air_info.flight" placeholder="请输入航班"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item :label="$t('起飞机场')">
                <el-input
                  v-model="form.air_info.departure_airport"
                  placeholder="请输入起飞机场"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('落地机场')">
                <el-input
                  v-model="form.air_info.arrival_airport"
                  placeholder="请输入落地机场"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item :label="$t('预计起飞时间')">
                <el-input
                  v-model="form.air_info.expected_time_of_departure"
                  placeholder="请输入预计起飞时间, 如2023-11-23 12:12"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('实际起飞时间')">
                <el-input
                  v-model="form.air_info.time_of_departure"
                  placeholder="请输入实际起飞时间, 如2023-11-23 12:12"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item :label="$t('预计到达时间')">
                <el-input
                  v-model="form.air_info.expected_time_of_arrival"
                  placeholder="请输入预计到达时间, 如2023-11-23 12:12"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('实际到达时间')">
                <el-input
                  v-model="form.air_info.time_of_arrival"
                  placeholder="请输入实际到达时间, 如2023-11-23 12:12"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="form.type === 2" class="invoice-title">{{ $t('船信息') }}</div>
        <div v-if="form.type === 2">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item :label="$t('船名')">
                <el-input v-model="form.ship_info.name" placeholder="请输入船名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('船次')">
                <el-input v-model="form.ship_info.voyage" placeholder="请输入船次"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item :label="$t('预计开船时间')">
                <el-input
                  v-model="form.ship_info.expected_time_of_ship"
                  placeholder="请输入预计开船时间, 如2023-12-23 12:12"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('实际开船时间')">
                <el-input
                  v-model="form.ship_info.time_of_ship"
                  placeholder="请输入实际开船时间, 如2023-12-23 12:12"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item :label="$t('预计到达时间')">
                <el-input
                  v-model="form.ship_info.expected_time_of_arrival"
                  placeholder="请输入预计到达时间, 如2023-12-23 12:12"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('实际到达时间')">
                <el-input
                  v-model="form.ship_info.time_of_arrival"
                  placeholder="请输入实际到达时间, 如2023-12-23 12:12"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item :label="$t('出发港口')">
                <el-input
                  v-model="form.ship_info.ship_port"
                  placeholder="请输入出发港口"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('目的港口')">
                <el-input
                  v-model="form.ship_info.destination_port"
                  placeholder="请输入目的港口"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="Lioyds no">
                <el-input
                  v-model="form.ship_info.Lioyds_no"
                  placeholder="请输入Lioyds no"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('船公司名称')">
                <el-input
                  v-model="form.ship_info.company_name"
                  placeholder="请输入船公司名称"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="form.type === 1 || form.type === 2" class="invoice-title">
          {{ $t('默认发件人') }}
        </div>
        <div v-if="form.type === 1 || form.type === 2">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="Name">
                <el-input v-model="form.sender_info.name" placeholder="请输入Name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Address">
                <el-input v-model="form.sender_info.address" placeholder="请输入Address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="Country">
                <el-input v-model="form.sender_info.country" placeholder="请输入Country"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="State">
                <el-input v-model="form.sender_info.state" placeholder="请输入State"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="City">
                <el-input v-model="form.sender_info.city" placeholder="请输入City"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Postcode">
                <el-input
                  v-model="form.sender_info.postcode"
                  placeholder="请输入Postcode"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="出发港口 / Origin Port">
                <el-input
                  v-model="form.sender_info.origin_port"
                  placeholder="请输入出发港口 / Origin Port"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="目的港口 / Dest Port">
                <el-input
                  v-model="form.sender_info.dest_port"
                  placeholder="请输入目的港口 / Dest Port"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="Goods currency">
                <el-input
                  v-model="form.sender_info.goods_currency"
                  placeholder="请输入Goods currency"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Shipper code">
                <el-input
                  v-model="form.sender_info.shipper_code"
                  placeholder="请输入Shipper code"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="form.type === 2" class="invoice-title">{{ $t('海运集装箱信息') }}</div>
        <div v-if="form.type === 2">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="集装箱号 / Container Number">
                <el-input
                  v-model="form.container_info.container_number"
                  placeholder="请输入集装箱号 / Container Number"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="集装箱类型 / Container Type">
                <el-input
                  v-model="form.container_info.container_type"
                  placeholder="请输入集装箱类型 / Container Type"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="封条号 / Seal Number">
                <el-input
                  v-model="form.container_info.seal_number"
                  placeholder="请输入封条号 / Seal Number"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="集装箱重量 / Tare Weight">
                <el-input
                  v-model="form.container_info.tare_weight"
                  placeholder="请输入集装箱重量 / Tare Weight"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="集装箱体积 / m3 in container">
                <el-input
                  v-model="form.container_info.m3_in_container"
                  placeholder="请输入集装箱体积 / m3 in container"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="包装类型 / Package type in container">
                <el-input
                  v-model="form.container_info.package_type_in_container"
                  placeholder="请输入包装类型 / Package type in container"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="form.type === 1 || form.type === 2" class="invoice-title">
          {{ $t('其他信息') }}
        </div>
        <div v-if="form.type === 1 || form.type === 2">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="Cyber Vendor Account">
                <el-input
                  v-model="form.extra_info.cyber_vendor_account"
                  placeholder="请输入Cyber Vendor Account"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Vender Customs Code">
                <el-input
                  v-model="form.extra_info.vender_customs_code"
                  placeholder="请输入Vender Customs Code"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="Cyber Importer Account">
                <el-input
                  v-model="form.extra_info.cyber_importer_account"
                  placeholder="请输入Cyber Importer Account"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Importer ABN">
                <el-input
                  v-model="form.extra_info.importer_abn"
                  placeholder="请输入Importer ABN"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="Cyber Supplier Account">
                <el-input
                  v-model="form.extra_info.cyber_supplier_account"
                  placeholder="请输入Cyber Supplier Account"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Importer CAC">
                <el-input
                  v-model="form.extra_info.importer_cac"
                  placeholder="请输入Importer CAC"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="Supplier Customs Code">
                <el-input
                  v-model="form.extra_info.supplier_customs_code"
                  placeholder="请输入Supplier Customs Code"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Pkgs description">
                <el-input
                  v-model="form.extra_info.pkgs_description"
                  placeholder="请输入Pkgs description"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="Reference">
                <el-input
                  v-model="form.extra_info.reference"
                  placeholder="请输入Reference"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Lower value Flag">
                <el-radio-group v-model="form.extra_info.lower_value_flag">
                  <el-radio :label="1000">{{ $t('小于1000') }}</el-radio>
                  <el-radio :label="2000">{{ $t('小于2000') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="Customer Code">
                <el-input
                  v-model="form.extra_info.customer_code"
                  placeholder="请输入Customer Code"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Payment Type">
                <el-input
                  v-model="form.extra_info.payment_type"
                  placeholder="请输入Payment Type"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="SUBMASTER">
                <el-input
                  v-model="form.extra_info.sub_master"
                  placeholder="请输入SUBMASTER"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Marks & Numbers">
                <el-input
                  v-model="form.extra_info.marks_and_numbers"
                  placeholder="请输入Marks & Numbers"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="Load">
                <el-input v-model="form.extra_info.load" placeholder="请输入Load"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Responsible Party">
                <el-input
                  v-model="form.extra_info.responsible_party"
                  placeholder="请输入Responsible Party"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <div class="btn">
      <el-button @click="cancel('form')">{{ $t('取消') }}</el-button>
      <el-button type="primary" :loading="$store.state.btnLoading" @click="onConfirm('form')">{{
        $t('确定')
      }}</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      country: [],
      warehouseData: [],
      id: '',
      showOption: false,
      form: {
        name: '',
        country_id: '',
        warehouse_id: '',
        remark: '',
        mawb: '',
        type: 1,
        air_info: {
          flight: '',
          departure_airport: '',
          arrival_airport: '',
          expected_time_of_departure: '',
          expected_time_of_arrival: '',
          time_of_departure: '',
          time_of_arrival: ''
        },
        sender_info: {
          name: '',
          address: '',
          country: '',
          state: '',
          city: '',
          postcode: '',
          origin_port: '',
          dest_port: '',
          goods_currency: '',
          shipper_code: ''
        },
        extra_info: {
          cyber_vendor_account: '',
          vender_customs_code: '',
          cyber_importer_account: '',
          cyber_supplier_account: '',
          supplier_customs_code: '',
          cyber_customs_code: '',
          reference: '',
          customer_code: '',
          sub_master: '',
          load: '',
          importer_abn: '',
          importer_cac: '',
          pkgs_description: '',
          lower_value_flag: 1000,
          payment_type: '',
          marks_and_numbers: '',
          responsible_party: ''
        },
        ship_info: {
          name: '',
          voyage: '',
          ship_port: '',
          destination_port: '',
          expected_time_of_ship: '',
          expected_time_of_arrival: '',
          time_of_ship: '',
          time_of_arrival: '',
          Lioyds_no: '',
          company_name: ''
        },
        container_info: {
          container_number: '',
          container_type: '',
          seal_number: '',
          tare_weight: '',
          m3_in_container: '',
          package_type_in_container: ''
        }
      },
      rules: {
        country_id: [{ required: true, message: this.$t('请选择目的地'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    init() {
      this.getCountry()
      this.getWarehouse()
      if (this.id) {
        this.getList()
      }
    },
    getList() {
      this.$request.getInvoiceDetail(this.id).then(res => {
        if (res.ret) {
          this.form.name = res.data.name
          this.form.country_id = res.data.country_id
          this.form.warehouse_id = res.data.warehouse_id
          this.form.remark = res.data.remark
          this.form.mawb = res.data.mawb
          this.form.type = res.data.type
          if (res.data.type === 1) {
            if (res.data.air_info) {
              this.form.air_info = res.data.air_info
            }
          } else if (res.data.type === 2) {
            if (res.data.ship_info) {
              this.form.ship_info = res.data.ship_info
            }
            if (res.data.container_info) {
              this.form.container_info = res.data.container_info
            }
          }
          if (res.data.sender_info) {
            this.form.sender_info = res.data.sender_info
          }
          if (res.data.extra_info) {
            this.form.extra_info = res.data.extra_info
          }
        }
      })
    },
    getCountry() {
      this.$request.getCountry().then(res => {
        this.country = res.data
      })
    },
    // 获取仓库数据
    getWarehouse() {
      this.$request.getShipWarehouse().then(res => {
        this.warehouseData = res.data
      })
    },
    onDisplay() {
      this.showOption = !this.showOption
    },
    onConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.id) {
            this.$request
              .createInvoice({
                ...this.form
              })
              .then(res => {
                if (res.ret) {
                  this.$notify({
                    type: 'success',
                    title: this.$t('成功'),
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
            this.$request
              .editInvoice(this.id, {
                ...this.form
              })
              .then(res => {
                if (res.ret) {
                  this.$notify({
                    type: 'success',
                    title: this.$t('成功'),
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
          return false
        }
      })
    },
    cancel(form) {
      this.$refs[form].resetFields()
      this.show = false
    },
    clear(form) {
      this.$refs[form].resetFields()
      this.id = ''
      this.form = {
        name: '',
        country_id: '',
        warehouse_id: '',
        remark: '',
        mawb: '',
        type: 1,
        air_info: {
          flight: '',
          departure_airport: '',
          arrival_airport: '',
          expected_time_of_departure: '',
          expected_time_of_arrival: '',
          time_of_departure: '',
          time_of_arrival: ''
        },
        sender_info: {
          name: '',
          address: '',
          country: '',
          state: '',
          city: '',
          postcode: '',
          origin_port: '',
          dest_port: '',
          goods_currency: '',
          shipper_code: ''
        },
        extra_info: {
          cyber_vendor_account: '',
          vender_customs_code: '',
          cyber_importer_account: '',
          cyber_supplier_account: '',
          supplier_customs_code: '',
          cyber_customs_code: '',
          reference: '',
          customer_code: '',
          sub_master: '',
          load: '',
          importer_abn: '',
          importer_cac: '',
          pkgs_description: '',
          lower_value_flag: 1000,
          payment_type: '',
          marks_and_numbers: '',
          responsible_party: ''
        },
        ship_info: {
          name: '',
          voyage: '',
          ship_port: '',
          destination_port: '',
          expected_time_of_ship: '',
          expected_time_of_arrival: '',
          time_of_ship: '',
          time_of_arrival: '',
          Lioyds_no: '',
          company_name: ''
        },
        container_info: {
          container_number: '',
          container_type: '',
          seal_number: '',
          tare_weight: '',
          m3_in_container: '',
          package_type_in_container: ''
        }
      }
    }
  }
}
</script>

<style lang="scss">
.invoice-container {
  .form-box {
    margin: 20px;
  }
  .btn {
    margin: 30px 200px 30px 0px;
    text-align: right;
  }
  .invoice-title {
    margin: 20px 0;
  }
}
</style>
