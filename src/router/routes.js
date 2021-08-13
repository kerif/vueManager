const loadonDemand = path => {
  return () => import(/* webpackChunkName: "chunk" */ `@/views/${path}`)
}
const Layout = loadonDemand('layout/layouttop')
const LayoutContainer = loadonDemand('layout/layoutcontainer')
const Panel = loadonDemand('home/panel')
const homeNotice = loadonDemand('home/notice')

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
// 客户 代理申请管理
const application = loadonDemand('vip/application')
// 沉睡提醒
const sleepReminder = loadonDemand('vip/sleepReminder')
// 客户 客户概览
const customerEcharts = loadonDemand('vip/customer/echarts')
// 客户地址
const VipAddressList = loadonDemand('vip/vipaddress/vipaddresslist')
// 财务 流水记录
const Transaction = loadonDemand('finance/Transaction')
// 财务 成长值财务
const GrowthFinance = loadonDemand('finance/growthFinance')
// 财务 成长值财务详情
const GrowthFinanceDetails = loadonDemand('finance/growthFinanceDetails')
// 财务 转账支付流水详情
const TransactionDetails = loadonDemand('finance/financeDetails')
// 财务 微信支付流水详情
const TransactionWechat = loadonDemand('finance/wechatPay')
// 财务 充值记录
const Recharge = loadonDemand('finance/recharge')
// 财务 余额扣款
const balance = loadonDemand('finance/balance')
// 财务 审核跟详情页面
const RechargeDetails = loadonDemand('finance/rechargeDetails')
// 财务 财务概览
const financeCharts = loadonDemand('finance/financeCharts')
// 财务 订单财务审核
const orderReview = loadonDemand('finance/orderReview')
// 财务 财务订单审核 审核
const reviewFinance = loadonDemand('finance/reviewFinance')
// 财务 自提点佣金结算
const selfSettlement = loadonDemand('finance/selfSettlement')
// 财务 自提点佣金结算 结算记录
const recordDetails = loadonDemand('finance/recordDetails')
// 配置 路线列表
const LineList = loadonDemand('config/line/LineList')
// 新路线
const Line = loadonDemand('config/line/Line')
// 新路线 销售价管理
const salesMana = loadonDemand('config/line/salesMana')
// 分区
const partitionList = loadonDemand('config/line/partition')
// 渠道
const channelLine = loadonDemand('config/line/channel')
// 渠道 新增
const channelLineAdd = loadonDemand('config/line/channelSet')
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
// 配置 文章管理列表
const NoticeList = loadonDemand('config/notice/NoticeList')
// 配置 添加、修改文章管理
const NoticeAddEdit = loadonDemand('config/notice/NoticeAddEdit')
// 配置 文章管理 语言配置
const noticeLang = loadonDemand('config/notice/noticeLang')
// 配置 代理管理
const agentManagement = loadonDemand('config/agent/Agent')
// 配置 代理管理 提现申请
const Withdrawal = loadonDemand('config/agent/withdrawal')
// 配置 代理管理 提现申请 详情
const wdDetail = loadonDemand('config/agent/withdrawalDetail')
// 修改、添加代理
const AddEditAgent = loadonDemand('config/agent/AddEditAgent')
// 客户 计佣模版配置
const agentTemplate = loadonDemand('config/agent/agentTemplate')
// 成交记录
const transactionRecord = loadonDemand('config/agent/record')
// 配置 小程序配置
// const AppletConfiguration = loadonDemand('config/Applet/applet')
// 配置 自提点配置
const SinceList = loadonDemand('config/point/since')
// 配置 新增或编辑自提点
const sinceAddEdit = loadonDemand('config/point/sinceAddEdit')
// 配置 自提点配置 计佣方式配置
const commissionSet = loadonDemand('config/point/commission')
// 配置 更多配置
// const PaymentManagement = loadonDemand('config/Payment/payment')
// 配置 更多配置
const configurationMore = loadonDemand('config/Payment/configuration')
// 配置 更多配置 短信服务配置
const smsServices = loadonDemand('config/Payment/smsService')
// 配置 更多配置 物流查询服务
const trackingService = loadonDemand('config/Payment/trackingService')
// 配置 更多配置 商品分类管理 风险提示
const EditSick = loadonDemand('config/Payment/sickTips')
// 更多配置 修改或新增邮件模版
const AddEditEmail = loadonDemand('config/Payment/emailAddEdit')
// 更多配置 邮件模版 新增或修改语言
const emailLang = loadonDemand('config/Payment/emailLang')
// 更多配置 商品分类模版 新增或修改语言
const categoriesLang = loadonDemand('config/Payment/categoriesLang')
// 更多配置 邮件配置
const mailConfigure = loadonDemand('config/Payment/mailConfigure')
// 包裹快速入库
const Storage = loadonDemand('station/storage')
// 自提点 转运包裹管理
const PackageManagement = loadonDemand('pick/packageMana')
// 自提点 仓位管理
const pickLocation = loadonDemand('pick/pickWarehouse')
// 自提点 自提点概览
const pickEcharts = loadonDemand('pick/pickEcharts')
// 发货单
const Ship = loadonDemand('station/ship')
// 发货单 详情
const ShipDetails = loadonDemand('station/shipDetails')
// 拣货日志
const Picking = loadonDemand('station/picking')
// 仓库自提
// const warehouseSelf = loadonDemand('station/warehouseSelf')
// 仓库自提 订单详情
const selfDetails = loadonDemand('station/warehouseDetails')
// 自定义物流
const logisticsList = loadonDemand('station/logistics')
// 物流查询
const tracking = loadonDemand('station/tracking')
// 申请集包
const applyPackage = loadonDemand('station/applyPackage')
// 申请打包合箱
const boxing = loadonDemand('station/boxing')
// 自定义物流 导入数据
const importLogistics = loadonDemand('station/importLogistics')
// 订单 预报包裹列表
const OrderList = loadonDemand('order/order/OrderList')
// 订单 预报包裹列表 详情
const oderDetails = loadonDemand('order/order/orderDetails')
// 订单 预报包裹列表 批量入库
const ImportOrder = loadonDemand('order/order/importOrder')
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
// 订单 运费查询
const Freight = loadonDemand('order/freight/freight')
// 订单 运费查询 路线详情
const freightDetail = loadonDemand('order/freight/freightDetail')
// 订单 包裹订单概览
const orderEcharts = loadonDemand('order/echarts/orderEcharts')
// 营销管理 会员体制
const System = loadonDemand('marketing/member/system')
// 营销管理 用户福利
const Newuser = loadonDemand('marketing/new/new-user')
// 营销管理 用户福利 新增
const addNew = loadonDemand('marketing/new/addNew')
// 营销管理 用户福利 管理
const managementNew = loadonDemand('marketing/new/management')
// 营销管理  下单返券
const rebate = loadonDemand('marketing/rebate')
// 营销管理 抵用券管理
const Voucher = loadonDemand('marketing/Voucher/voucher')
// 营销管理 记录
const Notes = loadonDemand('marketing/Voucher/notes')
// 营销管理 添加
const addVoucher = loadonDemand('marketing/Voucher/addVoucher')
// 营销管理 视频管理
// const videoManagement = loadonDemand('marketing/video/videoMana')
// 营销管理 渠道管理
const channelManagement = loadonDemand('marketing/channel/channelList')
// 营销管理 统计报表
const reportList = loadonDemand('marketing/report/report')
// 营销管理 广告图管理
const advertising = loadonDemand('marketing/advertising')
// 营销管理 轮播图管理
const bannerList = loadonDemand('marketing/banner/bannerList')
// 营销管理 广告图管理 海报管理
const poster = loadonDemand('marketing/poster')
// 营销管理 广告图管理 页面广告管理
const imageSet = loadonDemand('marketing/imageSet')
// const imageSet2 = loadonDemand('marketing/imageSet2')
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
// 公告管理 语言详情
const publicLang = loadonDemand('customer/publicLang')
// 语言包
const LanguageSupport = loadonDemand('language/support')
// 字符串翻译
const stringTranslate = loadonDemand('language/string')
// 官网管理 栏目管理
const website = loadonDemand('website/column')
// 官网管理 新增 编辑 栏目管理
const addEditWebsite = loadonDemand('website/addEditColumn')
// 官网管理 新增 编辑 一级栏目管理 如果是存在二级菜单的情况下
const editFirstWeb = loadonDemand('website/firstColumn')
// 官网管理 单页管理
const singlePage = loadonDemand('website/singlePage')
// 官网管理 新增  编辑 单页管理
const addEditSingle = loadonDemand('website/addEditSingle')
// 单页管理 多语言修改
const pageLang = loadonDemand('website/pageLang')
// 区块管理 多语言修改
const blockLang = loadonDemand('website/blockLang')
// 区块管理 其余的语言修改
const blockOthersLang = loadonDemand('website/othersLang')
// 区块管理 编辑图片、颜色、位置
const editOthersBlocks = loadonDemand('website/editOthers')
// 区块管理 编辑两张图片
const editImages = loadonDemand('website/imagesEdit')
// 区块管理 编辑链接
const editLink = loadonDemand('website/linkEdit')
// 区块管理 编辑字符串
const editString = loadonDemand('website/editString')
// 官网管理 区块管理
const blockManagement = loadonDemand('website/block')
// 区块管理 编辑
const blockEdit = loadonDemand('website/blockAddEdit')
// 区块管理 编辑
const otherWebsite = loadonDemand('website/otherWebsite')
// 区块管理 编辑语言
const urlLangEdit = loadonDemand('website/urlLang')
// 区块管理 图片编辑语言
const imgLangEdit = loadonDemand('website/imgLang')
// 拼团管理
const groupMana = loadonDemand('group/groupMana')
// 团长管理
const leaderMana = loadonDemand('group/groupConfigure')
// 拼团配置
const groupSet = loadonDemand('group/groupSet')
// 内容管理
const contentMana = loadonDemand('group/contentMana')
// 内容编辑
const editContent = loadonDemand('group/editContent')
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
            path: '/home/notice/:id',
            name: 'systemNotice',
            component: homeNotice,
            id: 101,
            meta: {
              level: 3,
              group: '首页',
              name: '更新日志',
              parent: '/home/panel'
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
              parent: '/staff/staffgrouplist'
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
            path: '/vip/agent/template',
            name: 'agentTemplate',
            component: agentTemplate,
            id: 304,
            meta: {
              level: 3,
              group: '客户',
              name: '计佣模版配置',
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
          },
          {
            path: '/vip/sleepReminder',
            name: 'sleepReminder',
            component: sleepReminder,
            id: 307,
            meta: {
              level: 2,
              group: '客户',
              name: '未活跃提醒'
            }
          },
          {
            path: '/vip/customer/echarts',
            name: 'customerEcharts',
            component: customerEcharts,
            id: 306,
            meta: {
              level: 2,
              group: '客户',
              name: '客户概览'
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
            path: '/order/orderlist/importOrder',
            component: ImportOrder,
            name: 'ImportOrder',
            id: 401,
            meta: {
              level: 3,
              group: '订单',
              name: '批量入库',
              parent: '/order/orderlist'
            }
          },
          {
            path: '/order/orderlist/details/:id',
            component: oderDetails,
            name: 'oderDetails',
            id: 401,
            meta: {
              level: 3,
              group: '订单',
              name: '详情',
              parent: '/order/orderlist'
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
            path: '/order/freight',
            name: 'freight',
            component: Freight,
            id: 404,
            meta: {
              level: 2,
              group: '订单',
              name: '运费查询'
            }
          },
          {
            path: '/order/freight/detail/:id',
            name: 'freightDetail',
            component: freightDetail,
            id: 404,
            meta: {
              level: 3,
              group: '订单',
              name: '详情',
              parent: '/order/freight'
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
            path: '/order/editBillPacked/:id/:activeName/:parent/:lineId',
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
            path: '/order/billPacked/:id/:order_sn/:activeName/:parent/:lineId',
            name: 'billPacked',
            component: Billpacked,
            id: 402,
            meta: {
              level: 3,
              group: '订单',
              name: '打包处理',
              parent: '/order/waybill_list'
            }
          },
          {
            path: '/order/orderEcharts',
            name: 'orderEcharts',
            component: orderEcharts,
            id: 405,
            meta: {
              level: 2,
              group: '订单',
              name: '包裹订单概览'
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
          },
          // {
          //   path: '/station/warehouseSelf',
          //   name: 'warehouseSelf',
          //   component: warehouseSelf,
          //   id: 504,
          //   meta: {
          //     level: 2,
          //     group: '货站',
          //     name: '仓库自提'
          //   }
          // },
          {
            path: '/station/self/details/:id/:status',
            name: 'selfDetails',
            component: selfDetails,
            id: 504,
            meta: {
              level: 3,
              group: '货站',
              name: '详情',
              parent: '/station/warehouseSelf'
            }
          },
          {
            path: '/station/tracking',
            name: 'tracking',
            component: tracking,
            id: 506,
            meta: {
              level: 2,
              group: '货站',
              name: '物流查询'
            }
          },
          {
            path: '/station/tracking/logistics',
            name: 'logistics',
            component: logisticsList,
            id: 506,
            meta: {
              level: 3,
              group: '货站',
              name: '自定义物流轨迹',
              parent: '/station/tracking'
            }
          },
          {
            path: '/station/import/logistics',
            name: 'importLogistics',
            component: importLogistics,
            id: 505,
            meta: {
              level: 3,
              group: '货站',
              name: '批量上传',
              parent: '/station/logistics'
            }
          },
          {
            path: '/station/applyPackage',
            name: 'applyPackage',
            component: applyPackage,
            id: 507,
            meta: {
              level: 2,
              group: '货站',
              name: '包裹快速合箱'
            }
          },
          {
            path: '/station/boxing',
            name: 'boxing',
            component: boxing,
            id: 507,
            meta: {
              level: 3,
              group: '货站',
              name: '打包合箱',
              parent: '/station/applyPackage'
            }
          }
        ]
      },
      {
        path: 'pick',
        component: LayoutContainer,
        icon: 'icon-gongbao',
        id: 1200,
        children: [
          {
            path: '/pick/packageManagement',
            name: 'packageMana',
            component: PackageManagement,
            id: 1201,
            meta: {
              level: 2,
              group: '自提点',
              name: '转运包裹管理'
            }
          },
          {
            path: '/pick/packageManagement/pickLocation/:XStationId',
            name: 'pickLocation',
            component: pickLocation,
            id: 1201,
            meta: {
              level: 3,
              group: '自提点',
              name: '仓位管理',
              parent: '/pick/packageManagement'
            }
          },
          {
            path: '/pick/pickEcharts',
            name: 'pickEcharts',
            component: pickEcharts,
            id: 1202,
            meta: {
              level: 2,
              group: '自提点',
              name: '自提点概览'
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
            path: '/config/line',
            name: 'Line',
            component: Line,
            id: 601,
            meta: {
              group: '配置',
              level: 2,
              name: '路线2'
            }
          },
          {
            path: '/config/line/sales',
            name: 'salesMana',
            component: salesMana,
            id: 601,
            meta: {
              group: '配置',
              level: 3,
              name: '销售价管理',
              parent: '/config/line'
            }
          },
          {
            path: '/config/line/partition',
            name: 'partition',
            component: partitionList,
            id: 601,
            meta: {
              group: '配置',
              level: 3,
              name: '路线2',
              parent: '/config/line'
            }
          },
          {
            path: '/config/line/channel/edit/:id',
            name: 'channelLine',
            component: channelLine,
            id: 601,
            meta: {
              group: '配置',
              level: 3,
              name: '渠道',
              parent: '/config/line'
            }
          },
          {
            path: '/config/line/channel/add',
            name: 'channelLineAdd',
            component: channelLineAdd,
            id: 601,
            meta: {
              group: '配置',
              level: 3,
              name: '新增',
              parent: '/config/line'
            }
          },
          {
            path: '/config/line/channel/edit/:id',
            name: 'channelLineEdit',
            component: channelLineAdd,
            id: 601,
            meta: {
              group: '配置',
              level: 3,
              name: '编辑',
              parent: '/config/line'
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
              name: '文章管理'
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
              name: '新增文章管理',
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
              name: '修改文章管理',
              parent: '/config/notice'
            }
          },
          {
            path: '/config/notice/lang/add/:line/:lang/:transCode',
            component: noticeLang,
            name: 'noticeLangAdd',
            id: 603,
            meta: {
              group: '配置',
              level: 3,
              name: '文章管理的翻译内容',
              parent: '/config/notice'
            }
          },
          // {
          //   path: '/config/applet',
          //   name: 'appletManagement',
          //   component: AppletConfiguration,
          //   id: 604,
          //   meta: {
          //     level: 2,
          //     group: '配置',
          //     name: '小程序配置'
          //   }
          // },
          {
            path: '/config/point',
            name: 'point',
            component: SinceList,
            id: 605,
            meta: {
              level: 2,
              group: '配置',
              name: '自提点配置'
            }
          },
          {
            path: '/config/point/add',
            name: 'pointAdd',
            component: sinceAddEdit,
            id: 605,
            meta: {
              level: 3,
              group: '配置',
              name: '添加自提点配置',
              parent: '/config/point'
            }
          },
          {
            path: '/config/point/edit/:id',
            name: 'pointEdit',
            component: sinceAddEdit,
            id: 605,
            meta: {
              level: 3,
              group: '配置',
              name: '编辑自提点配置',
              parent: '/config/point'
            }
          },
          {
            path: '/config/point/commissionSet',
            name: 'commissionSet',
            component: commissionSet,
            id: 605,
            meta: {
              level: 3,
              group: '配置',
              name: '计佣方式配置',
              parent: '/config/point'
            }
          },
          // {
          //   path: '/config/payment',
          //   name: 'payment',
          //   component: PaymentManagement,
          //   id: 606,
          //   meta: {
          //     level: 2,
          //     group: '配置',
          //     name: '更多配置'
          //   }
          // },
          {
            path: '/config/mail-configure',
            name: 'mailConfigur',
            component: mailConfigure,
            id: 606,
            meta: {
              level: 3,
              group: '配置',
              name: '邮件通知配置',
              parent: '/config/configuration-more'
            }
          },
          {
            path: '/config/configuration-more',
            name: 'configurationMore',
            component: configurationMore,
            id: 606,
            meta: {
              level: 2,
              group: '配置',
              name: '更多配置'
            }
          },
          {
            path: '/config/sms-services',
            name: 'smsServices',
            component: smsServices,
            id: 606,
            meta: {
              level: 3,
              group: '配置',
              name: '短信服务',
              parent: '/config/configuration-more'
            }
          },
          {
            path: '/config/tracking-services',
            name: 'trackingService',
            component: trackingService,
            id: 606,
            meta: {
              level: 3,
              group: '配置',
              name: '物流查询服务',
              parent: '/config/configuration-more'
            }
          },
          {
            path: '/config/payment/emailLang/add/:line/:lang/:transCode',
            component: emailLang,
            name: 'emailLangAdd',
            id: 606,
            meta: {
              group: '配置',
              level: 3,
              name: '邮件模版的翻译内容',
              parent: '/config/configuration-more'
            }
          },
          {
            path: '/config/payment/categoriesLang/add/:line/:lang/:transCode',
            component: categoriesLang,
            name: 'categoriesLangAdd',
            id: 606,
            meta: {
              group: '配置',
              level: 3,
              name: '商品分类管理的翻译内容',
              parent: '/config/configuration-more'
            }
          },
          {
            path: '/config/payment/sickTips/:id',
            name: 'sickTips',
            component: EditSick,
            id: 606,
            meta: {
              level: 3,
              group: '配置',
              name: '风险提示',
              parent: '/config/configuration-more'
            }
          },
          {
            path: '/config/payment/add',
            component: AddEditEmail,
            name: 'emailAdd',
            id: 606,
            meta: {
              group: '配置',
              level: 3,
              name: '新增邮件模版',
              parent: '/config/configuration-more'
            }
          },
          {
            path: '/config/payment/edit/:id',
            component: AddEditEmail,
            name: 'emailEdit',
            id: 606,
            meta: {
              group: '配置',
              level: 3,
              name: '修改邮件模版',
              parent: '/config/configuration-more'
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
          },
          {
            path: '/finance/balance',
            name: 'balance',
            component: balance,
            id: 703,
            meta: {
              group: '财务',
              level: 2,
              name: '余额扣款处理'
            }
          },
          {
            path: '/finance/growthFinance',
            name: 'growthFinance',
            component: GrowthFinance,
            id: 707,
            meta: {
              group: '财务',
              level: 2,
              name: '成长值财务'
            }
          },
          {
            path: '/finance/growthFinanceDetails/:id',
            name: 'growthFinanceDetails',
            component: GrowthFinanceDetails,
            id: 707,
            meta: {
              group: '财务',
              level: 3,
              name: '成长值财务详情'
            }
          },
          {
            path: '/finance/selfSettlement',
            name: 'selfSettlement',
            component: selfSettlement,
            id: 705,
            meta: {
              group: '财务',
              level: 2,
              name: '自提点佣金结算'
            }
          },
          {
            path: '/finance/selfSettlement/recordDetails/:id/:name',
            name: 'recordDetails',
            component: recordDetails,
            id: 705,
            meta: {
              group: '财务',
              level: 3,
              name: '结算记录',
              parent: '/finance/selfSettlement'
            }
          },
          {
            path: '/finance/financeCharts',
            name: 'financeCharts',
            component: financeCharts,
            id: 704,
            meta: {
              group: '财务',
              level: 2,
              name: '财务概览'
            }
          },
          {
            path: '/finance/orderReview',
            name: 'orderReview',
            component: orderReview,
            id: 706,
            meta: {
              group: '财务',
              level: 2,
              name: '订单财务审核'
            }
          },
          {
            path: '/finance/orderReview/reviewFinance/:id/:state',
            name: 'reviewFinance',
            component: reviewFinance,
            id: 706,
            meta: {
              group: '财务',
              level: 3,
              name: '审核',
              parent: '/finance/orderReview'
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
            path: '/marketing/member',
            name: 'system',
            component: System,
            id: 801,
            meta: {
              level: 2,
              group: '营销管理',
              name: '会员体系'
            }
          },
          {
            path: '/marketing/new',
            name: 'newUser',
            component: Newuser,
            id: 801,
            meta: {
              level: 2,
              group: '营销管理',
              name: '用户福利'
            }
          },
          {
            path: '/marketing/new/addNew/:type',
            name: 'addNew',
            component: addNew,
            id: 801,
            meta: {
              level: 3,
              group: '营销管理',
              name: '新增用户福利',
              parent: '/marketing/new'
            }
          },
          {
            path: '/marketing/rebate',
            name: 'rebate',
            component: rebate,
            id: 801,
            meta: {
              level: 3,
              group: '营销管理',
              name: '下单返券',
              parent: '/marketing/new'
            }
          },
          {
            path: '/marketing/new/:type',
            name: 'new',
            component: managementNew,
            id: 801,
            meta: {
              level: 3,
              group: '营销管理',
              name: '新用户送券',
              parent: '/marketing/new'
            }
          },
          {
            path: '/marketing/invitees/:type',
            name: 'invitees',
            component: managementNew,
            id: 801,
            meta: {
              level: 3,
              group: '营销管理',
              name: '被邀请人送券',
              parent: '/marketing/new'
            }
          },
          {
            path: '/marketing/invite/:type',
            name: 'invite',
            component: managementNew,
            id: 801,
            meta: {
              level: 3,
              group: '营销管理',
              name: '邀请新人送券',
              parent: '/marketing/new'
            }
          },
          {
            path: '/marketing/rebate/:type',
            name: 'rebates',
            component: managementNew,
            id: 801,
            meta: {
              level: 3,
              group: '营销管理',
              name: '下单返券',
              parent: '/marketing/new'
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
          // {
          //   path: '/marketing/videoManagement',
          //   name: 'video',
          //   component: videoManagement,
          //   id: 803,
          //   meta: {
          //     level: 2,
          //     group: '营销管理',
          //     name: '视频管理'
          //   }
          // },
          {
            path: '/marketing/channelManagement',
            name: 'channel',
            component: channelManagement,
            id: 803,
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
            id: 803,
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
            id: 803,
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
            id: 803,
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
            id: 804,
            meta: {
              level: 2,
              group: '营销管理',
              name: '统计报表'
            }
          },
          {
            path: '/marketing/advertising',
            name: 'advertising',
            component: advertising,
            id: 805,
            meta: {
              level: 2,
              group: '营销管理',
              name: '广告图管理'
            }
          },
          {
            path: '/marketing/banner',
            name: 'bannerList',
            component: bannerList,
            id: 805,
            meta: {
              level: 3,
              group: '营销管理',
              name: '轮播图管理',
              parent: '/marketing/advertising'
            }
          },
          {
            path: '/marketing/poster',
            name: 'poster',
            component: poster,
            id: 805,
            meta: {
              level: 3,
              group: '营销管理',
              name: '海报管理',
              parent: '/marketing/advertising'
            }
          },
          {
            path: '/marketing/imageSet',
            name: 'imageSet',
            component: imageSet,
            id: 805,
            meta: {
              level: 3,
              group: '营销管理',
              name: '页面广告管理',
              parent: '/marketing/advertising'
            }
          }
          // {
          //   path: '/marketing/advertising/imageSet2',
          //   name: 'imageSet2',
          //   component: imageSet2,
          //   id: 805,
          //   meta: {
          //     level: 2,
          //     group: '营销管理',
          //     name: '页面广告管理'
          //   }
          // }
        ]
      },
      {
        path: 'group',
        component: LayoutContainer,
        icon: 'icon-gongzuotai',
        id: 1300,
        children: [
          {
            path: '/group/groupList',
            name: 'groupMana',
            component: groupMana,
            id: 1301,
            meta: {
              level: 2,
              group: '拼团管理',
              name: '拼团管理'
            }
          },
          {
            path: '/group/leaderList',
            name: 'leaderMana',
            component: leaderMana,
            id: 1302,
            meta: {
              level: 2,
              group: '拼团管理',
              name: '团长管理'
            }
          },
          {
            path: '/group/groupSet',
            name: 'groupSet',
            component: groupSet,
            id: 1303,
            meta: {
              level: 2,
              group: '拼团管理',
              name: '拼团配置'
            }
          },
          {
            path: '/group/contentMana',
            name: 'contentMana',
            component: contentMana,
            id: 1304,
            meta: {
              level: 2,
              group: '拼团管理',
              name: '内容管理'
            }
          },
          {
            path: '/group/contentMana/edit',
            name: 'editContent',
            component: editContent,
            id: 1304,
            meta: {
              level: 3,
              group: '拼团管理',
              name: '编辑内容',
              parent: '/group/contentMana'
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
          },
          {
            path: '/customer/Public/lang/add/:line/:lang/:transCode',
            component: publicLang,
            name: 'publicLangAdd',
            id: 903,
            meta: {
              group: '配置',
              level: 3,
              name: '公告管理的翻译内容',
              parent: '/customer/Public'
            }
          }
        ]
      },
      {
        path: 'language',
        component: LayoutContainer,
        icon: 'icon-yuyanshixunzhongxin',
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
          },
          {
            path: '/language/string',
            name: 'string',
            component: stringTranslate,
            id: 1002,
            meta: {
              level: 2,
              group: '语言包',
              name: '字符串翻译'
            }
          }
        ]
      },
      {
        path: 'website',
        component: LayoutContainer,
        icon: 'icon-shuju',
        id: 1100,
        children: [
          {
            path: '/website/column',
            name: 'column',
            component: website,
            id: 1101,
            meta: {
              level: 2,
              group: '官网管理',
              name: '栏目管理'
            }
          },
          {
            path: '/website/column/add',
            name: 'addColumn',
            component: addEditWebsite,
            id: 1101,
            meta: {
              level: 3,
              group: '官网管理',
              name: '新增栏目',
              parent: '/website/column'
            }
          },
          {
            path: '/website/column/edit/:id/:fixed',
            name: 'editColumn',
            component: addEditWebsite,
            id: 1101,
            meta: {
              level: 3,
              group: '官网管理',
              name: '编辑栏目',
              parent: '/website/column'
            }
          },
          {
            path: '/website/column/:parent/:state',
            name: 'addSecondColumn',
            component: addEditWebsite,
            id: 1101,
            meta: {
              level: 3,
              group: '官网管理',
              name: '新增子栏目',
              parent: '/website/column'
            }
          },
          {
            path: '/website/column/first/edit/:id',
            name: 'editFirstWeb',
            component: editFirstWeb,
            id: 1101,
            meta: {
              level: 3,
              group: '官网管理',
              name: '编辑栏目',
              parent: '/website/column'
            }
          },
          {
            path: '/website/singlePage',
            name: 'singlePage',
            component: singlePage,
            id: 1102,
            meta: {
              level: 2,
              group: '官网管理',
              name: '单页管理'
            }
          },
          {
            path: '/website/singlePage/add',
            name: 'addSingle',
            component: addEditSingle,
            id: 1102,
            meta: {
              level: 3,
              group: '官网管理',
              name: '新增单页',
              parent: '/website/singlePage'
            }
          },
          {
            path: '/website/singlePage/edit/:id',
            name: 'editSingle',
            component: addEditSingle,
            id: 1102,
            meta: {
              level: 3,
              group: '官网管理',
              name: '编辑单页',
              parent: '/website/singlePage'
            }
          },
          {
            path: '/website/page/lang/add/:line/:lang/:transCode',
            component: pageLang,
            name: 'pageLang',
            id: 1102,
            meta: {
              group: '官网管理',
              level: 3,
              name: '单页管理的翻译内容',
              parent: '/website/singlePage'
            }
          },
          {
            path: '/website/block',
            name: 'block',
            component: blockManagement,
            id: 1103,
            meta: {
              level: 2,
              group: '官网管理',
              name: '区块管理'
            }
          },
          {
            path: '/website/block/edit/:id/:status',
            name: 'blockEdit',
            component: blockEdit,
            id: 1103,
            meta: {
              level: 3,
              group: '官网管理',
              name: '编辑区块',
              parent: '/website/block'
            }
          },
          {
            path: '/website/block/edit/:id',
            name: 'otherWebsiteEdit',
            component: otherWebsite,
            id: 1103,
            meta: {
              level: 3,
              group: '官网管理',
              name: '编辑',
              parent: '/website/block'
            }
          },
          {
            path: '/website/block/lang/add/:line/:lang/:transCode',
            component: blockLang,
            name: 'blockLang',
            id: 1103,
            meta: {
              group: '官网管理',
              level: 3,
              name: '区块管理的翻译内容',
              parent: '/website/block'
            }
          },
          {
            path: '/website/url/block/lang/add/:line/:lang/:transCode',
            component: urlLangEdit,
            name: 'urlLangEdit',
            id: 1103,
            meta: {
              group: '官网管理',
              level: 3,
              name: '区块管理的翻译内容',
              parent: '/website/block'
            }
          },
          {
            path: '/website/url/block/img/edit/:line/:lang/:transCode',
            component: imgLangEdit,
            name: 'imgLangEdit',
            id: 1103,
            meta: {
              group: '官网管理',
              level: 3,
              name: '区块管理的翻译内容',
              parent: '/website/block'
            }
          },
          {
            path: '/website/block/others/lang/add/:line/:lang/:transCode',
            component: blockOthersLang,
            name: 'blockOthersLang',
            id: 1103,
            meta: {
              group: '官网管理',
              level: 3,
              name: '区块管理的翻译内容',
              parent: '/website/block'
            }
          },
          {
            path: '/website/block/editOthers/:id/:type',
            component: editOthersBlocks,
            name: 'editOthersBlocks',
            id: 1103,
            meta: {
              group: '官网管理',
              level: 3,
              name: '编辑',
              parent: '/website/block'
            }
          },
          {
            path: '/website/block/editOthers/:id',
            component: editImages,
            name: 'editImages',
            id: 1103,
            meta: {
              group: '官网管理',
              level: 3,
              name: '编辑',
              parent: '/website/block'
            }
          },
          {
            path: '/website/block/editLink/:id',
            component: editLink,
            name: 'editLink',
            id: 1103,
            meta: {
              group: '官网管理',
              level: 3,
              name: '编辑链接',
              parent: '/website/block'
            }
          },
          {
            path: '/website/block/editString/:id',
            component: editString,
            name: 'editString',
            id: 1103,
            meta: {
              group: '官网管理',
              level: 3,
              name: '编辑',
              parent: '/website/block'
            }
          }
        ]
      }
    ]
  }
]
