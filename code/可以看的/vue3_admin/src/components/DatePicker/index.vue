<template>
  <div v-click-outside class="date-picker-container">
    <input type="text" :value="formatDate" @focus="handleFocus" />
    <div class="panel" v-if="state.isVisible"> content </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, reactive, defineExpose } from 'vue'
import { getYearMonthDay } from '@/utils/index'
import vClickOutside from './directive/vClickOutside.ts'

const state = reactive({
  isVisible: false,
})

const props = defineProps({
  value: {
    type: Date,
    default: new Date(),
  },
})

const formatDate = computed(() => {
  const { year, month, day } = getYearMonthDay(props.value)
  return `${year}-${month}-${day}`
})

const handleFocus = () => {
  state.isVisible = true
}

const handleBlur = () => {
  state.isVisible = false
}

defineExpose({ handleFocus, handleBlur })
</script>

<style lang="scss" scoped>
.date-picker-container {
  margin: 100px auto;
  outline: 1px solid aquamarine;
}
</style>
