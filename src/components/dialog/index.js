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

const mixin = {
  data () {
    return {
      show: false
    }
  },
  router,
  store
}

let instance

function initInstance (type) {
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
  }
  instance.constrctType = type
}

export default (props, callback) => {
  if (!instance || instance.constrctType !== props.type) {
    initInstance(props.type)
  }
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      instance[key] = props[key]
    }
  }
  instance.show = true
  if (instance.init) {
    instance.init()
  }
  instance.success = (data) => {
    callback(data)
  }
  document.body.appendChild(instance.$el)
}
