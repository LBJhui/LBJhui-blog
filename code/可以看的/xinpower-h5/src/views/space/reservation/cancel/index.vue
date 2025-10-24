<template>
  <div class="container" v-if="!state.firstLoading">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>

    <div class="main-container">
      <div class="cancel-container">
        <img
          src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642743020588-0.16261659559220432-reservation-check.png" />
        <div class="success-title">取消成功!</div>
        <div class="reservation-info">
          <div>您已取消【{{ state.room }}】</div>
          <div>预约时间 {{ state.time }}</div>
        </div>
        <div class="reservation-link" data-page="reservationList" @click="goToList">
          查看已有预约
          <van-icon name="arrow" color="#164392" class="bottom-icon" />
        </div>
      </div>
      <div class="tip">（{{ state.second }}秒后，自动跳转到“座位预约”）</div>
      <div class="btn" @click="goToReservation">新增预约</div>
    </div>

    <div class="space-bottom-logo">
      <img src="@/assets/img/space/logo-bottom.png" />
    </div>
  </div>
  <div class="loading-container" v-else></div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const state = reactive({
  firstLoading: true,
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
      goToReservation()
    }
  }, 1000)
}

const timeOver = () => {
  clearInterval(Number(state.timer))
}

const goToList = () => {
  router.replace('/space/reservation/list')
}

const goToReservation = () => {
  router.replace('/space/reservation/reservation')
}

const init = () => {
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

    .cancel-container {
      position: relative;
      width: 654px;
      height: 598px;
      background: #ffffff;
      box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.2);
      border-radius: 24px;
      font-size: 36px;

      img {
        width: 112px;
        height: 112px;
        margin-top: 88px;
      }

      .success-title {
        font-size: 32px;
        font-weight: 600;
        color: #0f1a30;
        line-height: 48px;
      }

      .reservation-info {
        margin: 60px auto 70px;
        width: 372px;
        height: 88px;
        font-size: 28px;
        color: #0f1a30;
        line-height: 44px;
      }

      .reservation-link {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;
        color: #164392;
        line-height: 44px;

        .bottom-icon {
          margin-top: 3px;
          font-size: 28px;
        }
      }
    }

    .tip {
      margin: 60px 0 322px;
      font-size: 28px;
      color: #7a8396;
      line-height: 44px;
    }

    .btn {
      width: 508px;
      height: 80px;
      background: #164392;
      box-shadow: 0rpx 10px 20px 0px rgba(28, 50, 122, 0.15);
      border-radius: 40px;
      font-size: 32px;
      color: #ffffff;
      line-height: 80px;
      text-align: center;
      margin: 0 auto;
    }
  }
}
</style>
