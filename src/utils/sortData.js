export default [
  {
    id: 'user_id',
    name: '客户ID',
    checked: true
  },
  {
    id: 'user_name',
    name: '用户名',
    width: '100',
    checked: true
  },
  {
    id: 'order_sn',
    name: '订单号',
    width: '230',
    checked: true
  },
  {
    id: 'is_saved', // 1
    name: '状态',
    checked: true
  },
  {
    id: 'express_line',
    name: '线路名称',
    width: '160',
    checked: true
  },
  {
    id: 'receiver_name',
    name: '收货人',
    checked: true
  },
  {
    id: 'country_name',
    name: '收货国家地区',
    checked: true
  },
  {
    id: 'package_count',
    name: '包裹数与件数',
    checked: true
  },
  {
    id: 'declare_value',
    name: '申报价值',
    checked: true
  },
  {
    id: 'agent',
    name: '所属代理',
    checked: true
  },
  {
    id: 'sale_name',
    name: '所属销售',
    checked: true
  },
  {
    id: 'customer_name',
    name: '所属客服',
    checked: true
  },
  {
    id: 'weight', // 1: 预计重量 其他: 实际重量
    name: '',
    checked: true
  },
  {
    id: 'fee', // 1: 预计费用 其他: 实际费用
    name: '',
    checked: true
  },
  {
    id: 'payment_type_name', // 3,4,5
    name: '支付方式',
    checked: true
  },
  {
    id: 'logistics_company', // 3,4,5,6
    name: '头程物流信息',
    checked: true
  },
  {
    id: 'logistics_sn', // 3,4,5,6
    name: '二程物流信息',
    checked: true
  },
  {
    id: 'coupon_amount', // 3,4,5
    name: '抵用券金额',
    checked: true
  },
  {
    id: 'updated_at', // 1,2,3,4
    name: '',
    width: '160',
    checked: true
  },
  {
    id: 'packed_at', // 2,3
    name: '拣货时间',
    width: '160',
    checked: true
  },
  {
    id: 'signed_at', // 5
    name: '签收时间',
    width: '160',
    checked: true
  },
  {
    id: 'shipment_sn', // 3,4,5
    name: '所属发货单',
    checked: true
  }
]
