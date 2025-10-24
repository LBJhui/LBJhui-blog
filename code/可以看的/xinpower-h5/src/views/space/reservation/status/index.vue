<template>
  <div class="container" v-if="!state.firstLoading">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>

    <div class="main-container">
      <div class="seat-room-container">
        <img
          src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642743115880-0.6331138550322581-seat-h.png" />
        <div class="room-container">
          <div class="room-item">
            <div class="room room-one" :class="state.roomStatus[1] ? 'room-one-active' : ''"></div>
            <div class="room-name">洽谈区1</div>
          </div>
          <div class="room-item">
            <div class="room room-two" :class="state.roomStatus[2] ? 'room-two-active' : ''"></div>
            <div class="room-name">洽谈区2</div>
          </div>
          <div class="room-item">
            <div class="room room-three" :class="state.roomStatus[3] ? 'room-three-active' : ''"></div>
            <div class="room-name">洽谈区3</div>
          </div>
        </div>
        <div class="seat-container">
          <div class="seat seat-one" :class="state.seatStatus[0] ? 'seat-active' : ''"></div>
          <div class="seat seat-two" :class="state.seatStatus[1] ? 'seat-active' : ''"></div>
          <div class="seat seat-three" :class="state.seatStatus[2] ? 'seat-active' : ''"></div>
          <div class="seat seat-four" :class="state.seatStatus[3] ? 'seat-active' : ''"></div>
          <div class="seat seat-five" :class="state.seatStatus[4] ? 'seat-active' : ''"></div>
          <div class="seat seat-six" :class="state.seatStatus[5] ? 'seat-active' : ''"></div>
          <div class="seat seat-seven" :class="state.seatStatus[6] ? 'seat-active' : ''"></div>
          <div class="seat seat-eight" :class="state.seatStatus[7] ? 'seat-active' : ''"></div>
          <div class="seat seat-nine" :class="state.seatStatus[8] ? 'seat-active' : ''"></div>
          <div class="seat seat-ten" :class="state.seatStatus[9] ? 'seat-active' : ''"></div>
          <div class="seat seat-eleven" :class="state.seatStatus[10] ? 'seat-active' : ''"></div>
          <div class="seat seat-twelve" :class="state.seatStatus[11] ? 'seat-active' : ''"></div>
          <div class="seat seat-thirteen" :class="state.seatStatus[12] ? 'seat-active' : ''"></div>
          <div class="seat seat-fourteen" :class="state.seatStatus[13] ? 'seat-active' : ''"></div>
          <div class="seat seat-fifteen" :class="state.seatStatus[14] ? 'seat-active' : ''"></div>
          <div class="seat seat-sixteen" :class="state.seatStatus[15] ? 'seat-active' : ''"></div>
        </div>
      </div>
      <div class="tip">
        实时人数: <span class="people-num">{{ state.peopleNum }}</span> 人
      </div>
      <div v-if="state.isEmpty" class="reservation">
        <img
          src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642735533271-0.35193486027958665-no-reservation.png" />
        <div>您还没有预约洽谈区哦，赶快去预约吧～</div>
        <div class="btn reservation-btn empty-btn" @click="goToPage('reservation')">洽谈区预约</div>
      </div>
      <div v-else class="btn-container">
        <div class="btn reservation-btn" @click="goToPage('reservation')">新增预约</div>
        <div class="btn reservationList-btn" @click="goToPage('list')">查看预约</div>
      </div>
    </div>

    <div class="space-bottom-logo">
      <img src="@/assets/img/space/logo-bottom.png" />
    </div>
  </div>
  <div class="loading-container" v-else></div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'
import { userStore } from '@/store/user'
import { useRouter } from 'vue-router'
import {
  getReservationByUserId,
  isReservationByManager,
  getRoomStatus as getRoomStatusApi
} from '@/api/space/reservation'
import { showToast } from '@/utils'
import axios from 'axios'

const router = useRouter()
const user = userStore()

const userInfo = reactive({
  ...user.getUserInfo
})
const state = reactive({
  type: 'space',
  firstLoading: true,
  roomStatus: {
    1: false,
    2: false,
    3: false
  },
  seatStatus: [] as number[],
  peopleNum: 0,
  isEmpty: true,
  timer: {}
})

onMounted(() => {
  document.title = '座位预约'
})

onUnmounted(() => {
  timerOver()
})

const goToPage = (pageName: string) => {
  router.push(`/space/reservation/${pageName}`)
}

const getEmptyStatus = async () => {
  try {
    const res = await getReservationByUserId({ user_id: userInfo.id, type: state.type })
    if (res.code) {
      showToast(res.msg)
      return
    }
    res.data.length ? (state.isEmpty = false) : (state.isEmpty = true)
  } catch (error) {
    state.isEmpty = true
  }
}

const setTimeoutStatus = async () => {
  try {
    const res = await isReservationByManager({ type: state.type })
    if (res.isRerservation) {
      state.roomStatus = {
        1: true,
        2: true,
        3: true
      }
      state.seatStatus = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      getPeopleNum()
      state.timer = setInterval(() => {
        getPeopleNum()
      }, 3000)
    } else {
      getRoomStatus()
      getSeatStatus()
      state.timer = setInterval(() => {
        getRoomStatus()
        getSeatStatus()
      }, 3000)
    }
  } catch (error) {
    state.roomStatus = {
      1: false,
      2: false,
      3: false
    }
    state.peopleNum = 0
    state.seatStatus = []
  }
}

const checkTime = () => {
  const nowHour = new Date().getHours()
  if (nowHour < 9 || nowHour >= 18) {
    return false
  } else {
    return true
  }
}

