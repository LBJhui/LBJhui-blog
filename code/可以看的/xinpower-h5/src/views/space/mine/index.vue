<template>
  <div class="container">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>
    <div class="main-container">
      <div class="user-info">
        <van-uploader class="avatar" :before-read="beforeRead" :after-read="afterRead" v-model="state.fileList"
          :max-size="5 * 1024 * 1024" @oversize="onOversize" :deletable="false" :show-upload="true"
          :preview-full-image="false">
          <template #default>
            <img :src="avatar" class="preview-avatar" v-if="state.showPreview">
          </template>
        </van-uploader>
        <div class="info-container">
          <div class="user-name one-row-text">用户名</div>
          <div class="surplus one-row-text">N币余额: {{ userInfo.Ncoin || 0 }}</div>
        </div>
        <div class="logout" @click="touchHandle('退出登录')">退出登录</div>
      </div>
      <div class="card">
        <div class="card-item odd border-radius-top-left" @click="touchHandle('大楼门禁')">
          <div class="imgIcon marginTop64">
            <img src="@/assets/img/space/大楼门禁.png" />
          </div>
          <div class="type">大楼门禁</div>
          <div class="ruler flex-box" @click.stop="touchHandle('门禁使用规则')">
            使用规则
            <van-icon name="arrow" class="ruler-icon" />
          </div>
        </div>
        <div class="card-item even border-radius-top-right" @click="touchHandle('芝码')">
          <div class="imgIcon marginTop64">
            <img src="@/assets/img/space/之码.png" />
          </div>
          <div class="type">芝码</div>
          <div class="ruler flex-box" @click.stop="touchHandle('芝码使用规则')">
            使用规则
            <van-icon name="arrow" class="ruler-icon" />
          </div>
        </div>
        <div class="card-item odd" @click="touchHandle('茶码')">
          <div class="imgIcon marginTop64">
            <img src="@/assets/img/space/茶码.png" />
          </div>
          <div class="type">茶码</div>
          <div class="ruler flex-box" @click.stop="touchHandle('茶码使用规则')">
            使用规则
            <van-icon name="arrow" class="ruler-icon" />
          </div>
        </div>
        <div class="card-item even" @click="touchHandle('座位预约')">
          <div class="imgIcon marginTop64">
            <img src="@/assets/img/space/座位预约.png" />
          </div>
          <div class="type">座位预约</div>
          <div class="ruler flex-box" @click.stop="touchHandle('座位预约使用规则')">
            使用规则
            <van-icon name="arrow" class="ruler-icon" />
          </div>
        </div>
        <div class="card-item odd border-radius-bottom-right" @click="touchHandle('赚取N币')">
          <div class="imgIcon marginTop80">
            <img src="@/assets/img/space/n币.png" />
          </div>
          <div class="type">赚取N币</div>
        </div>
        <div class="card-item even border-radius-bottom-right" @click="touchHandle('我的记录')">
          <div class="imgIcon marginTop80">
            <img src="@/assets/img/space/我的记录.png" />
          </div>
          <div class="type">我的记录</div>
        </div>
      </div>
    </div>
    <div class="space-bottom-logo">
      <img src="@/assets/img/space/logo-bottom.png" />
    </div>

    <Dialog v-if="state.showDialog" :type="state.dialog.type" :message="state.dialog.message"
      :title="state.dialog.title" :confirmButtonText="state.dialog.confirmButtonText" @confirmCallback="confirmCallback"
      @cancelCallback="cancelCallback">
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, onMounted } from 'vue'
import { userStore } from '@/store/user'
import { userInfoInterface } from '@/template/index'
import { useRouter } from 'vue-router'
import { clearUserInfo, showToast, uploadAvatar as afterUploadAvatar } from '@/utils/index'
import { uploadAvatar } from '@/api/upload'
import { storeToRefs } from 'pinia'

import Dialog from '@/components/Dialog/index.vue'

const router = useRouter()
const user = userStore()
const userInfo: userInfoInterface = reactive({
  ...user.getUserInfo
})
const { avatar } = storeToRefs(user)

const state = reactive({
  logout: false,
  showDialog: false,
  showPreview: true,
  dialog: {
    type: '',
    title: '',
    message: '',
    confirmButtonText: '我知道了'
  },
  filename: '',
  fileList: []
})

onBeforeMount(async () => {
  document.title = '个人中心'
  // state.fileList = [{ url: userInfo.avatar }]
})

onMounted(() => {
  state.showPreview = true
})

