import { RouteRecordRaw } from 'vue-router'

const practice: RouteRecordRaw = {
  path: '/practice',
  meta: {
    fullPath: '/practice',
    title: '练习',
    isNav: true,
    icon: 'practice',
    keepalive: true,
  },
  children: [
    {
      path: 'work',
      meta: {
        fullPath: '/practice/work',
        title: 'work',
        keepalive: true,
        isNav: true,
      },
      children: [
        {
          path: 'communication',
          meta: {
            fullPath: '/practice/work/communication',
            title: 'v-model',
            keepalive: true,
            isNav: true,
          },
          component: () => import('@/views/practice/communication/04_v-model/ModelTest.vue'),
        },
      ],
    },
  ],
}

export default practice
