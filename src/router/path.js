const loadonDemand = path => {
  return () => import(/* webpackChunkName: "chunk" */ `@/views/${path}`)
}
const Layout = loadonDemand('layout/layouttop')
const LayoutContainer = loadonDemand('layout/layoutcontainer')
const Panel = loadonDemand('home/panel')
const homeNotice = loadonDemand('home/notice')
const updateList = loadonDemand('home/updateList')

// 修改密码
const ResetPassword = loadonDemand('home/reset-password')

const ResetPersonInfo = loadonDemand('home/resetPersonInfo')
// 常见问题
const CommonProblem = loadonDemand('home/commonProblem')
// 常见问题详情
const ProblemDetails = loadonDemand('home/problemDetails')
// 系统消息
const SystemInfo = loadonDemand('home/systemInfo')
// 系统消息详情
const InfoDetails = loadonDemand('home/infoDetails')
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
// 客户列表详情
const vipListDetails = loadonDemand('vip/vip/vipListDetails')
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
// 客户地址 批量导入地址
const vipBatchImport = loadonDemand('vip/vipaddress/vipBatchImport')
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
// 财务 订单补款
const orderReplenishment = loadonDemand('finance/orderReplenishment')
// 财务 订单补款详情页面
const orderReplenishDetail = loadonDemand('finance/orderReplenishDetail')
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
// 财务 代理佣金结算
const agencySettlement = loadonDemand('finance/agency/agencySettlement')
// 财务 查看详细
const viewDetails = loadonDemand('finance/agency/viewDetails')
// 财务 代理结算
const agencyCommission = loadonDemand('finance/agency/agencyCommission')
// 财务 发票管理
const invoiceManage = loadonDemand('finance/invoice/invoiceManage')
// 财务 发票详情
const invoiceDetails = loadonDemand('finance/invoice/invoiceDetails')
// 配置 路线列表
// const LineList = loadonDemand('config/line/LineList')
// 新路线
const Line = loadonDemand('config/line/Line')
// 新路线 销售价管理
const salesMana = loadonDemand('config/line/salesMana')
// 模版
const tmpSet = loadonDemand('config/line/templateSet')
// 分区
const partitionList = loadonDemand('config/line/partition')
// 渠道
const channelLine = loadonDemand('config/line/channel')
// 渠道 新增
const channelLineAdd = loadonDemand('config/line/channelSet')
// 面单配置列表
const FaceSingleList = loadonDemand('config/expressSheet/FaceSingleList')
// 配置 添加、修改路线
const LineAddEdit = loadonDemand('config/line/LineAddEdit')
// 配置 路线 其余费用
const othersCost = loadonDemand('config/line/otherCost')
// 配置 添加、修改icon
const IconAdd = loadonDemand('config/line/IconAdd')
// 配置 仓库地址
const WareHouse = loadonDemand('config/warehouse/warehouse')
// 配置 仓位概览
const GoodsAllocation = loadonDemand('config/goodsAllocation/echarts')
// 配置 仓位细节
const GoodsAllocationDetail = loadonDemand('config/goodsAllocation/placeDetail')
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
// 客户 计佣模版列表
const agentTemplate = loadonDemand('config/agent/agentTemplate')
// 客户 计佣模板配置
const agentTemplateConfig = loadonDemand('config/agent/addEditAgentTemplate')
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
// 配置 自提点配置 批量导入
const selfbatchImport = loadonDemand('config/point/selfbatchImport')
// 配置 更多配置
// const PaymentManagement = loadonDemand('config/Payment/payment')
// 配置 更多配置
const configurationMore = loadonDemand('config/Payment/configuration')
// 配置 偏远地区设置
const RemoteAreas = loadonDemand('config/RemoteAreas/remoteSetting')
// 配置 预报单号
const reservationNo = loadonDemand('config/reservationNo/reservationNoList')
// 配置 预报单号详情
const reservationNoDetail = loadonDemand('config/reservationNo/reservationNoDetail')
// 配置 预报单号导入清单
const reservationNoImport = loadonDemand('config/reservationNo/import')
// 配置 箱/袋预留号管理
const boxReservedNum = loadonDemand('config/reservedBox/boxReservedNum')
// 配置 箱/袋预留号管理 详情
const boxReservedDetail = loadonDemand('config/reservedBox/boxReservedDetail')
// 配置 导入
const boxReservedImport = loadonDemand('config/reservedBox/boxReservedImport')
// 配置 更多配置 短信服务配置
const smsServices = loadonDemand('config/Payment/smsService')
// 配置 更多配置 物流查询服务
const trackingService = loadonDemand('config/Payment/trackingService')
// 配置 更多配置 系统服务配置 公众号配置 自定义菜单
const customMenu = loadonDemand('config/Payment/customMenu')
// 配置 更多配置 系统服务配置 公众号配置 自动回复
const autoReply = loadonDemand('config/Payment/autoReply')
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
// 更多配置 发货快递公司
const deliveryCompany = loadonDemand('config/Payment/deliveryCompany')
// 包裹快速入库
const Storage = loadonDemand('station/storage')
// 快速入库下单
const warehouseOrder = loadonDemand('station/warehouseOrder')
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
// 拣货日志
// const PickingLog = loadonDemand('station/pickingLog')
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
// 订单 预报包裹列表 批量上架
const BatchShelves = loadonDemand('order/order/batchShelves')
// 订单 预报包裹列表 批量预报
const BatchForecast = loadonDemand('order/order/batchForecast')
// 偏远地区查询
const remoteSearch = loadonDemand('order/remote/remoteSearch')
// // 订单 订单列表 货量统计
// const VolumeStatistics = loadonDemand('order/order/volumeStatistics')
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
// 订单 申报信息
const declareInfo = loadonDemand('order/declare/declareInfo')
// 订单 包裹订单概览
const orderEcharts = loadonDemand('order/echarts/orderEcharts')
// 营销管理 会员体制
const System = loadonDemand('marketing/member/system')
// 营销管理 用户福利
const Newuser = loadonDemand('marketing/new/new-user')
// 营销管理 用户福利 新增
const addNew = loadonDemand('marketing/new/addNew')
const ordinary = loadonDemand('marketing/new/ordinary')
// 营销管理 用户福利 管理
const managementNew = loadonDemand('marketing/new/management')
// 营销管理  下单返券
const rebate = loadonDemand('marketing/rebate')
// 营销管理  下单返券
const ordinaryDetail = loadonDemand('marketing/ordinaryDetail')
// 营销管理 抵用券管理
const Voucher = loadonDemand('marketing/Voucher/voucher')
// 营销管理 记录
const Notes = loadonDemand('marketing/Voucher/notes')
// 营销管理 添加
const addVoucher = loadonDemand('marketing/Voucher/addVoucher')
// 营销管理 新用户福利
const UserWelfare = loadonDemand('marketing/Voucher/userWelfare')
// 营销管理 视频管理
// const videoManagement = loadonDemand('marketing/video/videoMana')
// 营销管理 渠道管理
const channelManagement = loadonDemand('marketing/channel/channelList')
// 营销管理 统计报表
const reportList = loadonDemand('marketing/report/report')
// 营销管理 广告图管理
const advertising = loadonDemand('marketing/advertising')
// 营销管理 chatgpt 文案
const AiAssistant = loadonDemand('marketing/ai/index')
// 营销管理 轮播图管理
const bannerList = loadonDemand('marketing/banner/bannerList')
// 营销管理 广告图管理 海报管理
const poster = loadonDemand('marketing/poster')
// 营销管理 广告图管理 页面广告管理
const imageSet = loadonDemand('marketing/imageSet')
// const imageSet2 = loadonDemand('marketing/imageSet2')
// 营销管理 弹窗广告管理
const advertiseList = loadonDemand('marketing/advertise/advertiseList')
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
// 客服中心 问答管理
const QuestionAndAnswer = loadonDemand('customer/question')
// 公告新增或编辑
const AddEditPublic = loadonDemand('customer/publicAddEdit')
// 公告管理 语言详情
const publicLang = loadonDemand('customer/publicLang')
// 语言包
const LanguageSupport = loadonDemand('language/support')
// 字符串翻译
const stringTranslate = loadonDemand('language/string')
// 采购
const purchase = loadonDemand('purchase/purchaseOrder')
// 新增采购单
const addPurchase = loadonDemand('purchase/addEditPurchase')
// 编辑采购单
const editPurchase = loadonDemand('purchase/addEditPurchase')
// 采购单详情
const purchaseDetail = loadonDemand('purchase/purchaseDetail')
// 编辑分货
const distributionGoods = loadonDemand('purchase/distributionGoods')
// 分货详情
const distributeDetail = loadonDemand('purchase/distributeDetail')
// 分货转运单
const transshipmentBill = loadonDemand('purchase/transshipmentBill')
// 分货详情
const transshipmentDetail = loadonDemand('purchase/transshipmentDetail')
// 新增分货方案
const addEditScheme = loadonDemand('purchase/addScheme')
// 开始拣货
const picking = loadonDemand('purchase/picking')
// 开始打包
const purchasePack = loadonDemand('purchase/purchasePack')
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

