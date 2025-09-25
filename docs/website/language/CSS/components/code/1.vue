<template>
  <svg class="icon" t="1732173154386" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1195" width="200" height="200">
    <path
      class="p"
      d="M18.944 353.92a41.92 41.92 0 0 0 0 59.136c16.32 16.32 42.656 16.32 58.944 0 239.456-240.288 627.68-240.288 867.168 0a41.504 41.504 0 0 0 58.88 0 41.92 41.92 0 0 0 0-59.136c-272-272.928-712.992-272.928-984.992 0z m806.528 131.392c-176.704-177.28-463.168-177.28-639.84 0a41.888 41.888 0 0 0 0 59.104 41.6 41.6 0 0 0 58.912 0 368.256 368.256 0 0 1 522.016 0 41.6 41.6 0 0 0 58.912 0 41.888 41.888 0 0 0 0-59.104z m-148.416 128.928a246.592 246.592 0 0 0-349.504 0 41.92 41.92 0 0 0 0 59.104 41.504 41.504 0 0 0 58.944 0 163.52 163.52 0 0 1 231.68 0 41.504 41.504 0 0 0 58.88 0c16.32-16.32 16.32-42.816 0-59.104z m-86.944 221.92c0-49.472-39.936-89.6-89.248-89.6a89.472 89.472 0 0 0-89.28 89.6c0 49.504 39.968 89.6 89.28 89.6a89.408 89.408 0 0 0 89.28-89.6z"
      fill="#666666"
      p-id="1196"></path>
  </svg>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const paths = document.querySelectorAll('.icon .p')
  paths.forEach((path) => {
    const len = path.getTotalLength() + 1
    path.style.setProperty('--l', len)
  })
})
</script>

<style scoped>
svg {
  margin: 0 auto;
}
.p {
  stroke: red;
  stroke-width: 10px;
  fill: none;
  stroke-dasharray: var(--l);
  stroke-dashoffset: var(--l);
  animation: stroke 2s forwards;
}
@keyframes stroke {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
