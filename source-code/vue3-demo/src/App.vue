<template>
  <div>APP.vue</div>
  <!-- ✓ GOOD -->
  <ol v-for="i in 5">
    <li>{{ i }}</li>
  </ol>

  <!-- ✗ BAD -->
  <ol v-for="i in 5">
    <li>item</li>
  </ol>
</template>

<script setup lang="ts"></script>

<style scoped lang=""></style>
