import { userInfoInterface } from '@/template/index'
import { Toast, ToastPosition } from 'vant'
import { userStore } from '@/store/user'

const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const showToast = (msg: string, position: ToastPosition = 'bottom') => {
  Toast({
    message: msg,
    position: position
  })
}

// 获取随机验证码，n代表几位
const generateMixed = (n: number) => {
  let res = ''
  for (let i = 0; i < n; i++) {
    const id = Math.ceil(Math.random() * 9)
    res += chars[id]
  }
  return res
}

// 密码加密秘钥
const aseKey = '20222022'

const saveUserInfo = (userInfo: userInfoInterface, token: string, refresh: string) => {
  const user = userStore()
  localStorage.setItem('refresh', refresh)
  localStorage.setItem('token', token)
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
  user.login(userInfo, token, refresh)
}

const uploadAvatar = (avatar: string) => {
  const user = userStore()
  const userInfo: userInfoInterface = JSON.parse(localStorage.getItem('userInfo'))
  userInfo.avatar = avatar
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
  user.uploadAvatar(avatar)
}

const clearUserInfo = () => {
  const user = userStore()
  const userInfoLocal = localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo') || '')
  const userInfo: userInfoInterface = {
    id: '',
    userName: (userInfoLocal && userInfoLocal.userName) || '',
    phone: (userInfoLocal && userInfoLocal.phone) || '',
    password: (userInfoLocal && userInfoLocal.password) || '',
    Ncoin: 0,
    avatar: '',
    loginTime: userInfoLocal && userInfoLocal.loginTime,
    autoLogin: userInfoLocal && userInfoLocal.autoLogin,
    rememberPassword: userInfoLocal && userInfoLocal.rememberPassword
  }
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
  localStorage.removeItem('token')
  localStorage.removeItem('refresh')
  user.logout()
}

const scrollTop = () => {
  const u = navigator.userAgent
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端

  if (isiOS) {
    window.scroll(0, 0)
  }
}

export { showToast, generateMixed, aseKey, saveUserInfo, clearUserInfo, scrollTop, uploadAvatar }
