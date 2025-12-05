<template></template>

<script setup lang="ts">
import { ref } from 'vue'

function useEventListener(...args) {
  const target = typeof arg[0] === 'string' ? window : args.shift()
  return watch(
    () => unref(target),
    (element, _, onCleanup) => {
      if (!element) return
      element.addEventListener(...args)
      onCleanup(() => {
        element.removeEventListener(...args)
      })
    },
    {
      immediate: true,
    },
  )
}
</script>

<style scoped lang=""></style>
