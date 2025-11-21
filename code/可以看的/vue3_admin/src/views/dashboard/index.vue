<template>
  <div>
    dashboard
    <l-link type="primary"></l-link>
    <date-picker :value="state.now"></date-picker>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import DatePicker from '@/components/DatePicker/index.vue'

const state = reactive({
  now: new Date(),
})
</script>

<style scoped lang=""></style>
