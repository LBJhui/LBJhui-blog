<template>
  <div class="container" v-if="!state.firstLoading">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>
    <div class="main-container">
      <div class="reservation-container">
        <div class="seat-room-container">
          <div class="bg-img">
            <img
              src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642743209515-0.2986526919004149-seat-v.png" />
          </div>
          <div class="room-container">
            <div class="room-item" @click="showModel('3')">
              <div class="room room-three" :class="[
                  state.roomStatus[3] && state.form.room !== '洽谈区3' ? 'room-three-full' : '',
                  state.form.room === '洽谈区3' ? 'room-three-active' : ''
                ]"></div>
              <img class="room-three-icon"
                src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642735738123-0.14689940290089054-check-circle-fill.png"
                v-if="state.form.room === '洽谈区3' && !state.roomStatus[3]" />
              <span class="room-name room-three-name"
                :class="{ 'room-three-name-active': state.form.room === '洽谈区3' && !state.roomStatus[3] }"
                v-if="!state.roomStatus[3]">
                洽谈区3
              </span>
              <span class="room-name room-three-name-full" v-else> 洽谈区3<br />(已约满) </span>
            </div>
            <div class="room-item" @click="showModel('2')">
              <div class="room room-two" :class="[
                  state.roomStatus[2] && state.form.room !== '洽谈区2' ? 'room-two-full' : '',
                  state.form.room === '洽谈区2' ? 'room-two-active' : ''
                ]"></div>
              <img class="room-icon"
                src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642735738123-0.14689940290089054-check-circle-fill.png"
                v-if="state.form.room === '洽谈区2' && !state.roomStatus[2]" />
              <span class="room-name"
                :class="{ 'room-name-active': state.form.room === '洽谈区2' && !state.roomStatus[2] }"
                v-if="!state.roomStatus[2]">
                洽谈区2
              </span>
              <span class="room-name room-name-full" v-else> 洽谈区2<br />(已约满) </span>
            </div>
            <div class="room-item" @click="showModel('1')">
              <div class="room room-one" :class="[
                  state.roomStatus[1] && state.form.room !== '洽谈区1' ? 'room-one-full' : '',
                  state.form.room === '洽谈区1' ? 'room-one-active' : ''
                ]"></div>
              <img class="room-icon"
                src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642735738123-0.14689940290089054-check-circle-fill.png"
                v-if="state.form.room === '洽谈区1' && !state.roomStatus[1]" />
              <span class="room-name"
                :class="{ 'room-name-active': state.form.room === '洽谈区1' && !state.roomStatus[1] }"
                v-if="!state.roomStatus[1]">
                洽谈区1
              </span>
              <span class="room-name room-name-full" v-else> 洽谈区1<br />(已约满) </span>
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
        <div class="tip flex-box">
          <div class="tip-item">
            <div class="square reservation"></div>
            可预约
          </div>
          <div class="tip-item">
            <div class="square no-reservation"></div>
            不可预约
          </div>
          <div class="tip-item">
            <div class="square reservating">
              <img
                src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642735738123-0.14689940290089054-check-circle-fill.png" />
            </div>
            已预约
          </div>
        </div>
        <div class="reservation-info" v-if="state.form.date && state.form.time">
          <div class="reservation-info-item">
            <div class="table-title">座位</div>
            <div class="table-content">
              <div>
                {{ state.form.room }}
              </div>
            </div>
          </div>
          <div class="reservation-info-item">
            <div class="table-title">日期</div>
            <div class="table-content">
              <div>
                {{ state.form.date }}
              </div>
            </div>
          </div>
          <div class="reservation-info-item">
            <div class="table-title">时间</div>
            <div class="table-content">
              <div>
                {{ state.form.time }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="reservation-tip" v-if="!state.form.date || !state.form.time">洽谈区有限，赶快预约吧～</div>
      <div class="confirm-btn" :class="state.form.date && state.form.time ? '' : 'disabled'" @click="submitReservation">
        确认预约
      </div>
    </div>

    <div class="mask" v-if="state.showModel"></div>
    <div class="model" v-if="state.showModel">
      <div class="model-title">所选座位: {{ state.choose.room }}</div>
      <div class="date-container">
        <div class="sub-title">请选择预约日期</div>
        <div class="date flex-box">
          <div class="date-item" :class="state.choose.date === item ? 'date-item-choose' : ''"
            v-for="(item, index) in state.dateList" :key="index" @click="chooseDate(item)">
            {{ item }}
          </div>
        </div>
        <div class="top-tip">今天</div>
      </div>
      <div class="time-container">
        <div class="sub-title">请选择预约时间段</div>
        <div class="time flex-box">
          <div class="time-item flex-box" :class="[
              (state.status[state.choose.date] && state.status[state.choose.date][0]) ||
              (state.currentHour >= 12 && state.choose.date === state.dateList[0])
                ? 'time-item-disable'
                : '',
              state.choose.time === '09:00-12:00' ? 'time-item-choose' : ''
            ]" data-time="09:00-12:00" @click="chooseTime('09:00-12:00')">
            <div class="time-tip" v-if="
                state.status[state.choose.date] &&
                state.status[state.choose.date][0] &&
                state.choose.time !== '09:00-12:00'
              ">
              已预约
            </div>
            <div class="time-tip" v-if="
                !(state.status[state.choose.date] && state.status[state.choose.date][0]) &&
                state.currentHour >= 12 &&
                state.choose.date === state.dateList[0] &&
                state.choose.time !== '09:00-12:00'
              ">
              已超时
            </div>
            <img class="choose-time-icon"
              src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642735738123-0.14689940290089054-check-circle-fill.png"
              v-if="state.choose.time === '09:00-12:00'" />
            <div class="time-type">上午</div>
            <div class="time-range">09:00-12:00</div>
          </div>
          <div class="time-item flex-box" :class="[
              (state.status[state.choose.date] && state.status[state.choose.date][1]) ||
              (state.currentHour >= 18 && state.choose.date === state.dateList[0])
                ? 'time-item-disable'
                : '',
              state.choose.time === '12:00-18:00' ? 'time-item-choose' : ''
            ]" data-time="12:00-18:00" @click="chooseTime('12:00-18:00')">
            <div class="time-tip" v-if="
                state.status[state.choose.date] &&
                state.status[state.choose.date][1] &&
                state.choose.time !== '12:00-18:00'
              ">
              已预约
            </div>
            <div class="time-tip" v-if="
                !(state.status[state.choose.date] && state.status[state.choose.date][1]) &&
                state.currentHour >= 18 &&
                state.choose.date === state.dateList[0] &&
                state.choose.time !== '12:00-18:00'
              ">
              已超时
            </div>
            <img class="choose-time-icon"
              src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642735738123-0.14689940290089054-check-circle-fill.png"
              v-if="state.choose.time === '12:00-18:00'" />
            <div class="time-type">下午</div>
            <div class="time-range">12:00-18:00</div>
          </div>
        </div>
      </div>
      <div class="btn-container flex-box">
        <div class="btn close" @click="closeModel">关闭</div>
        <div class="btn confirm" @click="confirmModel">确认</div>
      </div>
    </div>

    <div class="toast" v-if="state.toast">
      <div class="toast-title">提示</div>
      <div class="toast-content">同一时间段，不能重复预约哦～</div>
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
import { showToast } from '@/utils/index'
import { useRoute, useRouter } from 'vue-router'
import {
  isReservationByManager,
  isFullReservation,
  getReservationListByRoom,
  isReservationUser,
  addReservation,
  getReservationById as getReservationByIdApi
} from '@/api/space/reservation'

