<template>
  <div class="container" v-if="!state.firstLoading">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>

    <div class="main-container">
      <div class="tab">
        <div class="tab-item" :class="state.tabName === 'teaCode' ? 'active' : 'border-top-left-radius'"
          @click="changeTab('teaCode')">
          茶码兑换
        </div>
        <div class="tab-item" :class="state.tabName === 'record' ? 'active' : 'border-top-right-radius'"
          @click="changeTab('record')">
          消费记录
        </div>
      </div>
      <div class="tab-content"
        :class="state.tabName === 'teaCode' ? 'border-top-right-radius' : 'border-top-left-radius'">
        <div v-if="state.tabName === 'teaCode'">
          <div class="top-title">
            <div class="user-surplus">N币余额:{{ Ncoin }}N</div>
            <div class="teaCode-ruler" @click="state.showDialog = true">
              使用规则
              <van-icon name="arrow" color="#164392" class="teaCode-ruler-icon" />
            </div>
          </div>
          <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh" class="scroll-container">
            <van-list v-model:loading="state.loading" :finished="true">
              <div v-for="(item, index) in state.couponList" :key="`${index}-${item.id}`">
                <div class="coupon" :class="
                    item.couponName === '精品咖啡兑换券'
                      ? 'coffee-coupon'
                      : item.couponName === '休闲零食兑换券'
                      ? 'snack-coupon'
                      : item.couponName === '精美礼品兑换券'
                      ? 'gift-coupon'
                      : ''
                  ">
                  <div class="coupon-info">
                    <div class="coupon-name">
                      {{ item.couponName }}
                    </div>
                    <div class="coupon-time">
                      {{ item.expiration }}
                    </div>
                    <div class="coupon-price">售价：{{ item.price }}N</div>
                  </div>
                  <div class="coupon-btn" v-if="item.status === 1 && item.isUsing === 0" @click="goToUse(item)">
                    去使用
                  </div>
                  <div class="coupon-btn" v-if="item.status === 1 && item.isUsing === 1">制作中...</div>
                  <div class="coupon-btn not-have-coupon" v-if="item.status === 0" @click="exchangeCouponUser(item)">
                    兑换
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
        <div v-if="state.tabName === 'record'">
          <div class="top-title">
            <div class="record-user-surplus">N币余额:{{ Ncoin }}N</div>
          </div>
          <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh" class="scroll-container">
            <van-list v-model:loading="state.loading" :finished="state.finished" @load="getRecordList">
              <div v-if="state.recordList.length === 0 && !state.loading" class="empty-container">
                <img
                  src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1646373291907-0.7799646303711183-empty.png" />
                暂无记录
              </div>
              <div v-else>
                <div class="coupon-list-container" v-for="item in state.recordList" :key="item.id">
                  <div class="coupon" :class="{
                      'coffee-coupon-used': item.couponName === '精品咖啡兑换券' && item.status === 2,
                      'snack-coupon-used': item.couponName === '休闲零食兑换券' && item.status === 2,
                      'gift-coupon-used': item.couponName === '精美礼品兑换券' && item.status === 2,
                      'coffee-coupon-invalue': item.couponName === '精品咖啡兑换券' && item.status === 3,
                      'snack-coupon-invalue': item.couponName === '休闲零食兑换券' && item.status === 3,
                      'gift-coupon-invalue': item.couponName === '精美礼品兑换券' && item.status === 3
                    }">
                    <div class="coupon-info">
                      <div class="coupon-name">
                        {{ item.couponName }}
                      </div>
                      <div class="coupon-time">
                        {{ item.expiration }}
                      </div>
                      <div class="coupon-price" :class="item.status === 3 ? 'used-coupon-price' : ''">
                        售价：{{ item.price }}N
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </div>
    </div>

    <div class="space-bottom-logo">
      <img src="@/assets/img/space/logo-bottom.png" />
    </div>
  </div>

  <div class="loading-container" v-else></div>

  <Dialog v-if="state.showDialog" :type="state.dialog.type" :message="state.dialog.message" :title="state.dialog.title"
    :confirmButtonText="state.dialog.confirmButtonText" @confirmCallback="confirmCallback"
    @cancelCallback="cancelCallback">
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { userStore } from '@/store/user'
import { getCouponList, getCouponUserList, addCouponUser, notifyCount, notified } from '@/api/space/coupon'
import { CouponList, CouponEnu } from '@/template/index'
import Dialog from '@/components/Dialog/index.vue'
import { showToast } from '@/utils'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const user = userStore()
const router = useRouter()
const userInfo = reactive({
  ...user.getUserInfo
})
const { Ncoin } = storeToRefs(user)

