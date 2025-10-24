import { defineStore } from 'pinia'

import { userInfoInterface } from '@/template/index'

export const userStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'userInfo',
  // state: 返回对象的函数
  state: () => ({
    id: '',
    userName: '',
    password: '',
    phone: '',
    Ncoin: 0,
    avatar: '',
    loginTime: new Date(),
    autoLogin: false,
    rememberPassword: false,
    token: '',
    refresh: ''
  }),
  getters: {
    getUserInfo(state): userInfoInterface {
      const user: userInfoInterface = {
        id: state.id,
        userName: state.userName,
        phone: state.phone,
        password: state.password,
        Ncoin: state.Ncoin,
        avatar: state.avatar,
        loginTime: state.loginTime,
        autoLogin: state.autoLogin,
        rememberPassword: state.rememberPassword
      }
      return user
    }
  },
  actions: {
    login(userInfo: userInfoInterface, token: string, refresh: string) {
      this.id = userInfo.id
      this.userName = userInfo.userName
      this.phone = userInfo.phone
      this.password = userInfo.password
      this.Ncoin = userInfo.Ncoin
      this.avatar = userInfo.avatar
      this.loginTime = userInfo.loginTime
      this.autoLogin = userInfo.autoLogin
      this.rememberPassword = userInfo.rememberPassword
      this.token = token
      this.refresh = refresh
    },
    uploadAvatar(avatar: string) {
      this.avatar = avatar
    },
    logout() {
      this.id = ''
      this.token = ''
      this.refresh = ''
    },
    spend(price: number) {
      this.Ncoin -= price
    }
  }
})
