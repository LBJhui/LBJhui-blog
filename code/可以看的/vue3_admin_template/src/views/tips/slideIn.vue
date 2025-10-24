<template>
  <div>
    <div v-for="item in data" :key="item.text" v-slide-in :style="{ background: item.color }">{{ item.text }}</div>
  </div>
</template>

<script lang="ts" setup>
import { vSlideIn } from './directive/slideIn.ts'

const data = [
  { text: '1', color: '#fedfed' },
  { text: '2', color: '#561616' },
  { text: '3', color: '#151650' },
  { text: '4', color: '#d15100' },
  { text: '5', color: '#151530' },
  { text: '6', color: '#4e2661' },
  { text: '7', color: '#545500' },
  { text: '8', color: '#964596' }
]
</script>

<style scoped>
div {
  line-height: 400px;
  margin: 0 auto 20px;
  text-align: center;
  width: 90%;
}
</style>