const state = reactive({
  firstLoading: true,
  couponEnu: [] as CouponEnu[],
  couponList: [] as CouponList[],
  recordList: [] as CouponList[],
  type: 'space',
  tabName: 'teaCode',
  showDialog: false,
  dialog: {
    type: '',
    title: '茶码',
    message:
      '“茶码”为πspace消费一码通,通过N币生成(每50N币生成1个码),可兑换咖啡、零食、礼品。将二维码对准相关设备的感应屏幕,扫描即可使用;\n每码的有效期为兑换后的2小时内,逾期未使用的,N币将返还原账户。',
    confirmButtonText: '我知道了'
  },
  loading: false,
  refreshing: false,
  finished: false,
  id: '', // 要兑换的茶码id
  price: 0,
  pageInfo: {
    size: 6,
    pageNum: 1
  }
})

onMounted(() => {
  document.title = '茶码兑换'
})

const changeTab = (tabName: string) => {
  state.tabName = tabName
  if (tabName === 'record') {
    initRecordList()
  }
}

const goToUse = (item: CouponList) => {
  router.push({
    path: '/space/teaCode/code',
    query: { id: item.id }
  })
}

const exchangeCouponUser = (item: CouponList) => {
  if (item.status) {
    return
  }
  state.id = item.id
  state.price = item.price
  state.dialog = {
    type: 'confirm',
    title: '',
    message: `确定兑换${item.couponName}吗?`,
    confirmButtonText: '确定'
  }
  state.showDialog = true
}

const confirmCallback = async () => {
  if (state.dialog.type === 'confirm') {
    try {
      const res = await addCouponUser({
        user_id: userInfo.id,
        coupon_id: state.id,
        type: state.type
      })
      if (res.code) {
        showToast(res.msg)
        return
      }
      showToast('兑换成功')
      const userInfoLocal = localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo') || '')
      userInfoLocal.Ncoin -= state.price
      localStorage.setItem('userInfo', JSON.stringify(userInfoLocal))
      user.spend(state.price)
      getCouponListByUser()
    } catch (error) {
      showToast('兑换失败')
    }
  }
  state.showDialog = false
  state.dialog = {
    type: '',
    title: '茶码',
    message:
      '“茶码”为πspace消费一码通,通过N币生成(每50N币生成1个码),可兑换咖啡、零食、礼品。将二维码对准相关设备的感应屏幕,扫描即可使用;\n每码的有效期为兑换后的2小时内,逾期未使用的,N币将返还原账户。',
    confirmButtonText: '我知道了'
  }
}

const cancelCallback = () => {
  state.showDialog = false
  state.dialog = {
    type: '',
    title: '茶码',
    message:
      '“茶码”为πspace消费一码通,通过N币生成(每50N币生成1个码),可兑换咖啡、零食、礼品。将二维码对准相关设备的感应屏幕,扫描即可使用;\n每码的有效期为兑换后的2小时内,逾期未使用的,N币将返还原账户。',
    confirmButtonText: '我知道了'
  }
}

const onRefresh = () => {
  // 清空列表数据
  state.finished = false
  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  state.tabName === 'teaCode' ? getCouponListByUser() : initRecordList()
}

const getCouponEnu = async () => {
  try {
    const res = await getCouponList({ type: state.type })
    if (!res.code) {
      res.data.length &&
        res.data.forEach((item: any) => {
          state.couponEnu.push({
            id: item.id,
            couponName: item.coupon_name,
            expiration: item.expiration,
            price: item.price
          })
        })
    }
  } catch (error) {
    showToast('网络异常')
  }
}

const getCouponListByUser = async () => {
  state.loading = true
  state.couponList = []
  // 可兑换券的数量
  let enuNum = 0
  if (Ncoin.value >= 50) {
    enuNum = Math.floor(Ncoin.value / 50)
  }
  try {
    const res = await getCouponUserList({
      user_id: userInfo.id,
      status: 1,
      type: state.type
    })
    if (res.code) {
      showToast(res.msg)
      return
    }
    const data = [] as CouponList[]
    res.data.length &&
      res.data.forEach((item: any) => {
        const expiration = `有效时间:${dayjs(item.c_time).format('HH:mm')}-${dayjs(item.c_time)
          .add(2, 'hours')
          .format('HH:mm')}`
        data.push({
          id: item.id,
          status: item.status,
          couponName: item.coupon.coupon_name,
          price: item.coupon.price,
          expiration: expiration,
          isUsing: item.is_using
        })
      })
    for (let i = 0; i <= enuNum - 1; i++) {
      data.push({
        id: state.couponEnu[i % state.couponEnu.length].id,
        status: 0,
        couponName: state.couponEnu[i % state.couponEnu.length].couponName,
        price: state.couponEnu[i % state.couponEnu.length].price,
        expiration: `有效使用时间:${state.couponEnu[i % state.couponEnu.length].expiration}`,
        isUsing: 0
      })
    }
    state.couponList = data
    state.loading = false
    state.refreshing = false
  } catch (error) {
    showToast('网络错误')
    state.refreshing = false
    state.loading = false
  }
}

