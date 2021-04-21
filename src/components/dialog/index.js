import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import VipGroup from './vipgroup.vue'
import addStaff from './addStaff.vue'
import staffGroup from './staffGroup.vue'
import invoice from './Invoice.vue'
import ChangeStatus from './changeStatus.vue'
import editVip from './editVip.vue'
import vipList from './vipList.vue'
import AddCountry from './addCountry.vue'
import editPsd from './editPassword.vue'
import PreviewImage from './PreviewImage.vue'
import addInvoice from './addInvoice.vue'
import chooseUser from './chooseUser.vue'
import configuration from './configuration.vue'
import selectCus from './selectCustomer.vue'
import selectGroup from './selectGroup.vue'
import addPackage from './addprops.vue'
import inviteList from './inviteList.vue'
import reviewMsg from './reviewMsg.vue'
import addCompany from './addCompany.vue'
import shipDetails from './shipDetails.vue'
import addTransfer from './addSetting.vue'
import addService from './addEditService.vue'
import addIcon from './addIcon.vue'
import classifyGroup from './classifyAddEdit.vue'
import costAdd from './addCost.vue'
import joinShip from './joinShipping.vue'
import lineChange from './lineChange.vue'
import claim from './claim.vue'
import productList from './productList.vue'
import videoList from './addVideo.vue'
import passedList from './passedProxy.vue'
import locationList from './addEditLocation.vue'
import rechargeMsg from './rechargeMsg.vue'
import lineChoose from './lineChoose.vue'
import feeList from './addFee.vue'
import pickingLog from './pickingLog.vue'
import warehouseTo from './warehouseTo.vue'
import discardList from './diascard.vue'
import invalidLog from './invalidLog.vue'
import voidList from './invalidOrder.vue'
import rechargeAdd from './rechargeAdd.vue'
import reportInvite from './reportInvite.vue'
import commission from './commission.vue'
import languageEdit from './languageAddEdit.vue'
import lineLang from './lineLang.vue'
import warehouseLang from './warehouseLang.vue'
import payLang from './payLang.vue'
import serviceLang from './serviceLang.vue'
import voucherLang from './voucherLang.vue'
import videoLang from './videoLang.vue'
import pcLang from './pcLang.vue'
import propsLang from './propsLang.vue'
import bannerList from './bannerAddEdit.vue'
import bannerLang from './bannerLang.vue'
import warehouseSelf from './warehouseSelf.vue'
import paypalSet from './paypalSet.vue'
import expressEditAdd from './expressAddEdit.vue'
import expressLang from './expressLang.vue'
import rulesEdit from './rulesEdit.vue'
import vipAdd from './vipAdd.vue'
import insuranceEdit from './insuranceEdit.vue'
import setCountry from './setCountry.vue'
import explanationAdd from './insuranceAdd.vue'
import expressChange from './storageChange.vue'
import trackingLang from './trackingLang.vue'
import batchExpress from './batchExpress.vue'
import rebateLang from './rebateLang.vue'
import newLang from './newLang.vue'
import columnChoose from './columnChoose.vue'
import columnLang from './columnLang.vue'
import alipay from './alipay.vue'
import addressEdit from './addressEdit.vue'
import editInfo from './editVipInfo.vue'
import notifyOrder from './notifyOder.vue'
import groupAdd from './groupAdd.vue'
import vipLogs from './vipLogs.vue'
import claimRecord from './claimRecord.vue'
import tariffEditAdd from './tariffEditAdd.vue'
import stringAddEdit from './stringAddEdit.vue'
import pickPoint from './pickPiont.vue'
import fastReceipt from './fastReceipt.vue'
import fastSign from './fastSign.vue'
import fastDelivery from './fastDelivery.vue'
import pickWarehouse from './pickWarehouse.vue'
import commissionAddEdit from './commissionAddEdit.vue'
import addPackages from './addPackages.vue'
import signDetails from './signDetails.vue'
import pickDetails from './pickDetails.vue'
import ottPay from './ottpay.vue'
import settlementDetails from './settlementDetails.vue'
import selfReview from './selfReview.vue'
import payDetails from './payDetails.vue'
import financeReview from './financeReview.vue'
import openLine from './openLine.vue'
import aboutCheck from './checkAbout.vue'

