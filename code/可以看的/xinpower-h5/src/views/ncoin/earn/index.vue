<template>
  <div class="container" v-if="!state.firstLoading">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>
    <div class="main-container">
      <div class="card">
        <div class="row-one">参与兑换活动,赢取N币</div>
        <div class="row-two">让你拥有不一样的办公体验</div>
        <img src="" alt="icon">
      </div>
      <div class="activity-container">
        <div class="activity-item" v-for="item in state.dataList" :key="item.id">
          <div class="name one-row-text">{{item.name}}</div>
          <div class="num">{{item.num}}N</div>
          <div class="status">
            <div v-if="item.status" class="status-img">
              <img src="" alt="已完成">
            </div>
            <div v-else class="btn">去完成</div>
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

const user = userStore()

const userInfo = reactive({
  ...user.getUserInfo
})
const state = reactive({
  firstLoading: true,
  dataList: [
    {
      id: 1,
      name: '了解中心使用规则',
      num: 20,
      status: 1
    },
    {
      id: 1,
      name: '了解中心使用规则',
      num: 20,
      status: 0
    }
  ]
})

onMounted(() => {
  document.title = 'N币兑换'
})

const getData = () => {
  const user_id = userInfo.id
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
      position: relative;
      background: #ffffff;
      border-radius: 12px;
      width: 100%;
      padding: 40px 0 40px 26px;
      font-size: 32px;
      .row-one {
        padding-left: 20px;
        font-weight: 600;
        color: #0f1a30;
        line-height: 48px;
        margin-bottom: 14px;
      }
      .row-tow {
        color: #7a8396;
        line-height: 44px;
        margin-bottom: 0;
      }
      img {
        width: 234px;
        position: absolute;
        right: 0;
        top: -28px;
      }
    }

    .activity-container {
      width: 100%;
      height: 1106px;
      margin-top: 32px;
      background: #ffffff;
      border-radius: 12px;
      padding: 0 20px;
      overflow-y: auto;
      .activity-item {
        padding: 24px 0;
        border-bottom: 2px solid #e5e7ea;
        position: relative;

        .name {
          width: 356px;
          font-size: 32px;
          color: #313836;
          line-height: 48px;
          margin-bottom: 4px;
        }
        .num {
          font-size: 28px;
          color: #7a8396;
          line-height: 44px;
        }
        .status {
          .status-img {
            position: absolute;
            top: 16px;
            right: 38px;
            img {
              width: 114px;
            }
          }
          .btn {
            position: absolute;
            top: 36px;
            right: 22px;
            width: 150px;
            background: #f8f9fb;
            border-radius: 36px;
            color: @topicColor;
            font-size: 32px;
            font-weight: 600;
            line-height: 72px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