const initRecordList = () => {
  state.recordList = []
  state.pageInfo.pageNum = 1
  state.finished = false
}

const getRecordList = async () => {
  state.loading = true
  try {
    const res = await getCouponUserList({
      user_id: userInfo.id,
      status: 2,
      type: state.type,
      size: state.pageInfo.size,
      num: state.pageInfo.pageNum
    })
    if (res.code) {
      showToast(res.msg)
      return
    }
    res.data.length &&
      res.data.forEach((item: any) => {
        let expiration = ''
        item.status === 2
          ? (expiration = `使用时间:${dayjs(item.u_time).format('YYYY-MM-DD HH:mm')}`)
          : (expiration = `失效时间:${dayjs(item.u_time).format('YYYY-MM-DD HH:mm')}`)
        state.recordList.push({
          id: item.id,
          status: item.status,
          couponName: item.coupon.coupon_name,
          price: item.coupon.price,
          expiration: expiration,
          isUsing: item.is_using
        })
      })
    res.page.total <= state.recordList.length ? (state.finished = true) : (state.finished = false)
    state.pageInfo.pageNum++
    state.loading = false
    state.refreshing = false
  } catch (error) {
    showToast('网络错误')
    state.finished = true
    state.refreshing = false
    state.loading = false
  }
}

const notify = async () => {
  try {
    const count = await notifyCount({ type: state.type })
    if (count.count) {
      showToast('您有兑换券已失效,N币已返还')
      try {
        await notified({ type: state.type })
      } catch (error) {
        console.log()
      }
    }
  } catch (error) {
    console.log()
  }
}

const init = async () => {
  await getCouponEnu()
  await getCouponListByUser()
  state.firstLoading = false
  notify()
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
      height: 74rpx;

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
      padding: 0 20px;

      .top-title {
        font-size: 24px;
        line-height: 78px;

        .user-surplus {
          display: inline-block;
          color: #313836;
        }

        .teaCode-ruler {
          display: inline-block;
          float: right;
          color: #164392;

          .teaCode-ruler-icon {
            vertical-align: middle;
            margin-left: -10px;
          }
        }

        .record-user-surplus {
          padding-right: 20px;
          text-align: right;
          color: #313836;
        }
      }

      .scroll-container {
        overflow-y: auto;
        height: 1035px;

        .empty-container {
          width: 226px;
          margin: 198px auto;
          text-align: center;
          font-size: 28px;
          color: #7a8396;
          line-height: 42px;

          img {
            width: 226px;
            margin-bottom: 24px;
          }
        }

        .coupon {
          width: 614px;
          height: 166px;
          position: relative;
          margin-bottom: 28px;

          .coupon-info {
            margin-left: 190px;
            padding-top: 16px;

            .coupon-name {
              font-size: 32px;
              font-weight: 600;
              color: #313836;
              line-height: 48px;
            }

            .coupon-time {
              font-size: 20px;
              color: #bac0cc;
              line-height: 30px;
              margin-bottom: 12px;
            }

            .coupon-price {
              font-size: 28px;
              font-weight: 600;
              color: #535b6a;
              line-height: 44px;
            }

            .used-coupon-price {
              color: #bac0cc;
            }
          }

          .coupon-btn {
            position: absolute;
            width: 136px;
            height: 48px;
            background: #164392;
            border-radius: 24px;
            top: 104px;
            right: 24px;
            font-size: 28px;
            color: #ffffff;
            line-height: 48px;
            text-align: center;
          }

          .not-have-coupon {
            background: #f3bb1b;
          }
        }

        .coffee-coupon {
          background: url(https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1646374895678-0.4257168004073355-coffee.png);
          background-size: 100% 100%;
        }

        .coffee-coupon-invalue {
          background-image: url(https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1646375381154-0.9064880971032592-coffee-invalue.png);
          background-size: 100% 100%;
        }

        .coffee-coupon-used {
          background-image: url(https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1646378499484-0.056371904093091896-coffee-used.png);
          background-size: 100% 100%;
        }

        .snack-coupon {
          background: url(https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1646374755040-0.8692411656454764-snack.png);
          background-size: 100% 100%;
        }

        .snack-coupon-invalue {
          background-image: url(https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1646375454820-0.39726795651801683-snack-invalue.png);
          background-size: 100% 100%;
        }

        .snack-coupon-used {
          background-image: url(https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1646378564507-0.7812088554509684-snack-used.png);
          background-size: 100% 100%;
        }

        .gift-coupon {
          background-image: url(https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1646374929392-0.8685748890262222-gift.png);
          background-size: 100% 100%;
        }

        .gift-coupon-invalue {
          background-image: url(https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1646375409818-0.3107563743679733-gift-invalue.png);
          background-size: 100% 100%;
        }

        .gift-coupon-used {
          background-image: url(https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1646378543333-0.5327702071937301-gift-used.png);
          background-size: 100% 100%;
        }
      }
    }
  }
}
</style>
