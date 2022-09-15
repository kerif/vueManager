import Vue from 'vue';
import {Button, Card} from 'element-ui';
import {Select} from 'element-ui';
import { Option } from 'element-ui';
import { Container,Header,Aside,Main ,Menu,Submenu,MenuItem,MenuItemGroup,
  Dropdown,DropdownMenu,DropdownItem,Row,Col,Table,TableColumn,Icon,
  Breadcrumb,BreadcrumbItem,Tag,Form,FormItem,Input,Switch,DatePicker,
Dialog,Pagination,Message,MessageBox} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

import router from '../router/index.js';
import store from '../store'
import axios from 'axios'

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$EventBus = new Vue() //事件总线, 可用于兄弟组件之间传值

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)

Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)

Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

Vue.use(Row)
Vue.use(Col)
Vue.use(Card)

Vue.use(Table)
Vue.use(TableColumn)

Vue.use(Icon)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.use(Tag)

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Switch)
Vue.use(Input)
Vue.use(DatePicker)

Vue.use(Dialog)

Vue.use(Pagination)
Vue.prototype.$http = axios;
import '../api/mock.js'
new Vue({
  store,
  router,
  // el: '#app',
  render: h => h(App)
}).$mount('#app');