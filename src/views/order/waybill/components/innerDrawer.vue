<template>
  <el-drawer
    :title="this.status === 'add' ? $t('新增默认模板') : $t('编辑默认模板')"
    class="inner-container"
    :size="size"
    :visible.sync="editTmpDrawer"
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
      <el-collapse v-model="activeNames" @change="handleChange" style="margin: 20px">
        <el-collapse-item :title="$t('订单信息')" name="1">
          <el-checkbox-group v-model="info.order">
            <el-checkbox
              v-for="item in orderInfo"
              :key="item.id"
              :label="item.id"
              :disabled="item.id.includes('user_id', 'username', 'express_line_name')"
              @click="select"
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
            <el-checkbox v-for="item in warehouseInfo" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
          <div>{{ $t('分箱') }}</div>
          <el-checkbox-group v-model="info.warehouse">
            <el-checkbox v-for="item in warehouseInfo" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
        <el-collapse-item :title="$t('出库信息')" name="4">
          <div>{{ $t('总计') }}</div>
          <el-checkbox-group v-model="info.outbound">
            <el-checkbox v-for="item in outboundInfo" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
          <div>{{ $t('分箱') }}</div>
          <el-checkbox-group v-model="info.outbound">
            <el-checkbox v-for="item in outboundInfo" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
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
          <el-checkbox :label="$t('禁用')" disabled></el-checkbox>
          <el-checkbox :label="$t('选中且禁用')" disabled></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div style="float: right">
        <el-button @click="confirm">{{ $t('保存模板') }}</el-button>
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
        order: ['user_id', 'username', 'express_line_name'],
        receive: [],
        warehouse: [],
        outbound: [],
        operation: [],
        pay: [],
        ship: [],
        customer: [],
        fee: []
      },
      size: '50%',
      code: '',
      activeNames: ['1'],
      checkList: ['禁用', '选中且禁用'],
      order: 1,
      orderInfo: [],
      receiveInfo: [],
      warehouseInfo: [], //入库信息
      outboundInfo: [], //出库信息
      payInfo: [],
      shipInfo: [],
      operationInfo: [],
      customerInfo: [],
      feeInfo: [],
      tmpsData: []
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
    status: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  created() {
    this.getTmpData()
  },
  methods: {
    open() {},
    close() {
      this.$emit('receiveInner', false)
    },
    handleChange(val) {
      console.log(val)
    },
    getTmpData() {
      let code = this.tmpCode
      this.$request.getListTemplate(code).then(res => {
        console.log(res)
        this.tmpsData = res.data
        this.orderInfo.push(
          { id: 'user_id', name: '客户ID' },
          { id: 'username', name: '用户名' },
          { id: 'express_line_name', name: '线路名称' },
          { id: 'order_sn', name: '订单号' },
          { id: 'agent_name', name: '所属代理' },
          { id: 'clearance_code', name: '清关编码' }
        )
        this.receiveInfo.push(
          { id: 'receiver_name', name: '收货人' },
          { id: 'phone', name: '手机/联系电话' },
          { id: 'country', name: '收货国家' },
          { id: 'city', name: '城市' },
          { id: 'street_door_no', name: '街道/门牌号' },
          { id: 'info_address', name: '详细地址' },
          { id: 'station_name', name: '自提点' },
          { id: 'station_address', name: '自提点地址' }
        )
        this.warehouseInfo.push(
          { id: 'packages_count', name: '包裹数' },
          { id: 'package_value_sum', name: '申报价值' }
        )
        this.outboundInfo.push({ id: 'box_logistics_sn', name: '分箱物流单号' })
        this.payInfo.push(
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
        )
        this.shipInfo.push({ id: 'shipment_logistics_sn', name: '物流单号 (头程 - 发货单)' })

        this.operationInfo.push(
          { id: 'created_at', name: '提交时间' },
          { id: 'packed_at', name: '打包（拣货）时间' },
          { id: 'paid_at', name: '支付时间' },
          { id: 'shipped_at', name: '发货时间' },
          { id: 'signed_at', name: '签收时间' }
        )
        // this.customerInfo.push()
        // console.log(this.customerInfo)
      })
    },
    confirm() {
      this.tmpsData.forEach(item => {
        this.info.order.forEach(ele => {
          if (item.id === ele || (item.id !== ele && item.checked)) {
            item.checked = 1
          } else {
            item.checked = 0
          }
        })
      })
      let param = {
        name: this.ruleForm.name,
        header: this.tmpsData
      }
      if (this.status === 'add') {
        param.code = this.tmpCode
      } else {
        param.id = this.id
      }
      if (this.status === 'add') {
        //新增
        this.$request.addTemplate(param).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('成功'),
              message: res.msg
            })
            this.editTmpDrawer = false
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        //编辑
        this.$request.editTemplate(param).then(res => {
          console.log(res)
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('成功'),
              message: res.msg
            })
            this.editTmpDrawer = false
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    select() {},
    clear() {
      this.ruleForm.name = ''
      this.ruleForm.remark = ''
    }
  }
}
</script>

<style lang="scss">
.inner-container {
  font-size: 14px;
  .el-drawer.rtl {
    overflow: scroll;
  }
}
</style>
