<template>
  <div class="container" v-if="!state.firstLoading">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>
    <div>
      123
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

const user = userStore()

const userInfo = reactive({
  ...user.getUserInfo
})
const state = reactive({
  firstLoading: true
})

onMounted(() => {
  document.title = ''
  state.firstLoading = false
})
</script>

<style scoped lang="less">
.container {
  width: 750px;
  background: #ffffff;
}
</style>
