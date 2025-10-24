import { userInfoInterface } from '@/template/index'
import { createRouter, createWebHashHistory } from 'vue-router'
import { getUserInfoById } from '@/api/space/user'
import { userStore } from '@/store/user'
import { clearUserInfo, saveUserInfo } from '@/utils/index'

const routes = [
  {
    path: '/space',
    redirect: '/space/mine',
    component: () => import('../views/space/index/index.vue'),
    children: [
      {
        path: 'mine',
        component: () => import('../views/space/mine/index.vue'),
        meta: { dynamicTitle: true }
      },
      {
        path: 'login',
        component: () => import('../views/space/login/index.vue'),
        meta: { dynamicTitle: true }
      },
      {
        path: 'register',
        component: () => import('../views/space/register/index.vue'),
        meta: { dynamicTitle: true }
      },
      {
        path: 'resetPassword',
        component: () => import('../views/space/resetPassword/index.vue'),
        meta: { dynamicTitle: true }
      },
      {
        path: 'Ncoin',
        component: () => import('../views/space/Ncoin/index.vue'),
        meta: { dynamicTitle: true }
      },
      {
        path: 'zhiCode',
        component: () => import('../views/space/zhiCode/index.vue'),
        meta: { dynamicTitle: true }
      },
      {
        path: 'teaCode',
        redirect: '/space/teaCode/list',
        component: () => import('../views/space/teaCode/index/index.vue'),
        children: [
          {
            path: 'list',
            component: () => import('../views/space/teaCode/list/index.vue'),
            meta: { dynamicTitle: true }
          },
          {
            path: 'code',
            component: () => import('../views/space/teaCode/code/index.vue'),
            meta: { dynamicTitle: true }
          }
        ]
      },
      {
        path: 'reservation',
        redirect: '/space/reservation/index',
        component: () => import('../views/space/reservation/index/index.vue'),
        children: [
          {
            path: 'index',
            component: () => import('../views/space/reservation/status/index.vue'),
            meta: { dynamicTitle: true }
          },
          {
            path: 'reservation',
            component: () => import('../views/space/reservation/reservation/index.vue'),
            meta: { dynamicTitle: true }
          },
          {
            path: 'success',
            component: () => import('../views/space/reservation/success/index.vue'),
            meta: { dynamicTitle: true }
          },
          {
            path: 'cancel',
            component: () => import('../views/space/reservation/cancel/index.vue'),
            meta: { dynamicTitle: true }
          },
          {
            path: 'list',
            component: () => import('../views/space/reservation/list/index.vue'),
            meta: { dynamicTitle: true }
          }
        ]
      },
      {
        path: 'record',
        component: () => import('../views/space/record/index.vue'),
        meta: {
          dynamicTitle: true
        }
      }
    ]
  },
  {
    path: '/map',
    component: () => import('../views/map/index.vue'),
    meta: { dynamicTitle: true }
  },
  {
    path: '/ncoin',
    redirect: '/ncoin/remain',
    component: () => import('../views/ncoin/index/index.vue'),
    children: [
      {
        path: 'remain',
        component: () => import('../views/ncoin/remain/index.vue'),
        meta: { dynamicTitle: true }
      },
      {
        path: 'earn',
        component: () => import('../views/ncoin/earn/index.vue'),
        meta: { dynamicTitle: true }
      },
      {
        path: 'buy',
        component: () => import('../views/ncoin/buy/index.vue'),
        meta: { dynamicTitle: true }
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 不需要登录的页面
const whiteList = ['/space/login', '/space/register', '/space/resetpassword', '/map']

router.beforeEach(async (to, from, next) => {
  if (!to.meta.dynamicTitle) {
    document.title = '\u200E'
  }
  if (to.path === '/space/login') {
    localStorage.setItem('from', from.path)
  }
  if (!whiteList.includes(to.path)) {
    const token = localStorage.getItem('token') || ''
    const refresh = localStorage.getItem('refresh') || ''
    if (!localStorage.getItem('userInfo') || !token || !refresh) {
      clearUserInfo()
      next('/space/login')
    }
    const user = await userStore()
    const userInfo: userInfoInterface = user.getUserInfo
    const localUserInfo = localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo') || '')
    const { id } = localUserInfo
    const loginTime = localUserInfo.loginTime || null
    const autoLogin = localUserInfo.autoLogin || false
    const loginDay = (new Date().getTime() - new Date(loginTime).getTime()) / (1000 * 60 * 60 * 24)
    const loginHour = (new Date().getTime() - new Date(loginTime).getTime()) / (1000 * 60 * 60)
    if (!id || !loginTime || (autoLogin && loginDay >= 30) || (!autoLogin && loginHour >= 2)) {
      clearUserInfo()
      next('/space/login')
    }
    if (!userInfo.id && loginTime) {
      try {
        const res = await getUserInfoById({ id: localUserInfo.id })
        if (res.code) {
          clearUserInfo()
          next('/space/login')
          return
        }
        const userInfo: userInfoInterface = {
          id: res.user_info.id,
          userName: res.user_info.userName,
          password: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo') || '').password,
          phone: res.user_info.phone,
          Ncoin: res.user_info.Ncoin,
          avatar: res.user_info.avatar,
          loginTime,
          autoLogin,
          rememberPassword:
            localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo') || '').rememberPassword
        }
        saveUserInfo(userInfo, res.token, res.refresh)
      } catch (error) {
        clearUserInfo()
        next('/space/login')
      }
    }
  }
  next()
})
