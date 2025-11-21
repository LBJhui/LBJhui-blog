<template>
  <div class="child2">
    <h1>同时绑定多个v-model</h1>
    <button @click="handler1">pageNo{{ pageNo }}</button>
    <button @click="handler2"> pageSize{{ pageSize }} </button>
  </div>
</template>

<script setup lang="ts">
// 显示接收
// let props = defineProps(["pageNo", "pageSize"]);
// let $emit = defineEmits(["update:pageNo", "update:pageSize"]);
//第一个按钮的事件回调
const handler1 = () => {
  // $emit("update:pageNo", props.pageNo + 3);
  pageNo.value += 3
}

const handler2 = () => {
  // $emit("update:pageSize", props.pageSize + 3);
  pageSize.value += 4
  console.log('%c 🍭 pageSize.value', 'font-size:16px;color:#ea7e5c', pageSize.value)
}

// defineModel 语法糖
const pageNo = defineModel('pageNo', { type: Number, default: 1 })
const pageSize = defineModel('pageSize', { type: Number, default: 1 })
</script>

<style scoped>
.child2 {
  width: 300px;
  height: 300px;
  background: hotpink;
}
</style>
