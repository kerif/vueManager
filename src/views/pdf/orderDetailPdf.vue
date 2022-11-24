<template>
  <div class="pageA4">
    <div class="font-size font-bold">
      <span class="time-text">2022/8/20 15:33</span>
      <span class="time-text text-right">xxxcxcxcxcxcxcxcxcxxxxxxxxxxxxx</span>
    </div>
    <div style="margin-top: 50px">
      <div class="font-size font-bold spacing">
        <span class="time-text">Invoice To:</span>
        <span class="time-text text-left">收货人:</span>
      </div>
      <div class="normal spacing">
        <span class="time-text text-left">用户编号: {{ orderInfo.user_id }}</span>
        <span class="time-text text-left"
          >姓名/电话: {{ orderInfo.user_name }},{{
            orderInfo.address && orderInfo.address.phone
          }}</span
        >
      </div>
      <div class="normal spacing">
        <span class="time-text text-left"
          >邮箱: {{ orderInfo.address && orderInfo.address.email }}</span
        >
        <span class="time-text text-left"
          >支付/收获方式:
          {{ orderInfo.payment && orderInfo.payment.payment_type_name }} 送货上门</span
        >
      </div>
      <div class="normal spacing">
        <span class="time-text text-left"
          >联系电话: {{ orderInfo.address && orderInfo.address.timezone }} -
          {{ orderInfo.address && orderInfo.address.phone }}</span
        >
        <span class="time-text text-left" v-if="orderInfo.address"
          >收货地址: {{ orderInfo.address.country_name }} {{ orderInfo.address.province }}
          {{ orderInfo.address.city }} {{ orderInfo.address.street }}
          {{ orderInfo.address.door_no }}
        </span>
      </div>
    </div>
    <div class="font-size font-bold" style="margin: 20px 0">Your Invoice</div>
    <div>
      <div style="margin-bottom: 20px; padding: 8px 0; border-top: 1px solid #ccc">
        <span class="index">序号</span>
        <span class="express-company font-bold">快递公司</span>
        <span style="display: inline-block; width: 12%; font-size: 14px; font-weight: bold"
          >集包单号</span
        >
        <span class="data-space font-bold">快递单号</span>
        <span class="data-space font-bold">货仓编号</span>
        <span class="data-space font-bold">入库时间</span>
        <span class="data-space font-bold">货物品名</span>
        <span class="data-space font-bold">体积重</span>
        <span class="data-space font-bold">实重</span>
        <span class="data-space font-bold">备注</span>
      </div>
      <div
        v-for="(ele, index) in orderInfo.packages"
        :key="ele.id"
        style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding: 5px 0"
      >
        <span class="index">{{ index + 1 }}</span>
        <span class="express-company">{{ ele.express_company && ele.express_company.name }}</span>
        <span style="display: inline-block; width: 12%; font-size: 14px"></span>
        <span class="data-space">{{ ele.express_num }}</span>
        <span class="data-space"></span>
        <span class="data-space">{{ ele.in_storage_at }}</span>
        <span class="data-space">{{ ele.brand_name }}</span>
        <span class="data-space"></span>
        <span class="data-space"></span>
        <span class="data-space">{{ ele.remark }}</span>
      </div>
      <div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding: 5px 0">
        <span class="time-text">实际重量</span>
        <span class="time-text text-right"></span>
      </div>
      <div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding: 5px 0">
        <span class="time-text">收费重量</span>
        <span class="time-text text-right"></span>
      </div>
    </div>
    <div class="font-size font-bold" style="margin: 20px 0">Totals:</div>
    <div class="spacing">
      <span class="fee-info"
        >积分抵扣: {{ orderInfo.payment && orderInfo.payment.point_amount }}</span
      ><span class="fee-info"
        >抵用券减免: {{ orderInfo.payment && orderInfo.payment.coupon_amount }}</span
      ><span class="fee-info"
        >渠道服务费: {{ orderInfo.payment && orderInfo.payment.line_service_fee }}</span
      ><span class="fee-info"
        >渠道规则费:{{ orderInfo.payment && orderInfo.payment.line_rule_fee }}
      </span>
    </div>
    <div class="spacing">
      <span class="fee-info"
        >增值服务费: {{ orderInfo.payment && orderInfo.payment.value_added_amount }}
      </span>
      <span class="fee-info">关税费用: {{ orderInfo.payment && orderInfo.payment.tariff_fee }}</span
      ><span class="fee-info"
        >保险费用:{{ orderInfo.payment && orderInfo.payment.insurance_fee }} </span
      ><span class="fee-info"
        >包裹增值服务:{{ orderInfo.payment && orderInfo.payment.package_service_fee }}
      </span>
    </div>
    <div style="margin-bottom: 20px; padding: 5px 0">
      <span class="time-text">订单运费</span>
      <span class="time-text text-right">{{
        orderInfo.payment && orderInfo.payment.freight_amount
      }}</span>
    </div>
    <div style="margin-bottom: 20px; padding: 5px 0">
      <span class="time-text">费用总计</span>
      <span class="time-text text-right">{{
        orderInfo.payment && orderInfo.payment.order_amount
      }}</span>
    </div>
    <div style="margin-bottom: 20px; padding: 5px 0">
      <span class="time-text">实付费用</span>
      <span class="time-text text-right">{{
        orderInfo.payment && orderInfo.payment.pay_amount
      }}</span>
    </div>
    <div class="spacing text-right" style="margin-right: 120px">客户签收:</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderInfo: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.getOrderDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          console.log(res.data, 136)
          this.orderInfo = res.data
        }
      })
    }
  }
}
</script>

<style>
body {
  background-color: #fff !important;
}
.pageA4 {
  position: relative;
  page-break-after: always;
  margin: 0 auto;
  padding: 5px 0;
  width: 21cm;
  /* height: 29.5cm; */
  overflow: hidden;
  font-size: 15px;
  padding: 10px 20px;
  color: #333;
}
.font-bold {
  font-weight: bold;
}
.font-size {
  font-size: 18px;
}
.normal {
  font-size: 16px;
  font-weight: 700;
}
.spacing {
  margin-bottom: 20px;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.time-text {
  width: 50%;
  display: inline-block;
}
.fee-info {
  display: inline-block;
  width: 25%;
}
.index {
  display: inline-block;
  width: 5%;
  font-size: 14px;
  font-weight: bold;
}
.express-company {
  display: inline-block;
  width: 13%;
  font-size: 14px;
}
.data-space {
  display: inline-block;
  width: 10%;
  font-size: 14px;
}
</style>
