<template>
  <div class="container">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>

    <div class="login-container">
      <div class="login-logo">
        <img
          src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642732494476-0.3641794454153078-login-logo.png" />
      </div>
      <div>
        <!-- tab 标题 -->
        <div class="tab-container">
          <div @click="changeTab('phone')" :class="state.tabName === 'phone' ? 'active' : ''" class="tab-item">
            手机登录
          </div>
          <div :class="state.tabName === 'password' ? 'active' : ''" class="tab-item tabs-item-right"
            @click="changeTab('password')">
            密码登录
          </div>
        </div>
        <!-- 手机号登录 form表单 -->
        <div class="form-container" v-show="state.tabName === 'phone'">
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
          <div class="phone-checkbox-container">
            <van-checkbox v-model="state.autoLogin" checked-color="#164392" shape="square"> 30天自动登录 </van-checkbox>
          </div>
        </div>
        <!-- 密码登录 form表单 -->
        <div class="form-container" v-show="state.tabName === 'password'">
          <div class="input-container">
            <img class="login-form-icon"
              src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642743521277-0.5600251134337246-user.png" />
            <input class="login-form-input" v-model="state.userName" type="text" placeholder="请输入您的姓名"
              @blur="blurValidate('userName')" />
          </div>
          <div class="input-container">
            <img class="login-form-icon"
              src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642742558471-0.06382068160033305-lock.png" />
            <input class="login-form-input" v-model="state.password" type="password" placeholder="请输入您的密码"
              @blur="blurValidate('password')" />
          </div>
          <div class="input-container verify-input-container">
            <img class="login-form-icon"
              src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642742660011-0.39640576996662524-mail.png" />
            <input class="login-form-input" v-model="state.passwordCode" type="text" placeholder="请输入验证码"
              @blur="blurValidate('passwordCode')" maxlength="4" />
            <div class="password-verify-code">
              <canvas ref="verify" class="canvas-verify" @click="handleDraw"></canvas>
            </div>
          </div>
          <div class="checkbox-container">
            <van-checkbox v-model="state.autoLogin" checked-color="#164392" shape="square" state-box="autoLogin">30天自动登录
            </van-checkbox>
            <van-checkbox v-model="state.rememberPassword" checked-color="#164392" shape="square"
              class="remember-password">记住密码
            </van-checkbox>
          </div>
        </div>
        <!-- 登录按钮 -->
        <div class="login-btn" @click="login">登录</div>
        <!-- 手机号登录 底部 -->
        <div class="phone-bottom" v-if="state.tabName === 'phone'" @click="goToPage('register')">
          还没账号，去<span class="bottom-text">快速注册</span>吧！
        </div>
        <!-- 密码登录底部 -->
        <div class="password-bottom" v-if="state.tabName === 'password'">
          <div class="bottom-text" @click="goToPage('resetPassword')">
            忘记密码
            <van-icon name="arrow" color="#164392" class="arrow" />
          </div>
          <div class="password-bottom-right bottom-text" @click="goToPage('register')">
            快速注册
            <van-icon name="arrow" color="#164392" class="arrow" />
          </div>
        </div>
      </div>
    </div>
    <!-- 底部logo -->
    <div class="bottom-logo">N-sight ｜ πspace</div>
  </div>

  <Dialog v-if="state.showDialog" :message="state.dialog.message" :title="state.dialog.title"
    :confirmButtonText="state.dialog.confirmButtonText" @confirmCallback="confirmCallback">
  </Dialog>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'
import { sendSpaceMsg } from '@/api/sendMsg'
import { checkPermission, login as loginAPi } from '@/api/space/user'
import { showToast, aseKey, saveUserInfo, scrollTop } from '@/utils/index'
import { reactive, ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userInfoRes, userInfoInterface } from '@/template/index'

import Dialog from '@/components/Dialog/index.vue'

const router = useRouter()
const route = useRoute()
const reg = /^1[0-9]{10}$/