// 订单 上门取件
const pickupList = loadonDemand('order/pickup/pickupList')
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
        id: 1000,
        children: [
          {
            path: '/home/panel',
            name: 'panel',
            icon: '',
            component: Panel,
            id: 1100,
            meta: {
              level: 2,
              group: '首页',
              name: '控制面板'
            }
          },
          {
            path: '/home/update_list',
            name: 'updateList',
            component: updateList,
            id: 1100,
            meta: {
              level: 3,
              group: '首页',
              name: '更新日志',
              parent: '/home/panel'
            }
          },
          {
            path: '/home/notice/:id',
            name: 'systemNotice',
            component: homeNotice,
            id: 1100,
            meta: {
              level: 3,
              group: '首页',
              name: '更新日志详情',
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
          },
          {
            path: '/home/reset-personInfo',
            name: 'reset-personInfo',
            component: ResetPersonInfo,
            id: 102,
            meta: {
              level: 2,
              group: '首页',
              name: '修改个人资料'
            }
          },
          {
            path: '/home/commonProblem',
            name: 'commonProblem',
            component: CommonProblem,
            id: 1100,
            meta: {
              level: 3,
              group: '首页',
              name: '常见问题',
              parent: '/home'
            }
          },
          {
            path: '/home/problemDetails/:id',
            name: 'problemDetails',
            component: ProblemDetails,
            id: 1100,
            meta: {
              level: 3,
              group: '首页',
              name: '常见问题详情',
              parent: '/home'
            }
          },
          {
            path: '/home/systemInfo',
            name: 'systemInfo',
            component: SystemInfo,
            id: 1100,
            meta: {
              level: 3,
              group: '首页',
              name: '系统消息',
              parent: '/home'
            }
          },
          {
            path: '/home/infoDetails/:id',
            name: 'infoDetails',
            component: InfoDetails,
            id: 1100,
            meta: {
              level: 3,
              group: '首页',
              name: '系统消息详情',
              parent: '/home'
            }
          }
        ]
      },
      {
        path: 'marketing',
        component: LayoutContainer,
        icon: 'marketing',
        id: 4100,
        children: [
          {
            path: '/marketing/member',
            name: 'system',
            component: System,
            id: 4101,
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
            id: 4102,
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
            id: 4102,
            meta: {
              level: 3,
              group: '营销管理',
              name: '新增用户福利',
              parent: '/marketing/new'
            }
          },
          {
            path: '/marketing/new/ordinary',
            name: 'ordinary',
            component: ordinary,
            id: 4102,
            meta: {
              level: 3,
              group: '营销管理',
              name: '新增用户福利',
              parent: '/marketing/new'
            }
          },
          // {
          //   path: '/marketing/new/ordinary/:type',
          //   name: 'ordinary',
          //   component: ordinary,
          //   id: 4102,
          //   meta: {
          //     level: 3,
          //     group: '营销管理',
          //     name: '新增用户福利',
          //     parent: '/marketing/new'
          //   }
          // },
          {
            path: '/marketing/rebate',
            name: 'rebate',
            component: rebate,
            id: 4102,
            meta: {
              level: 3,
              group: '营销管理',
              name: '下单返券',
              parent: '/marketing/new'
            }
          },
          {
            path: '/marketing/ordinaryDetail',
            name: 'ordinaryDetail',
            component: ordinaryDetail,
            id: 4102,
            meta: {
              level: 3,
              group: '营销管理',
              name: '详情',
              parent: '/marketing/new'
            }
          },
          {
            path: '/marketing/new/:type',
            name: 'new',
            component: managementNew,
            id: 4102,
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
            id: 4102,
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
            id: 4102,
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
            id: 4102,
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
            id: 4103,
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
            id: 4103,
            meta: {
              level: 3,
              group: '营销管理',
              name: '投放记录',
              parent: '/marketing/voucher'
            }
          },
          {
            path: '/marketing/voucher/userWelfare',
            name: 'userWelfare',
            component: UserWelfare,
            id: 4103,
            meta: {
              level: 3,
              group: '营销管理',
              name: '新用户福利',
              parent: '/marketing/voucher'
            }
          },
          {
            path: '/marketing/voucher/add/voucher',
            name: 'addVoucher',
            component: addVoucher,
            id: 4103,
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
            id: 4104,
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
            id: 4104,
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
            id: 4104,
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
            id: 4104,
            meta: {
              level: 3,
              group: '营销管理',
              name: '引流列表',
              parent: '/marketing/channelManagement'
            }
          },
          // {
          //   path: '/marketing/advertising',
          //   name: 'advertising',
          //   component: advertising,
          //   id: 4105,
          //   meta: {
          //     level: 2,
          //     group: '营销管理',
          //     name: '广告图管理'
          //   }
          // },
          {
            path: '/marketing/ai_assistant',
            name: 'aiAssistant',
            component: AiAssistant,
            id: 4105,
            meta: {
              level: 2,
              group: '营销管理',
              name: 'AI内容助手'
            }
          },
          {
            path: '/marketing/banner',
            name: 'bannerList',
            component: bannerList,
            id: 4105,
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
            id: 4105,
            meta: {
              level: 3,
              group: '营销管理',
              name: '海报管理',
              parent: '/marketing/advertising'
            }
          }
        ]
      },
      {
        path: 'group',
        component: LayoutContainer,
        icon: 'order',
        id: 4200,
        children: [
          {
            path: '/group/groupList',
            name: 'groupMana',
            component: groupMana,
            id: 4201,
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
            id: 4202,
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
            id: 4203,
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
            id: 4204,
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
            id: 4204,
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
        path: 'content',
        component: LayoutContainer,
        icon: 'content',
        id: 4300,
        children: [
          {
            path: '/marketing/advertising',
            name: 'advertising',
            component: advertising,
            id: 4301,
            meta: {
              level: 2,
              group: '内容管理',
              name: '广告图管理'
            }
          },
          {
            path: '/content/imageSet',
            name: 'imageSet',
            component: imageSet,
            id: 4301,
            meta: {
              level: 3,
              group: '内容管理',
              name: '广告图管理',
              parent: '/marketing/advertising'
            }
          },
          {
            path: '/marketing/advertise',
            name: 'advertiseList',
            component: advertiseList,
            id: 4301,
            meta: {
              level: 3,
              group: '内容管理',
              name: '弹窗广告管理',
              parent: '/marketing/advertising'
            }
          },
          {
            path: '/content/notice',
            component: NoticeList,
            name: 'noticelist',
            id: 4302,
            meta: {
              group: '内容管理',
              level: 2,
              name: '文章管理'
            }
          }
        ]
      },
      {
        path: 'website',
        component: LayoutContainer,
        icon: 'website',
        id: 6100,
        children: [
          {
            path: '/website/column',
            name: 'column',
            component: website,
            id: 6101,
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
            id: 6101,
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
            id: 6101,
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
            id: 6101,
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
            id: 6101,
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
            id: 6102,
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
            id: 6102,
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
            id: 6102,
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
            id: 6102,
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
            id: 6103,
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
            id: 6103,
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
            id: 6103,
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
            id: 6103,
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
            id: 6103,
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
            id: 6103,
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
            id: 6103,
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
            id: 6103,
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
            id: 6103,
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
            id: 6103,
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
            id: 6103,
            meta: {
              group: '官网管理',
              level: 3,
              name: '编辑',
              parent: '/website/block'
            }
          }
        ]
      },
      {
        path: 'customer',
        component: LayoutContainer,
        icon: 'kefu',
        id: 4400,
        children: [
          {
            path: '/customer/suggest',
            name: 'suggestlist',
            component: SuggestList,
            id: 4401,
            meta: {
              level: 2,
              group: '客服事务处理',
              name: '投诉建议'
            }
          },
          {
            path: '/customer/evaluation',
            name: 'evaluation',
            component: Evaluation,
            id: 4402,
            meta: {
              level: 2,
              group: '客服事务处理',
              name: '评价管理'
            }
          },
          {
            path: '/customer/Public',
            name: 'Public',
            component: PublicList,
            id: 4403,
            meta: {
              level: 2,
              group: '客服事务处理',
              name: '公告管理'
            }
          },
          {
            path: '/customer/Public/Add',
            name: 'addPublic',
            component: AddEditPublic,
            id: 4403,
            meta: {
              level: 3,
              group: '客服事务处理',
              name: '新增公告',
              parent: '/customer/Public'
            }
          },
          {
            path: '/customer/Public/Edit/:id',
            name: 'editPublic',
            component: AddEditPublic,
            id: 4403,
            meta: {
              level: 3,
              group: '客服事务处理',
              name: '编辑公告',
              parent: '/customer/Public'
            }
          },
          {
            path: '/customer/Public/lang/add/:line/:lang/:transCode',
            component: publicLang,
            name: 'publicLangAdd',
            id: 4403,
            meta: {
              //group: '配置',
              group: '客服事务处理',
              level: 3,
              name: '公告管理的翻译内容',
              parent: '/customer/Public'
            }
          },
          {
            path: '/customer/question',
            name: 'question',
            component: QuestionAndAnswer,
            id: 4404,
            meta: {
              level: 2,
              group: '客服事务处理',
              name: '问答管理'
            }
          }
        ]
      },
      {
        path: 'vip',
        component: LayoutContainer,
        icon: 'vip',
        id: 4500,
        children: [
          {
            path: '/vip/viplist',
            name: 'viplist',
            component: VipList,
            id: 4501,
            meta: {
              group: '客户管理',
              level: 2,
              name: '客户概览'
            }
          },
          {
            path: '/vip/vipListDetails/:id',
            name: 'vipListDetails',
            component: vipListDetails,
            id: 4501,
            meta: {
              group: '客户管理',
              level: 3,
              name: '客户详情'
            }
          },
          {
            path: '/vip/vipgrouplist',
            name: 'vipgrouplist',
            component: VipGroupList,
            id: 4502,
            meta: {
              level: 2,
              group: '客户管理',
              name: '客户分类'
            }
          },
          {
            path: '/vip/vipaddress',
            name: 'vipaddress',
            component: VipAddressList,
            id: 4503,
            meta: {
              level: 2,
              group: '客户管理',
              name: '客户地址'
            }
          },
          {
            path: '/vip/vipaddress/vipBatchImport',
            name: 'vipBatchImport',
            component: vipBatchImport,
            id: 4503,
            meta: {
              level: 3,
              group: '客户管理',
              name: '批量导入地址'
            }
          },
          {
            path: '/vip/agent',
            name: 'agent',
            component: agentManagement,
            id: 4504,
            meta: {
              level: 2,
              group: '客户管理',
              name: '代理管理'
            }
          },
          {
            path: '/vip/add/agent',
            name: 'addAgent',
            component: AddEditAgent,
            id: 4504,
            meta: {
              level: 3,
              group: '客户管理',
              name: '添加代理',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/edit/agent',
            name: 'editAgent',
            component: AddEditAgent,
            id: 4504,
            meta: {
              level: 3,
              group: '客户管理',
              name: '修改代理',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/agent/template',
            name: 'agentTemplate',
            component: agentTemplate,
            id: 4504,
            meta: {
              level: 3,
              group: '客户管理',
              name: '计佣模版配置',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/agent/template/add',
            name: 'agentTemplateAdd',
            component: agentTemplateConfig,
            id: 4504,
            meta: {
              level: 3,
              group: '客户管理',
              name: '添加计佣模版',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/agent/template/edit/:id',
            name: 'agentTemplateEdit',
            component: agentTemplateConfig,
            id: 4504,
            meta: {
              level: 3,
              group: '客户管理',
              name: '修改计佣模版',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/withdrawal/:id',
            name: 'Withdrawal',
            component: Withdrawal,
            id: 4504,
            meta: {
              level: 3,
              group: '客户管理',
              name: '佣金提现管理',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/WithdrawalDetail/:userId/:id/:status',
            name: 'wdDetail',
            component: wdDetail,
            id: 4504,
            meta: {
              level: 3,
              group: '客户管理',
              name: '佣金提现详情',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/reviewWithdrawal/:userId/:id/:state',
            name: 'wdReviewDetail',
            component: wdDetail,
            id: 4504,
            meta: {
              level: 3,
              group: '客户管理',
              name: '佣金提现审核',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/agent/record',
            name: 'record',
            component: transactionRecord,
            id: 4504,
            meta: {
              level: 3,
              group: '客户管理',
              name: '成交记录',
              parent: '/vip/agent'
            }
          },
          {
            path: '/vip/application',
            name: 'application',
            component: application,
            id: 4505,
            meta: {
              level: 2,
              group: '客户管理',
              name: '代理申请管理'
            }
          },
          {
            path: '/vip/sleepReminder',
            name: 'sleepReminder',
            component: sleepReminder,
            id: 4506,
            meta: {
              level: 2,
              group: '客户管理',
              name: '未活跃提醒'
            }
          }
        ]
      },
      {
        path: 'staff',
        component: LayoutContainer,
        icon: 'staff',
        id: 6200,
        children: [
          {
            path: '/staff/stafflist',
            name: 'stafflist',
            component: StaffList,
            id: 6201,
            meta: {
              level: 2,
              group: '员工管理',
              name: '员工列表'
            }
          },
          {
            path: '/staff/staffadd',
            name: 'staffadd',
            component: StaffEdit,
            id: 6201,
            meta: {
              level: 3,
              group: '员工管理',
              name: '添加员工',
              parent: '/staff/stafflist'
            }
          },
          {
            path: '/staff/staffEdit/:state/:id',
            name: 'staffEdit',
            component: StaffEdit,
            id: 6201,
            meta: {
              level: 3,
              group: '员工管理',
              name: '修改资料',
              parent: '/staff/stafflist'
            }
          },
          {
            path: '/staff/staffgrouplist',
            name: 'staffgrouplist',
            component: StaffGroupList,
            id: 6202,
            meta: {
              level: 2,
              group: '员工管理',
              name: '员工组列表'
            }
          },
          {
            path: '/staff/modify_permissions/:id',
            name: 'modifyPermissions',
            component: modifyPre,
            id: 6202,
            meta: {
              level: 3,
              group: '员工管理',
              name: '修改权限',
              parent: '/staff/staffgrouplist'
            }
          }
        ]
      },
      // {
      //   path: 'basics',
      //   component: LayoutContainer,
      //   icon: 'basics',
      //   id: 1102,
      //   children: [
      //     {
      //       path: '/basics/warehouse',
      //       component: WareHouse,
      //       name: 'warehouse',
      //       id: 602,
      //       meta: {
      //         group: '基础数据',
      //         level: 2,
      //         name: '仓库地址管理'
      //       }
      //     },
      //     {
      //       path: '/config/line',
      //       name: 'linelist',
      //       component: Line,
      //       id: 601,
      //       meta: {
      //         group: '基础数据',
      //         level: 2,
      //         name: '渠道路线配置'
      //       }
      //     },
      //     {
      //       path: '/config/line/sales',
      //       name: 'salesMana',
      //       component: salesMana,
      //       id: 601,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '销售价管理',
      //         parent: '/config/line'
      //       }
      //     },
      //     {
      //       path: '/config/line/tmpSet',
      //       name: 'tmpSet',
      //       component: tmpSet,
      //       id: 601,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '模版',
      //         parent: '/config/line'
      //       }
      //     },
      //     {
      //       path: '/config/line/partition',
      //       name: 'partition',
      //       component: partitionList,
      //       id: 601,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '分区',
      //         parent: '/config/line'
      //       }
      //     },
      //     {
      //       path: '/config/line/channel_list/:id',
      //       name: 'channelLine',
      //       component: channelLine,
      //       id: 601,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '渠道',
      //         parent: '/config/line'
      //       }
      //     },
      //     {
      //       path: '/config/line/channel/add',
      //       name: 'channelLineAdd',
      //       component: channelLineAdd,
      //       id: 601,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '新增',
      //         parent: '/config/line'
      //       }
      //     },
      //     {
      //       path: '/config/line/channel/edit/:id',
      //       name: 'channelLineEdit',
      //       component: channelLineAdd,
      //       id: 601,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '编辑',
      //         parent: '/config/line'
      //       }
      //     },
      //     {
      //       path: '/config/line/lineadd',
      //       component: LineAddEdit,
      //       name: 'lineadd',
      //       id: 601,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '添加路线',
      //         parent: '/config/line/linelist'
      //       }
      //     },
      //     {
      //       path: '/config/icon/add',
      //       component: IconAdd,
      //       name: 'IconAdd',
      //       id: 601,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '路线icon',
      //         parent: '/config/line/linelist'
      //       }
      //     },
      //     {
      //       path: '/config/line/lineedit/:state/:id',
      //       component: LineAddEdit,
      //       name: 'lineedit',
      //       id: 601,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '修改路线',
      //         parent: '/config/line/linelist'
      //       }
      //     },
      //     {
      //       path: '/config/line/otherCost/:id',
      //       component: othersCost,
      //       name: 'othersCost',
      //       id: 601,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '其余费用',
      //         parent: '/config/line/linelist'
      //       }
      //     },
      //     // {
      //     //     path: '/config/warehouse',
      //     //     component: WareHouse,
      //     //     name: 'warehouse',
      //     //     id: 602,
      //     //     meta: {
      //     //         group: '基础数据',
      //     //         level: 2,
      //     //         name: '仓库地址配置'
      //     //     }
      //     // },
      //     {
      //       path: '/config/warehouse/add',
      //       component: WareHouseEdit,
      //       name: 'warehouseAdd',
      //       id: 602,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '添加仓库',
      //         parent: '/config/warehouse'
      //       }
      //     },
      //     {
      //       path: '/config/warehouse/position/:id/:warehouseName',
      //       component: positionWarehouse,
      //       name: 'position',
      //       id: 602,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '货位管理',
      //         parent: '/config/warehouse'
      //       }
      //     },
      //     {
      //       path: '/config/warehouse/edit/:id',
      //       component: WareHouseEdit,
      //       name: 'warehouseEdit',
      //       id: 602,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '修改仓库',
      //         parent: '/config/warehouse'
      //       }
      //     },
      //     {
      //         path: '/config/notice',
      //         component: NoticeList,
      //         name: 'noticelist',
      //         id: 603,
      //         meta: {
      //             group: '基础数据',
      //             level: 2,
      //             name: '文章管理'
      //         }
      //     },
      //     {
      //       path: '/config/notice/add',
      //       component: NoticeAddEdit,
      //       name: 'noticeadd',
      //       id: 603,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '新增文章管理',
      //         parent: '/config/notice'
      //       }
      //     },
      //     {
      //       path: '/config/notice/edit/:id',
      //       component: NoticeAddEdit,
      //       name: 'noticeEdit',
      //       id: 603,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '修改文章管理',
      //         parent: '/config/notice'
      //       }
      //     },
      //     {
      //       path: '/config/notice/lang/add/:line/:lang/:transCode',
      //       component: noticeLang,
      //       name: 'noticeLangAdd',
      //       id: 603,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '文章管理的翻译内容',
      //         parent: '/config/notice'
      //       }
      //     },
      //     // {
      //     //   path: '/config/applet',
      //     //   name: 'appletManagement',
      //     //   component: AppletConfiguration,
      //     //   id: 604,
      //     //   meta: {
      //     //     level: 2,
      //     //     group: '配置',
      //     //     name: '小程序配置'
      //     //   }
      //     // },
      //     // {
      //     //     path: '/config/point',
      //     //     name: 'point',
      //     //     component: SinceList,
      //     //     id: 605,
      //     //     meta: {
      //     //         level: 2,
      //     //         group: '基础数据',
      //     //         name: '自提点配置'
      //     //     }
      //     // },
      //     {
      //       path: '/config/point/add',
      //       name: 'pointAdd',
      //       component: sinceAddEdit,
      //       id: 605,
      //       meta: {
      //         level: 3,
      //         group: '基础数据',
      //         name: '添加自提点配置',
      //         parent: '/config/point'
      //       }
      //     },
      //     {
      //       path: '/config/point/edit/:id',
      //       name: 'pointEdit',
      //       component: sinceAddEdit,
      //       id: 605,
      //       meta: {
      //         level: 3,
      //         group: '基础数据',
      //         name: '编辑自提点配置',
      //         parent: '/config/point'
      //       }
      //     },
      //     {
      //       path: '/config/point/commissionSet',
      //       name: 'commissionSet',
      //       component: commissionSet,
      //       id: 605,
      //       meta: {
      //         level: 3,
      //         group: '基础数据',
      //         name: '计佣方式配置',
      //         parent: '/config/point'
      //       }
      //     },
      //     {
      //       path: '/config/point/selfbatchImport',
      //       name: 'selfbatchImport',
      //       component: selfbatchImport,
      //       id: 605,
      //       meta: {
      //         level: 3,
      //         group: '基础数据',
      //         name: '批量导入',
      //         parent: '/config/point'
      //       }
      //     },
      //     // {
      //     //   path: '/config/payment',
      //     //   name: 'payment',
      //     //   component: PaymentManagement,
      //     //   id: 606,
      //     //   meta: {
      //     //     level: 2,
      //     //     group: '配置',
      //     //     name: '更多配置'
      //     //   }
      //     // },
      //     {
      //       path: '/config/mail-configure',
      //       name: 'mailConfigur',
      //       component: mailConfigure,
      //       id: 606,
      //       meta: {
      //         level: 3,
      //         group: '基础数据',
      //         name: '邮件通知配置',
      //         parent: '/config/configuration-more'
      //       }
      //     },
      //     // {
      //     //     path: '/config/configuration-more',
      //     //     name: 'configurationMore',
      //     //     component: configurationMore,
      //     //     id: 606,
      //     //     meta: {
      //     //         level: 2,
      //     //         group: '基础数据',
      //     //         name: '更多配置'
      //     //     }
      //     // },
      //     {
      //       path: '/config/auto-reply',
      //       name: 'autoReply',
      //       component: autoReply,
      //       id: 606,
      //       meta: {
      //         level: 3,
      //         group: '基础数据',
      //         name: '自动回复',
      //         parent: '/config/configuration-more'
      //       }
      //     },
      //     {
      //       path: '/config/custom-menu',
      //       name: 'customMenu',
      //       component: customMenu,
      //       id: 606,
      //       meta: {
      //         level: 3,
      //         group: '基础数据',
      //         name: '自定义菜单',
      //         parent: '/config/configuration-more'
      //       }
      //     },
      //     {
      //       path: '/config/sms-services',
      //       name: 'smsServices',
      //       component: smsServices,
      //       id: 606,
      //       meta: {
      //         level: 3,
      //         group: '基础数据',
      //         name: '短信服务',
      //         parent: '/config/configuration-more'
      //       }
      //     },
      //     {
      //       path: '/config/tracking-services',
      //       name: 'trackingService',
      //       component: trackingService,
      //       id: 606,
      //       meta: {
      //         level: 3,
      //         group: '基础数据',
      //         name: '物流查询服务',
      //         parent: '/config/configuration-more'
      //       }
      //     },
      //     {
      //       path: '/config/payment/emailLang/add/:line/:lang/:transCode',
      //       component: emailLang,
      //       name: 'emailLangAdd',
      //       id: 606,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '邮件模版的翻译内容',
      //         parent: '/config/configuration-more'
      //       }
      //     },
      //     {
      //       path: '/config/payment/categoriesLang/add/:line/:lang/:transCode',
      //       component: categoriesLang,
      //       name: 'categoriesLangAdd',
      //       id: 606,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '商品分类管理的翻译内容',
      //         parent: '/config/configuration-more'
      //       }
      //     },
      //     {
      //       path: '/config/payment/sickTips/:id',
      //       name: 'sickTips',
      //       component: EditSick,
      //       id: 606,
      //       meta: {
      //         level: 3,
      //         group: '基础数据',
      //         name: '风险提示',
      //         parent: '/config/configuration-more'
      //       }
      //     },
      //     {
      //       path: '/config/payment/add',
      //       component: AddEditEmail,
      //       name: 'emailAdd',
      //       id: 606,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '新增邮件模版',
      //         parent: '/config/configuration-more'
      //       }
      //     },
      //     {
      //       path: '/config/payment/edit/:id',
      //       component: AddEditEmail,
      //       name: 'emailEdit',
      //       id: 606,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '修改邮件模版',
      //         parent: '/config/configuration-more'
      //       }
      //     },
      //     {
      //       path: '/config/payment/delivery-company/:id/:name',
      //       component: deliveryCompany,
      //       name: 'deliveryCompany',
      //       id: 606,
      //       meta: {
      //         group: '基础数据',
      //         level: 3,
      //         name: '详情',
      //         parent: '/config/configuration-more'
      //       }
      //     }
      //   ]
      // },
      {
        path: 'order',
        component: LayoutContainer,
        icon: 'order',
        id: 2100,
        children: [
          {
            path: '/order/orderlist',
            component: OrderList,
            name: 'orderlist',
            id: 2101,
            meta: {
              level: 2,
              group: '订单管理',
              name: '预报包裹'
            }
          },
          {
            path: '/order/orderlist/importOrder',
            component: ImportOrder,
            name: 'ImportOrder',
            id: 2101,
            meta: {
              level: 3,
              group: '订单管理',
              name: '批量入库',
              parent: '/order/orderlist'
            }
          },
          {
            path: '/order/orderlist/batchForecast',
            component: BatchForecast,
            name: 'BatchForecast',
            id: 2101,
            meta: {
              level: 3,
              group: '订单管理',
              name: '批量预报',
              parent: '/order/orderlist'
            }
          },
          {
            path: '/order/orderlist/batchShelves',
            component: BatchShelves,
            name: 'BatchShelves',
            id: 2101,
            meta: {
              level: 3,
              group: '订单管理',
              name: '批量上架',
              parent: '/order/orderlist'
            }
          },
          {
            path: '/order/orderlist/details/:id',
            component: oderDetails,
            name: 'oderDetails',
            id: 2101,
            meta: {
              level: 3,
              group: '订单管理',
              name: '详情',
              parent: '/order/orderlist'
            }
          },
          {
            path: '/order/waybill_list',
            component: WaybillList,
            name: 'wayBillList',
            id: 2102,
            meta: {
              level: 2,
              group: '订单管理',
              name: '订单列表'
            }
          },
          // {
          //   path: '/order/order/volumeStatistics',
          //   component: VolumeStatistics,
          //   name: 'VolumeStatistics',
          //   id: 402,
          //   meta: {
          //     level: 3,
          //     group: '订单',
          //     name: '货量统计'
          //   }
          // },
          {
            path: '/order/noOwner',
            component: noOwner,
            name: 'noOwner',
            id: 2103,
            meta: {
              level: 2,
              group: '订单管理',
              name: '无人认领包裹'
            }
          },
          {
            path: '/order/remote/remoteSearch',
            name: 'remoteSearch',
            component: remoteSearch,
            id: 2104,
            meta: {
              level: 2,
              group: '订单管理',
              name: '偏远地区查询'
            }
          },
          {
            path: '/order/freight',
            name: 'freight',
            component: Freight,
            id: 2105,
            meta: {
              level: 2,
              group: '订单管理',
              name: '运费查询'
            }
          },
          {
            path: '/order/freight/detail/:id',
            name: 'freightDetail',
            component: freightDetail,
            id: 2104,
            meta: {
              level: 3,
              group: '订单管理',
              name: '详情',
              parent: '/order/freight'
            }
          },
          {
            path: '/order/billDetails/:id/:activeName',
            name: 'billDetails',
            component: Billdetails,
            id: 2102,
            meta: {
              level: 3,
              group: '订单管理',
              name: '详情',
              parent: '/order/waybill_list'
            }
          },
          {
            path: '/order/review',
            name: 'review',
            component: reviewDetails,
            id: 2102,
            meta: {
              level: 3,
              group: '订单管理',
              name: '审核',
              parent: '/order/waybill_list'
            }
          },
          {
            path: '/order/editBillPacked/:id/:activeName/:parent/:lineId',
            name: 'editPacked',
            component: editPacked,
            id: 2102,
            meta: {
              level: 3,
              group: '订单管理',
              name: '编辑',
              parent: '/order/waybill_list'
            }
          },
          {
            path: '/order/billPacked/:id/:order_sn/:activeName/:parent/:lineId',
            name: 'billPacked',
            component: Billpacked,
            id: 2102,
            meta: {
              level: 3,
              group: '订单管理',
              name: '打包处理',
              parent: '/order/waybill_list'
            }
          },
          {
            path: '/order/declareInfo',
            name: 'declareInfo',
            component: declareInfo,
            id: 2106,
            meta: {
              level: 2,
              group: '订单管理',
              name: '申报信息'
            }
          },
          {
            path: '/order/pickup',
            name: 'pickup',
            component: pickupList,
            id: 2107,
            meta: {
              level: 2,
              group: '订单管理',
              name: '上门取件'
            }
          }
        ]
      },
      {
        path: 'station',
        component: LayoutContainer,
        icon: 'freight',
        id: 2200,
        children: [
          {
            path: '/station/warehouseOrder',
            name: 'warehouseOrder',
            component: warehouseOrder,
            id: 2201,
            meta: {
              level: 2,
              group: '货站管理',
              name: '快速入库下单'
            }
          },
          {
            path: '/station/storage',
            name: 'storageContainer',
            component: Storage,
            id: 2201,
            meta: {
              level: 3,
              group: '货站管理',
              name: '包裹快速入库'
            }
          },
          {
            path: '/station/storage/:id',
            name: 'editStorage',
            component: Storage,
            id: 2201,
            meta: {
              level: 3,
              group: '货站管理',
              name: '快速入库',
              parent: '/station/storage'
            }
          },
          {
            path: '/station/edit/storage/:id/:state',
            name: 'editWarehouse',
            component: Storage,
            id: 2201,
            meta: {
              level: 3,
              group: '货站管理',
              name: '快速入库',
              parent: '/station/storage'
            }
          },
          {
            path: '/station/ship',
            name: 'shipContainer',
            component: Ship,
            id: 2202,
            meta: {
              level: 2,
              group: '货站管理',
              name: '发货单'
            }
          },
          {
            path: '/station/ship/details',
            name: 'shipDetails',
            component: ShipDetails,
            id: 2202,
            meta: {
              level: 3,
              group: '货站管理',
              name: '详情',
              parent: '/station/ship'
            }
          },
          {
            path: '/station/tracking',
            name: 'tracking',
            component: tracking,
            id: 2203,
            meta: {
              level: 2,
              group: '货站管理',
              name: '物流查询'
            }
          },
          {
            path: '/station/picking',
            name: 'pickingContainer',
            component: Picking,
            id: 2204,
            meta: {
              level: 2,
              group: '货站管理',
              name: '拣货日志'
            }
          },
          // {
          //   path: '/station/pickingLog',
          //   name: 'pickingContainer',
          //   component: PickingLog,
          //   id: 503,
          //   meta: {
          //     level: 2,
          //     group: '货站管理',
          //     name: '拣货日志新'
          //   }
          // },
          // {
          //   path: '/station/warehouseSelf',
          //   name: 'warehouseSelf',
          //   component: warehouseSelf,
          //   id: 504,
          //   meta: {
          //     level: 2,
          //     group: '货站管理',
          //     name: '仓库自提'
          //   }
          // },
          {
            path: '/station/self/details/:id/:status',
            name: 'selfDetails',
            component: selfDetails,
            id: 2204,
            meta: {
              level: 3,
              group: '货站管理',
              name: '详情',
              parent: '/station/warehouseSelf'
            }
          },
          //   {
          //     path: '/station/tracking',
          //     name: 'tracking',
          //     component: tracking,
          //     id: 506,
          //     meta: {
          //       level: 2,
          //       group: '货站管理',
          //       name: '物流查询'
          //     }
          //   },
          {
            path: '/station/tracking',
            name: 'tracking',
            component: tracking,
            id: 2203,
            meta: {
              level: 3,
              group: '货站管理',
              name: '物流查询'
            }
          },
          {
            path: '/station/tracking/logistics',
            name: 'logistics',
            component: logisticsList,
            id: 2203,
            meta: {
              level: 3,
              group: '货站管理',
              name: '自定义物流轨迹',
              parent: '/station/tracking'
            }
          },
          {
            path: '/station/import/logistics',
            name: 'importLogistics',
            component: importLogistics,
            id: 2205,
            meta: {
              level: 3,
              group: '货站管理',
              name: '批量上传',
              parent: '/station/logistics'
            }
          },
          {
            path: '/station/applyPackage',
            name: 'applyPackage',
            component: applyPackage,
            id: 2205,
            meta: {
              level: 2,
              group: '货站管理',
              name: '包裹快速合箱'
            }
          },
          {
            path: '/station/boxing',
            name: 'boxing',
            component: boxing,
            id: 2205,
            meta: {
              level: 3,
              group: '货站管理',
              name: '打包合箱',
              parent: '/station/applyPackage'
            }
          }
        ]
      },
      {
        path: 'pick',
        component: LayoutContainer,
        icon: 'details',
        id: 3100,
        children: [
          {
            path: '/pick/packageManagement',
            name: 'packageMana',
            component: PackageManagement,
            id: 3101,
            meta: {
              level: 2,
              group: '自提点管理',
              name: '转运包裹管理'
            }
          },
          {
            path: '/config/point',
            name: 'point',
            component: SinceList,
            id: 3102,
            meta: {
              level: 2,
              group: '自提点管理',
              name: '自提点配置'
            }
          },
          {
            path: '/pick/packageManagement/pickLocation/:XStationId',
            name: 'pickLocation',
            component: pickLocation,
            id: 3101,
            meta: {
              level: 3,
              group: '自提点管理',
              name: '仓位管理',
              parent: '/pick/packageManagement'
            }
          }
        ]
      },
      {
        path: 'finance',
        component: LayoutContainer,
        icon: 'audit',
        id: 5100,
        children: [
          {
            path: '/finance/details',
            name: 'TransactionDetails',
            component: TransactionDetails,
            id: 5201,
            meta: {
              group: '财务审核',
              level: 3,
              name: '转账支付详情',
              parent: '/finance/transaction'
            }
          },
          {
            path: '/finance/wechatPay',
            name: 'wechatPay',
            component: TransactionWechat,
            id: 5201,
            meta: {
              group: '财务审核',
              level: 3,
              name: '在线支付详情',
              parent: '/finance/transaction'
            }
          },
          {
            path: '/finance/recharge',
            name: 'recharge',
            component: Recharge,
            id: 5101,
            meta: {
              group: '财务审核',
              level: 2,
              name: '充值记录'
            }
          },
          {
            path: '/finance/rechargeDetails/:id',
            name: 'rechargeDetails',
            component: RechargeDetails,
            id: 5101,
            meta: {
              group: '财务审核',
              level: 3,
              name: '审核详情',
              parent: '/finance/recharge'
            }
          },
          {
            path: '/finance/rechargeReview/:id/:state',
            name: 'rechargeReview',
            component: RechargeDetails,
            id: 5101,
            meta: {
              group: '财务审核',
              level: 3,
              name: '充值审核',
              parent: '/finance/recharge'
            }
          },
          {
            path: '/finance/balance',
            name: 'balance',
            component: balance,
            id: 5102,
            meta: {
              group: '财务审核',
              level: 2,
              name: '余额扣款'
            }
          },
          {
            path: '/finance/orderReplenishment',
            name: 'orderReplenishment',
            component: orderReplenishment,
            id: 5103,
            meta: {
              group: '财务审核',
              level: 2,
              name: '订单补款'
            }
          },
          {
            path: '/finance/orderReplenishDetail/:id',
            name: 'orderReplenishDetail',
            component: orderReplenishDetail,
            id: 5103,
            meta: {
              group: '财务审核',
              level: 3,
              name: '订单补款详情',
              parent: '/finance/orderReplenishment'
            }
          },
          {
            path: '/finance/selfSettlement',
            name: 'selfSettlement',
            component: selfSettlement,
            id: 5104,
            meta: {
              group: '财务审核',
              level: 2,
              name: '自提点佣金结算'
            }
          },
          {
            path: '/finance/selfSettlement/recordDetails/:id/:name',
            name: 'recordDetails',
            component: recordDetails,
            id: 5104,
            meta: {
              group: '财务审核',
              level: 3,
              name: '结算记录',
              parent: '/finance/selfSettlement'
            }
          },
          {
            path: '/finance/orderReview',
            name: 'orderReview',
            component: orderReview,
            id: 5105,
            meta: {
              group: '财务审核',
              level: 2,
              name: '订单财务审核'
            }
          },
          {
            path: '/finance/orderReview/reviewFinance/:id/:state',
            name: 'reviewFinance',
            component: reviewFinance,
            id: 5105,
            meta: {
              group: '财务审核',
              level: 3,
              name: '审核',
              parent: '/finance/orderReview'
            }
          },
          {
            path: '/finance/growthFinance',
            name: 'growthFinance',
            component: GrowthFinance,
            id: 5106,
            meta: {
              group: '财务审核',
              level: 2,
              name: '成长值财务'
            }
          },
          {
            path: '/finance/growthFinanceDetails/:id',
            name: 'growthFinanceDetails',
            component: GrowthFinanceDetails,
            id: 5106,
            meta: {
              group: '财务审核',
              level: 3,
              name: '成长值财务详情'
            }
          },
          {
            path: '/finance/agency',
            name: 'agencySettlement',
            component: agencySettlement,
            id: 5107,
            meta: {
              group: '财务审核',
              level: 2,
              name: '代理佣金结算'
            }
          },
          {
            path: '/finance/agency/viewDetails/:id',
            name: 'viewDetails',
            component: viewDetails,
            id: 5107,
            meta: {
              group: '财务审核',
              level: 3,
              name: '查看详细',
              parent: '/finance/agency'
            }
          },
          {
            path: '/finance/agency/agencyCommission',
            name: 'agencyCommission',
            component: agencyCommission,
            id: 5107,
            meta: {
              group: '财务审核',
              level: 3,
              name: '代理结算',
              parent: '/finance/agency'
            }
          }
        ]
      },
      {
        path: 'consumption',
        component: LayoutContainer,
        icon: 'finance',
        id: 5200,
        children: [
          {
            path: '/finance/transaction',
            name: 'transaction',
            component: Transaction,
            id: 5201,
            meta: {
              group: '流水管理',
              level: 2,
              name: '流水记录'
            }
          }
        ]
      },
      {
        path: 'consumption',
        component: LayoutContainer,
        icon: 'invoice',
        id: 5300,
        children: [
          {
            path: '/finance/invoice',
            name: 'invoiceManage',
            component: invoiceManage,
            id: 5301,
            meta: {
              group: '发票管理',
              level: 2,
              name: '发票管理'
            }
          },
          {
            path: '/finance/invoice/invoiceDetails/:id',
            name: 'invoiceDetails',
            component: invoiceDetails,
            id: 5301,
            meta: {
              group: '发票管理',
              level: 3,
              name: '发票详情',
              parent: '/finance/invoice'
            }
          }
        ]
      },
      {
        path: 'config',
        component: LayoutContainer,
        icon: 'setting',
        id: 6300,
        children: [
          {
            path: '/config/configuration-more',
            name: 'configurationMore',
            component: configurationMore,
            id: 6301,
            meta: {
              level: 2,
              group: '基础配置',
              name: '基础配置'
            }
          },
          {
            path: '/config/remoteAreas',
            component: RemoteAreas,
            name: 'RemoteAreas',
            id: 6302,
            meta: {
              group: '基础配置',
              level: 2,
              name: '偏远地区设置'
            }
          },
          {
            path: '/config/reservationNo',
            name: 'reservationNo',
            component: reservationNo,
            id: 6303,
            meta: {
              group: '基础配置',
              level: 2,
              name: '预留订单号'
            }
          },
          {
            path: '/config/reservationNo/detail',
            component: reservationNoDetail,
            name: 'reservationNoDetail',
            id: 6303,
            meta: {
              group: '基础配置',
              level: 3,
              name: '预留订单号详情',
              parent: '/config/reservationNo'
            }
          },
          {
            path: '/config/reservationNo/import',
            component: reservationNoImport,
            name: 'reservationNoImport',
            id: 6303,
            meta: {
              group: '基础配置',
              level: 3,
              name: '导入清单',
              parent: '/config/reservationNo'
            }
          },
          {
            path: '/config/reservedBox/boxReservedNum',
            name: 'boxReservedNum',
            component: boxReservedNum,
            id: 6304,
            meta: {
              group: '基础配置',
              level: 2,
              name: '预留单号'
            }
          },
          {
            path: '/config/reservedBox/boxReservedDetail',
            name: 'boxReservedDetail',
            component: boxReservedDetail,
            id: 6304,
            meta: {
              group: '基础配置',
              level: 3,
              name: '详情',
              parent: '/config/reservedBox'
            }
          },
          {
            path: '/config/reservedBox/boxReservedImport',
            name: 'boxReservedImport',
            component: boxReservedImport,
            id: 6304,
            meta: {
              group: '基础配置',
              level: 3,
              name: '导入',
              parent: '/config/reservedBox'
            }
          },
          {
            path: '/config/FaceSingleList',
            name: 'FaceSingleList',
            component: FaceSingleList,
            id: 6305,
            meta: {
              level: 2,
              group: '基础配置',
              name: '面单配置'
            }
          },
          {
            path: '/basics/warehouse',
            component: WareHouse,
            name: 'warehouse',
            id: 6306,
            meta: {
              group: '基础配置',
              level: 2,
              name: '仓库地址管理'
            }
          },
          {
            path: '/config/warehouse/edit/:id',
            component: WareHouseEdit,
            name: 'warehouseEdit',
            id: 6306,
            meta: {
              group: '基础配置',
              level: 3,
              name: '修改仓库',
              parent: '/config/warehouse'
            }
          },
          {
            path: '/config/warehouse/position/:id/:warehouseName',
            component: positionWarehouse,
            name: 'position',
            id: 6306,
            meta: {
              group: '基础配置',
              level: 3,
              name: '货位管理',
              parent: '/config/warehouse'
            }
          },
          {
            path: '/config/warehouse/add',
            component: WareHouseEdit,
            name: 'warehouseAdd',
            id: 6306,
            meta: {
              group: '基础配置',
              level: 3,
              name: '添加仓库',
              parent: '/config/warehouse'
            }
          },
          {
            path: '/config/line',
            name: 'linelist',
            component: Line,
            id: 6307,
            meta: {
              group: '基础配置',
              level: 2,
              name: '渠道路线配置'
            }
          },
          {
            path: '/config/line/tmpSet',
            name: 'tmpSet',
            component: tmpSet,
            id: 6307,
            meta: {
              group: '基础配置',
              level: 3,
              name: '模版',
              parent: '/config/line'
            }
          },
          {
            path: '/config/line/sales',
            name: 'salesMana',
            component: salesMana,
            id: 6307,
            meta: {
              group: '基础配置',
              level: 3,
              name: '销售价管理',
              parent: '/config/line'
            }
          },
          {
            path: '/config/line/channel_list/:id',
            name: 'channelLine',
            component: channelLine,
            id: 6307,
            meta: {
              group: '基础配置',
              level: 3,
              name: '渠道',
              parent: '/config/line'
            }
          }
        ]
      },
      {
        path: 'language',
        component: LayoutContainer,
        icon: 'content',
        id: 6400,
        children: [
          {
            path: '/language/support',
            name: 'language',
            component: LanguageSupport,
            id: 6401,
            meta: {
              level: 2,
              group: '语言配置',
              name: '支持语言'
            }
          },
          {
            path: '/language/string',
            name: 'string',
            component: stringTranslate,
            id: 6402,
            meta: {
              level: 2,
              group: '语言配置',
              name: '字符串翻译'
            }
          }
        ]
      },
      {
        path: 'overview',
        component: LayoutContainer,
        icon: 'dataEcharts',
        id: 4600,
        children: [
          {
            path: '/order/orderEcharts',
            name: 'orderEcharts',
            component: orderEcharts,
            id: 4601,
            meta: {
              level: 2,
              group: '数据概览',
              name: '订单概览'
            }
          },
          {
            path: '/pick/pickEcharts',
            name: 'pickEcharts',
            component: pickEcharts,
            id: 4602,
            meta: {
              level: 2,
              group: '数据概览',
              name: '自提点概览'
            }
          },
          {
            path: '/finance/financeCharts',
            name: 'financeCharts',
            component: financeCharts,
            id: 4603,
            meta: {
              group: '数据概览',
              level: 2,
              name: '财务概览'
            }
          },
          {
            path: '/vip/customer/echarts',
            name: 'customerEcharts',
            component: customerEcharts,
            id: 4604,
            meta: {
              level: 2,
              group: '数据概览',
              name: '客户概览'
            }
          },
          {
            path: '/marketing/report',
            name: 'reportList',
            component: reportList,
            id: 4605,
            meta: {
              level: 2,
              group: '数据概览',
              name: '营销报表'
            }
          },
          {
            path: '/goodsAllocation/echarts',
            name: 'goodsAllocation',
            component: GoodsAllocation,
            id: 4606,
            meta: {
              level: 2,
              group: '数据概览',
              name: '仓位概览'
            }
          },
          {
            path: '/goodsAllocation/placeDetail',
            name: 'placeDetail',
            component: GoodsAllocationDetail,
            id: 4606,
            meta: {
              level: 3,
              group: '数据概览',
              name: '货架详细'
            }
          }
        ]
      }
    ]
  }
]
