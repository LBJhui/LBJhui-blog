<template>
  <div class="container">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>

    <div class="main-container">
      <van-uploader class="avatar" :before-read="beforeRead" :after-read="afterRead" v-model="state.fileList"
        :max-size="5 * 1024 * 1024" @oversize="onOversize" :deletable="false" :show-upload="true"
        :preview-full-image="false">
        <template #default>
          <img :src="avatar" class="preview-avatar" v-if="state.showPreview">
        </template>
      </van-uploader>
      <div class="title">请扫码进入空间</div>
      <div class="qrcode">
        <qrcode-vue v-if="!state.showMask" :value="state.text" level="H" />
        <div class="mask" v-if="state.showMask" @click="reGetQrcode">
          <img class="warning-icon"
            src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642743571471-0.1715743026860066-warning-circle-fill.png" />
          πspace芝码失效
          <div class="refresh">
            <img class="refresh-icon"
              src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642743274681-0.3802073292747823-sync.png" />
            请点击刷新
          </div>
        </div>
      </div>
      <div class="btn" @click="backToLastPage">返回个人主页</div>
    </div>

    <div class="space-bottom-logo">
      <img src="@/assets/img/space/logo-bottom.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'
import { userStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { showToast, uploadAvatar as afterUploadAvatar } from '@/utils/index'
import { uploadAvatar } from '@/api/upload'

import QrcodeVue from 'qrcode.vue'

const user = userStore()
const router = useRouter()
const userInfo = reactive({
  ...user.getUserInfo
})
const { avatar } = storeToRefs(user)

const state = reactive({
  showMask: false,
  showPreview: true,
  timer: {},
  text: '',
  filename: '',
  fileList: []
})

onMounted(() => {
  document.title = 'πspace芝码'
  getQrcode()
})

onUnmounted(() => {
  timeOver()
})

const timeOver = () => {
  clearInterval(Number(state.timer))
  state.timer = {}
}

const getQrcode = () => {
  const time = new Date().getTime()
  state.text = `type=1&user_id=${userInfo.id}&time=${time}`
  state.timer = setTimeout(() => {
    state.showMask = true
    if (state.showMask) {
      timeOver()
    }
  }, 30000)
}

const reGetQrcode = () => {
  state.showMask = false
  getQrcode()
}

const backToLastPage = () => {
  router.replace('/space/mine')
}
const onOversize = () => {
  showToast('文件大小不能超过 5Mb')
}

const beforeRead = (file) => {
  if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
    state.filename = file.name
    return true
  }
  showToast('请上传正确格式的图片！')
  return false
}

const afterRead = async (file) => {
  state.showPreview = false
  state.fileList = [
    { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg', status: 'uploading', message: '上传中...' }
  ]
  const formData = new FormData()
  formData.append('content', file.content)
  formData.append('filename', state.filename)
  try {
    const res = await uploadAvatar(formData)
    if (res.code) {
      showToast(res.msg)
      state.fileList = []
      state.showPreview = true
      showToast('上传失败')
      return
    }
    res.url && afterUploadAvatar(res.url)
    state.fileList = []
    state.showPreview = true
    showToast('头像上传成功')
  } catch (error) {
    state.fileList = []
    state.showPreview = true
    showToast('上传失败')
  }
}
</script>

<style scoped lang="less">
.container {
  width: 750px;
  background: #ffffff;
  min-height: 1449px;
  height: 100vh;
  position: relative;

  .main-container {
    position: relative;
    margin: -208px auto 0;
    width: 654px;
    height: 1090px;
    background: #ffffff;
    box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.2);
    border-radius: 24px;
    text-align: center;

    .avatar {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      padding: 0;
      margin: 0;
      margin: -70px auto 0;
    }

    .preview-avatar {
      width: 200px;
      height: 200px;
      border-radius: 50%;
    }

    .title {
      margin: 60px 0 38px;
      font-size: 36px;
      font-weight: 600;
      color: #313836;
      line-height: 56px;
    }

    .qrcode {
      width: 444px;
      height: 444px;
      margin: 0 auto;
      position: relative;

      canvas {
        width: 444px !important;
        height: 444px !important;
      }

      .mask {
        font-size: 32px;
        font-weight: 600;
        color: #f3806d;
        line-height: 48px;

        .warning-icon {
          display: block;
          width: 140px;
          margin: 50px auto 22px;
        }

        .refresh {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 70px;
          font-size: 28px;
          color: #7a8396;
          line-height: 44px;

          .refresh-icon {
            width: 26px;
            margin-right: 12px;
          }
        }
      }
    }

    .btn {
      width: 508px;
      height: 80px;
      background: #164392;
      box-shadow: 0px 10px 20px 0px rgba(28, 50, 122, 0.15);
      border-radius: 40px;
      font-size: 32px;
      color: #ffffff;
      line-height: 80px;
      margin: 192px auto 90px;
      text-align: center;
    }
  }
}
</style>
