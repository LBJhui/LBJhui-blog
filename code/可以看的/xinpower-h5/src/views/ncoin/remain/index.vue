<template>
  <div class="container" v-if="!state.firstLoading">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>
    <div class="main-container">
      <div class="card">
        <div class="tip">
          <van-icon name="info-o" /> 兑换说明
        </div>
        <div class="title">可用N币余额</div>
        <div class="number">{{userInfo.Ncoin}} N</div>
        <div class="btn-container">
          <span class="btn earn-btn" @click="goToPage('earn')">赢取N币</span>
          <span class="btn buy-btn" @click="goToPage('buy')">直接购买</span>
        </div>
      </div>
      <div class="record-container">
        <div class="header">
          <span class="title">N币余额变动明细</span>
          <span class="total">全部
            <van-icon name="arrow" class="arrow" />
          </span>
        </div>
        <div class="record-item" v-for="item in state.data" :key="item.id">
          <div class="row-one">
            <span class="usage one-row-text">{{item.usage}}</span>
            <span class="num one-row-text">{{item.num}}</span>
          </div>
          <div class="row-two">
            <span class="time">{{item.time}}</span>
            <span class="remain one-row-text">余额 {{item.remain}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="loading-container" v-else></div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { userStore } from '@/store/user'
import { useRouter } from 'vue-router'

const user = userStore()
const router = useRouter()

const userInfo = reactive({
  ...user.getUserInfo
})
const state = reactive({
  firstLoading: true,
  data: [
    {
      id: '1',
      usage: '直接购买-X光积分兑换',
      remain: '3170',
      num: '+120',
      time: '2022-10-23 12:00:00'
    },
    {
      id: '1',
      usage: '直接购买-X光积分兑换',
      remain: '3170',
      num: '+120',
      time: '2022-10-23 12:00:00'
    },
    {
      id: '1',
      usage: '直接购买-X光积分兑换',
      remain: '3170',
      num: '+120',
      time: '2022-10-23 12:00:00'
    },
    {
      id: '1',
      usage: '直接购买-X光积分兑换',
      remain: '3170',
      num: '+120',
      time: '2022-10-23 12:00:00'
    },
    {
      id: '1',
      usage: '直接购买-X光积分兑换',
      remain: '3170',
      num: '+120',
      time: '2022-10-23 12:00:00'
    }
  ]
})

onMounted(() => {
  document.title = 'N币兑换'
})

const goToPage = (page: string) => {
  router.push(`/ncoin/${page}`)
}

const getData = () => {
  const user_id = userInfo.id
  console.log('%c 🥛 user_id: ', 'font-size:20px;background-color: #465975;color:#fff;', user_id)
}

const init = async () => {
  await getData()
  state.firstLoading = false
}

init()
</script>

<style scoped lang="less">
@import url('@/assets/style/center.less');
.container {
  .main-container {
    width: 702px;
    position: relative;
    margin: -278px auto 0;
    .card {
      width: 100%;
      background: #ffffff;
      border-radius: 12px;
      text-align: center;
      padding: 20px 48px 36px;
      .tip {
        font-size: 24px;
        color: #7a8396;
        line-height: 36px;
      }
      .title {
        margin: 6px 0 38px;
        font-size: 28px;
        color: #313836;
        line-height: 44px;
      }
      .number {
        font-size: 48px;
        font-weight: 600;
        color: @topicColor;
        line-height: 72px;
      }
      .btn-container {
        margin-top: 58px;
      }

      .btn {
        display: inline-block;
        width: 280px;
        border-radius: 40px;
        font-size: 32px;
        line-height: 80px;
      }

      .earn-btn {
        background: #ffffff;
        border: 2px solid #e5e7ec;
        color: #313836;
      }

      .buy-btn {
        background: @topicColor;
        color: #ffffff;
        margin-left: 46px;
      }
    }

    .record-container {
      background: #ffffff;
      width: 100%;
      padding: 0 24px 0 26px;
      margin: 24px auto 0;
      border-radius: 12px;

      .header {
        width: 100%;
        height: 80px;
        background: rgba(216, 216, 216, 0);
        border-bottom: 2px solid #e5e7ea;
        .title {
          font-size: 28px;
          font-weight: 600;
          color: #313836;
          line-height: 80px;
        }
        .total {
          margin-left: 340px;
          font-size: 28px;
          color: #7a8396;
          line-height: 44px;
          .arrow {
            margin-left: 0px !important;
            font-size: 28px;
          }
        }
      }

      .record-item {
        padding: 14px 0;
        span {
          display: inline-block;
        }
        .row-one {
          position: relative;
          font-size: 28px;
          color: #0f1a30;
          line-height: 44px;

          .usage {
            width: 348px;
          }
          .num {
            position: absolute;
            right: 0;
            text-align: right;
            width: 248px;
          }
        }
        .row-two {
          position: relative;
          font-size: 24px;
          color: #7a8396;
          line-height: 36px;
          margin-top: 4px;
          .time {
            width: 288px;
          }
          .remain {
            position: absolute;
            right: 0;
            text-align: right;
            width: 248px;
          }
        }
      }
    }
  }
}
</style>
