<template>
  <div class="container">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>

    <div class="register-container">
      <div class="login-logo">
        <img
          src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642732494476-0.3641794454153078-login-logo.png" />
      </div>
      <div class="form-container">
        <div class="input-container">
          <img class="login-form-icon"
            src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642743521277-0.5600251134337246-user.png" />
          <input class="login-form-input" v-model="state.userName" type="text" maxlength="10" placeholder="请输入您的姓名"
            @blur="blurValidate('userName')" />
        </div>
        <div class="input-container">
          <img class="login-form-icon"
            src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642742883976-0.935743788219831-mobile.png" />
          <input class="login-form-input" v-model="state.phone" type="text" maxlength="11" placeholder="请输入您的手机号码"
            @blur="blurValidate('phone')" />
        </div>
        <div class="input-container verify-input-container">
          <img class="login-form-icon"
            src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642742660011-0.39640576996662524-mail.png" />
          <input class="login-form-input" v-model="state.phoneCode" type="text" placeholder="请输入验证码"
            @blur="blurValidate('phoneCode')" />
          <div :class="state.sending ? 'phone-verify-code-waiting' : ''" class="phone-verify-code"
            @click="getVerifyCode">
            {{ state.sendMessage }}
          </div>
        </div>
        <div class="input-container">
          <img class="login-form-icon"
            src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642742558471-0.06382068160033305-lock.png" />
          <input class="login-form-input" v-model="state.password" type="password" placeholder="请输入您的密码"
            @blur="blurValidate('password')" />
        </div>
        <div class="input-container">
          <img class="login-form-icon"
            src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642742558471-0.06382068160033305-lock.png" />
          <input class="login-form-input" v-model="state.confirmPassword" type="password" placeholder="请再次输入您的密码"
            @blur="blurValidate('confirmPassword')" />
        </div>
      </div>
      <div class="register-btn" @click="register">注册</div>
      <div class="register-bottom" @click="goToLogin(false)">
        已有账户，<span class="bottom-text">马上登录</span>吧！
      </div>
    </div>

    <!-- 底部logo -->
    <div class="bottom-logo">N-sight ｜ πspace</div>

    <Dialog v-if="state.showDialog" :message="state.dialog.message" :title="state.dialog.title"
      :confirmButtonText="state.dialog.confirmButtonText" @confirmCallback="confirmCallback"></Dialog>
  </div>
</template>

