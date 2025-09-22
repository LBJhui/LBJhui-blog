<template>
  <div class="l-link">111</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps(['type'])
</script>

<style scoped lang="scss">
.l-link {
  color: LUI.$l-primary-color;
}
</style>
