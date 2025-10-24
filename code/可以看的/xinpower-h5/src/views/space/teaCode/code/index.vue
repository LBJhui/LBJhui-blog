<template>
  <div class="container">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>
    <div class="main-container">
      <div class="title">请扫码使用</div>
      <qrcode-vue :value="state.text" level="H" />
      <div class="btn" @click="goBack">返回，继续兑换</div>
    </div>
    <div class="space-bottom-logo">
      <img src="@/assets/img/space/logo-bottom.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { userStore } from '@/store/user'
import { useRoute, useRouter } from 'vue-router'

import QrcodeVue from 'qrcode.vue'

const user = userStore()
const route = useRoute()
const router = useRouter()

const userInfo = reactive({
  ...user.getUserInfo
})
const state = reactive({
  text: '123'
})

onMounted(() => {
  document.title = '茶码兑换'
  state.text = `type=2&user_id=${userInfo.id}&coupon_id=${route.query.id}`
})

const goBack = () => {
  router.back()
}
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
    margin: -248px auto 0;
    width: 654px;
    height: 1090px;
    background: #ffffff;
    box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.2);
    border-radius: 24px;
    text-align: center;
    padding-top: 80px;

    .title {
      font-size: 36px;
      font-weight: 600;
      color: #313836;
      line-height: 56px;
      margin-bottom: 38px;
    }

    canvas {
      width: 444px !important;
      height: 444px !important;
    }

    .btn {
      width: 508px;
      background: #f3bb1b;
      box-shadow: 0px 10px 20px 0px rgba(28, 50, 122, 0.15);
      border-radius: 40px;
      font-size: 32px;
      color: #ffffff;
      line-height: 80px;
      margin: 316px auto 0;
    }
  }
}
</style>