<script setup lang="ts">
import { sendSpaceMsg } from '@/api/sendMsg'
import { checkPermission, register as registerAPi } from '@/api/space/user'
import { reactive, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { scrollTop, showToast } from '@/utils/index'

import Dialog from '@/components/Dialog/index.vue'

const reg = /^1[0-9]{10}$/
const router = useRouter()
const state = reactive({
  type: 'space',
  userName: '',
  phone: '',
  phoneCode: '',
  password: '',
  confirmPassword: '',
  sending: false,
  sendBtnDisabled: false,
  timer: {},
  sendMessage: '验证码',
  sendMessageWait: 60,
  showDialog: false,
  dialog: {
    title: '提示',
    message: '抱歉，您还未开通权限。',
    confirmButtonText: '我知道了'
  }
})

onMounted(() => {
  document.title = 'πspace 用户注册'
})

onUnmounted(() => {
  timeOver()
})

watch(
  () => state.phone,
  (newVal) => {
    state.phone = newVal.replace(/[^\d]/g, '')
  }
)

watch(
  () => state.phoneCode,
  (newVal) => {
    state.phoneCode = newVal.replace(/[^\d]/g, '')
  }
)

watch(
  () => state.userName,
  (newVal) => {
    state.userName = newVal.replace(/[^a-zA-Z0-9\u4E00-\u9FA5]/g, '')
  }
)

watch(
  () => state.password,
  (newVal) => {
    state.password = newVal.replace(/[\u4e00-\u9fa5/\s+/]|[^a-zA-Z0-9\u4E00-\u9FA5]/g, '')
  }
)

watch(
  () => state.confirmPassword,
  (newVal) => {
    state.confirmPassword = newVal.replace(/[\u4e00-\u9fa5/\s+/]|[^a-zA-Z0-9\u4E00-\u9FA5]/g, '')
  }
)

const blurValidate = (val: string) => {
  scrollTop()
  switch (val) {
    case 'phone':
      if (!reg.test(state.phone)) {
        showToast('请输入正确的手机号')
      }
      break
    case 'phoneCode':
      if (!state.phoneCode) {
        showToast('请输入验证码')
      }
      break
    case 'userName':
      if (!state.userName) {
        showToast('请输入用户名')
      }
      break
    case 'password':
      if (!state.password) {
        showToast('请输入密码')
      } else if (state.password.length < 6 || state.password.length > 16) {
        showToast('密码由数字、字母组合,请输入6-16位')
      } else if (state.confirmPassword && state.password !== state.confirmPassword) {
        showToast('两次密码不一致')
      }
      break
    case 'confirmPassword':
      if (!state.confirmPassword) {
        showToast('请再次输入密码')
      } else if (state.confirmPassword.length < 6 || state.confirmPassword.length > 16) {
        showToast('密码由数字、字母组合,请输入6-16位')
      } else if (state.password && state.password !== state.confirmPassword) {
        showToast('两次密码不一致')
      }
      break
  }
}

const getVerifyCode = async () => {
  if (state.sendBtnDisabled) {
    return
  }
  if (!reg.test(state.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  try {
    const res = await checkPermission({ phone: state.phone, type: state.type })
    if (res.code) {
      showToast(res.msg)
      return
    }
    let sendMsg = {} as any
    switch (res.status) {
      case 0:
        state.showDialog = true
        break
      case 1:
        sendMsg = await sendSpaceMsg({ phone: state.phone })
        if (sendMsg.code) {
          showToast(sendMsg.msg)
          return
        }
        state.timer = setInterval(function () {
          state.sendBtnDisabled = true
          state.sendMessage = state.sendMessageWait + 's后重发'
          state.sendMessageWait = state.sendMessageWait - 1
          state.sending = true
          if (state.sendMessageWait < 0) {
            timeOver()
          }
        }, 1000)
        break
      case 2:
        showToast('你的手机号已被注册')
        break
    }
  } catch (error) {
    state.showDialog = true
  }
}

const confirmCallback = () => {
  state.showDialog = false
}

const timeOver = () => {
  clearInterval(Number(state.timer))
  state.timer = {}
  state.sending = false
  state.sendBtnDisabled = false
  state.sendMessage = '验证码'
  state.sendMessageWait = 60
}

const goToLogin = (isRegister: boolean) => {
  if (isRegister) {
    router.replace({
      path: '/space/login',
      query: {
        phone: state.phone
      }
    })
  } else {
    router.replace('/space/login')
  }
}

const register = async () => {
  if (!state.userName) {
    showToast('请输入您的姓名')
  }
  if (!reg.test(state.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  if (!state.phoneCode) {
    showToast('请输入验证码')
    return
  }
  if (!state.password) {
    showToast('请输入密码')
    return
  }
  if (state.password.length < 6 || state.password.length > 16) {
    showToast('密码由数字、字母组合,请输入6-16位')
  }
  if (!state.confirmPassword) {
    showToast('请再次输入密码')
    return
  }
  if (state.password !== state.confirmPassword) {
    showToast('两次密码不一致')
    return
  }
  try {
    const res = await registerAPi({
      user_name: state.userName,
      phone: state.phone,
      code: state.phoneCode,
      password: state.password,
      type: state.type
    })
    if (res.code) {
      showToast(res.msg)
      return
    }
    showToast('注册成功')
    goToLogin(true)
  } catch (error) {
    showToast('注册失败,请稍后重试')
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 750px;
  background: #164392;
  padding-bottom: 32px;
  min-height: 1449px;
  height: 100vh;
  position: relative;

  .bg-color {
    position: relative;

    .bg-color-top {
      width: 0px;
      height: 682px;
      border-width: 0px 0px 178px 750px;
      border-color: transparent transparent transparent #f3bb1b;
      border-style: none none solid solid;
    }

    .bg-color-bottom {
      position: absolute;
      top: 588px;
      right: 0;
      width: 100%;
      height: 176px;
      background-color: #fff;
      transform: skewY(-13.8deg);
    }
  }

  .register-container {
    width: 654px;
    height: 1154px;
    background: #ffffff;
    box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.2);
    border-radius: 24px;
    position: relative;
    box-sizing: border-box;
    margin: -578px auto 0;

    .login-logo {
      text-align: center;

      img {
        margin: 90px auto 44px;
        width: 510px;
      }
    }

    .form-container {
      display: flex;
      flex-direction: column;
      margin: 0 auto 20px;
      width: 508px;
      box-sizing: border-box;

      .input-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        border-radius: 40px;
        width: 508px;
        height: 80px;
        margin-bottom: 40px;
        background-color: #fff;
        border: 2px solid #bac0cc;

        .login-form-icon {
          width: 32px;
          height: 32px;
          margin-left: 34px;
        }

        .login-form-input {
          padding: 0 30px 0 20px;
          font-size: 28px;
          flex: 1;
        }

        .phone-verify-code {
          width: 198px;
          line-height: 84px;
          background: #164392;
          border-radius: 40px;
          text-align: center;
          font-size: 28px;
          color: #ffffff;
          margin: 0px -3px 0 0;
          white-space: nowrap;
        }

        .phone-verify-code-waiting {
          background-color: rgb(186, 192, 204);
        }
      }

      .verify-input-container {
        .login-form-input {
          width: 100px;
        }
      }
    }

    .register-btn {
      width: 508px;
      background: #164392;
      box-shadow: 0px 10px 20px 0px rgba(28, 50, 122, 0.15);
      border-radius: 40px;
      margin: 24px auto 44px;
      text-align: center;
      line-height: 80px;
      font-size: 32px;
      color: #ffffff;
    }

    .register-bottom {
      text-align: center;
      margin: 44px 0;
      font-size: 28px;
      color: #7a8396;

      .bottom-text {
        color: #164392;
        line-height: 44px;
      }
    }
  }

  .bottom-logo {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    color: #e5e7ea;
    line-height: 34px;
  }
}
</style>
