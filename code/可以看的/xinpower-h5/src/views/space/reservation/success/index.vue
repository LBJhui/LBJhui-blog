<template>
  <div class="container" v-if="!state.firstLoading">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>

    <div class="main-container">
      <div class="success-container">
        <img
          src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642743020588-0.16261659559220432-reservation-check.png" />
        <div class="success-title">预约成功!</div>
        <div class="reservation-info">
          <div>您已成功预约，预约信息如下:</div>
          <div>座位:【{{ state.room }}】</div>
          <div>时间:{{ state.time }}</div>
          <div>请准时到达。</div>
        </div>
      </div>
      <div class="tip">（{{ state.second }}秒后，自动跳转到“已有预约”）</div>
      <div class="btn-container">
        <div class="btn change-btn" @click="changeReservation">修改预约</div>
        <div class="btn cancel-btn" @click="state.showDialog = true">取消预约</div>
      </div>
    </div>

    <div class="space-bottom-logo">
      <img src="@/assets/img/space/logo-bottom.png" />
    </div>
  </div>
  <div class="loading-container" v-else></div>

  <Dialog v-if="state.showDialog" :type="state.dialog.type" :message="state.dialog.message"
    :confirmButtonText="state.dialog.confirmButtonText" @confirmCallback="confirmCallback"
    @cancelCallback="cancelCallback">
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cancelReservation } from '@/api/space/reservation'
import Dialog from '@/components/Dialog/index.vue'
import { showToast } from '@/utils'

const route = useRoute()
const router = useRouter()

const state = reactive({
  firstLoading: true,
  showDialog: false,
  dialog: {
    type: 'confirm',
    message: '确认取消预约吗?',
    confirmButtonText: '确认'
  },
  id: '',
  room: '',
  time: '',
  timer: {},
  second: 5
})

onMounted(() => {
  state.firstLoading = false
  document.title = '座位预约'
  leavePage()
})

onUnmounted(() => {
  timeOver()
})

const leavePage = () => {
  let second = 5
  state.timer = setInterval(() => {
    state.second = second--
    if (second < 0) {
      timeOver()
      state.timer = {}
      router.replace('/space/reservation/list')
    }
  }, 1000)
}

const timeOver = () => {
  clearInterval(Number(state.timer))
}

const changeReservation = () => {
  router.replace({
    path: '/space/reservation/reservation',
    query: {
      id: state.id
    }
  })
}

const cancelCallback = () => {
  state.showDialog = false
}

const confirmCallback = async () => {
  const res = await cancelReservation({ id: state.id })
  state.showDialog = false
  if (res.code) {
    showToast(res.msg)
    return
  }
  router.replace({
    path: '/space/reservation/cancel',
    query: {
      room: encodeURIComponent(state.room),
      time: encodeURIComponent(state.time)
    }
  })
}

const init = () => {
  state.id = route.query.id?.toString() || ''
  state.room = decodeURIComponent(route.query.room?.toString() || '')
  state.time = decodeURIComponent(route.query.time?.toString() || '')
}

init()
</script>

<style scoped lang="less">
.container {
  width: 750px;
  background: #ffffff;
  min-height: 1449px;
  height: 100vh;
  position: relative;

  .main-container {
    margin: -258px auto 0;
    width: 654px;
    height: 1279px;
    background: #ffffff;
    text-align: center;

    .success-container {
      position: relative;
      width: 654px;
      height: 598px;
      background: #ffffff;
      box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.2);
      border-radius: 24px;
      font-size: 36px;
      box-sizing: border-box;
      text-align: center;

      img {
        width: 112px;
        margin-top: 88px;
      }

      .success-title {
        font-size: 32px;
        font-weight: 600;
        color: #0f1a30;
        line-height: 48px;
      }

      .reservation-info {
        margin: 60px auto 0;
        width: 392px;
        height: 176px;
        font-size: 28px;
        color: #0f1a30;
        line-height: 44px;
        text-align: left;
      }
    }

    .tip {
      margin: 60px 0 244px;
      font-size: 28px;
      color: #7a8396;
      line-height: 44px;
    }

    .btn-container {
      .btn {
        width: 508px;
        height: 80px;
        box-shadow: 0px 10px 20px 0px rgba(28, 50, 122, 0.15);
        border-radius: 40px;
        margin: 0 auto 26px;
        font-size: 32px;
        color: #ffffff;
        line-height: 80px;
        text-align: center;
      }

      .change-btn {
        background: #f3bb1b;
      }

      .cancel-btn {
        background: #164392;
      }
    }
  }
}
</style>