const InviteController = Vue.extend(inviteList)
const VipGroupController = Vue.extend(VipGroup)
const AddStaffController = Vue.extend(addStaff)
const StaffGroupController = Vue.extend(staffGroup)
const InvoiceController = Vue.extend(invoice)
const ChangeStatusController = Vue.extend(ChangeStatus)
const EditVipController = Vue.extend(editVip)
const VipListController = Vue.extend(vipList)
const AddCountryController = Vue.extend(AddCountry)
const EditPasswordController = Vue.extend(editPsd)
const PreviewImageController = Vue.extend(PreviewImage)
const AddInvoiceController = Vue.extend(addInvoice)
const ChooseUserController = Vue.extend(chooseUser)
const ConfigurationController = Vue.extend(configuration)
const SelectCusController = Vue.extend(selectCus)
const SelectGroupController = Vue.extend(selectGroup)
const AddPackageController = Vue.extend(addPackage)
const ReviewMsgController = Vue.extend(reviewMsg)
const AddCompanyController = Vue.extend(addCompany)
const ShipDetailsController = Vue.extend(shipDetails)
const AddTransferController = Vue.extend(addTransfer)
const AddEditServiceController = Vue.extend(addService)
const IconController = Vue.extend(addIcon)
const AddClassifyController = Vue.extend(classifyGroup)
const CostAddController = Vue.extend(costAdd)
const JoinShipController = Vue.extend(joinShip)
const LineChangeController = Vue.extend(lineChange)
const ClaimController = Vue.extend(claim)
const ProductController = Vue.extend(productList)
const VideoController = Vue.extend(videoList)
const PassedController = Vue.extend(passedList)
const LocationListController = Vue.extend(locationList)
const RechargeMsgController = Vue.extend(rechargeMsg)
const LineChooseController = Vue.extend(lineChoose)
const FeeController = Vue.extend(feeList)
const PickingLogController = Vue.extend(pickingLog)
const WarehouseToController = Vue.extend(warehouseTo)
const DiscardController = Vue.extend(discardList)
const InvalidController = Vue.extend(invalidLog)
const VoidListController = Vue.extend(voidList)
const RechargeAddController = Vue.extend(rechargeAdd)
const ReportInviteController = Vue.extend(reportInvite)
const CommissionController = Vue.extend(commission)
const LanguageController = Vue.extend(languageEdit)
const LineLangController = Vue.extend(lineLang)
const WarehouseLangController = Vue.extend(warehouseLang)
const PayLangController = Vue.extend(payLang)
const ServiceLangController = Vue.extend(serviceLang)
const VoucherLangController = Vue.extend(voucherLang)
const VideoLangController = Vue.extend(videoLang)
const PcLangController = Vue.extend(pcLang)
const PropsLangController = Vue.extend(propsLang)
const BannerListController = Vue.extend(bannerList)
const BannerLangController = Vue.extend(bannerLang)
const WarehouseSelfController = Vue.extend(warehouseSelf)
const PayPalSetController = Vue.extend(paypalSet)
const ExpressDetailsController = Vue.extend(expressEditAdd)
const ExpressLangController = Vue.extend(expressLang)
const RulesEditController = Vue.extend(rulesEdit)
const VipAddController = Vue.extend(vipAdd)
const InsuranceEditController = Vue.extend(insuranceEdit)
const SetCountryController = Vue.extend(setCountry)
const ExplanationController = Vue.extend(explanationAdd)
const ExpressLineController = Vue.extend(expressChange)
const TrackingLangController = Vue.extend(trackingLang)
const BatchController = Vue.extend(batchExpress)
const RebateLangController = Vue.extend(rebateLang)
const NewLangController = Vue.extend(newLang)
const ColumnChooseController = Vue.extend(columnChoose)
const ColumnLangController = Vue.extend(columnLang)
const AlipayController = Vue.extend(alipay)
const AddressEditController = Vue.extend(addressEdit)
const EditVipInfoController = Vue.extend(editInfo)
const NotifyOrderController = Vue.extend(notifyOrder)
const GroupAddController = Vue.extend(groupAdd)
const VipLogsController = Vue.extend(vipLogs)
const ClaimRecordController = Vue.extend(claimRecord)
const TariffController = Vue.extend(tariffEditAdd)
const StringController = Vue.extend(stringAddEdit)
const PickPiontController = Vue.extend(pickPoint)
const FastReceiptController = Vue.extend(fastReceipt)
const FastSignController = Vue.extend(fastSign)
const FastDeliveryController = Vue.extend(fastDelivery)
const PickWarehouseController = Vue.extend(pickWarehouse)
const CommissionAddEditController = Vue.extend(commissionAddEdit)
const AddPackagesController = Vue.extend(addPackages)
const SignDetailsController = Vue.extend(signDetails)
const PickDetailsController = Vue.extend(pickDetails)
const OttPayController = Vue.extend(ottPay)
const SettlementDetailsController = Vue.extend(settlementDetails)
const SelfReviewController = Vue.extend(selfReview)
const PayDetailsController = Vue.extend(payDetails)
const FinanceReviewController = Vue.extend(financeReview)
const OpenLineController = Vue.extend(openLine)
const CheckAboutController = Vue.extend(aboutCheck)