import _ from 'lodash'
import axios from 'axios'
import dayjs from 'dayjs'

const user = userStore()
const route = useRoute()
const router = useRouter()

const userInfo = reactive({
  ...user.getUserInfo
})

interface RoomStatus {
  '1': boolean
  '2': boolean
  '3': boolean
}

const state = reactive({
  type: 'space',
  firstLoading: true,
  roomStatus: {
    '1': false,
    '2': false,
    '3': false
  } as RoomStatus,
  seatStatus: [] as number[],
  id: '',
  form: {
    room: '',
    date: '',
    time: ''
  },
  choose: {
    room: '',
    date: '',
    time: ''
  },
  showModel: false,
  isReservationUser: true,
  dateList: ['', '', ''],
  status: {} as any,
  toast: false,
  currentHour: 0,
  timer: {}
})

onMounted(() => {
  document.title = '座位预约'
})

onUnmounted(() => {
  timerOver()
})

//生成日历数据
const getDateList = () => {
  const current = new Date()
  const today = dayjs(current).format('YYYY-MM-DD')
  const tomorrow = dayjs(current).add(1, 'day').format('YYYY-MM-DD')
  const nextTomorrow = dayjs(current).add(2, 'day').format('YYYY-MM-DD')
  state.dateList = [today, tomorrow, nextTomorrow]
}

