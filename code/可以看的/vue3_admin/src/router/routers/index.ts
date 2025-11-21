import { RouteRecordRaw } from 'vue-router'
import generalManage from './generalManage'
import practice from './practice'

const constantRouter: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
    meta: {
      fullPath: '/dashboard',
      title: '首页',
      keepalive: true,
      isNav: false,
    },
  },
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      fullPath: '/dashboard',
      title: '首页',
      isNav: false,
      icon: 'House',
      keepalive: true,
    },
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      fullPath: '/login',
      title: '登录',
      isNav: false,
      keepalive: true,
    },
  },
  {
    path: '/slot',
    component: () => import('@/views/slot/index.vue'),
    meta: {
      fullPath: '/slot',
      title: 'vue插槽的实现原理',
      isNav: false,
      keepalive: true,
    },
  },
  {
    path: '/uploadFile',
    component: () => import('@/views/uploadFile/index.vue'),
    meta: {
      fullPath: '/uploadFile',
      title: '文件上传',
      isNav: false,
      keepalive: true,
    },
  },
  generalManage,
  practice,
]

export default constantRouter

// const menuListVertical = [
//   {
//     title: '转账划款',
//     icon: 'transaction',
//   },
//   {
//     title: '估值核算',
//     icon: 'guzhihesuan',
//   },
//   {
//     title: '税费中心',
//     icon: 'shuifeizhongxin',
//   },
//   {
//     title: '信息披露',
//     icon: 'xinxipilou',
//   },
//   {
//     title: '绩效分析',
//     icon: 'jixiao',
//   },
//   {
//     title: '系统管理',
//     icon: 'xitongguanli',
//   },
// ]