const mixin = {
  data() {
    return {
      show: false
    }
  },
  router,
  store
}

let instance

function initInstance(type) {
  switch (type) {
    case 'vipgroup':
      instance = new VipGroupController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    case 'inviteList':
      instance = new InviteController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 添加员工组
    case 'addStaff':
      instance = new AddStaffController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 修改客户组
    case 'editVip':
      instance = new EditVipController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 修改员工密码
    case 'editPsd':
      instance = new EditPasswordController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 员工组成员
    case 'staffGroup':
      instance = new StaffGroupController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 创建发货单
    case 'invoice':
      instance = new InvoiceController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 客户组成员
    case 'vipList':
      instance = new VipListController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    case 'changestatus':
      instance = new ChangeStatusController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    case 'addcountry':
      instance = new AddCountryController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 预览图片
    case 'previewimage':
      instance = new PreviewImageController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 加入发货单
    case 'addInvoice':
      instance = new AddInvoiceController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 选择客户
    case 'chooseUser':
      instance = new ChooseUserController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 支付配置
    case 'configuration':
      instance = new ConfigurationController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 抵用券管理 选择客户
    case 'selectCus':
      instance = new SelectCusController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 抵用券管理 选择客户组
    case 'selectGroup':
      instance = new SelectGroupController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 添加物品属性
    case 'addPackage':
      instance = new AddPackageController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    case 'reviewMsg':
      instance = new ReviewMsgController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 添加物流公司
    case 'addCompany':
      instance = new AddCompanyController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 发货单 详情
    case 'shipDetails':
      instance = new ShipDetailsController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 新增或修改支付配置
    case 'addTransfer':
      instance = new AddTransferController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 新增或修改增值服务
    case 'addService':
      instance = new AddEditServiceController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 增加线路icon
    case 'addIcon':
      instance = new IconController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 增加或修改 商品分类
    case 'classifyGroup':
      instance = new AddClassifyController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 路线 增加费用
    case 'costAdd':
      instance = new CostAddController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 批量加入发货单
    case 'joinShip':
      instance = new JoinShipController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更改线路
    case 'lineChange':
      instance = new LineChangeController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 认领用户
    case 'claim':
      instance = new ClaimController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 商品清单
    case 'productList':
      instance = new ProductController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 添加视频
    case 'videoList':
      instance = new VideoController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 审核通过
    case 'passedList':
      instance = new PassedController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 新增或编辑货位
    case 'locationList':
      instance = new LocationListController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 流水记录审核
    case 'rechargeMsg':
      instance = new RechargeMsgController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    case 'lineChoose':
      instance = new LineChooseController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    case 'feeList':
      instance = new FeeController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 订单 拣货日志
    case 'pickingLog':
      instance = new PickingLogController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 修改所属仓库
    case 'warehouseTo':
      instance = new WarehouseToController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 设为弃件
    case 'discardList':
      instance = new DiscardController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 预报包裹列表 弃件包裹日志
    case 'invalidLog':
      instance = new InvalidController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 作废订单
    case 'voidList':
      instance = new VoidListController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 充值记录 新增
    case 'rechargeAdd':
      instance = new RechargeAddController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 统计报表 邀请记录
    case 'reportInvite':
      instance = new ReportInviteController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 代理管理 设置佣金
    case 'commission':
      instance = new CommissionController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 语言包 添加或编辑支持语言
    case 'languageEdit':
      instance = new LanguageController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 路线 双语弹窗
    case 'lineLang':
      instance = new LineLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 仓库地址 双语弹窗
    case 'warehouseLang':
      instance = new WarehouseLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 支付转账配置 双语弹窗
    case 'payLang':
      instance = new PayLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 订单增值服务 双语弹窗
    case 'serviceLang':
      instance = new ServiceLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 营销管理 抵用券管理 双语弹窗
    case 'voucherLang':
      instance = new VoucherLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 营销管理 视频管理 双语弹窗
    case 'videoLang':
      instance = new VideoLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 pc端配置 双语弹窗
    case 'pcLang':
      instance = new PcLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 基础配置 双语弹窗
    case 'propsLang':
      instance = new PropsLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 营销管理 广告图增加或修改
    case 'bannerList':
      instance = new BannerListController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 营销管理 广告图语言修改
    case 'bannerLang':
      instance = new BannerLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 仓库自提 设为自提
    case 'warehouseSelf':
      instance = new WarehouseSelfController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 paypal 支付
    case 'paypalSet':
      instance = new PayPalSetController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 发货快递公司
    case 'expressEditAdd':
      instance = new ExpressDetailsController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 发货快递公司 修改语言
    case 'expressLang':
      instance = new ExpressLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 单号规则 编辑
    case 'rulesEdit':
      instance = new RulesEditController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 客户 新增
    case 'vipAdd':
      instance = new VipAddController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 修改保险服务
    case 'insuranceEdit':
      instance = new InsuranceEditController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 新增国家地区
    case 'setCountry':
      instance = new SetCountryController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 保险服务 保险说明
    case 'explanationAdd':
      instance = new ExplanationController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 包裹快速入库 更改线路
    case 'expressChange':
      instance = new ExpressLineController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 系统物流类型 更改语言
    case 'trackingLang':
      instance = new TrackingLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 发货单 添加物流信息
    case 'batchExpress':
      instance = new BatchController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 下单返券 修改语言
    case 'rebateLang':
      instance = new RebateLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 新用户福利 管理  修改语言
    case 'newLang':
      instance = new NewLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 官网管理 栏目管理 选择标题
    case 'columnChoose':
      instance = new ColumnChooseController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 官网管理 栏目管理 修改语言
    case 'columnLang':
      instance = new ColumnLangController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 支付配置 支付宝配置
    case 'alipay':
      instance = new AlipayController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 客户 客户地址 编辑地址
    case 'addressEdit':
      instance = new AddressEditController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 客户 查看个人信息
    case 'editInfo':
      instance = new EditVipInfoController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 订单 批量发送通知
    case 'notifyOrder':
      instance = new NotifyOrderController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 新增 拼团配置
    case 'groupAdd':
      instance = new GroupAddController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 客户 操作日志
    case 'vipLogs':
      instance = new VipLogsController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 无人认领包裹 认领记录
    case 'claimRecord':
      instance = new ClaimRecordController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 关税服务
    case 'tariffEditAdd':
      instance = new TariffController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 语言包 字符串翻译
    case 'stringAddEdit':
      instance = new StringController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 员工组列表 自提点权限
    case 'pickPoint':
      instance = new PickPiontController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 自提点 转运包裹管理 快速收货
    case 'fastReceipt':
      instance = new FastReceiptController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 自提点 转运包裹管理 快速签收 快速出库
    case 'fastSign':
      instance = new FastSignController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 自提点 转运包裹管理 快速签收 快速签收
    case 'fastDelivery':
      instance = new FastDeliveryController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 自提点 仓位管理 添加 或编辑
    case 'pickWarehouse':
      instance = new PickWarehouseController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 自提点配置 计佣方式配置 添加 或编辑
    case 'commissionAddEdit':
      instance = new CommissionAddEditController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 订单列表 详情 添加包裹
    case 'addPackages':
      instance = new AddPackagesController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 自提点 转运包裹管理 签收
    case 'signDetails':
      instance = new SignDetailsController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 自提点 签收详情
    case 'pickDetails':
      instance = new PickDetailsController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 支付配置 ottpay
    case 'ottPay':
      instance = new OttPayController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 自提点 自提点概览 佣金报表明细
    case 'settlementDetails':
      instance = new SettlementDetailsController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 自提点 自提点概览 审核支付 操作支付详情
    case 'selfReview':
      instance = new SelfReviewController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 自提点 自提点概览 佣金报表 查看支付详情
    case 'payDetails':
      instance = new PayDetailsController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 财务订单审核 审核或拒绝
    case 'financeReview':
      instance = new FinanceReviewController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 更多配置 保险服务或关税服务 开启线路
    case 'openLine':
      instance = new OpenLineController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 关于我们
    case 'aboutCheck':
      instance = new CheckAboutController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
  }
  instance.constrctType = type
}

export default (props, callback) => {
  if (!instance || instance.constrctType !== props.type) {
    initInstance(props.type)
  }
  for (const key in props) {
    // eslint-disable-next-line no-prototype-builtins
    if (props.hasOwnProperty(key)) {
      instance[key] = props[key]
    }
  }
  instance.show = true
  if (instance.init) {
    instance.init()
  }
  instance.success = data => {
    callback(data)
  }
  document.body.appendChild(instance.$el)
}
