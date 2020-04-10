const loadonDemand = path => {
  return () => import(/* webpackChunkName: "chunk" */ `@/views/${path}`)
}
const Layout = loadonDemand('layout/layouttop')
const LayoutContainer = loadonDemand('layout/layoutcontainer')
const Panel = loadonDemand('home/panel')
// 修改密码
const ResetPassword = loadonDemand('home/reset-password')
// 员工列表
const StaffList = loadonDemand('staff/stafflist')
// 员工组列表
const StaffGroupList = loadonDemand('staff/staffgrouplist')
// 添加、编辑员工
const StaffEdit = loadonDemand('staff/staffaddedit')
// 员工组修改权限
const modifyPre = loadonDemand('staff/modify_permissions')
// 客户列表
const VipList = loadonDemand('vip/vip/viplist')
// 客户组列表
const VipGroupList = loadonDemand('vip/vipgroup/vipgrouplist')
// 配置 代理申请管理
const application = loadonDemand('vip/application')
// 客户地址
const VipAddressList = loadonDemand('vip/vipaddress/vipaddresslist')
// 财务 流水记录
const Transaction = loadonDemand('finance/Transaction')
// 财务 转账支付流水详情
const TransactionDetails = loadonDemand('finance/financeDetails')
// 财务 微信支付流水详情
const TransactionWechat = loadonDemand('finance/wechatPay')
// 财务 充值记录
const Recharge = loadonDemand('finance/recharge')
// 财务 审核跟详情页面
const RechargeDetails = loadonDemand('finance/rechargeDetails')
// 配置 路线列表
const LineList = loadonDemand('config/line/LineList')
// 配置 添加、修改路线
const LineAddEdit = loadonDemand('config/line/LineAddEdit')
// 配置 路线 其余费用
const othersCost = loadonDemand('config/line/otherCost')
// 配置 添加、修改icon
const IconAdd = loadonDemand('config/line/IconAdd')
// 配置 仓库地址
const WareHouse = loadonDemand('config/warehouse/warehouse')
// 配置 添加、修改仓库地址
const WareHouseEdit = loadonDemand('config/warehouse/warehouseAddEdit')
// 配置 仓库地址 仓位管理
const positionWarehouse = loadonDemand('config/warehouse/Position')
// 配置 下单须知列表
const NoticeList = loadonDemand('config/notice/NoticeList')
// 配置 添加、修改下单须知
const NoticeAddEdit = loadonDemand('config/notice/NoticeAddEdit')
// 配置 代理管理
const agentManagement = loadonDemand('config/agent/Agent')
// 配置 代理管理 提现申请
const Withdrawal = loadonDemand('config/agent/withdrawal')
// 配置 代理管理 提现申请 详情
const wdDetail = loadonDemand('config/agent/withdrawalDetail')
// 修改、添加代理
const AddEditAgent = loadonDemand('config/agent/AddEditAgent')
// 成交记录
const transactionRecord = loadonDemand('config/agent/record')
// 配置 小程序配置
const AppletConfiguration = loadonDemand('config/Applet/applet')
// 配置 更多配置
const PaymentManagement = loadonDemand('config/Payment/payment')
// 配置 更多配置 商品分类管理 风险提示
const EditSick = loadonDemand('config/Payment/sickTips')
// 更多配置 修改或新增邮件模版
const AddEditEmail = loadonDemand('config/Payment/emailAddEdit')
// 包裹快速入库
const Storage = loadonDemand('station/storage')
// 发货单
const Ship = loadonDemand('station/ship')
// 发货单 详情
const ShipDetails = loadonDemand('station/shipDetails')
// 拣货日志
const Picking = loadonDemand('station/picking')
// 订单 预报包裹列表
const OrderList = loadonDemand('order/order/OrderList')
// 订单 无人认领包裹
const noOwner = loadonDemand('order/noOwner/noOwner')
// 订单 运单列表
const WaybillList = loadonDemand('order/waybill/WaybillList')
// 订单 运单详情
const Billdetails = loadonDemand('order/waybill/billDetails')
// 订单 运单打包
// 订单 运单审核
const reviewDetails = loadonDemand('order/waybill/review')
// 订单 编辑打包数据
const editPacked = loadonDemand('order/waybill/editBillPacked')
const Billpacked = loadonDemand('order/waybill/billPacked')
// 营销管理 新用户福利
const Newuser = loadonDemand('marketing/new/new-user')
// 营销管理 抵用券管理
const Voucher = loadonDemand('marketing/Voucher/voucher')
// 营销管理 记录
const Notes = loadonDemand('marketing/Voucher/notes')
// 营销管理 添加
const addVoucher = loadonDemand('marketing/Voucher/addVoucher')
// 营销管理 视频管理
const videoManagement = loadonDemand('marketing/video/videoMana')
// 营销管理 渠道管理
const channelManagement = loadonDemand('marketing/channel/channelList')
// 营销管理 统计报表
const reportList = loadonDemand('marketing/report/report')
// 营销管理 新增或编辑渠道管理
const AddEditChannel = loadonDemand('marketing/channel/AddEditChannel')
// 营销管理 引流列表
const drainageList = loadonDemand('marketing/channel/drainageList')
// 客服中心 投诉建议列表
const SuggestList = loadonDemand('customer/suggest/Suggest')
// 客服中心 评价管理
const Evaluation = loadonDemand('customer/evaluation')
// 客服中心 公告管理
const PublicList = loadonDemand('customer/public')
// 公告新增或编辑
const AddEditPublic = loadonDemand('customer/publicAddEdit')
// 语言包
const LanguageSupport = loadonDemand('language/support')
export default [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        redirect: 'home/panel',
        component: LayoutContainer,
        icon: 'icon-ico_home',
        id: 100,
        children: [
          {
            path: '/home/panel',
            name: 'panel',
            icon: '',
            component: Panel,
            id: 101,
            meta: {
              level: 2,
              group: '首页',
              name: '控制面板'
            }
          },
          {
            path: '/home/reset-password',
            name: 'reset-password',
            component: ResetPassword,
            id: 102,
            meta: {
              level: 2,
              group: '首页',
              name: '修改密码'
            }
          }
        ]
      },
      {
        path: 'staff',
        component: LayoutContainer,
        icon: 'icon-ico_rencai',
        id: 200,
        children: [
          {
            path: '/staff/stafflist',
            name: 'stafflist',
            component: StaffList,
            id: 201,
            meta: {
              level: 2,
              group: '员工',
              name: '员工列表'
            }
          },
          {
            path: '/staff/staffadd',
            name: 'staffadd',
            component: StaffEdit,
            id: 201,
            meta: {
              level: 3,
              group: '员工',
              name: '添加员工',
              parent: '/staff/stafflist'
            }
          },
          {
            path: '/staff/staffEdit/:state/:id',
            name: 'staffEdit',
            component: StaffEdit,
            id: 201,
            meta: {
              level: 3,
              group: '员工',
              name: '修改资料',
              parent: '/staff/stafflist'
            }
          },
          {
            path: '/staff/staffgrouplist',
            name: 'staffgrouplist',
            component: StaffGroupList,
            id: 202,
            meta: {
              level: 2,
              group: '员工',
              name: '员工组列表'
            }
          },
          {
            path: '/staff/modify_permissions/:id',
            name: 'modifyPermissions',
            component: modifyPre,
            id: 202,
            meta: {
              level: 3,
              group: '员工',
              name: '修改权限',
              parent: '/staff/stafflist'
            }
          }
        ]
      },
      {
        path: 'vip',
        component: LayoutContainer,
        icon: 'icon-gaiicon-',
        id: 300,
        children: [
          {
            path: '/vip/viplist',
            name: 'viplist',
            component: VipList,
            id: 301,
            meta: {
              group: '客户',
              level: 2,
              name: '客户'
            }
          },
          {
            path: '/vip/vipgrouplist',
            name: 'vipgrouplist',
            component: VipGroupList,
            id: 302,
            meta: {
              level: 2,
              group: '客户',
              name: '客户组'
            }
          },
          {
            path: '/vip/vipaddress',
            name: 'vipaddress',
            component: VipAddressList,
            id: 303,
            meta: {
              level: 2,
              group: '客户',
              name: '客户地址'
            }
          },
          {
            path: '/vip/agent',
            name: 'agent',
            component: agentManagement,
            id: 304,
            meta: {
              level: 2,
              group: '客户',
              name: '代理管理'
            }
          },
          {
            path: '/vip/add/agent',
            name: 'addAgent',
            component: AddEditAgent,
            id: 304,
            meta: {
              level: 3,
              group: '客户',
              name: '添加代理',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/edit/agent',
            name: 'editAgent',
            component: AddEditAgent,
            id: 304,
            meta: {
              level: 3,
              group: '客户',
              name: '修改代理',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/withdrawal/:id',
            name: 'Withdrawal',
            component: Withdrawal,
            id: 304,
            meta: {
              level: 3,
              group: '客户',
              name: '佣金提现管理',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/WithdrawalDetail/:userId/:id/:status',
            name: 'wdDetail',
            component: wdDetail,
            id: 304,
            meta: {
              level: 3,
              group: '客户',
              name: '佣金提现详情',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/reviewWithdrawal/:userId/:id/:state',
            name: 'wdReviewDetail',
            component: wdDetail,
            id: 304,
            meta: {
              level: 3,
              group: '客户',
              name: '佣金提现审核',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/agent/record',
            name: 'record',
            component: transactionRecord,
            id: 304,
            meta: {
              level: 3,
              group: '客户',
              name: '成交记录',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/application',
            name: 'application',
            component: application,
            id: 305,
            meta: {
              level: 2,
              group: '客户',
              name: '代理申请管理'
            }
          }
        ]
      },
      {
        path: 'order',
        component: LayoutContainer,
        icon: 'icon-ico_yuebao',
        id: 400,
        children: [
          {
            path: '/order/orderlist',
            component: OrderList,
            name: 'orderlist',
            id: 401,
            meta: {
              level: 2,
              group: '订单',
              name: '预报包裹列表'
            }
          },
          {
            path: '/order/waybill_list',
            component: WaybillList,
            name: 'wayBillList',
            id: 402,
            meta: {
              level: 2,
              group: '订单',
              name: '订单列表'
            }
          },
          {
            path: '/order/noOwner',
            component: noOwner,
            name: 'noOwner',
            id: 403,
            meta: {
              level: 2,
              group: '订单',
              name: '无人认领包裹'
            }
          },
          {
            path: '/order/billDetails/:id/:activeName',
            name: 'billDetails',
            component: Billdetails,
            id: 402,
            meta: {
              level: 3,
              group: '订单',
              name: '详情',
              parent: '/order/waybill_list'
            }
          },
          {
            path: '/order/review',
            name: 'review',
            component: reviewDetails,
            id: 402,
            meta: {
              level: 3,
              group: '订单',
              name: '审核',
              parent: '/order/waybill_list'
            }
          },
          {
            path: '/order/editBillPacked/:id/:activeName',
            name: 'editPacked',
            component: editPacked,
            id: 402,
            meta: {
              level: 3,
              group: '订单',
              name: '编辑',
              parent: '/order/waybill_list'
            }
          },
          {
            path: '/order/billPacked/:id/:order_sn',
            name: 'billPacked',
            component: Billpacked,
            id: 402,
            meta: {
              level: 3,
              group: '订单',
              name: '打包处理',
              parent: '/order/waybill_list'
            }
          }
        ]
      },
      {
        path: 'station',
        component: LayoutContainer,
        icon: 'icon-gongbao',
        id: 500,
        children: [
          {
            path: '/station/storage',
            name: 'storageContainer',
            component: Storage,
            id: 501,
            meta: {
              level: 2,
              group: '货站',
              name: '包裹快速入库'
            }
          },
          {
            path: '/station/storage/:id',
            name: 'editStorage',
            component: Storage,
            id: 501,
            meta: {
              level: 3,
              group: '货站',
              name: '包裹快速入库',
              parent: '/station/storage'
            }
          },
          {
            path: '/station/edit/storage/:id/:state',
            name: 'editWarehouse',
            component: Storage,
            id: 501,
            meta: {
              level: 3,
              group: '货站',
              name: '包裹快速入库',
              parent: '/station/storage'
            }
          },
          {
            path: '/station/ship',
            name: 'shipContainer',
            component: Ship,
            id: 502,
            meta: {
              level: 2,
              group: '货站',
              name: '发货单'
            }
          },
          {
            path: '/station/ship/details',
            name: 'shipDetails',
            component: ShipDetails,
            id: 502,
            meta: {
              level: 3,
              group: '货站',
              name: '详情',
              parent: '/station/ship'
            }
          },
          {
            path: '/station/picking',
            name: 'pickingContainer',
            component: Picking,
            id: 503,
            meta: {
              level: 2,
              group: '货站',
              name: '拣货日志'
            }
          }
        ]
      },
      {
        path: 'config',
        component: LayoutContainer,
        icon: 'icon-ico_zhuizon',
        id: 600,
        children: [
          {
            path: '/config/line/linelist',
            name: 'linelist',
            component: LineList,
            id: 601,
            meta: {
              group: '配置',
              level: 2,
              name: '路线'
            }
          },
          {
            path: '/config/line/lineadd',
            component: LineAddEdit,
            name: 'lineadd',
            id: 601,
            meta: {
              group: '配置',
              level: 3,
              name: '添加路线',
              parent: '/config/line/linelist'
            }
          },
          {
            path: '/config/icon/add',
            component: IconAdd,
            name: 'IconAdd',
            id: 601,
            meta: {
              group: '配置',
              level: 3,
              name: '路线icon',
              parent: '/config/line/linelist'
            }
          },
          {
            path: '/config/line/lineedit/:state/:id',
            component: LineAddEdit,
            name: 'lineedit',
            id: 601,
            meta: {
              group: '配置',
              level: 3,
              name: '修改路线',
              parent: '/config/line/linelist'
            }
          },
          {
            path: '/config/line/otherCost/:id',
            component: othersCost,
            name: 'othersCost',
            id: 601,
            meta: {
              group: '配置',
              level: 3,
              name: '其余费用',
              parent: '/config/line/linelist'
            }
          },
          {
            path: '/config/warehouse',
            component: WareHouse,
            name: 'warehouse',
            id: 602,
            meta: {
              group: '配置',
              level: 2,
              name: '仓库地址配置'
            }
          },
          {
            path: '/config/warehouse/add',
            component: WareHouseEdit,
            name: 'warehouseAdd',
            id: 602,
            meta: {
              group: '配置',
              level: 3,
              name: '添加仓库',
              parent: '/config/warehouse'
            }
          },
          {
            path: '/config/warehouse/position/:id/:warehouseName',
            component: positionWarehouse,
            name: 'position',
            id: 602,
            meta: {
              group: '配置',
              level: 3,
              name: '货位管理',
              parent: '/config/warehouse'
            }
          },
          {
            path: '/config/warehouse/edit/:id',
            component: WareHouseEdit,
            name: 'warehouseEdit',
            id: 602,
            meta: {
              group: '配置',
              level: 3,
              name: '修改仓库',
              parent: '/config/warehouse'
            }
          },
          {
            path: '/config/notice',
            component: NoticeList,
            name: 'noticelist',
            id: 603,
            meta: {
              group: '配置',
              level: 2,
              name: '下单须知'
            }
          },
          {
            path: '/config/notice/add',
            component: NoticeAddEdit,
            name: 'noticeadd',
            id: 603,
            meta: {
              group: '配置',
              level: 3,
              name: '新增下单须知',
              parent: '/config/notice'
            }
          },
          {
            path: '/config/notice/edit/:id',
            component: NoticeAddEdit,
            name: 'noticeEdit',
            id: 603,
            meta: {
              group: '配置',
              level: 3,
              name: '修改下单须知',
              parent: '/config/notice'
            }
          },
          {
            path: '/config/applet',
            name: 'appletManagement',
            component: AppletConfiguration,
            id: 604,
            meta: {
              level: 2,
              group: '配置',
              name: '小程序配置'
            }
          },
          {
            path: '/config/payment',
            name: 'payment',
            component: PaymentManagement,
            id: 605,
            meta: {
              level: 2,
              group: '配置',
              name: '更多配置'
            }
          },
          {
            path: '/config/payment/sickTips/:id',
            name: 'sickTips',
            component: EditSick,
            id: 605,
            meta: {
              level: 3,
              group: '配置',
              name: '风险提示',
              parent: '/config/payment'
            }
          },
          {
            path: '/config/payment/add',
            component: AddEditEmail,
            name: 'emailAdd',
            id: 605,
            meta: {
              group: '配置',
              level: 3,
              name: '新增邮件模版',
              parent: '/config/payment'
            }
          },
          {
            path: '/config/payment/edit/:id',
            component: AddEditEmail,
            name: 'emailEdit',
            id: 605,
            meta: {
              group: '配置',
              level: 3,
              name: '修改邮件模版',
              parent: '/config/payment'
            }
          }
        ]
      },
      {
        path: 'finance',
        component: LayoutContainer,
        icon: 'icon-feiyongduoweifenxi',
        id: 700,
        children: [
          {
            path: '/finance/transaction',
            name: 'transaction',
            component: Transaction,
            id: 701,
            meta: {
              group: '财务',
              level: 2,
              name: '流水记录'
            }
          },
          {
            path: '/finance/details',
            name: 'TransactionDetails',
            component: TransactionDetails,
            id: 701,
            meta: {
              group: '财务',
              level: 3,
              name: '转账支付详情',
              parent: '/finance/transaction'
            }
          },
          {
            path: '/finance/wechatPay',
            name: 'wechatPay',
            component: TransactionWechat,
            id: 701,
            meta: {
              group: '财务',
              level: 3,
              name: '在线支付详情',
              parent: '/finance/transaction'
            }
          },
          {
            path: '/finance/recharge',
            name: 'recharge',
            component: Recharge,
            id: 702,
            meta: {
              group: '财务',
              level: 2,
              name: '充值记录'
            }
          },
          {
            path: '/finance/rechargeDetails/:id',
            name: 'rechargeDetails',
            component: RechargeDetails,
            id: 702,
            meta: {
              group: '财务',
              level: 3,
              name: '审核详情',
              parent: '/finance/recharge'
            }
          },
          {
            path: '/finance/rechargeReview/:id/:state',
            name: 'rechargeReview',
            component: RechargeDetails,
            id: 702,
            meta: {
              group: '财务',
              level: 3,
              name: '充值审核',
              parent: '/finance/recharge'
            }
          }
        ]
      },
      {
        path: 'marketing',
        component: LayoutContainer,
        icon: 'icon-ico_yuce',
        id: 800,
        children: [
          {
            path: '/marketing/new',
            name: 'newUser',
            component: Newuser,
            id: 801,
            meta: {
              level: 2,
              group: '营销管理',
              name: '新用户福利'
            }
          },
          {
            path: '/marketing/voucher',
            name: 'voucher',
            component: Voucher,
            id: 802,
            meta: {
              level: 2,
              group: '营销管理',
              name: '抵用券管理'
            }
          },
          {
            path: '/marketing/voucher/notes',
            name: 'notes',
            component: Notes,
            id: 802,
            meta: {
              level: 3,
              group: '营销管理',
              name: '投放记录',
              parent: '/marketing/voucher'
            }
          },
          {
            path: '/marketing/voucher/add/voucher',
            name: 'addVoucher',
            component: addVoucher,
            id: 802,
            meta: {
              level: 3,
              group: '营销管理',
              name: '添加抵用券',
              parent: '/marketing/voucher'
            }
          },
          {
            path: '/marketing/videoManagement',
            name: 'video',
            component: videoManagement,
            id: 803,
            meta: {
              level: 2,
              group: '营销管理',
              name: '视频管理'
            }
          },
          {
            path: '/marketing/channelManagement',
            name: 'channel',
            component: channelManagement,
            id: 804,
            meta: {
              level: 2,
              group: '营销管理',
              name: '渠道管理'
            }
          },
          {
            path: '/marketing/add/channel',
            name: 'addChannel',
            component: AddEditChannel,
            id: 804,
            meta: {
              level: 3,
              group: '营销管理',
              name: '新增渠道管理',
              parent: '/marketing/channelManagement'
            }
          },
          {
            path: '/marketing/edit/channel/:id',
            name: 'editChannel',
            component: AddEditChannel,
            id: 804,
            meta: {
              level: 3,
              group: '营销管理',
              name: '修改渠道管理',
              parent: '/marketing/channelManagement'
            }
          },
          {
            path: '/marketing/drainage/:id',
            name: 'drainageList',
            component: drainageList,
            id: 804,
            meta: {
              level: 3,
              group: '营销管理',
              name: '引流列表',
              parent: '/marketing/channelManagement'
            }
          },
          {
            path: '/marketing/report',
            name: 'reportList',
            component: reportList,
            id: 805,
            meta: {
              level: 2,
              group: '营销管理',
              name: '统计报表'
            }
          }
        ]
      },
      {
        path: 'customer',
        component: LayoutContainer,
        icon: 'icon-kefu',
        id: 900,
        children: [
          {
            path: '/customer/suggest',
            name: 'suggestlist',
            component: SuggestList,
            id: 901,
            meta: {
              level: 2,
              group: '客服中心',
              name: '投诉建议'
            }
          },
          {
            path: '/customer/evaluation',
            name: 'evaluation',
            component: Evaluation,
            id: 902,
            meta: {
              level: 2,
              group: '客服中心',
              name: '评价管理'
            }
          },
          {
            path: '/customer/Public',
            name: 'Public',
            component: PublicList,
            id: 903,
            meta: {
              level: 2,
              group: '客服中心',
              name: '公告管理'
            }
          },
          {
            path: '/customer/Public/Add',
            name: 'addPublic',
            component: AddEditPublic,
            id: 903,
            meta: {
              level: 3,
              group: '客服中心',
              name: '新增公告',
              parent: '/customer/Public'
            }
          },
          {
            path: '/customer/Public/Edit/:id',
            name: 'editPublic',
            component: AddEditPublic,
            id: 903,
            meta: {
              level: 3,
              group: '客服中心',
              name: '编辑公告',
              parent: '/customer/Public'
            }
          }
        ]
      },
      {
        path: 'language',
        component: LayoutContainer,
        icon: 'icon-B',
        id: 1000,
        children: [
          {
            path: '/language/support',
            name: 'language',
            component: LanguageSupport,
            id: 1001,
            meta: {
              level: 2,
              group: '语言包',
              name: '支持语言'
            }
          }
        ]
      }
    ]
  }
]