const chooseDate = (date: string) => {
  state.choose.date = date
  switch (state.choose.time) {
    case '09:00-12:00':
      if ((state.status && state.status[date] && state.status[date][0]) || state.currentHour > 12) {
        state.choose.time = ''
      }
      break
    case '12:00-18:00':
      if ((state.status && state.status[date] && state.status[date][1]) || state.currentHour > 18) {
        state.choose.time = ''
      }
      break
  }
}

const chooseTime = (time: string) => {
  switch (time) {
    case '09:00-12:00':
      if (
        !(
          (state.status[state.choose.date] && state.status[state.choose.date][0]) ||
          (state.currentHour >= 12 && state.choose.date === state.dateList[0])
        )
      ) {
        state.choose.time = time
      }
      break
    case '12:00-18:00':
      if (
        !(
          (state.status[state.choose.date] && state.status[state.choose.date][1]) ||
          (state.currentHour >= 18 && state.choose.date === state.dateList[0])
        )
      ) {
        state.choose.time = time
      }
      break
  }
}

const showModel = (roomNum: string) => {
  getDateList()
  const room = '洽谈区' + roomNum
  if (state.form.room === room) {
    state.choose = _.cloneDeep(state.form)
    state.showModel = true
    state.currentHour = new Date().getHours()
  } else {
    if (!state.roomStatus[roomNum as keyof RoomStatus]) {
      state.choose.room = room
      state.showModel = true
      state.currentHour = new Date().getHours()
    }
  }
  getStatusByRoom()
  getReservationUser()
}

const getStatusByRoom = async () => {
  try {
    const res = await getReservationListByRoom({ room: state.choose.room, type: state.type })
    if (!res.data.length) {
      return
    }
    let status: any = {}
    res.data.forEach((item: { date: string; time: string }) => {
      if (status[item.date]) {
        switch (item.time) {
          case '09:00-12:00':
            status[item.date][0] = 1
            break
          case '12:00-18:00':
            status[item.date][1] = 1
            break
        }
      } else {
        status[item.date] = []
        switch (item.time) {
          case '09:00-12:00':
            status[item.date] = [1, 0]
            break
          case '12:00-18:00':
            status[item.date] = [0, 1]
            break
        }
      }
    })
    state.status = status
  } catch (error) {
    state.status = {}
  }
}

const getReservationUser = async () => {
  try {
    const res = await isReservationUser({ user_id: userInfo.id, type: state.type })
    state.isReservationUser = res.isReservationUser
  } catch (error) {
    state.isReservationUser = true
  }
}

const closeModel = () => {
  state.choose = {
    room: '',
    date: '',
    time: ''
  }
  state.showModel = false
}

const confirmModel = () => {
  if (!state.choose.date) {
    showToast('请选择预约日期')
    return
  }
  if (!state.choose.time) {
    showToast('请选择预约时间段')
    return
  }
  state.form = _.cloneDeep(state.choose)
  state.choose = {
    room: '',
    date: '',
    time: ''
  }
  state.showModel = false
}

