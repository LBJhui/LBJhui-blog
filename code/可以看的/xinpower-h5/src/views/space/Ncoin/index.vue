<template>
  <div class="container">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>
    <div class="main-container">
      <img class="empyt"
        src="https://7869-xinpower-test-0gsbvibfac63aed1-1302801225.tcb.qcloud.la/photos/document/1642735438801-0.7445058210687141-Ncoin.png" />
      快马加鞭开发中～
    </div>

    <div class="space-bottom-logo">
      <img src="@/assets/img/space/logo-bottom.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  document.title = '赚N币'
})
</script>

<style scoped lang="less">
.container {
  width: 750px;
  background-color: #fff;
  min-height: 1449px;
  height: 100vh;
  position: relative;

  .main-container {
    width: 266px;
    font-size: 28px;
    color: #7a8396;
    line-height: 44px;
    text-align: center;
    margin: 298px auto 0;

    .empyt {
      width: 266px;
      margin-bottom: 34px;
    }
  }
}
</style>
