import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './zhCN'
import en from './en'

const messages = {
  cn: zhCN,
  en
}

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'cn',
  messages,
  lazy: true
})

export default i18n
