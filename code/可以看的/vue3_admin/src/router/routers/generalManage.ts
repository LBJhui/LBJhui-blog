import { RouteRecordRaw } from 'vue-router'

const generalManage: RouteRecordRaw = {
  path: '/generalManage',
  meta: {
    fullPath: '/generalManage',
    title: '综合管理',
    isNav: true,
    icon: 'zongheguanli',
    keepalive: true,
  },
  children: [],
}

export default generalManage
