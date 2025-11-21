<template>
  <div>
    <!-- slots.header({title}) -->
    <slot name="header" :title="title"></slot>
    <!-- slots.default() -->
    <slot>默认内容</slot>
    <!-- slots.footer() -->
    <slot name="footer"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, useSlots } from 'vue'
const title = ref('hello world')
const slots = useSlots()
console.log('%c 🥖 slots', 'font-size:16px;color:#93c0a4', slots)
</script>

<style scoped lang=""></style>
