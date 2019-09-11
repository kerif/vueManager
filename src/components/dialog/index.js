import Vue from 'vue'
import VipGroup from './vipgroup.vue'

const VipGroupController = Vue.extend(VipGroup)

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
