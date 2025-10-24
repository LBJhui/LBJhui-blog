<template>
  <div class="container" v-if="!state.firstLoading">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>

    <div class="main-container">
      <div class="tab">
        <div class="tab-item" :class="state.tabName === 'spend' ? 'active' : 'border-top-left-radius'"
          @click="changeTab('spend')">
          消费记录
        </div>
        <div class="tab-item" :class="state.tabName === 'reservation' ? 'active' : 'border-top-right-radius'"
          @click="changeTab('reservation')">
          预约记录
        </div>
      </div>
      <div class="tab-content"
        :class="state.tabName === 'spend' ? 'border-top-right-radius' : 'border-top-left-radius'">
        <div v-if="state.tabName === 'spend'">
          <div class="record-title">
            N币余额:{{ Ncoin }}N
          </div>
          <div class="table">
            <div class="thead">
              <div class="date">日期</div>
              <div class="content">内容</div>
              <div class="record">N币记录</div>
            </div>
            <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh" class="spend-scroll-container">
              <van-list v-model:loading="state.loading" :finished="state.finished" @load="getSpendList"
                finished-text="已经到底啦～" :immediate-check="false">
                <div v-for="item in state.spendList" :key="item.id">
                  <div class="tbody">
                    <div class="date">{{ item.date }}</div>
                    <div class="content one-line-text">{{ item.usage }}</div>
                    <div class="record">{{ item.coin }}N</div>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
          </div>
        </div>
        <div v-if="state.tabName === 'reservation'">
          <div v-if="!state.reservationList.length && !state.loading" class="empty-container">
            <img
              src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1646373291907-0.7799646303711183-empty.png" /><br>
            暂无记录
          </div>
          <div v-if="state.reservationList.length && !state.loading">
            <div class="table">
              <div class="thead reservation-thead">
                <div class="date">日期</div>
                <div class="content">预约时间</div>
                <div class="record">预约状态</div>
              </div>
              <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh" class="reservation-scroll-container">
                <van-list v-model:loading="state.loading" :finished="state.finished" @load="getReservationList"
                  finished-text="已经到底啦～" :immediate-check="false">
                  <div v-for="item in state.reservationList" :key="item.id">
                    <div class="tbody">
                      <div class="date">{{ item.date }}</div>
                      <div class="content one-line-text">{{ item.room }}-{{item.time}}</div>
                      <div class="record">{{ item.status }}</div>
                    </div>
                  </div>
                </van-list>
              </van-pull-refresh>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-bottom-logo">
      <img src="@/assets/img/space/logo-bottom.png" />
    </div>
  </div>

  <div class="loading-container" v-else></div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { userStore } from '@/store/user'
import { getSpendList as getSpendListApi, getReservationList as getReservationListApi } from '@/api/space/record'
import { showToast } from '@/utils'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'

const user = userStore()
const route = useRoute()
const userInfo = reactive({ ...user.getUserInfo })
const { Ncoin } = storeToRefs(user)

const state = reactive({
  firstLoading: true,
  spendList: [],
  reservationList: [],
  type: 'space',
  tabName: 'spend',
  loading: false,
  refreshing: false,
  finished: false,
  id: '', // 要兑换的茶码id
  price: 0,
  pageInfo: {
    size: 20,
    pageNum: 1
  }
})

onMounted(() => {
  document.title = '茶码兑换'
})

const changeTab = async (tabName: string) => {
  if (state.tabName === tabName) {
    return
  }
  state.tabName = tabName
  state.tabName === 'spend' ? await initSpendList() : await initRecordList()
}

const onRefresh = () => {
  // 清空列表数据
  state.finished = false

  /*
   * 重新加载数据
   * 将 loading 设置为 true，表示处于加载状态
   */
  state.loading = true
  state.tabName === 'spend' ? initSpendList() : initRecordList()
}

