<template>
  <div id="app">
    <l-star :size="state.size" :num="state.starNum" @getStarNum="getStarNum"></l-star>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
const state = reactive({
  size: 30,
  starNum: 3,
})

const getStarNum = (number: number) => {
  state.starNum = number
  console.log(state.starNum)
}
</script>

<style scoped lang="scss"></style>