const getRoomStatus = async () => {
  const valueTime = checkTime()
  if (!valueTime) {
    state.roomStatus = {
      1: false,
      2: false,
      3: false
    }
    return
  }
  try {
    const res = await getRoomStatusApi({ type: state.type })
    if (res.code) {
      showToast(res.msg)
      return
    }
    state.roomStatus = res.data
  } catch (error) {
    state.roomStatus = {
      1: false,
      2: false,
      3: false
    }
  }
}

const getPeopleNum = () => {
  axios
    .get('http://101.230.205.156:8801/api/query/getSeatInfoAndHallPeopleNum')
    .then((res) => {
      if (res.data.code == 200) {
        state.peopleNum = res.data.data.peopleNum
      } else {
        state.peopleNum = 0
      }
    })
    .catch(() => {
      state.peopleNum = 0
    })
}

const getSeatStatus = () => {
  axios
    .get('http://101.230.205.156:8801/api/query/getSeatInfoAndHallPeopleNum')
    .then((res) => {
      if (res.data.code == 200) {
        const seat = res.data.data.seatInfo
        const index: any = {
          '1': 1,
          '2': 2,
          '3': 3,
          '4': 4,
          '5': 5,
          '6': 6,
          '7': 7,
          '8': 8,
          s1001: 16,
          s1002: 15,
          s1003: 14,
          s1004: 13,
          s1005: 12,
          s1006: 10,
          s1007: 9,
          s1008: 11
        }
        seat.forEach((item: any) => {
          if (index[item.seatNo]) {
            state.seatStatus[index[item.seatNo] - 1] = item.state * 1
          }
        })
      } else {
        state.peopleNum = 0
        state.seatStatus = []
      }
    })
    .catch(() => {
      state.peopleNum = 0
      state.seatStatus = []
    })
}

const timerOver = () => {
  clearInterval(Number(state.timer))
}

const init = async () => {
  await getEmptyStatus()
  state.firstLoading = false
  setTimeoutStatus()
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

    .seat-room-container {
      width: 650px;
      height: 414px;
      background-color: #fff;
      box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.15);
      border-radius: 24px;
      box-sizing: border-box;
      padding: 30px 20px 32px 18px;
      position: relative;
      margin: 0 auto;

      img {
        width: 612px;
      }

      .room-container {
        position: absolute;
        width: 398px;
        height: 88px;
        left: 208px;
        top: 30px;

        .room-item {
          display: inline-block;
          width: 120px;
          height: 100%;
          margin-left: 10px;
          position: relative;

          .room-one,
          .room-two {
            background-color: #2dbe87;
            width: 100%;
            height: 100%;
            border-radius: 6px;
            transform: skew(15deg);
          }

          .room-one-active,
          .room-two-active {
            background-color: #f3806d;
          }

          .room-three {
            margin: 0 0 0 -12px;
            width: 120px;
            height: 0;
            border-width: 88px 0px 0px 25px;
            border-style: solid solid none;
            border-color: #2dbe87 transparent transparent;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
          }

          .room-three-active {
            border-color: #f3806d transparent transparent;
          }

          .room-name {
            position: absolute;
            font-size: 20px;
            color: #ffffff;
            line-height: 20px;
            left: 20px;
            bottom: 8px;
          }
        }
      }

      .seat-container {
        .seat {
          position: absolute;
          width: 20px;
          height: 20px;
          background: #2dbe87;
          border-radius: 100%;
        }

        .seat-active {
          background: #f3806d;
        }

        .seat-one {
          top: 90px;
          left: 80px;
        }

        .seat-two {
          top: 120px;
          left: 80px;
        }

        .seat-three {
          top: 150px;
          left: 80px;
        }

        .seat-four {
          top: 180px;
          left: 80px;
        }

        .seat-five {
          top: 90px;
          left: 140px;
        }

        .seat-six {
          top: 120px;
          left: 140px;
        }

        .seat-seven {
          top: 150px;
          left: 140px;
        }

        .seat-eight {
          top: 180px;
          left: 140px;
        }

        .seat-nine {
          top: 212px;
          left: 260px;
        }

        .seat-ten {
          top: 250px;
          left: 240px;
        }

        .seat-eleven {
          top: 198px;
          left: 330px;
        }

        .seat-twelve {
          top: 240px;
          left: 292px;
        }

        .seat-thirteen {
          top: 210px;
          left: 356px;
        }

        .seat-fourteen {
          top: 205px;
          left: 401px;
        }

        .seat-fifteen {
          top: 249px;
          left: 526px;
        }

        .seat-sixteen {
          top: 272px;
          left: 566px;
        }
      }
    }

    .tip {
      font-size: 28px;
      color: #7a8396;
      line-height: 40px;
      margin: 28px auto 236px;
      width: 650px;
      text-align: right;

      .people-num {
        font-size: 36px;
        font-weight: 600;
        color: #2dbe87;
        line-height: 56px;
      }
    }
    .reservation {
      font-size: 28px;
      color: #7a8396;
      line-height: 42px;
      text-align: center;
      height: 545px;
      img {
        width: 276px;
      }
    }
    .btn-container {
      height: 389px;
      margin-top: 392px;
      .reservationList-btn {
        margin-top: 26px;
        background: #164392;
      }
    }
    .btn {
      width: 508px;
      height: 80px;
      box-shadow: 0px 10px 20px 0px rgba(28, 50, 122, 0.15);
      border-radius: 40px;
      line-height: 80px;
      text-align: center;
      font-size: 32px;
      color: #ffffff;
      margin: auto;
    }
    .reservation-btn {
      background: #f3bb1b;
    }
    .empty-btn {
      margin-top: 48px;
    }
  }
}
</style>