const state = reactive({
  type: 'space',
  tabName: 'phone',
  phone: '',
  phoneCode: '',
  showDialog: false,
  sendMessage: '验证码',
  sending: false,
  timer: {},
  sendBtnDisabled: false,
  sendMessageWait: 60,
  userName: '',
  password: '',
  passwordCode: '',
  autoLogin: true,
  rememberPassword: true,
  pool: 'abcdefghijklmnopqrstuvwxyz1234567890', // 字符串
  poolNumber: '1234567890',
  width: 340,
  height: 164,
  imgCode: '',
  dialog: {
    title: '提示',
    message: '抱歉，您还未开通权限。',
    confirmButtonText: '我知道了'
  }
})

onMounted(() => {
  document.title = 'πspace登录'
  state.phone = (route.query.phone || '').toString()
  if (!state.phone) {
    let userInfo: userInfoInterface = {
      id: '',
      userName: '',
      password: '',
      phone: '',
      Ncoin: 0,
      avatar: '',
      loginTime: new Date(),
      autoLogin: true,
      rememberPassword: true
    }
    localStorage.getItem('userInfo')
      ? (userInfo = JSON.parse(localStorage.getItem('userInfo') || ''))
      : (userInfo = {
          id: '',
          userName: '',
          phone: '',
          Ncoin: 0,
          avatar: '',
          password: '',
          loginTime: new Date(),
          autoLogin: true,
          rememberPassword: true
        })
    if (userInfo.userName && userInfo.phone) {
      state.userName = userInfo.userName
      state.phone = userInfo.phone
      state.autoLogin = userInfo.autoLogin
      state.rememberPassword = userInfo.rememberPassword
      if (state.rememberPassword) {
        //获取密码
        state.password = CryptoJS.AES.decrypt(userInfo.password, CryptoJS.enc.Utf8.parse(aseKey), {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8)
      }
    }
  }
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
  () => state.passwordCode,
  (newVal) => {
    state.passwordCode = newVal.replace(/[\u4e00-\u9fa5/\s+/]|[^a-zA-Z0-9\u4E00-\u9FA5]/g, '')
  }
)

watch(
  () => state.autoLogin,
  (newVal) => {
    newVal ? (state.rememberPassword = true) : (state.rememberPassword = false)
  }
)

watch(
  () => state.rememberPassword,
  (newVal, oldVal) => {
    state.autoLogin ? (state.rememberPassword = true) : (state.rememberPassword = !oldVal)
  }
)

const changeTab = async (tabName: string) => {
  if (tabName === 'password' && state.tabName === 'phone') {
    handleDraw()
  }
  state.tabName = tabName
}

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
      }
      break
    case 'passwordCode':
      if (!state.passwordCode) {
        showToast('请输入验证码')
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
        showToast('尚未注册，请先注册再登录')
        break
      case 2:
        sendMsg = await sendSpaceMsg({ phone: state.phone })
        if (sendMsg.code) {
          showToast(res.msg)
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
    }
  } catch (error) {
    showToast('验证码发送失败')
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

const login = () => {
  switch (state.tabName) {
    case 'password':
      passwordLogin()
      break
    case 'phone':
      phoneLogin()
      break
  }
}

const phoneLogin = async () => {
  if (!reg.test(state.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  if (!state.phoneCode) {
    showToast('请输入验证码')
    return
  }
  try {
    const res = await loginAPi({
      tab_name: 'phone',
      phone: state.phone,
      code: state.phoneCode,
      type: state.type
    })
    if (res.code) {
      showToast(res.msg)
      return
    }
    loginSuccess(res)
  } catch (error) {
    showToast('用户不存在')
  }
}

const passwordLogin = async () => {
  if (!state.userName) {
    showToast('请输入用户名')
    return
  }
  if (!state.password) {
    showToast('请输入密码')
    return
  }
  if (!state.passwordCode) {
    showToast('请输入验证码')
    return
  }
  if (state.passwordCode !== state.imgCode) {
    showToast('验证码错误')
    handleDraw()
    return
  }
  try {
    const res = await loginAPi({
      tab_name: 'password',
      user_name: state.userName,
      password: state.password,
      type: state.type
    })
    if (res.code) {
      showToast(res.msg)
      return
    }
    loginSuccess(res)
  } catch (error) {
    showToast('用户不存在')
  }
}

const loginSuccess = (res: userInfoRes) => {
  const userInfo: userInfoInterface = {
    id: res.user_info.id,
    userName: res.user_info.userName,
    password: CryptoJS.AES.encrypt(state.password, CryptoJS.enc.Utf8.parse(aseKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(),
    phone: res.user_info.phone,
    Ncoin: res.user_info.Ncoin,
    avatar: res.user_info.avatar,
    loginTime: new Date(),
    autoLogin: state.autoLogin,
    rememberPassword: state.rememberPassword
  }
  saveUserInfo(userInfo, res.token, res.refresh)
  const from = localStorage.getItem('from') || ''
  showToast('登录成功')
  if (!from || from === '/' || from === `/space/register` || from === '/space/resetpassword') {
    router.replace('/space/mine')
  } else {
    router.replace({
      path: from
    })
  }
}

const goToPage = (pageName: string) => {
  switch (pageName) {
    case 'register':
      router.push('/space/register')
      break
    case 'resetPassword':
      router.push('/space/resetpassword')
      break
  }
}

const verify: any = ref(null)

// 点击图片重新绘制
const handleDraw = () => {
  state.imgCode = draw()
  console.log('%c 🥠 state.imgCode: ', 'font-size:20px;background-color: #4b4b4b;color:#fff;', state.imgCode)
}

// 随机数
const randomNum = (min: number, max: number): number => {
  return parseInt(Math.random() * (max - min) + min + '')
}

// 随机颜色
const randomColor = (min: number, max: number): string => {
  const r = randomNum(min, max)
  const g = randomNum(min, max)
  const b = randomNum(min, max)
  return `rgb(${r},${g},${b})`
}

// 绘制图片
const draw = () => {
  // 3.填充背景颜色，背景颜色要浅一点'
  const ctx = verify.value.getContext('2d')
  // 填充颜色
  ctx.fillStyle = randomColor(180, 230)
  // 填充的位置
  ctx.fillRect(0, 0, state.width, state.height)
  // 定义paramText
  let imgCode = ''
  // 4.随机产生字符串，并且随机旋转
  for (let i = 0; i < 4; i++) {
    // 随机的四个字
    const text = state.pool[randomNum(0, state.pool.length)]
    imgCode += text
    // 随机的字体大小
    const fontSize = randomNum(100, 150)
    // 字体随机的旋转角度
    const deg = randomNum(-30, 30)
    /*
     * 绘制文字并让四个文字在不同的位置显示的思路 :
     * 1、定义字体
     * 2、定义对齐方式
     * 3、填充不同的颜色
     * 4、保存当前的状态（以防止以上的状态受影响）
     * 5、平移translate()
     * 6、旋转 rotate()
     * 7、填充文字
     * 8、restore出栈
     * */
    ctx.font = fontSize + 'px Simhei'
    ctx.textBaseline = 'top'
    ctx.fillStyle = randomColor(80, 150)
    /*
     * save() 方法把当前状态的一份拷贝压入到一个保存图像状态的栈中。
     * 这就允许您临时地改变图像状态，
     * 然后，通过调用 restore() 来恢复以前的值。
     * save是入栈，restore是出栈。
     * 用来保存Canvas的状态。save之后，可以调用Canvas的平移、放缩、旋转、错切、裁剪等操作。 restore：用来恢复Canvas之前保存的状态。防止save后对Canvas执行的操作对后续的绘制有影响。
     *
     * */
    ctx.save()
    ctx.translate(55 * i + 40, 20)
    ctx.rotate((deg * Math.PI) / 180)
    // fillText() 方法在画布上绘制填色的文本。文本的默认颜色是黑色。
    // 请使用 font 属性来定义字体和字号，并使用 fillStyle 属性以另一种颜色/渐变来渲染文本。
    // context.fillText(text,x,y,maxWidth);
    ctx.fillText(text, -20 + 5, -15)
    ctx.restore()
  }
  // 5.随机产生5条干扰线,干扰线的颜色要浅一点
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.moveTo(randomNum(0, state.width), randomNum(0, state.height))
    ctx.lineTo(randomNum(0, state.width), randomNum(0, state.height))
    ctx.strokeStyle = randomColor(180, 230)
    ctx.closePath()
    ctx.stroke()
  }
  // 6.随机产生40个干扰的小点
  for (let i = 0; i < 40; i++) {
    ctx.beginPath()
    ctx.arc(randomNum(0, state.width), randomNum(0, state.height), 1, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = randomColor(150, 200)
    ctx.fill()
  }
  return imgCode
}
</script>

<style scoped lang="less">
.container {
  width: 750px;
  min-height: 1449px;
  height: 100vh;
  position: relative;
  background: #164392;
  padding-bottom: 32px;

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

  .login-container {
    width: 654px;
    height: 1046px;
    background: #ffffff;
    box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.2);
    border-radius: 24px;
    position: relative;
    box-sizing: border-box;
    margin: -568px auto 0;

    .login-logo {
      text-align: center;

      img {
        margin: 90px auto 44px;
        width: 510px;
      }
    }

    .tab-container {
      width: 328px;
      margin: 0 auto 60px;
      display: flex;

      .tab-item {
        width: 128px;
        font-size: 32px;
        color: #313836;
        line-height: 48px;
      }

      .tabs-item-right {
        margin-left: 72px;
        text-align: right;
      }

      .active {
        font-weight: 600;
        color: #0f1a30;
        position: relative;
      }

      .active::after {
        position: absolute;
        content: '';
        width: 64px;
        height: 8px;
        background: #f3bb1b;
        border-radius: 4px;
        left: 50%;
        transform: translateX(-50%);
        bottom: -10px;
      }
    }

    .form-container {
      display: flex;
      flex-direction: column;
      margin: 0 auto 20px;
      width: 508px;
      height: 424px;
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

        .password-verify-code {
          width: 168px;
          height: 84px;
          border-radius: 38px;
          overflow: hidden;
          margin: 2px -1px 0 0;

          .canvas-verify {
            width: 168px;
            height: 80px;
          }
        }
      }

      .verify-input-container {
        .login-form-input {
          width: 100px;
        }
      }

      .phone-checkbox-container {
        margin-top: -8px;
        display: flex;
        flex-direction: row-reverse;
        font-size: 28px;
        color: #0f1a30;
        line-height: 44px;
      }

      .checkbox-container {
        display: flex;
        margin-top: 20px;
        padding-left: 38px;
        font-size: 28px;
        color: #0f1a30;
        line-height: 44px;

        .remember-password {
          margin-left: 80px;
        }
      }

      :deep(.van-checkbox__icon--square) {
        font-size: 28px;
      }

      :deep(.van-checkbox__label) {
        margin-left: 6px;
      }
    }

    .login-btn {
      width: 508px;
      height: 80px;
      background: #164392;
      box-shadow: 0px 10px 20px 0px rgba(28, 50, 122, 0.15);
      border-radius: 40px;
      margin: 20px auto 44px;
      text-align: center;
      line-height: 80px;
      font-size: 32px;
      color: #ffffff;
    }

    .phone-bottom {
      text-align: center;
      margin: 22px 0;
      font-size: 28px;
      color: #7a8396;
    }

    .bottom-text {
      font-size: 28px;
      color: #164392;
      line-height: 44px;
    }

    .password-bottom {
      display: flex;
      margin: 22px 0 22px 108px;

      .password-bottom-right {
        margin-left: 144px;
      }

      .arrow {
        font-size: 28px;
      }

      .bottom-text {
        display: inline-flex;
        justify-content: center;
        align-items: center;
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
