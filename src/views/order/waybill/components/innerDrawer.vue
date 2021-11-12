<template>
  <el-drawer
    :title="this.state === 'add' ? $t('新增默认模板') : $t('编辑默认模板')"
    class="inner-container"
    :size="size"
    :visible.sync="editTmpDrawer"
    :append-to-body="true"
    :before-close="close"
    @open="open()"
  >
    <el-form class="inner-form" :model="ruleForm">
      <el-form-item :label="$t('模板名称')" style="margin-left: 20px">
        <el-input
          v-model="ruleForm.name"
          :placeholder="$t('请输入模板名称')"
          class="input-sty"
          style="width: 40%"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('模板备注')" style="margin-left: 20px">
        <el-input
          v-model="ruleForm.remark"
          :placeholder="$t('请输入模板备注')"
          class="input-sty"
          style="width: 40%"
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
          <div>{{ $t('分箱') }}</div>
          <el-checkbox-group v-model="info.warehouseinfo">
            <el-checkbox
              v-for="item in warehouseInfo"
              :disabled="info.outboundinfo.length ? true : false"
              :key="item.id"
              :label="item.id"
              >{{ item.name }}</el-checkbox
            >
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
          <el-checkbox :label="$t('用户汇总数据')" disabled></el-checkbox>
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
      checkList: ['用户汇总数据', '商品明细'],
      orderInfo: [],
      receiveInfo: [],
      warehouseInfo: [], //入库信息
      warehouseSum: [],
      outboundInfo: [], //出库信息
      outboundSum: [],
      payInfo: [],
      shipInfo: [],
      operationInfo: [],
      customerInfo: [],
      feeInfo: [],
      tmpsData: [],
      headerData: [],
      localization: {}
    }
  },
  props: {
    editTmpDrawer: {
      type: Boolean,
      default: false
    },
    tmpCode: {
      type: String,
      required: true
    },
    state: {
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
      this.$emit('receiveInner', false)
    },
    open() {
      if (this.state === 'edit') {
        this.getList()
      }
      this.getTmpData()
    },
    getTmpData() {
      let code = this.tmpCode
      this.$request.getListTemplate(code).then(res => {
        console.log(res)
        this.tmpsData = res.data
        this.localization = res.localization
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
      if (this.state === 'add') {
        param.code = this.tmpCode
      }
      if (this.state === 'add') {
        //新增
        this.$request.addTemplate(param).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('成功'),
              message: res.msg
            })
            this.$emit('receiveInner', false)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        //编辑
        this.$request.editTemplate(this.ids, param).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('成功'),
              message: res.msg
            })
            this.$emit('receiveInner', false)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    getList() {
      this.$request.listDetail(this.ids).then(res => {
        this.ruleForm.name = res.data.name
        this.ruleForm.remark = res.data.remark
        this.headerData = res.data.header
        this.orderInfo = [
          { id: 'user_id', name: '客户ID' },
          { id: 'username', name: '用户名' },
          { id: 'express_line_name', name: '线路名称' },
          { id: 'line_extra_remark', name: '线路额外信息' },
          { id: 'order_sn', name: '订单号' },
          { id: 'agent_name', name: '所属代理' },
          { id: 'clearance_code', name: '清关编码' }
        ]
        this.receiveInfo = [
          { id: 'receiver_name', name: '收货人' },
          { id: 'phone', name: '手机/联系电话' },
          { id: 'country', name: '收货国家' },
          { id: 'city', name: '城市' },
          { id: 'street_door_no', name: '街道/门牌号' },
          { id: 'info_address', name: '详细地址' },
          { id: 'station_name', name: '自提点' },
          { id: 'user_address', name: '客户地址' },
          { id: 'station_address', name: '自提点地址' }
        ]
        // 入库信息
        this.warehouseInfo = [
          { id: 'box_count', name: '分箱箱数' },
          { id: 'box_sn', name: '分箱箱号' },
          { id: 'box_packages', name: '分箱所含包裹' },
          { id: 'express_num', name: '包裹单号' },
          { id: 'package_name', name: '包裹物品名称' },
          { id: 'package_props_name', name: '包裹物品属性' },
          { id: 'package_categories_name', name: '包裹物品类型' },
          { id: 'package_volume', name: '包裹体积 (m³)' },
          { id: 'package_size', name: '包裹尺寸(长宽高)' }
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
          { id: 'packages_count', name: '包裹数' },
          { id: 'package_number', name: '包裹总件数' }
        ]
        // 出库信息
        this.outboundInfo = [
          { id: 'box_count', name: '分箱箱数' },
          { id: 'box_sn', name: '分箱箱号' },
          { id: 'box_packages', name: '分箱所含包裹' },
          { id: 'box_logistics_sn', name: '分箱物流单号' },
          { id: 'box_length', name: `长(${this.localization.length_unit})` },
          { id: 'box_width', name: `宽(${this.localization.length_unit})` },
          { id: 'box_height', name: `高(${this.localization.length_unit})` },
          { id: 'box_weight', name: `分箱称重重量(${this.localization.weight_unit})` },
          { id: 'box_volume_weight', name: `分箱体积重量(${this.localization.weight_unit})` }
        ]
        // 出库信息总计
        this.outboundSum = [
          { id: 'box_payment_weight_sum', name: '出库计费重量' },
          { id: 'box_actual_weight_sum', name: '出库实际重量' },
          { id: 'box_volume_weight_sum', name: '出库体积重量' },
          { id: 'box_volume_sum', name: '出库体积' },
          { id: 'box_length', name: `长(${this.localization.length_unit})` },
          { id: 'box_width', name: `宽(${this.localization.length_unit})` },
          { id: 'box_height', name: `高(${this.localization.length_unit})` }
        ]
        this.payInfo = [
          { id: 'payment_method', name: '付款方式' },
          { id: 'value_added_amount', name: '增值服务费用' },
          { id: 'insurance_fee', name: '保险费用' },
          { id: 'tariff_fee', name: '关税费用' },
          { id: 'line_service_fee', name: '渠道增值服务费用' },
          { id: 'line_rule_fee', name: '渠道规则费用' },
          { id: 'actual_payment_fee', name: '实际费用' },
          { id: 'pay_out_serial_no', name: '支付单号' },
          { id: 'coupon_discount_fee', name: '优惠券抵扣金额' },
          { id: 'point_amount', name: '积分抵扣金额' }
        ]
        this.shipInfo = [
          { id: 'shipment_logistics_sn', name: '物流单号 (头程 - 发货单)' },
          { id: 'order_logistics_sn', name: '物流单号 (订单)' }
        ]
        this.operationInfo = [
          { id: 'created_at', name: '提交时间' },
          { id: 'packed_at', name: '打包（拣货）时间' },
          { id: 'paid_at', name: '支付时间' },
          { id: 'shipped_at', name: '发货时间' },
          { id: 'signed_at', name: '签收时间' }
        ]
        this.customerInfo = [
          { id: 'username', name: '用户名' },
          { id: 'email', name: '邮箱' },
          { id: 'user_profile_address', name: '个人信息地址' }
        ]
        this.headerData.forEach(item => {
          if (item.checked === '1') {
            this.orderInfo.map(ele => {
              if (ele.id === item.id) {
                this.info.order.push(item.id)
              }
            })
            this.receiveInfo.map(ele => {
              if (ele.id === item.id) {
                this.info.receive.push(item.id)
              }
            })
            this.warehouseSum.map(ele => {
              if (ele.id === item.id) {
                this.info.warehouse.push(item.id)
              }
            })
            this.warehouseInfo.map(ele => {
              if (ele.id === item.id) {
                this.info.warehouseinfo.push(item.id)
              }
            })
            this.outboundSum.map(ele => {
              if (ele.id === item.id) {
                this.info.outbound.push(item.id)
              }
            })
            this.outboundInfo.map(ele => {
              if (ele.id === item.id) {
                this.info.outboundinfo.push(item.id)
              }
            })
            this.payInfo.map(ele => {
              if (ele.id === item.id) {
                this.info.pay.push(item.id)
              }
            })
            this.feeInfo.map(ele => {
              if (ele.id === item.id) {
                this.info.fee.push(item.id)
              }
            })
            this.shipInfo.map(ele => {
              if (ele.id === item.id) {
                this.info.ship.push(item.id)
              }
            })
            this.operationInfo.map(ele => {
              if (ele.id === item.id) {
                this.info.operation.push(item.id)
              }
            })
            this.customerInfo.map(ele => {
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
.inner-container {
  font-size: 14px;
  .el-drawer.rtl {
    overflow: auto;
  }
}
</style>
