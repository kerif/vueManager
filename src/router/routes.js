const loadonDemand = (path) => {
  return () => import(/* webpackChunkName: "chunk" */ `@/views/${path}`)
}

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
// 客户地址
const VipAddressList = loadonDemand('vip/vipaddress/vipaddresslist')
// 财务 流水记录
const Transaction = loadonDemand('finance/Transaction')
// 配置 路线列表
const LineList = loadonDemand('config/line/LineList')
// 配置 添加、修改路线
const LineAddEdit = loadonDemand('config/line/LineAddEdit')
// 配置 仓库地址
const WareHouse = loadonDemand('config/warehouse/warehouse')
// 配置 下单须知列表
const NoticeList = loadonDemand('config/notice/NoticeList')
// 配置 添加、修改下单须知
const NoticeAddEdit = loadonDemand('config/notice/NoticeAddEdit')
// 配置 投诉建议列表
const SuggestList = loadonDemand('config/suggest/Suggest')
// 入库
const Storage = loadonDemand('station/storage')
// 发货
const Ship = loadonDemand('station/ship')
// 拣货日志
const Picking = loadonDemand('station/picking')
// 订单 订单列表
const OrderList = loadonDemand('order/order/OrderList')
// 订单 运单列表
const WaybillList = loadonDemand('order/waybill/WaybillList')
// 订单 运单详情
const Billdetails = loadonDemand('order/waybill/billDetails')
// 订单 运单打包
const Billpacked = loadonDemand('order/waybill/billPacked')

export default [
  {
    path: 'home',
    redirect: 'home/panel',
    component: LayoutContainer,
    icon: 'icon-ico_home',
    children: [
      {
        path: '/home/panel',
        name: 'panel',
        icon: '',
        component: Panel,
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
    children: [
      {
        path: '/staff/stafflist',
        name: 'stafflist',
        component: StaffList,
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
        meta: {
          level: 2,
          group: '员工',
          name: '员工组列表'
        }
      },
      {
        path: '/staff/modify_permissions',
        name: 'modifyPermissions',
        component: modifyPre,
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
    children: [
      {
        path: '/vip/viplist',
        name: 'viplist',
        component: VipList,
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
        meta: {
          level: 2,
          group: '客户',
          name: '客户地址'
        }
      }
    ]
  },
  {
    path: 'order',
    component: LayoutContainer,
    icon: 'icon-ico_yuebao',
    children: [
      {
        path: '/order/orderlist',
        component: OrderList,
        name: 'orderlist',
        meta: {
          level: 2,
          group: '订单',
          name: '国内订单'
        }
      },
      {
        path: '/order/waybill_list',
        component: WaybillList,
        name: 'wayBillList',
        meta: {
          level: 2,
          group: '订单',
          name: '运单'
        }
      },
      {
        path: '/order/billDetails/:id',
        name: 'billDetails',
        component: Billdetails,
        meta: {
          level: 3,
          group: '订单',
          name: '详情',
          parent: '/order/waybill_list'
        }
      },
      {
        path: '/order/billPacked/:id/:order_sn',
        name: 'billPacked',
        component: Billpacked,
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
    children: [
      {
        path: '/station/storage',
        name: 'storageContainer',
        component: Storage,
        meta: {
          level: 2,
          group: '货站',
          name: '入库'
        }
      },
      {
        path: '/station/storage/:id/:express_num',
        name: 'editStorage',
        component: Storage,
        meta: {
          level: 3,
          group: '货站',
          name: '入库',
          parent: '/station/storage'
        }
      },
      {
        path: '/station/ship',
        name: 'shipContainer',
        component: Ship,
        meta: {
          level: 2,
          group: '货站',
          name: '发货'
        }
      },
      {
        path: '/station/picking',
        name: 'pickingContainer',
        component: Picking,
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
    children: [
      {
        path: '/config/line/linelist',
        name: 'linelist',
        component: LineList,
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
        meta: {
          group: '配置',
          level: 3,
          name: '添加路线',
          parent: '/config/line/linelist'
        }
      },
      {
        path: '/config/line/lineedit/:state/:id',
        component: LineAddEdit,
        name: 'lineedit',
        meta: {
          group: '配置',
          level: 3,
          name: '修改路线',
          parent: '/config/line/linelist'
        }
      },
      {
        path: '/config/warehouse',
        component: WareHouse,
        name: 'warehouse',
        meta: {
          group: '配置',
          level: 2,
          name: '仓库地址配置'
        }
      },
      {
        path: '/config/notice',
        component: NoticeList,
        name: 'noticelist',
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
        meta: {
          group: '配置',
          level: 3,
          name: '修改下单须知',
          parent: '/config/notice'
        }
      },
      {
        path: '/config/suggest',
        name: 'suggestlist',
        component: SuggestList,
        meta: {
          level: 2,
          group: '配置',
          name: '投诉建议'
        }
      }
    ]
  },
  {
    path: 'finance',
    component: LayoutContainer,
    icon: 'icon-feiyongduoweifenxi',
    children: [
      {
        path: '/finance/transaction',
        component: Transaction,
        meta: {
          group: '财务',
          level: 2,
          name: '流水记录'
        }
      }
    ]
  }
]
