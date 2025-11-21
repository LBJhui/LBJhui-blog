<template>
  <div>APP.vue {{ count }}</div>
  <el-button type="primary">111</el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<style scoped lang=""></style>