const submitReservation = async () => {
  if (!state.isReservationUser) {
    showToast('您因多次违规，暂不能预约')
    return
  }
  if (!state.form.room || !state.form.date || !state.form.time) {
    return
  }

  if (!validateTime(state.form.date, state.form.time)) {
    showToast('预约时间段已过，请重新选择')
    return
  }
  try {
    const res = await addReservation({
      room: state.form.room,
      date: state.form.date,
      time: state.form.time,
      user_id: userInfo.id,
      type: state.type,
      id: state.id
    })
    if (res.code === -2) {
      state.toast = true
      setTimeout(() => {
        state.toast = false
      }, 1500)
      return
    } else if (res.code) {
      showToast(res.msg)
      return
    }
    router.replace({
      path: '/space/reservation/success',
      query: {
        id: state.id || res.data.id,
        room: encodeURIComponent(state.form.room),
        time: encodeURIComponent(state.form.time)
      }
    })
  } catch (error) {
    showToast('预约失败')
  }
}

const validateTime = (date: string, time: string) => {
  let result = false
  const now = new Date()
  if (date === state.dateList[0]) {
    switch (time) {
      case '09:00-12:00':
        now.getHours() < 12 ? (result = true) : (result = false)
        break
      case '12:00-18:00':
        now.getHours() < 18 ? (result = true) : (result = false)
        break
    }
  } else {
    result = true
  }
  return result
}

const getRoomIsFull = async () => {
  try {
    const res = await isFullReservation({ type: state.type })
    if (res.code) {
      showToast(res.msg)
      return
    }
    state.roomStatus = res.data
  } catch (error) {
    state.roomStatus = {
      '1': false,
      '2': false,
      '3': false
    }
  }
}

const timerOver = () => {
  clearInterval(Number(state.timer))
}

const setTimeoutStatus = async () => {
  try {
    const res = await isReservationByManager({ type: state.type })
    if (res.isRerservation) {
      state.seatStatus = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    } else {
      getSeatStatus()
      state.timer = setInterval(() => {
        getSeatStatus()
      }, 3000)
    }
  } catch (error) {
    state.seatStatus = []
  }
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
        state.seatStatus = []
      }
    })
    .catch(() => {
      state.seatStatus = []
    })
}

const getReservationById = async () => {
  if (!state.id) {
    return
  }
  try {
    const res = await getReservationByIdApi({ id: state.id, type: state.id })
    if (res.code) {
      showToast(res.msg)
      return
    }
    state.form = {
      room: res.data.room,
      date: res.data.date,
      time: res.data.time
    }
  } catch (error) {
    console.log(error)
  }
}

const init = async () => {
  state.id = route.query.id?.toString() || ''
  await getRoomIsFull()
  await getReservationById()
  setTimeoutStatus()
  state.firstLoading = false
}

init()
</script>

