const loadonDemand = (path) => {
  return () => import(/* webpackChunkName: "chunk" */ `@/views/${path}`)
}

const LayoutContainer = loadonDemand('layout/layoutcontainer')
const Panel = loadonDemand('home/panel')
// 修改密码
const ResetPassword = loadonDemand('home/resetpassword')
// 员工列表
const StaffList = loadonDemand('staff/stafflist')
// 员工组列表
const StaffGroupList = loadonDemand('staff/staffgrouplist')
// 添加、编辑员工
const StaffEdit = loadonDemand('staff/staffaddedit')

export default [
  {
    path: 'home',
    name: 'home',
    redirect: 'home/panel',
    component: LayoutContainer,
    meta: {
      level: 1
    },
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
        path: '/home/resetpassword',
        name: 'resetpassword',
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
    name: 'staff',
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
      }
    ]
  }
]
