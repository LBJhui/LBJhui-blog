<template>
  <div class="container" v-if="!state.firstLoading">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>

    <div class="main-container">
      <div class="list-container" v-if="state.dataList.length && !state.loading">
        <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh" class="scroll-container">
          <van-list v-model:loading="state.loading" :finished="true" @load="getDataList">
            <div class="list-item" v-for="(item, index) in state.dataList" :key="item.id">
              <div class="index">No.{{ index + 1 }}</div>
              <div class="info">
                <div class="room">
                  {{ item.room }}
                </div>
                <div class="date">
                  <div>{{ item.date }}</div>
                  <div>{{ item.time }}</div>
                </div>
                <div class="info-btn">
                  <div class="sm-btn change-btn" @click="modifyReservation(item)">修改</div>
                  <div class="sm-btn cancel-btn" @click="cancelReservation(item)">取消</div>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
        <div class="btn-container">
          <div class="bg-btn reservation-btn" @click="goToPage('reservation')">新增预约</div>
          <div class="reservation-history" @click="goToPage('record')">
            历史预约记录
            <van-icon name="arrow" color="#4C61AE" />
          </div>
        </div>
      </div>

      <div class="empty-container" v-if="!state.dataList.length && !state.loading">
        <img
          src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642735533271-0.35193486027958665-no-reservation.png" />
        <div>您还没有预约洽谈区哦，赶快去预约吧～!</div>
        <div class="bg-btn empty-btn" @click="goToPage('reservation')">洽谈区预约</div>
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
import { reactive, onMounted } from 'vue'
import { userStore } from '@/store/user'
import { router } from '@/router'
import { getReservationByUserId, cancelReservation as cancelReservationApi } from '@/api/space/reservation'

import Dialog from '@/components/Dialog/index.vue'
import { showToast } from '@/utils'

const user = userStore()

const userInfo = reactive({
  ...user.getUserInfo
})

interface Item {
  id: string
  room: string
  date: string
  time: string
}

const state = reactive({
  type: 'space',
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
  dataList: [] as Item[],
  loading: false,
  refreshing: false
})

onMounted(() => {
  document.title = '座位预约'
})

const onRefresh = () => {
  state.refreshing = true
  getDataList()
}

const getDataList = async () => {
  state.loading = true
  try {
    const res = await getReservationByUserId({ user_id: userInfo.id, type: state.type })
    if (res.code) {
      showToast(res.msg)
      return
    }
    state.dataList = res.data
    state.loading = false
    state.refreshing = false
  } catch (error) {
    state.loading = false
    state.dataList = []
    state.refreshing = false
  }
}

const modifyReservation = (item: Item) => {
  router.push({
    path: '/space/reservation/reservation',
    query: {
      id: item.id
    }
  })
}

const cancelReservation = (item: Item) => {
  state.id = item.id
  state.room = item.room
  state.time = item.time
  state.showDialog = true
}

const confirmCallback = async () => {
  try {
    const res = await cancelReservationApi({ id: state.id })
    if (res.code) {
      showToast(res.msg)
      state.showDialog = false
      return
    }
    state.showDialog = false
    router.replace(
      `/space/reservation/cancel?room=${encodeURIComponent(state.room)}&time=${encodeURIComponent(state.time)}`
    )
  } catch (error) {
    state.showDialog = false
    showToast('网络异常，请稍后重试')
  }
}

const cancelCallback = () => {
  state.showDialog = false
}

const goToPage = (pageName: string) => {
  switch (pageName) {
    case 'record':
      router.push('/space/record?tabName=reservation')
      break
    case 'reservation':
      router.push('/space/reservation/reservation')
  }
}

const init = async () => {
  await getDataList()
  state.firstLoading = false
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
    margin: -278px auto 0;
    height: 1299px;
    position: relative;

    .bg-btn {
      width: 508px;
      height: 80px;
      box-shadow: 0px 10px 20px 0px rgba(28, 50, 122, 0.15);
      border-radius: 40px;
      text-align: center;
      font-size: 32px;
      color: #ffffff;
      line-height: 80px;
    }

    .list-container {
      .scroll-container {
        width: 750px;
        height: 1055px;
        background: transparent;
        margin-bottom: -28px;
        overflow-y: auto;

        .list-item {
          width: 654px;
          height: 184px;
          background: #ffffff;
          box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.2);
          border-radius: 24px;
          margin: 0 auto 28px;
          position: relative;

          .index {
            position: absolute;
            left: 38px;
            top: 14px;
            font-size: 24px;
            font-weight: 600;
            color: #7a8396;
            line-height: 24px;
          }

          .info {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-size: 28px;
            color: #0f1a30;
            line-height: 44px;

            .room {
              width: 220px;
              padding-left: 30px;
              box-sizing: border-box;
            }

            .date {
              width: 280px;
            }

            .info-btn {
              flex: auto;
            }

            .sm-btn {
              width: 120px;
              height: 44px;
              border-radius: 26px;
              font-size: 28px;
              color: #ffffff;
              line-height: 44px;
              text-align: center;
            }

            .change-btn {
              background: #f3bb1b;
              margin-bottom: 20px;
            }

            .cancel-btn {
              background: #164392;
            }
          }
        }
      }

      .btn-container {
        position: absolute;
        top: 1104px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;

        .reservation-btn {
          background: #164392;
        }

        .reservation-history {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 40px;
          font-size: 28px;
          color: #4c61ae;
          line-height: 44px;
        }
      }
    }

    .empty-container {
      padding-top: 424px;
      text-align: center;
      font-size: 28px;
      color: #7a8396;
      line-height: 42px;

      img {
        display: inline-block;
        width: 277px;
        margin-bottom: 8px;
      }

      .empty-btn {
        background: #f3bb1b;
        margin: 300px auto 0;
      }
    }
  }
}
</style>