const getReservationList = async () => {
  state.loading = true
  try {
    const res = await getReservationListApi({
      user_id: userInfo.id,
      type: state.type,
      size: state.pageInfo.size,
      num: state.pageInfo.pageNum
    })
    if (res.code) {
      showToast(res.msg)
      state.loading = false
      state.refreshing = false
      return
    }
    res.data.length &&
      res.data.forEach((item) => {
        let status = ''
        if (item.status === 2) {
          status = '已取消'
        } else if (item.is_come && item.status === 1) {
          status = '已使用'
        } else if (!item.is_come && item.status === 1) {
          status = '违规异常'
        }
        state.reservationList.push({
          id: item.id,
          room: item.room,
          date: item.date,
          time: item.time,
          status
        })
      })
    state.reservationList.length >= res.page.total ? (state.finished = true) : (state.finished = false)
    state.loading = false
    state.refreshing = false
  } catch (error) {
    showToast('网络错误,请稍后重试')
    state.finished = true
    state.loading = false
    state.refreshing = false
  }
}

const getSpendList = async () => {
  try {
    const res = await getSpendListApi({
      user_id: userInfo.id,
      type: state.type,
      size: state.pageInfo.size,
      num: state.pageInfo.pageNum
    })
    if (res.code) {
      showToast(res.msg)
      state.loading = false
      state.refreshing = false
      return
    }
    res.data.length &&
      res.data.forEach((item) => {
        let coin = ''
        item.status === 1 ? (coin = '+' + item.coin_num) : (coin = '-' + item.coin_num)
        state.spendList.push({
          id: item.id,
          coin,
          usage: item.usage,
          date: dayjs(item.c_time).format('YYYY-MM-DD')
        })
      })
    state.spendList.length >= res.page.total ? (state.finished = true) : (state.finished = false)
    state.loading = false
    state.refreshing = false
  } catch (error) {
    showToast('网络错误,请稍后重试')
    state.finished = true
    state.loading = false
    state.refreshing = false
  }
}

const initSpendList = () => {
  state.spendList = []
  state.pageInfo.pageNum = 1
  state.finished = false
  getSpendList()
}

const initRecordList = () => {
  state.reservationList = []
  state.pageInfo.pageNum = 1
  state.finished = false
  getReservationList()
}

const init = async () => {
  state.tabName = (route.query.tabName || 'spend').toString()
  state.tabName === 'spend' ? await getSpendList() : await getReservationList()
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
    position: relative;
    margin: -270px auto 0;
    width: 654px;
    height: 1212px;
    box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.15);
    border-radius: 24px;
    box-sizing: border-box;
    background-color: rgb(229, 231, 236);
    .tab {
      display: flex;
      height: 74px;
      .tab-item {
        flex: 1;
        text-align: center;
        font-size: 28px;
        color: #535b6a;
        line-height: 74px;
        background-color: rgb(229, 231, 236);
      }
      .active {
        line-height: 94px;
        margin-top: -20px;
        border-radius: 24px 24px 0 0;
        background-color: #fff;
        font-size: 32px;
        font-weight: 600;
        color: #164392;
      }
      .border-top-left-radius {
        border-top-left-radius: 24px;
      }
      .border-top-right-radius {
        border-top-right-radius: 24px;
      }
    }
    .tab-content {
      border-bottom-left-radius: 24px;
      border-bottom-right-radius: 24px;
      height: 1138px;
      background: #ffffff;
      padding: 26px 20px 0;
      .record-title {
        text-align: center;
        font-weight: 600;
        margin-bottom: 26px;
        font-size: 28px;
        color: #313836;
        line-height: 44px;
      }
      .table {
        .thead {
          display: flex;
          font-size: 28px;
          color: #7a8396;
          line-height: 44px;
          background: #f8f9fb;
          padding: 0 20px;
          box-sizing: border-box;
        }
        .date {
          width: 175px;
        }
        .content {
          width: 280px;
        }
        .record {
          flex: 1;
          text-align: right;
        }
        .tbody {
          display: flex;
          font-size: 28px;
          color: #0f1a30;
          line-height: 64px;
          padding: 0 20px;
          border-bottom: 2px solid #f8f9fb;
        }
        .spend-scroll-container {
          overflow: auto;
          height: 980px;
        }
        .reservation-scroll-container {
          overflow: auto;
          height: 1050px;
        }
      }
      .empty-container {
        padding-top: 244px;
        text-align: center;
        font-size: 28px;
        color: #7a8396;
        line-height: 42px;
      }
    }
  }
}
</style>
