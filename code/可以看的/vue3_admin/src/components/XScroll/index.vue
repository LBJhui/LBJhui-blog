<template>
  <!-- 鼠标滚轮实现横向滚动 -->
  <div v-size="handler" class="scroll-container">
    <div class="scroll">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import vSize from '@/directs/sizeDirect'
const s = reactive({
  w: 0,
  h: 0,
})
const handler = (size: { width: number; height: number }) => {
  s.w = size.width
  s.h = size.height
}
</script>

<style scoped lang="scss">
.scroll-container {
  outline: 4px solid red;
  width: 100%;
  height: 100%;
  .scroll {
    width: calc(v-bind('s.h') * 1px);
    height: calc(v-bind('s.w') * 1px);
    outline: 4px solid blue;
    position: relative;
    overflow: auto;
    transform-origin: 0 0;
    transform: translateY(calc(v-bind('s.h') * 1px)) rotate(-90deg);

    .content {
      height: calc(v-bind('s.h') * 1px);
      position: absolute;
      left: 100%;
      transform-origin: 0 0;
      transform: rotate(90deg);
    }
  }
}
</style>
