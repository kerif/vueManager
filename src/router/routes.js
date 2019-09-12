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

export default [
  {
    path: 'home',
    redirect: 'home/panel',
    component: LayoutContainer,
    children: [
      {
        path: '/home/panel',
        name: 'panel',
        component: Panel,
        meta: {
          level: 2,
          group: '首页',
          name: '首页'
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
    path: 'config',
    children: [
      {
        path: 'config/line/linelist',
        component: LineList,
        meta: {
          group: '配置',
          level: 2,
          name: '路线'
        }
      }
    ]
  },
  {
    path: 'finance',
    component: LayoutContainer,
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
