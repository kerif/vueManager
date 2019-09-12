import Vue from 'vue'
import VipGroup from './vipgroup.vue'
import addStaff from './addStaff.vue'
import staffList from './staffList.vue'
import invoice from './Invoice.vue'

const VipGroupController = Vue.extend(VipGroup)
const AddStaffController = Vue.extend(addStaff)
const StaffListController = Vue.extend(staffList)
const InvoiceController = Vue.extend(invoice)

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
    // 添加员工组
    case 'addStaff':
      instance = new AddStaffController({
        el: document.createElement('div'),
        mixins: [mixin]
      })
      break
    // 员工组成员
    case 'staffList':
      instance = new StaffListController({
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
  instance.success = (data) => {
    callback(data)
  }
  document.body.appendChild(instance.$el)
}
