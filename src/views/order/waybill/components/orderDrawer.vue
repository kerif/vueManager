<template>
  <el-drawer
    :title="$t('编辑默认模板')"
    class="purchase-container"
    :size="size"
    :visible.sync="editOrderTmpDrawer"
    :append-to-body="true"
    :before-close="close"
    @opened="open()"
  >
    <el-form class="inner-form" :model="ruleForm">
      <el-form-item :label="$t('模板名称')" style="margin-left: 20px">
        <el-input
          v-model="ruleForm.name"
          :placeholder="$t('请输入模板名称')"
          class="input-sty"
          style="width: 40%"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('模板备注')" style="margin-left: 20px">
        <el-input
          v-model="ruleForm.remark"
          :placeholder="$t('请输入模板备注')"
          class="input-sty"
          style="width: 40%"
          clearable
        ></el-input>
      </el-form-item>
      <el-collapse v-model="activeNames" style="margin: 20px">
        <el-collapse-item :title="$t('订单信息')" name="1">
          <el-checkbox-group v-model="info.order">
            <el-checkbox
              v-for="item in orderInfo"
              :key="item.id"
              :label="item.id"
              :disabled="
                item.id === 'user_id' ||
                item.id === 'username' ||
                item.id === 'express_line_name' ||
                item.id === 'order_sn'
              "
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-collapse-item>
        <el-collapse-item :title="$t('收件信息')" name="2">
          <el-checkbox-group v-model="info.receive">
            <el-checkbox v-for="item in receiveInfo" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
        <el-collapse-item :title="$t('入库信息')" name="3">
          <div>{{ $t('总计') }}</div>
          <el-checkbox-group v-model="info.warehouse">
            <el-checkbox v-for="item in warehouseSum" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
        <el-collapse-item :title="$t('出库信息')" name="4">
          <div>{{ $t('总计') }}</div>
          <el-checkbox-group v-model="info.outbound">
            <el-checkbox v-for="item in outboundSum" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
          <div>{{ $t('分箱') }}</div>
          <el-checkbox-group v-model="info.outboundinfo">
            <el-checkbox
              v-for="item in outboundInfo"
              :disabled="info.warehouseinfo.length ? true : false"
              :key="item.id"
              :label="item.id"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-collapse-item>
        <el-collapse-item :title="$t('支付信息')" name="5">
          <el-checkbox-group v-model="info.pay">
            <el-checkbox v-for="item in payInfo" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
          <div>{{ $t('其他费用明细') }}</div>
          <el-checkbox-group v-model="info.fee">
            <el-checkbox v-for="item in feeInfo" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
        <el-collapse-item :title="$t('发货信息')" name="6">
          <el-checkbox-group v-model="info.ship">
            <el-checkbox v-for="item in shipInfo" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
        <el-collapse-item :title="$t('操作信息')" name="7">
          <el-checkbox-group v-model="info.operation">
            <el-checkbox v-for="item in operationInfo" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
        <el-collapse-item :title="$t('其他客户信息')" name="8">
          <el-checkbox-group v-model="info.customer">
            <el-checkbox v-for="item in customerInfo" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
      </el-collapse>
      <el-form-item style="margin-left: 20px" :label="$t('同时导出附表')">
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="$t('商品明细')" disabled></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div style="float: right">
        <el-button @click="confirm" style="background-color: #3540a5; color: #fff">{{
          $t('保存模板')
        }}</el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        remark: ''
      },
      info: {
        order: ['user_id', 'username', 'express_line_name', 'order_sn'],
        receive: [],
        warehouse: [],
        warehouseinfo: [],
        outbound: [],
        outboundinfo: [],
        operation: [],
        pay: [],
        ship: [],
        customer: [],
        fee: []
      },
      size: '30%',
      code: '',
      activeNames: ['1'],
      order: '',
      checkList: ['商品明细'],
      orderInfo: [],
      receiveInfo: [],
      warehouseSum: [],
      outboundInfo: [], //出库信息
      outboundSum: [],
      payInfo: [],
      shipInfo: [],
      feeInfo: [],
      operationInfo: [],
      customerInfo: [],
      tmpsData: [],
      headerData: [],
      localization: {}
    }
  },
  props: {
    editOrderTmpDrawer: {
      type: Boolean,
      default: false
    },
    tmpCode: {
      type: String,
      required: true
    },
    ids: {
      type: [Number, String],
      required: true
    }
  },
  created() {
    // this.getTmpData()
  },
  methods: {
    close() {
      this.$emit('orderInner', false)
    },
    open() {
      this.getTmpData()
      if (this.ids) {
        this.getList()
      }
    },
    getTmpData() {
      let code = this.tmpCode
      this.$request.getListTemplate(code).then(res => {
        this.tmpsData = res.data
        this.localization = res.localization
        this.orderInfo = [
          { id: 'user_id', name: this.$t('客户ID') },
          { id: 'username', name: this.$t('用户名') },
          { id: 'express_line_name', name: this.$t('线路名称') },
          { id: 'line_extra_remark', name: this.$t('线路额外信息') },
          { id: 'order_sn', name: this.$t('订单号') },
          { id: 'agent_name', name: this.$t('所属代理') },
          { id: 'user_customer', name: this.$t('所属客服') },
          { id: 'user_sale', name: this.$t('所属销售') },
          { id: 'clearance_code', name: this.$t('清关编码') },
          { id: 'personal_code', name: this.$t('个人通关码') },
          { id: 'group_buying_status', name: this.$t('拼团状态') }
        ]
        this.receiveInfo = [
          { id: 'receiver_name', name: this.$t('收货人') },
          { id: 'phone', name: this.$t('手机/联系电话') },
          { id: 'country', name: this.$t('收货国家') },
          { id: 'province', name: this.$t('省份') },
          { id: 'city', name: this.$t('城市') },
          { id: 'postcode', name: this.$t('邮编') },
          { id: 'street_door_no', name: this.$t('街道/门牌号') },
          { id: 'street', name: this.$t('街道') },
          { id: 'door_no', name: this.$t('门牌号') },
          { id: 'info_address', name: this.$t('详细地址') },
          { id: 'station_name', name: this.$t('自提点') },
          { id: 'user_address', name: this.$t('客户地址') },
          { id: 'station_address', name: this.$t('自提点地址') },
          { id: 'address', name: this.$t('附加地址') },
          { id: 'remark', name: this.$t('备注') },
          { id: 'address_type', name: this.$t('收货方式') },
          { id: 'address_email', name: this.$t('地址邮箱') },
          { id: 'address_wechat_id', name: this.$t('地址微信号') }
        ]
        // 入库信息 总计
        this.warehouseSum = [
          { id: 'package_value_sum', name: `总申报价值(${this.localization.currency_unit})` },
          {
            id: 'package_actual_weight_sum',
            name: `入库实际重量(${this.localization.weight_unit})`
          },
          {
            id: 'package_volume_weight_sum',
            name: `入库体积重量(${this.localization.weight_unit})`
          },
          { id: 'packages_count', name: this.$t('包裹数') },
          { id: 'package_number', name: this.$t('包裹总件数') }
        ]
        // 出库信息
        this.outboundInfo = [{ id: 'box_count', name: this.$t('分箱箱数') }]
        // 出库信息总计
        this.outboundSum = [
          { id: 'box_payment_weight_sum', name: this.$t('出库计费重量') },
          { id: 'box_actual_weight_sum', name: this.$t('出库实际重量') },
          { id: 'box_volume_weight_sum', name: this.$t('出库体积重量') },
          { id: 'box_volume_sum', name: this.$t('出库体积') },
          { id: 'length', name: `长(${this.localization.length_unit})` },
          { id: 'width', name: `宽(${this.localization.length_unit})` },
          { id: 'height', name: `高(${this.localization.length_unit})` }
        ]
        this.payInfo = [
          { id: 'payment_method', name: this.$t('付款方式') },
          { id: 'actual_payment_fee', name: this.$t('实际费用') },
          { id: 'pay_out_serial_no', name: this.$t('支付单号') },
          { id: 'coupon_discount_fee', name: this.$t('优惠券抵扣金额') },
          { id: 'point_amount', name: this.$t('积分抵扣金额') },
          { id: 'discount_payment_fee', name: `实际支付金额(${this.localization.currency_unit})` },
          { id: 'payment_fee', name: `预计费用(${this.localization.currency_unit})` },
          { id: 'coupon_name', name: this.$t('优惠券名称') }
        ]
        this.feeInfo = [
          { id: 'value_added_amount', name: this.$t('增值服务费用') },
          { id: 'insurance_fee', name: this.$t('保险费用') },
          { id: 'tariff_fee', name: this.$t('关税费用') },
          { id: 'line_service_fee', name: this.$t('渠道增值服务费用') },
          { id: 'line_rule_fee', name: this.$t('渠道规则费用') },
          { id: 'freight_fee', name: this.$t('运费') }
        ]
        this.shipInfo = [
          { id: 'shipment_logistics_sn', name: this.$t('物流单号 (头程 - 发货单)') },
          { id: 'order_logistics_sn', name: this.$t('物流单号 (订单)') },
          { id: 'shipment_sn', name: this.$t('所属发货单') },
          { id: 'shipment_name', name: this.$t('发货单名称') }
        ]
        this.operationInfo = [
          { id: 'created_at', name: this.$t('提交时间') },
          { id: 'packed_at', name: this.$t('打包（拣货）时间') },
          { id: 'paid_at', name: this.$t('支付时间') },
          { id: 'shipped_at', name: this.$t('发货时间') },
          { id: 'signed_at', name: this.$t('签收时间') }
        ]
        this.customerInfo = [
          { id: 'email', name: this.$t('邮箱') },
          { id: 'user_profile_address', name: this.$t('个人信息地址') },
          { id: 'profile_wechat_id', name: this.$t('个人信息微信号') },
          { id: 'wechat_id', name: this.$t('微信号') },
          { id: 'id_card', name: this.$t('身份证号') }
        ]
      })
    },
    confirm() {
      this.tmpsData.forEach(item => {
        item.checked = 0
        if (this.info.order.includes(item.id)) {
          item.checked = 1
        }
        if (this.info.receive.includes(item.id)) {
          item.checked = 1
        }
        if (this.info.warehouse.includes(item.id)) {
          item.checked = 1
        }
        if (this.info.outbound.includes(item.id)) {
          item.checked = 1
        }
        if (this.info.pay.includes(item.id)) {
          item.checked = 1
        }
        if (this.info.fee.includes(item.id)) {
          item.checked = 1
        }
        if (this.info.ship.includes(item.id)) {
          item.checked = 1
        }
        if (this.info.operation.includes(item.id)) {
          item.checked = 1
        }
        if (this.info.customer.includes(item.id)) {
          item.checked = 1
        }
        if (this.info.warehouseinfo.includes(item.id)) {
          item.checked = 1
        }
        if (this.info.outboundinfo.includes(item.id)) {
          item.checked = 1
        }
      })
      let param = {
        name: this.ruleForm.name,
        remark: this.ruleForm.remark,
        header: this.tmpsData
      }
      //编辑
      this.$request.editTemplate(this.ids, param).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('成功'),
            message: res.msg
          })
          this.$emit('purchaseInner', false)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    getList() {
      this.$request.listDetail(this.ids).then(res => {
        this.ruleForm.name = res.data.name
        this.ruleForm.remark = res.data.remark
        this.headerData = res.data.header
        this.orderInfo = [
          { id: 'user_id', name: this.$t('客户ID') },
          { id: 'username', name: this.$t('用户名') },
          { id: 'express_line_name', name: this.$t('线路名称') },
          { id: 'line_extra_remark', name: this.$t('线路额外信息') },
          { id: 'order_sn', name: this.$t('订单号') },
          { id: 'agent_name', name: this.$t('所属代理') },
          { id: 'user_customer', name: this.$t('所属客服') },
          { id: 'user_sale', name: this.$t('所属销售') },
          { id: 'clearance_code', name: this.$t('清关编码') },
          { id: 'personal_code', name: this.$t('个人通关码') },
          { id: 'group_buying_status', name: this.$t('拼团状态') }
        ]
        this.receiveInfo = [
          { id: 'receiver_name', name: this.$t('收货人') },
          { id: 'phone', name: this.$t('手机/联系电话') },
          { id: 'country', name: this.$t('收货国家') },
          { id: 'province', name: this.$t('省份') },
          { id: 'city', name: this.$t('城市') },
          { id: 'postcode', name: this.$t('邮编') },
          { id: 'street_door_no', name: this.$t('街道/门牌号') },
          { id: 'street', name: this.$t('街道') },
          { id: 'door_no', name: this.$t('门牌号') },
          { id: 'info_address', name: this.$t('详细地址') },
          { id: 'station_name', name: this.$t('自提点') },
          { id: 'user_address', name: this.$t('客户地址') },
          { id: 'station_address', name: this.$t('自提点地址') },
          { id: 'address', name: this.$t('附加地址') },
          { id: 'remark', name: this.$t('备注') },
          { id: 'address_type', name: this.$t('收货方式') },
          { id: 'address_email', name: this.$t('地址邮箱') },
          { id: 'address_wechat_id', name: this.$t('地址微信号') }
        ]
        // 入库信息 总计
        this.warehouseSum = [
          { id: 'package_value_sum', name: `总申报价值(${this.localization.currency_unit})` },
          {
            id: 'package_actual_weight_sum',
            name: `入库实际重量(${this.localization.weight_unit})`
          },
          {
            id: 'package_volume_weight_sum',
            name: `入库体积重量(${this.localization.weight_unit})`
          },
          { id: 'packages_count', name: this.$t('包裹数') },
          { id: 'package_number', name: this.$t('包裹总件数') }
        ]
        // 出库信息
        this.outboundInfo = [{ id: 'box_count', name: this.$t('分箱箱数') }]
        // 出库信息总计
        this.outboundSum = [
          { id: 'box_payment_weight_sum', name: this.$t('出库计费重量') },
          { id: 'box_actual_weight_sum', name: this.$t('出库实际重量') },
          { id: 'box_volume_weight_sum', name: this.$t('出库体积重量') },
          { id: 'box_volume_sum', name: this.$t('出库体积') },
          { id: 'length', name: `长(${this.localization.length_unit})` },
          { id: 'width', name: `宽(${this.localization.length_unit})` },
          { id: 'height', name: `高(${this.localization.length_unit})` }
        ]
        this.payInfo = [
          { id: 'payment_method', name: this.$t('付款方式') },
          { id: 'actual_payment_fee', name: this.$t('实际费用') },
          { id: 'pay_out_serial_no', name: this.$t('支付单号') },
          { id: 'coupon_discount_fee', name: this.$t('优惠券抵扣金额') },
          { id: 'point_amount', name: this.$t('积分抵扣金额') },
          { id: 'discount_payment_fee', name: `实际支付金额(${this.localization.currency_unit})` },
          { id: 'payment_fee', name: `预计费用(${this.localization.currency_unit})` },
          { id: 'coupon_name', name: this.$t('优惠券名称') }
        ]
        this.feeInfo = [
          { id: 'value_added_amount', name: this.$t('增值服务费用') },
          { id: 'insurance_fee', name: this.$t('保险费用') },
          { id: 'tariff_fee', name: this.$t('关税费用') },
          { id: 'line_service_fee', name: this.$t('渠道增值服务费用') },
          { id: 'line_rule_fee', name: this.$t('渠道规则费用') },
          { id: 'freight_fee', name: this.$t('运费') }
        ]
        this.shipInfo = [
          { id: 'shipment_logistics_sn', name: this.$t('物流单号 (头程 - 发货单)') },
          { id: 'order_logistics_sn', name: this.$t('物流单号 (订单)') },
          { id: 'shipment_sn', name: this.$t('所属发货单') },
          { id: 'shipment_name', name: this.$t('发货单名称') }
        ]
        this.operationInfo = [
          { id: 'created_at', name: this.$t('提交时间') },
          { id: 'packed_at', name: this.$t('打包（拣货）时间') },
          { id: 'paid_at', name: this.$t('支付时间') },
          { id: 'shipped_at', name: this.$t('发货时间') },
          { id: 'signed_at', name: this.$t('签收时间') }
        ]
        this.customerInfo = [
          { id: 'email', name: this.$t('邮箱') },
          { id: 'user_profile_address', name: this.$t('个人信息地址') },
          { id: 'profile_wechat_id', name: this.$t('个人信息微信号') },
          { id: 'wechat_id', name: this.$t('微信号') },
          { id: 'id_card', name: this.$t('身份证号') }
        ]
        this.headerData.forEach(item => {
          if (item.checked === '1') {
            this.orderInfo.forEach(ele => {
              if (ele.id === item.id) {
                this.info.order.push(item.id)
              }
            })
            this.receiveInfo.forEach(ele => {
              if (ele.id === item.id) {
                this.info.receive.push(item.id)
              }
            })
            this.warehouseSum.forEach(ele => {
              if (ele.id === item.id) {
                this.info.warehouse.push(item.id)
              }
            })
            this.outboundSum.forEach(ele => {
              if (ele.id === item.id) {
                this.info.outbound.push(item.id)
              }
            })
            this.outboundInfo.forEach(ele => {
              if (ele.id === item.id) {
                this.info.outboundinfo.push(item.id)
              }
            })
            this.payInfo.forEach(ele => {
              if (ele.id === item.id) {
                this.info.pay.push(item.id)
              }
            })
            this.feeInfo.forEach(ele => {
              if (ele.id === item.id) {
                this.info.fee.push(item.id)
              }
            })
            this.shipInfo.forEach(ele => {
              if (ele.id === item.id) {
                this.info.ship.push(item.id)
              }
            })
            this.operationInfo.forEach(ele => {
              if (ele.id === item.id) {
                this.info.operation.push(item.id)
              }
            })
            this.customerInfo.forEach(ele => {
              if (ele.id === item.id) {
                this.info.customer.push(item.id)
              }
            })
          }
        })
      })
    },
    clear() {
      this.ruleForm.name = ''
      this.ruleForm.remark = ''
      this.info.order = ['user_id', 'username', 'express_line_name', 'order_sn']
      this.info.receive = []
      this.info.warehouse = []
      this.info.outbound = []
      this.info.warehouseinfo = []
      this.info.outboundinfo = []
      this.info.operation = []
      this.info.pay = []
      this.info.ship = []
      this.info.customer = []
      this.info.fee = []
    }
  }
}
</script>

<style lang="scss">
.purchase-container {
  font-size: 14px;
  .el-drawer.rtl {
    overflow: auto;
  }
  .el-icon-close:before {
    color: black;
  }
}
</style>
