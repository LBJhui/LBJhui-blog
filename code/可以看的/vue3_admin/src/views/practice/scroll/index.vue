<template>
  dashboard
  <XScroll>
    <div class="card-list">
      <div class="card">
        <img src="https://picsum.photos/id/30/600/200" alt="" />
      </div>
      <div class="card">
        <img src="https://picsum.photos/id/3/600/200" alt="" />
      </div>
      <div class="card">
        <img src="https://picsum.photos/id/32/600/200" alt="" />
      </div>
      <div class="card">
        <img src="https://picsum.photos/id/33/600/200" alt="" />
      </div>
      <div class="card">
        <img src="https://picsum.photos/id/36/600/200" alt="" />
      </div>
    </div>
  </XScroll>
</template>

<script lang="ts" setup>
import XScroll from '@/components/XScroll/index.vue'
</script>

<style>
.card-list {
  display: flex;
}
</style>
