<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 0 !important;
}

body {
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 400;
}

#app {
  overflow-x: hidden;
  max-width: 750px;
  margin: 0 auto;
}
</style>
