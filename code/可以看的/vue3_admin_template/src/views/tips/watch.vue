<template>
  <div>
    <div>{{ count }}</div>
    <div>
      <button @click="count++">+1</button>
      <button @click="pause">暂停监听</button>
      <button @click="resume">恢复监听</button>
      <button @click="stop">stop 停止</button>
      <button @click="effectScopeStop">effectScope 停止</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, effectScope } from 'vue'
const count = ref(0)
const { stop, resume, pause } = watch(count, () => {
  console.log('触发了 watch')
})
// const stop = watch(count, () => {
//   console.log('触发了 watch')
// })
const scope = effectScope()
scope.run(() => {
  watch(count, () => {
    console.log('触发了 watch scope')
  })
})

const effectScopeStop = () => {
  scope.stop()
}
</script>

<style scoped lang=""></style>
