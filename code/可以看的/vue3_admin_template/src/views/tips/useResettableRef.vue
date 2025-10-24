<template>
  <div>{{ state.a }}</div>
  <div>{{ state.b }}</div>
  <div>{{ state.c }}</div>
  <el-button type="primary" @click="state.a++">a++</el-button>
  <el-button type="primary" @click="state.b++">b++</el-button>
  <el-button type="primary" @click="state.c.push(1)">push c</el-button>
  <el-button @click="reset">重置</el-button>
  <div>{{ obj.a }}</div>
  <div>{{ obj.b }}</div>
  <div>{{ obj.c }}</div>
  <el-button type="primary" @click="obj.a++">a++</el-button>
  <el-button type="primary" @click="obj.b++">b++</el-button>
  <el-button type="primary" @click="obj.c.push(1)">push c</el-button>
  <el-button @click="resetObj">重置</el-button>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const defaultClone = (value) => {
  if (value === null || typeof value !== 'object') return value
  return JSON.parse(JSON.stringify(value))
}

const useResettableRefFn = <T,>(value: () => T) => {
  const state = ref(value())

  const reset = () => {
    state.value = value()
  }
  return { state, reset }
}

// 函数重载
// function useResettableReactive<T extends object>(value: T, returnType: 'object', clone = defaultClone): { state: T; reset: () => void }
// function useResettableReactive<T extends object>(value: T, returnType: 'array', clone = defaultClone): [T, () => void]
// function useResettableReactive<T extends object>(value: T, returnType: 'array' | 'object', clone = defaultClone) {
//   const state = reactive(clone(value)) as T

//   const reset = () => {
//     Object.keys(state).forEach((key) => {
//       delete state[key as keyof typeof state]
//     })
//     Object.assign(state, clone(value))
//   }
//   if (returnType === 'object') {
//     return { state, reset }
//   }
//   return [state, reset]
// }

type Resettable<T> = [T, () => void] & { state: T; reset: () => void }

function useResettableReactive<T extends object>(value: T, clone = defaultClone): Resettable<T> {
  const state = reactive(clone(value)) as T

  const reset = () => {
    Object.keys(state).forEach((key) => {
      delete state[key as keyof typeof state]
    })
    Object.assign(state, clone(value))
  }
  return Object.assign([state, reset], { state, reset }) as unknown as Resettable<T>
}

const [obj, resetObj] = useResettableReactive({
  a: 1,
  b: 2,
  c: [1, 2],
})

const { state, reset } = useResettableRefFn(() => {
  return {
    a: 1,
    b: 2,
    c: [1, 2],
  }
})

// const state = ref({
//   a: 1,
//   b: 2,
//   c: [1, 2],
// })

// const reset = () => {
//   state.value = {
//     a: 1,
//     b: 2,
//     c: [1, 2],
//   }
// }
</script>

<style scoped lang=""></style>
