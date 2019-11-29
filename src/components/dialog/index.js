import Vue from 'vue'
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

const mixin = {
  data () {
    return {
      show: false
    }
  }
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
    // 添加转运快递公司
    case 'addCompany':
      instance = new AddCompanyController({
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