const touchHandle = (type: string) => {
  switch (type) {
    case '大楼门禁':
      state.dialog = {
        type: '',
        title: '大楼门禁',
        message:
          '根据楼宇防疫要求，\n疫情期间访客预约通道关闭。\n进入展厅请联系工作人员:\n范范:13918189265\n营业时间:周一-周五 9:00-18:00',
        confirmButtonText: '我知道了'
      }
      state.showDialog = true
      break
    case '门禁使用规则':
      state.dialog = {
        type: '',
        title: '门禁使用规则',
        message:
          '根据楼宇防疫要求，\n疫情期间访客预约通道关闭。\n进入展厅请联系工作人员:\n范范:13918189265\n营业时间:周一-周五 9:00-18:00',
        confirmButtonText: '我知道了'
      }
      state.showDialog = true
      break
    case '芝码':
      router.push('/space/zhiCode')
      break
    case '芝码使用规则':
      state.dialog = {
        type: '',
        title: '芝码',
        message: '“芝码”为πspace进门二维码,将二维码对准大门左侧感应屏幕扫描即可入内。',
        confirmButtonText: '我知道了'
      }
      state.showDialog = true
      break
    case '茶码':
      router.push('/space/teaCode/list')
      break
    case '茶码使用规则':
      state.dialog = {
        type: '',
        title: '茶码',
        message:
          '“茶码”为πspace消费一码通,通过N币生成(每50N币生成1个码),可兑换咖啡、零食、礼品。将二维码对准相关设备的感应屏幕,扫描即可使用;\n每码的有效期为兑换后的2小时内,逾期未使用的,N币将返还原账户。',
        confirmButtonText: '我知道了'
      }
      state.showDialog = true
      break
    case '座位预约':
      router.push('/space/reservation/index')
      break
    case '座位预约使用规则':
      state.dialog = {
        type: '',
        title: '座位预约',
        message:
          '洽谈区座位可提前2天进行预约, 同一用户不可在同一时间段预约不同洽谈区,\n点击屏幕"洽谈区"即可进行预约选择。',
        confirmButtonText: '我知道了'
      }
      state.showDialog = true
      break
    case '赚取N币':
      router.push('/space/Ncoin')
      break
    case '我的记录':
      router.push('/space/record')
      break
    case '退出登录':
      state.dialog = {
        type: 'confirm',
        title: '',
        message: '确定退出登录吗？',
        confirmButtonText: '确定退出'
      }
      state.logout = true
      state.showDialog = true
      break
  }
}

const confirmCallback = () => {
  state.showDialog = false
  if (state.logout) {
    logout()
  }
}

const cancelCallback = () => {
  state.showDialog = false
}

const logout = () => {
  clearUserInfo()
  router.push('/space/login')
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

<style lang="less" scoped>
.container {
  width: 750px;
  background: #ffffff;
  min-height: 1449px;
  height: 100vh;
  position: relative;

  .flex-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .border-radius-top-left {
    border-top-left-radius: 24px;
  }

  .border-radius-top-right {
    border-top-right-radius: 24px;
  }

  .border-radius-bottom-left {
    border-bottom-left-radius: 24px;
  }

  .border-radius-bottom-right {
    border-bottom-right-radius: 24px;
  }

  .main-container {
    position: relative;
    margin-top: -222px;

    .user-info {
      width: 654px;
      height: 144px;
      background: #ffffff;
      box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.2);
      border-radius: 24px;
      margin: auto;
      position: relative;

      .avatar {
        width: 156px;
        height: 156px;
        border-radius: 50%;
        padding: 0;
        margin: 0;
        position: absolute;
        top: -56px;
        left: 32px;
      }

      .preview-avatar {
        width: 156px;
        height: 156px;
        border-radius: 50%;
      }

      .info-container {
        margin-left: 220px;
        width: 270px;

        .user-name {
          padding: 22px 0 4px;
          font-size: 32px;
          font-weight: 600;
          color: #313836;
          line-height: 48px;
        }

        .surplus {
          font-size: 28px;
          color: #0f1a30;
          line-height: 44px;
        }
      }

      .logout {
        width: 128px;
        height: 48px;
        background: #f8f9fb;
        border-radius: 24px;
        font-size: 24px;
        color: #164392;
        line-height: 48px;
        text-align: center;
        position: absolute;
        right: 28px;
        bottom: 26px;
      }
    }

    .card {
      display: flex;
      flex-wrap: wrap;
      width: 652px;
      margin: 38px auto 0;
      background: #ffffff;
      box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.2);
      border-radius: 24px;

      .card-item {
        text-align: center;
        width: 50%;
        height: 332px;

        .marginTop64 {
          margin-top: 64px;
        }

        .marginTop80 {
          margin-top: 80px;
        }

        img {
          width: 120px;
          height: 120px;
        }

        .type {
          font-size: 28px;
          color: #0f1a30;
          line-height: 44px;
          margin-bottom: 50px;
        }

        .ruler {
          font-size: 20px;
          color: #7a8396;
          line-height: 20px;
        }

        .ruler .ruler-icon {
          line-height: 24px;
        }
      }

      .odd {
        background: linear-gradient(180deg, rgba(247, 246, 246, 0.6) 0%, rgba(255, 255, 255, 0) 100%);
      }

      .even {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(247, 246, 246, 0.6) 100%);
      }
    }
  }
}
</style>