<style scoped lang="less">
.container {
  width: 750px;
  background: #ffffff;
  position: relative;
  font-size: 28px;
  min-height: 1449px;
  height: 100vh;
  position: relative;

  .main-container {
    width: 654px;
    height: 1311px;
    margin: -290px auto 0px;

    .reservation-container {
      background: #ffffff;
      box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.15);
      border-radius: 24px;
      box-sizing: border-box;

      .seat-room-container {
        background: #ffffff;
        border-radius: 24px;
        position: relative;
        width: 100%;

        .bg-img {
          padding: 20px 38px 0px 32px;
          width: 584px;
          height: 955px;

          img {
            width: 584px;
          }
        }

        .room-container {
          position: absolute;
          width: 138px;
          height: 628px;
          left: 48px;
          top: 72px;
          font-size: 24px;
          line-height: 36px;

          .room-item {
            display: inline-block;
            margin-bottom: 10px;
            position: relative;
            width: 100%;
            height: 198px;

            .room-icon {
              position: absolute;
              width: 52px;
              top: 35%;
              left: 50%;
              transform: translate(-50%, -50%);
            }

            .room-one,
            .room-two {
              background: #ffffff;
              border-radius: 6px;
              border: 2px solid #2dbe87;
              width: 100%;
              height: 100%;
              transform: skewY(-20deg);
              color: #313836;
            }

            .room-one-full,
            .room-two-full {
              color: #7a8396;
              background: #e5e7ea;
              border: 2px solid #bac0cc;
            }

            .room-one-active,
            .room-two-active {
              background: #2dbe87;
              border: 2px solid #2dbe87;
            }

            .room-three {
              position: absolute;
              z-index: 0;
              width: 140px;
              height: 188px;
              line-height: 28px;
              text-align: right;
              padding-right: 10px;
              font-size: 16px;
            }

            .room-three::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              border: 2px solid #2dbe87;
              -webkit-transform: perspective(1em) scale(1.3, 1.1) rotateY(2.2deg);
              z-index: -1;
              -webkit-transform-origin: top left;
              border-radius: 6px;
            }

            .room-three-full::before {
              background: #e5e7ea;
              border: 2px solid #bac0cc;
            }

            .room-three-active::before {
              background: #2dbe87;
              border: 2px solid #2dbe87;
            }

            .room-three-icon {
              position: absolute;
              width: 52px;
              top: 13%;
              left: 50%;
              transform: translateX(-50%);
            }

            .room-name {
              display: inline-block;
              width: 120px;
              position: absolute;
              text-align: center;
              font-size: 24px;
              color: #313836;
              line-height: 36px;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }

            .room-name-active {
              top: 65%;
            }

            .room-name-full {
              top: 50%;
              color: #7a8396;
            }

            .room-three-name {
              top: 40%;
              transform: translateX(-50%);
            }

            .room-three-name-active {
              top: 50%;
            }

            .room-three-name-full {
              top: 40%;
              color: #7a8396;
            }
          }

          .room-item:first-child {
            margin-bottom: -10px;
          }
        }

        .seat-container {
          .seat {
            position: absolute;
            width: 32px;
            height: 32px;
            background: #2dbe87;
            border-radius: 100%;
          }

          .seat-active {
            background: #f3806d;
          }

          .seat-one {
            top: 830px;
            left: 115px;
          }

          .seat-two {
            top: 830px;
            left: 175px;
          }

          .seat-three {
            top: 830px;
            left: 230px;
          }

          .seat-four {
            top: 830px;
            left: 285px;
          }

          .seat-five {
            top: 738px;
            left: 115px;
          }

          .seat-six {
            top: 738px;
            left: 175px;
          }

          .seat-seven {
            top: 738px;
            left: 230px;
          }

          .seat-eight {
            top: 738px;
            left: 285px;
          }

          .seat-nine {
            top: 580px;
            left: 320px;
          }

          .seat-ten {
            top: 615px;
            left: 385px;
          }

          .seat-eleven {
            top: 470px;
            left: 298px;
          }

          .seat-twelve {
            top: 535px;
            left: 368px;
          }

          .seat-thirteen {
            top: 430px;
            left: 320px;
          }

          .seat-fourteen {
            top: 370px;
            left: 315px;
          }

          .seat-fifteen {
            top: 150px;
            left: 368px;
          }

          .seat-sixteen {
            top: 100px;
            left: 395px;
          }
        }
      }

      .tip {
        color: #0f1a30;
        line-height: 40px;
        padding: 24px 0;
        margin: 0 auto;

        .tip-item {
          display: flex;
          margin-right: 32px;

          .square {
            display: inline-block;
            box-sizing: border-box;
            width: 34px;
            height: 34px;
            border-radius: 4px;
            margin: 0px 4px 0 0;
          }

          .reservation {
            background: #ffffff;
            border: 2px solid #2dbe87;
          }

          .no-reservation {
            background: #e5e7ea;
            border: 2px solid #bac0cc;
          }

          .reservating {
            background: #2dbe87;
            display: inline-flex;
            justify-content: center;
            align-items: center;

            img {
              width: 19px;
            }
          }
        }

        .tip-item:last-child {
          margin-right: 0px;
        }
      }

      .reservation-info {
        width: 654px;
        height: 122px;
        background: #f5fbff;
        border-radius: 0px 0px 24px 24px;
        padding-top: 16px;
        display: flex;
        justify-content: center;
        box-sizing: border-box;
        line-height: 44px;

        .reservation-info-item {
          flex: 1;
          text-align: center;

          .table-title {
            color: #7a8396;
          }

          .table-content {
            font-weight: 600;
            color: #0f1a30;
          }
        }
      }
    }

    .reservation-tip {
      text-align: center;
      margin-top: 48px;
      color: #bac0cc;
      line-height: 55px;
    }

    .confirm-btn {
      margin: 32px auto;
      width: 508px;
      height: 80px;
      background: #164392;
      box-shadow: 0rpx 10px 20px 0px rgba(28, 50, 122, 0.15);
      border-radius: 40px;
      line-height: 80px;
      text-align: center;
      font-size: 32px;
      color: #ffffff;
    }

    .disabled {
      margin-top: 52px;
      background: #7a8396;
    }
  }

  .flex-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .mask {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 10;
    width: 750px;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
  }

  .model {
    position: fixed;
    bottom: 0;
    z-index: 11;
    width: 750px;
    height: 954px;
    background: #ffffff;
    box-shadow: 0px -16px 32px 0px rgba(28, 50, 122, 0.15);
    border-radius: 24px 24px 0px 0px;
    box-sizing: border-box;
    padding: 46px 68px 0;

    .model-title {
      font-weight: 600;
      color: #313836;
      line-height: 44px;
    }

    .sub-title {
      color: #7a8396;
      line-height: 40px;
      margin-top: 48px;
    }

    .date-container {
      position: relative;

      .date {
        margin: 44px -30px 0 0;

        .date-item {
          flex: 1;
          text-align: center;
          margin-right: 30px;
          line-height: 66px;
          background: #f8f9fb;
          border-radius: 12px;
          color: #0f1a30;
        }

        .date-item-choose {
          font-weight: 600;
          color: #ffffff;
          background: #2dbe87;
        }
      }

      .top-tip {
        position: absolute;
        left: 10px;
        top: 56px;
        font-size: 20px;
        color: #bac0cc;
        line-height: 28px;
      }
    }

    .time-container {
      .time {
        margin: 16px -58px 0 0;

        .time-item {
          flex: 1;
          flex-direction: column;
          height: 180px;
          background: #f8f9fb;
          border-radius: 12px;
          margin-right: 58px;
          line-height: 44px;

          .time-tip {
            font-size: 28px;
            font-weight: 600;
            color: #bac0cc;
            line-height: 44px;
            margin-bottom: 14px;
          }

          .choose-time-icon {
            width: 52px;
            margin-bottom: 10px;
          }

          .time-type {
            font-weight: 600;
            color: #313836;
          }

          .time-range {
            color: #0f1a30;
          }
        }

        .time-item-disable {
          background: #e5e7ea;

          .time-type,
          .time-range {
            color: #bac0cc;
          }
        }

        .time-item-choose {
          background: #2dbe87;

          .time-type,
          .time-range {
            color: #fff;
          }
        }
      }
    }

    .btn-container {
      margin: 60px -56px 0 0;

      .btn {
        width: 278px;
        height: 80px;
        border-radius: 40px;
        margin-right: 56px;
        line-height: 80px;
        text-align: center;
        font-size: 32px;
      }

      .close {
        color: #164392;
        background: #ffffff;
        border: 2px solid #164392;
      }

      .confirm {
        color: #fff;
        background: #164392;
      }
    }
  }

  .toast {
    position: absolute;
    top: 234px;
    left: 50%;
    transform: translateX(-50%);
    width: 520px;
    height: 300px;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.15);
    border-radius: 24px;
    border: 2px solid #f8f9fb;
    color: #ffffff;
    z-index: 11;
    font-weight: 600;
    text-align: center;

    .toast-title {
      margin: 74px 0 32px;
      font-size: 32px;
      line-height: 48px;
    }
    .toast-content {
      line-height: 44px;
    }
  }
}
</style>
